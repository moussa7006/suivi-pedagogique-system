import {
  DomSanitizer
} from "./chunk-ONKPIA4P.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-K27GQWIT.js";
import {
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  EventEmitter,
  Input,
  NgClass,
  Output,
  Renderer2,
  ViewChild,
  __commonJS,
  __toESM,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-CJ6OLCZO.js";

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    "use strict";
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    "use strict";
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    "use strict";
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    "use strict";
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    "use strict";
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    "use strict";
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    "use strict";
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    "use strict";
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    "use strict";
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    "use strict";
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    "use strict";
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    "use strict";
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    "use strict";
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString2(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    "use strict";
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    "use strict";
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    "use strict";
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    "use strict";
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    "use strict";
    var canPromise = require_can_promise();
    var QRCode = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// node_modules/angularx-qrcode/fesm2022/angularx-qrcode.mjs
var import_qrcode = __toESM(require_browser(), 1);
var _c0 = ["qrcElement"];
var QRCodeComponent = class _QRCodeComponent {
  allowEmptyString = false;
  colorDark = "#000000ff";
  colorLight = "#ffffffff";
  cssClass = "qrcode";
  elementType = "canvas";
  errorCorrectionLevel = "M";
  imageSrc;
  imageHeight;
  imageWidth;
  margin = 4;
  qrdata = "";
  scale = 4;
  version;
  width = 10;
  // Accessibility features introduced in 13.0.4+
  alt;
  ariaLabel;
  title;
  qrCodeURL = new EventEmitter();
  qrcElement;
  context = null;
  centerImage;
  renderer = inject(Renderer2);
  sanitizer = inject(DomSanitizer);
  async ngOnChanges() {
    await this.createQRCode();
  }
  isValidQrCodeText(data) {
    if (this.allowEmptyString === false) {
      return !(typeof data === "undefined" || data === "" || data === "null" || data === null);
    }
    return !(typeof data === "undefined");
  }
  toDataURL(qrCodeConfig) {
    return new Promise((resolve, reject) => {
      (0, import_qrcode.toDataURL)(this.qrdata, qrCodeConfig, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
  toCanvas(canvas, qrCodeConfig) {
    return new Promise((resolve, reject) => {
      (0, import_qrcode.toCanvas)(canvas, this.qrdata, qrCodeConfig, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve("success");
        }
      });
    });
  }
  toSVG(qrCodeConfig) {
    return new Promise((resolve, reject) => {
      (0, import_qrcode.toString)(this.qrdata, qrCodeConfig, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
  renderElement(element) {
    for (const node of this.qrcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement.nativeElement, node);
    }
    this.renderer.appendChild(this.qrcElement.nativeElement, element);
  }
  async createQRCode() {
    if (this.version && this.version > 40) {
      console.warn("[angularx-qrcode] max value for `version` is 40");
      this.version = 40;
    } else if (this.version && this.version < 1) {
      console.warn("[angularx-qrcode]`min value for `version` is 1");
      this.version = 1;
    } else if (this.version !== void 0 && isNaN(this.version)) {
      console.warn("[angularx-qrcode] version should be a number, defaulting to auto.");
      this.version = void 0;
    }
    try {
      if (!this.isValidQrCodeText(this.qrdata)) {
        throw new Error("[angularx-qrcode] Field `qrdata` is empty, set 'allowEmptyString=\"true\"' to overwrite this behaviour.");
      }
      if (this.isValidQrCodeText(this.qrdata) && this.qrdata === "") {
        this.qrdata = " ";
      }
      const config = {
        color: {
          dark: this.colorDark,
          light: this.colorLight
        },
        errorCorrectionLevel: this.errorCorrectionLevel,
        margin: this.margin,
        scale: this.scale,
        version: this.version,
        width: this.width
      };
      const centerImageSrc = this.imageSrc;
      const centerImageHeight = this.imageHeight ? +this.imageHeight : 40;
      const centerImageWidth = this.imageWidth ? +this.imageWidth : 40;
      switch (this.elementType) {
        case "canvas": {
          const canvasElement = this.renderer.createElement("canvas");
          this.context = canvasElement.getContext("2d");
          this.toCanvas(canvasElement, config).then(() => {
            if (this.ariaLabel) {
              this.renderer.setAttribute(canvasElement, "aria-label", `${this.ariaLabel}`);
            }
            if (this.title) {
              this.renderer.setAttribute(canvasElement, "title", `${this.title}`);
            }
            if (centerImageSrc && this.context) {
              this.centerImage = new Image(centerImageWidth, centerImageHeight);
              if (centerImageSrc !== this.centerImage.src) {
                this.centerImage.crossOrigin = "anonymous";
                this.centerImage.src = centerImageSrc;
              }
              if (centerImageHeight !== this.centerImage.height) {
                this.centerImage.height = centerImageHeight;
              }
              if (centerImageWidth !== this.centerImage.width) {
                this.centerImage.width = centerImageWidth;
              }
              const centerImage = this.centerImage;
              if (centerImage) {
                centerImage.onload = () => {
                  this.context?.drawImage(centerImage, canvasElement.width / 2 - centerImageWidth / 2, canvasElement.height / 2 - centerImageHeight / 2, centerImageWidth, centerImageHeight);
                };
              }
            }
            this.renderElement(canvasElement);
            this.emitQRCodeURL(canvasElement);
          }).catch((e) => {
            console.error("[angularx-qrcode] canvas error:", e);
          });
          break;
        }
        case "svg": {
          const svgParentElement = this.renderer.createElement("div");
          this.toSVG(config).then((svgString) => {
            this.renderer.setProperty(svgParentElement, "innerHTML", svgString);
            const svgElement = svgParentElement.firstChild;
            this.renderer.setAttribute(svgElement, "height", `${this.width}`);
            this.renderer.setAttribute(svgElement, "width", `${this.width}`);
            this.renderElement(svgElement);
            this.emitQRCodeURL(svgElement);
          }).catch((e) => {
            console.error("[angularx-qrcode] svg error:", e);
          });
          break;
        }
        case "url":
        case "img":
        default: {
          const imgElement = this.renderer.createElement("img");
          this.toDataURL(config).then((dataUrl) => {
            if (this.alt) {
              imgElement.setAttribute("alt", this.alt);
            }
            if (this.ariaLabel) {
              imgElement.setAttribute("aria-label", this.ariaLabel);
            }
            imgElement.setAttribute("src", dataUrl);
            if (this.title) {
              imgElement.setAttribute("title", this.title);
            }
            this.renderElement(imgElement);
            this.emitQRCodeURL(imgElement);
          }).catch((e) => {
            console.error("[angularx-qrcode] img/url error:", e);
          });
        }
      }
    } catch (e) {
      console.error("[angularx-qrcode] Error generating QR Code:", e.message);
    }
  }
  convertBase64ImageUrlToBlob(base64ImageUrl) {
    const parts = base64ImageUrl.split(";base64,");
    const imageType = parts[0].split(":")[1];
    const decodedData = atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
      type: imageType
    });
  }
  emitQRCodeURL(element) {
    const className = element.constructor.name;
    if (className === SVGSVGElement.name) {
      const svgHTML = element.outerHTML;
      const blob = new Blob([svgHTML], {
        type: "image/svg+xml"
      });
      const urlSvg = URL.createObjectURL(blob);
      const urlSanitized2 = this.sanitizer.bypassSecurityTrustUrl(urlSvg);
      this.qrCodeURL.emit(urlSanitized2);
      return;
    }
    let urlImage = "";
    if (className === HTMLCanvasElement.name) {
      urlImage = element.toDataURL("image/png");
    }
    if (className === HTMLImageElement.name) {
      urlImage = element.src;
    }
    const blobData = this.convertBase64ImageUrlToBlob(urlImage);
    const urlBlob = URL.createObjectURL(blobData);
    const urlSanitized = this.sanitizer.bypassSecurityTrustUrl(urlBlob);
    this.qrCodeURL.emit(urlSanitized);
  }
  static \u0275fac = function QRCodeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _QRCodeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _QRCodeComponent,
    selectors: [["qrcode"]],
    viewQuery: function QRCodeComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.qrcElement = _t.first);
      }
    },
    inputs: {
      allowEmptyString: "allowEmptyString",
      colorDark: "colorDark",
      colorLight: "colorLight",
      cssClass: "cssClass",
      elementType: "elementType",
      errorCorrectionLevel: "errorCorrectionLevel",
      imageSrc: "imageSrc",
      imageHeight: "imageHeight",
      imageWidth: "imageWidth",
      margin: "margin",
      qrdata: "qrdata",
      scale: "scale",
      version: "version",
      width: "width",
      alt: "alt",
      ariaLabel: "ariaLabel",
      title: "title"
    },
    outputs: {
      qrCodeURL: "qrCodeURL"
    },
    features: [\u0275\u0275NgOnChangesFeature],
    decls: 2,
    vars: 2,
    consts: [["qrcElement", ""]],
    template: function QRCodeComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275domElement(0, "div", null, 0);
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.cssClass);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QRCodeComponent, [{
    type: Component,
    args: [{
      // eslint-disable-next-line @angular-eslint/component-selector
      selector: "qrcode",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<div #qrcElement [class]="cssClass"></div>`
    }]
  }], null, {
    allowEmptyString: [{
      type: Input
    }],
    colorDark: [{
      type: Input
    }],
    colorLight: [{
      type: Input
    }],
    cssClass: [{
      type: Input
    }],
    elementType: [{
      type: Input
    }],
    errorCorrectionLevel: [{
      type: Input
    }],
    imageSrc: [{
      type: Input
    }],
    imageHeight: [{
      type: Input
    }],
    imageWidth: [{
      type: Input
    }],
    margin: [{
      type: Input
    }],
    qrdata: [{
      type: Input
    }],
    scale: [{
      type: Input
    }],
    version: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    alt: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    qrCodeURL: [{
      type: Output
    }],
    qrcElement: [{
      type: ViewChild,
      args: ["qrcElement", {
        static: true
      }]
    }]
  });
})();

