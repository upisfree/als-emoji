Скрипт, преобразовывающий xml с названиями и тегами эмоджи в json.

Данные для новых языков: http://unicode.org/repos/cldr/tags/latest/common/annotations/

Первая версия схемы здесь: https://github.com/upisfree/als-emoji/tree/7d5d3d2fe837d2644051d2fa490c436ed843044a/converter

#### Зачем?
1) 601 кб vs. 1,56 мб *(для восьми языков)*
2) нормальный и быстрый поиск, т.к. всё уже в одном файле и не надо использовать xpath 

### Установка
```bash
# если на винде (от имени администратора)
npm install --global --production windows-build-tools

npm i
```

### Использование
```bash
node converter.js lang1.xml [lang2.xml, lang3.xml...]
# или
node converter.js folder_with_langs/

# например
node converter.js ru.xml en.xml
node converter.js langs/
```

### Схема
```json
"ru": {
  "names": [
    "смех до слез": "😂",
    "улыбающееся лицо": "😀"
  ],
  "keywords": [
    "лицо": ["😀", "😁", "😂", "😄"],
    "человек": ["👨", "👩", "👴", "👮"]
  ]
},
"en": {
  "names": [
    "face with tears of joy": "😂",
    "grinning face": "😀"
  ],
  "keywords": [
    "face": ["😀", "😁", "😂", "😄"],
    "man": ["👨", "👩", "👴", "👮"]
  ]
}
```
