import { TranslateTypeEnum } from '../types'

interface TranslateOptions {
  sourceLanguage: string
  targetLanguage: string
}

export async function translate(
  word: string,
  { sourceLanguage, targetLanguage }: TranslateOptions,
) {
  const translatorCapabilities = await Translator.availability({
    sourceLanguage,
    targetLanguage,
  })
  const translator = await Translator.create({
    sourceLanguage,
    targetLanguage,
    monitor: (monitor) => {
      if (translatorCapabilities === 'downloading') {
        monitor.addEventListener('downloadprogress', (event) => {
          console.log(event)
          // 使用 chrome.tabs.sendMessage 向当前活动标签页发送消息
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: TranslateTypeEnum.Download,
                done: event.total === event.loaded,
                progress: `Downloading model ${
                  +(event.loaded / event.total).toFixed(3) * 100
                }%...`,
                style: 'color: lightblue;',
              })
            }
          })
        })
      }
    },
  })

  const translatorResult = await translator.translate(word)
  return translatorResult
}

export async function detectLanguage(word: string) {
  const detectorCapabilities = await LanguageDetector.availability()
  const detector = await LanguageDetector.create({
    monitor: (monitor) => {
      if (detectorCapabilities === 'downloading') {
        monitor.addEventListener('downloadprogress', (event) => {
          console.log(event)
          // 使用 chrome.tabs.sendMessage 向当前活动标签页发送消息
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: TranslateTypeEnum.Download,
                done: event.total === event.loaded,
                progress: `Downloading model ${
                  +(event.loaded / event.total).toFixed(3) * 100
                }%...`,
                style: 'color: lightblue;',
              })
            }
          })
        })
      }
    },
  })
  const detectorResult = (await detector.detect(word))[0]
  return detectorResult
}
