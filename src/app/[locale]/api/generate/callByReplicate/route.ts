import {R2, r2Bucket, storageURL} from "~/libs/R2";
import {getDb} from "~/libs/db";
import {countSticker} from "~/servers/keyValue";
import {v4 as uuidv4} from 'uuid';

export const POST = async (req: Request) => {
  const query = new URL(req.url).searchParams;
  const uid = query.get("uid")!;

  const json = await req.json();

  const output = json.output;
  console.log('callByReplicate ==>json.output==>', output);

  // 使用fetch API下载文件,output是一个数组，可能多个
  const len = output.length;
  const output_urls = [];
  for (let i = 0; i < len; i++) {
    const url = output[i];
    const currentFileContent = await fetch(url)
      .then((v) => v.arrayBuffer())
      .then(Buffer.from);

    const currentKey = `${uuidv4()}.png`;
    await R2.upload({
      Bucket: r2Bucket,
      Key: `${currentKey}`,
      Body: currentFileContent,
    }).promise();
    const currentUrl = `${storageURL}/${currentKey}`;
    output_urls.push(currentUrl);
  }

  const output_url = JSON.stringify(output_urls);

  const db = getDb();

  const results = await db.query('select * from works where uid=$1', [uid]);
  const rows = results.rows;
  if (rows.length > 0) {
    const row = rows[0];
    if (row.is_public) {
      // 公开的才加
      await countSticker('countSticker', 1);
    }
    await db.query('update works set output_url=$1,status=$2,updated_at=now() where uid=$3', [output_url, 1, uid]);
  }

  return Response.json({msg: 200});
}
