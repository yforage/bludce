import { useQuery } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { clsx } from "clsx/lite";
import Content from "@/shared/components/Content";
import { fetchCatalogData } from "@/api/requests";
import { EProductSortings, IFetchCatalogDataProps } from "@/api/types";
import SelectionLeft from "@/assets/icons/selection-left.svg?react";
import MenuDropDown from "@/shared/components/MenuDropDown";
import ProductCard from "@/components/product/ProductCard";
import ProductCardsSkeleton from "@/components/product/ProductCardsSkeleton";
import CatalogLinksSkeleton from "@/components/catalog/CatalogLinksSkeleton";

const DropDownOptions = [
  {
    id: EProductSortings.AVAILABLE,
    value: "по наличию",
  },
  {
    id: EProductSortings.PRICE_ASC,
    value: "цена по возрастанию",
  },
  {
    id: EProductSortings.PRICE_DESC,
    value: "цена по убыванию",
  },
];

const CatalogPage = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams({
    categorie: "all",
    sortBy: EProductSortings.AVAILABLE,
  });

  const { isPending, data } = useQuery({
    queryKey: [
      "catalogData",
      {
        categorie: searchParams.get("categorie"),
        sortBy: searchParams.get("sortBy"),
      },
    ],
    queryFn: (props) =>
      fetchCatalogData(props.queryKey[1] as IFetchCatalogDataProps),
  });

  const handleSelectCategorie = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      setSearchParams((prev) => {
        prev.set("categorie", e.currentTarget.value);
        return prev;
      }),
    [],
  );

  const handleSelectSortBy = useCallback(
    (sort: string) =>
      setSearchParams((prev) => {
        prev.set("sortBy", sort);
        return prev;
      }),
    [],
  );

  return (
    <Content className="py-4 lg:py-10">
      <p className={"font-virilica text-3xl lg:hidden"}>Каталог</p>
      <div className={"mb-5 lg:flex lg:items-start lg:justify-between"}>
        <div
          className={clsx(
            "flex w-full space-x-4 overflow-x-auto overflow-y-hidden px-2.5 py-2",
            isPending && "w-2/6",
          )}
        >
          {!isPending &&
            data &&
            [
              {
                id: "all",
                name: "Все позиции",
                slug: "all",
              },
              ...data.categories,
            ].map(({ id, name, slug }) => (
              <button
                className={`relative shrink-0`}
                key={id}
                value={slug}
                onClick={handleSelectCategorie}
              >
                {name}
                {slug === searchParams.get("categorie") && (
                  <SelectionLeft className="text-pink absolute top-[80%] -left-[20%] w-[140%] -translate-y-2/4" />
                )}
              </button>
            ))}
          {isPending && !data && <CatalogLinksSkeleton amount={4} />}
        </div>
        <MenuDropDown
          options={DropDownOptions}
          selected={searchParams.get("sortBy")}
          onSelect={handleSelectSortBy}
        />
      </div>
      <div
        className={clsx(
          "grid grid-cols-2 gap-6 lg:grid-cols-3",
          isPending && "animate-pulse",
        )}
      >
        {!isPending &&
          data?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        {isPending && <ProductCardsSkeleton amount={3} />}
      </div>
    </Content>
  );
});

export default CatalogPage;
