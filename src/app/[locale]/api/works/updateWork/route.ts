import {getDb} from "~/libs/db";

export const revalidate = 0;

export async function POST(req: Request, res: Response) {
  const db = getDb();

  const json = await req.json();
  const uid = json.uid;

  // 更新数据为删除状态
  await db.query('update works set is_delete=$1,updated_at=now() where uid=$2', [true, uid]);

  return new Response(JSON.stringify({message: 'success'}), {
    headers: {"Content-Type": "application/json"},
    status: 200
  });

}
