import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";
import { IProductApi } from "@/api/types";
import { ERoutes } from "@/shared/types";
import Button from "@/shared/components/Button";
import { useAddToCartMutation } from "@/api/mutations";

interface IProductCardProps {
  product: IProductApi;
}

const ProductCard = memo<IProductCardProps>(({ product }) => {
  const addToCart = useAddToCartMutation();

  const handleClickAdd = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const id = e.currentTarget.value;
      addToCart.mutate({ productId: id, qty: 1 });
    },
    [],
  );

  return (
    <div className="flex flex-col max-lg:shrink-0 max-lg:grow-0 max-lg:basis-52 lg:w-full">
      <Link
        className="mb-1 lg:mt-2.5"
        to={`${ERoutes.CATALOG}/${product.categorie.slug}/${product.slug}`}
      >
        <div className="group aspect-square w-full overflow-hidden rounded-xl">
          <img
            className="size-full object-cover transition-transform group-hover:scale-125"
            src={product.imageUrls[0]}
            alt={product.name}
          />
        </div>
        <p className="mt-2">{product.name}</p>
      </Link>
      <Button
        size="small"
        className="self-start"
        onClick={handleClickAdd}
        value={product.id}
      >
        <ShoppingBagIcon className="w-4" />
        <span className="ml-2.5">{product.price} ₽</span>
      </Button>
    </div>
  );
});

export default ProductCard;
