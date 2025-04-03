import { FieldProps } from "formik";
import React, { memo, useCallback, useMemo, useState } from "react";
import { debounce } from "@/utils";
import { ISearchApiResponse } from "../types";

interface IOption {
  id: string;
  name: string;
}

interface IAddressSearchInputProps extends FieldProps {
  className?: string;
}

const AddressSearchInput = memo<IAddressSearchInputProps>(
  ({ field, form, className }) => {
    const [inputValue, setInputValue] = useState("");
    const [isListOpen, setIsListOpen] = useState(false);
    const [options, setOptions] = useState<IOption[]>([]);

    const handleSearch = useMemo(
      () =>
        debounce(async (value) => {
          const response = await fetch(
            `https://api.maptiler.com/geocoding/${value}.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
          );
          const json: ISearchApiResponse = await response.json();
          setOptions(
            json.features.map(({ id, place_name }) => ({
              id,
              name: place_name,
            })),
          );
        }, 750),
      [],
    );

    const handleOptionSelect = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const value = e.currentTarget.value;
        form.setFieldValue(field.name, value);
        setInputValue(value);
        setIsListOpen(false);
      },
      [field.name, form],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsListOpen(true);
        const value = e.currentTarget.value;
        setInputValue(value);
        if (!value) {
          form.setFieldValue(field.name, value);
          setOptions([]);
        } else {
          handleSearch(value);
        }
      },
      [handleSearch, form, field.name],
    );

    const toggleOptionsList = useCallback(
      () => setIsListOpen((prev) => !prev),
      [],
    );

    const handleBlur = (e: React.FocusEvent) => {
      if (isListOpen && !e.currentTarget.contains(e.relatedTarget)) {
        toggleOptionsList();
      }
    };

    return (
      <div className="relative" onBlur={handleBlur}>
        <input
          {...field}
          className={className}
          value={inputValue}
          onChange={handleInputChange}
          onClick={toggleOptionsList}
        />
        {isListOpen && options.length !== 0 && (
          <div className="absolute z-10 flex max-h-60 w-full flex-col space-y-2 overflow-y-auto rounded-b-xl bg-white drop-shadow-md">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                value={option.name}
                onClick={handleOptionSelect}
                className="hover:bg-transparent-gray px-3 py-3 text-start text-sm transition-colors lg:py-2"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default AddressSearchInput;
