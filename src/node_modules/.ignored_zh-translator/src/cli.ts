import pc from 'picocolors'
import { translate } from '.'

async function run(word: string | number) {
  const result = await translate(word)
  if (!result) {
    return
  }
  console.log(`${pc.bold(word)}:`)
  if (result.length === 0) {
    console.log('Translate not found')
  } else {
    for (const { word, translation, inflection } of result) {
      console.log(`  ${pc.cyan(pc.bold(word))}: ${translation}`)
      for (const { type, value } of inflection) {
        console.log(`    ${pc.dim(type)}: ${value}`)
      }
    }
  }
  console.log(' ')
}

const testWords = [
  // 'do',
  // 'kitty',
  // 'hi',
  // 'hello',
  // 'ok',
  // 'zoomers',
  // 'youngness',
  // 'HelloWorld',
  // 'tetrahedron',
  // 'go',
  // 'golang',
  // 'HTML',
  // 'Css',
  // 'JavaScript',
  // 'AI',
  // 'API',
  // 'manage',
  1,
]

Promise.all(
  testWords.map(async (word) => {
    run(word)
  }),
)
