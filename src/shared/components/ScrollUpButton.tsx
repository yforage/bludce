import { memo } from "react";
import ArrowUpIcon from "@heroicons/react/24/outline/ArrowUpIcon";
import Button from "./Button";

export const ScrollUpButton = memo(() => {
  const scroll = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <Button onClick={scroll} size="small" className="self-end max-lg:hidden">
      <ArrowUpIcon className={`w-4`} />
      <span className={`ml-2.5`}>Наверх</span>
    </Button>
  );
});
