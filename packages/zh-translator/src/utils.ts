import lastWords from './lastWords'

export function getKey(word: string) {
  for (let i = 0; i < lastWords.length; i++) {
    const lastWord = lastWords[i]
    if (word.localeCompare(lastWord) <= 0) {
      console.log(i)
      return i.toString().padStart(3, '0')
    }
  }
}

function upperFirstChar(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
function lowererFirstChar(str: string): string {
  return str.charAt(0).toLocaleLowerCase() + str.slice(1)
}
const CamelRegx = /([A-Z])/g
export function camelToSnakeLike(str: string): string {
  const firstChar = str[0]
  const rest = str.slice(1)
  return firstChar + rest.replace(CamelRegx, (_, letter) => '_' + letter)
}
const NonAlphaRegx = /[^a-zA-Z]+/
export function enumWords(word: string) {
  const keys: Set<string> = new Set()
  if (!word) {
    return keys
  }
  // 1. 首字母大写, 首字母小写，全小写，全大写
  keys.add(upperFirstChar(word))
  keys.add(lowererFirstChar(word))
  keys.add(word.toLowerCase())
  keys.add(word.toUpperCase())
  // 2. 非字母字符
  const nonAlphaKeys = word.split(NonAlphaRegx)
  if (nonAlphaKeys.length >= 2) {
    for (const token of nonAlphaKeys) {
      const newKeys = enumWords(token)
      newKeys.forEach((newKey) => newKey && keys.add(newKey))
    }
  }
  // 3. 驼峰 HelloWorld => Hello_world（全大写不执行）
  if (word.toUpperCase() !== word) {
    const camelKeys = camelToSnakeLike(word).split('_')
    // 3.1 Hello World => Hello world, hello world, HELLO WORLD
    const wordWithWhite = camelKeys.join(' ')
    keys.add(wordWithWhite)
    keys.add(wordWithWhite.toLowerCase())
    keys.add(wordWithWhite.toUpperCase())
    if (camelKeys.length >= 2) {
      for (const token of camelKeys) {
        const newKeys = enumWords(token)
        newKeys.forEach((newKey) => newKey && keys.add(newKey))
      }
    }
  }

  return keys
}
