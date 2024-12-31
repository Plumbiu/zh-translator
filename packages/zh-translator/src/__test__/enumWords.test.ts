import { test, expect } from 'vitest'
import { enumWords } from '../utils'

test('enum - HelloWorld', () => {
  const word = 'HelloWorld'
  const results = [
    'HelloWorld',
    'helloWorld',
    'HELLOWORLD',
    'helloworld',
    'hello',
    'Hello',
    'HELLO',
    'world',
    'World',
    'WORLD',
    'Hello World',
    'hello world',
    'HELLO WORLD',
  ]
  const set = enumWords(word)
  expect(set.size).toBe(results.length)
  results.forEach((result) => {
    expect(set.has(result)).toBeTruthy
  })
})

test('enum - do', () => {
  const word = 'do'
  const results = ['Do', 'do', 'DO']
  const set = enumWords(word)
  expect(set.size).toBe(results.length)
  results.forEach((result) => {
    expect(set.has(result)).toBeTruthy
  })
})

test('enum - all upper case', () => {
  const word = 'HELLO'
  const results = ['HELLO', 'Hello', 'hello']
  const set = enumWords(word)
  expect(set.size).toBe(results.length)
  set.forEach((result) => {
    expect(results.includes(result)).toBeTruthy
  })
})
