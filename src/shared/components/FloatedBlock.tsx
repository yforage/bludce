import { memo } from "react";
import { clsx } from "clsx/lite";
import { Link } from "react-router-dom";
import Button from "@/shared/components/Button";

export interface IFloatedBlockProps {
  className?: string;
  buttonContainerClassName?: string;
  title: string;
  description: string;
  price?: number;
  button: string;
  link: string;
}

export const FloatedBlock: React.FC<IFloatedBlockProps> = memo(
  ({
    className,
    buttonContainerClassName,
    title,
    description,
    button,
    price,
    link,
  }) => (
    <div
      className={clsx(
        className,
        "lg:bg-transparent-gray flex flex-col space-y-2.5 max-lg:h-full lg:z-1 lg:rounded-xl lg:p-5",
      )}
    >
      <p className={"font-virilica text-3xl max-lg:mt-4 lg:text-4xl"}>
        {title}
      </p>
      {price && (
        <span className="font-virilica text-3xl lg:hidden lg:text-4xl">
          {price} ₽
        </span>
      )}
      <p className={"whitespace-pre-wrap max-lg:mt-4 max-lg:basis-[25%]"}>
        {description}
      </p>
      <div
        className={clsx(
          buttonContainerClassName,
          "flex",
          price && "flex-col items-center justify-between lg:flex-row",
        )}
      >
        {price && (
          <span className="font-virilica hidden text-3xl lg:block lg:text-4xl">
            {price} ₽
          </span>
        )}
        <Link to={link} className="block max-lg:w-full">
          <Button size="large" className={"w-full py-4"}>
            {button}
          </Button>
        </Link>
      </div>
    </div>
  ),
);
