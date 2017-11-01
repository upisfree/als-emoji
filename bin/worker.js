(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__dirname){
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('Az', factory) :
  global.Az = factory()
}(this, function () { 'use strict';
  /** @namespace Az **/
  if (typeof require != 'undefined' && typeof exports === 'object' && typeof module !== 'undefined') {
    var fs = require('fs');
  }

  var Az = {
    load: function(url, responseType, callback) {
      if (fs) {
        fs.readFile(url, { encoding: responseType == 'json' ? 'utf8' : null }, function (err, data) {
          if (err) {
            callback(err);
            return;
          }

          if (responseType == 'json') {
            callback(null, JSON.parse(data));
          } else
          if (responseType == 'arraybuffer') {
            if (data.buffer) {
              callback(null, data.buffer);
            } else {
              var ab = new ArrayBuffer(data.length);
              var view = new Uint8Array(ab);
              for (var i = 0; i < data.length; ++i) {
                  view[i] = data[i];
              }
              callback(null, ab);
            }
          } else {
            callback(new Error('Unknown responseType'));
          }
        });
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = responseType;

      xhr.onload = function (e) {
        if (xhr.response) {
          callback && callback(null, xhr.response);
        }
      };

      xhr.send(null);
    },
    extend: function() {
      var result = {};
      for (var i = 0; i < arguments.length; i++) {
        for (var key in arguments[i]) {
          result[key] = arguments[i][key];
        }
      }
      return result;
    }
  };

  return Az;
}));

;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = module.exports || {}) && (module.exports.DAWG = factory(module.exports)) :
  typeof define === 'function' && define.amd ? define('Az.DAWG', ['Az'], factory) :
  (global.Az = global.Az || {}) && (global.Az.DAWG = factory(global.Az))
}(this, function (Az) { 'use strict';
  var ROOT = 0,
      MISSING = -1,
      PRECISION_MASK = 0xFFFFFFFF,
      HAS_LEAF_BIT = 1 << 8,
      EXTENSION_BIT = 1 << 9,
      OFFSET_MAX = 1 << 21,
      IS_LEAF_BIT = 1 << 31;

  var CP1251 = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16,
    17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32,
    33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48,
    49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64,
    65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80,
    81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96,
    97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112,
    113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127,
    1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192,
    1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182,
    183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213,
    1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223,
    1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230,
    1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237,
    1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246,
    1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253,
    8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190};

  var UCS2 = {};
  for (var k in CP1251) {
    UCS2[CP1251[k]] = String.fromCharCode(k);
    delete UCS2[0];
    delete UCS2[1];
  }

  // Based on all common ЙЦУКЕН-keyboards (both Windows and Apple variations)
  var COMMON_TYPOS = {
    'й': 'ёцыф', 'ц': 'йфыву', 'у': 'цывак', 'к': 'увапе', 'е': 'капрн', 'н': 'епрог', 'г': 'нролш', 'ш': 'голдщ', 'щ': 'шлджз', 'з': 'щджэх-', 'х': 'зжэъ-', 'ъ': 'хэ-ё',
    'ф': 'йцычяё', 'ы': 'йцувсчяф', 'в': 'цукамсчы', 'а': 'укепимсв', 'п': 'кенртима', 'р': 'енгоьтип', 'о': 'нгшлбьтр', 'л': 'гшщдюбьо', 'д': 'шщзжюбл', 'ж': 'щзхэюд', 'э': 'зхъжё',
    'ё': 'йфяъэ', 'я': 'ёфыч', 'ч': 'яфывс', 'с': 'чывам', 'м': 'свапи', 'и': 'мапрт', 'т': 'ипроь', 'ь': 'тролб', 'б': 'ьолдю', 'ю': 'блдж',
    '1': 'ёйц', '2': 'йцу', '3': 'цук', '4': 'уке', '5': 'кен', '6': 'енг', '7': 'нгш', '8': 'гшщ', '9': 'шщз', '0': 'щзх-', '-': 'зхъ', '=': '-хъ', '\\': 'ъэ', '.': 'южэ'
  };

  function offset(base) {
    return ((base >> 10) << ((base & EXTENSION_BIT) >> 6)) & PRECISION_MASK;
  }

  function label(base) {
    return base & (IS_LEAF_BIT | 0xFF) & PRECISION_MASK;
  }

  function hasLeaf(base) {
    return (base & HAS_LEAF_BIT & PRECISION_MASK) != 0;
  }

  function value(base) {
    return base & ~IS_LEAF_BIT & PRECISION_MASK;
  }

  var DAWG = function(units, guide, format) {
    this.units = units;
    this.guide = guide;
    this.format = format;
  }

  DAWG.fromArrayBuffer = function(data, format) {
    var dv = new DataView(data),
        unitsLength = dv.getUint32(0, true),
        guideLength = dv.getUint32(unitsLength * 4 + 4, true);
    return new DAWG(
      new Uint32Array(data, 4, unitsLength),
      new Uint8Array(data, unitsLength * 4 + 8, guideLength * 2),
      format);
  }

  DAWG.load = function(url, format, callback) {
    Az.load(url, 'arraybuffer', function(err, data) {
      callback(err, err ? null : DAWG.fromArrayBuffer(data, format));
    });
  }

  DAWG.prototype.followByte = function(c, index) {
    var o = offset(this.units[index]);
    var nextIndex = (index ^ o ^ (c & 0xFF)) & PRECISION_MASK;

    if (label(this.units[nextIndex]) != (c & 0xFF)) {
      return MISSING;
    }

    return nextIndex;
  }

  DAWG.prototype.followString = function(str, index) {
    index = index || ROOT;
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (!(code in CP1251)) {
        return MISSING;
      }
      index = this.followByte(CP1251[code], index);
      if (index == MISSING) {
        return MISSING;
      }
    }
    return index;
  }

  DAWG.prototype.hasValue = function(index) {
    return hasLeaf(this.units[index]);
  }

  DAWG.prototype.value = function(index) {
    var o = offset(this.units[index]);
    var valueIndex = (index ^ o) & PRECISION_MASK;
    return value(this.units[valueIndex]);
  }

  DAWG.prototype.find = function(str) {
    var index = this.followString(str);
    if (index == MISSING) {
        return MISSING;
    }
    if (!this.hasValue(index)) {
        return MISSING;
    }
    return this.value(index);
  }

  DAWG.prototype.iterateAll = function(index) {
    var results = [];
    var stack = [index];
    var key = [];
    var last = ROOT;
    var label;

    while (true) {
      index = stack[stack.length - 1];

      if (last != ROOT) {
        label = this.guide[index << 1];
        if (label) {
          index = this.followByte(label, index);
          if (index == MISSING) {
            return results;
          }
          key.push(label);
          stack.push(index);
        } else {
          do {
            label = this.guide[(index << 1) + 1];
            key.pop();
            stack.pop();
            if (!stack.length) {
              return results;
            }
            index = stack[stack.length - 1];
            if (label) {
              index = this.followByte(label, index);
              if (index == MISSING) {
                return results;
              }
              key.push(label);
              stack.push(index);
            }
          } while (!label);
        }
      }

      while (!this.hasValue(index)) {
        var label = this.guide[index << 1];
        index = this.followByte(label, index);
        if (index == MISSING) {
          return results;
        }
        key.push(label);
        stack.push(index);
      }

      // Only three formats supported
      if (this.format == 'words') {
        results.push([
          ((key[0] ^ 1) << 6) + (key[1] >> 1),
          ((key[2] ^ 1) << 6) + (key[3] >> 1)
        ]);
      } else
      if (this.format == 'probs') {
        results.push([
          ((key[0] ^ 1) << 6) + (key[1] >> 1),
          ((key[2] ^ 1) << 6) + (key[3] >> 1),
          ((key[4] ^ 1) << 6) + (key[5] >> 1)
        ]);
      } else {
        // Raw bytes
        results.push(key.slice());
      }
      last = index;
    }
  }

  // Features:
  //  replaces (е -> ё) (DONE)
  //  stutter (ннет -> нет, гоол -> гол, д-да -> да)
  //  typos (count-limited):
  //    swaps (солво -> слово)
  //    extra letters (свлово -> слово)
  //    missing letters (сово -> слово)
  //    wrong letters (сково -> слово)
  DAWG.prototype.findAll = function(str, replaces, mstutter, mtypos) {
    mtypos = mtypos || 0;
    mstutter = mstutter || 0;
    var results = [],
        prefixes = [['', 0, 0, 0, ROOT]],
        prefix, index, len, code, cur, typos, stutter;

    while (prefixes.length) {
      prefix = prefixes.pop();
      index = prefix[4], stutter = prefix[3], typos = prefix[2], len = prefix[1], prefix = prefix[0];

      // Done
      if (len == str.length) {
        if (typos < mtypos && !stutter) {
          // Allow missing letter(s) at the very end
          var label = this.guide[index << 1]; // First child
          do {
            cur = this.followByte(label, index);
            if ((cur != MISSING) && (label in UCS2)) {
              prefixes.push([ prefix + UCS2[label], len, typos + 1, stutter, cur ]);
            }
            label = this.guide[(cur << 1) + 1]; // Next child
          } while (cur != MISSING);
        }

        if (this.format == 'int') {
          if (this.hasValue(index)) {
            results.push([prefix, this.value(index)]);
          }
          continue;
        }
        // Find all payloads
        if (this.format == 'words' || this.format == 'probs') {
          index = this.followByte(1, index); // separator
          if (index == MISSING) {
            continue;
          }
        }
        results.push([prefix, this.iterateAll(index), stutter, typos]);
        continue;
      }

      // Follow a replacement path
      if (replaces && str[len] in replaces) {
        code = replaces[str[len]].charCodeAt(0);
        if (code in CP1251) {
          cur = this.followByte(CP1251[code], index);
          if (cur != MISSING) {
            prefixes.push([ prefix + replaces[str[len]], len + 1, typos, stutter, cur ]);
          }
        }
      }

      // Follow typos path (if not over limit)
      if (typos < mtypos && !stutter) {
        // Skip a letter entirely (extra letter)
        prefixes.push([ prefix, len + 1, typos + 1, stutter, index ]);

        // Add a letter (missing)
        // TODO: iterate all childs?
        var label = this.guide[index << 1]; // First child
        do {
          cur = this.followByte(label, index);
          if ((cur != MISSING) && (label in UCS2)) {
            prefixes.push([ prefix + UCS2[label], len, typos + 1, stutter, cur ]);
          }
          label = this.guide[(cur << 1) + 1]; // Next child
        } while (cur != MISSING);

        // Replace a letter
        // Now it checks only most probable typos (located near to each other on keyboards)
        var possible = COMMON_TYPOS[str[len]];
        if (possible) {
          for (var i = 0; i < possible.length; i++) {
            code = possible.charCodeAt(i);
            if (code in CP1251) {
              cur = this.followByte(CP1251[code], index);
              if (cur != MISSING) {
                // for missing letter we need to iterate all childs, not only COMMON_TYPOS
                // prefixes.push([ prefix + possible[i], len, typos + 1, stutter, cur ]);
                prefixes.push([ prefix + possible[i], len + 1, typos + 1, stutter, cur ]);
              }
            }
          }
        }

        // Swapped two letters
        // TODO: support for replacements?
        if (len < str.length - 1) {
          code = str.charCodeAt(len + 1);
          if (code in CP1251) {
            cur = this.followByte(CP1251[code], index);
            if (cur != MISSING) {
              code = str.charCodeAt(len);
              if (code in CP1251) {
                cur = this.followByte(CP1251[code], cur);
                if (cur != MISSING) {
                  prefixes.push([ prefix + str[len + 1] + str[len], len + 2, typos + 1, stutter, cur ]);
                }
              }
            }
          }
        }
      }

      // Follow base path
      code = str.charCodeAt(len);
      if (code in CP1251) {
        cur = this.followByte(CP1251[code], index);
        if (cur != MISSING) {
          prefixes.push([ prefix + str[len], len + 1, typos, stutter, cur ]);

          while (stutter < mstutter && !typos && len < str.length - 1) {
            // Follow a simple stutter path (merge two equal letters into one)
            if (str[len] == str[len + 1]) {
              prefixes.push([ prefix + str[len], len + 2, typos, stutter + 1, cur ]);
              len++;
            } else
            // Follow a stutter with a dash (д-да)
            if (len < str.length - 2 && str[len + 1] == '-' && str[len] == str[len + 2]) {
              prefixes.push([ prefix + str[len], len + 3, typos, stutter + 1, cur ]);
              len += 2;
            } else {
              break;
            }
            stutter++;
          }
        }
      }
    }
    return results;
  }

  return DAWG;
}));
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = module.exports || {}) && (module.exports.Morph = factory(module.exports)) :
  typeof define === 'function' && define.amd ? define('Az.Morph', ['Az', 'Az.DAWG'], factory) :
  (global.Az = global.Az || {}) && (global.Az.Morph = factory(global.Az))
}(this, function (Az) { 'use strict';
  /** @namespace Az **/
  var words,
      probabilities,
      predictionSuffixes = new Array(3),
      prefixes = [ '', 'по', 'наи' ],
      suffixes,
      grammemes,
      paradigms,
      tags,
      defaults = {
        ignoreCase: false,
        replacements: { 'е': 'ё' },
        stutter: Infinity,
        typos: 0,
        parsers: [
          // Словарные слова + инициалы
          'Dictionary?', 'AbbrName?', 'AbbrPatronymic',
          // Числа, пунктуация, латиница (по-хорошему, токенизатор не должен эту ерунду сюда пускать)
          'IntNumber', 'RealNumber', 'Punctuation', 'RomanNumber?', 'Latin',
          // Слова с дефисами
          'HyphenParticle', 'HyphenAdverb', 'HyphenWords',
          // Предсказатели по префиксам/суффиксам
          'PrefixKnown', 'PrefixUnknown?', 'SuffixKnown?', 'Abbr'
        ],
        forceParse: false,
        normalizeScore: true
      },
      initials = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ',
      particles = ['-то', '-ка', '-таки', '-де', '-тко', '-тка', '-с', '-ста'],
      knownPrefixes = [
        'авиа', 'авто', 'аква', 'анти', 'анти-', 'антропо', 'архи', 'арт', 'арт-', 'астро', 'аудио', 'аэро',
        'без', 'бес', 'био', 'вело', 'взаимо', 'вне', 'внутри', 'видео', 'вице-', 'вперед', 'впереди',
        'гекто', 'гелио', 'гео', 'гетеро', 'гига', 'гигро', 'гипер', 'гипо', 'гомо',
        'дву', 'двух', 'де', 'дез', 'дека', 'деци', 'дис', 'до', 'евро', 'за', 'зоо', 'интер', 'инфра',
        'квази', 'квази-', 'кило', 'кино', 'контр', 'контр-', 'космо', 'космо-', 'крипто', 'лейб-', 'лже', 'лже-',
        'макро', 'макси', 'макси-', 'мало', 'меж', 'медиа', 'медиа-', 'мега', 'мета', 'мета-', 'метео', 'метро', 'микро',
        'милли', 'мини', 'мини-', 'моно', 'мото', 'много', 'мульти',
        'нано', 'нарко', 'не', 'небез', 'недо', 'нейро', 'нео', 'низко', 'обер-', 'обще', 'одно', 'около', 'орто',
        'палео', 'пан', 'пара', 'пента', 'пере', 'пиро', 'поли', 'полу', 'после', 'пост', 'пост-',
        'порно', 'пра', 'пра-', 'пред', 'пресс-', 'противо', 'противо-', 'прото', 'псевдо', 'псевдо-',
        'радио', 'разно', 'ре', 'ретро', 'ретро-', 'само', 'санти', 'сверх', 'сверх-', 'спец', 'суб', 'супер', 'супер-', 'супра',
        'теле', 'тетра', 'топ-', 'транс', 'транс-', 'ультра', 'унтер-', 'штаб-',
        'экзо', 'эко', 'эндо', 'эконом-', 'экс', 'экс-', 'экстра', 'экстра-', 'электро', 'энерго', 'этно'
      ],
      autoTypos = [4, 9],
      UNKN,
      __init = [],
      initialized = false;

  // Взято из https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
  function deepFreeze(obj) {
    if (!('freeze' in Object)) {
      return;
    }

    var propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function(name) {
      var prop = obj[name];

      if (typeof prop == 'object' && prop !== null)
        deepFreeze(prop);
    });

    return Object.freeze(obj);
  }

  /**
   * Тег. Содержит в себе информацию о конкретной форме слова, но при этом
   * к конкретному слову не привязан. Всевозможные значения тегов переиспользуются
   * для всех разборов слов.
   *
   * Все граммемы навешаны на тег как поля. Если какая-то граммема содержит в себе
   * дочерние граммемы, то значением поля является именно название дочерней
   * граммемы (например, tag.GNdr == 'masc'). В то же время для дочерних граммем
   * значением является просто true (т.е. условие можно писать и просто как
   * if (tag.masc) ...).
   *
   * @property {string[]} stat Полный список неизменяемых граммем.
   * @property {string[]} flex Полный список изменяемых граммем.
   * @property {Tag} ext Копия тега с русскими обозначениями (по версии OpenCorpora).
   */
  var Tag = function(str) {
    var par, pair = str.split(' ');
    this.stat = pair[0].split(',');
    this.flex = pair[1] ? pair[1].split(',') : [];
    for (var j = 0; j < 2; j++) {
      var grams = this[['stat', 'flex'][j]];
      for (var i = 0; i < grams.length; i++) {
        var gram = grams[i];
        this[gram] = true;
        // loc2 -> loct -> CAse
        while (grammemes[gram] && (par = grammemes[gram].parent)) {
          this[par] = gram;
          gram = par;
        }
      }
    }
    if ('POST' in this) {
      this.POS = this.POST;
    }
  }

  /**
   * Возвращает текстовое представление тега.
   *
   * @returns {string} Список неизменяемых граммем через запятую, пробел,
   *  и список изменяемых граммем через запятую.
   */
  Tag.prototype.toString = function() {
    return (this.stat.join(',') + ' ' + this.flex.join(',')).trim();
  }

  /**
   * Проверяет согласованность с конкретными значениями граммем либо со списком
   * граммем из другого тега (или слова).
   *
   * @param {Tag|Parse} [tag] Тег или разбор слова, с которым следует
   *  проверить согласованность.
   * @param {Array|Object} grammemes Граммемы, по которым нужно проверить
   *  согласованность.
   *
   *  Если указан тег (или разбор), то grammemes должен быть массивом тех
   *  граммем, которые у обоих тегов должны совпадать. Например:
   *  tag.matches(otherTag, ['POS', 'GNdr'])
   *
   *  Если тег не указан, а указан массив граммем, то проверяется просто их
   *  наличие. Например, аналог выражения (tag.NOUN && tag.masc):
   *  tag.matches([ 'NOUN', 'masc' ])
   *
   *  Если тег не указан, а указан объект, то ключи в нем — названия граммем,
   *  значения — дочерние граммемы, массивы граммем, либо true/false:
   *  tag.matches({ 'POS' : 'NOUN', 'GNdr': ['masc', 'neut'] })
   * @returns {boolean} Является ли текущий тег согласованным с указанным.
   */
  // TODO: научиться понимать, что некоторые граммемы можно считать эквивалентными при сравнении двух тегов (вариации падежей и т.п.)
  Tag.prototype.matches = function(tag, grammemes) {
    if (!grammemes) {
      if (Object.prototype.toString.call(tag) === '[object Array]') {
        for (var i = 0; i < tag.length; i++) {
          if (!this[tag[i]]) {
            return false;
          }
        }
        return true;
      } else
      // Match to map
      for (var k in tag) {
        if (Object.prototype.toString.call(tag[k]) === '[object Array]') {
          if (!tag[k].indexOf(this[k])) {
            return false;
          }
        } else {
          if (tag[k] != this[k]) {
            return false;
          }
        }
      }
      return true;
    }

    if (tag instanceof Parse) {
      tag = tag.tag;
    }

    // Match to another tag
    for (var i = 0; i < grammemes.length; i++) {
      if (tag[grammemes[i]] != this[grammemes[i]]) {
        // Special case: tag.CAse
        return false;
      }
    }
    return true;
  }

  Tag.prototype.isProductive = function() {
    return !(this.NUMR || this.NPRO || this.PRED || this.PREP ||
      this.CONJ || this.PRCL || this.INTJ || this.Apro ||
      this.NUMB || this.ROMN || this.LATN || this.PNCT ||
      this.UNKN);
  }

  Tag.prototype.isCapitalized = function() {
    return this.Name || this.Surn || this.Patr || this.Geox || this.Init;
  }

  function makeTag(tagInt, tagExt) {
    var tag = new Tag(tagInt);
    tag.ext = new Tag(tagExt);
    return deepFreeze(tag);
  }

  /**
   * Производит морфологический анализ слова. Возвращает возможные варианты
   * разбора по убыванию их правдоподобности.
   *
   * @playground
   * var Az = require('az');
   * Az.Morph.init(function() {
   *   console.log(Az.Morph('стали'));
   * });
   * @param {string} word Слово, которое следует разобрать.
   * @param {Object} [config] Опции разбора.
   * @param {boolean} [config.ignoreCase=False] Следует ли игнорировать
   *  регистр слов (в основном это означает возможность написания имен собственных и
   *  инициалов с маленькой буквы).
   * @param {Object} [config.replacements={ 'е': 'ё' }] Допустимые замены букв
   *  при поиске слов в словаре. Ключи объекта — заменяемые буквы в разбираемом
   *  слове, соответствующие им значения — буквы в словарных словах, которым
   *  допустимо встречаться вместо заменяемых. По умолчанию буква «е» может
   *  соответствовать букве «ё» в словарных словах.
   * @param {number} [config.stutter=Infinity] «Заикание». Устраняет повторения букв
   *  (как с дефисом - «не-е-ет», так и без - «нееет»).
   *
   *  Infinity не ограничивает максимальное число повторений (суммарно во всем слове).
   *
   *  0 или false чтобы отключить.
   * @param {number|'auto'} [config.typos=0] Опечатки. Максимальное количество
   * опечаток в слове.
   *
   *  Опечаткой считается:
   *  - лишняя буква в слове
   *  - пропущенная буква в слове (TODO: самый медленный тип опечаток, стоит сделать опциональным)
   *  - не та буква в слове (если правильная буква стоит рядом на клавиатуре)
   *  - переставленные местами соседние буквы
   *
   *  0 или false чтобы отключить.
   *
   *  'auto':
   *  - 0, если слово короче 5 букв
   *  - 1, если слово короче 10 букв (но только если не нашлось варианта разбора без опечаток)
   *  - 2 в противном случае (но только если не нашлось варианта разбора без опечаток или с 1 опечаткой)
   * @param {string[]} [config.parsers] Список применяемых парсеров (см. поля
   *  объекта Az.Morph.Parsers) в порядке применения (т.е. стоящие в начале
   *  имеют наивысший приоритет).
   *
   *  Вопросительный знак означает, что данный парсер не терминальный, то есть
   *  варианты собираются до первого терминального парсера. Иными словами, если
   *  мы дошли до какого-то парсера, значит все стоящие перед ним терминальные
   *  парсеры либо не дали результата совсем, либо дали только с опечатками.
   *
   *  (парсер в терминологии pymorphy2 — анализатор)
   * @param {boolean} [config.forceParse=False] Всегда возвращать хотя бы один вариант
   *  разбора (как это делает pymorphy2), даже если совсем ничего не получилось.
   * @returns {Parse[]} Варианты разбора.
   * @memberof Az
   */
  var Morph = function(word, config) {
    if (!initialized) {
      throw new Error('Please call Az.Morph.init() before using this module.');
    }

    config = config ? Az.extend(defaults, config) : defaults;

    var parses = [];
    var matched = false;
    for (var i = 0; i < config.parsers.length; i++) {
      var name = config.parsers[i];
      var terminal = name[name.length - 1] != '?';
      name = terminal ? name : name.slice(0, -1);
      if (name in Morph.Parsers) {
        var vars = Morph.Parsers[name](word, config);
        for (var j = 0; j < vars.length; j++) {
          vars[j].parser = name;
          if (!vars[j].stutterCnt && !vars[j].typosCnt) {
            matched = true;
          }
        }

        parses = parses.concat(vars);
        if (matched && terminal) {
          break;
        }
      } else {
        console.warn('Parser "' + name + '" is not found. Skipping');
      }
    }

    if (!parses.length && config.forceParse) {
      parses.push(new Parse(word.toLocaleLowerCase(), UNKN));
    }

    var total = 0;
    for (var i = 0; i < parses.length; i++) {
      if (parses[i].parser == 'Dictionary') {
        var res = probabilities.findAll(parses[i] + ':' + parses[i].tag);
        if (res && res[0]) {
          parses[i].score = (res[0][1] / 1000000) * getDictionaryScore(parses[i].stutterCnt, parses[i].typosCnt);
          total += parses[i].score;
        }
      }
    }

    // Normalize Dictionary & non-Dictionary scores separately
    if (config.normalizeScore) {
      if (total > 0) {
        for (var i = 0; i < parses.length; i++) {
          if (parses[i].parser == 'Dictionary') {
            parses[i].score /= total;
          }
        }
      }

      total = 0;
      for (var i = 0; i < parses.length; i++) {
        if (parses[i].parser != 'Dictionary') {
          total += parses[i].score;
        }
      }
      if (total > 0) {
        for (var i = 0; i < parses.length; i++) {
          if (parses[i].parser != 'Dictionary') {
            parses[i].score /= total;
          }
        }
      }
    }

    parses.sort(function(e1, e2) {
      return e2.score - e1.score;
    });

    return parses;
  }

  // TODO: вынести парсеры в отдельный файл(ы)?

  Morph.Parsers = {}

  /**
   * Один из возможных вариантов морфологического разбора.
   *
   * @property {string} word Слово в текущей форме (с исправленными ошибками,
   *  если они были)
   * @property {Tag} tag Тег, описывающий текущую форму слова.
   * @property {number} score Число от 0 до 1, соответствующее «уверенности»
   *  в данном разборе (чем оно выше, тем вероятнее данный вариант).
   * @property {number} stutterCnt Число «заиканий», исправленных в слове.
   * @property {number} typosCnt Число опечаток, исправленных в слове.
   */
  var Parse = function(word, tag, score, stutterCnt, typosCnt) {
    this.word = word;
    this.tag = tag;
    this.stutterCnt = stutterCnt || 0;
    this.typosCnt = typosCnt || 0;
    this.score = score || 0;
  }

  /**
   * Приводит слово к его начальной форме.
   *
   * @param {boolean} keepPOS Не менять часть речи при нормализации (например,
   *  не делать из причастия инфинитив).
   * @returns {Parse} Разбор, соответствующий начальной форме или False,
   *  если произвести нормализацию не удалось.
   */
  // TODO: некоторые смены частей речи, возможно, стоит делать в любом случае (т.к., например, компаративы, краткие формы причастий и прилагательных разделены, инфинитив отделен от глагола)
  Parse.prototype.normalize = function(keepPOS) {
    return this.inflect(keepPOS ? { POS: this.tag.POS } : 0);
  }

  /**
   * Приводит слово к указанной форме.
   *
   * @param {Tag|Parse} [tag] Тег или другой разбор слова, с которым следует
   *  согласовать данный.
   * @param {Array|Object} grammemes Граммемы, по которым нужно согласовать слово.
   * @returns {Parse|False} Разбор, соответствующий указанной форме или False,
   *  если произвести согласование не удалось.
   * @see Tag.matches
   */
  Parse.prototype.inflect = function(tag, grammemes) {
    return this;
  }

  /**
   * Приводит слово к форме, согласующейся с указанным числом.
   * Вместо конкретного числа можно указать категорию (согласно http://www.unicode.org/cldr/charts/29/supplemental/language_plural_rules.html).
   *
   * @param {number|string} number Число, с которым нужно согласовать данное слово или категория, описывающая правило построения множественного числа.
   * @returns {Parse|False} Разбор, соответствующий указанному числу или False,
   *  если произвести согласование не удалось.
   */
  Parse.prototype.pluralize = function(number) {
    if (!this.tag.NOUN && !this.tag.ADJF && !this.tag.PRTF) {
      return this;
    }

    if (typeof number == 'number') {
      number = number % 100;
      if ((number % 10 == 0) || (number % 10 > 4) || (number > 4 && number < 21)) {
        number = 'many';
      } else
      if (number % 10 == 1) {
        number = 'one';
      } else {
        number = 'few';
      }
    }

    if (this.tag.NOUN && !this.tag.nomn && !this.tag.accs) {
      return this.inflect([number == 'one' ? 'sing' : 'plur', this.tag.CAse]);
    } else
    if (number == 'one') {
      return this.inflect(['sing', this.tag.nomn ? 'nomn' : 'accs'])
    } else
    if (this.tag.NOUN && (number == 'few')) {
      return this.inflect(['sing', 'gent']);
    } else
    if ((this.tag.ADJF || this.tag.PRTF) && this.tag.femn && (number == 'few')) {
      return this.inflect(['plur', 'nomn']);
    } else {
      return this.inflect(['plur', 'gent']);
    }
  }

  /**
   * Проверяет, согласуется ли текущая форма слова с указанной.
   *
   * @param {Tag|Parse} [tag] Тег или другой разбор слова, с которым следует
   *  проверить согласованность.
   * @param {Array|Object} grammemes Граммемы, по которым нужно проверить
   *  согласованность.
   * @returns {boolean} Является ли текущая форма слова согласованной с указанной.
   * @see Tag.matches
   */
  Parse.prototype.matches = function(tag, grammemes) {
    return this.tag.matches(tag, grammemes);
  }

  /**
   * Возвращает текущую форму слова.
   *
   * @returns {String} Текущая форма слова.
   */
  Parse.prototype.toString = function() {
    return this.word;
  }

  // Выводит информацию о слове в консоль.
  Parse.prototype.log = function() {
    console.group(this.toString());
    console.log('Stutter?', this.stutterCnt, 'Typos?', this.typosCnt);
    console.log(this.tag.ext.toString());
    console.groupEnd();
  }

  function lookup(dawg, word, config) {
    var entries;
    if (config.typos == 'auto') {
      entries = dawg.findAll(word, config.replacements, config.stutter, 0);
      for (var i = 0; i < autoTypos.length && !entries.length && word.length > autoTypos[i]; i++) {
        entries = dawg.findAll(word, config.replacements, config.stutter, i + 1);
      }
    } else {
      entries = dawg.findAll(word, config.replacements, config.stutter, config.typos);
    }
    return entries;
  }

  function getDictionaryScore(stutterCnt, typosCnt) {
    // = 1.0 if no stutter/typos
    // = 0.3 if any number of stutter or 1 typo
    // = 0.09 if 2 typos
    // = 0.027 if 3 typos
    return Math.pow(0.3, Math.min(stutterCnt, 1) + typosCnt);
  }

  var DictionaryParse = function(word, paradigmIdx, formIdx, stutterCnt, typosCnt, prefix, suffix) {
    this.word = word;
    this.paradigmIdx = paradigmIdx;
    this.paradigm = paradigms[paradigmIdx];
    this.formIdx = formIdx;
    this.formCnt = this.paradigm.length / 3;
    this.tag = tags[this.paradigm[this.formCnt + formIdx]];
    this.stutterCnt = stutterCnt || 0;
    this.typosCnt = typosCnt || 0;
    this.score = getDictionaryScore(this.stutterCnt, this.typosCnt);
    this.prefix = prefix || '';
    this.suffix = suffix || '';
  }

  DictionaryParse.prototype = Object.create(Parse.prototype);
  DictionaryParse.prototype.constructor = DictionaryParse;

  // Возвращает основу слова
  DictionaryParse.prototype.base = function() {
    if (this._base) {
      return this._base;
    }
    return (this._base = this.word.substring(
      prefixes[this.paradigm[(this.formCnt << 1) + this.formIdx]].length,
      this.word.length - suffixes[this.paradigm[this.formIdx]].length)
    );
  }

  // Склоняет/спрягает слово так, чтобы оно соответствовало граммемам другого слова, тега или просто конкретным граммемам (подробнее см. Tag.prototype.matches).
  // Всегда выбирается первый подходящий вариант.
  DictionaryParse.prototype.inflect = function(tag, grammemes) {
    if (!grammemes && typeof tag === 'number') {
      // Inflect to specific formIdx
      return new DictionaryParse(
          prefixes[this.paradigm[(this.formCnt << 1) + tag]] +
          this.base() +
          suffixes[this.paradigm[tag]],
        this.paradigmIdx,
        tag, 0, 0, this.prefix, this.suffix
      );
    }

    for (var formIdx = 0; formIdx < this.formCnt; formIdx++) {
      if (tags[this.paradigm[this.formCnt + formIdx]].matches(tag, grammemes)) {
        return new DictionaryParse(
            prefixes[this.paradigm[(this.formCnt << 1) + formIdx]] +
            this.base() +
            suffixes[this.paradigm[formIdx]],
          this.paradigmIdx,
          formIdx, 0, 0, this.prefix, this.suffix
        );
      }
    }

    return false;
  }

  DictionaryParse.prototype.log = function() {
    console.group(this.toString());
    console.log('Stutter?', this.stutterCnt, 'Typos?', this.typosCnt);
    console.log(prefixes[this.paradigm[(this.formCnt << 1) + this.formIdx]] + '|' + this.base() + '|' + suffixes[this.paradigm[this.formIdx]]);
    console.log(this.tag.ext.toString());
    var norm = this.normalize();
    console.log('=> ', norm + ' (' + norm.tag.ext.toString() + ')');
    norm = this.normalize(true);
    console.log('=> ', norm + ' (' + norm.tag.ext.toString() + ')');
    console.groupCollapsed('Все формы: ' + this.formCnt);
    for (var formIdx = 0; formIdx < this.formCnt; formIdx++) {
      var form = this.inflect(formIdx);
      console.log(form + ' (' + form.tag.ext.toString() + ')');
    }
    console.groupEnd();
    console.groupEnd();
  }

  DictionaryParse.prototype.toString = function() {
    if (this.prefix) {
      var pref = prefixes[this.paradigm[(this.formCnt << 1) + this.formIdx]];
      return pref + this.prefix + this.word.substr(pref.length) + this.suffix;
    } else {
      return this.word + this.suffix;
    }
  }

  var CombinedParse = function(left, right) {
    this.left = left;
    this.right = right;
    this.tag = right.tag;
    this.score = left.score * right.score * 0.8;
    this.stutterCnt = left.stutterCnt + right.stutterCnt;
    this.typosCnt = left.typosCnt + right.typosCnt;
    if ('formCnt' in right) {
      this.formCnt = right.formCnt;
    }
  }

  CombinedParse.prototype = Object.create(Parse.prototype);
  CombinedParse.prototype.constructor = CombinedParse;

  CombinedParse.prototype.inflect = function(tag, grammemes) {
    var left, right;

    var right = this.right.inflect(tag, grammemes);
    if (!grammemes && typeof tag === 'number') {
      left = this.left.inflect(right.tag, ['POST', 'NMbr', 'CAse', 'PErs', 'TEns']);
    } else {
      left = this.left.inflect(tag, grammemes);
    }
    if (left && right) {
      return new CombinedParse(left, right);
    } else {
      return false;
    }
  }

  CombinedParse.prototype.toString = function() {
    return this.left.word + '-' + this.right.word;
  }

  __init.push(function() {
    Morph.Parsers.Dictionary = function(word, config) {
      var isCapitalized =
        !config.ignoreCase && word.length &&
        (word[0].toLocaleLowerCase() != word[0]) &&
        (word.substr(1).toLocaleUpperCase() != word.substr(1));
      word = word.toLocaleLowerCase();

      var opts = lookup(words, word, config);

      var vars = [];
      for (var i = 0; i < opts.length; i++) {
        for (var j = 0; j < opts[i][1].length; j++) {
          var w = new DictionaryParse(
            opts[i][0],
            opts[i][1][j][0],
            opts[i][1][j][1],
            opts[i][2],
            opts[i][3]);
          if (config.ignoreCase || !w.tag.isCapitalized() || isCapitalized) {
            vars.push(w);
          }
        }
      }
      return vars;
    }

    var abbrTags = [];
    for (var i = 0; i <= 2; i++) {
      for (var j = 0; j <= 5; j++) {
        for (var k = 0; k <= 1; k++) {
          abbrTags.push(makeTag(
            'NOUN,inan,' + ['masc', 'femn', 'neut'][i] + ',Fixd,Abbr ' + ['sing', 'plur'][k] + ',' + ['nomn', 'gent', 'datv', 'accs', 'ablt', 'loct'][j],
            'СУЩ,неод,' + ['мр', 'жр', 'ср'][i] + ',0,аббр ' + ['ед', 'мн'][k] + ',' + ['им', 'рд', 'дт', 'вн', 'тв', 'пр'][j]
          ));
        }
      }
    }

    // Произвольные аббревиатуры (несклоняемые)
    // ВК, ЖК, ССМО, ОАО, ЛенСпецСМУ
    Morph.Parsers.Abbr = function(word, config) {
      // Однобуквенные считаются инициалами и для них заведены отдельные парсеры
      if (word.length < 2) {
        return [];
      }
      // Дефисов в аббревиатуре быть не должно
      if (word.indexOf('-') > -1) {
        return [];
      }
      // Первая буква должна быть заглавной: сокращения с маленькой буквы (типа iOS) мало распространены
      // Последняя буква должна быть заглавной: иначе сокращение, вероятно, склоняется
      if ((initials.indexOf(word[0]) > -1) && (initials.indexOf(word[word.length - 1]) > -1)) {
        var caps = 0;
        for (var i = 0; i < word.length; i++) {
          if (initials.indexOf(word[i]) > -1) {
            caps++;
          }
        }
        if (caps <= 5) {
          var vars = [];
          for (var i = 0; i < abbrTags.length; i++) {
            var w = new Parse(word, abbrTags[i], 0.5);
            vars.push(w);
          }
          return vars;
        }
      }
      // При игнорировании регистра разбираем только короткие аббревиатуры
      // (и требуем, чтобы каждая буква была «инициалом», т.е. без мягких/твердых знаков)
      if (!config.ignoreCase || (word.length > 5)) {
        return [];
      }
      word = word.toLocaleUpperCase();
      for (var i = 0; i < word.length; i++) {
        if (initials.indexOf(word[i]) == -1) {
          return [];
        }
      }
      var vars = [];
      for (var i = 0; i < abbrTags.length; i++) {
        var w = new Parse(word, abbrTags[i], 0.2);
        vars.push(w);
      }
      return vars;
    }

    var InitialsParser = function(isPatronymic, score) {
      var initialsTags = [];
      for (var i = 0; i <= 1; i++) {
        for (var j = 0; j <= 5; j++) {
          initialsTags.push(makeTag(
            'NOUN,anim,' + ['masc', 'femn'][i] + ',Sgtm,Name,Fixd,Abbr,Init sing,' + ['nomn', 'gent', 'datv', 'accs', 'ablt', 'loct'][j],
            'СУЩ,од,' + ['мр', 'жр'][i] + ',sg,имя,0,аббр,иниц ед,' + ['им', 'рд', 'дт', 'вн', 'тв', 'пр'][j]
          ));
        }
      }
      return function(word, config) {
        if (word.length != 1) {
          return [];
        }
        if (config.ignoreCase) {
          word = word.toLocaleUpperCase();
        }
        if (initials.indexOf(word) == -1) {
          return [];
        }
        var vars = [];
        for (var i = 0; i < initialsTags.length; i++) {
          var w = new Parse(word, initialsTags[i], score);
          vars.push(w);
        }
        return vars;
      }
    }

    Morph.Parsers.AbbrName = InitialsParser(false, 0.1);
    Morph.Parsers.AbbrPatronymic = InitialsParser(true, 0.1);

    var RegexpParser = function(regexp, tag, score) {
      return function(word, config) {
        if (config.ignoreCase) {
          word = word.toLocaleUpperCase();
        }
        if (word.length && word.match(regexp)) {
          return [new Parse(word, tag)];
        } else {
          return [];
        }
      }
    }

    grammemes['NUMB'] = grammemes['ЧИСЛО'] =
    grammemes['ROMN'] = grammemes['РИМ'] =
    grammemes['LATN'] = grammemes['ЛАТ'] =
    grammemes['PNCT'] = grammemes['ЗПР'] =
    grammemes['UNKN'] = grammemes['НЕИЗВ'] =
     { parent: 'POST' };

    Morph.Parsers.IntNumber = RegexpParser(
      /^[−-]?[0-9]+$/,
      makeTag('NUMB,intg', 'ЧИСЛО,цел'), 0.9);

    Morph.Parsers.RealNumber = RegexpParser(
      /^[−-]?([0-9]*[.,][0-9]+)$/,
      makeTag('NUMB,real', 'ЧИСЛО,вещ'), 0.9);

    Morph.Parsers.Punctuation = RegexpParser(
      /^[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+$/,
      makeTag('PNCT', 'ЗПР'), 0.9);

    Morph.Parsers.RomanNumber = RegexpParser(
      /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
      makeTag('ROMN', 'РИМ'), 0.9);

    Morph.Parsers.Latin = RegexpParser(
      /[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u024f]$/,
      makeTag('LATN', 'ЛАТ'), 0.9);

    // слово + частица
    // смотри-ка
    Morph.Parsers.HyphenParticle = function(word, config) {
      word = word.toLocaleLowerCase();

      var vars = [];
      for (var k = 0; k < particles.length; k++) {
        if (word.substr(word.length - particles[k].length) == particles[k]) {
          var base = word.slice(0, -particles[k].length);
          var opts = lookup(words, base, config);

          //console.log(opts);
          for (var i = 0; i < opts.length; i++) {
            for (var j = 0; j < opts[i][1].length; j++) {
              var w = new DictionaryParse(
                opts[i][0],
                opts[i][1][j][0],
                opts[i][1][j][1],
                opts[i][2],
                opts[i][3],
                '', particles[k]);
              w.score *= 0.9;
              vars.push(w);
            }
          }
        }
      }

      return vars;
    }

    var ADVB = makeTag('ADVB', 'Н');

    // 'по-' + прилагательное в дательном падеже
    // по-западному
    Morph.Parsers.HyphenAdverb = function(word, config) {
      word = word.toLocaleLowerCase();

      if ((word.length < 5) || (word.substr(0, 3) != 'по-')) {
        return [];
      }

      var opts = lookup(words, word.substr(3), config);

      var parses = [];
      var used = {};

      for (var i = 0; i < opts.length; i++) {
        if (!used[opts[i][0]]) {
          for (var j = 0; j < opts[i][1].length; j++) {
            var parse = new DictionaryParse(opts[i][0], opts[i][1][j][0], opts[i][1][j][1], opts[i][2], opts[i][3]);
            if (parse.matches(['ADJF', 'sing', 'datv'])) {
              used[opts[i][0]] = true;

              parse = new Parse('по-' + opts[i][0], ADVB, parse.score * 0.9, opts[i][2], opts[i][3]);
              parses.push(parse);
              break;
            }
          }
        }
      }
      return parses;
    }

    // слово + '-' + слово
    // интернет-магазин
    // компания-производитель
    Morph.Parsers.HyphenWords = function(word, config) {
      word = word.toLocaleLowerCase();
      for (var i = 0; i < knownPrefixes.length; i++) {
        if (knownPrefixes[i][knownPrefixes[i].length - 1] == '-' &&
            word.substr(0, knownPrefixes[i].length) == knownPrefixes[i]) {
          return [];
        }
      }
      var parses = [];
      var parts = word.split('-');
      if (parts.length != 2 || !parts[0].length || !parts[1].length) {
        if (parts.length > 2) {
          var end = parts[parts.length - 1];
          var right = Morph.Parsers.Dictionary(end, config);
          for (var j = 0; j < right.length; j++) {
            if (right[j] instanceof DictionaryParse) {
              right[j].score *= 0.2;
              right[j].prefix = word.substr(0, word.length - end.length - 1) + '-';
              parses.push(right[j]);
            }
          }
        }
        return parses;
      }
      var left = Morph.Parsers.Dictionary(parts[0], config);
      var right = Morph.Parsers.Dictionary(parts[1], config);


      // Variable
      for (var i = 0; i < left.length; i++) {
        if (left[i].tag.Abbr) {
          continue;
        }
        for (var j = 0; j < right.length; j++) {
          if (!left[i].matches(right[j], ['POST', 'NMbr', 'CAse', 'PErs', 'TEns'])) {
            continue;
          }
          if (left[i].stutterCnt + right[j].stutterCnt > config.stutter ||
              left[i].typosCnt + right[j].typosCnt > config.typos) {
            continue;
          }
          parses.push(new CombinedParse(left[i], right[j]));
        }
      }
      // Fixed
      for (var j = 0; j < right.length; j++) {
        if (right[j] instanceof DictionaryParse) {
          right[j].score *= 0.3;
          right[j].prefix = parts[0] + '-';
          parses.push(right[j]);
        }
      }

      return parses;
    }


    Morph.Parsers.PrefixKnown = function(word, config) {
      var isCapitalized =
        !config.ignoreCase && word.length &&
        (word[0].toLocaleLowerCase() != word[0]) &&
        (word.substr(1).toLocaleUpperCase() != word.substr(1));
      word = word.toLocaleLowerCase();
      var parses = [];
      for (var i = 0; i < knownPrefixes.length; i++) {
        if (word.length - knownPrefixes[i].length < 3) {
          continue;
        }

        if (word.substr(0, knownPrefixes[i].length) == knownPrefixes[i]) {
          var end = word.substr(knownPrefixes[i].length);
          var right = Morph.Parsers.Dictionary(end, config);
          for (var j = 0; j < right.length; j++) {
            if (!right[j].tag.isProductive()) {
              continue;
            }
            if (!config.ignoreCase && right[j].tag.isCapitalized() && !isCapitalized) {
              continue;
            }
            right[j].score *= 0.7;
            right[j].prefix = knownPrefixes[i];
            parses.push(right[j]);
          }
        }
      }
      return parses;
    }

    Morph.Parsers.PrefixUnknown = function(word, config) {
      var isCapitalized =
        !config.ignoreCase && word.length &&
        (word[0].toLocaleLowerCase() != word[0]) &&
        (word.substr(1).toLocaleUpperCase() != word.substr(1));
      word = word.toLocaleLowerCase();
      var parses = [];
      for (var len = 1; len <= 5; len++) {
        if (word.length - len < 3) {
          break;
        }
        var end = word.substr(len);
        var right = Morph.Parsers.Dictionary(end, config);
        for (var j = 0; j < right.length; j++) {
          if (!right[j].tag.isProductive()) {
            continue;
          }
          if (!config.ignoreCase && right[j].tag.isCapitalized() && !isCapitalized) {
            continue;
          }
          right[j].score *= 0.3;
          right[j].prefix = word.substr(0, len);
          parses.push(right[j]);
        }
      }
      return parses;
    }

    // Отличие от предсказателя по суффиксам в pymorphy2: найдя подходящий суффикс, проверяем ещё и тот, что на символ короче
    Morph.Parsers.SuffixKnown = function(word, config) {
      if (word.length < 4) {
        return [];
      }
      var isCapitalized =
        !config.ignoreCase && word.length &&
        (word[0].toLocaleLowerCase() != word[0]) &&
        (word.substr(1).toLocaleUpperCase() != word.substr(1));
      word = word.toLocaleLowerCase();
      var parses = [];
      var minlen = 1;
      var coeffs = [0, 0.2, 0.3, 0.4, 0.5, 0.6];
      var used = {};
      for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i].length && (word.substr(0, prefixes[i].length) != prefixes[i])) {
          continue;
        }
        var base = word.substr(prefixes[i].length);
        for (var len = 5; len >= minlen; len--) {
          if (len >= base.length) {
            continue;
          }
          var left = base.substr(0, base.length - len);
          var right = base.substr(base.length - len);
          var entries = predictionSuffixes[i].findAll(right, config.replacements, 0, 0);
          if (!entries) {
            continue;
          }

          var p = [];
          var max = 1;
          for (var j = 0; j < entries.length; j++) {
            var suffix = entries[j][0];
            var stats = entries[j][1];

            for (var k = 0; k < stats.length; k++) {
              var parse = new DictionaryParse(
                prefixes[i] + left + suffix,
                stats[k][1],
                stats[k][2]);
              // Why there is even non-productive forms in suffix DAWGs?
              if (!parse.tag.isProductive()) {
                continue;
              }
              if (!config.ignoreCase && parse.tag.isCapitalized() && !isCapitalized) {
                continue;
              }
              var key = parse.toString() + ':' + stats[k][1] + ':' + stats[k][2];
              if (key in used) {
                continue;
              }
              max = Math.max(max, stats[k][0]);
              parse.score = stats[k][0] * coeffs[len];
              p.push(parse);
              used[key] = true;
            }
          }
          if (p.length > 0) {
            for (var j = 0; j < p.length; j++) {
              p[j].score /= max;
            }
            parses = parses.concat(p);
            // Check also suffixes 1 letter shorter
            minlen = Math.max(len - 1, 1);
          }
        }
      }
      return parses;
    }

    UNKN = makeTag('UNKN', 'НЕИЗВ');
  });

  /**
   * Задает опции морфологического анализатора по умолчанию.
   *
   * @param {Object} config Опции анализатора.
   * @see Morph
   */
  Morph.setDefaults = function(config) {
    defaults = config;
  }

  /**
   * Инициализирует анализатор, загружая необходимые для работы словари из
   * указанной директории. Эту функцию необходимо вызвать (и дождаться
   * срабатывания коллбэка) до любых действий с модулем.
   *
   * @param {string} [path] Директория, содержащая файлы 'words.dawg',
   * 'grammemes.json' и т.д. По умолчанию директория 'dicts' в данном модуле.
   * @param {Function} callback Коллбэк, вызываемый после завершения загрузки
   *  всех словарей.
   */
  Morph.init = function(path, callback) {
    var loading = 0;
    var tagsInt, tagsExt;
    function loaded() {
      if (!--loading) {
        tags = Array(tagsInt.length);
        for (var i = 0; i < tagsInt.length; i++) {
          tags[i] = new Tag(tagsInt[i]);
          tags[i].ext = new Tag(tagsExt[i]);
        }
        tags = deepFreeze(tags);
        for (var i = 0; i < __init.length; i++) {
          __init[i]();
        }
        initialized = true;
        callback && callback(null, Morph);
      }
    }

    if (!callback && typeof path == 'function') {
      callback = path;
      if (typeof __dirname == 'string') {
        path = __dirname + '/../dicts';
      } else {
        path = 'dicts';
      }
    }

    loading++;
    Az.DAWG.load(path + '/words.dawg', 'words', function(err, dawg) {
      if (err) {
        callback(err);
        return;
      }
      words = dawg;
      loaded();
    });

    for (var prefix = 0; prefix < 3; prefix++) {
      (function(prefix) {
        loading++;
        Az.DAWG.load(path + '/prediction-suffixes-' + prefix + '.dawg', 'probs', function(err, dawg) {
          if (err) {
            callback(err);
            return;
          }
          predictionSuffixes[prefix] = dawg;
          loaded();
        });
      })(prefix);
    }

    loading++;
    Az.DAWG.load(path + '/p_t_given_w.intdawg', 'int', function(err, dawg) {
      if (err) {
        callback(err);
        return;
      }
      probabilities = dawg;
      loaded();
    });

    loading++;
    Az.load(path + '/grammemes.json', 'json', function(err, json) {
      if (err) {
        callback(err);
        return;
      }
      grammemes = {};
      for (var i = 0; i < json.length; i++) {
        grammemes[json[i][0]] = grammemes[json[i][2]] = {
          parent: json[i][1],
          internal: json[i][0],
          external: json[i][2],
          externalFull: json[i][3]
        }
      }
      loaded();
    });

    loading++;
    Az.load(path + '/gramtab-opencorpora-int.json', 'json', function(err, json) {
      if (err) {
        callback(err);
        return;
      }
      tagsInt = json;
      loaded();
    });

    loading++;
    Az.load(path + '/gramtab-opencorpora-ext.json', 'json', function(err, json) {
      if (err) {
        callback(err);
        return;
      }
      tagsExt = json;
      loaded();
    });

    loading++;
    Az.load(path + '/suffixes.json', 'json', function(err, json) {
      if (err) {
        callback(err);
        return;
      }
      suffixes = json;
      loaded();
    });

    loading++;
    Az.load(path + '/paradigms.array', 'arraybuffer', function(err, data) {
      if (err) {
        callback(err);
        return;
      }
      
      var list = new Uint16Array(data),
          count = list[0],
          pos = 1;

      paradigms = [];
      for (var i = 0; i < count; i++) {
        var size = list[pos++];
        paradigms.push(list.subarray(pos, pos + size));
        pos += size;
      }
      loaded();
    });
  }

  return Morph;
}));

