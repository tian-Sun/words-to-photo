import {getDb} from "~/libs/db";

const db = getDb();
export const checkUserTimes = async (user_id) => {
  const results = await db.query(`select * from user_available where user_id=$1;`, [user_id]);
  const result = results.rows;
  if (result.length <= 0) {
    return false;
  }
  const available = result[0];
  const available_times = available.available_times;
  return available_times > 0;
}

export const countDownUserTimes = async (user_id) => {
  const results = await db.query(`select * from user_available where user_id=$1;`, [user_id]);
  const result = results.rows;
  if (result.length > 0) {
    const available = result[0];
    const resultTimes = available.available_times - 1;
    await db.query('update user_available set available_times=$1,updated_at=now() where user_id=$2', [resultTimes, user_id]);
  }
}
