import {getLatestPublicResultList} from "~/servers/works";

export const revalidate = 10;

export async function POST(req: Request, res: Response) {

  const json = await req.json();
  const locale = json.locale;

  const works = await getLatestPublicResultList(locale, 1);

  return new Response(JSON.stringify(works), {
    headers: {"Content-Type": "application/json"},
    status: 200
  });
}
