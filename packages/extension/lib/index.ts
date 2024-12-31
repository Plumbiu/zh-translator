import { Translation } from 'zh-translator'

let word: string
const EnRegx = /\w+/
const ButtonHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 20.462l-.846-2.538H5.23q-.698 0-1.195-.496q-.497-.497-.497-1.195V5.238q0-.698.496-1.199q.498-.5 1.196-.5h5.077l.74 2.537h7.721q.74 0 1.217.475t.476 1.216v10.995q0 .698-.476 1.199t-1.217.5zm-4.091-6.266q1.466 0 2.396-.941t.93-2.443q0-.22-.003-.344t-.046-.241H7.825v1.3h1.898q-.18.604-.647.934q-.466.33-1.145.33q-.827 0-1.421-.604t-.594-1.456t.59-1.456t1.413-.604q.379 0 .712.134t.619.42l1.033-.983q-.448-.454-1.072-.715t-1.32-.261q-1.416 0-2.42 1.014q-1.006 1.014-1.006 2.45t1.01 2.452t2.434 1.014m5.653.423l.473-.448q-.293-.367-.551-.7t-.476-.705zm1.057-1.082q.596-.696.905-1.328t.415-1h-3.36l.25.895h.833q.167.319.402.687t.555.745m-1.773 6.08h5.923q.381 0 .614-.244q.232-.243.232-.602V7.777q0-.38-.232-.618q-.233-.236-.613-.236h-7.46l.99 3.435h1.666v-.89h.865v.89h3.092v.852h-1.082q-.212.796-.626 1.561q-.413.766-.992 1.425l2.302 2.271l-.61.61L14.62 14.8l-.765.771l.685 2.352z"/></svg>`
const ButtonLoadingText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path><path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity=".3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0"/></path></g></svg>`

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
floatButton.addEventListener('click', async () => {
  if (!word) {
    return
  }
  floatButton.innerHTML = ButtonLoadingText
  chrome.runtime.sendMessage({ word }, (request) => {
    const translation: Translation[] = request?.translation
    if (!translation || translation.length === 0) {
      floatSlot.innerHTML = `<div style="padding: 6px 12px;">未找到翻译</div>`
    } else {
      floatSlot.innerHTML = `
      <div>
      ${translation
        .map(
          (t) => `
        <div class="__translate__float__slot_item">
          <div class="__translate__float__slot_header">${t.word}</div>
          <div style="text-indent:1em;">
            <div>
              ${t.translation
                .split('\\n')
                .map((item) => `<div>${item}</div>`)
                .join('')}
            </div>
            <div>
              ${t.inflection
                .map(
                  (item) => `
              <div>
                <span class="__translate__float__slot_type">${item.type}:&nbsp;</span>
                <span>${item.value}</span>
              </div>`,
                )
                .join('')}
            </div>
          </div>
        </div>`,
        )
        .join('')}
      </div>
      `.trim()
    }
    floatVisible = true
    floatButton.style.display = 'none'
    floatSlot.style.display = 'block'
    float.style.display = 'block'
    floatButton.innerHTML = ButtonHtml
  })
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
      word = text
      float.style.display = 'block'
      float.style.top = `${rect.top + window.scrollY + rect.height + 4}px`
      float.style.left = `${rect.left + window.scrollX + rect.width / 2}px`
      floatButton.style.display = 'flex'
    }
  } catch (error) {}
}
