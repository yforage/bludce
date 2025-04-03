import { memo } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx/lite";

interface IQtySelector {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

const paddings = {
  buttons: {
    sm: "px-1 py-1",
    md: "px-2 py-2",
  },
  span: {
    sm: "px-2 py-1",
    md: "px-3 py-2",
  },
};

const QtySelector = memo<IQtySelector>(
  ({ value, onChange, max, min, className, size = "md", disabled }) => {
    const handleDecrease = () => {
      if (value === min || disabled) return;
      onChange(value - 1);
    };

    const handleIncrease = () => {
      if (value === max || disabled) return;
      onChange(value + 1);
    };

    return (
      <div
        className={clsx(
          className,
          "border-teal flex items-stretch overflow-hidden rounded-xl border-2",
          size === "md" ? "text-xl" : "text-sm",
        )}
      >
        <button
          className={clsx(
            paddings.buttons[size],
            "active:bg-teal lg:enabled:hover:bg-teal transition-colors active:text-white disabled:bg-zinc-300 lg:hover:text-white lg:active:bg-zinc-300",
          )}
          onClick={handleDecrease}
          disabled={disabled}
        >
          <MinusIcon className={"w-4"} />
        </button>
        <span
          className={clsx(
            paddings.span[size],
            "border-teal flex items-center border-x-2",
          )}
        >
          {value}
        </span>
        <button
          className={clsx(
            paddings.buttons[size],
            "active:bg-teal lg:enabled:hover:bg-teal transition-colors active:text-white disabled:bg-zinc-300 lg:hover:text-white lg:active:bg-zinc-300",
          )}
          onClick={handleIncrease}
          disabled={disabled}
        >
          <PlusIcon className={"w-4"} />
        </button>
      </div>
    );
  },
);

export default QtySelector;
