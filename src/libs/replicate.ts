import {translateContent} from "~/servers/translate";


export const getInput = async (textStr, checkSubscribeStatus) => {
  // 翻译成英语后返回
  const revised_text = await translateContent(textStr, 'en');

  let width = 512;
  let height = 512;
  let upscale = false;
  if (checkSubscribeStatus) {
    width = 1024;
    height = 1024
  }

  return {
    steps: 20,
    width: width,
    height: height,
    prompt: revised_text,
    upscale: upscale,
    upscale_steps: 2,
    negative_prompt: "NSFW. No nudity or explicit content.No violence or gore.No sexual themes.Suitable for all ages.No illegal activities or substances.General audience appropriate.No offensive material.No hate speech or discrimination.Nothing disturbing or shocking.Respectful, non-exploitative content."
  }
}
