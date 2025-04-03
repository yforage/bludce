import {
  CSSProperties,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Transition, TransitionStatus } from "react-transition-group";
import { User } from "@supabase/supabase-js";
import Button from "@/shared/components/Button";
import { useClickOutside } from "@/utils";
import { ERoutes } from "@/shared/types";
import { ICartItemApi } from "@/api/types";
import { useCartItemMutations } from "@/api/mutations";
import Backdrop from "@/shared/components/Backdrop";
import CompactCartItemSkeleton from "./CompactCartItemSkeleton";
import CartItem from "./CartItem";

interface ICartModalProps {
  content?: ICartItemApi[];
  isLoading: boolean;
  isMobile: boolean;
  isOpen: boolean;
  cartButtonRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
  loggedUser?: User | null;
}

const CartModal = memo<ICartModalProps>(
  ({
    isOpen,
    content,
    onClose,
    isLoading,
    isMobile,
    cartButtonRef,
    loggedUser,
  }) => {
    const backdropRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useClickOutside(contentRef, onClose, cartButtonRef);

    useEffect(() => {
      if (isMobile) {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
      }
    }, [isMobile, isOpen]);

    return (
      <Transition
        nodeRef={backdropRef}
        in={isOpen}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        {(state) => {
          if (isMobile)
            return (
              <Backdrop
                ref={backdropRef}
                style={{
                  opacity: 0,
                  ...mobileBackgroundTransition[state],
                }}
              >
                <div
                  ref={contentRef}
                  style={{
                    opacity: 0,
                    transform: "translate(0%, 100%)",
                    ...contentTransitionMObile[state],
                  }}
                  className="fixed bottom-8 left-1/2 z-10 w-[calc(100%-4rem)] -translate-x-2/4 transition-[opacity,transform]"
                >
                  <CartContent
                    content={content}
                    isLoading={isLoading}
                    onClose={onClose}
                    loggedUser={loggedUser}
                  />
                </div>
              </Backdrop>
            );

          return (
            <div
              ref={backdropRef}
              style={{
                opacity: 0,
                transform: "translate(0%, 25%)",
                ...contentTransition[state],
              }}
              className="absolute top-[calc(100%+2px)] right-0 w-60 transition-[opacity,transform]"
            >
              <div ref={contentRef}>
                <CartContent
                  content={content}
                  isLoading={isLoading}
                  onClose={onClose}
                  loggedUser={loggedUser}
                />
              </div>
            </div>
          );
        }}
      </Transition>
    );
  },
);

export default CartModal;

const mobileBackgroundTransition: Partial<
  Record<TransitionStatus, CSSProperties>
> = {
  entering: {
    opacity: 1,
  },
  entered: {
    opacity: 1,
  },
  exiting: {
    opacity: 0,
  },
  exited: {
    opacity: 0,
  },
};

const contentTransitionMObile: Partial<
  Record<TransitionStatus, CSSProperties>
> = {
  entering: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  entered: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  exiting: {
    opacity: 0,
    transform: "translate(0, 100%)",
  },
  exited: {
    opacity: 0,
    transform: "translate(0, 100%)",
  },
};

const contentTransition: Partial<Record<TransitionStatus, CSSProperties>> = {
  entering: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  entered: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  exiting: {
    opacity: 0,
    transform: "translate(0, 25%)",
  },
  exited: {
    opacity: 0,
    transform: "translate(0, 25%)",
  },
};

interface ICartContentProps
  extends Pick<
    ICartModalProps,
    "content" | "isLoading" | "loggedUser" | "onClose"
  > {}

const CartContent = memo<ICartContentProps>(
  ({ content, isLoading, loggedUser, onClose }) => {
    const { changeQtyMutation, deleteMutation } =
      useCartItemMutations(loggedUser);

    const handleDelete = useCallback((cartItemId: string) => {
      deleteMutation.mutate({ cart_item_id: cartItemId });
    }, []);

    const handleChangeQty = useCallback((newCount: number, id: string) => {
      changeQtyMutation.mutate({ count: newCount, id });
    }, []);

    const sum =
      content?.reduce(
        (acc, { product: { price }, qty }) => (acc += Number(price) * qty),
        0,
      ) ?? 0;

    return (
      <div className="flex size-full flex-col rounded-lg bg-white lg:drop-shadow-md">
        <div className={"relative p-5 lg:p-4"}>
          <div className={"mb-2 flex justify-between"}>
            <span className={"text-lg"}>Ваши товары</span>
            <button onClick={onClose}>
              <XMarkIcon className={"w-5"} />
            </button>
          </div>
          <div
            className={
              "-mr-4 flex max-h-80 flex-col space-y-2 overflow-y-scroll pr-4"
            }
          >
            {content?.map(({ id, product, qty }) => (
              <CartItem
                key={id}
                id={id}
                count={qty}
                product={product}
                isPending={
                  (deleteMutation.isPending &&
                    deleteMutation.variables.cart_item_id === id) ||
                  (changeQtyMutation.isPending &&
                    changeQtyMutation.variables.id === id)
                }
                onDelete={handleDelete}
                onQtyChange={handleChangeQty}
              />
            ))}
            {isLoading && <CompactCartItemSkeleton />}
          </div>
          <div className={"bg-teal absolute left-0 h-0.5 w-full"} />
          <div className={"mt-4 mb-2 flex justify-between"}>
            <span>Заказ на сумму</span>
            {!isLoading && <span>{sum} ₽</span>}
            {isLoading && (
              <div
                className={"h-6 w-10 animate-pulse rounded-md bg-zinc-200"}
              />
            )}
          </div>
          <Link to={ERoutes.CHECKOUT} onClick={onClose}>
            <Button size="large" className={"w-full max-lg:h-16"}>
              Перейти в корзину
            </Button>
          </Link>
        </div>
      </div>
    );
  },
);
