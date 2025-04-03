import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import {
  ICartItemApi,
  IFetchCartContentProps,
  IFetchCartContentResponse,
  IFetchProductDataProps,
  IFetchProductDataResponse,
  IProductApi,
  TCollection,
  TMutationCollection,
} from "@/api/types";
import { client } from "@/api/graphql";
import { useAppContext } from "@/context/useAppContext";
import { ERoutes } from "@/shared/types";
import { CART_PRODUCT_FRAGMENT } from "./fragments";

const deleteFromCartQuery = gql`
  mutation deleteFromCart($cart_item_id: UUID!) {
    deleteFromcart_itemCollection(filter: { id: { eq: $cart_item_id } }) {
      records {
        id
        qty
        cart {
          user_id
        }
        product {
          slug
        }
      }
    }
  }
`;

const changeCartItemQtyQuery = gql`
  mutation changeCartItemQty($cartItemId: UUID!, $count: Int!) {
    updatecart_itemCollection(
      filter: { id: { eq: $cartItemId } }
      set: { qty: $count }
    ) {
      records {
        id
        qty
        cart {
          user_id
        }
        product {
          slug
        }
      }
    }
  }
`;

interface IChangeCartItemQtyResponse {
  updatecart_itemCollection: TMutationCollection<{
    id: string;
    qty: number;
    cart: {
      user_id: string;
    };
    product: Pick<IProductApi, "slug">;
  }>;
}

interface IDeleteFromCartResponse {
  deleteFromcart_itemCollection: TMutationCollection<{
    id: string;
    qty: number;
    cart: {
      user_id: string;
    };
    product: Pick<IProductApi, "slug">;
  }>;
}

export const useCartItemMutations = (loggedUser?: User | null) => {
  const queryClient = useQueryClient();
  const userFromContext = useAppContext();

  const deleteMutation = useMutation({
    mutationFn: async ({ cart_item_id }: { cart_item_id: string }) => {
      const userData = userFromContext ? userFromContext.user : loggedUser;
      if (!userData) throw new Error("Missing user");

      const cartData = queryClient.getQueryData<IFetchCartContentResponse>([
        "cart",
        { user_id: userData?.id },
      ]);

      if (!cartData?.id) throw new Error("Missing cart data");

      const response = await client.request<IDeleteFromCartResponse>(
        deleteFromCartQuery,
        {
          cart_item_id,
        },
      );
      return response;
    },
    onSuccess: (data) => {
      const item = data.deleteFromcart_itemCollection.records[0];
      queryClient.setQueryData<IFetchCartContentResponse>(
        ["cart", { user_id: item.cart.user_id } as IFetchCartContentProps],
        (oldData) =>
          oldData && {
            ...oldData,
            content: oldData.content.filter(({ id }) => id !== item.id),
            totalAmount: oldData.totalAmount - item.qty,
          },
      );
      queryClient.setQueryData<IFetchProductDataResponse>(
        [
          "productData",
          { productSlug: item.product.slug } as IFetchProductDataProps,
        ],
        (oldData) =>
          oldData && { ...oldData, cartQty: undefined, cartItemId: undefined },
      );
    },
  });

  const changeQtyMutation = useMutation({
    mutationFn: async ({ count, id }: { count: number; id: string }) => {
      const response = await client.request<IChangeCartItemQtyResponse>(
        changeCartItemQtyQuery,
        {
          cartItemId: id,
          count,
        },
      );
      return response;
    },
    onSuccess: (data) => {
      const item = data.updatecart_itemCollection.records[0];
      queryClient.setQueryData<IFetchCartContentResponse>(
        ["cart", { user_id: item.cart.user_id } as IFetchCartContentProps],
        (oldData) => {
          if (oldData) {
            let counter = 0;
            const newContent = oldData.content.map((cartItem) => {
              const newQty = cartItem.id === item.id ? item.qty : cartItem.qty;
              counter += newQty;
              return {
                ...cartItem,
                qty: newQty,
              };
            });
            return {
              ...oldData,
              content: newContent,
              totalAmount: counter,
            };
          }
        },
      );
      queryClient.setQueryData<IFetchProductDataResponse>(
        [
          "productData",
          { productSlug: item.product.slug } as IFetchProductDataProps,
        ],
        (oldData) =>
          oldData && {
            ...oldData,
            cartQty: item.qty,
          },
      );
    },
  });

  return {
    deleteMutation,
    changeQtyMutation,
  };
};

const addToCartQuery = gql`
  mutation addToCart($product_id: UUID!, $qty: Int!) {
    add_to_cart(product_id: $product_id, qty: $qty) {
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

  ${CART_PRODUCT_FRAGMENT}
`;

interface IAddToCartResponse {
  add_to_cart: TCollection<ICartItemApi>;
}

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAppContext();

  const mutation = useMutation({
    mutationFn: async ({
      productId,
      qty,
    }: {
      productId: string;
      qty: number;
    }) => {
      if (!user) throw new Error("Missing user");

      const response = await client.request<IAddToCartResponse>(
        addToCartQuery,
        {
          product_id: productId,
          qty,
        },
      );
      return response.add_to_cart.edges[0].node;
    },
    onSuccess: (item) => {
      if (user) {
        queryClient.setQueryData<IFetchCartContentResponse>(
          ["cart", { user_id: user.id } as IFetchCartContentProps],
          (oldData) =>
            oldData &&
            item && {
              ...oldData,
              content: [
                ...oldData.content.filter(
                  (cartItem) => cartItem.id !== item.id,
                ),
                item,
              ],
              totalAmount: oldData.totalAmount + item.qty,
            },
        );
        queryClient.setQueryData<IFetchProductDataResponse>(
          [
            "productData",
            { productSlug: item.product.slug } as IFetchProductDataProps,
          ],
          (oldData) =>
            oldData && {
              ...oldData,
              cartItemId: item.id,
              cartQty: item.qty,
            },
        );
      }
    },
  });

  return mutation;
};

const createOrderQuery = gql`
  mutation createOrder(
    $address: String!
    $deliveryOption: String!
    $paymentOption: String!
    $name: String!
    $contact: String!
    $postIndex: Int!
  ) {
    create_order(
      p_address: $address
      p_delivery_option: $deliveryOption
      p_payment_option: $paymentOption
      p_user_name: $name
      p_contact: $contact
      p_post_index: $postIndex
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

interface ICreateOrderRequest {
  address: string;
  deliveryOption: string;
  paymentOption: string;
  name: string;
  contact: string;
  postIndex: number;
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  const { user } = useAppContext();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (values: ICreateOrderRequest) => {
      if (!user) throw new Error("Missing user");

      const cartData = queryClient.getQueryData<IFetchCartContentResponse>([
        "cart",
        { user_id: user?.id },
      ]);

      if (!cartData?.id) throw new Error("Missing cart data");

      const order = await client.request(createOrderQuery, values);
      return order;
    },
    onSuccess: () => {
      navigate(ERoutes.ORDER_SUCCESS);
    },
  });

  return mutation;
};
