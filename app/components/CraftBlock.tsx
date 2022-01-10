import React from "react";
import { Link } from "remix";
import katex from "katex";

const CraftBlock: React.FC<{ block: BlockType }> = ({ block }) => {
  // console.log("block", block);

  if (block.type === "textBlock") {
    return (
      <p>
        <CraftText fragments={block.content} />
      </p>
    );
  }

  if (block.type === "imageBlock") {
    return <img src={block.url} alt={block.filename} />;
  }

  if (block.type === "codeBlock") {
    if (block.language === "math_formula") {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(block.code, {
              throwOnError: false,
              displayMode: true,
            }),
          }}
        />
      );
    }

    return (
      <pre>
        <code>{block.code}</code>
      </pre>
    );
  }

  if (block.type === "drawingBlock") {
    return <img src={block.previewUrl} />;
  }

  return null;
};

const CraftText: React.FC<{ fragments: Array<BlockFragmentType> }> = ({
  fragments,
}) => {
  return (
    <>
      {fragments.map((fragment, index) => {
        let output = <>{fragment.text}</>;
        if (fragment.isBold) {
          output = <strong>{output}</strong>;
        }
        if (fragment.isItalic) {
          output = <em>{output}</em>;
        }
        if (fragment.isStrikethrough) {
          output = <s>{output}</s>;
        }
        if (fragment.isCode) {
          output = <code>{output}</code>;
        }
        if (fragment.highlightColor) {
          output = <mark>{output}</mark>;
        }
        if (fragment.link?.type === "blockLink") {
          output = (
            <Link
              to={`/${fragment.link.blockId.toLowerCase()}`}
              prefetch="intent"
            >
              {output}
            </Link>
          );
        }
        if (fragment.link?.type === "url") {
          output = <a href={fragment.link.url}>{output}</a>;
        }
        if (fragment.link?.type === "formula") {
          output = (
            <span
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(fragment.link.formula, {
                  throwOnError: false,
                }),
              }}
            />
          );
        }
        return (
          <React.Fragment key={JSON.stringify(fragment) + index}>
            {output}
          </React.Fragment>
        );
      })}
    </>
  );
};

type BlockType = {
  id: string;
  type: string;
  content: Array<BlockFragmentType>;
  url: string;
  previewUrl: string;
  filename: string;
  code: string;
  language: string;
};

type BlockFragmentType = {
  isBold: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  text: string;
  highlightColor?: string;
  link?: {
    type: string;
    blockId: string;
    url: string;
    formula: string;
  };
};

export type { BlockType, BlockFragmentType };
export default CraftBlock;
