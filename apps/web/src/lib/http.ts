export function problem(
  status: number,
  title: string,
  detail: string,
  code: string,
): Response {
  return Response.json(
    {
      type: `https://tact.game/problems/${code}`,
      title,
      status,
      detail,
      code,
    },
    {
      status,
      headers: { "content-type": "application/problem+json" },
    },
  );
}
