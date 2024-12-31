import { test, expect } from 'vitest'
import { camelToSnakeLike } from '../utils'

test('camelToSnakeLike - HelloWorld', () => {
  const word = 'HelloWorld'
  const result = 'Hello_World'
  expect(camelToSnakeLike(word)).toBe(result)
})
