import { TranslateTypeEnum } from '../types'
import { getTranslateWord, getFloatVisible, getLastSelection, setSourceLanguage, setTargetLanguage, getTargetLanguage, getSourceLanguage } from '../glbal-variables'
import { ButtonHtml, ButtonLoadingHtml, SelectSourceLanguageHtml, SelectTargetLanguageHtml } from './html'
import { hideFloat, hideFloatButton, setFloatPosition, showFloat } from './utils'
import { translateHandler } from '../handler'

// Element
export const floatDom = document.createElement('div')
export const floatSlotDom = document.createElement('div')
export const floatSlotResultDom = document.createElement('div')
export const floatButtonDom = document.createElement('div')
export const floatSelectContainerDom = document.createElement('div')
export const selectTargetLanguageDom = document.createElement('select')
export const selectSourceLanguageDom = document.createElement('select')

floatDom.classList.add('__translate__float__')
floatSlotDom.classList.add('__translate__float__slot')
floatSlotResultDom.classList.add('__translate__float__slot_result')
floatButtonDom.classList.add('__translate__float__button')
floatSelectContainerDom.classList.add('__translate__float__select_container')
selectTargetLanguageDom.classList.add('__translate__float__select')
selectSourceLanguageDom.classList.add('__translate__float__select')
selectSourceLanguageDom.classList.add('__translate__float__select_source')

floatButtonDom.innerHTML = ButtonHtml
selectTargetLanguageDom.innerHTML = SelectTargetLanguageHtml
selectSourceLanguageDom.innerHTML = SelectSourceLanguageHtml

floatDom.appendChild(floatButtonDom)
floatDom.appendChild(floatSlotDom)
floatSlotDom.appendChild(floatSelectContainerDom)
floatSelectContainerDom.appendChild(selectSourceLanguageDom)
floatSelectContainerDom.appendChild(selectTargetLanguageDom)
floatSlotDom.appendChild(floatSlotResultDom)
document.body.appendChild(floatDom)

floatButtonDom.addEventListener('click', async () => {
  const word = getTranslateWord()
  if (!word) {
    return
  }
  hideFloatButton()
  showFloat()
  floatSlotResultDom.innerHTML = ButtonLoadingHtml
  chrome.runtime.sendMessage({ type: TranslateTypeEnum.Translate, word }, translateHandler)
})

selectTargetLanguageDom.addEventListener('change', (e) => {
  const word = getLastSelection()?.toString().trim()
  if (!word) {
    return
  }
  const targetLanguage = (e.target as HTMLSelectElement).value
  setTargetLanguage(targetLanguage)
  showFloat()
  floatSlotResultDom.innerHTML = ButtonLoadingHtml
  const sourceLanguage = getSourceLanguage()
  chrome.runtime.sendMessage({ type: TranslateTypeEnum.Translate, word, targetLanguage, sourceLanguage }, translateHandler)
})

selectSourceLanguageDom.addEventListener('change', (e) => {
  const word = getLastSelection()?.toString().trim()
  if (!word) {
    return
  }
  const targetLanguage = getTargetLanguage()
  const sourceLanguage = (e.target as HTMLSelectElement).value
  setSourceLanguage(sourceLanguage)
  chrome.runtime.sendMessage({ type: TranslateTypeEnum.Translate, word, targetLanguage, sourceLanguage }, translateHandler)
})


document.addEventListener('mousedown', (e) => {
  const target = e.target as Node
  const floatVisible = getFloatVisible()
  if (floatVisible) {
    if (!floatDom.contains(target)) {
      hideFloat()
    }
  } else {
    if (!floatButtonDom.contains(target)) {
      floatButtonDom.style.display = 'none'
    }
  }
})

document.addEventListener('mouseup', (e) => {
  const floatVisible = getFloatVisible()
  if (floatVisible && floatDom.contains(e.target as Node)) {
    return
  }
  setFloatPosition()
})
