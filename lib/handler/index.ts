import { floatSlotResultDom, selectSourceLanguageDom } from '../dom/create'
import { TranslateTypeEnum } from '../types'

export const translateHandler = (response: any) => {
  if (response.type === TranslateTypeEnum.Translate) {
    const translation = response?.translation
    const style = response.error ? 'color: lightred;' : ''
    console.log({ response })
    if (response.sourceLanguage) {
      // 元素第一项
      const firstOptionDom = selectSourceLanguageDom.querySelector('option')
      console.log({ firstOptionDom })
      if (firstOptionDom) {
        firstOptionDom.innerText = `Auto (${response.sourceLanguage})`
      }
    }
    if (!translation || translation.length === 0) {
      floatSlotResultDom.innerHTML = `<span style="${style}">未找到翻译</span>`
    } else {
      floatSlotResultDom.innerHTML = `<span style="${style}">${translation}</span>`
    }
  }
}
