import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { minify_sync } from 'terser'
import data0 from '../dictionary/词典0'
import data1 from '../dictionary/词典1'
import data2 from '../dictionary/词典2'
import data3 from '../dictionary/词典3'
import data4 from '../dictionary/词典4'
import data5 from '../dictionary/词典5'
import data6 from '../dictionary/词典6'
import data7 from '../dictionary/词典7'
import data8 from '../dictionary/词典8'
import data9 from '../dictionary/词典9'
import data10 from '../dictionary/词典10'
import data11 from '../dictionary/词典11'
import data12 from '../dictionary/词典12'
import data13 from '../dictionary/词典13'
import data14 from '../dictionary/词典14'
import data15 from '../dictionary/词典15'

function minify(code: string) {
  return minify_sync(code).code
}

let results: [string, string][] = []
let count = 0
const lastWords: string[] = []
async function writeData(data: Record<string, string>) {
  for (let key in data) {
    if (key[0] === '-' || key.includes(' ')) {
      continue
    }
    results.push([key, data[key].trim()])
    const len = results.length
    if (len === 2500) {
      const lastWord = results[len - 1]
      lastWords.push(lastWord[0])
      const jsonData = JSON.stringify(Object.fromEntries(results))
      const filename = String(count).padStart(3, '0')
      const minifyCode = minify(`export default ${jsonData}`)
      if (!minifyCode) {
        continue
      }
      await fsp.writeFile(
        `./packages/extension/data/${filename}.json`,
        jsonData,
        { encoding: 'utf-8' },
      )
      await fsp.writeFile(
        `./packages/zh-translator/data/${filename}.js`,
        minifyCode,
        { encoding: 'utf-8' },
      )
      count++
      results = []
    }
  }
}

async function run() {
  if (fs.existsSync('./packages/extension/data')) {
    fs.rmSync('./packages/extension/data', { recursive: true })
  }
  if (fs.existsSync('./packages/zh-translator/data')) {
    fs.rmSync('./packages/zh-translator/data', { recursive: true })
  }
  fs.mkdirSync('./packages/extension/data', { recursive: true })
  fs.mkdirSync('./packages/zh-translator/data', { recursive: true })
  await writeData(data0)
  await writeData(data1)
  await writeData(data2)
  await writeData(data3)
  await writeData(data4)
  await writeData(data5)
  await writeData(data6)
  await writeData(data7)
  await writeData(data8)
  await writeData(data9)
  await writeData(data10)
  await writeData(data11)
  await writeData(data12)
  await writeData(data13)
  await writeData(data14)
  await writeData(data15)

  await fsp.writeFile(
    './packages/zh-translator/src/lastWords.ts',
    `export default ${JSON.stringify(lastWords)}`,
    { encoding: 'utf-8' },
  )
}

run()
