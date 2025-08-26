离线中英文翻译“单词”，支持浏览器和 nodejs 环境


# 安装

```bash
npm install zh-translator
```

# 使用

```js
import { translate } from 'zh-translator'

await translate('do')
/*
[{
  word: 'do',
  translation: 'v. 做, 进行, 完成',
  inflection: [
    { type: '现在分词', value: 'doing' },
    { type: '过去式', value: 'did' },
    { type: '第三人称单数', value: 'does' },
    { type: '过去分词', value: 'done' },
  ],
}]
*/

await translate('HelloWorld')
/*
[
  { word: 'hello world', translation: '你好世界', inflection: [] },
  {
    word: 'hello',
    translation: 'interj. 喂, 嘿',
    inflection: [{ type: '复数', value: 'hellos' }],
  },
  {
    word: 'world',
    translation:
      'n. 世界, 地球, 宇宙, 万物, 世人, 人间, 领域, 世事, 世故, 社会生活, 大量\\n[法] 世界, 地球, 世人',
    inflection: [{ type: '复数', value: 'worlds' }],
  },
]
*/
```
