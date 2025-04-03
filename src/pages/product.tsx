import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumbs from "@/shared/components/BreadCrumbs";
import Content from "@/shared/components/Content";
import { fetchIndexData, fetchProductData } from "@/api/requests";
import QtySelector from "@/shared/components/QtySelector";
import Button from "@/shared/components/Button";
import ItemsRow from "@/components/product/ItemsRow";
import ProductInfoSkeleton from "@/components/product/ProductInfoSkeleton";
import { EErrorMessages, ERoutes } from "@/shared/types";
import ImagesPreview from "@/components/product/ImagesPreview";
import { IFetchProductDataProps } from "@/api/types";
import { useAddToCartMutation, useCartItemMutations } from "@/api/mutations";
import ExpandableText from "@/shared/components/ExpandableText";
import { useAppContext } from "@/context/useAppContext";

const INITIAL_CRUMBS = [{ name: "Каталог", link: ERoutes.CATALOG }];

const ProductPage = memo(() => {
  const navigate = useNavigate();

  const { categorieSlug, productSlug } = useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ["productData", { productSlug }],
    queryFn: ({ queryKey }) =>
      fetchProductData(queryKey[1] as IFetchProductDataProps),
    enabled: !!productSlug,
  });

  const popularItems = useQuery({
    queryKey: ["indexData"],
    queryFn: fetchIndexData,
  });

  const [productQty, setProductQty] = useState(1);

  const { isMobile } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productSlug]);

  useEffect(() => {
    if (error?.message === EErrorMessages.NOT_FOUND) {
      navigate(ERoutes.NOT_FOUND, { replace: true });
    }
  }, [error, navigate]);

  const addToCart = useAddToCartMutation();
  const { changeQtyMutation } = useCartItemMutations();

  const handleQtyChange = useCallback(
    (newQty: number) => {
      if (data?.cartQty && data?.cartItemId) {
        changeQtyMutation.mutate({ id: data.cartItemId, count: newQty });
      } else {
        setProductQty(newQty);
      }
    },
    [data],
  );

  const handleAddToCart = useCallback(() => {
    if (!data?.product) return;

    addToCart.mutate({
      productId: data.product.id,
      qty: productQty,
    });
  }, [data, productQty]);

  const crumbs = useMemo(() => {
    if (!data) return INITIAL_CRUMBS;

    return [
      ...INITIAL_CRUMBS,
      {
        name: data.product.categorie.name,
        link: `${ERoutes.CATALOG}/?categorie=${categorieSlug}`,
      },
      { name: data.product.name },
    ];
  }, [data, categorieSlug]);

  return (
    <Content className="space-y-8 pt-6 pb-20">
      <BreadCrumbs crumbs={crumbs} length={3} />
      <div className={"mt-6 flex max-lg:flex-col lg:space-x-4"}>
        <ImagesPreview
          className={"w-full shrink-0 lg:w-2/5"}
          images={data?.product.imageUrls}
        />
        {!isPending && data && (
          <div className={"space-y-4"}>
            <div className={"flex h-[74%] flex-col items-start space-y-4 py-4"}>
              <p className={"font-virilica order-1 text-3xl lg:text-4xl"}>
                {data?.product.name}
              </p>
              <div className={"order-3 grow lg:order-2"}>
                {isMobile && (
                  <ExpandableText
                    text={data.product.description}
                    maxLength={120}
                  />
                )}
                {!isMobile && data.product.description}
              </div>
              <p
                className={
                  "font-virilica order-2 text-3xl lg:order-3 lg:text-4xl"
                }
              >
                {data?.product.price} ₽
              </p>
              <div className="order-4 flex space-x-4 max-lg:h-16 max-lg:w-full">
                <QtySelector
                  value={data?.cartQty ?? productQty}
                  onChange={handleQtyChange}
                  max={50}
                  min={1}
                  disabled={changeQtyMutation.isPending}
                />
                <Button
                  size="large"
                  className="max-lg:grow"
                  onClick={handleAddToCart}
                  disabled={!!data?.cartQty}
                >
                  {data?.cartQty ? "В корзине" : "Добавить в корзину"}
                </Button>
              </div>
            </div>
            <div className={`flex space-x-12`}>
              <div className={`flex-1 space-y-1 whitespace-pre-line`}>
                <p className="mb-2">Характеристики товара:</p>
                {data?.product.specs}
              </div>
              <div className={`flex-1 space-y-1 whitespace-pre-line`}>
                <p className="mb-2">Правила ухода:</p>
                {data?.product.rules}
              </div>
            </div>
          </div>
        )}
        {!data && <ProductInfoSkeleton />}
      </div>
      <ItemsRow
        title="Также Вам может понравится"
        isCentered={false}
        items={popularItems.data?.popularItems}
      />
    </Content>
  );
});

export default ProductPage;
