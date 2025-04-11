import {getWorkListByUserId} from "~/servers/works";

export const revalidate = 0;

export async function POST(req: Request, res: Response) {

  const json = await req.json();
  const user_id = json.user_id;
  const current_page = json.current_page;

  const works = await getWorkListByUserId(user_id, current_page);

  return new Response(JSON.stringify(works), {
    headers: {"Content-Type": "application/json"},
    status: 200
  });
}
