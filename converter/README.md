Скрипт, преобразовывающий xml с названиями и тегами эмоджи в json.

Данные для новых языков: http://unicode.org/repos/cldr/tags/latest/common/annotations/
Первая версия схемы здесь: 7d5d3d2fe837d2644051d2fa490c436ed843044a

#### Зачем?
1) 381 мс vs. 1 180 мс *производительность без оптимизаций*
2) 166 кб vs. 406 кб *(для двух языков)*

### Установка
```bash
# если на винде (от имени администратора)
npm install --global --production windows-build-tools

npm i
```

### Использование
```bash
node converter.js lang1.xml [lang2.xml, lang3.xml...]

# например
node converter.js ru.xml en.xml
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