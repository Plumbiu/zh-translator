import { getSingletonFloatDom } from "./create"
import { getTranslateWord, setTranslateWord } from "../word"
import { ButtonLoadingHtml } from "./html"
import { EnRegx } from "../constants"
import { TranslateTypeEnum } from "../types"

const { floatButton, floatSlot, float } = getSingletonFloatDom()

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

let floatVisible = false
function hideFloat() {
  floatVisible = false
  float.style.display = 'none'
  floatSlot.style.display = 'none'
  floatSlot.innerHTML = ''
}

floatButton.addEventListener('click', async () => {
  const word = getTranslateWord()
  if (!word) {
    return
  }
  floatButton.innerHTML = ButtonLoadingHtml

  chrome.runtime.sendMessage({ type: TranslateTypeEnum.Translate, word })
})

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