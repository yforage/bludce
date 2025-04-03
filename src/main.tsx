import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ERoutes } from "@/shared/types";
import SessionProvider from "@/pages/session";
import HomePage from "@/pages/home";
import ErrorPage from "@/pages/error";
import NotFoundPage from "@/pages/not-found";
import CatalogPage from "@/pages/catalog";
import ProductPage from "@/pages/product";
import CheckoutPage from "@/pages/checkout";
import OrderSuccessPage from "@/pages/order-success";
import "./index.css";

const router = createBrowserRouter(
  [
    {
      element: <SessionProvider />,
      children: [
        {
          path: ERoutes.ROOT,
          element: <HomePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: ERoutes.CATCH_ALL,
          element: <NotFoundPage />,
        },
        {
          path: ERoutes.CATALOG,
          element: <CatalogPage />,
        },
        {
          path: ERoutes.PRODUCT,
          element: <ProductPage />,
        },
        {
          path: ERoutes.CHECKOUT,
          element: <CheckoutPage />,
        },
        {
          path: ERoutes.ORDER_SUCCESS,
          element: <OrderSuccessPage />,
        },
      ],
    },
  ],
  { basename: "/bludce" },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
