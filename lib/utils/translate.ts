import { TranslateTypeEnum } from '../types'

interface TranslateOptions {
  sourceLanguage: string
  targetLanguage: string
}

const sendDownloadProgress = (progress: string, done: boolean) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: TranslateTypeEnum.Download,
        done,
        progress,
        style: 'color: lightblue;',
      })
    }
  })
}

export async function translate(
  word: string,
  { sourceLanguage, targetLanguage }: TranslateOptions,
) {
  const translatorCapabilities = await Translator.availability({
    sourceLanguage,
    targetLanguage,
  })
  if (translatorCapabilities === 'downloadable') {
    sendDownloadProgress('Downloading model 0%...', false)
  }
  console.log({ translatorCapabilities })
  const translator = await Translator.create({
    sourceLanguage,
    targetLanguage,
    monitor: (monitor) => {
      if (
        translatorCapabilities === 'downloading' ||
        translatorCapabilities === 'downloadable'
      ) {
        monitor.addEventListener('downloadprogress', (event) => {
          sendDownloadProgress(
            `Downloading model ${((event.loaded / event.total) * 100).toFixed(
              2,
            )}%...`,
            false,
          )
        })
      }
    },
  })

  const translatorResult = await translator.translate(word)
  return translatorResult
}

export async function detectLanguage(word: string) {
  const detectorCapabilities = await LanguageDetector.availability()
  if (detectorCapabilities === 'downloadable') {
    sendDownloadProgress('Downloading model 0%...', false)
  }
  const detector = await LanguageDetector.create({
    monitor: (monitor) => {
      if (
        detectorCapabilities === 'downloading' ||
        detectorCapabilities === 'downloadable'
      ) {
        monitor.addEventListener('downloadprogress', (event) => {
          sendDownloadProgress(
            `Downloading model ${((event.loaded / event.total) * 100).toFixed(
              2,
            )}%...`,
            false,
          )
        })
      }
    },
  })
  const detectorResult = (await detector.detect(word))[0]
  return detectorResult
}
