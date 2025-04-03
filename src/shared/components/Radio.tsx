import { memo } from "react";
import RadioCheckedIcon from "@/assets/icons/radio.svg?react";

export interface IRadioOption {
  value: string;
  displayName: string;
}

interface IRadioProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "value">,
    IRadioOption {}

export const Radio = memo<IRadioProps>(({ value, displayName, ...props }) => {
  return (
    <label className="flex items-center">
      <div className="relative mr-2 size-4">
        <input
          {...props}
          type="radio"
          className="peer border-teal h-full w-full appearance-none rounded-full border-2"
          value={value}
        />
        <RadioCheckedIcon className="absolute top-1/2 left-1/2 hidden h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 peer-checked:block" />
      </div>
      <span>{displayName}</span>
    </label>
  );
});
