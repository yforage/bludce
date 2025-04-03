import { forwardRef, memo } from "react";
import { clsx } from "clsx/lite";
import { ERichTextBlocks, ITextBlockProps } from "@/shared/types";
import { renderRichText, RenderRichTextNode } from "@/utils/richText";
import ListIcon from "@/assets/icons/list.svg?react";
import { useOnScreen } from "@/utils";

const renderNode: RenderRichTextNode = {
  [ERichTextBlocks.PARAGRAPH]: (children, id) => (
    <p key={id} className="mb-2 whitespace-pre-wrap">
      {children}
    </p>
  ),
  [ERichTextBlocks.UL_LIST]: (children, id) => (
    <ul key={id} className="my-4 space-y-2 lg:space-y-4">
      {children}
    </ul>
  ),
  [ERichTextBlocks.LIST_ITEM]: (children, id) => (
    <li key={id} className="group flex items-center max-lg:w-11/12">
      <ListIcon className="text-teal group-even:text-pink mr-1 size-8 shrink-0 group-even:-scale-x-100 lg:mr-4 lg:size-10" />
      {children}
    </li>
  ),
  [ERichTextBlocks.SPACE]: (_, id) => (
    <br key={id} className="hidden lg:block" />
  ),
};

const TextBlock = memo(
  forwardRef<HTMLDivElement, ITextBlockProps>(
    ({ title, subtitle, content, image, imagePosition, isSquare }, ref) => {
      const isOnScreen = useOnScreen(
        typeof ref === "function" ? null : ref,
        0.4,
      );

      return (
        <div
          ref={ref}
          className={clsx(
            "transition",
            isOnScreen ? "animate-moveAndAppear" : "opacity-0",
          )}
        >
          <div className="lg:text-center">
            <h1 className="font-virilica py-2 text-3xl lg:py-8 lg:text-4xl">
              {title}
            </h1>
            {subtitle}
          </div>
          <div
            className={clsx(
              "mt-6 flex flex-col items-center justify-between lg:flex-row",
              imagePosition === "right" && "lg:flex-row-reverse",
            )}
          >
            <img
              className={clsx(
                "w-full rounded-2xl lg:w-[45%]",
                isSquare && "aspect-square object-cover",
              )}
              src={image}
              alt={title}
            />
            <div className="w-full whitespace-pre-line max-lg:mt-4 lg:w-[45%]">
              {renderRichText(content, renderNode)}
            </div>
          </div>
        </div>
      );
    },
  ),
);

export default TextBlock;
