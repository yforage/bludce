import React, { CSSProperties, forwardRef } from "react";
import { clsx } from "clsx/lite";

interface IContentProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Content = forwardRef<HTMLDivElement, IContentProps>(
  ({ children, className, style }, ref) => (
    <div
      ref={ref}
      className={clsx(
        className,
        "mx-auto w-full px-8 lg:max-w-(--breakpoint-lg) lg:px-0",
      )}
      style={style}
    >
      {children}
    </div>
  ),
);

export default Content;
