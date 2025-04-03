import React, { memo, useCallback, useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface IOption {
  id: string;
  value: string;
}

interface IMenuDropDownProps {
  options: IOption[];
  selected?: IOption["id"] | null;
  onSelect: (selected: IOption["id"]) => void;
}

const MenuDropDown = memo<IMenuDropDownProps>(
  ({ options, selected, onSelect }) => {
    const [isOpened, setIsOpened] = useState(false);

    const toggleOpened = useCallback(() => setIsOpened((prev) => !prev), []);

    const handleSelect = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onSelect(e.currentTarget.value);
        toggleOpened();
      },
      [toggleOpened, onSelect],
    );

    const handleBlur = (e: React.FocusEvent) => {
      if (isOpened && !e.currentTarget.contains(e.relatedTarget)) {
        toggleOpened();
      }
    };

    const selectedValue = useMemo(
      () => options.find(({ id }) => id === selected)?.value ?? "",
      [options, selected],
    );

    return (
      <div
        className={`relative shrink-0 rounded-t-lg bg-white`}
        onBlur={handleBlur}
      >
        <button
          onClick={toggleOpened}
          className={`relative z-20 flex h-8 shrink-0 items-center px-2.5 lg:px-4`}
        >
          <span>Сортировка по: {selectedValue}</span>
          <ChevronDownIcon
            className={`ml-2 w-4 ${isOpened ? "rotate-180" : ""} transition-transform`}
          />
        </button>
        {isOpened && (
          <>
            <div
              className={`absolute top-full left-0 z-20 flex w-full flex-col items-start rounded-b-lg bg-white pb-2`}
            >
              {options
                .filter(({ id }) => id !== selected)
                .map(({ id, value }) => (
                  <button
                    key={id}
                    value={id}
                    onClick={handleSelect}
                    className={`h-8 w-full px-2.5 text-start lg:px-4`}
                  >
                    {value}
                  </button>
                ))}
            </div>
            <div className="absolute top-0 left-0 z-10 h-[6.5rem] w-full rounded-lg bg-white drop-shadow-md" />
          </>
        )}
      </div>
    );
  },
);

export default MenuDropDown;