;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = module.exports || {}) && (module.exports.Syntax = factory(module.exports)) :
  typeof define === 'function' && define.amd ? define('Az.Syntax', ['Az'], factory) :
  (global.Az = global.Az || {}) && (global.Az.Syntax = factory(global.Az))
}(this, function (Az) { 'use strict';
  // TBD: Syntax analyzer
  var Syntax = function() {

  }

  return Syntax;
}));
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = module.exports || {}) && (module.exports.Tokens = factory()) :
  typeof define === 'function' && define.amd ? define('Az.Tokens', ['Az'], factory) :
  (global.Az = global.Az || {}) && (global.Az.Tokens = factory())
}(this, function () { 'use strict';
  /** @namespace Az **/
  var TLDs = 'ac|ad|ae|aero|af|ag|ai|al|am|ao|aq|ar|arpa|as|asia|at|au|aw|ax|az|ba|bb|be|bf|bg|bh|bi|biz|bj|bm|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|cl|cm|cn|co|com|coop|cr|cu|cv|cw|cx|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|es|et|eu|fi|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|info|int|io|iq|ir|is|it|je|jo|jobs|jp|kg|ki|km|kn|kp|kr|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mn|mo|mobi|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|na|name|nc|ne|net|nf|ng|nl|no|nr|nu|nz|om|org|pa|pe|pf|ph|pk|pl|pm|pn|post|pr|pro|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tr|travel|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|yt|امارات|հայ|বাংলা|бел|中国|中國|الجزائر|مصر|ею|გე|ελ|香港|भारत|بھارت|భారత్|ભારત|ਭਾਰਤ|ভারত|இந்தியா|ایران|ايران|عراق|الاردن|한국|қаз|ලංකා|இலங்கை|المغرب|мкд|мон|澳門|澳门|مليسيا|عمان|پاکستان|پاكستان|فلسطين|срб|рф|قطر|السعودية|السعودیة|السعودیۃ|السعوديه|سودان|新加坡|சிங்கப்பூர்|سورية|سوريا|ไทย|تونس|台灣|台湾|臺灣|укр|اليمن|xxx|zm|aaa|aarp|abarth|abb|abbott|abbvie|abc|able|abogado|abudhabi|academy|accenture|accountant|accountants|aco|active|actor|adac|ads|adult|aeg|aetna|afamilycompany|afl|africa|africamagic|agakhan|agency|aig|aigo|airbus|airforce|airtel|akdn|alfaromeo|alibaba|alipay|allfinanz|allstate|ally|alsace|alstom|americanexpress|americanfamily|amex|amfam|amica|amsterdam|analytics|android|anquan|anz|aol|apartments|app|apple|aquarelle|arab|aramco|archi|army|art|arte|asda|associates|athleta|attorney|auction|audi|audible|audio|auspost|author|auto|autos|avianca|aws|axa|azure|baby|baidu|banamex|bananarepublic|band|bank|bar|barcelona|barclaycard|barclays|barefoot|bargains|baseball|basketball|bauhaus|bayern|bbc|bbt|bbva|bcg|bcn|beats|beauty|beer|bentley|berlin|best|bestbuy|bet|bharti|bible|bid|bike|bing|bingo|bio|black|blackfriday|blanco|blockbuster|blog|bloomberg|blue|bms|bmw|bnl|bnpparibas|boats|boehringer|bofa|bom|bond|boo|book|booking|boots|bosch|bostik|boston|bot|boutique|box|bradesco|bridgestone|broadway|broker|brother|brussels|budapest|bugatti|build|builders|business|buy|buzz|bzh|cab|cafe|cal|call|calvinklein|camera|camp|cancerresearch|canon|capetown|capital|capitalone|car|caravan|cards|care|career|careers|cars|cartier|casa|case|caseih|cash|casino|catering|catholic|cba|cbn|cbre|cbs|ceb|center|ceo|cern|cfa|cfd|chanel|channel|chase|chat|cheap|chintai|chloe|christmas|chrome|chrysler|church|cipriani|circle|cisco|citadel|citi|citic|city|cityeats|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|coach|codes|coffee|college|cologne|comcast|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cookingchannel|cool|corsica|country|coupon|coupons|courses|credit|creditcard|creditunion|cricket|crown|crs|cruise|cruises|csc|cuisinella|cymru|cyou|dabur|dad|dance|date|dating|datsun|day|dclk|dds|deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|discover|dish|diy|dnp|docs|dodge|dog|doha|domains|dot|download|drive|dstv|dtv|dubai|duck|dunlop|duns|dupont|durban|dvag|dwg|earth|eat|edeka|education|email|emerck|emerson|energy|engineer|engineering|enterprises|epost|epson|equipment|ericsson|erni|esq|estate|esurance|etisalat|eurovision|eus|events|everbank|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|farmers|fashion|fast|fedex|feedback|ferrari|ferrero|fiat|fidelity|fido|film|final|finance|financial|fire|firestone|firmdale|fish|fishing|fit|fitness|flickr|flights|flir|florist|flowers|flsmidth|fly|foo|foodnetwork|football|ford|forex|forsale|forum|foundation|fox|free|fresenius|frl|frogans|frontdoor|frontier|ftr|fujitsu|fujixerox|fun|fund|furniture|futbol|fyi|gal|gallery|gallo|gallup|game|games|gap|garden|gbiz|gdn|gea|gent|genting|george|ggee|gift|gifts|gives|giving|glade|glass|gle|global|globo|gmail|gmbh|gmo|gmx|godaddy|gold|goldpoint|golf|goo|goodhands|goodyear|goog|google|gop|got|gotv|grainger|graphics|gratis|green|gripe|group|guardian|gucci|guge|guide|guitars|guru|hair|hamburg|hangout|haus|hbo|hdfc|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|hitachi|hiv|hkt|hockey|holdings|holiday|homedepot|homegoods|homes|homesense|honda|honeywell|horse|host|hosting|hot|hoteles|hotmail|house|how|hsbc|htc|hughes|hyatt|hyundai|ibm|icbc|ice|icu|ieee|ifm|iinet|ikano|imamat|imdb|immo|immobilien|industries|infiniti|ing|ink|institute|insurance|insure|intel|international|intuit|investments|ipiranga|irish|iselect|ismaili|ist|istanbul|itau|itv|iveco|iwc|jaguar|java|jcb|jcp|jeep|jetzt|jewelry|jio|jlc|jll|jmp|jnj|joburg|jot|joy|jpmorgan|jprs|juegos|juniper|kaufen|kddi|kerryhotels|kerrylogistics|kerryproperties|kfh|kia|kim|kinder|kindle|kitchen|kiwi|koeln|komatsu|kosher|kpmg|kpn|krd|kred|kuokgroup|kyknet|kyoto|lacaixa|ladbrokes|lamborghini|lamer|lancaster|lancia|lancome|land|landrover|lanxess|lasalle|lat|latino|latrobe|law|lawyer|lds|lease|leclerc|lefrak|legal|lego|lexus|lgbt|liaison|lidl|life|lifeinsurance|lifestyle|lighting|like|lilly|limited|limo|lincoln|linde|link|lipsy|live|living|lixil|loan|loans|locker|locus|loft|lol|london|lotte|lotto|love|lpl|lplfinancial|ltd|ltda|lundbeck|lupin|luxe|luxury|macys|madrid|maif|maison|makeup|man|management|mango|market|marketing|markets|marriott|marshalls|maserati|mattel|mba|mcd|mcdonalds|mckinsey|med|media|meet|melbourne|meme|memorial|men|menu|meo|metlife|miami|microsoft|mini|mint|mit|mitsubishi|mlb|mls|mma|mnet|mobily|moda|moe|moi|mom|monash|money|monster|montblanc|mopar|mormon|mortgage|moscow|moto|motorcycles|mov|movie|movistar|msd|mtn|mtpc|mtr|multichoice|mutual|mutuelle|mzansimagic|nab|nadex|nagoya|naspers|nationwide|natura|navy|nba|nec|netbank|netflix|network|neustar|new|newholland|news|next|nextdirect|nexus|nfl|ngo|nhk|nico|nike|nikon|ninja|nissan|nissay|nokia|northwesternmutual|norton|now|nowruz|nowtv|nra|nrw|ntt|nyc|obi|observer|off|office|okinawa|olayan|olayangroup|oldnavy|ollo|omega|one|ong|onl|online|onyourside|ooo|open|oracle|orange|organic|orientexpress|origins|osaka|otsuka|ott|ovh|page|pamperedchef|panasonic|panerai|paris|pars|partners|parts|party|passagens|pay|payu|pccw|pet|pfizer|pharmacy|philips|photo|photography|photos|physio|piaget|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|place|play|playstation|plumbing|plus|pnc|pohl|poker|politie|porn|pramerica|praxi|press|prime|prod|productions|prof|progressive|promo|properties|property|protection|pru|prudential|pub|pwc|qpon|quebec|quest|qvc|racing|raid|read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|reliance|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|rightathome|ril|rio|rip|rmit|rocher|rocks|rodeo|rogers|room|rsvp|ruhr|run|rwe|ryukyu|saarland|safe|safety|sakura|sale|salon|samsclub|samsung|sandvik|sandvikcoromant|sanofi|sap|sapo|sarl|sas|save|saxo|sbi|sbs|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scjohnson|scor|scot|seat|secure|security|seek|select|sener|services|ses|seven|sew|sex|sexy|sfr|shangrila|sharp|shaw|shell|shia|shiksha|shoes|shopping|shouji|show|showtime|shriram|silk|sina|singles|site|ski|skin|sky|skype|sling|smart|smile|sncf|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|space|spiegel|spot|spreadbetting|srl|srt|stada|staples|star|starhub|statebank|statefarm|statoil|stc|stcgroup|stockholm|storage|store|stream|studio|study|style|sucks|supersport|supplies|supply|support|surf|surgery|suzuki|swatch|swiftcover|swiss|sydney|symantec|systems|tab|taipei|talk|taobao|target|tatamotors|tatar|tattoo|tax|taxi|tci|tdk|team|tech|technology|telecity|telefonica|temasek|tennis|teva|thd|theater|theatre|theguardian|tiaa|tickets|tienda|tiffany|tips|tires|tirol|tjmaxx|tjx|tkmaxx|tmall|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|trade|trading|training|travelchannel|travelers|travelersinsurance|trust|trv|tube|tui|tunes|tushu|tvs|ubank|ubs|uconnect|unicom|university|uno|uol|ups|vacations|vana|vanguard|vegas|ventures|verisign|versicherung|vet|viajes|video|vig|viking|villas|vin|vip|virgin|visa|vision|vista|vistaprint|viva|vivo|vlaanderen|vodka|volkswagen|volvo|vote|voting|voto|voyage|vuelos|wales|walmart|walter|wang|wanggou|warman|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|weibo|weir|whoswho|wien|wiki|williamhill|win|windows|wine|winners|wme|wolterskluwer|woodside|work|works|world|wow|wtc|wtf|xbox|xerox|xfinity|xihuan|xin|कॉम|セール|佛山|慈善|集团|在线|大众汽车|点看|คอม|八卦|موقع|一号店|公益|公司|香格里拉|网站|移动|我爱你|москва|католик|онлайн|сайт|联通|קום|时尚|微博|淡马锡|ファッション|орг|नेट|ストア|삼성|商标|商店|商城|дети|ポイント|新闻|工行|家電|كوم|中文网|中信|娱乐|谷歌|電訊盈科|购物|クラウド|通販|网店|संगठन|餐厅|网络|ком|诺基亚|食品|飞利浦|手表|手机|ارامكو|العليان|اتصالات|بازار|موبايلي|ابوظبي|كاثوليك|همراه|닷컴|政府|شبكة|بيتك|عرب|机构|组织机构|健康|рус|珠宝|大拿|みんな|グーグル|世界|書籍|网址|닷넷|コム|天主教|游戏|vermögensberater|vermögensberatung|企业|信息|嘉里大酒店|嘉里|广东|政务|xperia|xyz|yachts|yahoo|yamaxun|yandex|yodobashi|yoga|yokohama|you|youtube|yun|zappos|zara|zero|zip|zippo|zone|zuerich'.split('|');
  var defaults = {
    html: false,
    wiki: false,       // TODO: check all cases
    markdown: false,   // TODO: check all cases
    hashtags: true,
    mentions: true,
    emails: true,
    links: {
      protocols: true,
      www: false,
      tlds: {}
    }
  };
  /* TODO: add more named HTML entities */
  var HTML_ENTITIES = { nbsp: ' ', quot: '"', gt: '>', lt: '<', amp: '&', ndash: '–' };

  for (var i = 0; i < TLDs.length; i++) {
    defaults.links.tlds[TLDs[i]] = true;
  }

  /**
   * Токен, соответствующий некоторой подстроке в представленном на вход тексте.
   *
   * @constructor
   * @property {string} type Тип токена.
   * @property {string} subType Подтип токена.
   * @property {number} st Индекс первого символа, входящего в токен.
   * @property {number} en Индекс последнего символа, входящего в токен.
   * @property {number} length Длина токена.
   * @property {boolean} firstUpper True, если первый символ токена является заглавной буквой.
   * @property {boolean} allUpper True, если все символы в токене являются заглавными буквами.
   */
  var Token = function(source, st, length, index, firstUpper, allUpper, type, subType) {
    this.source = source;
    this.st = st;
    this.length = length;
    this.index = index;
    this.firstUpper = firstUpper;
    this.allUpper = allUpper;
    this.type = type;
    if (subType) {
      this.subType = subType;
    }
  }
  Token.prototype.toString = function() {
    return (('_str' in this) && (this._str.length == this.length)) ? this._str : (this._str = this.source.substr(this.st, this.length));
  }
  Token.prototype.indexOf = function(str) {
    if (str.length == 1) {
      for (var i = 0; i < this.length; i++) {
        if (this.source[this.st + i] == str) {
          return i;
        }
      }
      return -1;
    }
    return this.toString().indexOf(str);
  }
  Token.prototype.toLowerCase = function() {
    return this.toString().toLocaleLowerCase();
  }
  Token.prototype.isCapitalized = function() {
    return this.firstUpper && !this.allUpper;
  }
  Token.prototype.en = function() {
    return this.st + this.length - 1;
  }

  /**
   * Создает токенизатор текста с заданными опциями.
   *
   * @playground
   * var Az = require('az');
   * var tokens = Az.Tokens('Текст (от лат. textus — «ткань; сплетение, связь, паутина, сочетание») — зафиксированная на каком-либо материальном носителе человеческая мысль; в общем плане связная и полная последовательность символов.');
   * tokens.done();
   * @constructor
   * @param {string} [text] Строка для разбивки на токены.
   * @param {Object} [config] Опции, применяемые при разбивке.
   * @param {boolean} [config.html=False] Распознавать и выделять в отдельные
   *  токены (типа TAG) HTML-теги. Кроме того, содержимое тегов &lt;style&gt;
   *  и &lt;script&gt; будет размечено как единый токен типа CONTENT.
   * @param {boolean} [config.wiki=False] Распознавать и выделять в отдельные
   *  токены элементы вики-разметки.
   * @param {boolean} [config.markdown=False] Распознавать и выделять в отдельные
   *  токены элементы Markdown-разметки.
   * @param {boolean} [config.hashtags=True] Распознавать и выделять в отдельные
   *  токены хэштеги (строки, начинающиеся с символа «#»).
   * @param {boolean} [config.mentions=True] Распознавать и выделять в отдельные
   *  токены упоминания (строки, начинающиеся с символа «@»).
   * @param {boolean} [config.emails=True] Распознавать и выделять в отдельные
   *  токены е-мейлы (нет, распознавание всех корректных по RFC адресов не
   *  гарантируется).
   * @param {Object} [config.links] Настройки распознавания ссылок. False, чтобы
   *  не распознавать ссылки совсем.
   * @param {boolean} [config.links.protocols=True] Распознавать и выделять в отдельные
   *  токены ссылки с указанным протоколом (http://, https:// и вообще любым другим).
   * @param {boolean} [config.links.www=False] Распознавать и выделять в отдельные
   *  токены ссылки, начинающиеся с «www.».
   * @param {Object} [config.links.tlds] Объект, в котором ключами должны быть
   *  домены верхнего уровня, в которых будут распознаваться ссылки. По умолчанию
   *  текущий список всех таких доменов.
   * @memberof Az
   */
  var Tokens = function(text, config) {
    if (this instanceof Tokens) {
      this.tokens = [];
      this.source = '';
      if (typeof text == 'string') {
        this.config = config ? Az.extend(defaults, config) : defaults;
        this.append(text);
      } else {
        this.config = text ? Az.extend(defaults, text) : defaults;
      }
      this.index = -1;
    } else {
      return new Tokens(text, config);
    }
  }

  Tokens.WORD = new String('WORD');
  Tokens.NUMBER = new String('NUMBER');
  Tokens.OTHER = new String('OTHER');
  Tokens.DIGIT = new String('DIGIT');
  Tokens.CYRIL = new String('CYRIL');
  Tokens.LATIN = new String('LATIN');
  Tokens.MIXED = new String('MIXED');
  Tokens.PUNCT = new String('PUNCT');
  Tokens.SPACE = new String('SPACE');
  Tokens.MARKUP = new String('MARKUP');
  Tokens.NEWLINE = new String('NEWLINE');
  Tokens.EMAIL = new String('EMAIL');
  Tokens.LINK = new String('LINK');
  Tokens.HASHTAG = new String('HASHTAG');
  Tokens.MENTION = new String('MENTION');
  Tokens.TAG = new String('TAG');
  Tokens.CONTENT = new String('CONTENT');
  Tokens.SCRIPT = new String('SCRIPT');
  Tokens.STYLE = new String('STYLE');
  Tokens.COMMENT = new String('COMMENT');
  Tokens.CLOSING = new String('CLOSING');
  Tokens.TEMPLATE = new String('TEMPLATE');
  Tokens.RANGE = new String('RANGE');
  Tokens.ENTITY = new String('ENTITY');

  /**
   * Отправляет ещё один кусок текста на токенизацию. Таким образом вполне
   * допустимо обрабатывать большие документы частями, многократно вызывая этот
   * метод. При этом токен может начаться в одной части и продолжиться в
   * следующей (а закончиться в ещё одной).
   *
   * @param {string} text Строка для разбивки на токены.
   * @param {Object} [config] Опции, применяемые при разбивке. Перекрывают
   *  опции, заданные в конструкторе токенизатора.
   * @see Tokens
   */
  Tokens.prototype.append = function(text, config) {
    'use strict';
    // Для производительности:
    // - как можно меньше операций конкатенции/разбивки строк
    // - вместо сравнения всего токена, проверяем соответствующий ему символ в исходной строке
    // - типы токенов - константы в Tokens, формально это строки, но сравниваем через === (как объекты)
    config = config ? Az.extend(this.config, config) : this.config;
    if (config.links && (config.links.tlds === true)) {
      config.links.tlds = defaults.links.tlds;
    }

    var offs = this.source.length;
    this.source += text;
    
    var s = this.source, ts = this.tokens;
    for (var i = offs; i < s.length; i++) {
      var ch = s[i];
      var code = s.charCodeAt(i);

      var append = false;
      var last = ts.length - 1;
      var token = ts[last];
      var st = i;

      if (config.html && (ch == ';')) {
        // &nbsp;
        if ((last > 0) && 
            (token.type === Tokens.WORD) && 
            (ts[last - 1].length == 1) && 
            (s[ts[last - 1].st] == '&')) {
          var name = token.toLowerCase();
          if (name in HTML_ENTITIES) {
            ch = HTML_ENTITIES[name];
            code = ch.charCodeAt(0);

            last -= 2;
            token = ts[last];
            ts.length = last + 1;
          }
        } else
        // &x123AF5;
        // &1234;
        if ((last > 1) && 
            ((token.type === Tokens.NUMBER) || 
             ((token.type === Tokens.WORD) &&
              (s[token.st] == 'x'))) && 
            (ts[last - 1].length == 1) &&
            (s[ts[last - 1].st] == '#') && 
            (ts[last - 1].length == 1) &&
            (s[ts[last - 1].st] == '&')) {
          if (s[token.st] == 'x') {
            code = parseInt(token.toString().substr(1), 16);
          } else {
            code = parseInt(token.toString(), 10);
          }
          ch = String.fromCharCode(code);

          last -= 3;
          token = ts[last];
          ts.length = last + 1;
        }
      }

      var charType = Tokens.OTHER;
      var charUpper = (ch.toLocaleLowerCase() != ch);
      if (code >= 0x0400 && code <= 0x04FF) charType = Tokens.CYRIL;
      if ((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A) || (code >= 0x00C0 && code <= 0x024F)) charType = Tokens.LATIN;
      if (code >= 0x0030 && code <= 0x0039) charType = Tokens.DIGIT;
      if ((code <= 0x0020) || (code >= 0x0080 && code <= 0x00A0)) charType = Tokens.SPACE;
      if ('‐-−‒–—―.…,:;?!¿¡()[]«»"\'’‘’“”/⁄'.indexOf(ch) > -1) charType = Tokens.PUNCT;

      var tokenType = charType;
      var tokenSubType = false;
      if (charType === Tokens.CYRIL || charType === Tokens.LATIN) {
        tokenType = Tokens.WORD;
        tokenSubType = charType;
      } else
      if (charType === Tokens.DIGIT) {
        tokenType = Tokens.NUMBER;
      }

      var lineStart = !token || (s[token.st + token.length - 1] == '\n');

      if (config.wiki) {
        if (lineStart) {
          if (':;*#~|'.indexOf(ch) > -1) {
            tokenType = Tokens.MARKUP;
            tokenSubType = Tokens.NEWLINE;
          }
        }
        if ('={[|]}'.indexOf(ch) > -1) {
          tokenType = Tokens.MARKUP;
        }
      }

      if (config.markdown) {
        if (lineStart) {
          if ('=-#>+-'.indexOf(ch) > -1) {
            tokenType = Tokens.MARKUP;
            tokenSubType = Tokens.NEWLINE;
          }
        }
        if ('[]*~_`\\'.indexOf(ch) > -1) {
          tokenType = Tokens.MARKUP;
        }
      }

      if (token) {
        if (config.wiki && 
            (ch != "'") && 
            (token.length == 1) &&
            (s[token.st] == "'") &&
            (last > 0) &&
            (ts[last - 1].type === Tokens.WORD) &&
            (ts[last - 1].subType === Tokens.LATIN)) {
          ts[last - 1].length += token.length;

          last -= 1;
          ts.length = last + 1;
          token = ts[last];
        }

        // Preprocess last token
        if (config.links && 
            config.links.tlds &&
            ((charType === Tokens.PUNCT) || 
             (charType === Tokens.SPACE)) &&
            (ts.length > 2) &&
            (ts[last - 2].type === Tokens.WORD) &&
            (ts[last - 1].length == 1) &&
            (s[ts[last - 1].st] == '.') &&
            (ts[last].type === Tokens.WORD) &&
            (token.toString() in config.links.tlds)) {

          // Merge all subdomains
          while ((last >= 2) &&
                 (ts[last - 2].type === Tokens.WORD) &&
                 (ts[last - 1].length == 1) &&
                 ((s[ts[last - 1].st] == '.') || 
                  (s[ts[last - 1].st] == '@') || 
                  (s[ts[last - 1].st] == ':'))) {
            last -= 2;
            token = ts[last];
            token.length += ts[last + 1].length + ts[last + 2].length;
            token.allUpper = token.allUpper && ts[last + 1].allUpper && ts[last + 2].allUpper;
          }

          if (config.emails && 
              (token.indexOf('@') > -1) && 
              (token.indexOf(':') == -1)) {
            // URL can contain a '@' but in that case it should be in form http://user@site.com or user:pass@site.com
            // So if URL has a '@' but no ':' in it, we assume it's a email
            token.type = Tokens.EMAIL;
          } else {
            token.type = Tokens.LINK;

            if (ch == '/') {
              append = true;
            }
          }
          ts.length = last + 1;
        } else

        // Process next char (start new token or append to the previous one)
        if (token.type === Tokens.LINK) {
          if ((ch == ')') && 
              (last >= 1) && 
              (ts[last - 1].type === Tokens.MARKUP) &&
              (ts[last - 1].length == 1) &&
              (s[ts[last - 1].st] == '(')) {
            tokenType = Tokens.MARKUP;
          } else
          if ((charType !== Tokens.SPACE) && (ch != ',') && (ch != '<')) {
            append = true;
          }
        } else
        if (token.type === Tokens.EMAIL) {
          if ((charType === Tokens.CYRIL) || (charType === Tokens.LATIN) || (ch == '.')) {
            append = true;
          }
        } else
        if ((token.type === Tokens.HASHTAG) || (token.type === Tokens.MENTION)) {
          if ((charType === Tokens.CYRIL) || 
              (charType == Tokens.LATIN) || 
              (charType == Tokens.DIGIT) || 
              (ch == '_') || ((ch == '@') && (token.indexOf('@') == -1))) {
            append = true;
          }
        } else
        if ((token.type === Tokens.TAG) && (token.quote || (s[token.en()] != '>'))) {
          append = true;
          if (token.quote) {
            if ((ch == token.quote) && (s[token.en()] != '\\')) {
              delete token.quote;
            }
          } else
          if ((ch == '"') || (ch == "'")) {
            token.quote = ch;
          }
        } else
        if (token.type === Tokens.CONTENT) {
          append = true;
          if (token.quote) {
            if ((ch == token.quote) && (s[token.en()] != '\\')) {
              delete token.quote;
            }
          } else
          if ((ch == '"') || (ch == "'")) {
            token.quote = ch;
          } else
          if (ch == '>') {
            if ((token.length >= 8) && (token.toString().substr(-8) == '</script')) {
              token.length -= 8;
              st -= 8;

              append = false;
              tokenType = Tokens.TAG;
              tokenSubType = Tokens.CLOSING;
            } else 
            if ((token.length >= 7) && (token.toString().substr(-7) == '</style')) {
              token.length -= 7;
              st -= 7;

              append = false;
              tokenType = Tokens.TAG;
              tokenSubType = Tokens.CLOSING;
            } 
          }
        } else
        if ((token.type === Tokens.TAG) && 
            (token.type !== Tokens.CLOSING) &&
            (token.length >= 8) &&
            (token.toLowerCase().substr(1, 6) == 'script')) {
          tokenType = Tokens.CONTENT;
          tokenSubType = Tokens.SCRIPT;
        } else
        if ((token.type === Tokens.TAG) && 
            (token.type !== Tokens.CLOSING) &&
            (token.length >= 7) && 
            (token.toLowerCase().substr(1, 5) == 'style')) {
          tokenType = Tokens.CONTENT;
          tokenSubType = Tokens.STYLE;
        } else
        if (config.html && 
            (token.length == 1) &&
            (s[token.st] == '<') && 
            ((charType === Tokens.LATIN) || (ch == '!') || (ch == '/'))) {
          append = true;
          token.type = Tokens.TAG;
          if (ch == '!') {
            token.subType = Tokens.COMMENT;
          } else
          if (ch == '/') {
            token.subType = Tokens.CLOSING;
          }
        } else
        if (token.type === Tokens.CONTENT) {
          append = true;
        } else
        if ((token.type === Tokens.MARKUP) && 
            (token.subType == Tokens.TEMPLATE) && 
            ((s[token.en()] != '}') || 
             (s[token.en() - 1] != '}'))) {
          append = true;
        } else
        if ((token.type === Tokens.MARKUP) && 
            (token.type === Tokens.LINK) && 
            (s[token.en()] != ')')) {
          append = true;
        } else
        if ((token.type === Tokens.MARKUP) && 
            (s[token.st] == '`') && 
            (token.subType === Tokens.NEWLINE) &&
            (charType === Tokens.LATIN)) {
          append = true;
        } else
        if ((charType === Tokens.CYRIL) || (charType === Tokens.LATIN)) {
          if (token.type === Tokens.WORD) {
            append = true;
            token.subType = (token.subType == charType) ? token.subType : Tokens.MIXED;
          } else
          if (token.type === Tokens.NUMBER) { // Digits + ending
            append = true;
            token.subType = (token.subType && token.subType != charType) ? Tokens.MIXED : charType;
          } else
          if (config.hashtags && (token.length == 1) && (s[token.st] == '#')) { // Hashtags
            append = true;
            token.type = Tokens.HASHTAG;
          } else
          if (config.mentions && 
              (token.length == 1) && 
              (s[token.st] == '@') && 
              ((last == 0) || (ts[last - 1].type === Tokens.SPACE))) { // Mentions
            append = true;
            token.type = Tokens.MENTION;
          } else
          if ((charType === Tokens.LATIN) && 
              (token.length == 1) && 
              ((s[token.st] == "'") || (s[token.st] == '’'))) {
            append = true;
            token.type = Tokens.WORD;
            token.subType = Tokens.LATIN;
          } else
          if ((token.length == 1) && (s[token.st] == '-')) { // -цать (?), 3-й
            append = true;

            if ((last > 0) && (ts[last - 1].type === Tokens.NUMBER)) {
              token = ts[last - 1];
              token.length += ts[last].length;

              ts.length -= 1;
            }

            token.type = Tokens.WORD;
            token.subType = charType;
          }
        } else
        if (charType === Tokens.DIGIT) {
          if (token.type === Tokens.WORD) {
            append = true;
            token.subType = Tokens.MIXED;
          } else
          if (token.type === Tokens.NUMBER) {
            append = true;
          } else
          if ((token.length == 1) &&
              ((s[token.st] == '+') || (s[token.st] == '-'))) {
            append = true;

            if ((last > 0) && (ts[last - 1].type === Tokens.NUMBER)) {
              token = ts[last - 1];
              token.length += ts[last].length;
              token.subType = Tokens.RANGE;

              ts.length -= 1;
            }

            token.type = Tokens.NUMBER;
          } else
          if ((token.length == 1) &&
              ((s[token.st] == ',') || (s[token.st] == '.')) && 
              (ts.length > 1) && 
              (ts[last - 1].type === Tokens.NUMBER)) {
            append = true;

            token = ts[last - 1];
            token.length += ts[last].length;

            ts.length -= 1;
          }
        } else
        if (charType === Tokens.SPACE) {
          if (token.type === Tokens.SPACE) {
            append = true;
          }
        } else
        if ((token.type === Tokens.MARKUP) && 
            (s[token.st] == ch) &&
            ('=-~:*#`\'>_'.indexOf(ch) > -1)) {
          append = true;
        } else
        if (ch == '.') {
          if (config.links && 
              config.links.www && 
              (token.length == 3) &&
              (token.toLowerCase() == 'www')) { // Links without protocol but with www
            append = true;
            token.type = Tokens.LINK;
          }
        } else
        if (config.wiki && (ch == "'") && (s[token.en()] == "'")) {
          if (token.length > 1) {
            token.length--;
            st--;
            tokenType = Tokens.MARKUP;
          } else {
            append = true;
            token.type = Tokens.MARKUP;
          }
        } else
        if ((ch == '-') || 
            ((token.subType == Tokens.LATIN) && 
             ((ch == '’') || (ch == "'")))) {
          if (token.type === Tokens.WORD) {
            append = true;
          }
        } else
        if (ch == '/') {
          if (config.links && 
              config.links.protocols &&
              (ts.length > 2) &&
              (ts[last - 2].type === Tokens.WORD) &&
              (ts[last - 2].subType == Tokens.LATIN) &&
              (ts[last - 1].length == 1) &&
              (s[ts[last - 1].st] == ':') &&
              (ts[last].length == 1) &&
              (s[ts[last].st] == '/')) { // Links (with protocols)
            append = true;

            token = ts[last - 2];
            token.length += ts[last - 1].length + ts[last].length;
            token.allUpper = token.allUpper && ts[last - 1].allUpper && ts[last].allUpper;
            token.type = Tokens.LINK;

            ts.length -= 2;
          }
        } else
        if (config.html && ch == ';') {
          if ((last > 0) && 
              (token.type === Tokens.WORD) && 
              (ts[last - 1].length == 1) &&
              (s[ts[last - 1].st] == '&')) {
            append = true;

            token = ts[last - 1];
            token.length += ts[last].length;
            token.allUpper = token.allUpper && ts[last - 1].allUpper;
            token.type = Tokens.ENTITY;

            ts.length -= 1;
          } else
          if ((last > 1) && 
              ((token.type === Tokens.WORD) || 
               (token.type === Tokens.NUMBER)) && 
              (ts[last - 1].length == 1) &&
              (s[ts[last - 1].st] == '#') && 
              (ts[last - 2].length == 1) &&
              (s[ts[last - 2].st] == '&')) {
            append = true;

            token = ts[last - 2];
            token.length += ts[last - 1].length + ts[last].length;
            token.allUpper = token.allUpper && ts[last - 1].allUpper && ts[last].allUpper;
            token.type = Tokens.ENTITY;

            ts.length -= 2;
          }
        } else
        if (config.markdown && 
            (ch == '[') && 
            (token.length == 1) &&
            (s[token.st] == '!')) {
          append = true;
          token.type = Tokens.MARKUP;
        } else
        if (config.markdown && 
            (ch == '(') &&
            (token.length == 1) &&
            (s[token.st] == ']')) {
          tokenType = Tokens.MARKUP;
          tokenSubType = Tokens.LINK;
        } else
        if (config.wiki && 
            (ch == '{') &&
            (token.length == 1) &&
            (s[token.st] == '{')) {
          append = true;
          token.type = Tokens.MARKUP;
          token.subType = Tokens.TEMPLATE;
        } else
        if (config.wiki && 
            (ch == '[') && 
            (token.length == 1) &&
            (s[token.st] == '[')) {
          append = true;
        } else
        if (config.wiki && 
            (ch == ']') && 
            (token.length == 1) &&
            (s[token.st] == ']')) {
          append = true;
        } else
        if (config.wiki && (ch == '|') && !lineStart) {
          var found = -1;
          for (var j = last - 1; j >= 0; j--) {
            if ((ts[j].length == 2) && 
                (s[ts[j].st] == '[') && 
                (s[ts[j].st + 1] == '[')) {
              found = j;
              break;
            }
            if (((ts[j].length == 1) && 
                 (s[ts[j].st] == '|')) || 
                ts[j].indexOf('\n') > -1) {
              break;
            }
          }
          if (found > -1) {
            append = true;
            for (var j = last - 1; j >= found; j--) {
              token = ts[j];
              token.length += ts[j + 1].length;
              token.allUpper = token.allUpper && ts[j + 1].allUpper;
            }
            last = found;
            ts.length = last + 1;
            token.subType = Tokens.LINK;
          }
        }
      }

      if (append) {
        token.length++;
        token.allUpper = token.allUpper && charUpper;
      } else {
        token = new Token(s, st, i + 1 - st, ts.length, charUpper, charUpper, tokenType, tokenSubType);
        ts.push(token);
      }
    }
    return this;
  }

  function alwaysTrue() {
    return true;
  }

  function getMatcher(filter, exclude) {
    if (!filter) {
      return alwaysTrue();
    }
    if (typeof filter == 'function') {
      return filter;
    }
    var types = filter;
    var exclusive;
    if ('length' in filter) {
      exclusive = !exclude;
      types = {};
      for (var i = 0; i < filter.length; i++) {
        types[filter[i]] = true;
      }
    } else {
      exclusive = exclude;
      exclude = false;
    }
    return function(token, index, array) {
      if (token.subType) {
        var sub = token.type + '.' + token.subType;
        if (sub in types) {
          return types[sub] != exclude;
        }
      }
      if (token.type in types) {
        return types[token.type] != exclude;
      } else {
        return !exclusive;
      }
    }
  }

  /**
   * Завершает токенизацию, возвращая список токенов.
   *
   * Эта и другие функции принимают последними параметрами filter и флаг exclude. Они
   * служат для фильтрации токенов (потому что часто удобнее получать не все токены, а
   * только определенную часть из них).
   *
   * Если в filter передана функция, то параметр exclude игнорируется, а filter вызывается
   * аналогично коллбэку в методе Array.prototype.filter: ей передаются параметры
   * token, index, array (текущий токен, его индекс и общий список токенов). Будут
   * возвращены только токены, для которых функция вернет истинное значение.
   *
   * Если в filter передан массив (или объект с полем length), то возвращаются токены, типы
   * которых либо входят в этот массив (exclude=false), либо не входят в него (exclude=true).
   * Вместо типов можно использовать строки вида 'WORD.LATIN' (тип, символ «точка» и подтип).
   *
   * Если в filter передать объект, то ключами в нём должны быть типы токенов, а значениями -
   * true или false в зависимости от того, включать такие токены в ответ или нет. Как и в случае случае
   * с массивом, в качестве ключей можно использовать строки вида 'WORD.LATIN'.
   * Здесь параметр exclude означает, следует ли ограничить выдачу только теми типами, которые
   * перечислены в filter.
   * Значения с указанием подтипа имеют больший приоритет, чем просто типы. Благодаря этому можно
   * делать такие странные вещи:
   *
   * ```
   * t.done({ 'WORD': false, 'WORD.LATIN': true }, false);
   * ```
   * (то есть вернуть все теги, кроме тегов с типом WORD, но включить теги с подтипом LATIN)
   *
   * @param {Function|String[]|Object} [filter] Типы токенов, по которым нужно
   *  отфильтровать результат (или функция для фильтрации).
   * @param {boolean} [exclude=False] Инвертирует фильтр, т.е. возвращаются
   *  токены со всеми типами, за исключением перечисленных в filter.
   * @returns {Token[]} Список токенов после фильтрации.
   */
  Tokens.prototype.done = function(filter, exclude) {
    // Finalize tokenizing, return list of tokens
    // For now it just returns tokens, in the future there could be some additional work
    if (!filter) {
      return this.tokens;
    }
    var matcher = getMatcher(filter, exclude);
    var list = [];
    for (var i = 0; i < this.tokens.length; i++) {
      if (matcher(this.tokens[i], i, this.tokens)) {
        list.push(this.tokens[i]);
      }
    }
    return list;
  }

  /**
   * Подсчитывает текущее количество токенов.
   *
   * @param {Function|String[]|Object} [filter] См. описание метода done.
   * @param {boolean} [exclude=False] См. описание метода done.
   * @returns {Number} Число токенов после фильтрации.
   */
  Tokens.prototype.count = function(filter, exclude) {
    if (!filter) {
      return this.tokens.length;
    }
    var matcher = getMatcher(filter, exclude);
    var count = 0;
    for (var i = 0; i < this.tokens.length; i++) {
      if (matcher(this.tokens[i], i, this.tokens)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Получает следующий токен относительно текущей позиции.
   *
   * @param {boolean} moveIndex Следует ли переместить указатель к
   *  следующему токену (в противном случае следующий вызов nextToken вернет
   *  тот же результат)
   * @param {Function|String[]|Object} [filter] См. описание метода done.
   * @param {boolean} [exclude=False] См. описание метода done.
   * @returns {Token|null} Следующий токен или null, если подходящих токенов
   *  впереди нет.
   */
  Tokens.prototype.nextToken = function(moveIndex, filter, exclude) {
    var matcher = getMatcher(filter, exclude);
    var index = this.index;
    index++;
    while (index < this.tokens.length && matcher(this.tokens[index], index, this.tokens)) {
      index++;
    }
    if (index < this.tokens.length) {
      if (moveIndex) {
        this.index = index;
      }
      return this.tokens[index];
    }
    return null;
  }

  /**
   * Проверяет, является ли следующий (за исключением пробелов) токен знаком
   * препинания или нет.
   *
   * @returns {Token|False} False, если следующий токен не является знаком
   *  препинания, либо сам токен в противном случае.
   */
  Tokens.prototype.punctAhead = function() {
    var token = this.nextToken(false, ['SPACE'], true);
    return token && token.type == 'PUNCT' && token;
  }

  /**
   * Получает предыдущий токен относительно текущей позиции.
   *
   * @param {boolean} moveIndex Следует ли переместить указатель к
   *  предыдущему токену (в противном случае следующий вызов prevToken вернет
   *  тот же результат)
   * @param {Function|String[]|Object} [filter] См. описание метода done.
   * @param {boolean} [exclude=False] См. описание метода done.
   * @returns {Token|null} Предыдущий токен или null, если подходящих токенов
   *  позади нет.
   */
  Tokens.prototype.prevToken = function(moveIndex, filter, exclude) {
    var matcher = getMatcher(filter, exclude);
    var index = this.index;
    index--;
    while (index >= 0 && matcher(this.tokens[index], index, this.tokens)) {
      index--;
    }
    if (index >= 0) {
      if (moveIndex) {
        this.index = index;
      }
      return this.tokens[index];
    }
    return null;
  }

  /**
   * Проверяет, является ли предыдущий (за исключением пробелов) токен знаком
   * препинания или нет.
   *
   * @returns {Token|False} False, если предыдущий токен не является знаком
   *  препинания, либо сам токен в противном случае.
   */
  Tokens.prototype.punctBehind = function() {
    var token = this.prevToken(false, ['SPACE'], true);
    return token && token.type == 'PUNCT' && token;
  }

  /**
   * Проверяет, есть ли впереди текущей позиции токены, удовлетворяющие фильтру.
   *
   * @param {Function|String[]|Object} [filter] См. описание метода done.
   * @param {boolean} [exclude=False] См. описание метода done.
   * @returns {boolean} True если впереди есть хотя бы один подходящий токен,
   *  и False в противном случае.
   */
  Tokens.prototype.hasTokensAhead = function(filter, exclude) {
    return this.nextToken(false, filter, exclude) != null;
  }

  /**
   * Проверяет, есть ли позади текущей позиции токены, удовлетворяющие фильтру.
   *
   * @param {Function|String[]|Object} [filter] См. описание метода done.
   * @param {boolean} [exclude=False] См. описание метода done.
   * @returns {boolean} True если позади есть хотя бы один подходящий токен,
   *  и False в противном случае.
   */
  Tokens.prototype.hasTokensBehind = function(filter, exclude) {
    return this.prevToken(false, filter, exclude) != null;
  }

  return Tokens;
}));

}).call(this,"/node_modules\\az\\dist")
},{"fs":2}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
'use strict';

