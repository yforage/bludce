import { memo } from "react";
import notFoundImg from "@/assets/not-found.jpg";
import Content from "@/shared/components/Content";
import { FloatedBlock } from "@/shared/components/FloatedBlock";
import { ERoutes } from "@/shared/types";

const OrderSuccessPage = memo(() => {
  return (
    <Content>
      <div
        className={`relative flex h-full items-center justify-center max-lg:min-h-[80vh] max-lg:flex-col max-lg:pt-4`}
      >
        <img
          className="w-full object-cover max-lg:aspect-2/3 max-lg:max-h-[55%] max-lg:rounded-xl lg:h-full"
          alt="not found"
          src={notFoundImg}
        />
        <FloatedBlock
          className="text-center lg:absolute"
          buttonContainerClassName="justify-center"
          title="Покупка успешно оформлена!"
          description={
            "Спасибо, что выбрали Блюдце в пастель.\nИнформация о заказе и чек оплаты отправлены на почту."
          }
          button="Продолжить покупки"
          link={ERoutes.CATALOG}
        />
      </div>
    </Content>
  );
});

export default OrderSuccessPage;
