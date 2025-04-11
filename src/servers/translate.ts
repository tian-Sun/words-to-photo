import {apiKey, baseUrl, getCurrentLanguage, model, temperature} from "~/configs/openaiConfig";

export const translateContent = async (userContent: string, to: string) => {

  let currentLanguage = getCurrentLanguage(to)
  const body = {
    messages: [
      {
        role: 'system',
        content: `${currentLanguage.systemPrompt}`
      },
      {
        role: 'system',
        content: `${currentLanguage.systemPrompt2}`
      },
      {
        role: 'system',
        content: `${currentLanguage.systemPrompt3}`
      },
      {
        role: 'system',
        content: `${currentLanguage.systemPrompt4}`
      },
      {
        role: 'user',
        content: `${currentLanguage.userPrompt}: '${userContent}'`
      }
    ],
    model: model,
    temperature: temperature,
    stream: false,
    response_format: {
      type: 'json_object'
    }
  }

  // console.log('requestBody->>>>', body);
  const translateResult = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    }
  })
    .then(v => v.json()).catch(err => console.log(err)) || undefined;
  // console.log('translateResult->>>>', translateResult);
  if (!translateResult) {
    return userContent;
  }

  // console.log('translateResult.choices[0].message-->>>>', translateResult.choices[0].message);
  // console.log('translateResult.choices[0].message?.content-->>>>', translateResult.choices[0].message?.content);
  let translateResultText = userContent;
  try {
    if (translateResult?.choices[0]?.message?.content) {
      translateResultText = JSON.parse(translateResult?.choices[0]?.message?.content).text || '';
    }
    return translateResultText;
  } catch (e) {
    console.log(e);
    return userContent;
  }

}




