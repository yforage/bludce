import { memo } from "react";

interface IProductCardsSkeletonProps {
  amount: number;
}

const ProductCardsSkeleton = memo<IProductCardsSkeletonProps>(
  ({ amount }) =>
    Array.from({ length: amount }).map((_, index) => (
      <div key={index} className="mt-2.5">
        <div className="aspect-square rounded-xl bg-zinc-200" />
        <div className="mt-2 mb-1 h-6 w-4/6 rounded-md bg-zinc-200" />
        <div className="h-8 w-[20%] rounded-lg bg-zinc-200" />
      </div>
    )),
);

export default ProductCardsSkeleton;
