import { gql } from "graphql-request";
import {
  EProductSortings,
  ICartItemApi,
  ICategorieApi,
  IFetchCartContentProps,
  IFetchCartContentResponse,
  IFetchCatalogDataProps,
  IFetchCatalogDataResponse,
  IFetchProductDataProps,
  IFetchProductDataResponse,
  IProductApi,
  TCollection,
} from "@/api/types";
import { client } from "@/api/graphql";
import { CART_PRODUCT_FRAGMENT, PRODUCT_FRAGMENT } from "@/api/fragments";
import { EErrorMessages } from "@/shared/types";

const processEdge = <T>({ node }: { node: T }) => node;

const cartQuery = gql`
  query getCartContent($user_id: UUID!) {
    cartCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          id
          cart_itemCollection {
            edges {
              node {
                id
                qty
                product {
                  ...CartProductDetails
                }
              }
            }
          }
        }
      }
    }
  }

  ${CART_PRODUCT_FRAGMENT}
`;

interface IGetCartContentApi {
  cartCollection: TCollection<{
    id: string;
    cart_itemCollection: TCollection<ICartItemApi>;
  }>;
}

export const fetchCartContent = async ({
  user_id,
}: IFetchCartContentProps): Promise<IFetchCartContentResponse> => {
  const { cartCollection } = await client.request<IGetCartContentApi>(
    cartQuery,
    {
      user_id,
    },
  );

  const cart = cartCollection.edges[0];

  if (!cart || !cart?.node?.id) {
    return {
      id: "",
      content: [],
      totalAmount: 0,
    };
  }

  return {
    id: cart.node.id,
    content: cart.node.cart_itemCollection.edges.map(processEdge),
    totalAmount: cart.node.cart_itemCollection.edges.reduce(
      (acc, curr) => (acc += curr.node.qty),
      0,
    ),
  };
};

const popularItemsQuery = gql`
  query getPopularItems {
    productCollection(orderBy: { totalOrdered: DescNullsLast }, first: 3) {
      edges {
        node {
          ...ProductDetails
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
interface IGetPopularItemsApi {
  productCollection: TCollection<IProductApi>;
}

export const fetchIndexData = async () => {
  const response = await client.request<IGetPopularItemsApi>(popularItemsQuery);

  return {
    popularItems: response.productCollection.edges.map(processEdge),
  };
};

const catalogProductByCategorieQuery = gql`
  query catalogProductByCategorieQuery(
    $categorie: String!
    $priceOrder: OrderByDirection
    $availableOrder: OrderByDirection
  ) {
    categories: categorieCollection {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
    products: categorieCollection(filter: { slug: { eq: $categorie } }) {
      edges {
        node {
          productCollection(
            orderBy: { price: $priceOrder, totalInStock: $availableOrder }
          ) {
            edges {
              node {
                ...ProductDetails
              }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const catalogAllProductsQuery = gql`
  query catalogAllProductsQuery(
    $priceOrder: OrderByDirection
    $availableOrder: OrderByDirection
  ) {
    categories: categorieCollection {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
    products: productCollection(
      orderBy: { price: $priceOrder, totalInStock: $availableOrder }
    ) {
      edges {
        node {
          ...ProductDetails
        }
      }
    }
  }

  ${PRODUCT_FRAGMENT}
`;

interface IGetCatalogDataApi<T> {
  categories: TCollection<ICategorieApi>;
  products: TCollection<T>;
}

const priceOrder: Partial<Record<EProductSortings, string>> = {
  [EProductSortings.PRICE_ASC]: "AscNullsLast",
  [EProductSortings.PRICE_DESC]: "DescNullsLast",
};

const availableOrder: Partial<Record<EProductSortings, string>> = {
  [EProductSortings.AVAILABLE]: "AscNullsLast",
};

export const fetchCatalogData = async ({
  categorie,
  sortBy,
}: IFetchCatalogDataProps): Promise<IFetchCatalogDataResponse> => {
  if (categorie === "all") {
    const response = await client.request<IGetCatalogDataApi<IProductApi>>(
      catalogAllProductsQuery,
      {
        priceOrder: priceOrder?.[sortBy],
        availableOrder: availableOrder?.[sortBy],
      },
    );

    return {
      categories: response.categories.edges.map(processEdge),
      products: response.products.edges.map(processEdge),
    };
  }

  const response = await client.request<IGetCatalogDataApi<ICategorieApi>>(
    catalogProductByCategorieQuery,
    {
      categorie,
      priceOrder: priceOrder?.[sortBy],
      availableOrder: availableOrder?.[sortBy],
    },
  );

  return {
    categories: response.categories.edges.map(processEdge),
    products:
      response.products.edges[0].node.productCollection.edges.map(processEdge),
  };
};

const productDataQuery = gql`
  query getProductData($productSlug: String!) {
    productCollection(filter: { slug: { eq: $productSlug } }) {
      edges {
        node {
          id
          name
          price
          imageUrls
          description
          specs
          rules
          categorie {
            name
          }
          cart_item {
            id
            qty
          }
        }
      }
    }
  }
`;

interface IProductInCartApi extends IProductApi {
  cart_item: Pick<ICartItemApi, "id" | "qty"> | null;
}

interface IGetProductDataApi {
  productCollection: TCollection<IProductInCartApi>;
}

export const fetchProductData = async ({
  productSlug,
}: IFetchProductDataProps): Promise<IFetchProductDataResponse> => {
  const response = await client.request<IGetProductDataApi>(productDataQuery, {
    productSlug,
  });

  const product = response.productCollection.edges.map(processEdge)[0];

  if (!product) {
    throw new Error(EErrorMessages.NOT_FOUND);
  }

  return {
    product,
    cartItemId: product.cart_item?.id,
    cartQty: product.cart_item?.qty,
  };
};

const catalogLinksDataQuery = gql`
  query getCatalogLinks {
    categorieCollection {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

interface IGetCategoriesLinksApi {
  categorieCollection: TCollection<Pick<ICategorieApi, "id" | "name" | "slug">>;
}

export const fetchCategoriesLinks = async () => {
  const response = await client.request<IGetCategoriesLinksApi>(
    catalogLinksDataQuery,
  );

  return {
    categories: response.categorieCollection.edges.map(processEdge),
  };
};
