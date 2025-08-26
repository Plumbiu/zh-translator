import { ButtonHtml } from './html'

// Element
const float = document.createElement('div')
float.classList.add('__translate__float__')
const floatSlot = document.createElement('div')
floatSlot.classList.add('__translate__float__slot')
const floatButton = document.createElement('div')
floatButton.classList.add('__translate__float__button')
floatButton.innerHTML = ButtonHtml
float.appendChild(floatButton)
float.appendChild(floatSlot)
document.body.appendChild(float)

export const getSingletonFloatDom = () => {
  return {
    float,
    floatSlot,
    floatButton,
  }
}

