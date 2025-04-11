import {getDb} from "~/libs/db";


export const countSticker = async (key, addCount) => {
  const db = getDb();

  const results = await db.query('select * from key_value where key=$1 limit 1', [key]);
  const rows = results.rows;
  if (rows.length <= 0) {
    // 新增
    await db.query('insert into key_value(key, value) values($1,$2)', [key, addCount]);
  }
  // 更新
  const origin = rows[0];
  const newCount = Number(origin.value) + addCount
  await db.query('update key_value set value=$1 where key=$2', [newCount, key]);

}

export const getCountSticker = async () => {
  const db = getDb();

  const results = await db.query('select * from key_value where key=$1 limit 1', ['countSticker']);
  const rows = results.rows;
  if (rows.length > 0) {
    const origin = rows[0];
    return origin.value;
  }
  return '';
}
