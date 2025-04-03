import { memo } from "react";
import { IProductApi } from "@/api/types";
import { FloatedBlock } from "./FloatedBlock";
import { ERoutes } from "../types";

interface IItemLargePreviewProps extends IProductApi {}

const ItemLargePreview = memo<IItemLargePreviewProps>(
  ({ imageUrls, name, slug, categorie, ...floatedProps }) => {
    return (
      <div className="relative">
        <img
          className={`w-full rounded-2xl object-cover lg:aspect-video lg:rounded-md`}
          src={imageUrls[0]}
          alt="background"
        />
        <FloatedBlock
          {...floatedProps}
          className="lg:absolute lg:top-1/2 lg:right-8 lg:w-6/12 lg:-translate-y-1/2"
          button="Показать в каталоге"
          title={name}
          link={`${ERoutes.CATALOG}/${categorie.slug}/${slug}`}
        />
      </div>
    );
  },
);

export default ItemLargePreview;
