import type { ActionFunction } from "remix";

export const action: ActionFunction = async ({ request, context }) => {
  const body = JSON.parse(await request.text());

  if (body.key !== context.env.INTAKE_KEY) {
    return new Response("", { status: 401 });
  }

  const id = body.page.id.toLowerCase();

  await context.env.KV.put(id, JSON.stringify(body.page));

  return new Response("", { status: 200 });
};
