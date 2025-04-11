export const getResultStrAddSticker = (input_text, keyword) => {
  // 检查字符串是否以 keyword 结尾
  if (input_text.endsWith(keyword)) {
    // 如果是，直接返回原始字符串
    return input_text;
  } else {
    // 如果不是，添加 keyword 后缀
    return input_text + ' ' + keyword;
  }
}
