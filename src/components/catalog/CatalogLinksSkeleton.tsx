import { memo } from "react";

interface ICatalogLinksSkeletonProps {
  amount: number;
}

const CatalogLinksSkeleton = memo<ICatalogLinksSkeletonProps>(({ amount }) =>
  Array.from({ length: amount }).map((_, index) => (
    <div
      key={index}
      className="h-6 w-16 rounded-md bg-zinc-200 lg:h-7 lg:w-24"
    />
  )),
);

export default CatalogLinksSkeleton;
