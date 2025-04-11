import {getDb} from "~/libs/db";
import {getArrayUrlResult} from "~/configs/buildLink";
import {headers} from "next/headers";

export const searchByWords = async (locale, textStr) => {
  const db = getDb();
  const worksList = await searchDatabaseWithoutLocale(textStr);
  if (worksList.length > 0) {
    // 得到所有的 uid,查询对应语言下的数据返回
    const uidArray = [];
    let searchTerms = textStr.split(" ");
    for (let i = 0; i < worksList.length; i++) {
      const currentRow = worksList[i];
      const currentText = currentRow.input_text?.split(' ');
      let checkExist = false;
      for (let j = 0; j < currentText.length; j++) {
        for (let k = 0; k < searchTerms.length; k++) {
          if (currentText[j]?.toLowerCase() == searchTerms[k]?.toLowerCase()) {
            // 单词转小写后全匹配过滤
            checkExist = true;
            break;
          }
        }
      }
      if (checkExist) {
        uidArray.push(currentRow.uid);
      }
    }
    // console.log('uidArray-=-=-->', uidArray);
    if (uidArray.length <= 0) {
      return [];
    }
    let uidStr = uidArray.map(item => `'${item}'`).join(",");
    // console.log('uidStr-=-=-->', uidStr);
    // 查询对应语言的数据
    const queryStr = `select * from works where uid in (${uidStr}) and current_language = $1 and is_delete=$2`;
    const resultRows = await db.query(queryStr, [locale, false]);
    const rows = resultRows.rows;
    if (rows.length > 0) {
      const resultInfoList = [];
      for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i];
        if (resultInfoList.length > 23) {
          break;
        }
        currentRow.output_url = getArrayUrlResult(currentRow.output_url);
        resultInfoList.push(currentRow);
      }
      return resultInfoList;
    }
  }
  return [];
}

async function searchDatabaseWithoutLocale(inputString) {
  const db = getDb();
  // 分割输入字符串
  let searchTerms = inputString.split(" ");

  // 构建SQL查询
  let query = `SELECT *,
                      (
                          ${searchTerms.map((_, index) => `CASE WHEN input_text ILIKE $${index + 1} and is_delete=false THEN 1 ELSE 0 END`).join(' + ')}
                          ) AS relevance
               FROM works
               WHERE ${searchTerms.map((_, index) => `input_text ILIKE $${index + 1} and is_delete=false`).join(' OR ')}
               ORDER BY relevance DESC limit 100;`;

  // 准备参数数组，为每个term包装成带有通配符的字符串
  let queryParams = searchTerms.map(term => `%${term}%`);

  // console.log("query-=>", query);
  // console.log("queryParams-=>", queryParams);

  try {
    // 执行查询
    const {rows} = await db.query(query, queryParams);
    // console.log(rows);
    return rows;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}


export const addSearchLog = async (search_text, result_count) => {
  const db = getDb();

  const headerAll = headers();
  const search_ip = headerAll.get("x-forwarded-for");
  const user_agent = headerAll.get("user-agent");

  await db.query('insert into search_log(search_text, result_count, user_agent, search_ip) values($1,$2,$3,$4)',
    [search_text, result_count, user_agent, search_ip])
}
