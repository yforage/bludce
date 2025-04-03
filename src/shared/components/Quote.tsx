import { memo } from "react";
import CloseQuoteIcon from "@/assets/icons/close-quote.svg?react";
import OpenQuoteIcon from "@/assets/icons/open-quote.svg?react";

interface IQuoteProps {
  text: string;
  author: string;
}

const Quote = memo<IQuoteProps>(({ text, author }) => {
  return (
    <div className="relative px-2 py-8 lg:px-8 lg:py-14 lg:text-center">
      <OpenQuoteIcon className="text-teal absolute top-[5%] left-0 h-auto w-1/12" />
      <CloseQuoteIcon className="text-pink absolute right-0 bottom-1/4 h-auto w-1/12 lg:bottom-[33%]" />
      <div className="font-virilica text-2xl lg:text-4xl">{text}</div>
      <p className="mt-2.5 text-lg lg:text-xl">{author}</p>
    </div>
  );
});

export default Quote;