module.exports = collapse;

/* collapse(' \t\nbar \nbaz\t'); // ' bar baz ' */
function collapse(value) {
  return String(value).replace(/\s+/g, ' ');
}

},{}],4:[function(require,module,exports){
module.exports={
  "Latin": {
    "spa": " de|os |de | la|la | y | a |es |ón |ión|rec|ere|der| co|e l|el |en |ien|cho|ent|ech|ció|aci|o a|a p| el|a l|al |as |e d| en|na |ona|s d|da |nte| to|ad |ene|con| pr| su|tod| se|ho |los| pe|per|ers| lo|o d| ti|cia|n d|cio| es|ida|res|a t|tie|ion|rso|te |do | in|son| re| li|to |dad|tad|e s|est|pro|que|men| po|a e|oda|nci| qu| un|ue |ne |n e|s y|lib|su | na|s e|nac|ia |e e|tra| pa|or |ado|a d|nes|ra |se |ual|a c|er |por|com|nal|rta|a s|ber| o |one|s p|dos|rá |sta|les|des|ibe|ser|era|ar |ert|ter| di|ale|l d|nto|hos|del|ica|a a|s n|n c|oci|imi|io |o e|re |y l|e c|ant|cci| as|las|par|ame| cu|ici|ara|enc|s t|ndi| so|o s|mie|tos|una|bre|dic|cla|s l|e a|l p|pre|ntr|o t|ial|y a|nid|n p|a y|man|omo|so |n l| al|ali|s a|no | ig|s s|e p|nta|uma|ten|gua|ade|y e|soc|mo | fu|igu|o p|n t|hum|d d|ran|ria|y d|ada|tiv|l e|cas| ca|vid|l t|s c|ido|das|dis|s i| hu|s o|nad|fun| ma|rac|nda|eli|sar|und| ac|uni|mbr|a u|die|e i|qui|a i| ha|lar| tr|odo|ca |tic|o y|cti|lid|ori|ndo|ari| me|ta |ind|esa|cua|un |ier|tal|esp|seg|ele|ons|ito|ont|iva|s h|d y|nos|ist|rse| le|cie|ide|edi|ecc|ios|l m|r e|med|tor|sti|n a|rim|uie|ple|tri|ibr|sus|lo |ect|pen|y c|an |e h|n s|ern|tar|l y|egu|gur|ura|int|ond|mat|l r|r a|isf|ote",
    "eng": " th|the| an|he |nd |and|ion| of|of |tio| to|to |on | in|al |ati|igh|ght|rig| ri|or |ent|as |ed |is |ll |in | be|e r|ne |one|ver|all|s t|eve|t t| fr|s a| ha| re|ty |ery| or|d t| pr|ht | co| ev|e h|e a|ng |ts |his|ing|be |yon| sh|ce |ree|fre|ryo|n t|her|men|nat|sha|pro|nal|y a|has|es |for| hi|hal|f t|n a|n o|nt | pe|s o| fo|d i|nce|er |ons|res|e s|ect|ity|ly |l b|ry |e e|ers|e i|an |e o| de|cti|dom|edo|eed|hts|ter|ona|re | no| wh| a | un|d f| as|ny |l a|e p|ere| en| na| wi|nit|nte|d a|any|ted| di|ns |sta|th |per|ith|e t|st |e c|y t|om |soc| ar|ch |t o|d o|nti|s e|equ|ve |oci|man| fu|ote|oth|ess| al| ac|wit|ial| ma|uni| se|rea| so| on|lit|int|r t|y o|enc|thi|ual|t a| eq|tat|qua|ive| st|ali|e w|l o|are|f h|con|te |led| is|und|cia|e f|le | la|y i|uma|by | by|hum|f a|ic | hu|ave|ge |r a| wo|o a|ms |com| me|eas|s d|tec| li|n e|en |rat|tit|ple|whe|ate|o t|s r|t f|rot| ch|cie|dis|age|ary|o o|anc|eli|no | fa| su|son|inc|at |nda|hou|wor|t i|nde|rom|oms| ot|g t|eme|tle|iti|gni|s w|itl|duc|d w|whi|act|hic|aw |law| he|ich|min|imi|ort|o s|se |e b|ntr|tra|edu|oun|tan|e d|nst|l p|d n|ld |nta|s i|ble|n p| pu|n s| at|ily|rth|tho|ful|ssi|der|o e|cat|uca|unt|ien| ed|o p|h a|era|ind|pen|sec|n w|omm|r s",
    "por": "os |de | de| a | e |o d|to |ão | di|ent|da |ito|em | co|eit|as |dir|es |ire|rei| se|ção|ade|a p|dad|e d|s d|men|nte|do |s e| pr| pe|dos| to| da|a a|o e| o |o a|ess|con|tod|que| qu|te |e a| do|al |res|ida|m d| in| ou|er |sso| na| re| po|a s| li|uma|cia|ar |pro|e e|a d| te|açã|a t| es| su|ou |ue |s p|tos|a e|des|ra |com|no |ame|ia |e p|tem|nto| pa|is |est|tra|ões|na |s o|oda|das|ser|soa|s n|pes|o p|s a|o s|e o| em| as| à |o o|ais|ber|ado|oa |o t|e s|man|sua|ua | no| os|a c|ter|çõe|erd|lib|rda|s s|nci|ibe|e n|ica|odo|so |nal|ntr|s t|hum|ura| ao|ona|ual| so|or |ma |sta|o c|a n|pre|ara|era|ons|e t|r a|par|o à| hu|ind|por|cio|ria|m a|s c| um|a l|gua|ran| en|ndi|o i|e c|raç|ion|nid|aci|ano|soc|e r|oci| ac|und|sen|nos|nsi|rec|ime|ali|int|um |per|nac| al|m o|r p| fu|ndo|ont|açõ| ig|igu|fun|nta| ma|uni|cçã|ere| ex|a i| me|ese|rio|l d|a o|s h|pel|ada|pri|ide|am |m p|pod|s f|ém |a f|io |ode|ca |ita|lid|tiv|e f|vid|r e|esp|nda|omo|e l|naç|o r|ant|a q|tad|lic|iva| fa|ver|s l|ial|cla|ngu|ing| ca|mo |der| vi|eli|ist|ta |se |ati|ios|ido|r o|eci|dis| un|e i|r d|ecç|o q|s i|qua|ênc|a m|seu|sti|nin|uer|rar|cas|aos|ens|gué|ias|sid|uém|tur|dam|sse|ao |ela|l e|for|tec|ote| pl|ena| tr|m c|tro| ni|ico|rot",
    "ind": "an |ang| da|ng | pe|ak | ke| me|ata| se|dan|kan| di| be|hak|ber|per|ran|nga|yan|eng| ya| ha|asa|gan|men|ara|nya|n p|n d|n k|a d|tan| at|at |ora|ala|san| ba|ap |erh|n b|rha|ya | ma|g b|a s|pen|eba|as |aan|uk |ntu| or|eti|tas|aka|tia|ban|set| un|n s|ter|n y| te|k m|tuk|bas|iap|lam|beb|am | de|k a|keb|n m|i d|unt|ama|dal|ah |ika|dak|ebe|p o|sa |pun|mem|n h|end|den|ra |ela|ri |nda| sa|di |ma |a m|n t|k d|n a|ngg|tau|man|gar|eri|asi| ti|un |al |ada|um |a p|lak|ari|au | ne|neg|a b|ngs|ta |ole|leh|ert|ers|ida|k h|ana|gsa|dar|uka|tid|bat|sia|era|eh |dap|ila|dil|h d|atu|sam|ia |i m| in|lan|aha|uan|tu |ai |t d|a a|g d|har|sem|na |apa|ser|ena|kat|uat|erb|erl|mas|rta|ega|ung|nan|emp|n u|kum|l d|g s| hu|ka |ent|pat|mba|aga|nta|adi| su|eni|uku|n i|huk|ind|ar |rga|i s|aku|ndi|sua|ni |rus|han|si |car|nny| la|in |u d|ik |ua |lah|rik|usi|emb|ann|mer|ian|gga|lai|min|a u|lua|ema|emu|arg|dun|dip|a t|mat|aya|rbu|aru|erk|rka|ini|eka|a k|rak|kes|yat|iba|nas|rma|ern|ese|s p|nus| pu|anu|ina| ta|mel|mua|kel|k s|us |ndu|nak|da |sya|das|pem|lin|ut |yar|ami|upu|seo|aik|eor|iny|aup|tak|ipe|ing|tin| an|dik|uar|ili|g t|rse|sar|ant|g p|a n|aks|ain| ja|t p| um|g m|dir|ksa|umu|kep|mum|i k|eca|rat|m p|h p|aba|ses|m m",
    "fra": " de|es |de |ion|nt |et |tio| et|ent| la|la |e d|on |ne |oit|e l|le | le|s d|e p|t d|ati|roi| dr|dro|it | à | co|té |ns |te |e s|men|re | to|con| l’|tou|que| qu|les| so|des|son| pe|ons| un|s l|s e| pr|ue | pa|e c|t l|ts |onn| au|e a|eme|e e| li|ont|ant|out|ute|t à|res|ers| sa|ce | a |tre|per|a d|cti|er |lib|ité| en|ux | re|en |rso|à l| ou| in|lle|un |nat|ou |nne|n d|une| d’| se|par|nte|us |ur |s s|ans|dan|a p|r l|pro|its|és |t p|ire|e t|s p|sa | dé|ond|é d|a l|nce|ert|aux|omm|nal|me | na| fo|iqu| ce|rté|ect|ale|ber|t a|s a| da|mme|ibe|san|e r| po|com|al |s c|qui|our|t e| ne|e n|ous|r d|ali|ter| di|fon|e o|au | ch|air|ui |ell| es|lit|s n|iss|éra|tes|soc|aut|oci|êtr|ien|int|du |est|été|tra|pou| pl|rat|ar |ran|rai|s o|ona|ain|cla|éga|anc|rs |eur|pri|n c|e m|s t|à u| do|ure|bre|ut | êt|age| ét|nsi|sur|ein|sen|ser|ndi|ens|ess|ntr|ir | ma|cia|n p|st |a c| du|l e| su|bli|ge |rés| ré|e q|ass|nda|peu|ée |l’a| te|a s|tat|il |tés|ais|u d|ine|ind|é e|qu’| ac|s i|n t|t c|n a|l’h|t q|soi|t s|cun|rit| ég|oir|’en|nta|hom| on|n e| mo|ie |ign|rel|nna|t i|l n| tr|ill|ple|s é|l’e|rec|a r|ote|sse|uni|idé|ive|s u|t ê|ins|act| fa|n s| vi|gal| as|lig|ssa|pré|leu|e f|lic|dis|ver| nu|ten|ssi|rot|tec|s m|abl",
    "deu": "en |er |der| un|nd |und|ein|ung|cht| de|ich|sch|ng | ge|ie |che|ech| di|die|rec|gen|ine|eit| re|ch | da|n d|ver|hen| zu|t d| au|ht | ha|lic|it |ten|rei| be|in | ve| in| ei|nde|auf|den|ede|zu |n s|uf |fre|ne |ter|es | je|jed|n u| an|sei|and| fr|run|at | se|e u|das|hei|s r|hte|hat|nsc|nge|r h|as |ens| al|ere|lle|t a| we|n g|rde|nte|ese|men| od|ode|ner|g d|all|t u|ers|te |nen| so|d d|n a|ben|lei| gr| vo|wer|e a|ege|ion| st|ige|le |cha| me|haf|aft|n j|ren| er|erk|ent|bei| si|eih|ihe|kei|erd|tig|n i|on |lun|r d|len|gem|ies|gru|tli|unt|chu|ern|ges|end|e s|ft |st |ist|tio|ati| gl|sta|gun|mit|sen|n n| na|n z|ite| wi|r g|eic|e e|ei |lie|r s|n w|gle|mei|de |uch|em |chl|nat|rch|t w|des|n e|hre|ale|spr|d f|ach|sse|r e| sc|urc|r m|nie|e f|fen|e g|e d| ni|dur|dar|int| du|geh|ied|t s| mi|alt|her|hab|f g|sic|ste|taa|aat|he |ang|ruc|hli|tz |eme|abe|h a|n v|nun|geg|arf|rf |ehe|pru| is|erf|e m|ans|ndl|e b|tun|n o|d g|n r|r v|wie|ber|r a|arb|bes|t i|h d|r w|r b| ih|d s|igk|gke|nsp|dig|ema|ell|eru|n f|ins|rbe|ffe|esc|igu|ger|str|ken|e v|gew|han|ind|rt | ar|ieß|n h|rn |man|r i|hut|utz|d a|ls |ebe|von|lte|r o|rli|etz|tra|aus|det|hul|e i|one|nne|isc|son|sel|et |ohn|t g|sam| fa|rst|rkl|ser|iem|g v|t z|err",
    "jav": "ng |an |ang| ka|ing|kan| sa|ak |lan| la|hak| ha| pa| ma|ngg|ara|sa |abe|ne | in|n k|ant| ng|tan|nin| an|nga|ata|en |ran| ba|man|ban|ane|hi |n u|ong|ra |nth|ake|ke |thi| da|won|uwo|ung|ngs| uw|asa|gsa|ben|sab|ana|aka|beb|a k|g p|nan|nda|adi|at |awa|san|ni |dan|g k|pan|eba| be|e k|g s|ani|bas| pr|dha|aya|gan|ya |wa |di |mar|n s| wa|ta |a s|g u| na|e h|arb|a n|a b|a l|n n| ut|yan|n p|asi|g d|han|ah |g n| tu| um|as |wen|dak|rbe|dar| di|ggo|sar|mat|k h|a a|iya| un|und|eni|kab|be |art|ka |uma|ora|n b|ala|n m|ngk|rta|i h| or|gar|yat|kar|al |a m|n i|na |g b|ega|pra|ina|kak|g a|a p|tum|nya|kal|ger|gge| ta|kat|i k|ena|oni|kas| pe|dad|aga|g m|duw|k k|uta|uwe| si| ne|adh|pa |n a|go |and|i l| ke|nun|nal|ngu|uju|apa|a d|t m|i p|min|iba|er | li|anu|sak|per|ama|gay|war|pad|ggu|ha |ind|taw|ras|n l|ali|eng|awi|a u| bi|we |bad|ndu|uwa|awe|bak|ase|eh | me|neg|pri| ku|ron|ih |g t|bis|iji|i t|e p| pi|aba|isa|mba|ini|a w|g l|ika|n t|ebu|ndh|ar |sin|lak|ur |mra|men|ku | we|e s|a i|liy| ik|ayo|rib|ngl|ami|arg|nas|yom|wae|ut |kon|ae |rap|aku| te|dil|tin|rga|jud|umu| as|rak|bed|k b|il |kap|h k|jin|k a| nd|e d|i s| lu|i w|eka|mum|um |uha|ate| mi|k p|gon|eda| ti|but|n d|r k|ona|uto|tow|wat|gka|si |umr|k l|oma",
    "vie": "ng |̣c |́c | qu| th|à |nh | ng|̣i | nh|và| va|̀n |uyê| ph| ca|quy|ền|yề|̀i | ch|̀nh| tr| cu|ngư|i n|gươ|ườ|́t |ời| gi|ác| co|̣t |ó |c t|ự |n t|cá|ông| kh|ượ|ợc| tư| đư|iệ|đươ|ìn|́i | ha|có|i đ|gia| đê|pha| mo|ọi|mọ|như|n n|củ| ba|̣n |̉a |ủa|n c|̀u |̃ng|ân |ều|ất| bi|tự|hôn| vi|g t| la|n đ|đề|nhâ| ti|t c| đô|ên |bả|hiê|u c| tô|do |hân| do|ch |́ q|̀ t| na|́n |ay | hi|àn|̣ d|ới|há| đi|hay|g n| mô|ốc|uố|n v|ội|hữ|thư|́p |quô| ho|̣p |nà|ào|̀ng|̉n |ị |́ch|ôn |̀o |khô|c h|i c|c đ| hô|i v|tro| đa|́ng|mộ|i t|ột|g v|ia |̣ng|ản|ướ|ữn|̉ng|h t|hư |ện|n b|ộc|ả |là|c c|g c| đo|̉ c|n h|hà|hộ| bâ|ã |̀y | vơ|̣ t|̉i |iế| cô|t t|g đ|ức|iên| vê|viê|vớ|h v|ớc|ực|ật|tha|̉m |ron|ong|áp|g b|hươ| sư|a c|sự|̉o |ảo|h c|ể |o v|uậ|a m|ế |iá|̀ c|cho|qua|hạ|ục| mi|̀ n|phâ|c q|côn|o c|á |i h|ại| hơ|̃ h| cư|n l|bị| lu|bấ|cả|ín|h đ| xa|độ|g h|c n|c p|thu|ải|ệ | hư|́ c|o n| nư|ốn|́o |áo|xã|oà|y t|hả|tộ|̣ c| tâ|thô| du|m v|mì|ho |hứ|ệc|́ t|hợ|án|n p|cũ|ũn|iể|ối|tiê|ề |hấ|ợp|hoa|y đ|chi|o h|ở |ày|̉ t|đó|c l|về|̀ đ|i b|kha|c b| đâ|luâ|ai |̉ n|đố|ết|hự|tri|p q|nươ|dụ|hí|g q|yên|họ|́nh| ta| bă|c g|n g|thê|o t|c v|am |c m|an ",
    "ita": " di|to | de|ion| in|la |e d|di |ne | e |zio|re |le |ni |ell|one|lla|rit|a d|o d|del|itt|iri|dir| co|ti |ess|ent| al|azi|tto|te |i d|i i|ere|tà | pr|ndi|e l|ale|o a|ind|e e|e i|gni|nte|con|i e|li |a s| un|men|ogn| ne|uo | og|idu|e a|ivi|duo|vid| es|tti| ha|div| li|a p|no |all|pro|za |ato|per|sse|ser| so|i s| la| su|e p| pe|ibe|na |a l| il|ber|e n|il |ali|lib|ha |che|in |o s|e s| qu|o e|ia |e c| ri|nza|ta |nto|he |oni|o i| o |sta|o c|nel| a |o p|naz|e o|so | po|o h|gli|i u|ond|i c|ers|ame|i p|lle|un |era|ri |ver|ro |el |una|a c| ch|ert|ua |i a|ssi|rtà|a e|ei |dis|ant| l |tat|a a|ona|ual| le|ità|are|ter| ad|nit| da|pri|dei|à e|cia| st| si|nal|est|tut|ist|com|uni| ed|ono| na|sua|al |si |anz| pa| re|raz|gua|ita|res|der|soc|man|o o|ad |i o|ese|que|enz|ed | se|io |ett|on | tu|dic|à d|sia|i r|rso|oci|rio|ari|qua|ial|pre|ich|rat|ien|tra|ani|uma|se |ll |eri|a n|o n| um|do |ara|a t|zza|er |tri|att|ico|pos|sci|i l|son|nda|par|e u|fon| fo|nti|uzi|str|utt|ati|sen|int|nes|iar| i |hia|n c|sti|chi|ann|ra | eg|egu|isp|bil|ont|a r| no|rop| me|opr|ost| ma|ues|ica|sso|tal|cie|sun|lit|ore|ina|ite|tan| ra|non|gio|d a|e r|dev|i m|l i|ezz|izi| cu|nno|rà |a i|tta|ria|lia|cos|ssu|dal|l p| as|ass|opo|ve |eve",
    "tur": " ve| ha|ve |ler|lar|ir |in |hak| he|her|bir|er |an |arı|eri|ya | bi|ak |r h|eti|ın |iye|yet| ka|ası|ını| ol|tle|eya|kkı|ara|akk|etl|sın|esi|na |de |ek | ta|nda|ini| bu|ile|rın|rin|vey|ne |kla|e h|ine|ır |ere|ama|dır|n h| sa|ına|sin|e k|le | ge|mas|ınd|nın|ı v| va|lan|lma|erk|rke|nma|tin|rle| te|nin|akl|a v|da | de|let|ill|e m|ard|en |riy|aya|nı | hü| şa|e b|k v|kın|k h| me|mil|san| il|si |rdı|e d|dan|hür|var|ana|e a|kes|et |mes|şah|dir| mi|ret|rri| se|ola|ürr|irl|bu |mak| ma|mek|n e|kı |n v|n i|lik|lle| ed| hi|n b|a h| ba|nsa| iş|eli|kar| iç|ı h|ala|li |ulu|rak|evl|e i|ni |re |r ş|eme|etm|e t|ik |e s|a b|iş |n k|hai|nde|aiz| eş|izd|un |olm|hiç|zdi|ar |unm|ma | gö|ilm|lme|im |n t|tir|dil|mal|e g|i v| ko|lun|e e|mel|ket|ık |n s|ele|la |el |r v|ede|şit|ili|eşi|yla|a i| an|anı| et|rı |ahs| ya|sı |edi|siy|t v|i b|se |içi|çin|bul|ame| da|miş|may|tim|a k|tme|r b|ins|yan|nla|mle| di|eye|ger|ye |uğu|erd|din|ser| mü|mem|vle| ke|nam|ind|len|eke|es | ki|n m|it | in| ku|rşı|a s|arş| ay|eml|lek|oru|rme|kor|rde|i m| so|tür|al |lam|eni|nun| uy|ken|hsı|i i|a d|ri |dev|ün |a m|r a|mey|cak|ıyl|maz|e v|ece|ade|iç |şma|mse|te |tün|ims|kim|e y|şı |end|k g|ndi|alı| ce|lem|öğr|ütü|k i|r t| öğ|büt|anl| bü",
    "pol": " pr|nie| i |ie |pra| po|ani|raw|ia |nia|wie|go | do|ch |ego|iek|owi| ni|ści|ci |a p|do |awo| cz|ośc|ych| ma|ek |rze| na|prz| w |wo |ej | za|noś|czł|zło|eni|wa | je|łow|i p|wol|oln| lu|rod| ka| wo|lno|wsz|y c|ma |ny |każ|ażd|o d|stw|owa|dy |żdy| wy|rzy|sta|ecz| sw|dzi|i w|e p|czn|twa|na |zys|ów |szy|ub |lub|a w|est|kie|k m|wan| sp|ają| ws|e w|pow|pos|nyc|rac|spo|ać |a i|cze|sze|neg|yst|jak| ja|o p|pod|acj|ne |ńst|aro|mi | z |i i|nar| ko|obo|awa| ro|i n|jąc|zec|zne|zan|dow| ró|iej|zy |zen|nic|ony|aw |i z|czy|no |nej|o s|rów|odn|cy |ówn|odz|o w|o z|jeg|edn|o o|aki|mie|ien|kol| in|zie|bez|ami|eńs|owo|dno| ob| or| st|a s|ni |orz|o u|ym |stę|tęp|łec|jed|i k| os|w c|lwi|ez |olw|ołe|poł|cji|y w|o n|wia| be|któ|a j|zna|zyn|owe|wob|ka |wyc|owy|ji | od|aln|inn|jes|icz|h p|i s|się|a o|ją |ost|kra|st |sza|swo|war|cza|roz|y s|raz|nik|ara|ora|lud|i o|a z|zes| kr|ran|ows|ech|w p|dów|ą p|pop|a n|tki|stk|gan|zon|raj|e o|iec|i l| si|że |eka| kt| de|em |tór|ię |wni|lni|ejs|ini|odo|dni|ełn|kow|peł|a d|ron|dek|pie|udz|bod|nan|h i|dst|ieg|taw|z p|z w|zeń|god|iu |ano|lar| to|y z|a k|ale|kla|trz|zaw|ich|e i|ier|iko|dzy|chn|w z|by |ków|adz|ekl|ywa|ju |och|kor|sob|ocz|oso|u p|du |tyc|tan|ędz| mi|e s| ta|ki ",
    "gax": "aa |an |uu | ka|ni |aan|umm|ii |mma|maa| wa|ti |nam| fi|ta |tti| na|saa|fi | mi|rga|i k|a n| qa|dha|iyy|oot|in |mir|irg|raa|qab|a i|a k|kan|akk|isa|chu|amu|a f|huu|aba|kka| ta|kam|a a| is|amn|ami|att|ach|mni|yaa| bi|yuu|yyu|ee |wal|miy|waa|ga |ata|aat|tii|oo |a e|moo| ni| ee|ba | ak|ota|a h|i q| ga| dh|daa|haa|a m|ama|yoo|a b|i a|ka |kaa| hi|sum|aas|arg|man| hu| uu|u n| yo| ar| ke| ha|ees| ba|uf |i i|taa|uuf|iin|ada|a w|i f|ani|rra|na |isu| ad|i w|a u|nya|irr|da |hun|hin|ess| ho| ma|i m|und|i b|bar|ana|een|mu |is |bu |f m| ir| sa|u a|add|aad| la|i d|n h|eeg|i h|sa |hoj|abu| ya|kee|al |udh|ook|goo|ala|ira|nda|itt|gac|as |n k|mum|see|rgo|uum|ra |n t|n i|ara|muu|ums|mat|nii|sii|ssa|a d|a q| da|haw|a g|yya|asu|eef|u h|tum|biy| mo|a t|ati|eny|gam|abs|awa|roo|uma|n b|n m|u y|a s|sat|baa|gar|n a|mmo|nis| qo|nna| ku|eer| to|kko|bil|ili|lis|bir|otu|tee|ya |msa|aaf|suu|n d|jii|n w|okk|rka|gaa|ald|un |rum| ye|ame| fu|mee|yer|ero|amm|era|kun|i y|oti|tok|ant|ali|nni| am|lda|lii|n u|lee|ura|lab|aal|tan|laa|i g|ila|ddu|aru|u m|oji|gum|han|ega| se|ffa|dar|faa|ark|n y|hii|qix|gal|ndi| qi|asa|art|ef |uud| bu|jir| ji|arb|n g|chi|tam|u b|dda|bat|di |kar|lam|a l| go|bsi|sad|oka|a j|egu|u t|bee|u f|uun",
    "swh": "a k|wa |na | ya| ku|ya | na| wa|a m| ha|i y|a h|a n|ana|ki |aki|kwa| kw|hak| ka| ma|la |a w|tu |li |a u|ni |i k|a a|ila| ki|ali|a y|ati|za |ili|ifa| mt|ke | an|kil|kat|mtu|ake|ote|te |ka |ika|ma |we |a s|yo |fa |i n|ata|e k|ama|zi |amb|u a|ia |u w| yo|azi|kut|ina|i z|asi| za|o y|uhu|yak|au |ish|mba|e a|u k|hur|ha |tik|wat| au|uru| bi|sha|mu |ara|u n| as|hi | hi|ru |aif|tai|cha|ayo|a b|hal| uh| ch|yot|i h| zi|awa|chi|atu|e n|ngi|u y|mat|shi|ani|eri| am|uli|ele|sa |ja |e y|a t|oja|o k|nch|i a|a j| nc|ima| sh|ami| ta|end|any|moj|i w|ari|ham|uta|ii |iki|ra |ada|wan|wak|nay|ye |uwa| la|ti |eza|o h|iri|iwa|kuw|iwe| wo|fan| sa|she|bu |kan|ao |jam|wen|lim|i m|her|uto|ria| ja| ni|kam|di | hu|zo |a l|da |kaz|ahi|amu|wot|o w|si |dha|bin|ing|adh|a z|bil|e w|nya|kup|har|ri |ang|aka|sta|aji|ne |kus|e m|zim|ini|ind|lin|kul|agu|kuf|ita|bar|o n|uu |iyo|u h|nad|maa|mwe|ine|gin|nye|nde|dam|ta | nd|ndi|rik|asa| ba|rif|uni|nga|hii|lez|bo |azo|uzi|mbo|sil|ush|tah|wam|ibu|uba|imu| ye|esh| ut|taa|aar|wez|i s|e b| si|ala|dhi|eng|aza|tak|hir|saw|izo|kos|tok|oka|yan|a c|wal|del|i b|pat| um|ndo|zwa|mam|a i|guz|ais|eli|mai|laz|ian|aba|man|ten|zin|ba |nda|oa |u m|uku|ufu| mw|liw|aha|ndw|kuh|ua |upa| el|umi|sia",
    "sun": "an |na |eun| ka|ng | sa|ana|ang| di|ak | ha|nga|hak|un |ung|keu|anu| ba| an|nu |a b| bo| je|a h|ata|asa|jeu|ina| ng|ara|nan|awa|gan|ah |sa |a k| na|n k|kan|aha|a p|a s|ga |ban| ma|a n|ing|oga|bog|sar| pa| ku|man|a a|ha |san|ae |bae|din|g s|aga|sah|ra |tan|n s| pe|ala| si|kat|ma |per| ti|aya|sin| at| pi| te|n a|aan|lah|pan|gar|n n|u d|ta |eu |ari|kum|ngs|a m|n b|n d|ran|a d|gsa|wa |taw|k h|ama|ku |ike|n p|eba|bas| ja|al |a t|ika|at |beb|kab|pik|asi|atu|nda|una|a j|nag|e b|n h|en |g k|oh |aba|ila|rta|aku|boh|ngg|abe|art|ar |n j|di |ima|um |ola|geu|usa|aca|sak|adi|k a|udu|teu|car|tin| me| ay|h k| po|eh |u s|aka|rim|ti |sac|k n|ngt|jen|awe|ent|u a|uma|teh|law|ur |h s|dan|bar|uku|gaw|aru|ate|iba|dil|pol|aja|ieu|ere|jal|nar| hu|n t|nya|pa |are|upa|mas|ake|ut |wan| ge|kal|nus| so|ngk|ya |yan|huk| du|tun| mi|mpa|isa|lan|ura|u m|uan|ern|ena|nte|rup|tay|n m| ke|ka |han|und|us |h b|kud|ula|tut| tu| ie|hna|kaw|u k|lak|gam|mna|umn|g d| nu|yun|ri |ayu|wat| wa|eri|g n|a u|i m|u p| ta|du |dit|umu|k k|ren|mba|rik|gta| be|ali|h p|h a|eus|u n|alm|il | da|sas|ami|min|lma|ngu|nas|yat|rak|amp|mer|k j|sab|mum| ra|rua|ame|ua |ter|sal|ksa|men|kas|nge|k d|ona| bi|bis|sio|ion|nal|taa| de|uh |gal|dip|we |bad",
    "ron": " de|și | și|re | în|are|te |de |ea |ul |rep|le |ept|dre|e d| dr|ie |în |e a|ate|ptu| sa|tul| pr|or |e p| pe|la |e s|ori| la| co|lor| or|ii |rea|ce |au |tat|ați| a | ca|ent| fi|ale|ă a|a s| ar|ers|per|ice| li|uri|a d|al | re|e c|ric|nă |i s|e o|ei |tur| să|lib|con|men|ibe|ber|rso|să |tăț|sau| ac|ilo|pri|ăți|i a|i l|car|l l|ter| in|ție|că |soa|oan|ții|lă |tea|ri |a p| al|ril|e ș|ană|in |nal|pre|i î|uni|ui |se |e f|ere|i d|e î|ita| un|ert|ile|tă |a o| se|i ș|pen|ia |ele|fie|i c|a l|ace|nte|ntr|eni| că|ală| ni|ire|ă d|pro|est|a c| cu| nu|n c|lui|eri|ona| as|sal|ând|naț|ecu|i p|rin|inț| su|ră |e n| om|ici|nu |i n|oat|ări|l d| to|tor| di| na|iun| po|oci|tre|ni |ste|soc|ega|i o|gal| so| tr|ă p|a a|n m|sta|va |ă î|fi |res|rec|ulu|nic|din|sa |cla|nd | mo| ce| au|ara|lit|int|i e|ces|uie|at |rar|rel|iei|ons|e e|leg|nit|ă f| îm|a î|act|e l|ru |u d|nta|a f|ial|ra |ă c| eg|ță | fa|i f|rtă|tru|tar|ți |ă ș|ion|ntu|dep|ame|i i|reb|ect|ali|l c|eme|nde|n a|ite|ebu|bui|ât |ili|toa|dec| o |pli|văț|nt |e r|u c|ța |t î|l ș|cu |rta|cia|ane|țio|ca |ită|poa|cți|împ|bil|r ș| st|omu|ăță|țiu|rie|uma|mân| ma|ani|nța|cur|era|u a|tra|oar| ex|t s|iil|ta |rit|rot|mod|tri|riv|od |lic|rii|eze|man|înv|ne |nvă|a ș|cti",
    "hau": "da | da|in |a k|ya |an |a d|a a| ya| ko| wa| a |sa |na | ha|a s|ta |kin|wan|wa | ta| ba|a y|a h|n d|n a|iya|ko |a t|ma |ar | na|yan|ba | sa|asa| za| ma|a w|hak|ata| ka|ama|akk|i d|a m| mu|su |owa|a z|iki|a b|nci| ƙa| ci| sh|ai |kow|anc|nsa|a ƙ|a c| su|shi|ka | ku| ga|ci |ne |ani|e d|uma|‘ya|cik|kum|uwa|ana| du| ‘y|ɗan|ali|i k| yi|ada|ƙas|aka|kki|utu|n y|a n|hi | ra|mut| do| ad|tar| ɗa|nda| ab|man|a g|nan|ars|and|cin|ane|i a|yi |n k|min|sam|ke |a i|ins|yin|ki |nin|aɗa|ann|ni |tum|za |e m|ami|dam|kan|yar|en |um |n h|oka|duk|mi | ja|ewa|abi|kam|i y|dai|mat|nna|waɗ|n s|ash|ga |kok|oki|re |am |ida|sar|awa|mas|abu|uni|n j|una|ra |i b| ƙu|dun|a ‘|cew|a r|aba|ƙun|ce |e s|a ɗ|san|she|ara|li |kko|ari|n w|m n|buw|aik|u d|kar| ai|niy| ne|hal|rin|bub|zam|omi| la|rsa|ubu|han|are|aya|a l|i m|zai|ban|o n|add|n m|i s| fa|bin|r d|ake|n ‘|uns|sas|tsa|dom| ce|ans| hu|me |kiy|ƙar| am|ɗin| an|ika|jam|i w|wat|n t|yya|ame|n ƙ|abb|bay|har|din|hen|dok|yak|n b|nce|ray|gan|fa |on | ki|aid| ts|rsu| al|aye| id|n r|u k|ili|nsu|bba|aur|kka|ayu|ant|aci|dan|ukk|ayi|tun|aga|fan|unc| lo|o d|lok|sha|un |lin|kac|aɗi|fi |gam|i i|yuw|sun|aif|aja| ir|yay|imi|war| iy|riy|ace|nta|uka|o a|bat|mar|bi |sak|n i| ak|tab|afi|sab",
    "fuv": "de | e |e n|nde| ha|la |e e| ka|akk| nd| wa|ina|al |hak|na | in|ndi|kke|ɗo |di |ii |ade|aad|um |ko |i h|ala| mu| ne|lla|mum|ji |wal| jo| fo|all|eɗɗ| le|neɗ|e h|kal| ko|taa|re | ng|aaw|e k|aa |jog|e w|ley|ee |ke |laa|e m|eed|e l|nnd|aag|ɗɗo|ol | ta|o k|gu |kee|le |waa|ond|gal|a j|ogi|am |eji|dee|m e|ti |nga|e d|ɗe |awa|ɓe | wo|gii|eej|ede|gol|aan| re| go|i e|agu|e t|ann|fot|eyd|oti|ɗee|pot| po|maa|naa|oto|ydi| he|i n|ni |taw|enn|een|dim|to |a i|e f|e j|goo|a k|der| fa| aa|ele| de|o n|dir| ba|er |ngu|oot|ndo|i k|ota|ima| sa|won|ay |ka |a n|oor|a f|ngo|tee| ja|i f| to|o f|e ɓ|i w|wa |ren|a e|nan|kam|hay|ma |eyɗ|o t|awi|yɗe|ore|o e|too|and|fof|i m|a w|ñaa|e y|hee| do|eel|ira|nka|aak|e g|e s|l e|of |aar| ɓe|dii| la|ani|e p|tin|a t| te| na|e i| so|o w|ral|e r|are|ooj|awo|woo|gaa| ma|u m|kaa|faw| ña|dow| mo|oo | ya|aam|nge|nng| yi|und| ho|en |i l|so | mb| li|o i|e a| nj| o |ude|e b|o h|igg|ɗi |lig|nda|ita|baa| di|iin| fe|iti|aaɗ|ama|inn|haa|iiɗ|a h| no|tii|den|tal| tu|tuu|yan|l n|yim|do |non|imɓ|bel| je|ine| hu|njo|ugn|guu|no | da|edd|uug|mii|nee|jey|a d|ano| ke|lit|lli|go |je |ank|tde|amt|ent|eɗe|ɓam| ɓa|mɓe|y g|aga|alt|ɗɗa|ind|wit| su|nna| ɗe|ree|ŋde|i a|m t|aŋd|l h|jaŋ|ago|ow |ete| ɗu",
    "bos": " pr| i |je |rav| na|pra|na |da |ma |ima| sv|a s|nje|a p| da| po|anj|a i|vo |va |ko |ja | u |ako|o i|no | za|e s|ju |avo| im|ti |sva|ava|i p|o n|li |ili|i s|van|ost| ko|vak|ih |ne |a u| sl|nja|koj| dr| ne|jed| bi|i d|ije|stv|u s|lob|im |slo| il|bod|obo| ra|sti|pri| je| su|vje|om |a d|se |e i| ob|a n|i i| se|dru|enj| os|voj|cij|e p|a b|su |o d|uje|u p|raz|i n|a o| od|lo |u o|ova|u i|edn|i u| nj|ovo|jen|lju|ni |oje|nos|a k|ran|dje|iti|o p|aci|žav|a j|i o|e o|pre|pro|bra|nih|ji | ka|e d|jeg|og |sta| tr|tre|bud|u n|drž|u z|rža|bit|svo|ija|elj|reb|e b|mij|jem|avn|pos| bu|ka |aju| iz|ba |ve |rod|de |aro|e u|iva|a z|em |šti|ilo|eni|lje|ći |red|bil|jel|jer| ni|odn|m i|du |tva|nar|gov| sa|oji| do|tu |vim|u d| st|o k|e n|a t|za |nim| dj| sm|ući|ičn|dna|i m|oda|vno|eba|ist|nac|e k|čno|nak|ave|tiv|eđu|nov|olj|sno|ani|aln|an |nom|i b|stu|nst|eno|oj |osn|a r|ovj|nap|smi|nog|čov|oja|nju|ara|nu |dno|ans|ovi|jan|edi|m s| kr|h p|tup| op| čo|iko|jek|tvo| vj| mi|tel|vu |obr|živ|tit|o o|una|odu| mo| ov|kri|ego|din|rug|nik|rad|pod|nji|sam|sto|lja|dst|rim|ite|riv| te|m n|vol|i v|e t|vni|akv|itu|g p| ta|ašt|zaš|svi|ao |te |o s|ak |mje|a č|odr|udu|kla|i t|avi|tno|nič| vr|nic|dni|u u|ina| de|oba|od |jih|st ",
    "hrv": " pr| i |je |rav|pra|ma | na|ima| sv|na |ti |a p|nje| po|a s|anj|a i|vo |ko |da |vat|va |no | za|i s|o i|ja |avo| u | im|sva|i p| bi|e s|ju |tko|o n|li |ili|van|ava| sl|ih |ne |ost| dr|ije| ne|jed|slo| ra|u s|lob|obo| os|bod| da| ko|ova|nja|koj|i d|atk|iti| il|stv|pri|om |im | je| ob| su| ka|i i|i n|e i|vje|i u|se |dru|bit|voj|ati|i o|ćen|a o|o p|a b|a n|ući| se|enj|sti|a u|edn|dje|lo |ćav| mo|raz|u p| od|ran|ni |rod|a k|su |aro|drć|svo|ako|u i|rća|a j|mij|ji |nih|eni|e n|e o| nj|pre|pos|ćiv|oje|eno|e p|nar|oda|nim|ovo|aju|ra |ći |og |nov|iva|a d|nos|bra|bil|i b|avn|a z|jen|e d|ve |ora|tva|jel|sta|mor|u o|cij|pro|ovi|za |jer|ka |sno|ilo|jem|red|em |lju|osn|oji| iz|aci| do|lje|i m| ni|odn|nom|jeg| dj|vno|vim|elj|u z|o d|rad|o o|m i|du |uje| sa|nit|e b| st|oj |tit|a ć|dno|e u|o s|u d|eću|ani|dna|nak|nst|stu| sm|e k|u u|an |gov|nju|juć|aln|m s|tu |a r|ćov|jan|u n|o k|ist|ću |te |tvo|ans|šti|nu |ara|nap|m p|nić|olj|bud| bu|edi|ovj|i v|pod|sam|obr|tel| mi|ina|zaš|e m|ašt| vj|ona|nji|jek| ta|duć|ija| ćo|tup|h p|oja|smi|ada| op|oso|una|sob|odu|dni|rug|udu|ao |di |avi|tno|jim|itu|itk|će |odr|ave|meć|nog|din|svi| ći|kak|kla|rim|akv|elo|štv|ite|vol|jet|opć|pot|tan|ak |nic|nac|uće| sk| me|ven",
    "nld": "en |de |an | de|van| va| en| he|ing|cht|der|ng |n d|n v|et |een| ge|ech|n e|ver|rec|nde| ee| re| be|ede|er |e v|gen|den|het|ten| te| in| op|n i| ve|lij| zi|ere|eli|zij|ijk|te |oor|ht |ens|n o|and|t o|ijn|ied|ke | on|eid|op | vo|jn |id |ond|in |sch| vr|aar|n z|aan| ie|rde|rij|men|ren|ord|hei|hte| we|eft|n g|ft |n w|or |n h|eef|vri|wor| me|hee|al |t r|of |le | of|ati|g v|e b|eni| aa|lle| wo|n a|e o|nd |r h|voo| al|ege|n t|erk| da| na|t h|sta|jke|at |nat|nge|e e|end| st|om |e g|tie|n b|ste|die|e r|erw|wel|e s|r d| om|ij |dig|t e|ige|ter|ie |gel|re |jhe|t d| za|e m|ers|ijh|nig|zal|nie|d v|ns |d e|e w|e n|est|ele|bes| do|g e|che|vol|ge |eze|e d|ig |gin|dat|hap|cha|eke| di|ona|e a|lke|nst|ard| gr|tel|min| to|waa|len|elk|lin|eme|jk |n s|del|str|han|eve|gro|ich|ven|doo| wa|t v|it |ove|rin|aat|n n|wet|uit|ijd|ze | zo|ion| ov|dez|gem|met|tio|bbe|ach| ni|hed|st |all|ies|per|heb|ebb|e i|toe|es |taa|n m|nte|ien|el |nin|ale|ben|daa|sti| ma|mee|kin|pen|e h|wer|ont|iet|tig|g o|s e| er|igd|ete|ang|lan|nsc|ema|man|t g|is |beg|her|esc|bij|d o|ron|tin|nal|eer|p v|edi|erm|ite|t w|t a| hu|rwi|wij|ijs|r e|weg|js |rmi|naa|t b|app|rwe| bi|t z|ker|ame|eri|ken| an|ar | la|tre|ger|rdi|tan|eit|gde|g i|d z|oep",
    "srp": " pr| i |rav|pra| na|na |ma | po|je | sv|da |a p|ima|ja |a i|vo |nje|va |ko |anj|ti |i p| u |ako|a s| da|avo|i s|ju |ost| za|sva|o i|vak| im|e s|o n|ava| sl|nja| ko|no |ne |li |om | ne|ili| dr|u s|slo|koj|a n|obo|ih |lob|bod|im |sti|stv|a o| bi| il| ra|pri|a u|og | je|jed|e p|enj|ni |van|u p|nos|a d|iti|a k|edn|i u|pro|o d|ova| su|ran|cij|i i|sta|se | os|e i|dru| ob|i o|rod|aju|ove| de|i n| ka|aci|e o| ni| od|ovo|i d|ve | se|eni|voj|ija|su |u i|žav|avn|uje| st|red|m i|dna|a b|odi|ara|drž|ji |nov|lju|e b|rža|tva|što|u o|oja| ov|a j|odn|u u|jan|poš|jen| nj|nim|ka |ošt|du |raz|a z| iz|sno|o p|vu |u n|u d|šti|osn|e d|pre|u z|de |ave|nih|bit|aro|oji|bez|tu |gov|lje|ičn| sa|lja|svo|lo |za |vno|e n|eđu| tr|nar| me|vim|čno|oda|ani|đen|nac|nak|an |to |tre|ašt| kr|stu|nog|o k|m s|tit|aln|nom|oj |pos|e u|reb| vr|olj|dno|iko|ku |me |nik| do|ika|e k|jeg|nst|tav|em |i m|sme|o s|dni|bra|nju|šen|ovi|tan|te |avi|vol| li|zaš|ilo|rug|var|kao|ao |riv|tup|st |živ|ans|eno|čov|štv|kla|vre|bud|ena| ve|ver|odu|međ|oju|ušt| bu|kom|kri|pod|ruš|m n|i b|ba |a t|ugi|edi| mo|la |u v|kak| sm|ego|akv|o j|rad|dst|jav|del|tvo| op|nu |por|vlj|avl|m p|od |jem|oje| čo|a r|sam|i v|ere|pot|o o|šte|rem|vek|svi| on|rot|e r",
    "ckb": " he| û |ên | bi| ma|in |na | di|maf|an |ku | de| ku| ji|xwe|her| xw|iya|ya |kes|kir|rin|iri| ne|ji |bi |yên|afê|e b|de |tin|e h|iyê|ke |es |ye | we|er |di |we |ê d|i b| be|erk|ina| na| an|î û|yê |eye|î y|kî |rke|nê |diy|ete|eke|ber|hem|hey| li| ci|wek|li |n d|fê | bê| te|ne |yî | se|net|rî |tew|yek|sti|af | ki|re |yan|n b|kar|hev|e k|aza|n û|wî | ew|i h|n k|û b|î b| mi| az|dan| wî|ekî|î a|a m|zad|e d|mir|bin|est|ara|iro|nav|ser|a w|adi|rov|n h|anê|tê |ewe|be |ewl|ev |mû | ya|tî |ta |emû| yê|ast|wle| tê|n m| bo|wey|s m|bo | tu|n j|ras| da| me|din|î d|ê h|n n|n w|ing|st | ke| ge|în |ar | pê|iye|îna|bat|r k|ema|cih|ê b|wed|û m|dî |û a|vak|ê t|ekh|par| ye|vî |civ|n e|ana|î h|ê k|khe|geh|nge|ûna|fên|ane|av |î m|bik|eyê|eyî|e û| re|man|erb|a x|vê |ê m|iva|e n|hî |bûn|kê | pa|erî|jî |end| ta|ela|nên|n x|a k|ika|f û|f h|î n|ari|mî |a s|e j|eza|tên|nek| ni|ra |ehî|tiy|n a|bes|rbe|û h|rwe|zan| a |erw|ov |inê|ama|ek |nîn|bê |ovî|ike|a n| ra|riy|i d|anî|û d|e e|etê|ê x|yet|aye|ê j|tem|e t|erd|i n|eta|ibe|a g|u d|xeb|atê|i m|tu | wi|dew|mal|let|nda|ewa| ên|awa|e m|a d|mam|han|u h|a b|pêş|ere| ba|lat|ist| za|bib|uke|tuk|are|asî|rti|arî|i a|hîn| hî|edi|nûn|anû|qan| qa| hi| şe|ine|n l|mên|ûn |e a",
    "yor": "ti | ní|ó̩ | è̩|ní | lá|̩n |o̩n|é̩ |wo̩|àn | e̩|kan|an |tí | tí|tó̩| kò|ò̩ |̩tó| àw| àt|è̩ |è̩t|e̩n|bí |àti|lát|áti| gb|lè̩|s̩e| ló| ó |àwo|gbo|̩nì|n l| a | tó|í è|ra | s̩|n t|ò̩k|sí |tó |̩ka|kò̩|ìyà|o̩ | sí|ílè|orí|ni |yàn|dè |̩‐è|ì k|̩ à|èdè| or|ún |ríl|è̩‐|í à|jé̩|‐èd|àbí|̩ò̩|ò̩ò|tàb|nì |í ó|n à| tà|̩ l|jo̩| ti|̩e |̩ t| wo|nìy|í ì|ó n| jé| sì|ló |kò |n è|wó̩| bá|n n|sì | fú|̩ s|í a|rè̩|fún| pé| òm|̩ni|gbà| kí| èn|ènì|in |òmì|ìí |ba |nir|pé |ira|mìn|ìni|n o|ràn|ìgb| ìg|bá |e̩ | rè|̩ n|kí |n e|un |gba|̩ p|í ò|nú | o̩|nín|gbé|yé | ka|ínú|a k|fi | fi|mo̩|bé̩|o̩d|dò̩|̩dò|ó s|i l|̩ o|̩ ì|wà |í i|i ì|hun|bò |i ò|dá |bo̩|o̩m|̩mo|̩wó|bo |áà |̩ k|ó j|ló̩|àgb|ohu| oh| bí| ò̩|bà |ara|yìí|ogb|írà|n s|ú ì| ìb|pò̩|í k| lè|bog|i t|à t|óò |yóò|kó̩|gé̩|à l|ó̩n|rú |lè | yó|̩ ò|̩ e|a w|̩ y|ò̩r|̩ f| wà|ò l|í t|ó b|i n|ó̩w|̩gb|yí |í w|ìké|̩ a|láà|wùj|àbò|i è|ùjo|fin|é̩n|n k|í e|i j|ú à| ìk|òfi| òf| ar|i s|mìí|ìír| mì| ir|rin|náà| ná|jú |̩ b| yì|ó t|̩é̩| i |̩ m|fé̩|kàn|rí |ú è|à n|wù |s̩é|é à| mú| èt|áyé|í g|̩kó|̩dá|è̩d|àwù|è̩k| ìd|irú|í o|i o|i à|láì|í n|ípa| kú|níp| ìm|a l|ké̩|bé |i g|de |ábé|ìn |báy|̩è̩|ígb|wò̩|níg|mú |láb| àà|n f|è̩s|̩ w|ùn |i a|ayé|èyí| èy|mó̩|á è| ni|n b| wó|je̩| ìj|gbá|ò̩n|ó̩g",
    "uzn": "lar|ish|an |ga |ar | va| bi|da |va |ir | hu|iga|sh |uqu|shi|bir|quq|huq|gan| bo| ha|ini|ng |a e|r b| ta|lis|ni |ing|lik|ida|oʻl|ili|ari|nin|on |ins| in|adi|nso|son|iy | oʻ|lan| ma|dir|hi |kin|har|i b|ash| yo|boʻ| mu|dan|uqi|ila|ega|qla|r i|qig|oʻz| eg|kla|a b|qil|erk|ki | er|oli|nli|at | ol|gad|lga|rki|oki|i h|a o| qa|yok|lig|osh|igi|ib |las|n b|atl|n m| ba|ara| qi|ri | sh|iya|ala|lat|in |ham|bil|a t|a y|bos|r h|siy|n o|yat|inl|ik |a q|cha|a h| et|eti|nis|a s|til|ani|h h|i v|mas|tla|osi|asi| qo|ʻli|ati|i m|rni|im |uql|arn|ris|qar|a i|gi | da|n h|ha |sha|i t|mla|rch| xa|i o|li |hun|bar|lin|ʻz |arc|rla| bu|a m|a a| as|mum| be| tu|aro|r v|ikl|lib|taʼ|h v|tga|tib|un |lla|mda| ke|shg| to|n q|sid|n e|mat|amd|shu|hga| te|tas|ali|umk|oya|hla|ola|aml|iro|ill|tis|iri|rga|mki|irl| ya|xal|dam| de|gin|eng|rda|tar|ush|rak|ayo| eʼ| so|ten|alq| sa|ur | is|imo|r t| ki|mil| mi|era|zar|hqa|aza|k b| si|nda|hda|kat|ak |oʻr|n v|a k|or |rat|ada|ʻlg|miy|tni|i q|shq|oda|shl|bu |dav|nid|y t|ch |asl|sos|ilg|aso|n t|atn|sin|am |ti |as |ana|rin|siz|yot|lim|uni|nga|lak|n i|a u|qon|i a|h k|vla|avl|ami|dek| ja|ema|a d|na | em|ekl|gʻi|si |i e|ino| ka|uch|bor|ker| ch|lma|liy|a v|ʼti|lli|aka|muh|rig|ech|i y|uri|ror",
    "zlm": "an |ang| ke| se|ng | da|dan|ada|ara| pe|ak | be|ran|ber| me|ah |nya|hak|per|n s|ata|ala|ya |a s|kan|asa|n k|lah| di|da |aan|gan|nga|dal| ma|n d|erh|eba|rha|a p| ha|kep|pad|yan| ya|ap |ama| ba|nda| te|ra |tia|man|eng|a b|a d|ora|men|n p|ter|iap|san|epa| or|pen|eti| ad| at|a a|n a|set|tan|h b|tau|sia|n t|apa|dak|pa |sa |au |ta |ela|bas|at | sa|n b|beb|n m|keb|h d|p o|end|ega|aka|a k|am |sam|gar|ana|leh|lam|ole| un|neg|k k|ban|g a|di |n y|eh |a m|eri|aha|han| ti|a t|ma |any|uan|seb|ebe|ngs|atu|mas|bag|car|mem|ing|ian| ne|kes|i d|gsa|ia |ika|mat|agi|ert| de| la|emb|und|nan|asi|emu|ers|epe|na |anu|gi |ung|erk|n h|ngg|tu |ind|pem|i m|g b|kla| in|iha|pun|i s|erl|akl|era|as |dap|eca|sec|al |k m|bar|nus|usi|lan|tin|si |awa|nny| su|bol|sas| as|ini|rta|rat|ena|sem|aya|ni |den|g m|g t|kem|i k|adi|ai |ti | ap| ta|in | he| bo|had|uka|tar| an|hen|ann|ain|ka |rka|ri |ema|k h|n i|g s|dia|dun|ira|rsa|elu|nta|a n|mel|iad|uk |mpu|ua |har|kat|aga|lai|enu|ses|emp|ntu|k d|ent|un |mba|rma|jua|uat|k a|mar|rak|h m|ila|lua|i a|aja|ker|dil|g d|uma|rli|lin|esi|sua|nak|ndu|l d| pu|t d|erm|ser|ar |ese|ati|tuk|rga|i p|dar|esa|bah| ol|ari|ngk|ant|sek|gam|raa|mbe|ida|sat|iri|kea|i b|saa|dir|g u|erj|tik|unt|eka|rja",
    "ibo": "a n|e n|ke | na|na | ọ | bụ| n |nwe|ere|ọ b|re |nye| nk|ya |la | nw| ik| ma|ye |e ọ|ike|a o|nke|a m|ụ n| ya|a ọ|ma |bụl|ụla| on| a |e i|kik|iki|ka |ony|ta |bụ |kwa| nd|a i|i n|di |a a|wa |wer|do | mm|dụ |e a|ha | ga|any| ob|ndi| ok|he |e m|e o|a e|ọ n|ite|rụ |hi |mma|ga‐|wu |ara| dị|aka|che|oke|we |o n| ih|n o|adụ|mad|obo|bod|a g|odo| ka| ez|te |hị |be |ụta|dị | an|zi | oh|a‐e|akw|gba|i m|me | ak|u n|nya|ihe|ala|ohe|ghi|ri | ọz|her|ra |weg| nt| iw| mb|ba |pụt| si|ro |oro|iwu|chi|a‐a|rị |ụ i|ụ ọ| eb|iri|ebe|ụrụ|zọ | in|a y|ezi|e ị|kpa|le |ile|ịrị|n e|kpe|mba| ha|bi |sit|e e|inw|nil|asị| en|mak|a u| ni|apụ|chị|i i|ghị|i ọ|i o|si | e |ide|o i|e y|ụ m|a s|u o|kwu|ozu|yer|ru |enw|ụ o|ọzọ|gid|hụ |n a|ahụ|nkw|sor|egh|edo|a ụ|tar|n i|toz|ị o|pa |i a| me|ime|uru|kwe| mk|tu |ama|eny|uso|de | im|ọ d|osi|hed|a d| kw|mkp|wet| ọr| ọn|obi|ọrụ| ịk| to|gas| ch|ịch|nha|ọnọ|nọd| nc| al|n ụ|ị m| us|nọ |u ọ|nch| o |eta|n u| ot|otu|sir|sịr| nh|a k|ali|o m| ag| gb|e s|ọta|nwa|ị n|lit|ega|ji |ọdụ|e k|ban|e g|ị k|esi|agb|eme|hu |ikp|zu |pe |nta|na‐|chọ|u a|a b|uch|n ọ|onw|ram|kwụ|ekọ|i e| nọ| ug|ọch|u m|gwu|a h|zụz|ugw|meg|ị e|nat|e h|dịg|o y|kpu|pụr|cha|zụ |hịc|ich| ng|ach| og|wap|wan|ịgh|uwa| di| nn|i ị",
    "ceb": "sa | sa|ng |ang| ka|an | pa|ga | ma|nga|pag| ng|a p|on |kat|a k|ug |od | ug|g m| an|ana|n s|ay |ung|ata|ngo|a m|atu|ala|san|ag |tun|g s|g k|god|d s|a s|ong|mga| mg|g p|n u|yon|a a|pan|ing|usa|tan|tag|una|aga|mat|ali|g u|han|nan| us|man|y k|ina|non|kin| na|syo|lan|a b|asa|nay|n n|a i|awa| ta|taw|gaw|nsa|a n|nas| o |ban|agp|isa|dun|was|iya| gi|asy|adu|ini|bis| ad|ili|o s| bi|g a|nah|nag|a t| ki|lin|lay|ahi|sam|al |wal| di|nal|asu| ba|ano|agt| wa|ama|yan|a u| iy|kan|him|n k|gan|ags|n a|kag| un|ya |kas|gpa|g t| su|aha|wha|agk|awh|gka|a g|kal|l n|gla|gsa|sud|gal|imo|ud |d u|ran|uka|ig |aka|aba|ika|g d|ara|ipo|ngl|g n|uns|n o|kau|i s|y s|og |uta|d n|li | si|gik|g i|mta|ot |iin| la| og|o a|ayo|ok |awo|aki|kab|aho|n m|hat|o p|gpi|a w|apa|lip|ip | hu| ga|a h|uba|na | ti|bal|gon|la |ati|wo |ad |hin|sal|gba|buh| bu| ub|uha|agb|hon|ma |nin|uga|t n|ihi| pi|may| pu|mak|ni | ni|d a|pin|abu|agh|ahu|uma|as |dil|say| in|at |ins|lak|hun|ila|mo |s s|sak|amt|o u|pod|ngp|tin|a d|but|ura|lam|aod|t s|bah|ami|aug|mal|sos|os |k s| il|tra| at|gta|bat|aan|ulo|iha|ha |n p| al|g b|lih|kar|lao|agi|amb|mah|ho |sya|ona|aya|ngb|in |inu|a l| hi|mag|iko|it |agl|mbo|oon|tar|o n|til|ghi|rab|y p| re|yal|aw |nab|osy|dan",
    "tgl": "ng |ang| pa|an |sa | sa|at | ka| ng| ma|ala|g p|apa| na|ata|pag|pan| an| at|ay |ara|ga |a p|tan|g m|mga| mg|n n|pat| ba|n a|aya|na |ama|g k|awa|kar|a k|lan|rap|gka|nga|n s|g n|aha|g b|a a| ta|agk|gan|tao|asa|aka|yan|ao |a m|may|man|kal|ing|a s|nan|aga| la|ban|ali|g a|ana|y m|kat|san|kan|g i|ong|pam|mag|a n|o a|baw|isa|wat| y |lay|g s|y k|in |ila|t t| ay|aan|o y|kas|ina|t n|ag |t p|wal|una|yon| o | it|nag|lal|tay|pin|ili|ans|ito|nsa|lah|kak|any|a i|nta|nya|to |hay|gal|mam|aba|ran|ant|agt|on |t s|agp| wa| ga|gaw|han|kap|o m|lip|ya |as |g t|hat|y n|ngk|ung|no |g l|gpa|wa |lag|gta|t m|kai|yaa|sal|ari|lin|a l|pap|ahi| is| di|ita| pi|pun|agi|ipi|mak|a b|y s|bat|yag|ags|o n|aki|tat|pah|la |gay|hin| si|di |i n|sas|iti|a t|t k|mal|ais|s n|t a|al |ipu|ika|lit|gin| ip|ano|gsa|alo|nin|uma|hal|ira|ap |ani|od |i a|gga|y p|par|tas|ig |sap|ihi|nah|ini| bu|ngi|syo|o s|nap|o p|a g| ha|uka|a h|aru|a o|mah|iba|asy|li |usa|g e|uha|ipa|mba|lam|kin|kil|duk|n o|iga| da|dai|aig|igd|gdi|pil|dig|pak| tu|d n|sam|nas|nak|ba |ad |lim|sin|buh|ri |lab|it |tag|g g|lun|ain|and|nda|pas|kab|aho|lig|nar|ula| ed|edu| ib|git|ma |mas|agb|ami|agg|gi |sar|i m|siy|g w|api|pul|iya|amb|nil|agl|sta|uli|ino|abu|aun|ayu| al|iyo",
    "hun": " sz| a |en | va|és | és|min|ek | mi| jo|jog|ind|an |nek|sze|ság| az|gy |sza|nde|ala|az |den|a v|val|ele| el|oga|mél|egy| eg|n a|ga |zab| me|zem|emé|aba|int|van|bad|tel|tet| te|ak |tás|ény|t a| ne|gye|ély|tt |n s|ben|ség|zet|lam|meg|nak|ni | se|ete|sen|agy|let|lyn|s a|yne|ra |z e|et | al|mel|kin|k j|eté|ok |tek| ki|vag|re |n m|oz |hoz|ez |s s|ett|gok|ogy| kö|mbe|es |em |nem|ely| le|ell|emb|hog|k a|atá|köz|nt | ho|yen|hez|el |z a|len|dsá|ásá|tés|ads|k m| ál| em|a s|nte|a m|szt|a t|áll|ás |y a|ogo|sem|a h|enk|nye|ese|nki|ágo|t s|lap|ame|ber|ló |k é|nyi|ban|mén|s e|i m|t m| vé|lla|ly |ébe|lat|ág |ami|on |mze|n v|emz|fel|a n|lő |a a|eki|eri|yes| cs|lle|tat|elő|nd |i é|ég |ésé|lis|yil|vet|át |kül|ért| ke|éte|rés|l a|het|szo|art|alá| ny|tar|koz| am|a j|ész|enl|elé|ól |s k|tár|s é|éle|s t|lem|sít|ges|ott| fe|n k|tko|zás|t é|kel|ja | ha|aló|zés|nlő|ése|ot |ri |lek|más|tő |vel|i j|se |ehe|tes|eve|ssá|tot|t k|olg|eze|i v|áza|leh|n e|ül |tte|os |ti |atk|zto|e a|tos|ány|ána|zte|fej|del|árs|k k|kor|ége|szá|t n| bi|zat|véd|nev|elm|éde|zer|téb|biz|rra|ife|izt|ere|at |ll |k e|ny |sel| né|ába|lt |ai |sül|ház|kif|t e| ar|leg|d a|is |i e|arr|t t|áso|it |ető|al | má|t v| bá|bár|a é|esü|lye|m l| es|nyo",
    "azj": " və|və |ər |lar| hə|in |ir | ol| hü| bi|hüq|üqu|quq|na |lər|də |hər| şə|bir|an |lik| tə|r b|mal|lma|ası|ini|r h|əxs|şəx|ən |arı|qla|a m|dir|aq |uqu|ali| ma|una|ilə|ın |yət| ya|ara|ikd|əri|ar |əsi|əti|r ş|rin|yyə|n h| az|dən|nin|ərə|tin|iyy|mək|zad| mü|sin| mə|ni |nda|ət |ndə|aza|rın|ün |ını|ə a|i v|nın|olu|qun| qa| et|ilm|lıq|ə y|ək |lmə|lə |kdi|ind|ına|olm|lun|mas|xs |sın|ə b| in|n m|q v|nə |əmi|n t|ya |da | bə|tmə|dlı|adl|bər| on|əya|ə h|sı |nun|maq|dan|inə|etm|un |ə v|rlə|n b|si |raq| va|ə m|n a|ınd|rı |anı| öz|əra|nma|n i|ama|a b|irl|ala|li |ins|bil|ik | al| di|ığı|ə d|lət|il |ələ|ə i|ıq |nı |nla|dil|müd|n v|ə e|unm|alı| sə|xsi|ə o|uq |uql|nsa|ətl| də|ili|üda|asi| he|ola|san|əni|məs| da|lan| bu|tər|həm|dır|kil|iş |u v| ki|min|eyn|mi |yin| ha|sos|heç|bu |eç | ed|kim|lığ|alq|xal| as|sia|osi|r v|q h|rə |yan|i s| əs|daf|afi| iş|ı h|fiə| ta|ə q|ıql|a q|yar|sas|lı |ill|mil|əsa|liy|tlə|siy|a h|məz|tün|ə t| is|ist|iyi| so|n ə|al |ifa|ina|lıd|ı o|ıdı|əmə|ır |ədə|ial| mi|əyi|miy|çün|n e|iya|edi| cə| bü|büt|ütü|xil|üçü|mən|adə|t v|a v|axi|dax|r a|onu| üç|seç| nə| se|man|ril|sil|əz |iə |öz |ılı|aya|qan|i t|şər|təm|ulm|rəf|məh| xa|ğın| dö| ni|sti|ild|amə|qu |nam|n o|n d|var|ad |zam|tam|təh",
    "ces": " pr| a |ní | ne|prá|ráv|ost| sv| po|na |ch |ho | na|nos|o n| ro|ání|ti |vo |neb|ávo|má |bo |ebo| má|kaž| ka|ou |ažd| za| je|dý |svo|ždý| př|a s| st|sti|á p| v |obo|vob| sp|bod| zá|ých|pro|rod|ván|ení|né |ý m|ého| by| ná|spo|ně |o p|mi |í a|ter|roz|ová|to | ja| li|áro|nár|by |jak|a p|a z|ny | vš|kte|i a|lid|ím |o v|í p|u p|mu |at | vy|odn| so| ma|a v| kt|í n|zák|li |oli|ví |kla|tní|pod|stá|en |do |t s|mí |je |em |áva| do|byl| se|být|í s|rov| k |čin| ve|ýt |í b|it |dní|vše|pol|o s| bý|tví|nýc|stn|nou|ejn|sou|ran|ci |vol|se |nes|a n|pří|eho|ným|tát|va |ním|mez|ají|i s|stv|ké |ích|ečn|žen|e s|vé |ova|své|ým |kol|du |u s|jeh|kon|ave|ech|eré|nu | ze|i v|o d|í v|hra|ids|m p|ému|ole|y s| i |maj|o z| to|aby|sta| ab|m a|pra| ta|chn| ni|že |ovn|ako|néh|len|dsk|rac|lad|chr| že|vat| os|sob|aké|i p|smí|esm|st |i n|m n|a m|lně|lní|při|bez|dy |áln|ens|zem|t v|čen|leč|kdo|ými| ji|oci|i k| s |í m|jí | či|áv |ste|och| oc|vou|ákl| vz|rav|odu|nez|inn|ský|nit|ivo|a j|u k|iál| me|ezi|ské|ven|stu|u a|tej|oln|slu|zen|í z|y b|oko|zac|níc|jin|ky |a o|řís|obe|u v|tak|věd|oje| vý|ikd|h n| od|čno|oso|ciá|h p| de|a t|ům |soc|jíc|odů|něn|adn|tup|dů |děl|jno|kéh|por|ože|hov|aci|nem|é v|rok|i j|u o|od |ího|vin|odi",
    "run": "ra |we |wa | mu|e a|se | n |a k|ira|ntu|tu | ku| um|ko |a i|mu |iri|mun|hir|ye |unt|ing|ash|ere|shi|a n|umu|zwa| bi|gu |ege|a a|za |teg|ama|e k|go |uba|aba|ngo|ora|o a|ish| ba| ar|ung|a m| we|e n|na |sho|ese|nga| ab|e m|mwe|ugu| kw|ndi| gu|ate|kwi|wes|riz|ger|u w| at|di |gih|iza|n u|ngi|ban|yo |ka |e b|a b| am| ca|ara|e i|obo|hob|ri |u b|can|nke|ro |bor| in|bah|ahi|ezw|a u|gir|ke |igi|iki|iwe|rez|ihu|hug|aku|ari|ang|a g|ank|ose|u n|o n|rwa|kan| ak|nta|and|ngu| vy|aka|n i|ran| nt| ub|kun|ata|i n|kur|ana|e u| ko|gin|nye|re | ka|any|ta |uko|amw|iye| zi|ga |ite| ib|aha| ng|era|o b|ako|o i| bu|o k|o u|o z| ig|o m|ho |mak|sha| as| iv|ivy|n a|i b|izw|o y| uk|ubu|aga|ba |kir|vyi|aho| is|nya|gan|uri| it| im|u m|kub|rik|hin|guk|ene|bat|nge|jwe|imi| y |vyo|imw|ani|kug|u a|ina|gek|ham|i i|e c|ze |ush|e y|uru|bur|amb|ibi|agi|uza|zi |eye|u g|gus|i a| nk|no |abi|ha |rah|ber|eme|ras|ura|kiz|ne |tun|ron| zu|ma |gen|wo |zub|w i|kor|zin|wub|ind| gi|y i|ugi|je |iro|mbe| mw|bak| ma|ryo|eka|mat| ic|onk|a z| bo|ika|eko|ihe|ukw|wir|bwa| ry| ha|bwo| ag|umw|yiw|tse| ya|he |eng| ki|nka|bir|ant|aro|gis|ury|twa| yo|bik|rek|ni | ah| bw|uro|mw |tan|i y|nde|ejw| no|zam|puz|ku |y a|a c|bih|ya |mur|utu|eny|uki|bos",
    "plt": "ny |na |ana| ny|y f|a n|sy |aha|ra |a a| fa|n n|y n|a m|an | fi|tra|any| ma|han|nan|ara|y a| am|ka |in |y m|ami|olo| ts|lon|min| mi| sy| na|a t| ol|fan| ha|a i|man|iza| iz|ina|ona|y h|aka|o a|ian|a h|reh|etr|a s|het|on |a f|ire|fah|tsy|mba| ar| hi|zan|ay |ndr|y o|ira|y t| an|ehe|o h|afa|y i|ren|ran| zo|ena|amb|dia|ala|amp|zo |ika| di|tan|y s|y z| az|ia |m p|rin|jo |n j| jo| dr|zy |ry |a d|ao |and|dre|haf|nen|mpi|rah| ka|eo |n d| ir|ho |am |rai|fa |elo|ene|oan|omb| ta| pi| ho|ava|azo|dra|itr|iny|ant|tsi|zon|asa|tsa| to|ari|ha |a k|van|n i|fia|ray| fo|mbe|ony|sa |isy|azy|o f|lal|ly |ova|lom| vo|nat|fir|sam|oto|zay|mis|ham|bel| ra|a r|ban|kan|iha|nin|a e|ary|ito| he| re| no|ita|voa|nam|fit|iar| ko|tok|isa|fot|no |otr|mah|aly|har|y v|y r| sa|o n|ain|kam|aza|n o|oka|ial|ila|ano|atr|oa | la|y l|eri|y d|ata|hev|sia|pia|its|reo| ao|pan|anj|aro|tov|nja|o s|fam|pir| as|ty |nto|oko|y k|sir|air|tin|hia|ais|mit|ba | it| eo|o t|mpa|kon|a z|a v|ity|ton|rak|era|ani|ive|mik|ati|tot|vy |hit|hoa|aho|ank|ame|ver|vah|tao|o m|ino|dy |dri|oni|ori| mo|hah|nao|koa|ato|end|n t| za|eha|nga|jak|bar|lah|mia|lna|aln|va | mb|lan| pa|aov|ama|eve|za |dro|ria|to |nar|izy|ifa|adi|via|aja| va|ind|n k|idi|fiv|rov|vel",
    "qug": "una|ta | ka|na |ka |ash|cha|a k|ari|ish|kun|kta|ana|pak|hka|shk|apa|mi |ach|hay|akt|shp|man|ak | ch| ha|rin|ata|tak|lla|ita|ami|ama|aku|har| pa|pas|ayñ|yñi|ina| ma| ru|uku|sh |hpa|run|all|kuy|aka|an | tu|tuk|yta|chi|chu|a c|ñit|in |nak|a h|nka|ris|tap|kan| ki|ayt|pi | sh|pa |i k|a p|nap|kam|kaw|pay|nam|ayp|aws|iri|wsa|a s|ank|nta|uy |a t|hin|a m|ay | li|ant|lia|kay|nat|a r|shi|iak|lak|uya| wa|yuy|say|kis|y r|ypa|hun|a a| yu|n t|tam| ti|yay|n k| ya|a w|hpi|lli| al|api|yku|un |ipa|a i|iku|ayk|shu| sa|ush|pir|ich|kat|hu |huk| il|ill|kas|a y|rik|yac|a l| ku|kac|hik|tan|wan|ypi|ink|ika| ni|ila|ima|i c|yll|ayl| wi|mac|nis| ta|i y|kus|tin|n s|i p|yan|llu|la |iks|tik|kpi| pi|awa|may|lan|li | ri|kll|yas|kin|kak|aya|ksi|k h|aym|war|ura| ay|lat|ukt|i t|iya|ull|mas|sha|kir|uch|h k|nch|akp|uma|pip|han|kik|iki|riy|aki| ii|i s|n p|h m|kar|nal|y h|tac| su|nac|mak|n m|nki|k a|mam|iwa|k t|k k|i m|yma| ña|wil|asi|nmi|kap|pal|sam|pam|k i|k l|i i|pan|sum|i w| hu|his| mu|iia|mun|k m|u t|pik|was|ik |ma |hat|k r|akl|huc| im|mal|uyk|imi|n y|anc|y k|a n|iñi| iñ|wak|unk|yka| mi|iña|a u|has|ywa| ak|llp|ian|ha |tar|rmi|i a|arm|las|ati|pur|sak|ayw|hap|yar|uti|si |iyt|uri|kim| ar|san|h p|akk|iy |wat|wpa|y i|u k",
    "mad": "an |eng|ban|ng | sa| ka|dha| ba|ren|ak |ang| se| ha|hak| dh|na | pa|se |adh|a s|aba|n s|ara|ngg|are|ha |aga|sa | or|ore|asa|sar|ana| ma|aan|a k|ale|gi | ag|gad|a b|n o|n k|eba|ala|ra |gan| ke|dhu|ota|aja|bas|n b|ka |man|tab|dhi|beb|sab|ama|ako|abb|at |ggu|nga| ta|pan|wi |huw|uwi|eka|ata|a d|san| ot|agi|lak|hal|ba |bba|i h|ong|em |kab|g a|lem|a o| pe| na|ane|par|ngs|nge|gar|a a|tan|gsa|a p|ran|i s|k h|n p|uy |guy|ken|n a|al |ada| ga|apa|pon|e d| e |nek| an|g s|ta |kaa|on |kal|a m|ssa|ona|abe|kat| la|a e|e e|sal|ate|jan|ri |nan|lab|asi|sad|i p|e a|lan|aka|a h|ari| bi|ena|si |daj| ng|ton|e k|har|oss|gen|i k|g k|car|ase|ano|era|kon| be|nya|n d|nag|bad|ar |epo| da|mas| kl| al|n t|mat|nos|n n|ela|g e|a n|k k|uwa|adi|pad|ggi|uan|i d|ne | so|hi |sae|oan|wan|as |le |gap|ter|yat|om |kla|k a|e b|ina|ah |k s|koa|i a|ega|neg|n h|m p|aha| as| ja|abi|ma |kas|bi | mo|aon| di|one| ep|per|aya|e s|nto|te |bat|epa|nda|n e| ca|int|pam|di |ann| ra|aen|k d|amp|a t|nta|and|e p|rga|pen|yar|mpo|ste|dra|ok |oko|ila|g p|k b|i b|set|to |isa|nao|nna|n m|ett| a |bis|hid|bin|i m|nas| ho|kar|t s| po|dil| to|aju|ika|kom|arg|ant|raj|a l|das|tto|ost|mos|lae|ga |rek|idh|tad|hig|en |rny|arn|ndh|eta|adu| dr|jat|jua|gam",
    "nya": "ndi|ali|a k|a m| ku| nd|wa |na |nth| mu| al|yen|thu|se |ra |nse|hu |di |a n|la | pa|mun| wa|nga|unt| la|a u|u a|e a|ons|za | ma| lo|iye|ace|ce |a l|idw|ang| ka|kha|liy|ens|li |ala|ira|ene|pa |i n|we |e m|ana|dwa|era|hal|ulu|lo |ko |dzi| ci|yo |o w|iko|ga |a p|chi| mo|lu |o l|o m|oyo|ufu| um|moy|zik| an|ner|and|umo|ena| uf|dan|iri|ful|a a|ka |to |hit|nch| nc|a c|ito|fun|dwe| da|kuk|wac| dz|e l|a z|ape|kap|u w|e k|ere|ti |lir| za|pen|tha|aye|kut|mu |ro |ofu|ing|lid| zo|amu|o c|i m|mal|kwa|mwa|o a|eza|i p|o n|so |i d|lin|nso| mw|iro|zo | a |ati| li|i l|a d|ri |edw|kul|una|uti|lan|a b|iki|i c|alo|i k| ca|lam|o k|dza|ung|o z|mul|ulo|uni|gan|ant|nzi| na|nkh|e n|san|oli|wir|tsa|u k|ome|ca |gwi|unz|lon|dip|ipo|yan|gwe|pon|akh|uli|aku|mer|ngw|cit| po| ko|kir|mba|ukh|tsi|bun|iya|ope|kup|bvo|han| bu|pan|ame|vom|ama| ya|siy| am|rez|u n|zid|men|osa|ao |pez|i a| kw| on|u o|lac|ezo|aka|nda|hun|u d|ank|diz|ina|its|adz| kh|ne |nik|e p|o o|ku |phu|eka| un|eze|mol|ma | ad|pat|oma|ets|wez|kwe|kho|ya |izo|sa |o p|kus|oci|khu|okh|ans|awi|izi|zi |ndu|iza|no |say| si|i u|aik|jir|ats|ogw|du |mak|ukw|nji|mai|ja |sam|ika|aph|sid|isa|amb|ula|osi|haw|u m| zi|oye|lok|win|lal|ani| ba|si | yo|e o|opa|ha |map|emb",
    "zyb": "bou|aeu|enz|nz |eng|iz |ih |uz |uq |oux|ing| bo| di| ca|z g|dih|ux |ngh|cae|gen|euq|z c|you|ng |ung|ngz|ij | gi| mi|miz|aen| ge|z d| ci|gya| yi| de|ouj|uj | gu|cin|ngj|ien|mbo|dae| mb|zli| se|gij|j g|ang|ouz|z y|j d|nae| cu| ba| da|h g|oz |yin|de |z b|nzl|li |nj |euz|x m| cw|iq | yo|gz |q g|yau|inh|vun|x b|h c| ga|ix |cwy|wyo| ro|rox|oxn|vei|nda|i c| nd|z m|gh |j b|wz | si| gy|hoz|unz|xna|cun|gue| li|ei |z h|yen|bau|can|inz|q c|dan| hi|gj |uh |yie| vu|faz|hin| bi|uek|goz|zci|nh |aej|ya |ej | fa|gun|ciz|au | go| ae|h m|ngq|den|gva|ouq|nq |z s|q d|ekg|q s| do|h d|kgy|eix| wn|ci |az |hu |nhy| ha|j c|u d|j n|z l|auj|gai|gjs|lij|eve|h s|sen|sin|sev|ou |sou|aiq|q y|h y|jso|bin|nei| la|en |ouh|din|uen|enj|enh|i b|z r|awz|q n|vih|j y|anj|bwn|sei|z n| ne|ozc|hye|j s|i d|awj|liz|g g|bae|wng|g b|eiq|bie|enq|zda| ya|n d|h f|x d|gak|hix|z v|h b|oen|anh|u c|in |i g|ghc|zsi|hci|siz|anz|ghg|ez |dun|cou| du|ngg|ngd|j m|cuz| ho|law|eiz|g c| dw|aw |g d|izy|hgy|ak |nde|min|dei|gda|ujc|wn |env|auy|iuz|ai |wnj|a d|hen|ozg|nzg|ek |g y|gzd|gzs|yaw|e c|yuz|daw|giz|jhu|ujh| co|nvi|guh|coz| ve| he|i m|sae|aih|x l|iet|iuj|dwg|iqg|qgy|gih|yai| na| fu|uyu|zbi|zdi|q b|cie|inj|zge|wnh|jsi|uzl| bu| le|eij|izc|aq ",
    "kin": "ra | ku| mu|se |a k|ntu|nga|tu |umu|ye |li | um|mun|unt|a n|ira| n |ere|wa |we | gu|mu |ko |a b|e n|o k|e a|a u|a a|u b|e k|ose|uli|aba|ro | ab|gom|e b|ba |ugu| ag|omb|ang| ib|eng|mba|o a|gu | ub|ama| by| bu|za |ihu|ga |e u|o b| ba|kwi|hug|ash|ren|yo |ndi|e i| ka| ak| cy|iye| bi|ora|re |gih|igi|ban|ubu| nt| kw|di |gan|a g|a m|aka|nta|aga| am|a i|ku |iro|i m|ta |ka |ago|byo|ali|and|ibi|na |uba|ili| bw|sha|cya|u m|yan|o n| ig|ese|no |obo|ana|ish|kan|sho| we|era|ya |aci|wes|ura|i a|uko|e m|n a|o i|kub|uru|hob|ber|ran|bor| im|ure|u w|wo |cir|gac|ani|bur|u a|o m|ush| no|e y| y |rwa|eke|nge|ara|wiy|uga|zo |ne |ho |bwa|yos|anz|aha|ind|mwe|teg|ege|are|ze |n i|rag|ane|u n|ge |mo |u k|bul| uk|bwo|bye|iza|age|ngo|u g|gir|ger|zir|kug|ite|bah| al| ki|uha|go |mul|ugo|n u|tan|guh|y i| ry|gar|bih|iki|atu|ha |mbe|bat|o g|akw|iby|imi|kim|ate|abo|e c|aho|o u|eye|tur|kir| ni|je |bo |ata|u u| ng|shy|a s|gek| ru|iko| bo|bos|i i| gi|nir|i n|gus|eza|nzi|i b|kur| ya|o r|ung|rez|ugi|ngi|nya| se|mat|eko|o y| in|uki| as|any|bis|ako|gaz|imw|rer|bak|ige|mug|ing|byi|kor|eme|nu | at|bit| ik|hin|ire|kar|shi|yem|yam| yi|gen|tse|ets|ihe|hak|ubi|key|rek|icy| na|bag|yer| ic|eze|awe|but|irw| ur|fit|ruk|ubw|rya|uka|afi",
    "zul": "nge|oku|lo | ng|a n|ung|nga|le |lun| no|elo|wa |la |e n|ele|ntu|gel|tu |we |ngo| um|e u|thi|uth|ke |hi |lek|ni |ezi| ku|ma |nom|o n|pha|gok|nke|onk|a u|nel|ulu|oma|o e|o l|kwe|unt|ang|lul|kul| uk|a k|eni|uku|hla| ne| wo|mun| lo|kel|ama|ath|umu|ho |ela|lwa|won|zwe|ban|elw|ule|a i| un|ana|une|lok|ing|elu|wen|aka|tho|aba| kw|gan|ko |ala|enz|o y|khe|akh|thu|u u|na |enk|kho|a e|zin|gen|i n|kun|alu|mal|lel|e k|nku|e a|eko| na|kat|lan|he |hak| ez|o a|kwa|o o|ayo|okw|kut|kub|lwe| em|yo |nzi|ane|obu| ok|eth|het|ise|so |ile|nok| ba|ben|eki|nye|ike|i k|isi| is|aph|esi|nhl|mph| ab|fan|e i|isa| ye|nen|ini|ga |zi |fut| fu|uba|ukh|ka |ant|uhl|hol|ba |and|do |kuk|abe|za |nda| ya|e w|kil|the| im|eke|a a|olo|sa |olu|ith|kuh|o u|ye |nis| in|ekh|e e| ak|i w|any|khu|eng|eli|yok|ne |no |ume|ndl|iph|amb|emp| ko|i i| le|isw|zo |a o|emi|uny|mel|eka|mth|uph|ndo|vik| yo|hlo|alo|kuf|yen|enh|o w|nay|lin|hul|ezw|ind|eze|ebe|kan|kuz|phe|kug|nez|ake|nya|wez|wam|seb|ufa|bo |din|ahl|azw|fun|yez|und|a l|li |bus|ale|ula|kuq|ola|izi|ink|i e|da |nan|ase|phi|ano|nem|hel|a y|hut|kis|kup|swa|han|ili|mbi|kuv|o k|kek|omp|pho|kol|i u|oko|izw|lon|e l| el|uke|kus|kom|ulo|zis|hun|nje|lak|u n|huk|sek|ham| ol|ani|o i|ubu|mba| am",
    "swe": " oc|och|ch |er |ing|för|tt |ar |en |ätt|nde| fö|rät|ill|et |and| rä| en| ti| de|til|het|ll |de |om |var|lig|gen| fr|ell|ska|nin|ng |ter| ha|as | in|ka |att|lle|der|sam| i |und|lla|ghe|fri|all|ens|ete|na |ler| at|ör |den| el|av | av| so|igh|r h|nva|ga |r r|env|la |tig|nsk|iga|har|t a|som|tti| ut|ion|t t|a s|nge|ns |a f|r s|män|a o| sk| si|rna|isk|an | st|är |ra | vi| al|t f| sa|a r|ati| är| me| be|n s| an|tio|nna|lan|ern|t e|med| va|ig |äns| åt|sta|ta |nat| un|kli|ten| gr|vis|äll| la|one|han|änd|t s|stä|t i|ner|ans|gru| ge|ver| må| li|lik|ihe|ers|rih|r a| re|må |sni|n f|t o| mä| na|r e|ri |ad |ent|kla|det| vä|run|rkl|da |h r|upp|dra|rin|igt|dig|n e|erk|kap|tta|ed |d f|ran|e s|tan|uta|nom|lar|gt |s f| på| om|kte|lin|r u|vid|g o|änn|erv|ika|ari|a i|lag|rvi|id |r o|s s|vil|r m|örk|ot |ndl|str|els|ro |a m|mot| mo|i o|på |r d|on |del|isn|sky|e m|ras| hä|r f|i s|a n|nad|n o|gan|tni|era|ärd|a d|täl|ber|nga|r i|enn|nd |n a| up|sin|dd |örs|je |itt|kal|n m|amt|n i|kil|lse|ski|nas|end|s e| så|inn|tat|per|t v|arj|e f|l a|rel|t b|int|tet|g a|öra|l v|kyd|ydd|rje| fa|bet|se |t l|lit|sa |när|häl|l s|ndr|nis|yck|h a|llm|lke|h f|arb|lmä|nda|bar|ckl|v s|rän|gar|tra|re |ege|r g|ara|ess|d e|vär|mt |ap ",
    "lin": "na | na| ya|ya |a m| mo|a b|to | ko| bo|li |o n| li|i n| pe|i y|a y|a n|ngo|ki | ba| ma|kok|pe |la |a l|zal|oki|ali|nso|oto|ala|ons|so |mot|a k|nyo|eng|kol|go |nge| ny|yon|o e|ang|eko|te |o y|oko|olo|ma |iko|a e|e m|e b|lik|ko |o a|ako|ong| ye|mak|ye |isa| ek|si |lo |aza|sal|ama| te|bat|o p|oyo|e n| az|a p|ani|sen|o m|ela|ta |amb|i k|ban|ni | es|yo |mi |mba|osa| oy|aka|lis|i p|eli|a t|mok|i m|ba |mbo| to| mi|isi|bok|lon|ato|ing|o b| nd|ota|bot| ez|ge |nga|eza|o t|nde|ka |bo |gel|kan|e k|lam|sa |ese|koz| po|den|ga |oba|omb|oli|yan|kop|bon|mos|e e|kob|oka|kos|bik|lin|po |e a| lo| bi|kot|’te|ngi|sam| ’t|omi|e y|ti |i b| el|elo|som|lok|esa|gom|ate|kam|i t|ika|a s|ata|kat|ati|wa |ope|oza|iki|i e| ka|bom|tal|o l|bek|zwa|oke|pes| se|bos|o o|ola|bak|lak|mis|omo|oso|nza| at|nda|bal|ndi|mu |mob|osu|e t|asi|bis|ase|i l|ele|sus|usu|su |ozw|and|mol|tel|lib|mbi|ami| nz|ne |ene|kel|aye|emb|yeb|nis|gi |obo|le |kum|mal|wan|a ’|pon| ep|baz|tan|sem|nya|e l| ta|gis|opo|ana|ina|tin|obe| ti|san| ak|mab|bol|oku|u y|mat|oti|bas|ote|mib|ebi|a o|da |bi | mb|lel|tey|ibe|eta|boy|umb|e p|eni|za |be |mbe|bwa|ike|se | et|ibo|eba|ale|yok|kom| en|i a|mik|ben|i o| so|gob|bu |son|sol|sik|ime|eso|abo| as|kon|eya|mel",
    "som": " ka|ay |ka |an |uu |oo |da |yo |aha| iy|ada|aan|iyo|a i| wa| in|sha| ah| u |a a| qo|ama| la|hay|ga |ma |aad| dh| xa|ah |qof|in | da|a d|aa |iya|a s|a w| si| oo|isa|yah|eey|xaq|ku | le|lee| ku|u l|la |taa| ma|q u|dha|y i|ta |aq |eya|sta|ast|a k|of |ha |u x|kas|wux| wu|doo|sa |ara|wax|uxu| am|xuu|inu|nuu|a x|iis|ala|a q|ro |maa|o a| qa|nay|o i| sh| aa|kal|loo| lo|le |a u| xo| xu|o x|f k| ba|ana|o d| uu|iga|a l|yad|dii|yaa|si |a m|gu |ale|u d|ash|ima|adk|do |aas| ca|o m|lag|san|dka|xor|adi|add| so|o k| is|lo | mi|aqa|na | fa|soo|baa| he|kar|mid|dad|rka|had|iin|a o|aro|ado|aar|u k|qaa| ha|ad |nta|o h|har|axa|quu| sa|n k| ay|mad|u s| ga|eed|aga|dda|hii|aal|haa|n l|daa|xuq|o q|o s|uqu|uuq|aya|i k|hel|id |n i| ee|nka| ho|ina|waa|dan|nim|elo|agu|ihi|naa|mar|ark|saa|riy|rri|qda|uqd| bu|ax |a h|o w|ya |ays|gga|ee |ank| no|n s|oon|u h|n a|ab |haq|iri|o l| gu|uur|lka|laa|u a|ida|int|lad|aam|ood|ofk|dhi|dah|orr|eli| xi|ysa|arc|rci|to |yih|ool|kii|h q|a f| ug|ayn|asa| ge|sho|n x|siy|ido|a g|gel|ami|hoo|i a|jee|n q|agg|al | di| ta|e u|o u| ji|goo|a c|sag|alk|aba|sig| mu|caa|aqo|u q|ooc|oob|bar|ii |ra |a b|ago|xir|aaq| ci|dal|oba|mo |iir|hor|fal|qan| du|dar|ari|uma|d k|ban|y d|qar|ugu| ya|xay|a j",
    "hms": "ang|gd |ngd|ib | na|nan|ex |id | ji|ad |eb |nl |b n|d n| li|ud |jid| le|leb| ga|ot |anl|aot|d g|l l|b l| me|ob |x n|gs |ngs|mex|nd |d d| ne|jan|ul | ni|nja| nj| gu| zh|lib|l n|ong| gh|gao|b j|b g|nb |l g|end|gan| ad| je|jex|ngb|gb |han|el | sh| da|ub |d j|d l|t n| nh|nha|b m|is |d z|x g| ya|oul|l j| wu|she|il |nex| ch|b y|d s|gue|gho|uel|wud|d y| gi|d b|hob|nis|s g| zi| yo|lie|es |nx |it |aob|gia|ies| de|eib|you| ba| hu|ian|zib|d m|s j|oud|b d|chu|ol |ut | do|t j|nen|hud|at |s n|hen|iad|ab |enl| go|dao| mi|t g|zha|b z|enb|x j| ze|eit|hei|d c|nt |b s| se|al | xi|inl|hao| re| fa|d h|gua|yad|ren| ho|anb|gx |ngx|ix |nib|x z|and|b h|b w|fal| xa|d x|t l|x m|don|gou|bao|ant|s z|had|d p|yan|anx|l d|zhe|hib| pu|ox | du|hui|sen|uib|uan|lil|dan|s m| di| we|gha|xin|b x|od |zhi|pud| ju| ng|oub|xan| ge|t z|hub|t h|hol|t m|jil|hea|x l| ma|eud|jul|enx|l z|l s|b a| lo| he|nga|d r|zen| yi|did|hon|zho|gt |heb|ngt|os |d a|s l|aos| si|dei|dud|b b|geu|wei|d w|x c|x b|d k|dou|l h|lou| bi|x a|x d|b c| sa|s a| bo|eut|blo| bl|nia|lol|t w|bad|aod| qi|ax |deb| ja|eab| nd|x s|can|pao| pa|gl |ngl|che|sat|s y|l m|t s|b f|heu|s w| to|lia| ca|aox|unb|ghu|ux | cu|d f|inb|iel| pi|jib|t p|x x|zei|eul|l t|l y|min|dad",
    "hnj": "it | zh| ni|ab |at | sh|ang|nit|os | do|uat|ox |ax |nx |ol |ob | nd|t d|x n|nf |zhi|as | ta|tab|ef |if |d n|ad | mu| cu|uax|cua|mua|b n|uf |ib |s d|dos|id |enx|nb |hit| lo|f n|t l|ngd|gd |us |inf|ux |ed | go|she|b d|b z|t n| ho|x z| yi|aob|l n|ong|t z| zi|ix |nda|d z|ut |yao|uab|enb| de|dol|f g| dr|zhe| yo| le|euf|x d|inx|nen|das| ne|dro|gb |ngb|d s| ge|hox|f z|uef|s n|len|b g| ua|ud |nd |gox| na|il | du|x j|oux|f y|f h|ndo|x c|han|of |zha|uad|s z| da| ny| ja| gu|heu| ji|ik | bu|shi|lob|od | ya|gf |t g|hai|ged|ngf|b h|you| hu|ex |bua|out|nil|hen|rou|yin|zhu|ous|nya|enf|f d|is | re|b c|lol|nad|dou|af | xa| id|t s| ha|uk |jai|xan|sha|b y|hua|aib|s s|d d| la| qi|ren|x l|hue|l m|x g|ot | xi| ba| zo| kh| dl|jua| ju|aod|zif|ait|bao| di| ga|x y| nz|b s|x s|xin| li|aof|b b|ngx|gx |eb |b l|x t|x m|hed| be|dax|b t|s t|hef|las|d j|gua| pi|t y|f b|d l|l d|nzh| ib|hif|t h|dus|t r|hou|f l|hun|und|s l|el |aik|d y|aos|f t| mo| bi|hab|ngt|gai| za|uas|x h|gt | zu|ros|aid|zos| gh|end|pin|k n|k z| ao|iao|s b|dex|x b|due|ak |d g| fu|s x|deu|s y|mol|x i|f s|hik| hl| bo|l b|eut|lb |uaf|zho|d b| lb|s m|lan|al |b k|t b| ch|d p|x x|f x|ub |t c|d m| ro| nt|d h|et |uak|aox|gon|tua|yua|t t|zis|deb|d t| we|shu",
    "ilo": "ti |iti|an |nga|ga | ng| pa| it|en | ka| ke| ma|ana| a | ti|pan|ken|agi|ang|a n|a k|aya|gan|n a|int|lin|ali|n t|a m|dag|git|a a|i p|teg|a p| na|nte|man|awa|kal|da |ng |ega|ada|way|nag|n i| da|na |i k|sa |n k|ysa|n n|no |a i|al |add|aba| me|i a|eys|nna|dda|ngg|mey| sa|pag|ann|ya |gal| ba|mai| tu|gga|kad|i s|yan|ung|nak|tun|wen|aan|nan|aka| ad|enn| ag|asa| we|yaw|i n|wan|nno|ata| ta|l m|i t|ami|a t| si|ong|apa|kas|li |i m|ina| an|aki|ay |n d|ala|gpa|a s|g k|ara|et |n p|at |ili|eng|mak|ika|ama|dad|nai|g i|ipa|in | aw|toy|oy |ao |yon|ag |on |aen|ta |ani|ily|bab|tao|ket|lya|sin|aik| ki|bal|oma|agp|ngi|a d|y n|iwa|o k|kin|naa|uma|daa|o t|gil|bae|i i|g a|mil| am| um|aga|kab|pad|ram|ags|syo|ar |ida|yto|i b|gim|sab|ino|n w| wa| de|a b|nia|dey|n m|o n|min|nom|asi|tan|aar|eg |agt|san|pap|eyt|iam|i e|saa|sal|pam|bag|nat|ak |sap|ed |gsa|lak|t n|ari|i u| gi|o p|nay|kan|t k|sia|aw |g n|day|i l|kit|uka|lan|i d|aib|pak|imo|y a|ias|mon|ma | li|den|i g|to |dum|sta|apu|o i|ubo|ged|lub|agb|pul|bia|i w|ita|asy|mid|umi|abi|akd|kar|kap|kai| ar|gin|kni| id|ban|bas|ad |bon|agk|nib|o m|ibi|ing|ran|kda|din|abs|iba|akn|nnu|t i|isu|o a|aip|as |inn|sar| la|maa|nto|amm|idi|g t|ulo|lal|bsa|waw|kip|w k|ura|d n|y i"
  },
  "Cyrillic": {
    "rus": " пр| и |рав|ств| на|пра|го |ени|ове|во | ка|ани|ть | в | по| об|ия |сво| св|лов|на | че|ело|о н| со|ост|чел|ие |ого|ет |ния|ест|аво|ый |ажд| им|ние|век| не|льн|ли |ова|име|ать|при|т п|и п|каж|или|обо| ра|ых |жды| до|дый|воб|ек |бод|ва |й ч|его|ся |и с|ии |аци|еет|но |мее|и и|лен|ой |тва|ных|то | ил|к и|енн| бы|ию | за|ми |тво|и н|о п|ван|о с|сто|аль| вс|ом |о в|ьно|их |ног|и в|нов|ако|про|ий |сти|и о|пол|олж|дол|ое |бра|я в| ос|ным|жен|раз|ти |нос|я и| во|тор|все| ег|ей |тел|не |и р|ред|ель|тве|оди| ко|общ|о и| де|има|а и|чес|ним|сно|как| ли|щес|вле|ься|нны|аст|тьс|нно|осу|е д| от|пре|шен|а с|бще|осн|одн|быт|сов|ыть|лжн|ран|нию|иче|ак |ым |ват|что|сту|чен|е в| ст|рес|оль| ни|ном|род|ля |нар|вен|ду |оже|ны |е и| то|вер|а о|зов|м и|нац|ден|рин|туп|ежд|стр| чт|я п|она|дос|х и|й и|тоя|есп|лич|бес|обр|ото|о б|ьны|ь в|нии|е м|ую | мо|ем | ме|аро| ре|ава|кот|ав | вы|ам |жно|ста|ая |под|и к|ное| к | та| го|гос|суд|еоб|я н|ен |и д|мож|еск|ели|авн|ве |ече|уще|печ|дно|о д|ход|ка | дл|для|ово|ате|льс|ю и|в к|нен|ции|ной|уда|вов| бе|оро|нст|ами|циа|кон|сем|е о|вно| эт|азо|х п|ни |жде|м п|ког|от |дст|вны|сть|ые |о о|пос|сре|тра|ейс|так|и б|дов|му |я к|нал|дру| др|кой|тер|ь п|арс|изн|соц|еди|олн",
    "ukr": "на | пр| і |пра|рав| на|ня |ння| за|ого| по|ти |го |люд| лю|во | ко| ма|льн|юди|их |о н| не|аво|анн|дин| св|сво|ожн|кож|енн|пов|жна| до|ати|ина|ає |а л| бу|аці|не |ува|обо| ос| як|має| ви|них|аль|або|є п| та|ні |ть |ови|бо | ві| аб|ере|і п|а м|вин|без|при|іль|ног|о п|ми |та |ом |ою |бод|ста|воб| бе|до |ва |ті | об|о в|ост| в | що|ий |ся |і с| сп|инн|від|ств|и п|ван|нов|нан|кон| у |ват|она|ії |но |дно|ій |езп|пер| де|ути|ьно|ист|під|сті|бут| мо|и і|ідн|ако|нні|ід |тис|що |род|і в|а з|ава| пе|му |і н|а п|соб|ої |а в|спр|ів |ний|яко|ду |вно|і д|ну |аро|и с| ін|ля |рів|у в| рі|и д|нар|нен|ова|ому|лен|нац|ним|ися|чи |ав |і р|ном| ро|нос|ві |вни|овн| її|ові|мож|віл|у п| пі| су|її |одн| вс|ово|ють|іст|сть|і з| ст|буд| ра|чен|про|роз|івн|оду|а о|ьни|ни |о с|сно|зна|рац|им |о д|ими|я і|ції|х п|дер|чин| со|а с|ерж|и з|и в|е п|ди |заб|осо|у с|е б|сі |тер|ніх|я н|і б|кла|спі|в і| ні|о з|ржа|сту|їх |а н|нна|так|я п|зпе| од|абе|для|ту |і м|печ| дл|же |ки |віт|ніс|гал|ага|е м|ами|зах|рим|ї о|тан|ког|рес|удь| ре|то |ков|тор|ара|сві|тва|а б|оже|соц|оці|ціа|осн|роб|дь‐|ь‐я|‐як|і і|заг|ахи|хис|піл|цій|х в|лив|осв|іал|руч|ь п|інш|в я|ги |аги| ді|ком|ини|а і|оди|нал|тво|кої|всі|я в|ною|об |о у|о о|і о",
    "bos": " пр| и |рав| на|пра|на |да |ма |има| св|а с|а п| да|а и| по|је |во |ко |ва | у |ако|но |о и|е с| за| им|аво|ти |ава|сва|и п|ли |о н|или|и с|их |вак| ко|ост|а у| сл|не |вањ| др|ње | не|кој|ња | би|ије|и д|им |ств|у с|јед|бод|сло|лоб|обо| ил|при| је|ање| ра|а д| об| су|е и|вје|се |ом |и и|сти| се|ју |дру|а б| ос|циј|вој|е п|а н|раз|су |у п|ања|о д|ује|а о|у и| од|и у|ло |ова|дје|жав|оје|а к|ни |ово|едн|ити|аци|у о|о п|нос|и о|бра| ка|шти|а ј|них|е о|пре|про|ржа| бу|буд|тре| тр|ог |држ|бит|е д|у з|ја |ста|авн|ија|е б|миј|и н|реб|сво|ђи |а з|ве |бил|ред|род|аро|ило|ива|ту |пос| ње| из|е у|ају|ба |ка |ем |ени|де |јер|у д|одн|њег|ду |гов|вим|јел|тва|за | до|еђу|ним| са|нар|а т| ни|о к|оји|м и| см| ст|еба|ода|ран|у н|дна|ичн|уђи|ист|вно|алн|и м| дј|нак|нац|сно|нст|тив|ани|ено|е к|е н|аве|ан |чно|и б|ном|сту|нов|ови|чов|нап|ног|м с|ој |ну |а р|еди|овј|оја|сми|осн|анс|ара|дно|х п|под|сам|обр|о о|руг|тво|ји | мо|его|тит|ашт|заш| кр|тељ|ико|уна|ник|рад|оду|туп|жив| ми|јек|кри| ов| вј| чо|ву |г п| оп|међ|њу |рив|нич|ина|одр|е т|уду| те|мје|ење|сви|а ч|у у|ниц|дни| та|и т|тно|ите|и в|дст|акв|те |ао | вр|ра |вољ|рим|ак |иту|ави|кла|вни|амо| он|ада|ере|ена|сто|кон|ст |она|иво|оби|оба|едс|как|љу ",
    "srp": " пр| и |рав|пра| на|на | по|ма | св|да |има|а п|а и|во |ко |ва |ти |и п| у |ако| да|а с|аво|и с|ост| за|о и|сва| им|вак|ава|је |е с| сл| ко|о н|ња |но |не | не|ом |ли | др|или|у с|сло|обо|кој|их |лоб|бод|им |а н|ју | ил|ств| би|сти|а о|при|а у| ра|јед|ог | је|е п|ње |ни |у п|а д|едн|ити|а к|нос|и у|о д|про| су|ање|ова|е и|вањ|и и|циј| ос|се |дру|ста|ају|ања|и о| об|род|ове| ка| де|е о|аци|ја |ово| ни| од|и д| се|ве |ује|ени|ија|авн|жав| ст|у и|м и|дна|су |ред|и н|оја|е б|ара|што|нов|ржа|вој|држ|тва|оди|у о|а б|одн|пош|ошт|ним|а ј|ка |ран|у у| ов|аро|е д|сно|ења|у з|раз| из|осн|а з|о п|аве|пре|де |бит|них|шти|ву |у д|ду |ту | тр|нар| са|гов|за |без|оји|у н|вно|ичн|еђу|ло |ан |чно|ји |нак|ода| ме|вим|то |сво|ани|нац| ње|ник|њег|тит|ој |ме |ном|м с|е у|о к|ку | до|ика|ико|е к|пос|ашт|тре|алн|ног| вр|реб|нст| кр|сту|дно|ем |вар|е н|рив|туп|жив|те |чов|ст |ови|дни|ао |сме|бра|ави| ли|као|вољ|ило|о с|штв|и м|заш|њу |руг|тав|анс|ено|пор|кри|и б|оду|а р|ла | чо|а т|руш|ушт| бу|буд|ављ|уги|м п|ком|оје|вер| ве|под|и в|међ|его|вре|акв|еди|тво| см|од |дел|ена|рад|ба | мо|ну |о ј|дст|кла| оп|как|сам|ере|рим|вич|ива|о о| он|вни|тер|збе|х п|ниц|еба|е р|у в|ист|век|рем|сви|бил|ште|езб|јућ|њен|гла",
    "uzn": "лар|ан |га |ар | ва| би|да |ва |ир | ҳу|ига|уқу|бир|ҳуқ|қуқ|ган| ҳа|ини|нг |р б|иш | та|ни |инг|лик|а э|ида|или|лиш|нин|ари|иши| ин|ади|он |инс|нсо|сон|ий |лан|дир| ма|кин|и б|ши |ҳар| бў|бўл| му|дан|уқи|ила|қла|р и|қиг|эга| эг| ўз|ки |эрк|қил|а б|оли|кла| эр|гад|лга|нли| ол|рки|и ҳ| ёк|ёки| қа|иб |иги|лиг|н б|н м| қи| ба|ара|атл|ри | бо|лат|бил|ин |ҳам|а т|лаш|р ҳ|ала| эт|инл|ик |бош|ниш|ш ҳ|мас|и в|эти|тил|тла|а ҳ|и м|а қ|уқл|қар|ани|арн|рни|им |ат |оси|ўли|ги | да|а и|н ҳ|риш|и т|мла|ли | ха|а м|ият| бу|рла|а а|рча|бар|аси|ўз |арч|ати|лин|ча |либ|мум| ас|аро|а о|ун |таъ| бе| ту|икл|р в|тга|тиб| ке|н э|ш в|мда|амд|али|н қ|мат|шга| те|сид|лла|иро| шу| қо|дам|а ш|ирл|илл|хал|рга| де|ири|тиш|умк|ола|амл|мки|тен|гин|ур |а ў|рак|а ё|имо| эъ|алқ| са|енг|тар|рда|ода| ша|шқа|ўлг|кат|сий|ак |н о|зар|и қ|ор | ми|нда|н в| си|аза|ера|а к|тни|р т|мил| ки|к б|ана|ам |ошқ|рин|сос|ас | со|сиз|асо|нид|асл|н ў|н т|илг|бу |й т|ти |син|дав|шла|на |лим|қон|и а|лак|эма|муҳ|ъти|си |бор|аш |и э|ака|нга|а в|дек|уни|екл|ино|ами| жа|риг|а д| эм|вла|лма|кер| то|лли|авл| ка|ят |н и|аъл|чун|анл|учу| уч|и с|аёт| иш|а у|тда|мия|а с|ра |ўзи|оий|ай |диг|эът|сла|ага|ник|р д|ция| ни|и ў|ада|рор|лад|сит|кда|икд|ким",
    "azj": " вә|вә |әр |лар| һә|ин |ир | ол| һү| би|һүг|үгу|гуг|на |ләр|дә |һәр| шә|бир|ан | тә|лик|р б|мал|лма|асы|ини|р һ|шәх|ән |әхс|ары|гла|дир|а м|али|угу|аг | ма|ын |илә|уна|јәт| ја|икд|ара|ар |әри|әси|рин|әти|р ш|нин|дән|јјә|н һ| аз|ни |әрә| мә|зад|мәк|ијј| мү|син|тин|үн |олу|и в|ндә|гун|рын|аза|нда|ә а|әт |ыны|нын|лыг|илм| га| ет|ә ј|кди|әк |лә |лмә|олм|ына|инд|лун| ин|мас|хс |сын|ә б|г в|н м|адл|ја |тмә|н т|әми|нә |длы|да | бә|нун|бәр|сы | он|әја|ә һ|маг|дан|ун |етм|инә|н а|рлә|си | ва|ә в|раг|н б|ә м|ама|ры |н и|әра|нма|ынд|инс| өз|аны|ала| ал|ик |ә д|ләт|ирл|ил | ди|бил|ығы|ли |а б|әлә|дил|ә е|унм|алы|мүд| сә|ны |ә и|н в|ыг |нла|үда|аси|или| дә|нса|сан|угл|уг |әтл|ә о|хси| һе|ола|кил|ејн|тәр|јин| бу|ми |мәс|дыр|һәм| да|мин|иш | һа| ки|у в|лан|әни| ас|хал|бу |лығ|р в| ед|јан|рә |һеч|алг| та|еч |и с|ы һ|сиа|оси|сос|фиә|г һ|афи|ким|даф| әс|ә г| иш|н ә|ији|ыгл|әмә|ы о|әдә|әса| со|а г|лыд|илл|мил|а һ|ыды|сас|лы |ист| ис|ифа|мәз|ыр |јар|тлә|лиј|түн|ина|ә т|сиј|ал |рил| бү|иә |бүт| үч|үтү|өз |ону| ми|ија| нә|адә|ман|үчү|чүн|сеч|ылы|т в| се|иал|дах|сил|еди|н е|әји|ахи|хил| ҹә|миј|мән|р а|әз |а в|илд|и һ|тәһ|әһс|ы в|һси|вар|шәр|абә|гу |раб|аја|з һ|амә|там|ғын|ад |уғу|н д|мәһ|тәм| ни|и т| ха",
    "koi": "ны |ӧн | бы|да | пр|пра|рав| мо|лӧн| да|быд|лӧ |орт|мор|ӧм |аво|ӧй | ве|ыд | не|нӧй|ыс |ын |сӧ |тӧм|сь |во |эз |льн|ьнӧ|тны|д м| ас|ыны|м п| по|сьӧ| и |то |бы | ӧт| эм| кы|аль|тлӧ|н э| от|вер|эм | кӧ|ртл|ӧ в| ко|воэ|ств|ерм|тшӧ| до|ола|ылӧ|вол|ас |ӧдн|кыт|ісь|ето|нет|тво|ліс|кӧр|ӧс | се|ы с|шӧм|а с|та |злӧ| ме| ол|аци|ӧ к|ӧ д|мед| вы|вны|а в|на |з в| на|ӧ б|лас|ӧрт| во| вӧ| сі|лан|рмӧ|дбы|едб|ыдӧ|оз |ась| оз| сы|ытш|олӧ|оэз|тир|с о| чу|ы а|оти|ция|ись|ӧтл| эт|рты| го|ы п|ы б|кол|тыс|сет| сь|рті|кӧт|о с|н б|дз |н н| мы| ке|кер|тӧн|тӧг|ӧтн|ис |а д|мӧ |ост|ӧ м| со|онд|нац|дӧс|итӧ|ест|выл| ви|сис|эта| уд|суд|нӧ |удж|ӧг |пон|ы н|н п|мӧд|а п|орй|ӧны|ӧмӧ|н м|ть |сыл|ана|ті |нда|рны|сси|рре|укӧ|з к|чук|йын|рез| эз|ысл|ӧр |ьӧр|с с|с д|рт |с в|езл|кин|осу|эзл|й о|отс| тӧ|ы д| ло| об|овн|лӧт|асс|кӧд|с м|ӧ о|нал|быт|она|ӧт |слӧ|скӧ|кон|тӧд|ытӧ|дны|а м|ы м|нек|ы к|ӧ н|асл|дор|ӧ п| де| за|а о| ов|сть|тра| дз|ь к|ӧтч|н к| ст|аса|етӧ|ьны|мӧл|умӧ|сьн| ум|ерн|код| пы|тла|оль|иал|а к|н о| сэ|а н|ь м|кыд|циа|са | ли|а б|езӧ|й д| чт|ськ|эсӧ|ион|еск|ӧ с|оци|что|ан |соц|йӧ |мӧс|тко|зын|нӧя|вес|енн| мӧ|ӧтк|ӧсь|тӧ |рлӧ|ӧя |оля|рйӧ|ӧмы|гос|тсӧ|зак|рст|з д|дек|ннё|уда|пыр|еки|ако|озь| а |исӧ|поз|дар|арс|ы ч",
    "bel": " і | пр|пра|ава| на|на | па|рав|ны |ць |або| аб|ва |ацы|аве|ае | ча|ння|анн|льн| ма| св|сва|ала|не |чал|лав|ня |ай |ых | як|га |век|е п| ад|а н| не|пры|ага| ко|а п| за|кож|ожн|ы ч|бод|дна|жны|ваб|цца|ца | ў |а а|ек |мае|і п|нне|ных|асц|а с|пав|бо |ам |ста| са| вы|ван|ьна| да|ара|дзе|одн|го |наг|він|аць|оўн|цыя|мі |то | ра|і а|тва| ас|ств|лен|аві|ад |і с|енн|і н|аль|най|аво|рац|аро|ці |сці|пад|ама| бы| яг|яго|к м|іх |рым|ым |энн|што|і і|род| та|нан| дз|ні |я а|гэт|нас|ана| гэ|інн|а б|ыць|да |ыі |оў |чын| шт|а ў|цыі|які|дзя|а і|агу|я п|ным|нац| у | ўс|ыя |ьны|оль|нар|ўна|х п|і д|ў і| гр|амі|ымі|ах | ус|адз| ні|эта|ля |воў|ыма|рад|ы п|зна|чэн|нен|аба| ка|ўле|іна|быц|ход| ін|о п| ст|ера|уль|аў |асн|сам|рам|ры | су|нал|ду |ь с|чы |кла|аны|жна|і р|пер|і з|ь у|маю|ако|ыцц|яко|для|ую |гра|ука|е і|нае|адс|і ў|кац|ўны|а з| дл|яўл|а р|аюч|ючы|оду| пе| ро|ы і|вы |і м|аса|е м|аду|х н|ода|адн|нні|кі | шл|але|раз|ада|х і|авя|нав|алі|раб|ы ў|нна|мад|роў|кан|зе |дст|жыц|ані|нст|зяр|ржа|зак|дзі|люб|аюц|бар|ім |ены|бес|тан|м п|дук|е а|гул|я ў| дэ|ве |жав|ацц|ахо|заб|а в|авы|ган|о н|ваг|я і|чна|я я|сац|так|од |ярж|соб|м н|се |чац|ніч|ыял|яль|цця|ь п|о с|вол|дэк| бе|ну |ога| рэ|рас|буд|а т|асо|сно|ейн",
    "bul": " на|на | пр|то | и |рав|да |пра| да|а с|ств|ва |та |а п|ите|но |во |ени|а н|е н| за|о и|ото|ван|не | вс|те |ки | не|о н|ове| по|а и|ава|чов|ни |ане|ия | чо|аво|ие | св|е п|а д| об|век|ест|сво| им|има|ост|и д|и ч|ани|или|все|ли |тво|и с|ние|вот|а в|ват|ма | ра|и п|и н| в |ек |сек|еки|а о| ил|е и|при| се|ова|ето|ата|воб|обо|бод|аци|ат |пре|оди|к и| бъ| съ|раз| ос|ред| ка|а б|о д|се | ко|бъд|лно|ния|о п| от|ъде|о в|за |ята| е | тр|и и|о с|тел|и в|нит|е с|ран| де|от |общ|де |ка |бра|ен |ява|ция|про|алн|и о|ият|ст |нов| до|его|как|ато| из|нег|а т|ден|а к|щес|а р|тря|а ч|ряб|о о|вен|ябв|бва|дър|гов|нац|ено|тве|ърж|е д|нос|ржа|а з|вит|зи |акв|лен| та|ежд|и з|род|е о|обр|нот| ни| с |т с|нар|о т|она|ез |йст|кат|иче| бе|жав|е т|е в|тва|зак|аро|кой|осн| ли|ува|авн|ейс|сно|рес|пол|нен|вни|без|ри |стр| ст|сто|под|чки|вид|ган|си |ди |и к|нст| те|а е|вси|еоб| дъ|сич|ичк|едв|жен|ник|ода|т н|о р|ака|ели|одн|елн|лич| че|чес|бще| ре|и м| ср|сре|и р|са |лни| си|дви|ичн|жда| къ|оет|ира|я н|дей| ме|еди|дру|ход|еме|кри|че |дос|ста|гра| то|ой |тъп|въз|ико|и у|нет| со|ави|той|елс|меж|чит|ита|що |ъм |азо|зов|нич|нал|дно| мо|ине|а у|тно|таз|кон|лит|ан |клю|люч|пос|тви|а м|й н|т и|изв|рез|ази|ра |оят|нео|чре",
    "kaz": "ен |не | құ|тар|ұқы| ба| қа|ға |ада|дам|құқ|ық | бо| ад|ықт|қта|ына|ар | жә|ың |ылы|әне|жән| не|мен|лық|на |р а|де | жа|ін |а қ|ары|ан | әр|қыл|ара|ала| ме|н қ|еме|уға|ның| де|асы|ам |іне|тан|лы |нды|да |әр |ығы|ста|еке| өз|ын |ған|анд|мес| бі| қо|ды |ің |бас|бол|етт|ып |н б|ілі|қық|нде|ері|е қ|алы|нем|се |бір|лар|есе|ы б|тын|а ж| ке|тиі|ост|ге |бар| ти|е б| ар|дық|сы |інд|е а|аты| та| бе|ы т|ік |олы|нда|ғын|ры |иіс|ғы | те|бос|луы|алу|сын|рын|еті|іс |рде|қығ|е ж|рін|дар|іні|н ж|тті|қар|н к|ім | ер|егі|ыры|ыны| са|рға|ген|ынд|аны|уын|ы м|лға|ана|нің|тер|уы |ей |тік|ке |сқа|қа |мыс|тық|м б|ард| от|е н|е т|мны|өзі|нан|гіз|еге| на|ы ә|аза|ң қ|лан|нег|асқ|кін|амн|кет|рал|айд|луғ|аса|ті |рды|і б|а б|ру | же|р м|ді |тта|мет|лік|тыр|ама|жас|н н|лып| мү|дай|өз |ігі| ал|ауд|дей|зін|бер|р б|уда|кел|біл|і т|қор|тең|лге| жү|ден|ы а|елі|дер|ы ж|а т|рқы|рлы|арқ| тү|қам|еле|а о|е ө|тін|ір |ең |уге|е м|лде|ау |ауы|ркі|н а|ы е|оны|н т|рыл|түр|ция|гін| то| ха|жағ|оға|осы|зде| ос|ікт|кті|а д|ұлт|лтт|тты|лім|ғда| ау| да|хал|тте|лма| ұл|амд|құр|ірі|қат|тал|орғ|зі |елг|сіз|ағы| ел|ң б|ыс | ас|імд|оты| әл|н е|ағд|қты|шін|ерк|е д|ек |ені|кім|ылм|шіл|аға|сты|лер|гі |атт|кен| кө|ым‐| кұ|кұқ|ра |рік|н ә| еш"
  },
  "Arabic": {
    "arb": " ال|ية | في|الح|في | وا|وال| أو|ة ا|أو |الم|الت|لحق|حق |لى |كل |ان |ة و|الأ| لك|لكل|ن ا|ها |ق ف|ات |مة |ون |أن |ما |اء |ته |و ا|الع|ي ا|شخص|ي أ| أن|الإ|م ا|حري| عل|ة ل|من |الا|حقو|على|قوق|ت ا|أي |رد | شخ| لل| أي|ق ا|لا |فرد|رية| ول| من|د ا| كا| إل|خص |وق |ا ا|ة أ|ا ي|ل ف|ه ا|نسا|جتم|ن ي|امة|كان|دة | حق|ام |الق|ة م| فر|اية|سان|ل ش|ين |ن ت|إنس|ا ل| لا|ذا |هذا|ن أ|لة |ي ح| دو|ه ل|لك |ترا|لتع|اً |له |إلى| عن|ى ا|ه و|ع ا|ماع|د أ|اسي| حر|ة ع|مع |الد|نون| با|لحر|لعا|ن و|، و|يات|ي ت|الج| هذ|ير |بال|دول|لإن|عية|الف|ص ا| وي|الو|لأس| إن|أسا|ساس|ماي|حما|رام|سية|انو|مل |ي و|عام|ا و|تما| مت|ة ت|علي|ع ب|ك ا| له|ة ف|قان|ى أ|ول |هم |الب|ة ب|ساو|لقا|الر|لجم|ا ك|تمت|ليه|لتم|لمت|انت| قد|اد |ه أ| يج|ريا|ق و|ل ا|ا ب|ال |يه |اعي|لدو|ل و|لإع|لمي|لمج|لأم|تع |دم |تسا|عمل|اته|لاد|رة |اة |غير|قدم|وز |جوز|يجو|عال|لان|متع|مان|فيه|اجت|م و|يد |تعل|ن ل|ر ا| يع| كل|مم |مجت|تمع|دون| مع|تمي|ذلك|كرا|يها| مس|ميع|إعل|علا| تم| عا|ملا|اعا|لاج|ني |ليم|متس|ييز|يم |اعت|الش| تع|ميي|عن |تنا| بح|لما|ي ي|يز |ود |أمم|لات|أسر|شتر|تي | جم|ه ع|ر و|ي إ|تحد|حدة| أس|عة |ي م|ة، |معي|ن م|لمس|م ب|اق |جمي|لي |مية|الض|الس|لضم|ضما|لفر| وس|لحم|امل|ق م|را |ا ح|نت | تن|يته| أم|إلي|واج|د و|لتي| مر|مرا|متح| ذل| وأ| تح|ا ف| به| وم| بم|وية|ولي|لزو",
    "urd": "ور | او|اور|کے | کے| کی|یں | کا|کی | حق|ے ک|کا | کو|یا |نے |سے | اس|ئے |کو |میں| ہے| می|ے ا| کر| ان|وں | ہو|اس |ر ا|شخص|ی ا| شخ| سے| جا|حق |خص |ہر |ام |ے م|ں ک|ہیں| یا|سی | آز|آزا|زاد|ادی|ائے|ا ح|ص ک|ہ ا|ہے |جائ|ت ک|ر ش|کہ |م ک| پر|ی ک|پر |ان |ا ج|۔ہر|س ک|دی |ہے۔|ق ہ|ی ح|ں ا|و ا|ر م|ار |حقو|قوق|ن ک|ری |کسی|ے گ|ی ج| مع| ہی|وق |سان|نی |ر ک|کرن|ی ت| حا| جو|تی |ئی | نہ| کہ|ل ک|اپن|جو |نسا|انس|ہ ک|ے ب|نہ |ہو | مل| اپ|یت |می |ے ہ|رنے|ے ل|ل ہ|ا ا| کس|رے |ی ش| ای|وہ |۔ ا|اصل|نہی|صل |ی م|یں۔|حاص|معا|د ک|انہ|ایس|ی ب|ی ہ|ملک|ق ک|ات | تع|دہ |قوم| قو|ے، |ر ہ|ا م|یہ | دو| من| بن| گا|اشر|کیا|ں م|عاش|وام| عا|اد |قوا|ی س|بر |اقو|انی| جس| لئ|لئے|دار|ر ب|ائی| وہ|ے۔ہ|مل |ے ج|علا|یوں| یہ|ے ح|ہ م|و ت|جس |ا ہ|کر |ر ن|لیم|انو| قا| و |ے۔ | اق|یم |ریق|لک |گی |ی آ|دوس| گی|وئی|ر پ|، ا|نیا|تعل| مس|ر ع|ی، |یر |لاق|خلا| رک|ین | با|ن ا|ی ن|ے پ|پنے|وری|ا س| سک| دی|ون |گا۔|م ا|انے|علی|یاد|قان|نون|س م|اف |رکھ| اع| پو| شا|وسر|ق ح|سب | بر|رتی| بی|اری| بھ|رائ| مم|ر س|یسے|ومی|دگی|ندگ| مر| پی| چا|و گ|نا |ے خ|ہ و|ادا| ہر|ا پ|تما|پور|مام|ے ع|ائد| عل|بھی|ھی |عام| مت| مق|من |د ا| ام|ونک| خل|نکہ|لاف|اعل|کوئ|اں |ریع|ذری| ذر|بنی| لی|و ک|دان|ں، |ے ی|ا ک| مح|، م|ت ا|ال |پنی|ے س|ر آ|ر ح|دیو|غیر| طر|ہوں|ی پ|ِ م|کرے| سا|اسے|رہ |برا",
    "fas": " و | حق| با|که |ند | که| در|در |رد | دا|دار|از | از|هر | هر|یت |ر ک|حق |د ه|ای |د و|ان | را|ین |ود |یا | یا|را |ارد|ی و|کس | کس| بر| آز|باش|ه ب|آزا|د ک| خو|ه ا|د ب|زاد| اس|ار | آن|ق د|شد |حقو|قوق|ی ب|وق |ده |ه د|ید |ی ک|و ا|ور |ر م|رای|اشد|خود|ادی|تما|ری | اج|ام |دی |اید|س ح|است|ر ا|و م| ان|د ا|نه | بی|با | هم| نم|مای| تا|د، |ی ا|انه|ات |ون |ایت|ا ب|ست | کن|برا|انو| بش| مو|این| مر|اسا| مل|وان|ر ب|جتم| شو| اع|ن ا|ورد| می| ای|آن | به|و آ|ملل|ا م|ماع|نی |ت ا|، ا|ت و|ئی |عی |ائی|اجت|و ب|های|ن م|ی ی|بشر|کند|شود| من| زن|ن و|ی، |بای|ی ر| مس|مل |مور|ز آ|توا|دان|اری|علا|گرد|یگر|کار| گر| بد|ن ب|ت ب|ت م|ی م| مق|د آ|شور|یه |اعی| عم|ر خ|ن ح| کش|رند|مین| اح|ن ت|ی د| مت|ه م|د ش| حم|و د|دیگ|لام|کشو|هٔ |ه و|انی|لی |ت ک| مج|ق م|میت| کا| شد|اه |نون| آم|اد |ادا|اعل|د م|ق و|ا ک|می |ی ح|لل |نجا| مح|ساس|یده| قا|بعی|قان|ر ش|مقا|ا د|هد |وی |نوا|گی |ساو|ر ت|بر |اً |نمی|اسی|اده|او | او| دی| هی|هیچ|ه‌ا|‌ها|یر |خوا|د ت|همه|ا ه|تی |حما|دگی|بین|ع ا|سان|ر و|شده|ومی| عق| بع|ز ح|شر |مند| شر|ٔمی|أم|تأ|انت|اند|اوی|مسا|ردد|بهر| بم|ارن|یتو|ل م|ران|و ه|ر د|م م|رار|عقی|سی |و ت|زش | بو|ا ا|ی ن|موم|جا |عمو|رفت|عیت| فر|ندگ|واه|زند|م و|نما|ه ح|ا ر|دیه|جام|مرد|ت، |د ر|مام| تم|ملی|نند|الم|طور|ی ت|تخا|ا ت|امی|امل|دد | شخ|شخص",
    "zlm": " دا|ان |دان| بر| او|ن س| ڤر|له |كن |ن ك|ن ا|دال|ن د|رڠ |يڠ |حق | يڠ|ارا| كڤ|أن |تيا|ڤد |ورڠ|ڠن |ياڤ| تر|اله|ولي|ن ڤ|اور|كڤد|برح|رحق|ين |اڤ |را | ات|ليه|ستي|ه ب|يه |اتا| ست| عد|عدا|ن ب|تاو|ن ت|يبس|ڤ ا|او |بيب|سي | كب|ه د|ن م| سو| من| حق| سا|لم |ق ك|اسا|الم|ن ي| تي| اي|سام|رن |ن، | ما|اتو|باڬ|بسن|سن |نڬا|ڬار|اين| مم|د س| با|كبي|ي د|ڠ ع|چار| سب|ڽ س|اڬي|د ڤ|ندق|سبا|اڽ | د | ڤم|نسي|قله|يند|ڬي |ام |تن |وان|تا |اون|ي ا| نڬ|هن | بو|ا ڤ|أنس|بول| كس| سم| سچ|ڠ ب|سچا|مأن|ا ب|ا س|بڠس| ڤڠ|دڠن|سيا|اسي|ساس| مأ| دڠ| اس|بار|هند|مان|ارڠ|رتا|دقل|تي |ت د| هن|ڤرل|نڽ |ات |ادي|ق م|، ك|تره|رها|هاد| ڤو|ادڤ| لا|ي م|ڤا |يكن|اول|ڤون|، د|ون |ڠسا|٢ د|اي |ق٢ |تو |وق |دڤ |يأن|وين|ن ه|ن٢ |ا د|وڠن|نتو|اكن|وا |ندو|وات|ه م|ي س|ڠ٢ | مڠ| ان|حق٢|يك |اد |مڤو|رات|اس |مرا|برس|ائن| مل| سس|ماس| كو|ري | بي|سوا|ڠ ت|ا، |، ت|ياد|امر|سمو|ڠ م|ڤرا|لوا|ڤري|دوڠ|ي ك|ل د|تار|ريك|تيك|ارك|ونت|لين| سر|رلي|سرت|وند|واس|رسا|ڤمب|ترم|، س|اڬا|يري|رأن| در|ا ا|دير| بڠ|ي ڤ|لائ|سوس|ڠ س|توق|سأن|ورو|جوا|هار|اڤا|وكن| ڤن|٢ ب|موا| كم|ارأ|نن |ندڠ|ا٢ | كأ|دڠ٢|و ك|كرج|وه |ا م|ڤرك|تها|اجر|جرن|ي، |شته| سڤ| به|ندي|ق ا|ڠڬو|بها|ڤ٢ | مر|سات|راس|بوا|ه ا|ا ك|د ك| ڤل|ن ح|لاج|هڽ |ڠ ا|مبي|ينڠ|بس | اڤ|ملا|كور|وار|م ڤ|سسي|نتي|تيڠ| دل|سال|وبو|منو|ڤول|مول|ڠ د|نتا|انت|ال ",
    "skr": "تے |اں | تے|دے |دی |وں | دا| حق| کو|ے ا|کوں| دے|دا | دی|یاں| کی|ے ۔|یں |ہر | ۔ |کیت|ہے | وچ| ہے|وچ | ان| شخ|شخص|ادی|ال | حا|اصل|حق |حاص|ے م|خص |صل |ں د| نا|یا | ای|اتے|ق ح|ل ہ|ے و|ں ک| ات|ہیں|سی | مل|نال|زاد|ازا|ی ت| از|قوق|ار |ا ح|حقو| او|ص ک| ۔ہ|۔ہر|ر ش|دیا|ے ج|وق |ندے| کر|یند| یا|نہ | جو|کہی|ئے |ی د|سان|نسا|وند|ی ا|یتے|انس|ا ا|ملک|ے ح|و ڄ|ے ک|ڻ د| وی|یسی|ے ب|ا و| ہو|ں ا|ئی |ندی|تی |آپڻ|وڻ |ر ک|ن ۔| نہ|انہ|جو | کن| آپ| جی|اون|ویس|ی ن| تھ| کہ|ان |ری |ڻے | ڄئ| ہر|ے ن|دہ |ام |ں م|ے ہ|تھی|ں و|۔ ا|ں ت|ی ۔|کنو|ی ح|ی ک|نوں|رے |ہاں| بچ|ون |ے ت|کو | من|ی ہ|اری|ور |نہا|ہکو|یتا|نی |یاد|ت د|ن د| ون|وام|ی م|قوا|تا |ڄئے|پڻے| ہک|می | قو|ق ت|ے د|لے |اف |ل ک|ل ت| تع|چ ا|ین |خلا|اے |علا| سا|جیا|ئو |کرڻ|ی و|انی|ہو |دار| و |ی ج| اق|ن ا|یت |ارے|ے س|لک |ق د|ہوو| ڋو|ر ت| اے|ے خ| چا| خل|لاف|قنو|نون|پور|ڻ ک| پو|ایہ|بچئ|چئو|ات |الا|ونڄ|وری|این| وس| لو|و ا|ہ د| رک|یب |سیب|وسی|یر |ا ک|قوم|ریا|ں آ| جا|رکھ|مل |کاں|رڻ |اد |او |عزت| قن|ب د|وئی|ے ع| عز| ۔ک| مع|اقو|ایں|م م|زت |ڻی |یوڻ|ر ہ| سم|ں س|لوک| جھ| سی|جھی|ت ت|ل ا|اوڻ|کوئ|ں ج|ہی |حدہ|تعل|ے ذ|وے |تحد|متح|لا |ا ت|کار| اع|ے ر| مت|ر ا|ا م|ھین|ھیو|یہو| مط| سڱ|ی س|ڄے |نڄے|سڱد|لیم|علی|ے ق| ذر|م ت| کھ|ن ک| کم|ہ ا|سار|ائد|ائی|د ا| ہن|ہن |ی، |و ک|ں ب|ھیا|ذری|ں پ|لی "
  },
  "Devanagari": {
    "hin": "के |प्र|और | और| के|ों | का|कार| प्|का | को|या |ं क|ति |ार |को | है|िका|ने |है |्रत|धिक| अध|अधि|की |ा क| कि| की| सम|ें |व्य|्ति|क्त|से | व्|ा अ|्यक|में|मान|ि क| स्| मे|सी |न्त| हो|े क|ता |यक्|क्ष|ै ।|िक |त्य| कर|्य | या|भी | वि|रत्|र स|ी स| जा|स्व|रों|्ये|ेक |येक|त्र|िया|ा ज|क व|र ह|ित |्रा|किस| अन|ा स|िसी|ा ह|ना | से| पर|र क| सा|देश|गा | । | अप|्त्|े स|समा|ान |ी क|्त |वार| ।प|ा प| रा|षा |न क|।प्|ष्ट|था |अन्| मा|्षा|्वा|ारो|तन्|वतन|ट्र|्वत|प्त|ाप्|्ट्|राष|ाष्| इस|े अ| उस| सं|राप|कि |त ह|हो |ं औ|ार्|ा ।|किय|े प| दे| भी|करन|री |जाए|ी प| न |र अ|क स|अपन|े व|ाओं|्तर|ओं | नि|सभी|रा | तथ|तथा|िवा|यों|पर | ऐस|रता|ारा|्री|सम्| द्|ीय |िए |व क|सके|द्व|होग| सभ|ं म|माज|रने|िक्|्या|ा व|र प| जि|ो स|र उ|रक्|े म|पूर| लि|ाएग| भा|इस |त क|ाव |स्थ|पने|ा औ|द्ध|श्य|र्व| घो|घोष|रूप|भाव|ाने|कृत|ो प|े ल|लिए|शिक|ूर्| उन|। इ|ं स|य क|्ध |दी |ी र|र्य|णा |एगा|न्य|रीय|ेश |रति|े ब| रू|ूप |परा|्र |तर्| पा| सु|जिस|तिक|सार|जो |ेशो| शि|ानव|ी अ|चित|े औ| पू|ियो|ा उ|म क|ी भ|शों| बु|म्म|स्त|िश्|्रो|्म |ो क| यह|र द|नव |चार|दिय|े य|र्ण|राध|ोगा|ले |नून|ानू|ोषण|षणा|विश| जन|ारी|परि|गी |वाह|साम|ाना|रका| जो|ाज |ी ज|ध क|बन्|ताओ|ंकि|ूंक|ास |कर |चूं|ी व|य ह|ा ग|य स|न स|त र|कोई|ुक्|ोई | ।क|ं न|हित|निय|याद|ादी|्मा|्था|ामा|ाह |ी म|े ज",
    "mar": "्या|या |त्य|याच|चा | व |ण्य|प्र|कार|ाचा| प्|धिक|िका| अध|अधि|च्य|ार |आहे| आह|ा अ|हे | स्|्रत|्ये|ा क|स्व| कर|्वा|ता |ास |ा स|ा व|त्र| त्|वा |ांच|यां|िक |मान| या|्य | का| अस|रत्|ष्ट|र्य|येक|ल्य|र आ|ाहि|क्ष| को|ामा|कोण| सं|ाच्|ात |ा न| रा|ंत्|ून |ेका| सा|राष|ाष्|चे |्ट्|ट्र|तंत| मा|ने |किं| कि|व्य|वात|े स|करण|ंवा|िंव|ये |क्त| सम|ा प|ना | मि|कास|ातं|्र्|र्व|समा|मिळ| जा|े प|व स|यास|ोणत|रण्|काम|ीय |ा आ| दे|े क|ांन|हि |रां| व्|्यक|ा म|िळण|ही | पा|्षण|ार्|ान |े अ| आप| वि|ळण्|ाही|ची |े व|्रा|मा |ली |ंच्|ारा|ा द| आण| नि|णे |द्ध| नय|ला |ा ह|नये| सर|सर्|्री|बंध|ी प|आपल|ले |ील |माज| हो|्त |त क|ाचे|्व |षण |ंना|लेल|ी अ|देश|आणि|णि |ध्य| शि|ी स|े ज|शिक|रीय|ानव|पाह|हिज|िजे|जे |क स|यक्|न क|व त|ा ज|यात|पल्|न्य|वी |स्थ|ज्य| ज्|े आ|रक्|त स|िक्|ंबं|संब| के|क व|केल|असल|य अ|य क|त व|ीत |णत्|त्व|ाने| उप|्वत|भाव|े त|करत|याह|रता|िष्|व म|कां|साम|रति|सार|ंचा|र व|क आ|याय|ासा|साठ|ाठी|्ती|ठी |ेण्|र्थ|ीने|े य|जाह|ोणा|संर|ायद|च्छ|स स|ंरक|तील|ी व|त आ|ी आ|ंधा|ेशा|ित | अश|हीर| हक|हक्|क्क|य व|शा |व आ|तीन|ण म|ूर्|ेल्|द्य|ेले|ांत|ा य|ा ब|ी म|ंचे|याव|देण|कृत|ारण|ेत |िवा|वस्|स्त|ाची|नवी| अर|थवा|अथव|ा त| अथ|अर्|ती |पूर|इतर|र्ण|ी क|यत्| इत| शा|रका|तिष|ण स|तिक|्रक|्ध |रणा| आल|ेल |ाजि| न्|धात|रून|श्र|असे|ष्ठ|ुक्|ेश |तो |जिक|े म",
    "mai": "ाक |प्र|कार|िका|धिक|ार | आʼ|आʼ |्रत|ेँ |क अ|्यक|िक |्ति| अध|व्य|अधि|क स| प्| व्|क्त|केँ|यक्|तिक|हि | स्|न्त|क व|मे |बाक| सम|मान|त्य|क्ष|छैक| छै|ेक |स्व|रत्|त्र| अप|्ये|ष्ट|येक|र छ|सँ |ित |ैक।| एह| वि|वा | जा|्त्|िके|ति |ट्र|ाष्| हो|्ट्|राष| अन| रा| सा|्य |अपन| कर|कोन|।प्|्वत|क आ|तन्|अछि| अछ|वतन| को|था | वा|ताक| पर|ार्|एहि|नहि|पन |ा आ|रता|समा| मा|्री|नो | नह|्षा|देश|क प| दे| का| कए|रक | नि| सं|न्य|ि क|ोनो|छि |्त |ारक|्वा|ा स|ान्|ल ज|तथा| तथ|ान |करब|ँ क| आ |र आ|ीय |ता |क ह|वार| जे|्या|िवा|जाए|ना |ओर |ानव|ा प|ँ अ|अन्|ारण|माज|स्थ|घोष| आओ|्तर| एक|साम|र्व|आओर|धार|त क|परि|रीय|्रस|कएल|ामा|्रा|रण |ँ स| सभ|द्ध|स्त|एबा|पूर|ʼ स|ा अ| घो|षा |ाहि|ʼ अ|क।प|यक |नक |रक्|रबा|चित|िक्|क ज|ोषण|कर |र प|ेतु|हेत|शिक|एल |सम्| उप|ाधि|एहन|हन |त अ|तु |ूर्|षणा| हे|िमे| अव|ेल |सभ |े स|ि ज|निर| शि|िर्|रति|होए|अनु|र अ|जाह|क क|हो |्ध |रूप|वक |च्छ|प्त|ँ ए| सक|भाव|क उ|ाप्|सभक|त आ|ि आ|र्ण|त स|्रक|एत।|र्य|त ह|जिक| जन|ाजि|चार|ण स|ैक |रा |ि स|ारा|री |िश्|वाध|ा व|ाएत|न अ| ओ |हु |कान|जे |न व|िसँ|रसं|विव|कृत|ि घ|क ब| भा|उद्|ोएत| उद|राप|ʼ प|श्य|न प|्ण |य आ|द्व| द्|िष्| सह|ि द|धक | बी|ेश | पू|षाक|नवा|ास |ामे|ए स|जेँ| कि|कि |क ल| भे|पर |यता| रू|ओ व|ाके| पए|केओ|ेओ |पएब|राज| अथ|अथव|थवा|त्त|विश|्थि|य प|ा क|न क|वास|रिव|क र| दो|सार",
    "bho": " के|के |ार |े क|कार|धिक|िका|ओर |आओर| आओ| अध|अधि|े स|ा क|े अ| हो| सं|र क|र स|ें | मे|में|िक | कर|ा स|र ह| से|से |रा |मान| सम|न क|क्ष|े ब|नो | चा|वे |ता |चाह|ष्ट| रा|ति |्रा|खे |राष|ाष्|प्र| सा| का|ट्र|े आ| प्| सक| मा|्ट्| स्|होख| बा|करे|ि क|ौनो|त क|था |कौन|पन | जा| कौ|रे |ाति|ला | ओक|ेला|तथा|आपन|्त | आप|कर |हवे|र म| हव| तथ|सबह|र आ|ोखे| ह।|िर |े ओ|केल|सके|हे | और|ही |तिर|त्र|जा |ना |बहि|।सब|े च| खा|े म| पर|खात|ान |र ब|न स|ावे| लो|षा |ाहे|ी क|ओकर|ा आ|माज|ित |े ज|ल ज|मिल|संग|्षा|ं क| सब|ा प|और |रक्|वे।|िं |े ह|ंत्|ाज |स्व|हिं|नइख|कान|ो स| जे|समा|क स|लोग|करा|क्त|्रत|ला।| नइ|े। |ानव|िया|हु |इखे|्र |रता|्वत|ानू|े न|ाम |नून|ाही|वतं|पर |ी स| ओ |े उ|े व|्री|रीय|स्थ|तंत|दी |ीय |े त|र अ|र प|्य |साम|बा।| आद|ून |। स|व्य|ा।स|सभे|भे |या | दे|ा म|े ख| वि| सु|केह|प्त|योग|ु क|ोग |े द|चार|ादी|ाप्| दो| या|राप|ल ह|पूर| मि|तिक|खल |यता|्ति| बि|ए क|आदि|दिम| ही|हि |मी | नि|र न| इ |ेहु|नवा|ा ह|री |ले | पा|ाधि| सह| उप|्या| जर|षण | सभ|िमी|देश|े प|म क|जे |ाव | अप|शिक|ाजि|जाद|जिक|े भ|क आ|्तर|िक्|ि म|ेकर|ुक्|वाध|गठन| व्|निय|ठन |।के|ामा|रो | जी|य क|न म|े ल|न ह|ास |ेश | शा|घोष|ंगठ|िल | घो|्षण| पू|े र|ंरक|संर|उपय|पयो|हो |बा |ी ब|्म |सब |दोस|ा। | आज|साथ| शि|आजा| भी| उच|ने |चित| अं|र व|ज क|न आ| ले|नि |ार्|कि |याह|्थि",
    "nep": "को | र |कार|प्र|ार |ने |िका|क्त|धिक|्यक| गर|व्य|्रत| प्|अधि|्ति| अध| व्|यक्|मा |िक |त्य|ाई |लाई|न्त|मान| सम|त्र|गर्|र्न|क व| वा|्ने|वा | स्|रत्|र स|्ये|तिल|येक|ेक |छ ।|ो स|ा स|हरू| वि|क्ष|्त्|िला| । |स्व|हुन|ति | हु|ले | रा| मा|ष्ट|समा|वतन|तन्| छ |र छ| सं|्ट्|ट्र|ाष्|ो अ|राष|्वत|ुने|नेछ|हरु|ान |ता |े अ|्र | का|िने|ाको|गरि|े छ|ना | अन| नि|रता|नै | सा|ित |तिक|क स|र र|रू |ा अ|था |स्त|कुन|ा र|ुनै| छै|्त |छैन|ा प|ार्|वार|ा व| पर|तथा| तथ|का |्या|एको|रु |्षा|माज|रक्|परि|द्ध|। प| ला|सको|ामा| यस|ाहर|ेछ |धार|्रा|ो प|नि |देश|भाव|िवा|्य |र ह|र व|र म|सबै|न अ|े र|न स|रको|अन्|ताक|ंरक|संर|्वा| त्|सम्|री |ो व|ा भ|रहर| कु|्रि|त र|रिन|श्य|पनि|ै व|यस्|ारा|ानव| शि|ा त|लाग|रा |शिक| सब|ाउन|िक्|्न |ारक|ा न|रिय|्यस|द्व|रति|चार| सह|्षण| सु|ारम|ुक्|ुद्|साम|षा |ैन | अप| भए|बाट|ुन | उप|ान्|ो आ|्तर|िय |कान|ि र|रूक|द्द|र प|ाव |ो ल|तो | पन|ैन।| आव|ा ग|।प्|बै |ूर्|िएक|र त|निज|त्प| भे|जिक|ेछ।|िको|्तो|वाह|त स|ाट | अर|ाजि|्ध | उस|रमा|ात्|र्य|नको|ाय |जको|ित्|ागि| अभ|न ग|गि |ा म| आध|स्थ| पा|ारह|घोष|त्व|यता|ा क|र्द| मत|विध| सक|सार|परा|युक|राध| घो|णको|अपर|े स|ारी|।कु| दि| जन|भेद|रिव|उसक|क र|र अ|ि स|ानु|ो ह|रुद| छ।|ूको|रका|नमा| भन|र्म|हित|पूर|न्य|क अ|ा ब|ो भ|राज|अनु|ोषण|षणा|य र| मन| बि|्धा| दे|निर|ताह|र उ|यस |उने|रण |विक"
  }
}

},{}],5:[function(require,module,exports){
// This file is generated by `build.js`.
module.exports = {
  cmn: /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/g,
  Latin: /[A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]/g,
  Cyrillic: /[\u0400-\u0484\u0487-\u052F\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69D\uA69F]/g,
  Arabic: /[\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061E\u0620-\u063F\u0641-\u064A\u0656-\u065F\u066A-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u08A0-\u08B2\u08E4-\u08FF\uFB50-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFD\uFE70-\uFE74\uFE76-\uFEFC]|\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]/g,
  ben: /[\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FB]/g,
  Devanagari: /[\u0900-\u0950\u0953-\u0963\u0966-\u097F\uA8E0-\uA8FB]/g,
  jpn: /[\u3041-\u3096\u309D-\u309F]|\uD82C\uDC01|\uD83C\uDE00|[\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D]|\uD82C\uDC00/g,
  kor: /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g,
  tel: /[\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7F]/g,
  tam: /[\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA]/g,
  guj: /[\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1]/g,
  kan: /[\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2]/g,
  mal: /[\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D75\u0D79-\u0D7F]/g,
  mya: /[\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F]/g,
  ori: /[\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77]/g,
  pan: /[\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75]/g,
  amh: /[\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]/g,
  tha: /[\u0E01-\u0E3A\u0E40-\u0E5B]/g,
  sin: /[\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4]|\uD804[\uDDE1-\uDDF4]/g,
  ell: /[\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65]|\uD800[\uDD40-\uDD8C\uDDA0]|\uD834[\uDE00-\uDE45]/g
};

},{}],6:[function(require,module,exports){
// This file is generated by `build.js`
'use strict';

/* Load `trigram-utils`. */
var utilities = require('trigram-utils');

/* Load `expressions` (regular expressions matching
 * scripts). */
var expressions = require('./expressions.js');

/* Load `data` (trigram information per language,
 * per script). */
var data = require('./data.json');

/* Expose `detectAll` on `detect`. */
detect.all = detectAll;

/* Expose `detect`. */
module.exports = detect;

/* Maximum sample length. */
var MAX_LENGTH = 2048;

/* Minimum sample length. */
var MIN_LENGTH = 10;

/* The maximum distance to add when a given trigram does
 * not exist in a trigram dictionary. */
var MAX_DIFFERENCE = 300;

/* Construct trigram dictionaries. */
(function () {
  var languages;
  var name;
  var trigrams;
  var model;
  var script;
  var weight;

  for (script in data) {
    languages = data[script];

    for (name in languages) {
      model = languages[name].split('|');

      weight = model.length;

      trigrams = {};

      while (weight--) {
        trigrams[model[weight]] = weight;
      }

      languages[name] = trigrams;
    }
  }
})();

/**
 * Get the most probable language for the given value.
 *
 * @param {string} value - The value to test.
 * @param {Object} options - Configuration.
 * @return {string} The most probable language.
 */
function detect(value, options) {
  return detectAll(value, options)[0][0];
}

/**
 * Get a list of probable languages the given value is
 * written in.
 *
 * @param {string} value - The value to test.
 * @param {Object} options - Configuration.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */
function detectAll(value, options) {
  var settings = options || {};
  var minLength = MIN_LENGTH;
  var script;

  if (settings.minLength !== null && settings.minLength !== undefined) {
    minLength = settings.minLength;
  }

  if (!value || value.length < minLength) {
    return und();
  }

  value = value.substr(0, MAX_LENGTH);

  /* Get the script which characters occur the most
   * in `value`. */
  script = getTopScript(value, expressions);

  /* One languages exists for the most-used script.
   *
   * If no matches occured, such as a digit only string,
   * exit with `und`. */
  if (!(script[0] in data)) {
    return script[1] === 0 ? und() : singleLanguageTuples(script[0]);
  }

  /* Get all distances for a given script, and
   * normalize the distance values. */
  return normalize(value, getDistances(
    utilities.asTuples(value), data[script[0]], settings
  ));
}

/**
 * Normalize the difference for each tuple in
 * `distances`.
 *
 * @param {string} value - Value to normalize.
 * @param {Array.<Array.<string, number>>} distances
 *   - List of distances.
 * @return {Array.<Array.<string, number>>} - Normalized
 *   distances.
 */
function normalize(value, distances) {
  var min = distances[0][1];
  var max = (value.length * MAX_DIFFERENCE) - min;
  var index = -1;
  var length = distances.length;

  while (++index < length) {
    distances[index][1] = 1 - ((distances[index][1] - min) / max) || 0;
  }

  return distances;
}

/**
 * From `scripts`, get the most occurring expression for
 * `value`.
 *
 * @param {string} value - Value to check.
 * @param {Object.<RegExp>} scripts - Top-Scripts.
 * @return {Array} Top script and its
 *   occurrence percentage.
 */
function getTopScript(value, scripts) {
  var topCount = -1;
  var topScript;
  var script;
  var count;

  for (script in scripts) {
    count = getOccurrence(value, scripts[script]);

    if (count > topCount) {
      topCount = count;
      topScript = script;
    }
  }

  return [topScript, topCount];
}

/**
 * Get the occurrence ratio of `expression` for `value`.
 *
 * @param {string} value - Value to check.
 * @param {RegExp} expression - Code-point expression.
 * @return {number} Float between 0 and 1.
 */
function getOccurrence(value, expression) {
  var count = value.match(expression);

  return (count ? count.length : 0) / value.length || 0;
}

/**
 * Get the distance between an array of trigram--count
 * tuples, and multiple trigram dictionaries.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tuples.
 * @param {Object.<Object>} languages - multiple
 *   trigrams to test against.
 * @param {Object} options - Configuration.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */
function getDistances(trigrams, languages, options) {
  var distances = [];
  var whitelist = options.whitelist || [];
  var blacklist = options.blacklist || [];
  var language;

  languages = filterLanguages(languages, whitelist, blacklist);

  for (language in languages) {
    distances.push([
      language,
      getDistance(trigrams, languages[language])
    ]);
  }

  return distances.length ? distances.sort(sort) : und();
}

/**
 * Get the distance between an array of trigram--count
 * tuples, and a language dictionary.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tuples.
 * @param {Object.<number>} model - Object
 *   containing weighted trigrams.
 * @return {number} - The distance between the two.
 */
function getDistance(trigrams, model) {
  var distance = 0;
  var index = -1;
  var length = trigrams.length;
  var trigram;
  var difference;

  while (++index < length) {
    trigram = trigrams[index];

    if (trigram[0] in model) {
      difference = trigram[1] - model[trigram[0]] - 1;

      if (difference < 0) {
        difference = -difference;
      }
    } else {
      difference = MAX_DIFFERENCE;
    }

    distance += difference;
  }

  return distance;
}

/**
 * Filter `languages` by removing languages in
 * `blacklist`, or including languages in `whitelist`.
 *
 * @param {Object.<Object>} languages - Languages
 *   to filter
 * @param {Array.<string>} whitelist - Whitelisted
 *   languages; if non-empty, only included languages
 *   are kept.
 * @param {Array.<string>} blacklist - Blacklisted
 *   languages; included languages are ignored.
 * @return {Object.<Object>} - Filtered array of
 *   languages.
 */
function filterLanguages(languages, whitelist, blacklist) {
  var filteredLanguages;
  var language;

  if (whitelist.length === 0 && blacklist.length === 0) {
    return languages;
  }

  filteredLanguages = {};

  for (language in languages) {
    if (
      (
        whitelist.length === 0 ||
        whitelist.indexOf(language) !== -1
      ) &&
      blacklist.indexOf(language) === -1
    ) {
      filteredLanguages[language] = languages[language];
    }
  }

  return filteredLanguages;
}

/* Create a single `und` tuple. */
function und() {
  return singleLanguageTuples('und');
}

/* Create a single tuple as a list of tuples from a given
 * language code. */
function singleLanguageTuples(language) {
  return [[language, 1]];
}

/* Deep regular sort on the number at `1` in both objects. */
function sort(a, b) {
  return a[1] - b[1];
}

},{"./data.json":4,"./expressions.js":5,"trigram-utils":9}],7:[function(require,module,exports){
'use strict';

/* Expose. */
module.exports = exports = nGram;

exports.bigram = nGram(2);
exports.trigram = nGram(3);

/* Factory returning a function that converts a given string
 * to n-grams. */
function nGram(n) {
  if (typeof n !== 'number' || isNaN(n) || n < 1 || n === Infinity) {
    throw new Error('`' + n + '` is not a valid argument for n-gram');
  }

  return grams;

  /* Create n-grams from a given value. */
  function grams(value) {
    var nGrams = [];
    var index;

    if (value === null || value === undefined) {
      return nGrams;
    }

    value = String(value);
    index = value.length - n + 1;

    if (index < 1) {
      return nGrams;
    }

    while (index--) {
      nGrams[index] = value.substr(index, n);
    }

    return nGrams;
  }
}

},{}],8:[function(require,module,exports){
'use strict';

module.exports = stemmer;

/* Character code for `y`. */
var CC_Y = 'y'.charCodeAt(0);

/* Standard suffix manipulations. */

var step2list = {
  ational: 'ate',
  tional: 'tion',
  enci: 'ence',
  anci: 'ance',
  izer: 'ize',
  bli: 'ble',
  alli: 'al',
  entli: 'ent',
  eli: 'e',
  ousli: 'ous',
  ization: 'ize',
  ation: 'ate',
  ator: 'ate',
  alism: 'al',
  iveness: 'ive',
  fulness: 'ful',
  ousness: 'ous',
  aliti: 'al',
  iviti: 'ive',
  biliti: 'ble',
  logi: 'log'
};

var step3list = {
  icate: 'ic',
  ative: '',
  alize: 'al',
  iciti: 'ic',
  ical: 'ic',
  ful: '',
  ness: ''
};

/* Consonant-vowel sequences. */

var consonant = '[^aeiou]';
var vowel = '[aeiouy]';
var consonantSequence = '(' + consonant + '[^aeiouy]*)';
var vowelSequence = '(' + vowel + '[aeiou]*)';

var MEASURE_GT_0 = new RegExp(
  '^' + consonantSequence + '?' + vowelSequence + consonantSequence
);

var MEASURE_EQ_1 = new RegExp(
  '^' + consonantSequence + '?' + vowelSequence + consonantSequence +
  vowelSequence + '?$'
);

var MEASURE_GT_1 = new RegExp(
  '^' + consonantSequence + '?' +
  '(' + vowelSequence + consonantSequence + '){2,}'
);

var VOWEL_IN_STEM = new RegExp(
  '^' + consonantSequence + '?' + vowel
);

var CONSONANT_LIKE = new RegExp(
  '^' + consonantSequence + vowel + '[^aeiouwxy]$'
);

/* Exception expressions. */

var SUFFIX_LL = /ll$/;
var SUFFIX_E = /^(.+?)e$/;
var SUFFIX_Y = /^(.+?)y$/;
var SUFFIX_ION = /^(.+?(s|t))(ion)$/;
var SUFFIX_ED_OR_ING = /^(.+?)(ed|ing)$/;
var SUFFIX_AT_OR_BL_OR_IZ = /(at|bl|iz)$/;
var SUFFIX_EED = /^(.+?)eed$/;
var SUFFIX_S = /^.+?[^s]s$/;
var SUFFIX_SSES_OR_IES = /^.+?(ss|i)es$/;
var SUFFIX_MULTI_CONSONANT_LIKE = /([^aeiouylsz])\1$/;
var STEP_2 = new RegExp(
  '^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|' +
  'ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|' +
  'biliti|logi)$'
);
var STEP_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
var STEP_4 = new RegExp(
  '^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|' +
  'iti|ous|ive|ize)$'
);

/* Stem `value`. */
function stemmer(value) {
  var firstCharacterWasLowerCaseY;
  var match;

  value = String(value).toLowerCase();

  /* Exit early. */
  if (value.length < 3) {
    return value;
  }

  /* Detect initial `y`, make sure it never
   * matches. */
  if (value.charCodeAt(0) === CC_Y) {
    firstCharacterWasLowerCaseY = true;
    value = 'Y' + value.substr(1);
  }

  /* Step 1a. */
  if (SUFFIX_SSES_OR_IES.test(value)) {
    /* Remove last two characters. */
    value = value.substr(0, value.length - 2);
  } else if (SUFFIX_S.test(value)) {
    /* Remove last character. */
    value = value.substr(0, value.length - 1);
  }

  /* Step 1b. */
  if (match = SUFFIX_EED.exec(value)) {
    if (MEASURE_GT_0.test(match[1])) {
      /* Remove last character. */
      value = value.substr(0, value.length - 1);
    }
  } else if (
    (match = SUFFIX_ED_OR_ING.exec(value)) &&
    VOWEL_IN_STEM.test(match[1])
  ) {
    value = match[1];

    if (SUFFIX_AT_OR_BL_OR_IZ.test(value)) {
      /* Append `e`. */
      value += 'e';
    } else if (
      SUFFIX_MULTI_CONSONANT_LIKE.test(value)
    ) {
      /* Remove last character. */
      value = value.substr(0, value.length - 1);
    } else if (CONSONANT_LIKE.test(value)) {
      /* Append `e`. */
      value += 'e';
    }
  }

  /* Step 1c. */
  if ((match = SUFFIX_Y.exec(value)) && VOWEL_IN_STEM.test(match[1])) {
    /* Remove suffixing `y` and append `i`. */
    value = match[1] + 'i';
  }

  /* Step 2. */
  if ((match = STEP_2.exec(value)) && MEASURE_GT_0.test(match[1])) {
    value = match[1] + step2list[match[2]];
  }

  /* Step 3. */
  if ((match = STEP_3.exec(value)) && MEASURE_GT_0.test(match[1])) {
    value = match[1] + step3list[match[2]];
  }

  /* Step 4. */
  if (match = STEP_4.exec(value)) {
    if (MEASURE_GT_1.test(match[1])) {
      value = match[1];
    }
  } else if ((match = SUFFIX_ION.exec(value)) && MEASURE_GT_1.test(match[1])) {
    value = match[1];
  }

  /* Step 5. */
  if (
    (match = SUFFIX_E.exec(value)) &&
    (
      MEASURE_GT_1.test(match[1]) ||
      (MEASURE_EQ_1.test(match[1]) && !CONSONANT_LIKE.test(match[1]))
    )
  ) {
    value = match[1];
  }

  if (SUFFIX_LL.test(value) && MEASURE_GT_1.test(value)) {
    value = value.substr(0, value.length - 1);
  }

  /* Turn initial `Y` back to `y`. */
  if (firstCharacterWasLowerCaseY) {
    value = 'y' + value.substr(1);
  }

  return value;
}

},{}],9:[function(require,module,exports){
'use strict';

var trigram = require('n-gram').trigram;
var collapse = require('collapse-white-space');
var trim = require('trim');

var has = {}.hasOwnProperty;

exports.clean = clean;
exports.trigrams = getCleanTrigrams;
exports.asDictionary = getCleanTrigramsAsDictionary;
exports.asTuples = getCleanTrigramsAsTuples;
exports.tuplesAsDictionary = getCleanTrigramTuplesAsDictionary;

/* Clean `value`
 * Removed general non-important (as in, for language detection) punctuation
 * marks, symbols, and numbers. */
function clean(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return trim(collapse(String(value).replace(/[\u0021-\u0040]+/g, ' '))).toLowerCase();
}

/* Get clean, padded, trigrams. */
function getCleanTrigrams(value) {
  return trigram(' ' + clean(value) + ' ');
}

/* Get an `Object` with trigrams as its attributes, and
 * their occurence count as their values. */
function getCleanTrigramsAsDictionary(value) {
  var trigrams = getCleanTrigrams(value);
  var index = trigrams.length;
  var dictionary = {};
  var trigram;

  while (index--) {
    trigram = trigrams[index];

    if (has.call(dictionary, trigram)) {
      dictionary[trigram]++;
    } else {
      dictionary[trigram] = 1;
    }
  }

  return dictionary;
}

/* Get an `Array` containing trigram--count tuples from a
 * given value. */
function getCleanTrigramsAsTuples(value) {
  var dictionary = getCleanTrigramsAsDictionary(value);
  var tuples = [];
  var trigram;

  for (trigram in dictionary) {
    tuples.push([trigram, dictionary[trigram]]);
  }

  tuples.sort(sort);

  return tuples;
}

/* Get an `Array` containing trigram--count tuples from a
 * given value. */
function getCleanTrigramTuplesAsDictionary(tuples) {
  var index = tuples.length;
  var dictionary = {};
  var tuple;

  while (index--) {
    tuple = tuples[index];
    dictionary[tuple[0]] = tuple[1];
  }

  return dictionary;
}

/* Deep regular sort on item at `1` in both `Object`s. */
function sort(a, b) {
  return a[1] - b[1];
}

},{"collapse-white-space":3,"n-gram":7,"trim":10}],10:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],11:[function(require,module,exports){
const LANG = {
  DE: 'de', // German
  EN: 'en', // English
  ES: 'es', // Spanish
  FR: 'fr', // French
  IT: 'it', // Italian
  PT: 'pt', // Portuguese
  RU: 'ru', // Russian
  TR: 'tr'  // Turkish
};

// franc (библиотека, что определяет язык) использует ISO 639-2 вместо ISO 639-1, которым пользуется Юникод, поэтому нам нужен преобразователь
LANG.FRANC = {
  'deu': LANG.DE,
  'eng': LANG.EN,
  'spa': LANG.ES,
  'fra': LANG.FR,
  'ita': LANG.IT,
  'por': LANG.PT,
  'rus': LANG.RU,
  'tur': LANG.TR
};

module.exports = LANG;
},{}],12:[function(require,module,exports){
var Az = require('az');

// чиним загрузку словарей Az (токенизатор и стеммер для русского)
Az.load = function(url, responseType, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = responseType;

  xhr.onload = function (e) {
    if (xhr.response) {
      callback && callback(null, xhr.response);
    }
  };

  xhr.send(null);
}

module.exports = Az
},{"az":1}],13:[function(require,module,exports){
var Az = require('./az'),
    stemmer = require('stemmer'),
    LANG = require('../lang');

module.exports = function(word, lang) {
  switch (lang) {
    case LANG.RU:
      word = Az.Morph(word)[0];

      if (word) { // случается, что предсказыватель ничего не предсказывает
        // приводим в начальную форму только существительные, глаголы и прилагательные
        if (word.tag.POS === 'NOUN' ||
            // word.tag.POS === 'ADVB' || // наречие
            word.tag.POS === 'INFN' ||
            word.tag.POS === 'ADJF') {
          word = word.normalize().word;
        } else {
          word = null;
        }
      }

      break;
    case LANG.EN:
      if (word !== 'on' && word !== 'a' && word !== 'it' && word !== 'is') {
        word = stemmer(word);
      } else {
        word = null;
      }

      break;
  }

  return word;
}
},{"../lang":11,"./az":12,"stemmer":8}],14:[function(require,module,exports){
var Az = require('./az');

module.exports = function(text) {
  return Az.Tokens(text).done();
}
},{"./az":12}],15:[function(require,module,exports){
var Az = require('./az')
    franc = require('franc-min'),
    LANG = require('../lang'),
    tokenization = require('./tokenization'),
    normalizeWord = require('./normalizeWord'),
    wordToEmoji = require('./wordToEmoji'),
    languageDetectOptions = { whitelist: Object.keys(LANG.FRANC), minLength: 2 };

module.exports = function(text) {
  var tokens = tokenization(text),
      word,
      lang;

  for (let a = 0; a < tokens.length; a++) {
    if (tokens[a].type === Az.Tokens.WORD) {
      word = tokens[a].toString();
      lang = LANG.FRANC[franc(word, languageDetectOptions)];

      if (lang) {
        word = normalizeWord(word, lang);

        if (word) {
          let emoji = wordToEmoji(word, lang);

          if (emoji) {
            tokens[a] += ' ' + emoji;
          }
        }
      }
    }
  }

  return tokens.join('');
}
},{"../lang":11,"./az":12,"./normalizeWord":13,"./tokenization":14,"./wordToEmoji":16,"franc-min":6}],16:[function(require,module,exports){
var random = require('../utils/random'),
    LANG = require('../lang');

module.exports = function(word, lang) {
  if (lang !== LANG.DE) { // в немецком все существительные пишутся с большой буквы
    word = word.toLowerCase();    
  }

  if (emojies[lang]['names'][word]) {
    return emojies[lang]['names'][word];
  }

  if (emojies[lang]['keywords'][word]) {
    let keywords = emojies[lang]['keywords'][word];

    return keywords[random(keywords.length)];
  }
}
},{"../lang":11,"../utils/random":17}],17:[function(require,module,exports){
module.exports = function(max) {
  return Math.floor(Math.random() * max);
}
},{}],18:[function(require,module,exports){
var Az = require('./translator/az'),
    translateText = require('./translator/translateText'),
    isInit = false;

importScripts('emojies.js'); // now we've got global emojies object

Az.Morph.init('../dicts/ru', function() {
  isInit = true;
});

onmessage = function(e) {
  if (isInit) {
    postMessage(translateText(e.data));    
  }
}
},{"./translator/az":12,"./translator/translateText":15}]},{},[18]);
