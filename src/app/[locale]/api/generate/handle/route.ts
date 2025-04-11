import {getUserById} from "~/servers/user";
import {checkUserTimes, countDownUserTimes} from "~/servers/manageUserTimes";
import {v4 as uuidv4} from 'uuid';
import {getReplicateClient} from "~/libs/replicateClient";
import {getInput} from "~/libs/replicate";
import {getDb} from "~/libs/db";
import {getLanguage} from "~/servers/language";
import {checkSubscribe} from "~/servers/subscribe";
import {checkSensitiveInputText} from "~/servers/checkInput";


export async function POST(req: Request, res: Response) {
  let json = await req.json();
  let textStr = json.textStr;
  let user_id = json.user_id;
  let is_public = json.is_public;

  if (!user_id && process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
    return Response.json({msg: "Login to continue.", status: 601});
  }

  // 检查用户在数据库是否存在，不存在则返回需登录
  const resultsUser = await getUserById(user_id);
  if (resultsUser.email == '' && process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0') {
    return Response.json({msg: "Login to continue.", status: 601});
  }

  const checkSubscribeStatus = await checkSubscribe(user_id);
  // console.log('checkSubscribeStatus-=-=-', checkSubscribeStatus);
  if (!is_public) {
    // 判断用户是否订阅状态，否则返回错误
    if (!checkSubscribeStatus) {
      return Response.json({msg: "Pricing to continue.", status: 602});
    }
  }

  if (!checkSubscribeStatus) {
    const check = await checkUserTimes(user_id);
    if (!check && process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0') {
      return Response.json({msg: "Pricing to continue.", status: 602});
    }
  }

  const checkSensitive = await checkSensitiveInputText(textStr);
  if (!checkSensitive) {
    // 敏感词没通过，校验是否订阅
    if (!checkSubscribeStatus) {
      // 未订阅则返回付费再继续
      return Response.json({msg: "Pricing to continue.", status: 602});
    } else {
      // 订阅强制设置其为用户私有，不公开
      is_public = false;
    }
  }

  const uid = uuidv4();

  const replicateClient = getReplicateClient();
  const origin_language = await getLanguage(textStr);
  const input = await getInput(textStr, checkSubscribeStatus);
  await replicateClient.predictions.create({
    version: process.env.REPLICATE_API_VERSION,
    input: input,
    webhook: `${process.env.REPLICATE_WEBHOOK}/api/generate/callByReplicate?uid=${uid}`,
    webhook_events_filter: ["completed"],
  })

  const db = getDb();
  // 创建新的数据
  await db.query('insert into works(uid, input_text, output_url, is_public, status, user_id, revised_text, is_origin, origin_language, current_language) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    [uid, textStr, '', is_public, 0, user_id, input.prompt, true, origin_language, origin_language]);
  // 创建一条翻译任务
  await db.query('insert into works_translate_task(uid,origin_language,status) values($1,$2,$3)', [uid, origin_language, 0]);

  // 需要登录，且需要支付时，才操作该项
  if (process.env.NEXT_PUBLIC_CHECK_GOOGLE_LOGIN != '0' && process.env.NEXT_PUBLIC_CHECK_AVAILABLE_TIME != '0' && !checkSubscribeStatus) {
    // 减少用户次数
    await countDownUserTimes(user_id);
  }

  const resultInfo = {
    uid: uid
  }
  return Response.json(resultInfo);
}
