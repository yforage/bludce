import { memo } from "react";
import { useRouteError } from "react-router-dom";
import Content from "@/shared/components/Content";
import notFoundImg from "@/assets/not-found.jpg";

const ErrorPage = memo(() => {
  const error = useRouteError();
  console.error(error);
  return (
    <Content>
      <div
        className={`relative flex h-full items-center justify-center max-lg:min-h-[80vh]`}
      >
        <div
          className={`bg-beige absolute z-20 flex w-full translate-y-[80%] flex-col items-center py-4 max-lg:px-2 max-lg:text-center`}
        >
          <h1 className={`font-virilica mb-6 text-3xl lg:text-4xl`}>
            Упс...произошла ошибка
          </h1>
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

export default ErrorPage;
