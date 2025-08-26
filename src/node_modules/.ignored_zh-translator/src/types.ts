export interface Inflection {
  type: string
  value: string
}

export interface Translation {
  word: string
  translation: string
  inflection: Inflection[]
}
