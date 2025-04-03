import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchIndexData } from "@/api/requests";
import Content from "@/shared/components/Content";
import Gallery from "@/components/gallery/Gallery";
import Quote from "@/shared/components/Quote";
import ItemsRow from "@/components/product/ItemsRow";
import TextBlock from "@/shared/components/TextBlock";
import aboutBlock from "@/mocks/aboutBlock.json";
import deliveryBlock from "@/mocks/deliveryBlock.json";
import { ITextBlockProps } from "@/shared/types";
import ItemLargePreview from "@/shared/components/ItemLargePreview";
import deliveryImg from "@/assets/delivery.jpg";
import aboutImg from "@/assets/about.jpg";

const HomePage = memo(() => {
  const [searchParams] = useSearchParams();

  const { isPending, data } = useQuery({
    queryKey: ["indexData"],
    queryFn: fetchIndexData,
  });

  const aboutRef = useRef<HTMLDivElement | null>(null);
  const deliveryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchParams.has("about") && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (searchParams.has("delivery") && deliveryRef.current) {
      deliveryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  return (
    <Content className="space-y-8 py-4 pb-10 lg:space-y-24">
      <Gallery />
      <Quote
        author="Иоганн Вольганг Гете"
        text="В любом произведении искусства, великом или малом, всё до последних мелочей зависит от замысла."
      />
      {!isPending && data && (
        <ItemsRow title="Популярные товары" items={data.popularItems} />
      )}
      <TextBlock
        {...(aboutBlock as ITextBlockProps)}
        ref={aboutRef}
        image={aboutImg}
      />
      {!isPending && data && <ItemLargePreview {...data.popularItems[0]} />}
      <TextBlock
        {...(deliveryBlock as ITextBlockProps)}
        ref={deliveryRef}
        image={deliveryImg}
      />
    </Content>
  );
});

export default HomePage;
