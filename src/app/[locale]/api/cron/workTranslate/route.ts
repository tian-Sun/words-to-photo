import {getDb} from "~/libs/db";
import {locales} from "~/config";
import {translateContent} from "~/servers/translate";

export const maxDuration = 300;

export async function GET() {
  const db = getDb();
  const timeFlag = 'workTranslate' + '-=->' + new Date().getTime();
  console.time(timeFlag);
  const results = await db.query('select * from works_translate_task where status=$1 order by created_at asc limit 3', [0]);
  const rows = results.rows;
  if (rows.length <= 0) {
    console.log('没有任务需要处理');
    console.timeEnd(timeFlag);
    return Response.json({message: '没有任务需要处理'});
  }
  for (let i = 0; i < rows.length; i++) {
    const oneTask = rows[i];
    // 翻译为除了原始语言的其他语言，如果原始语言不在支持列表，就翻译为支持的十种语言
    const origin_language = oneTask.origin_language;
    const uid = oneTask.uid;

    const needLanguage = getNeedTranslateLanguage(origin_language);

    if (needLanguage.length <= 0) {
      // 更新状态为已翻译完成
      await db.query('update works_translate_task set status=$1 where uid=$2', [1, uid]);
      console.log('没有需要翻译的语言-=->', uid);
      console.timeEnd(timeFlag);
      return Response.json({message: '没有需要翻译的语言'});
    }

    // 查出原始数据
    const resultsOrigin = await db.query('select * from works where uid=$1 and is_origin=$2 and is_delete=$3', [uid, true, false]);
    const rowsOrigin = resultsOrigin.rows;
    if (rowsOrigin.length <= 0) {
      console.log('没有原始数据-=->', uid);
      console.timeEnd(timeFlag);
      // 更新状态为已翻译完成
      await db.query('update works_translate_task set status=$1 where uid=$2', [1, uid]);
      return Response.json({message: '没有原始数据'});
    }
    const originData = rowsOrigin[0];
    if (originData.output_url == '') {
      // 如果原始数据的url还没生成，就不翻译了
      console.log('原始数据的url还没生成-=->', uid);
      console.timeEnd(timeFlag);
      return Response.json({message: '原始数据的url还没生成'});
    }
    const timeFlagCurrent = '翻译' + '-=->' + uid;
    console.time(timeFlagCurrent);
    for (let i = 0; i < needLanguage.length; i++) {
      const toLanguage = needLanguage[i];
      const translateText = await translateContent(originData.input_text, toLanguage);
      const sqlStr = 'insert into works(uid, input_text, output_url, is_public, status, user_id, revised_text, is_origin, origin_language, current_language) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
      const data = [uid, translateText, originData.output_url, originData.is_public, originData.status, originData.user_id, originData.revised_text, false, originData.origin_language, toLanguage];
      await db.query(sqlStr, data);
    }
    console.timeEnd(timeFlagCurrent);
    console.log('翻译完-=->', uid);
    // 更新状态为已翻译完成
    await db.query('update works_translate_task set status=$1 where uid=$2', [1, uid]);
  }
  console.timeEnd(timeFlag);
  return Response.json({message: '本次翻译任务翻译完'});
}

function getNeedTranslateLanguage(origin_language: string) {
  const needTranslateLanguage = [];
  // 判断出需要翻译的语言，并调用翻译
  for (let i = 0; i < locales.length; i++) {
    if (origin_language != locales[i]) {
      needTranslateLanguage.push(locales[i]);
    }
  }
  return needTranslateLanguage;
}
