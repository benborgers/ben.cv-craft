import { json, LinksFunction, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import CraftBlock from "~/components/CraftBlock";
import type { BlockType, BlockFragmentType } from "~/components/CraftBlock";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/katex@0.15.1/dist/katex.min.css",
  },
];

export const loader: LoaderFunction = async ({ params, context }) => {
  const page = await context.env.KV.get(params.slug, { type: "json" });
  if (!page) throw new Response("", { status: 404 });
  return json(page);
};

export default function Slug() {
  const page = useLoaderData();
  const title = page.content.map((x: BlockFragmentType) => x.text).join("");

  return (
    <div>
      <h1>{title}</h1>
      {page.subblocks.map((block: BlockType) => (
        <CraftBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
