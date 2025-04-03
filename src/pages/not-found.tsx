import { Link } from "react-router-dom";
import { memo } from "react";
import Content from "@/shared/components/Content";
import { ERoutes } from "@/shared/types";
import Button from "@/shared/components/Button";
import notFoundImg from "@/assets/not-found.jpg";

const NotFoundPage = memo(() => {
  return (
    <Content>
      <div
        className={`relative flex h-full items-center justify-center max-lg:min-h-[80vh]`}
      >
        <div
          className={`bg-beige absolute z-20 flex w-full translate-y-[80%] flex-col items-center py-4 max-lg:px-2 max-lg:text-center`}
        >
          <h1 className={`font-virilica mb-6 text-3xl lg:text-4xl`}>
            Упс...такой страницы нет
          </h1>
          <Link to={ERoutes.ROOT}>
            <Button size="large">Главная страница</Button>
          </Link>
        </div>
        <img
          className="size-full object-cover"
          alt="not found"
          src={notFoundImg}
        />
      </div>
    </Content>
  );
});

export default NotFoundPage;
