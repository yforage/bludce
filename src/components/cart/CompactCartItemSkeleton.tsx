import { memo } from "react";

const CartItemSkeleton = memo(() => (
  <div className={"mb-4 flex animate-pulse"}>
    <div className={"aspect-square size-16 rounded-md bg-zinc-200"} />
    <div className={"ml-4 grow flex-col"}>
      <div className={"mb-2 h-14 rounded-md bg-zinc-200"} />
      <div className={"h-8 rounded-md bg-zinc-200"} />
    </div>
  </div>
));

export default CartItemSkeleton;
