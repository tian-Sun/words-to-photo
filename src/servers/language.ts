import {apiKey, baseUrl} from "~/configs/openaiConfig";

export const model = 'openai/gpt-4o';
export const temperature = 0
export const getLanguage = async (content: string) => {
  let body = {
    messages: [
      {
        role: 'system',
        content: `你是一个语言分析专家，能够直接识别文本是什么语言，并且区分繁体中文和简体中文，如果是繁体中文则返回tw，简体中文返回zh。`
      },
      {
        role: 'system',
        content: `识别这段文字的语言，只返回语言的英文缩写，不含任何解释！`
      },
      {
        role: 'user',
        content: `需要识别的内容: ${content}`
      }
    ],
    model: model,
    temperature: temperature,
    stream: false
  }
  let languageResult = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    }
  })
    .then(v => v.json()).catch(err => console.log(err));

  // console.log('content-=->', content);
  // console.log('languageResult-=->', languageResult);
  // console.log('languageResult?.choices[0]?.message-=->', languageResult?.choices[0]?.message);
  const lang = languageResult?.choices[0]?.message?.content.substring(0, 2) || 'en';
  // console.log('lang->', lang);
  return lang;
}
