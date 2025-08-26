import { SelectAutoDetectValue } from './constans/variables'
import { TranslateTypeEnum } from './types'
import { detectLanguage, translate } from './utils/translate'

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const word = request.word?.trim()
  if (request.type === TranslateTypeEnum.Detect) {
    sendResponse({ translation: '' })
  } else if (request.type === TranslateTypeEnum.Translate) {
    const sourceLanguage = request.sourceLanguage || SelectAutoDetectValue
    const targetLanguage = request.targetLanguage || navigator.language
    if (sourceLanguage === targetLanguage) {
      // same language, reponse original word
      sendResponse({
        type: TranslateTypeEnum.Translate,
        translation: word,
      })
      return true
    }
    ;(async () => {
      try {
        if (sourceLanguage !== SelectAutoDetectValue) {
          const translatorResult = await translate(word, {
            sourceLanguage: navigator.language,
            targetLanguage,
          })
          sendResponse({
            type: TranslateTypeEnum.Translate,
            translation: translatorResult,
          })
        } else {
          const detectorAvailability = await LanguageDetector.availability()
          if (detectorAvailability === 'available') {
            // most likely language
            const detectorResult = await detectLanguage(word)
            if (!detectorResult.detectedLanguage) {
              throw new Error('Unknown language')
            }
            const translatorResult = await translate(word, {
              sourceLanguage: detectorResult.detectedLanguage,
              targetLanguage,
            })
            sendResponse({
              type: TranslateTypeEnum.Translate,
              translation: translatorResult,
              sourceLanguage: detectorResult.detectedLanguage,
            })
          } else if (detectorAvailability === 'downloading') {
            console.log('downloading')
          }
        }
      } catch (error: any) {
        sendResponse({
          type: TranslateTypeEnum.Translate,
          translation: error.message,
          style: 'color: lightred;',
        })
      }
    })()
  }
  return true
})
