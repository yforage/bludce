import React, { ButtonHTMLAttributes, memo } from "react";
import { clsx } from "clsx/lite";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size: "small" | "large";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const paddings = {
  small: "py-1 px-2",
  large: "py-2.5 px-5",
};

const Button = memo<IButtonProps>(
  ({ children, className, size, onClick, ...props }) => (
    <button
      {...props}
      onClick={onClick}
      className={clsx(
        paddings[size],
        className,
        "border-teal enabled:active:bg-teal disabled:bg-teal lg:enabled:hover:bg-teal flex items-center justify-center rounded-xl border-2 bg-white transition-colors enabled:active:text-white disabled:text-white lg:enabled:hover:text-white lg:enabled:active:bg-zinc-300",
      )}
    >
      {children}
    </button>
  ),
);

export default Button;
