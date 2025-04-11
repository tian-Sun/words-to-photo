import {getDb} from "~/libs/db";
import {getArrayUrlResult} from "~/configs/buildLink";

const db = getDb();

export const getWorkDetailByUid = async (locale:string, uid:string) => {
  // 先查指定语言的是否有，没有则返回原始数据
  const resultsCurrent = await db.query('select * from works where uid=$1 and current_language=$2 and is_delete=$3 order by updated_at desc', [uid, locale, false]);
  const currentRows = resultsCurrent.rows;
  if (currentRows.length > 0) {
    const currentRow = currentRows[0];
    currentRow.output_url = getArrayUrlResult(currentRow.output_url);
    return currentRow;
  }

  const results = await db.query('select * from works where uid=$1 and is_origin=$2 and is_delete=$3', [uid, true, false]);
  const works = results.rows;
  if (works.length > 0) {
    const currentRow = works[0];
    currentRow.output_url = getArrayUrlResult(currentRow.output_url);
    return currentRow;
  }
  return {
    status: 404
  }
}

export const getSimilarList = async (revised_text, uid, locale) => {
  const worksList = await searchDatabase(revised_text, locale);
  let searchTerms = revised_text.split(" ");
  if (worksList.length > 0) {
    const resultInfoList = [];
    for (let i = 0; i < worksList.length; i++) {
      const currentRow = worksList[i];
      if (currentRow.uid == uid) {
        continue;
      }
      const currentText = currentRow.input_text?.split(' ');
      let checkExist = false;
      for (let j = 0; j < currentText.length; j++) {
        for (let k = 0; k < searchTerms.length; k++) {
          if (currentText[j]?.toLowerCase() == searchTerms[k]?.toLowerCase()) {
            checkExist = true;
            break;
          }
        }
      }
      if (resultInfoList.length > 11) {
        break;
      }
      if (checkExist) {
        currentRow.output_url = getArrayUrlResult(currentRow.output_url);
        resultInfoList.push(currentRow);
      }
    }
    return resultInfoList;
  }
  return [];
}

async function searchDatabase(inputString, locale) {
  // 分割输入字符串
  let searchTerms = inputString.split(" ");

  // 构建SQL查询
  let query = `SELECT *, (
    ${searchTerms.map((_,index) => `CASE WHEN is_delete=false and current_language='${locale}' and input_text ILIKE $${index + 1} THEN 1 ELSE 0 END`).join(' + ')}
  ) AS relevance
  FROM works
  WHERE ${searchTerms.map((_, index) => `is_delete=false and current_language='${locale}' and input_text ILIKE $${index + 1}`).join(' OR ')}
  ORDER BY relevance DESC limit 100;`;

  // 准备参数数组，为每个term包装成带有通配符的字符串
  let queryParams = searchTerms.map(term => `%${term}%`);

  // console.log("query-=>", query);
  // console.log("queryParams-=>", queryParams);

  try {
    // 执行查询
    const { rows } = await db.query(query, queryParams);
    // console.log(rows);
    return rows;
  } catch (error) {
    console.error('Error executing query', error.stack);
    throw error;
  }
}

export const getWorkListByUserId = async (user_id: string, current_page:string) => {
  const pageSize = Number(process.env.NEXT_PUBLIC_PAGES_SIZE);
  const skipSize = pageSize * (Number(current_page) - 1);

  const results = await db.query('select * from works where user_id=$1 and is_origin=$2 and is_delete=$3 order by updated_at desc limit $4 offset $5', [user_id, true, false, pageSize, skipSize]);
  const works = results.rows;

  const resultInfoList = [];
  if (works.length > 0) {
    for (let i = 0; i < works.length; i++) {
      const currentRow = works[i];
      currentRow.output_url = getArrayUrlResult(currentRow.output_url);
      resultInfoList.push(currentRow)
    }
    return resultInfoList;
  }

  return [];
}

export const getPublicResultList = async (locale, current_page) => {
  const pageSize = Number(process.env.NEXT_PUBLIC_PAGES_SIZE);
  const skipSize = pageSize * (Number(current_page) - 1);

  const results = await db.query('select * from works where is_public=$1 and current_language=$2 and output_url != $3 and is_delete=$4 order by updated_at desc limit $5 offset $6', [true, locale, '', false, pageSize, skipSize]);
  const works = results.rows;

  const resultInfoList = [];
  if (works.length > 0) {
    for (let i = 0; i < works.length; i++) {
      const currentRow = works[i];
      currentRow.output_url = getArrayUrlResult(currentRow.output_url);
      resultInfoList.push(currentRow)
    }
    return resultInfoList;
  }

  return [];
}

export const getLatestPublicResultList = async (locale, current_page) => {
  // 首页数据
  const pageSize = 8;
  const skipSize = pageSize * (Number(current_page) - 1);

  const results = await db.query('select * from works where is_public=$1 and current_language=$2 and output_url != $3 and is_delete=$4 order by updated_at desc limit $5 offset $6', [true, locale, '', false, pageSize, skipSize]);
  const works = results.rows;

  const resultInfoList = [];
  if (works.length > 0) {
    for (let i = 0; i < works.length; i++) {
      const currentRow = works[i];
      currentRow.output_url = getArrayUrlResult(currentRow.output_url);
      resultInfoList.push(currentRow)
    }
    return resultInfoList;
  }

  return [];
}

export const getPagination = async (locale:string, page: number) => {

  const pageSize = Number(process.env.NEXT_PUBLIC_PAGES_SIZE);
  const results = await db.query('select count(1) from works where is_public=$1 and current_language=$2 and is_delete=$3', [true, locale, false]);
  const countTotal = results.rows;

  const total = countTotal[0].count;
  const totalPage = Math.ceil(total / pageSize)

  const result = {
    totalPage: totalPage,
    pagination: createPagination(totalPage, Number(page), 6),
  }
  return result
}

function createPagination(totalPages, currentPage, maxPagesToShow) {
  const pages = [];
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    // 总页数少于或等于最大显示页数，显示所有页码
    startPage = 1;
    endPage = totalPages;
  } else {
    // 确定页码的开始和结束位置
    const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // 当前页码靠近开始
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // 当前页码靠近结束
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      // 当前页码在中间
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // 生成页码
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}

