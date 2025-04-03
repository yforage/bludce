import React from "react";
import { ERichTextBlocks, IRichTextBlock } from "@/shared/types";

type RenderNode = Record<
  ERichTextBlocks,
  (el: React.ReactNode, id: IRichTextBlock["id"]) => React.ReactNode
>;

export type RenderRichTextNode = Partial<RenderNode>;

const defaultRenderNode: RenderNode = {
  [ERichTextBlocks.ROOT]: (children, id) => (
    <React.Fragment key={id}>{children}</React.Fragment>
  ),
  [ERichTextBlocks.PARAGRAPH]: (children, id) => <p key={id}>{children}</p>,
  [ERichTextBlocks.UL_LIST]: (children, id) => <ul key={id}>{children}</ul>,
  [ERichTextBlocks.LIST_ITEM]: (children, id) => <li key={id}>{children}</li>,
  [ERichTextBlocks.SPACE]: (_, id) => <br key={id} />,
};

export const renderRichText = (
  { type, children, id }: IRichTextBlock,
  renderNode: RenderRichTextNode,
): React.ReactNode => {
  const mergedRenderNode = {
    ...defaultRenderNode,
    ...renderNode,
  };

  if (typeof children === "string") {
    return mergedRenderNode[type](children, id);
  }
  return mergedRenderNode[type](
    children.map((el) => renderRichText(el, mergedRenderNode)),
    id,
  );
};
