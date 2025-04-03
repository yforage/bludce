export enum ERoutes {
  ROOT = "/",
  CATALOG = "/catalog",
  ABOUT = "/?about",
  DELIVERY = "/?delivery",
  CHECKOUT = "/checkout",
  OFERTA = "/oferta",
  POLICY = "/policy",
  CATCH_ALL = "*",
  PRODUCT = "/catalog/:categorieSlug/:productSlug",
  NOT_FOUND = "/not-found",
  ORDER_SUCCESS = '/order-success'
}

export enum ERichTextBlocks {
  PARAGRAPH = "p",
  UL_LIST = "ul",
  LIST_ITEM = "li",
  ROOT = "div",
  SPACE = "space",
}

export interface IRichTextBlock {
  type: ERichTextBlocks;
  children: string | IRichTextBlock[];
  id: string;
}

export interface ITextBlockProps {
  title: string;
  subtitle: string;
  content: IRichTextBlock;
  image: string;
  imagePosition: "left" | "right";
  isSquare?: boolean;
}

interface ISearchApiFeature {
  id: string;
  place_name: string;
  text: string;
  type: string;
  bbox: [number, number];
  center: [number, number];
  relevance: number;
}

export interface ISearchApiResponse {
  type: string;
  features: ISearchApiFeature[];
  query: string;
}

export enum EErrorMessages {
  NOT_FOUND = "404",
}
