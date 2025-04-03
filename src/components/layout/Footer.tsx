import { memo } from "react";
import { Link } from "react-router-dom";
import { ERoutes } from "@/shared/types";
import Content from "@/shared/components/Content";
import SocialLinks from "@/components/SocialLinks";
import { ScrollUpButton } from "@/shared/components/ScrollUpButton";

const Footer = memo(() => (
  <footer className="bg-beige">
    <Content className="flex flex-col items-center justify-between py-8 max-lg:space-y-4 lg:flex-row">
      <div className="flex flex-1 flex-col items-center space-y-2 lg:order-2">
        <div className="space-x-6">
          <Link to={ERoutes.CATALOG}>Каталог</Link>
          <Link to={ERoutes.ABOUT}>О нас</Link>
          <Link to={ERoutes.DELIVERY}>Доставка</Link>
        </div>
        <Link to={ERoutes.POLICY}>Политика конфиденциальности</Link>
        <Link to={ERoutes.OFERTA}>Публичная оферта</Link>
      </div>
      <div className="flex flex-1 flex-col items-center space-y-2 max-lg:w-full lg:order-3 lg:items-end lg:px-2.5 lg:py-10">
        <SocialLinks />
        <ScrollUpButton />
      </div>
      <div className="lwhitespace-pre-wrap flex flex-1 flex-col max-lg:text-center lg:order-1">
        <p className="lg:order-2">
          Буду рада сотрудничеству, просто напишите мне:{" "}
          <br className="hidden lg:block" />
          <span>template@email.com</span>
        </p>
        <p className="max-lg:mt-4 lg:order-1 lg:mb-4">
          © 2015-2023. «Блюдце в пастель»
        </p>
      </div>
    </Content>
  </footer>
));

export default Footer;
