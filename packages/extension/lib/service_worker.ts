import { translate, getKey, enumWords } from 'zh-translator'

const GetDataUrl = () => './data/'

const getDataUrl = (word: string) => {
  const key = getKey(word)
  return chrome.runtime.getURL(`${GetDataUrl()}/${key}.json`)
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const word = request.word?.trim()
  const words = enumWords(word)
  if (!word || words.size === 0) {
    sendResponse({ translation: [] })
  } else {
    ;(async () => {
      let map = {}
      try {
        await Promise.all(
          [...words].map(async (word) => {
            const data = await fetch(getDataUrl(word)).then((res) => res.json())
            console.log(data)
            map = { ...map, ...data }
          }),
        )
        const translation = await translate(word, { map })
        sendResponse({ translation })
      } catch (error) {
        console.log(error)
        sendResponse({ translation: [] })
      }
    })()

    return true
  }
})
