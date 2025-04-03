export type TCollection<T> = {
  edges: {
    node: T;
  }[];
};

export type TMutationCollection<T> = {
  records: T[];
};

export interface ICartProductApi {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrls: string[];
}

export interface IProductApi extends ICartProductApi {
  description: string;
  categorie: ICategorieApi;
  specs: string;
  rules: string;
}

export interface ICategorieApi {
  id: string;
  name: string;
  productCollection: TCollection<IProductApi>;
  slug: string;
}

export enum EProductSortings {
  AVAILABLE = "available",
  PRICE_ASC = "price-asc",
  PRICE_DESC = "price-desc",
}

export interface ICartItemApi {
  id: string;
  qty: number;
  product: ICartProductApi;
}

export interface IFetchProductDataProps {
  productSlug: IProductApi["slug"];
}

export interface IFetchCatalogDataProps {
  categorie: string;
  sortBy: EProductSortings;
}

export interface IFetchCartContentProps {
  user_id: string;
}

export interface IFetchCartContentResponse {
  id: string;
  content: ICartItemApi[];
  totalAmount: number;
}

export interface IFetchProductDataResponse {
  product: IProductApi;
  cartQty?: number;
  cartItemId?: string;
}

export interface IFetchCatalogDataResponse {
  categories: ICategorieApi[];
  products: IProductApi[];
}
