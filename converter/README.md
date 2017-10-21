Простейший скрипт, преобразовывающий xml с названиями и тегами эмоджи в json.

Данные для новых языков: http://unicode.org/repos/cldr/tags/latest/common/annotations/

#### Зачем?
1) Парсить xml в браузере значить строить DOM дерево, что для 2400 элементов (только для одного языка) тяжеловата, а тут ещё и xpath каждый раз
2) 196 кб vs. 406 кб *(для двух языков)*

### Установка
```bash
# если на винде (от имени администратора)
npm install --global --production windows-build-tools

npm i
```

### Использование
```bash
node converter.js in.xml [out.json]
# где in.xml — файлик с сайта юникода,
# а out.json — сгенерированный конвертером файл

# например
node converter.js ru.xml # генерим файлик
node converter.js en.xml emojies.json # добавляем английский
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