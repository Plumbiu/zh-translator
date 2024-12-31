import { enumWords, getKey } from './utils'
import { Translation } from './types'
import { parseInflection } from './inflection'

export interface TranslateOptions {
  map?: Record<string, string>
}

export async function translate(
  word: string | number,
  { map }: TranslateOptions = {},
) {
  try {
    const words = enumWords(String(word).trim())
    const results = await Promise.all(
      [...words].map(async (word) => {
        let value: string
        if (map) {
          value = map[word]
        } else {
          const key = getKey(word)
          if (!key) {
            return
          }
          const url = `../data/${getKey(word)}.js`
          const data = (await import(url)).default
          value = data[word]
        }
        if (value) {
          const inflection = await parseInflection(word)
          return {
            word,
            translation: value,
            inflection,
          } as const
        }
      }),
    )
    return results.filter(Boolean) as Translation[]
  } catch (error) {
    return []
  }
}

export { type Translation } from './types'

export { enumWords, getKey } from './utils'
