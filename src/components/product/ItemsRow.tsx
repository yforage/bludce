import { memo } from "react";
import { clsx } from "clsx/lite";
import { IProductApi } from "@/api/types";
import ProductCard from "./ProductCard";

interface IItemsRowProps {
  title: string;
  items?: IProductApi[];
  isCentered?: boolean;
}

const ItemsRow = memo<IItemsRowProps>(({ items, title, isCentered = true }) => (
  <div className="flex flex-col">
    <h1
      className={clsx(
        "font-virilica text-3xl lg:text-4xl",
        isCentered && "py-2 lg:py-8 lg:text-center",
      )}
    >
      {title}
    </h1>
    <div className="flex w-full space-x-4 max-lg:overflow-x-auto lg:flex lg:space-x-6">
      {items &&
        items.map((item) => <ProductCard key={item.id} product={item} />)}
    </div>
  </div>
));

export default ItemsRow;
