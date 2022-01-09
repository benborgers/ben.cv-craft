import type { ActionFunction } from "remix";

export const action: ActionFunction = async ({ request, context }) => {
  const page = JSON.parse(await request.text());
  const id = page.id.toLowerCase();

  await context.env.KV.put(id, JSON.stringify(page));

  return null;
};
