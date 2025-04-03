import React, { memo, useCallback, useState } from "react";
import { clsx } from "clsx";
import { useAppContext } from "@/context/useAppContext";

interface IImagesPreviewProps {
  images?: string[];
  className?: string;
}

const ImagesPreview = memo<IImagesPreviewProps>(({ images, className }) => {
  const [current, setCurrent] = useState(0);

  const { isMobile } = useAppContext();

  const handleSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      setCurrent(Number(e.currentTarget.value)),
    [],
  );

  return (
    <div
      className={clsx(
        className,
        "flex flex-col space-y-2 lg:space-y-4",
        !images && "animate-pulse",
      )}
    >
      <div className="relative flex overflow-hidden">
        <div className="aspect-square w-full rounded-xl bg-zinc-200" />
        {images?.map((src, index) => {
          const translate =
            (index === current && "translateX(0%)") ||
            (index < current && `translateX(-${(current - index) * 100}%)`) ||
            `translateX(${(index - current) * 100}%)`;
          return (
            <img
              key={index}
              src={src}
              alt=""
              style={{
                transform: translate,
              }}
              className={
                "absolute aspect-square w-full rounded-xl transition-transform duration-300 ease-linear"
              }
            />
          );
        })}
      </div>
      <div className={"max-lg:relative"}>
        <>
          <div className={"flex space-x-2"}>
            {(images || Array.from({ length: 3 })).map((src, index) => (
              <button
                key={index}
                value={index}
                onClick={handleSelect}
                className={clsx(
                  "flex-1 max-lg:h-1.5 max-lg:rounded-sm max-lg:bg-zinc-300",
                  !src && "rounded-xl lg:h-36 lg:bg-zinc-200",
                )}
              >
                {!isMobile && src && (
                  <img
                    src={src}
                    alt=""
                    className={`aspect-square rounded-xl`}
                  />
                )}
              </button>
            ))}
          </div>
          {isMobile && (
            <div
              style={{
                transform: `translateX(calc(${current * 100}% + ${current} * var(--spacing) * 2))`,
              }}
              className={
                "bg-teal pointer-events-none absolute top-0 left-0 z-10 m-0 h-1.5 w-[calc((100%-(var(--spacing)*4))/3)] rounded-sm transition-transform"
              }
            />
          )}
        </>
      </div>
    </div>
  );
});

export default ImagesPreview;
