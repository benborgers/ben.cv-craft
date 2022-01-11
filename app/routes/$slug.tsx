import { json, LinksFunction, redirect, useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import CraftBlock from "~/components/CraftBlock";
import type { BlockType, BlockFragmentType } from "~/components/CraftBlock";

export const meta: MetaFunction = ({ data }) => ({
  title: pageTitle(data),
});

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/katex@0.15.1/dist/katex.min.css",
  },
];

const BASE_DOC_ID = "b2ffdcaf-6cce-4687-863c-161e7436e34a";

export const loader: LoaderFunction = async ({ params, context }) => {
  const lowercaseSlug = params.slug?.toLowerCase();
  if (params.slug && params.slug !== lowercaseSlug) {
    throw redirect(`/${lowercaseSlug}`);
  }

  if (params.slug === BASE_DOC_ID) {
    throw redirect("/");
  }

  const slug = params.slug || BASE_DOC_ID;

  const page = await context.env.KV.get(slug, { type: "json" });
  if (!page) throw new Response("", { status: 404 });

  return json(page);
};

export default function Slug() {
  const page = useLoaderData();
  const title = pageTitle(page);

  return (
    <div>
      <h1>{title}</h1>
      <div className="prose">
        {page.subblocks.map((block: BlockType) => (
          <CraftBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}

const pageTitle = (page: any) =>
  page.content.map((x: BlockFragmentType) => x.text).join("");
