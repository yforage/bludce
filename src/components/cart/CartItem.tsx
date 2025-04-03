import { memo } from "react";
import { clsx } from "clsx/lite";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ICartProductApi } from "@/api/types";
import QtySelector from "@/shared/components/QtySelector";

interface ICartItemProps {
  count: number;
  product: ICartProductApi;
  type?: "compact" | "default";
  isPending: boolean;
  id: string;
  onDelete: (id: ICartProductApi["id"]) => void;
  onQtyChange: (count: number, id: string) => void;
}

const CartItem = memo<ICartItemProps>(
  ({
    id,
    count,
    product,
    type = "compact",
    isPending,
    onDelete,
    onQtyChange,
  }) => {
    const handleDelete = () => {
      onDelete(id);
    };

    const handleChangeQty = (count: number) => {
      onQtyChange(count, id);
    };
    return (
      <div
        className={clsx(
          "flex pb-4",
          type === "default" && "w-full",
          isPending && "animate-pulse",
        )}
      >
        <img
          src={product.imageUrls[0]}
          alt=""
          className={clsx(
            "shrink-0",
            type === "compact" ? "size-16 rounded-lg" : "h-28 w-32 rounded-md",
          )}
        />
        <div
          className={clsx(
            "flex grow",
            type === "compact"
              ? "ml-4 flex-col lg:ml-2"
              : "ml-4 max-lg:flex-col lg:mt-4",
          )}
        >
          <div
            className={clsx(
              "flex items-start justify-between",
              type === "default" &&
                "w-full shrink-0 max-lg:flex-col lg:h-full lg:w-[38%]",
            )}
          >
            <span className={clsx(type === "compact" && "pr-4 text-sm")}>
              {product.name}
            </span>
            {type === "default" && (
              <span className={"lg:hidden"}>{product.price} ₽</span>
            )}
            {type === "compact" && (
              <button onClick={handleDelete} disabled={isPending}>
                <TrashIcon className={"w-5"} />
              </button>
            )}
          </div>
          <div
            className={clsx(
              type === "default" &&
                "flex grow items-center justify-between max-lg:mt-4 lg:items-start",
            )}
          >
            <div
              className={clsx(
                "flex justify-between",
                type === "compact" ? "mt-1" : "max-lg:h-full",
              )}
            >
              <QtySelector
                min={1}
                max={99}
                value={count}
                onChange={handleChangeQty}
                size="sm"
                disabled={isPending}
              />
              {type === "compact" && <span>{product.price} ₽</span>}
            </div>
            {type === "default" && (
              <>
                <span className={"hidden lg:block"}>{product.price} ₽</span>
                <button onClick={handleDelete} disabled={isPending}>
                  <TrashIcon className={"w-5"} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default CartItem;
