Простейший скрипт, преобразовывающий xml с названиями и тегами эмоджи в json.

Данные для новых языков: http://unicode.org/repos/cldr/tags/latest/common/annotations/

### Установка
```bash
# если на винде (от имени администратора)
npm install --global --production windows-build-tools

npm i
```

### Использование
```bash
node converter.js xml_with_emojies.xml
```

### Схема
```json
"😂": {
  "en": {
    "name": "face with tears of joy",
    "keywords": "face joy laugh tear"
  },
  "ru": {
    "name": "смех до слез",
    "keywords": "лицо смех слезы радость"
  }
}
```