import { memo, useCallback, useMemo, useState } from "react";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import { clsx } from "clsx/lite";

interface IExpandableTextProps {
  text: string;
  maxLength: number;
}

const ExpandableText = memo<IExpandableTextProps>(({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  const sliced = useMemo(() => text.slice(0, maxLength), [text, maxLength]);

  if (text.length < maxLength) return <p>{text}</p>;

  return (
    <div>
      <p>{isExpanded ? text : `${sliced}...`}</p>
      <button
        onClick={toggleExpanded}
        className={"font-virilica flex items-center text-lg"}
      >
        {isExpanded ? "Свернуть" : "Подробнее"}
        <ChevronDownIcon
          className={clsx(
            "ml-2 h-5 transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>
    </div>
  );
});

export default ExpandableText;
