import { CSSProperties, forwardRef } from "react";

interface IBackdropProps {
  children: React.ReactNode;
  style: CSSProperties;
}

const Backdrop = forwardRef<HTMLDivElement, IBackdropProps>(
  ({ children, style }, ref) => (
    <div
      ref={ref}
      style={style}
      className={
        "bg-transparent-black fixed bottom-0 left-0 h-[calc(100%-5rem)] w-full transition-opacity duration-200 ease-linear"
      }
    >
      {children}
    </div>
  ),
);

export default Backdrop;
