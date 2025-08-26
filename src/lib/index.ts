import { TranslateTypeEnum } from './types'
import { EnRegx } from './constants'
import { getSingletonFloatDom } from './dom/create'
import { ButtonHtml, ButtonLoadingHtml } from './dom/html'
import { getTranslateWord, setTranslateWord } from './word'

// Element
const { floatButton, floatSlot, float } = getSingletonFloatDom()

floatButton.addEventListener('click', async () => {
  const word = getTranslateWord()
  if (!word) {
    return
  }
  floatButton.innerHTML = ButtonLoadingHtml

  chrome.runtime.sendMessage({ type: TranslateTypeEnum.Translate, word })
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === TranslateTypeEnum.Translate) {
    const translation = request?.translation
    if (!translation || translation.length === 0) {
      floatSlot.innerHTML = `<div style="padding: 6px 12px;">未找到翻译</div>`
    } else {
      floatSlot.innerHTML = `<div style="padding: 6px 12px;">${translation}</div>`
    }
    floatVisible = true
    floatButton.style.display = 'none'
    floatSlot.style.display = 'block'
    float.style.display = 'block'
    floatButton.innerHTML = ButtonHtml
  }
})


let floatVisible = false
function hideFloat() {
  floatVisible = false
  float.style.display = 'none'
  floatSlot.style.display = 'none'
  floatSlot.innerHTML = ''
}

document.addEventListener('mousedown', (e) => {
  const target = e.target as Node
  if (floatVisible) {
    if (!float.contains(target)) {
      hideFloat()
    }
  } else {
    if (!floatButton.contains(target)) {
      floatButton.style.display = 'none'
    }
  }
})

document.addEventListener('mouseup', (e) => {
  if (floatVisible && float.contains(e.target as Node)) {
    return
  }
  setFloatPosition()
})

function setFloatPosition() {
  const selection = window.getSelection()
  if (!selection) {
    return
  }
  try {
    const text = selection.toString().trim()
    const range = selection.getRangeAt(0)
    if (EnRegx.test(text) && text) {
      const rect = range.getBoundingClientRect()
      setTranslateWord(text)
      float.style.display = 'block'
      float.style.top = `${rect.top + window.scrollY + rect.height + 4}px`
      float.style.left = `${rect.left + window.scrollX + rect.width / 2}px`
      floatButton.style.display = 'flex'
    }
  } catch (error) { }
}
