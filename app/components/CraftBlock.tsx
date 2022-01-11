import React from "react";
import { Link } from "remix";
import katex from "katex";

const CraftBlock: React.FC<{ block: BlockType }> = ({ block }) => {
  // console.log("block", block);

  if (block.type === "textBlock") {
    const text = <CraftText fragments={block.content} />;

    // TODO: style bullets
    if (block.listStyle.type === "bullet") {
      return (
        <div>
          <span />
          <p>{text}</p>
        </div>
      );
    }

    if (block.style.textStyle === "title") return <h2>{text}</h2>;
    if (block.style.textStyle === "subtitle") return <h3>{text}</h3>;
    if (block.style.textStyle === "heading") return <h4>{text}</h4>;

    return <p>{text}</p>;
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
          output = <mark className="bg-amber-200 px-0.5">{output}</mark>;
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
  style: {
    textStyle: string;
  };
  listStyle: {
    type: string;
  };
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
