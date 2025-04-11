import {getDb} from "~/libs/db";


const db = getDb();
export const checkSensitiveInputText = async (input_text:string) => {
  const {rows: sensitiveWords} = await db.query('select * from sensitive_words');
  if (sensitiveWords.length > 0) {
    for (let i = 0; i < sensitiveWords.length; i++) {
      const currentSensitive = sensitiveWords[i];
      const currentWords = currentSensitive.words;
      if (input_text.indexOf(currentWords) != -1) {
        return false;
      }
    }
  }
  return true;
}
