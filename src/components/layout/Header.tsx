import React, {
  CSSProperties,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, useLocation } from "react-router-dom";
import { clsx } from "clsx/lite";
import { User } from "@supabase/supabase-js";
import { Transition, TransitionStatus } from "react-transition-group";
import CartModal from "@/components/cart/CartModal";
import SocialLinks from "@/components/SocialLinks";
import { fetchCartContent, fetchCategoriesLinks } from "@/api/requests";
import CatalogLinks from "@/components/catalog/CatalogLinks";
import { ERoutes } from "@/shared/types";
import Content from "@/shared/components/Content";
import drawerImg from "@/assets/drawer.jpg";
import { IFetchCartContentProps } from "@/api/types";
import { BurgerCloseIcon } from "@/shared/components/BurgerCloseIcon";
import SelectionLeft from "@/assets/icons/selection-left.svg?react";

interface IHeaderProps {
  loggedUser: User | null;
  isMobile: boolean;
}

const Header: React.FC<IHeaderProps> = ({ loggedUser, isMobile }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();

  const cartQuery = useQuery({
    queryKey: ["cart", { user_id: loggedUser?.id }],
    queryFn: ({ queryKey }) =>
      fetchCartContent(queryKey[1] as IFetchCartContentProps),
    enabled: !!loggedUser,
  });

  const { data } = useQuery({
    queryKey: ["catalogLinks"],
    queryFn: fetchCategoriesLinks,
    enabled: isMobile,
  });

  const toggleDrawerOpen = useCallback(
    () => setIsDrawerOpen((prev) => !prev),
    [],
  );
  const handleOpenCart = useCallback(() => setIsCartOpen(true), []);
  const handleCloseCart = useCallback(() => setIsCartOpen(false), []);

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    [],
  );

  return (
    <header className="border-teal sticky top-0 z-30 h-20 border-y-2 bg-white">
      <Content className="relative flex h-full items-center justify-between lg:justify-center lg:space-x-16">
        {isMobile && (
          <button onClick={toggleDrawerOpen} className="w-5">
            <BurgerCloseIcon isActive={isDrawerOpen} />
          </button>
        )}
        {!isMobile && (
          <>
            <NavLink
              to={ERoutes.CATALOG}
              className={({ isActive }) => clsx(isActive && "text-green")}
            >
              {({ isActive }) => (
                <HeaderNavLinkContent text="Каталог" isActive={isActive} />
              )}
            </NavLink>
            <NavLink
              to={ERoutes.ABOUT}
              className={({ isActive }) => clsx(isActive && "text-green")}
            >
              <HeaderNavLinkContent
                text="О нас"
                isActive={
                  location.pathname === ERoutes.ROOT &&
                  !!location.search &&
                  ERoutes.ABOUT.includes(location.search)
                }
              />
            </NavLink>
          </>
        )}

        <Link
          to={ERoutes.ROOT}
          className="font-virilica text-pink text-center text-2xl font-bold"
          onClick={scrollToTop}
        >
          Блюдце
          <br />в пастель
        </Link>
        {!isMobile && (
          <NavLink
            to={ERoutes.DELIVERY}
            className={({ isActive }) => clsx(isActive && "text-green")}
          >
            <HeaderNavLinkContent
              text="Доставка"
              isActive={
                location.pathname === ERoutes.ROOT &&
                !!location.search &&
                ERoutes.DELIVERY.includes(location.search)
              }
            />
          </NavLink>
        )}
        <button
          ref={cartButtonRef}
          className="relative mr-0"
          onClick={handleOpenCart}
        >
          <ShoppingBagIcon className="w-5" />
          {!cartQuery.isPending &&
            cartQuery.data &&
            cartQuery.data?.totalAmount !== 0 && (
              <div
                key={cartQuery.data.totalAmount}
                className="animate-single-ping bg-teal absolute right-0 bottom-0 size-2 rounded-full"
              />
            )}
        </button>
        <CartModal
          content={cartQuery.data?.content}
          onClose={handleCloseCart}
          isLoading={cartQuery.isPending}
          isMobile={isMobile}
          isOpen={isCartOpen}
          cartButtonRef={cartButtonRef}
          loggedUser={loggedUser}
        />
      </Content>
      <Transition
        nodeRef={drawerRef}
        in={isMobile && !!isDrawerOpen}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <Content
            ref={drawerRef}
            className="border-teal absolute top-full flex min-h-[calc(100vh-4rem)] w-full flex-col space-y-8 border-t-2 bg-white py-8 transition duration-300"
            style={{
              transform: "translateX(-100%)",
              opacity: 0,
              ...drawerTransitionStyles[state],
            }}
          >
            <p className="font-virilica text-3xl">Меню</p>
            <div className="flex grow">
              <div className="flex flex-1 flex-col items-start space-y-6 text-xl">
                <CatalogLinks
                  categories={data?.categories}
                  onClick={toggleDrawerOpen}
                />
                <NavLink
                  to={ERoutes.ABOUT}
                  className={({ isActive }) => clsx(isActive && "text-green")}
                  onClick={toggleDrawerOpen}
                >
                  О нас
                </NavLink>
                <NavLink
                  to={ERoutes.DELIVERY}
                  className={({ isActive }) => clsx(isActive && "text-green")}
                  onClick={toggleDrawerOpen}
                >
                  Доставка
                </NavLink>
              </div>
              <div className="flex-1">
                <img
                  className="cover h-[90%] rounded-xl object-cover"
                  src={drawerImg}
                  alt="pottery"
                />
              </div>
            </div>
            <SocialLinks />
            <p>
              Если возникнут вопросы, Вы всегда можете написать мне на почту
              <br />
              <u>template@email.com</u> и я с радостью отвечу.
            </p>
          </Content>
        )}
      </Transition>
    </header>
  );
};

export default Header;

const drawerTransitionStyles: Partial<Record<TransitionStatus, CSSProperties>> =
  {
    entering: {
      transform: "translateX(0)",
      opacity: 1,
    },
    entered: {
      transform: "translateX(0)",
      opacity: 1,
    },
    exiting: {
      transform: "translateX(-100%)",
      opacity: 0,
    },
    exited: {
      transform: "translateX(-100%)",
      opacity: 0,
    },
  };

interface IHeaderNavLinkContentProps {
  text: string;
  isActive: boolean;
}

const HeaderNavLinkContent = memo<IHeaderNavLinkContentProps>(
  ({ isActive, text }) => (
    <div className="relative">
      {text}
      {isActive && (
        <SelectionLeft className="text-teal absolute top-[75%] -left-[22%] w-[140%] -translate-y-2/4 -scale-x-100" />
      )}
    </div>
  ),
);
