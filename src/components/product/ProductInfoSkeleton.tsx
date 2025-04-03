import { memo } from "react";

const ProductInfoSkeleton = memo(() => (
  <div className="flex w-full animate-pulse flex-col space-y-4">
    <div className={`flex h-[74%] flex-col items-start space-y-4 py-4`}>
      <div className="order-1 h-14 w-full rounded-md bg-zinc-200" />
      <div className="order-3 w-9/12 grow rounded-md bg-zinc-200 max-lg:h-6 lg:order-2 lg:w-3/5" />
      <div className="order-2 h-14 w-32 rounded-md bg-zinc-200 lg:order-3" />
      <div className={`order-4 flex h-16 w-full space-x-4 lg:h-14`}>
        <div className="basis-28 rounded-xl bg-zinc-200" />
        <div className="grow rounded-xl bg-zinc-200 lg:basis-44" />
      </div>
    </div>
    <div className={`flex grow space-x-12`}>
      <div className={`flex-1 space-y-1 rounded-md bg-zinc-200`} />
      <div className={`flex-1 space-y-1 rounded-md bg-zinc-200`} />
    </div>
  </div>
));

export default ProductInfoSkeleton;
