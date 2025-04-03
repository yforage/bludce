import { memo } from "react";

const CartItemSkeleton = memo(() => (
  <div className={"mb-4 flex"}>
    <div className={"h-28 w-32 rounded-md bg-zinc-200"} />
    <div className={"mt-6 ml-2 grow flex-col"}>
      <div className={"flex justify-between"}>
        <div className={"mb-2 h-4 w-[16%] rounded-md bg-zinc-200"} />
        <div className={"h-8 w-16 rounded-md bg-zinc-200"} />
        <div className={"h-8 w-12 rounded-md bg-zinc-200"} />
        <div className={"h-8 w-6 rounded-md bg-zinc-200"} />
      </div>
    </div>
  </div>
));

export default CartItemSkeleton;
