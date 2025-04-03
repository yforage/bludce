import { gql } from "graphql-request";

export const PRODUCT_FRAGMENT = gql`
  fragment ProductDetails on product {
    id
    name
    price
    slug
    imageUrls
    categorie {
      slug
    }
  }
`;

export const CART_PRODUCT_FRAGMENT = gql`
  fragment CartProductDetails on product {
    id
    name
    price
    imageUrls
    slug
  }
`;
