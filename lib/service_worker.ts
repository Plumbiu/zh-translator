import { SelectAutoDetectValue } from './constants'
import { TranslateTypeEnum } from './types'

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const word = request.word?.trim()
  if (request.type === TranslateTypeEnum.Detect) {
    sendResponse({ translation: '' })
  } else if (request.type === TranslateTypeEnum.Translate) {
    const sourceLanguage = request.sourceLanguage || SelectAutoDetectValue
    const targetLanguage = request.targetLanguage || navigator.language
    ;(async () => {
      try {
        if (!word) {
          sendResponse({ translation: '' })
          return
        }
        if (sourceLanguage !== SelectAutoDetectValue) {
          const translator = await Translator.create({
            sourceLanguage,
            targetLanguage,
          })

          const translatorResult = await translator.translate(word)
          sendResponse({
            type: TranslateTypeEnum.Translate,
            translation: translatorResult,
          })
        } else {
          const detectorAvailability = await LanguageDetector.availability()
          if (detectorAvailability === 'available') {
            const detector = await LanguageDetector.create()
            // most likely language
            const detectorResult = (await detector.detect(word))[0]
            if (!detectorResult.detectedLanguage) {
              throw new Error('未找到翻译')
            }
            const translator = await Translator.create({
              sourceLanguage: detectorResult.detectedLanguage,
              targetLanguage,
            })

            const translatorResult = await translator.translate(word)
            sendResponse({
              type: TranslateTypeEnum.Translate,
              translation: translatorResult,
              sourceLanguage: detectorResult.detectedLanguage,
            })
          }
        }
      } catch (error: any) {
        sendResponse({
          type: TranslateTypeEnum.Translate,
          translation: error.message,
          error: true,
        })
      }
    })()
  }
  return true
})
