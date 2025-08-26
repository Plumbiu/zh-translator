
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const word = request.word?.trim()
  if (!word) {
    sendResponse({ translation: [] })
  } else {
    ;(async () => {
      let map = {}
      try {
        const detectorAvailability = await LanguageDetector.availability()
        if (detectorAvailability === 'unavailable') {
          const detector = await LanguageDetector.create({
            monitor(m) {
              m.addEventListener('downloadprogress', (e) => {
                console.log(`Downloaded ${e.loaded * 100}%`);
              });
            },
          });
        }
        const translatorAvailability = await Translator.availability()
        console.log(detectorAvailability, translatorAvailability)
        sendResponse({ translation: [] })
      } catch (error) {
        console.log(error)
        sendResponse({ translation: [] })
      }
    })()

    return true
  }
})
