import { Inflection } from './types'
// @ts-ignore
import inflectionData from './inflection-data'
const InflectionMap: Record<string, string> = {
  p: '过去式',
  d: '过去分词',
  i: '现在分词',
  3: '第三人称单数',
  r: '比较级',
  t: '最高级',
  s: '复数',
  0: '原型',
}
function parseTokens(tokens: string[], transformed?: string) {
  const results: Inflection[] = []
  const map: Record<string, string> = {}
  for (const token of tokens) {
    const inflectionKey = token[0]
    const value = token.slice(2)

    if (value === transformed) {
      continue
    }
    map[inflectionKey] = value
  }
  // API:"s:api/0:api/1:s"
  for (const key in map) {
    const value = map[key]
    const inflectionType = InflectionMap[key]
    results.push({ type: inflectionType, value: map[value] ?? value })
  }
  return results
}

export async function parseInflection(key: string): Promise<Inflection[]> {
  try {
    const inflection = inflectionData[key]
    if (!inflection) {
      return []
    }
    const tokens = inflection.split('/')

    if (inflection.includes('0:')) {
      // 不是原型
      for (const token of tokens) {
        if (token[0] === '0' && token[1] === ':') {
          const origin = token.slice(2)
          const data = inflectionData[origin]
          if (data) {
            return [
              { type: '原型', value: origin },
              ...parseTokens(data.split('/'), key),
            ]
          }
        }
      }
    }
    return parseTokens(tokens)
  } catch (error) {
    return []
  }
}