// src/app/features/qr-generator/qr-generator.component.ts
var _c02 = (a0) => ({ active: a0 });
function QrGeneratorComponent_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 50);
    \u0275\u0275element(2, "circle", 51)(3, "circle", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "span", 53);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 54);
    \u0275\u0275element(7, "qrcode", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 56);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("stroke-dashoffset", ctx_r0.dashOffset);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.timeLeft, "s");
    \u0275\u0275advance(2);
    \u0275\u0275property("qrdata", ctx_r0.qrData)("width", 280)("errorCorrectionLevel", "M");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" S\xE9ance: ", ctx_r0.selectedSubject, " \u2022 Aujourd'hui \u2022 ", ctx_r0.selectedTimeSlot, " ");
  }
}
function QrGeneratorComponent_Conditional_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "div", 57);
    \u0275\u0275element(2, "i", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 59);
    \u0275\u0275text(4, "D\xE9marrez la session pour g\xE9n\xE9rer le QR Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 60);
    \u0275\u0275text(6, "Le code sera actualis\xE9 automatiquement");
    \u0275\u0275elementEnd()();
  }
}
var QrGeneratorComponent = class _QrGeneratorComponent {
  qrData = "";
  isRunning = false;
  timeLeft = 30;
  refreshInterval = 30;
  selectedSubject = "Algorithmique";
  selectedTimeSlot = "08:00 - 10:00";
  timer;
  dashOffset = 0;
  todayLogs = [
    { id: 1, type: "success" },
    { id: 2, type: "success" },
    { id: 3, type: "blocked" }
  ];
  get todayDate() {
    return (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.stopSession();
  }
  toggleSession() {
    if (this.isRunning) {
      this.stopSession();
    } else {
      this.startSession();
    }
  }
  startSession() {
    this.isRunning = true;
    this.generateNewCode();
    this.startTimer();
  }
  stopSession() {
    this.isRunning = false;
    if (this.timer)
      clearInterval(this.timer);
    this.timeLeft = this.refreshInterval;
    this.dashOffset = 0;
  }
  startTimer() {
    this.timeLeft = this.refreshInterval;
    if (this.timer)
      clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.dashOffset = 283 - this.timeLeft / this.refreshInterval * 283;
      if (this.timeLeft <= 0) {
        this.generateNewCode();
        this.timeLeft = this.refreshInterval;
      }
    }, 1e3);
  }
  generateNewCode() {
    const timestamp = Date.now();
    const randomSalt = Math.random().toString(36).substring(7);
    this.qrData = `SEANCE-${this.selectedSubject.substring(0, 3).toUpperCase()}-${this.selectedTimeSlot.split(" - ")[0].replace(":", "")}-${timestamp}-${randomSalt}`;
  }
  static \u0275fac = function QrGeneratorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _QrGeneratorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _QrGeneratorComponent, selectors: [["app-qr-generator"]], decls: 103, vars: 15, consts: [[1, "qr-container"], [1, "page-header"], [1, "grid-layout"], [1, "card", "settings-card"], [1, "pi", "pi-cog"], [1, "form-group"], ["for", "subject"], [1, "pi", "pi-book"], ["id", "subject", 3, "ngModelChange", "ngModel"], ["value", "Algorithmique"], ["value", "Java"], ["value", "Bases de donn\xE9es"], ["value", "Math\xE9matiques"], ["value", "Physique"], ["for", "teacher"], [1, "pi", "pi-user"], ["id", "teacher", "type", "text", "disabled", "", "value", "Dr. Alou Diarra"], ["for", "date"], [1, "pi", "pi-calendar"], ["id", "date", "type", "text", "disabled", "", 3, "value"], ["for", "timeSlot"], [1, "pi", "pi-clock"], ["id", "timeSlot", 3, "ngModelChange", "ngModel"], ["value", "08:00 - 10:00"], ["value", "10:00 - 12:00"], ["value", "14:00 - 16:00"], ["value", "16:00 - 18:00"], ["for", "duration"], ["id", "duration", "type", "number", "min", "10", "max", "300", 3, "ngModelChange", "ngModel"], [1, "session-status", 3, "ngClass"], [1, "status-dot"], [1, "btn", 3, "click", "ngClass"], [1, "pi", 3, "ngClass"], [1, "card", "qr-display-card"], [1, "qr-wrapper"], [1, "placeholder"], [1, "card", "logs-card"], [1, "logs-header"], [1, "pi", "pi-history"], [1, "log-count"], [1, "log-list"], [1, "log-item", "success"], [1, "log-icon"], [1, "pi", "pi-check-circle"], [1, "log-content"], [1, "log-message"], [1, "log-time"], [1, "log-item", "blocked"], [1, "pi", "pi-times-circle"], [1, "timer-ring"], ["viewBox", "0 0 100 100"], ["cx", "50", "cy", "50", "r", "45", 1, "bg-ring"], ["cx", "50", "cy", "50", "r", "45", 1, "progress-ring"], [1, "timer-text"], [1, "qrcode-box"], [3, "qrdata", "width", "errorCorrectionLevel"], [1, "qr-payload"], [1, "placeholder-icon"], [1, "pi", "pi-shield"], [1, "placeholder-text"], [1, "placeholder-sub"]], template: function QrGeneratorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1");
      \u0275\u0275text(3, "G\xE9n\xE9rer la S\xE9ance du Jour");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p");
      \u0275\u0275text(5, "Cr\xE9ez un QR Code pour la s\xE9ance d'aujourd'hui et suivez les \xE9margements en temps r\xE9el");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 2)(7, "div", 3)(8, "h3");
      \u0275\u0275element(9, "i", 4);
      \u0275\u0275text(10, " D\xE9tails de la S\xE9ance");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 5)(12, "label", 6);
      \u0275\u0275element(13, "i", 7);
      \u0275\u0275text(14, " Mati\xE8re");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "select", 8);
      \u0275\u0275twoWayListener("ngModelChange", function QrGeneratorComponent_Template_select_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedSubject, $event) || (ctx.selectedSubject = $event);
        return $event;
      });
      \u0275\u0275elementStart(16, "option", 9);
      \u0275\u0275text(17, "Algorithmique - Amphi 500");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "option", 10);
      \u0275\u0275text(19, "Programmation Java - Salle 12");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "option", 11);
      \u0275\u0275text(21, "Bases de donn\xE9es - Amphi A");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "option", 12);
      \u0275\u0275text(23, "Math\xE9matiques - Salle 8");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "option", 13);
      \u0275\u0275text(25, "Physique - Labo 1");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(26, "div", 5)(27, "label", 14);
      \u0275\u0275element(28, "i", 15);
      \u0275\u0275text(29, " Enseignant");
      \u0275\u0275elementEnd();
      \u0275\u0275element(30, "input", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "div", 5)(32, "label", 17);
      \u0275\u0275element(33, "i", 18);
      \u0275\u0275text(34, " Date");
      \u0275\u0275elementEnd();
      \u0275\u0275element(35, "input", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "div", 5)(37, "label", 20);
      \u0275\u0275element(38, "i", 21);
      \u0275\u0275text(39, " Heure");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "select", 22);
      \u0275\u0275twoWayListener("ngModelChange", function QrGeneratorComponent_Template_select_ngModelChange_40_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedTimeSlot, $event) || (ctx.selectedTimeSlot = $event);
        return $event;
      });
      \u0275\u0275elementStart(41, "option", 23);
      \u0275\u0275text(42, "08:00 - 10:00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "option", 24);
      \u0275\u0275text(44, "10:00 - 12:00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "option", 25);
      \u0275\u0275text(46, "14:00 - 16:00");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "option", 26);
      \u0275\u0275text(48, "16:00 - 18:00");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(49, "div", 5)(50, "label", 27);
      \u0275\u0275element(51, "i", 21);
      \u0275\u0275text(52, " Dur\xE9e de validit\xE9 (secondes)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "input", 28);
      \u0275\u0275twoWayListener("ngModelChange", function QrGeneratorComponent_Template_input_ngModelChange_53_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.refreshInterval, $event) || (ctx.refreshInterval = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(54, "div", 29);
      \u0275\u0275element(55, "div", 30);
      \u0275\u0275elementStart(56, "span");
      \u0275\u0275text(57);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "button", 31);
      \u0275\u0275listener("click", function QrGeneratorComponent_Template_button_click_58_listener() {
        return ctx.toggleSession();
      });
      \u0275\u0275element(59, "i", 32);
      \u0275\u0275text(60);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(61, "div", 33)(62, "div", 34);
      \u0275\u0275conditionalCreate(63, QrGeneratorComponent_Conditional_63_Template, 10, 8)(64, QrGeneratorComponent_Conditional_64_Template, 7, 0, "div", 35);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(65, "div", 36)(66, "div", 37)(67, "h3");
      \u0275\u0275element(68, "i", 38);
      \u0275\u0275text(69, " Derniers scans d'\xE9margement");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "span", 39);
      \u0275\u0275text(71);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(72, "div", 40)(73, "div", 41)(74, "div", 42);
      \u0275\u0275element(75, "i", 43);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "div", 44)(77, "span", 45)(78, "strong");
      \u0275\u0275text(79, "Dr. Alou Diarra");
      \u0275\u0275elementEnd();
      \u0275\u0275text(80, " a \xE9marg\xE9 avec succ\xE8s (Cahier de textes valid\xE9 automatiquement)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(81, "span", 46);
      \u0275\u0275text(82, "08:15");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(83, "div", 41)(84, "div", 42);
      \u0275\u0275element(85, "i", 43);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(86, "div", 44)(87, "span", 45)(88, "strong");
      \u0275\u0275text(89, "K. Barry");
      \u0275\u0275elementEnd();
      \u0275\u0275text(90, " a scann\xE9 le QR Code (Cahier de textes d\xE9j\xE0 rempli)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(91, "span", 46);
      \u0275\u0275text(92, "08:12");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(93, "div", 47)(94, "div", 42);
      \u0275\u0275element(95, "i", 48);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(96, "div", 44)(97, "span", 45)(98, "strong");
      \u0275\u0275text(99, "F. Coulibaly");
      \u0275\u0275elementEnd();
      \u0275\u0275text(100, " \u2014 Scan refus\xE9 : cahier de textes non rempli");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(101, "span", 46);
      \u0275\u0275text(102, "08:10");
      \u0275\u0275elementEnd()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(15);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedSubject);
      \u0275\u0275advance(20);
      \u0275\u0275property("value", ctx.todayDate);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedTimeSlot);
      \u0275\u0275advance(13);
      \u0275\u0275twoWayProperty("ngModel", ctx.refreshInterval);
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(13, _c02, ctx.isRunning));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.isRunning ? "S\xE9ance en cours..." : "S\xE9ance en attente");
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", ctx.isRunning ? "btn-danger" : "btn-primary");
      \u0275\u0275advance();
      \u0275\u0275property("ngClass", ctx.isRunning ? "pi-stop-circle" : "pi-play-circle");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.isRunning ? "Terminer la s\xE9ance" : "Lancer la s\xE9ance", " ");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("blurred", !ctx.isRunning);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isRunning ? 63 : 64);
      \u0275\u0275advance(8);
      \u0275\u0275textInterpolate1("", ctx.todayLogs.length, " \xE9v\xE9nements");
    }
  }, dependencies: [CommonModule, NgClass, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, QRCodeComponent], styles: [`

.qr-container[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  padding: clamp(12px, 3vw, 24px);
  gap: clamp(12px, 3vw, 24px);
  max-width: 100%;
}
@media (max-width: 480px) {
  .qr-container[_ngcontent-%COMP%] {
    gap: 14px;
    padding: 12px 8px;
  }
}
.page-header[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-wrap: wrap;
}
.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
  margin: 0;
  font-size: clamp(1.1rem, 3vw, 1.6rem);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}
@media (max-width: 480px) {
  .page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 1.3rem;
  }
}
.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  margin: 0;
  color: #64748b;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  font-weight: 500;
}
.grid-layout[_ngcontent-%COMP%] {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 768px) {
  .grid-layout[_ngcontent-%COMP%] {
    grid-template-columns: 1fr;
  }
}
.card[_ngcontent-%COMP%] {
  background: white;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 14px;
  padding: 20px;
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}
.card[_ngcontent-%COMP%]:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}
.settings-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  margin: 0 0 20px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
}
.settings-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  color: var(--primary-color);
  font-size: 1.1rem;
}
.form-group[_ngcontent-%COMP%] {
  margin-bottom: 18px;
}
.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}
.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  color: #94a3b8;
  font-size: 0.85rem;
}
.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], 
.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  background: white;
  font-size: 0.9rem;
  color: #0f172a;
  transition: all 0.2s ease;
}
.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, 
.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:disabled, 
.form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(241, 245, 249, 0.8);
}
.form-group[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}
.session-status[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(241, 245, 249, 0.6);
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s ease;
}
.session-status[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
}
.session-status.active[_ngcontent-%COMP%] {
  background: rgba(220, 252, 231, 0.8);
  color: #166534;
  border: 1px solid rgba(187, 240, 208, 0.5);
}
.session-status.active[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {
  background: #22c55e;
  animation: _ngcontent-%COMP%_pulse 1.5s infinite;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
}
@keyframes _ngcontent-%COMP%_pulse {
  0% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.15);
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
.btn[_ngcontent-%COMP%] {
  width: 100%;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}
.btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  font-size: 1.05rem;
}
.btn.btn-primary[_ngcontent-%COMP%] {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.btn.btn-primary[_ngcontent-%COMP%]:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
}
.btn.btn-primary[_ngcontent-%COMP%]:active {
  transform: translateY(0) scale(1);
}
.btn.btn-danger[_ngcontent-%COMP%] {
  background: #ef4444;
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}
.btn.btn-danger[_ngcontent-%COMP%]:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
}
.qr-display-card[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 480px;
}
.qr-wrapper[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  transition: all 0.4s ease;
  width: 100%;
  max-width: 380px;
}
.qr-wrapper.blurred[_ngcontent-%COMP%] {
  filter: grayscale(0.7) opacity(0.5);
}
.qrcode-box[_ngcontent-%COMP%] {
  padding: 20px;
  border-radius: 14px;
  border: 2px dashed rgba(226, 232, 240, 0.9);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.session-active[_ngcontent-%COMP%]   .qrcode-box[_ngcontent-%COMP%] {
  border: 2px solid rgba(37, 99, 235, 0.3);
  background: white;
}
.qr-payload[_ngcontent-%COMP%] {
  font-family:
    "SF Mono",
    "Fira Code",
    monospace;
  color: #94a3b8;
  font-size: 0.78rem;
  background: rgba(241, 245, 249, 0.6);
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(226, 232, 240, 0.5);
  letter-spacing: 0.02em;
}
.placeholder[_ngcontent-%COMP%] {
  text-align: center;
  padding: 48px 32px;
}
.placeholder[_ngcontent-%COMP%]   .placeholder-icon[_ngcontent-%COMP%] {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 14px;
  border: 2px dashed rgba(226, 232, 240, 0.9);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder[_ngcontent-%COMP%]   .placeholder-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  font-size: 2.2rem;
  color: rgba(37, 99, 235, 0.45);
}
.placeholder[_ngcontent-%COMP%]   .placeholder-text[_ngcontent-%COMP%] {
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
  margin: 0 0 6px;
}
.placeholder[_ngcontent-%COMP%]   .placeholder-sub[_ngcontent-%COMP%] {
  font-size: 0.82rem;
  color: #94a3b8;
  font-weight: 500;
  margin: 0;
}
.timer-ring[_ngcontent-%COMP%] {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
}
.timer-ring[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}
.timer-ring[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
}
.timer-ring[_ngcontent-%COMP%]   .bg-ring[_ngcontent-%COMP%] {
  stroke: rgba(241, 245, 249, 0.7);
}
.timer-ring[_ngcontent-%COMP%]   .progress-ring[_ngcontent-%COMP%] {
  stroke: var(--primary-color);
  stroke-dasharray: 283;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 2px 3px rgba(37, 99, 235, 0.25));
}
.timer-ring[_ngcontent-%COMP%]   .timer-text[_ngcontent-%COMP%] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--primary-color);
  background: white;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.logs-card[_ngcontent-%COMP%] {
  padding: 20px;
}
.logs-card[_ngcontent-%COMP%]   .logs-header[_ngcontent-%COMP%] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.logs-card[_ngcontent-%COMP%]   .logs-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logs-card[_ngcontent-%COMP%]   .logs-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  color: #64748b;
  font-size: 1.05rem;
}
.logs-card[_ngcontent-%COMP%]   .logs-header[_ngcontent-%COMP%]   .log-count[_ngcontent-%COMP%] {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  background: rgba(241, 245, 249, 0.6);
  padding: 4px 10px;
  border-radius: 999px;
}
.logs-card[_ngcontent-%COMP%]   .log-list[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
}
.logs-card[_ngcontent-%COMP%]   .log-item[_ngcontent-%COMP%] {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  background: rgba(248, 250, 252, 0.5);
  border: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.logs-card[_ngcontent-%COMP%]   .log-item[_ngcontent-%COMP%]:hover {
  background: rgba(37, 99, 235, 0.03);
  border-color: rgba(37, 99, 235, 0.08);
}
.logs-card[_ngcontent-%COMP%]   .log-item[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%] {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.5);
}
.logs-card[_ngcontent-%COMP%]   .log-item[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%] {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.logs-card[_ngcontent-%COMP%]   .log-item[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-message[_ngcontent-%COMP%] {
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.35;
}
.logs-card[_ngcontent-%COMP%]   .log-item[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-message[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {
  color: #0f172a;
  font-weight: 600;
}
.logs-card[_ngcontent-%COMP%]   .log-item[_ngcontent-%COMP%]   .log-content[_ngcontent-%COMP%]   .log-time[_ngcontent-%COMP%] {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 600;
}
.logs-card[_ngcontent-%COMP%]   .log-item.success[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%] {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.25);
}
.logs-card[_ngcontent-%COMP%]   .log-item.warning[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%] {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.25);
}
.logs-card[_ngcontent-%COMP%]   .log-item.blocked[_ngcontent-%COMP%] {
  background: rgba(254, 226, 226, 0.6);
}
.logs-card[_ngcontent-%COMP%]   .log-item.blocked[_ngcontent-%COMP%]   .log-icon[_ngcontent-%COMP%] {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.25);
}
@media (max-width: 768px) {
  .grid-layout[_ngcontent-%COMP%] {
    grid-template-columns: 1fr;
  }
  .qr-display-card[_ngcontent-%COMP%] {
    min-height: 400px;
  }
}
/*# sourceMappingURL=qr-generator.component.css.map */`] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QrGeneratorComponent, [{
    type: Component,
    args: [{ selector: "app-qr-generator", standalone: true, imports: [CommonModule, FormsModule, QRCodeComponent], template: `
    <div class="qr-container">
      <div class="page-header">
        <h1>G\xE9n\xE9rer la S\xE9ance du Jour</h1>
        <p>Cr\xE9ez un QR Code pour la s\xE9ance d'aujourd'hui et suivez les \xE9margements en temps r\xE9el</p>
      </div>

      <div class="grid-layout">
        <!-- Section Param\xE8tres -->
        <div class="card settings-card">
          <h3><i class="pi pi-cog"></i> D\xE9tails de la S\xE9ance</h3>

          <div class="form-group">
            <label for="subject"><i class="pi pi-book"></i> Mati\xE8re</label>
            <select id="subject" [(ngModel)]="selectedSubject">
              <option value="Algorithmique">Algorithmique - Amphi 500</option>
              <option value="Java">Programmation Java - Salle 12</option>
              <option value="Bases de donn\xE9es">Bases de donn\xE9es - Amphi A</option>
              <option value="Math\xE9matiques">Math\xE9matiques - Salle 8</option>
              <option value="Physique">Physique - Labo 1</option>
            </select>
          </div>

          <div class="form-group">
            <label for="teacher"><i class="pi pi-user"></i> Enseignant</label>
            <input id="teacher" type="text" disabled value="Dr. Alou Diarra" />
          </div>

          <div class="form-group">
            <label for="date"><i class="pi pi-calendar"></i> Date</label>
            <input id="date" type="text" disabled [value]="todayDate" />
          </div>

          <div class="form-group">
            <label for="timeSlot"><i class="pi pi-clock"></i> Heure</label>
            <select id="timeSlot" [(ngModel)]="selectedTimeSlot">
              <option value="08:00 - 10:00">08:00 - 10:00</option>
              <option value="10:00 - 12:00">10:00 - 12:00</option>
              <option value="14:00 - 16:00">14:00 - 16:00</option>
              <option value="16:00 - 18:00">16:00 - 18:00</option>
            </select>
          </div>

          <div class="form-group">
            <label for="duration"><i class="pi pi-clock"></i> Dur\xE9e de validit\xE9 (secondes)</label>
            <input id="duration" type="number" [(ngModel)]="refreshInterval" min="10" max="300" />
          </div>

          <div class="session-status" [ngClass]="{ active: isRunning }">
            <div class="status-dot"></div>
            <span>{{ isRunning ? 'S\xE9ance en cours...' : 'S\xE9ance en attente' }}</span>
          </div>

          <button
            class="btn"
            [ngClass]="isRunning ? 'btn-danger' : 'btn-primary'"
            (click)="toggleSession()"
          >
            <i class="pi" [ngClass]="isRunning ? 'pi-stop-circle' : 'pi-play-circle'"></i>
            {{ isRunning ? 'Terminer la s\xE9ance' : 'Lancer la s\xE9ance' }}
          </button>
        </div>

        <!-- Section QR Code -->
        <div class="card qr-display-card">
          <div class="qr-wrapper" [class.blurred]="!isRunning">
            @if (isRunning) {
              <div class="timer-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" class="bg-ring"></circle>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    class="progress-ring"
                    [style.stroke-dashoffset]="dashOffset"
                  ></circle>
                </svg>
                <span class="timer-text">{{ timeLeft }}s</span>
              </div>
              <div class="qrcode-box">
                <qrcode [qrdata]="qrData" [width]="280" [errorCorrectionLevel]="'M'"></qrcode>
              </div>
              <p class="qr-payload">
                S\xE9ance: {{ selectedSubject }} \u2022 Aujourd'hui \u2022 {{ selectedTimeSlot }}
              </p>
            } @else {
              <div class="placeholder">
                <div class="placeholder-icon">
                  <i class="pi pi-shield"></i>
                </div>
                <p class="placeholder-text">D\xE9marrez la session pour g\xE9n\xE9rer le QR Code</p>
                <p class="placeholder-sub">Le code sera actualis\xE9 automatiquement</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Logs de session -->
      <div class="card logs-card">
        <div class="logs-header">
          <h3><i class="pi pi-history"></i> Derniers scans d'\xE9margement</h3>
          <span class="log-count">{{ todayLogs.length }} \xE9v\xE9nements</span>
        </div>
        <div class="log-list">
          <div class="log-item success">
            <div class="log-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <div class="log-content">
              <span class="log-message"
                ><strong>Dr. Alou Diarra</strong> a \xE9marg\xE9 avec succ\xE8s (Cahier de textes valid\xE9
                automatiquement)</span
              >
              <span class="log-time">08:15</span>
            </div>
          </div>
          <div class="log-item success">
            <div class="log-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <div class="log-content">
              <span class="log-message"
                ><strong>K. Barry</strong> a scann\xE9 le QR Code (Cahier de textes d\xE9j\xE0 rempli)</span
              >
              <span class="log-time">08:12</span>
            </div>
          </div>
          <div class="log-item blocked">
            <div class="log-icon">
              <i class="pi pi-times-circle"></i>
            </div>
            <div class="log-content">
              <span class="log-message"
                ><strong>F. Coulibaly</strong> \u2014 Scan refus\xE9 : cahier de textes non rempli</span
              >
              <span class="log-time">08:10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `, styles: [`/* angular:styles/component:scss;d0eecfed7be5fe059763a286a34b5abd80aa68839ca40a9c6b137f7fb04cf61a;/home/aya97/suivi-pedagogique-system/frontend-web/src/app/features/qr-generator/qr-generator.component.ts */
.qr-container {
  display: flex;
  flex-direction: column;
  padding: clamp(12px, 3vw, 24px);
  gap: clamp(12px, 3vw, 24px);
  max-width: 100%;
}
@media (max-width: 480px) {
  .qr-container {
    gap: 14px;
    padding: 12px 8px;
  }
}
.page-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-wrap: wrap;
}
.page-header h1 {
  margin: 0;
  font-size: clamp(1.1rem, 3vw, 1.6rem);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}
@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.3rem;
  }
}
.page-header p {
  margin: 0;
  color: #64748b;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  font-weight: 500;
}
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
.card {
  background: white;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 14px;
  padding: 20px;
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}
.settings-card h3 {
  margin: 0 0 20px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
}
.settings-card h3 i {
  color: var(--primary-color);
  font-size: 1.1rem;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}
.form-group label i {
  color: #94a3b8;
  font-size: 0.85rem;
}
.form-group select,
.form-group input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  background: white;
  font-size: 0.9rem;
  color: #0f172a;
  transition: all 0.2s ease;
}
.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
.form-group select:disabled,
.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(241, 245, 249, 0.8);
}
.form-group select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}
.session-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(241, 245, 249, 0.6);
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s ease;
}
.session-status .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
}
.session-status.active {
  background: rgba(220, 252, 231, 0.8);
  color: #166534;
  border: 1px solid rgba(187, 240, 208, 0.5);
}
.session-status.active .status-dot {
  background: #22c55e;
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
}
@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.15);
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
.btn {
  width: 100%;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}
.btn i {
  font-size: 1.05rem;
}
.btn.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.btn.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
}
.btn.btn-primary:active {
  transform: translateY(0) scale(1);
}
.btn.btn-danger {
  background: #ef4444;
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}
.btn.btn-danger:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
}
.qr-display-card {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 480px;
}
.qr-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  transition: all 0.4s ease;
  width: 100%;
  max-width: 380px;
}
.qr-wrapper.blurred {
  filter: grayscale(0.7) opacity(0.5);
}
.qrcode-box {
  padding: 20px;
  border-radius: 14px;
  border: 2px dashed rgba(226, 232, 240, 0.9);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.session-active .qrcode-box {
  border: 2px solid rgba(37, 99, 235, 0.3);
  background: white;
}
.qr-payload {
  font-family:
    "SF Mono",
    "Fira Code",
    monospace;
  color: #94a3b8;
  font-size: 0.78rem;
  background: rgba(241, 245, 249, 0.6);
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(226, 232, 240, 0.5);
  letter-spacing: 0.02em;
}
.placeholder {
  text-align: center;
  padding: 48px 32px;
}
.placeholder .placeholder-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 14px;
  border: 2px dashed rgba(226, 232, 240, 0.9);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder .placeholder-icon i {
  font-size: 2.2rem;
  color: rgba(37, 99, 235, 0.45);
}
.placeholder .placeholder-text {
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
  margin: 0 0 6px;
}
.placeholder .placeholder-sub {
  font-size: 0.82rem;
  color: #94a3b8;
  font-weight: 500;
  margin: 0;
}
.timer-ring {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
}
.timer-ring svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}
.timer-ring circle {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
}
.timer-ring .bg-ring {
  stroke: rgba(241, 245, 249, 0.7);
}
.timer-ring .progress-ring {
  stroke: var(--primary-color);
  stroke-dasharray: 283;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 2px 3px rgba(37, 99, 235, 0.25));
}
.timer-ring .timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--primary-color);
  background: white;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.logs-card {
  padding: 20px;
}
.logs-card .logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.logs-card .logs-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logs-card .logs-header h3 i {
  color: #64748b;
  font-size: 1.05rem;
}
.logs-card .logs-header .log-count {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  background: rgba(241, 245, 249, 0.6);
  padding: 4px 10px;
  border-radius: 999px;
}
.logs-card .log-list {
  display: flex;
  flex-direction: column;
}
.logs-card .log-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  background: rgba(248, 250, 252, 0.5);
  border: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.logs-card .log-item:hover {
  background: rgba(37, 99, 235, 0.03);
  border-color: rgba(37, 99, 235, 0.08);
}
.logs-card .log-item .log-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.5);
}
.logs-card .log-item .log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.logs-card .log-item .log-content .log-message {
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.35;
}
.logs-card .log-item .log-content .log-message strong {
  color: #0f172a;
  font-weight: 600;
}
.logs-card .log-item .log-content .log-time {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 600;
}
.logs-card .log-item.success .log-icon {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.25);
}
.logs-card .log-item.warning .log-icon {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.25);
}
.logs-card .log-item.blocked {
  background: rgba(254, 226, 226, 0.6);
}
.logs-card .log-item.blocked .log-icon {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.25);
}
@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
  .qr-display-card {
    min-height: 400px;
  }
}
/*# sourceMappingURL=qr-generator.component.css.map */
`] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(QrGeneratorComponent, { className: "QrGeneratorComponent", filePath: "src/app/features/qr-generator/qr-generator.component.ts", lineNumber: 657 });
})();
export {
  QrGeneratorComponent
};
//# sourceMappingURL=chunk-NXM6XWZQ.js.map
