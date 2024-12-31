import fs from 'node:fs'
import Zip from 'adm-zip'
import manifest from '../manifest.json'

function run() {
  if (fs.existsSync('./build')) {
    fs.rmSync('./build', { recursive: true })
  }
  fs.mkdirSync('./build')
  const zip = new Zip()
  zip.addLocalFile('./manifest.json')
  zip.addLocalFolder('./data', 'data')
  zip.addLocalFolder('./dist', 'dist')
  zip.addLocalFolder('./icons', 'icons')
  zip.addLocalFolder('./style', 'style')
  zip.writeZip(`./build/zh-translator-v${manifest.version}.zip`)
}

run()
