let translateWord: string

// 设置需要翻译的单词
export const setTranslateWord = (w: string) => {
  translateWord = w
}
// 获取需要翻译的单词
export const getTranslateWord = () => {
  return translateWord
}