import {
  getLastSelection,
  setFloatVisible,
  setLastSelection,
  setTranslateWord,
} from '../glbal-variables'
import {
  floatDom,
  floatButtonDom,
  floatSlotDom,
  floatSlotResultDom,
} from './create'
import { ButtonHtml } from './html'

export function setFloatPosition() {
  const selection = getLastSelection() ?? window.getSelection()
  if (!selection) {
    return
  }
  setLastSelection(selection)
  try {
    const text = selection!.toString().trim()
    const range = selection!.getRangeAt(0)
    if (text) {
      const rect = range.getBoundingClientRect()
      setTranslateWord(text)
      floatDom.style.display = 'block'
      floatDom.style.top = `${rect.top + window.scrollY + rect.height + 4}px`
      floatDom.style.left = `${rect.left + window.scrollX + rect.width / 2}px`
      showFloatButton()
    }
  } catch (error) {}
}

export function hideFloat() {
  setFloatVisible(false)
  floatDom.style.display = 'none'
  floatSlotDom.style.display = 'none'
  floatSlotResultDom.innerText = ''
}

export function showFloat() {
  setFloatVisible(true)
  hideFloatButton()
  floatSlotDom.style.display = 'block'
  floatDom.style.display = 'block'
}

export function hideFloatButton() {
  floatButtonDom.style.display = 'none'
  floatButtonDom.innerHTML = ButtonHtml
}

export function showFloatButton() {
  floatButtonDom.style.display = 'flex'
}
