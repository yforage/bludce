import { clsx } from "clsx";
import { memo } from "react";

interface IBurgerCloseIconProps {
  isActive: boolean | null;
}

export const BurgerCloseIcon = memo<IBurgerCloseIconProps>(({ isActive }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    width="24"
    height="24"
  >
    <defs>
      <linearGradient
        id="ecEZ3UJwzOd5-fill"
        x1="0.5"
        y1="0"
        x2="0.5"
        y2="1"
        spreadMethod="pad"
        gradientUnits="objectBoundingBox"
        gradientTransform="translate(0 0)"
      >
        <stop
          id="ecEZ3UJwzOd5-fill-0"
          offset="0%"
          stopColor="rgba(255,255,255,0)"
        />
        <stop id="ecEZ3UJwzOd5-fill-1" offset="100%" stopColor="#010022" />
      </linearGradient>
    </defs>
    <path
      key={isActive ? "active" : "inactive"}
      className={clsx(
        isActive && "animate-burger-to-close",
        !isActive && isActive !== null && "animate-close-to-burger",
      )}
      d="M3.75,6.75c0,0,4.291849,0,8.49776,0c4.040782,0,8.00224,0,8.00224,0M3.75,12c0,0,16.5,0,16.5,0M3.75,17.25c0,0,3.856399,0,7.840466,0c4.256891,0,8.659534,0,8.659534,0"
      transform="translate(.150006 0.0865)"
      fill="none"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
