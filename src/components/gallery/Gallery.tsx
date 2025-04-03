import React, { memo, useCallback, useState } from "react";
import { ERoutes } from "@/shared/types";
import { useInterval } from "@/utils";
import { FloatedBlock } from "@/shared/components/FloatedBlock";
import Slides from "@/mocks/gallery.json";
import { useAppContext } from "@/context/useAppContext";

const Gallery = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { isMobile } = useAppContext();

  const resetInterval = useInterval(() => {
    setCurrentSlide((prev) => (prev === Slides.length - 1 ? 0 : prev + 1));
  }, 8000);

  const selectSlide = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setCurrentSlide(Number(e.currentTarget.value));
      resetInterval();
    },
    [resetInterval],
  );

  const { description, title, id, mobileOffset } = Slides[currentSlide];

  return (
    <div className={`relative flex h-[calc(100vh-6rem)] flex-col lg:h-auto`}>
      <div className={`flex flex-col max-lg:shrink-0 max-lg:basis-3/5`}>
        <div
          key={id}
          className={
            "animate-appear aspect-video w-full grow rounded-2xl bg-cover object-cover transition-opacity lg:rounded-sm"
          }
          style={{
            backgroundImage: `url(${new URL(`../../assets/gallery-${id}.jpg`, import.meta.url).href})`,
            objectPosition: isMobile ? mobileOffset : 0,
          }}
        />

        <div className={`relative mt-3 lg:mt-1`}>
          <div className={`flex space-x-2 lg:space-x-4`}>
            {Slides.map(({ id }, index) => (
              <button
                key={id}
                value={index}
                onClick={selectSlide}
                className={`h-1.5 flex-1 rounded-sm bg-zinc-300 lg:h-2`}
              />
            ))}
          </div>
          <div
            style={{
              transform: `translateX(calc(${currentSlide * 100}% + ${currentSlide} * var(--spacing) * ${isMobile ? 2 : 4}))`,
            }}
            className={`bg-teal pointer-events-none absolute top-0 left-0 z-10 m-0 h-1.5 w-[calc((100%-(var(--spacing)*6))/4)] rounded-sm transition-transform lg:h-2 lg:w-[calc((100%-(var(--spacing)*12))/4)]`}
          />
        </div>
      </div>
      <FloatedBlock
        className="max-lg:grow lg:absolute lg:top-1/2 lg:right-8 lg:w-6/12 lg:-translate-y-1/2"
        title={title}
        description={description}
        button="Перейти в каталог"
        link={ERoutes.CATALOG}
      />
    </div>
  );
});

export default Gallery;
