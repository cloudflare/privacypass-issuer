var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/rfc4648/lib/index.js
var require_lib = __commonJS({
  "node_modules/rfc4648/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function parse(string, encoding, opts) {
      var _opts$out;
      if (opts === void 0) {
        opts = {};
      }
      if (!encoding.codes) {
        encoding.codes = {};
        for (var i = 0; i < encoding.chars.length; ++i) {
          encoding.codes[encoding.chars[i]] = i;
        }
      }
      if (!opts.loose && string.length * encoding.bits & 7) {
        throw new SyntaxError("Invalid padding");
      }
      var end = string.length;
      while (string[end - 1] === "=") {
        --end;
        if (!opts.loose && !((string.length - end) * encoding.bits & 7)) {
          throw new SyntaxError("Invalid padding");
        }
      }
      var out = new ((_opts$out = opts.out) != null ? _opts$out : Uint8Array)(end * encoding.bits / 8 | 0);
      var bits = 0;
      var buffer = 0;
      var written = 0;
      for (var _i = 0; _i < end; ++_i) {
        var value = encoding.codes[string[_i]];
        if (value === void 0) {
          throw new SyntaxError("Invalid character " + string[_i]);
        }
        buffer = buffer << encoding.bits | value;
        bits += encoding.bits;
        if (bits >= 8) {
          bits -= 8;
          out[written++] = 255 & buffer >> bits;
        }
      }
      if (bits >= encoding.bits || 255 & buffer << 8 - bits) {
        throw new SyntaxError("Unexpected end of data");
      }
      return out;
    }
    function stringify(data, encoding, opts) {
      if (opts === void 0) {
        opts = {};
      }
      var _opts = opts, _opts$pad = _opts.pad, pad = _opts$pad === void 0 ? true : _opts$pad;
      var mask = (1 << encoding.bits) - 1;
      var out = "";
      var bits = 0;
      var buffer = 0;
      for (var i = 0; i < data.length; ++i) {
        buffer = buffer << 8 | 255 & data[i];
        bits += 8;
        while (bits > encoding.bits) {
          bits -= encoding.bits;
          out += encoding.chars[mask & buffer >> bits];
        }
      }
      if (bits) {
        out += encoding.chars[mask & buffer << encoding.bits - bits];
      }
      if (pad) {
        while (out.length * encoding.bits & 7) {
          out += "=";
        }
      }
      return out;
    }
    var base16Encoding = {
      chars: "0123456789ABCDEF",
      bits: 4
    };
    var base32Encoding = {
      chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
      bits: 5
    };
    var base32HexEncoding = {
      chars: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
      bits: 5
    };
    var base64Encoding = {
      chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      bits: 6
    };
    var base64UrlEncoding = {
      chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
      bits: 6
    };
    var base162 = {
      parse: function parse$1(string, opts) {
        return parse(string.toUpperCase(), base16Encoding, opts);
      },
      stringify: function stringify$1(data, opts) {
        return stringify(data, base16Encoding, opts);
      }
    };
    var base322 = {
      parse: function parse$1(string, opts) {
        if (opts === void 0) {
          opts = {};
        }
        return parse(opts.loose ? string.toUpperCase().replace(/0/g, "O").replace(/1/g, "L").replace(/8/g, "B") : string, base32Encoding, opts);
      },
      stringify: function stringify$1(data, opts) {
        return stringify(data, base32Encoding, opts);
      }
    };
    var base32hex2 = {
      parse: function parse$1(string, opts) {
        return parse(string, base32HexEncoding, opts);
      },
      stringify: function stringify$1(data, opts) {
        return stringify(data, base32HexEncoding, opts);
      }
    };
    var base642 = {
      parse: function parse$1(string, opts) {
        return parse(string, base64Encoding, opts);
      },
      stringify: function stringify$1(data, opts) {
        return stringify(data, base64Encoding, opts);
      }
    };
    var base64url2 = {
      parse: function parse$1(string, opts) {
        return parse(string, base64UrlEncoding, opts);
      },
      stringify: function stringify$1(data, opts) {
        return stringify(data, base64UrlEncoding, opts);
      }
    };
    var codec2 = {
      parse,
      stringify
    };
    exports.base16 = base162;
    exports.base32 = base322;
    exports.base32hex = base32hex2;
    exports.base64 = base642;
    exports.base64url = base64url2;
    exports.codec = codec2;
  }
});

// node_modules/pvtsutils/build/index.js
var require_build = __commonJS({
  "node_modules/pvtsutils/build/index.js"(exports) {
    "use strict";
    var ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
    var BufferSourceConverter2 = class _BufferSourceConverter {
      static isArrayBuffer(data) {
        return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
      }
      static toArrayBuffer(data) {
        if (this.isArrayBuffer(data)) {
          return data;
        }
        if (data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        return this.toUint8Array(data.buffer).slice(data.byteOffset, data.byteOffset + data.byteLength).buffer;
      }
      static toUint8Array(data) {
        return this.toView(data, Uint8Array);
      }
      static toView(data, type) {
        if (data.constructor === type) {
          return data;
        }
        if (this.isArrayBuffer(data)) {
          return new type(data);
        }
        if (this.isArrayBufferView(data)) {
          return new type(data.buffer, data.byteOffset, data.byteLength);
        }
        throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
      }
      static isBufferSource(data) {
        return this.isArrayBufferView(data) || this.isArrayBuffer(data);
      }
      static isArrayBufferView(data) {
        return ArrayBuffer.isView(data) || data && this.isArrayBuffer(data.buffer);
      }
      static isEqual(a, b) {
        const aView = _BufferSourceConverter.toUint8Array(a);
        const bView = _BufferSourceConverter.toUint8Array(b);
        if (aView.length !== bView.byteLength) {
          return false;
        }
        for (let i = 0; i < aView.length; i++) {
          if (aView[i] !== bView[i]) {
            return false;
          }
        }
        return true;
      }
      static concat(...args) {
        let buffers;
        if (Array.isArray(args[0]) && !(args[1] instanceof Function)) {
          buffers = args[0];
        } else if (Array.isArray(args[0]) && args[1] instanceof Function) {
          buffers = args[0];
        } else {
          if (args[args.length - 1] instanceof Function) {
            buffers = args.slice(0, args.length - 1);
          } else {
            buffers = args;
          }
        }
        let size = 0;
        for (const buffer of buffers) {
          size += buffer.byteLength;
        }
        const res = new Uint8Array(size);
        let offset = 0;
        for (const buffer of buffers) {
          const view = this.toUint8Array(buffer);
          res.set(view, offset);
          offset += view.length;
        }
        if (args[args.length - 1] instanceof Function) {
          return this.toView(res, args[args.length - 1]);
        }
        return res.buffer;
      }
    };
    var STRING_TYPE = "string";
    var HEX_REGEX = /^[0-9a-f\s]+$/i;
    var BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    var BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
    var Utf8Converter = class {
      static fromString(text) {
        const s = unescape(encodeURIComponent(text));
        const uintArray = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
          uintArray[i] = s.charCodeAt(i);
        }
        return uintArray.buffer;
      }
      static toString(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        let encodedString = "";
        for (let i = 0; i < buf.length; i++) {
          encodedString += String.fromCharCode(buf[i]);
        }
        const decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
      }
    };
    var Utf16Converter = class {
      static toString(buffer, littleEndian = false) {
        const arrayBuffer = BufferSourceConverter2.toArrayBuffer(buffer);
        const dataView = new DataView(arrayBuffer);
        let res = "";
        for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
          const code = dataView.getUint16(i, littleEndian);
          res += String.fromCharCode(code);
        }
        return res;
      }
      static fromString(text, littleEndian = false) {
        const res = new ArrayBuffer(text.length * 2);
        const dataView = new DataView(res);
        for (let i = 0; i < text.length; i++) {
          dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
        }
        return res;
      }
    };
    var Convert2 = class _Convert {
      static isHex(data) {
        return typeof data === STRING_TYPE && HEX_REGEX.test(data);
      }
      static isBase64(data) {
        return typeof data === STRING_TYPE && BASE64_REGEX.test(data);
      }
      static isBase64Url(data) {
        return typeof data === STRING_TYPE && BASE64URL_REGEX.test(data);
      }
      static ToString(buffer, enc = "utf8") {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.ToUtf8String(buf);
          case "binary":
            return this.ToBinary(buf);
          case "hex":
            return this.ToHex(buf);
          case "base64":
            return this.ToBase64(buf);
          case "base64url":
            return this.ToBase64Url(buf);
          case "utf16le":
            return Utf16Converter.toString(buf, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buf);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static FromString(str, enc = "utf8") {
        if (!str) {
          return new ArrayBuffer(0);
        }
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.FromUtf8String(str);
          case "binary":
            return this.FromBinary(str);
          case "hex":
            return this.FromHex(str);
          case "base64":
            return this.FromBase64(str);
          case "base64url":
            return this.FromBase64Url(str);
          case "utf16le":
            return Utf16Converter.fromString(str, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(str);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static ToBase64(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        if (typeof btoa !== "undefined") {
          const binary = this.ToString(buf, "binary");
          return btoa(binary);
        } else {
          return Buffer.from(buf).toString("base64");
        }
      }
      static FromBase64(base642) {
        const formatted = this.formatString(base642);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isBase64(formatted)) {
          throw new TypeError("Argument 'base64Text' is not Base64 encoded");
        }
        if (typeof atob !== "undefined") {
          return this.FromBinary(atob(formatted));
        } else {
          return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
        }
      }
      static FromBase64Url(base64url2) {
        const formatted = this.formatString(base64url2);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isBase64Url(formatted)) {
          throw new TypeError("Argument 'base64url' is not Base64Url encoded");
        }
        return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
      }
      static ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
      }
      static FromUtf8String(text, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.FromBinary(text);
          case "utf8":
            return Utf8Converter.fromString(text);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(text);
          case "utf16le":
          case "usc2":
            return Utf16Converter.fromString(text, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static ToUtf8String(buffer, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.ToBinary(buffer);
          case "utf8":
            return Utf8Converter.toString(buffer);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buffer);
          case "utf16le":
          case "usc2":
            return Utf16Converter.toString(buffer, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static FromBinary(text) {
        const stringLength = text.length;
        const resultView = new Uint8Array(stringLength);
        for (let i = 0; i < stringLength; i++) {
          resultView[i] = text.charCodeAt(i);
        }
        return resultView.buffer;
      }
      static ToBinary(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        let res = "";
        for (let i = 0; i < buf.length; i++) {
          res += String.fromCharCode(buf[i]);
        }
        return res;
      }
      static ToHex(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        let result = "";
        const len = buf.length;
        for (let i = 0; i < len; i++) {
          const byte = buf[i];
          if (byte < 16) {
            result += "0";
          }
          result += byte.toString(16);
        }
        return result;
      }
      static FromHex(hexString) {
        let formatted = this.formatString(hexString);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isHex(formatted)) {
          throw new TypeError("Argument 'hexString' is not HEX encoded");
        }
        if (formatted.length % 2) {
          formatted = `0${formatted}`;
        }
        const res = new Uint8Array(formatted.length / 2);
        for (let i = 0; i < formatted.length; i = i + 2) {
          const c = formatted.slice(i, i + 2);
          res[i / 2] = parseInt(c, 16);
        }
        return res.buffer;
      }
      static ToUtf16String(buffer, littleEndian = false) {
        return Utf16Converter.toString(buffer, littleEndian);
      }
      static FromUtf16String(text, littleEndian = false) {
        return Utf16Converter.fromString(text, littleEndian);
      }
      static Base64Padding(base642) {
        const padCount = 4 - base642.length % 4;
        if (padCount < 4) {
          for (let i = 0; i < padCount; i++) {
            base642 += "=";
          }
        }
        return base642;
      }
      static formatString(data) {
        return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
      }
    };
    Convert2.DEFAULT_UTF8_ENCODING = "utf8";
    function assign(target, ...sources) {
      const res = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i];
        for (const prop in obj) {
          res[prop] = obj[prop];
        }
      }
      return res;
    }
    function combine(...buf) {
      const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
      const res = new Uint8Array(totalByteLength);
      let currentPos = 0;
      buf.map((item) => new Uint8Array(item)).forEach((arr) => {
        for (const item2 of arr) {
          res[currentPos++] = item2;
        }
      });
      return res.buffer;
    }
    function isEqual(bytes1, bytes2) {
      if (!(bytes1 && bytes2)) {
        return false;
      }
      if (bytes1.byteLength !== bytes2.byteLength) {
        return false;
      }
      const b1 = new Uint8Array(bytes1);
      const b2 = new Uint8Array(bytes2);
      for (let i = 0; i < bytes1.byteLength; i++) {
        if (b1[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    }
    exports.BufferSourceConverter = BufferSourceConverter2;
    exports.Convert = Convert2;
    exports.assign = assign;
    exports.combine = combine;
    exports.isEqual = isEqual;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/groupTypes.js
var require_groupTypes = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/groupTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errBadGroup = exports.Groups = void 0;
    exports.Groups = {
      // P256_XMD:SHA-256_SSWU_RO_
      P256: "P-256",
      // P384_XMD:SHA-384_SSWU_RO_
      P384: "P-384",
      // P521_XMD:SHA-512_SSWU_RO_
      P521: "P-521",
      // ristretto255_XMD:SHA-512_R255MAP_RO_
      RISTRETTO255: "ristretto255",
      // decaf448_XOF:SHAKE256_D448MAP_RO_
      DECAF448: "decaf448"
    };
    function errBadGroup(X) {
      return new Error(`group: bad group name ${X}.`);
    }
    exports.errBadGroup = errBadGroup;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/util.js
var require_util = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compat = exports.errGroup = exports.errDeserialization = exports.checkSize = exports.fromU16LenPrefixUint8Array = exports.fromU16LenPrefixDes = exports.fromU16LenPrefix = exports.toU16LenPrefixClass = exports.toU16LenPrefixUint8Array = exports.toU16LenPrefix = exports.to16bits = exports.zip = exports.ctEqual = exports.xor = exports.joinAll = void 0;
    function joinAll3(a) {
      let size = 0;
      for (let i = 0; i < a.length; i++) {
        size += a[i].length;
      }
      const ret = new Uint8Array(new ArrayBuffer(size));
      for (let i = 0, offset = 0; i < a.length; i++) {
        ret.set(a[i], offset);
        offset += a[i].length;
      }
      return ret;
    }
    exports.joinAll = joinAll3;
    function xor2(a, b) {
      if (a.length !== b.length || a.length === 0) {
        throw new Error("arrays of different length");
      }
      const n = a.length;
      const c = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        c[i] = a[i] ^ b[i];
      }
      return c;
    }
    exports.xor = xor2;
    function ctEqual(a, b) {
      if (a.length !== b.length || a.length === 0) {
        return false;
      }
      const n = a.length;
      let c = 0;
      for (let i = 0; i < n; i++) {
        c |= a[i] ^ b[i];
      }
      return c === 0;
    }
    exports.ctEqual = ctEqual;
    function zip(x, y) {
      return x.map((xi, i) => [xi, y[i]]);
    }
    exports.zip = zip;
    function to16bits(n) {
      if (!(n >= 0 && n < 65535)) {
        throw new Error("number bigger than 2^16");
      }
      return new Uint8Array([n >> 8 & 255, n & 255]);
    }
    exports.to16bits = to16bits;
    function toU16LenPrefix(b) {
      return [to16bits(b.length), b];
    }
    exports.toU16LenPrefix = toU16LenPrefix;
    function toU16LenPrefixUint8Array(b) {
      return [to16bits(b.length), ...b.flatMap((x) => toU16LenPrefix(x))];
    }
    exports.toU16LenPrefixUint8Array = toU16LenPrefixUint8Array;
    function toU16LenPrefixClass(b) {
      return [to16bits(b.length), ...b.map((x) => x.serialize())];
    }
    exports.toU16LenPrefixClass = toU16LenPrefixClass;
    function fromU16LenPrefix(b) {
      if (b.length < 2) {
        throw new Error(`buffer shorter than expected`);
      }
      const n = b[0] << 8 | b[1];
      if (b.length < 2 + n) {
        throw new Error(`buffer shorter than expected`);
      }
      const head = b.subarray(2, 2 + n);
      const tail = b.subarray(2 + n);
      return { head, tail };
    }
    exports.fromU16LenPrefix = fromU16LenPrefix;
    function fromU16LenPrefixDes(c, b) {
      if (b.length < 2) {
        throw new Error(`buffer shorter than expected`);
      }
      const n = b[0] << 8 | b[1];
      const size = c.size();
      if (b.length < 2 + n * size) {
        throw new Error(`buffer shorter than expected`);
      }
      const head = [];
      for (let i = 0; i < n; i++) {
        head.push(c.deserialize(b.subarray(2 + i * size, 2 + (i + 1) * size)));
      }
      const tail = b.subarray(2 + n * size);
      return { head, tail };
    }
    exports.fromU16LenPrefixDes = fromU16LenPrefixDes;
    function fromU16LenPrefixUint8Array(b) {
      if (b.length < 2) {
        throw new Error(`buffer shorter than expected`);
      }
      const n = b[0] << 8 | b[1];
      let run = b.subarray(2);
      const output = [];
      for (let i = 0; i < n; i++) {
        const { head, tail } = fromU16LenPrefix(run);
        output.push(head);
        run = tail;
      }
      return { head: output, tail: run };
    }
    exports.fromU16LenPrefixUint8Array = fromU16LenPrefixUint8Array;
    function checkSize(x, T, u) {
      if (x.length < T.size(u)) {
        throw new Error(`error deserializing ${T.name}: buffer shorter than expected`);
      }
    }
    exports.checkSize = checkSize;
    function errDeserialization(T) {
      return new Error(`group: deserialization of ${T.name} failed.`);
    }
    exports.errDeserialization = errDeserialization;
    function errGroup(X, Y) {
      return new Error(`group: mismatch between groups ${X} and ${Y}.`);
    }
    exports.errGroup = errGroup;
    function compat(x, y) {
      if (x.g.id !== y.g.id)
        throw errGroup(x.g.id, y.g.id);
    }
    exports.compat = compat;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/dleq.js
var require_dleq = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/dleq.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DLEQProver = exports.DLEQProof = void 0;
    var util_js_1 = require_util();
    var LABELS = {
      Seed: "Seed-",
      Challenge: "Challenge",
      Composite: "Composite",
      HashToScalar: "HashToScalar-"
    };
    async function computeComposites(params, b, cd, key) {
      const te = new TextEncoder();
      const Bm = b.serialize();
      const seedDST = te.encode(LABELS.Seed + params.dst);
      const h1Input = (0, util_js_1.joinAll)([...(0, util_js_1.toU16LenPrefix)(Bm), ...(0, util_js_1.toU16LenPrefix)(seedDST)]);
      const seed = await params.hash(params.hashID, h1Input);
      const compositeLabel = te.encode(LABELS.Composite);
      const h2sDST = te.encode(LABELS.HashToScalar + params.dst);
      let M = params.gg.identity();
      let Z = params.gg.identity();
      let i = 0;
      for (const [c, d] of cd) {
        const Ci = c.serialize();
        const Di = d.serialize();
        const h2Input = (0, util_js_1.joinAll)([
          ...(0, util_js_1.toU16LenPrefix)(seed),
          (0, util_js_1.to16bits)(i++),
          ...(0, util_js_1.toU16LenPrefix)(Ci),
          ...(0, util_js_1.toU16LenPrefix)(Di),
          compositeLabel
        ]);
        const di = await params.gg.hashToScalar(h2Input, h2sDST);
        M = M.add(c.mul(di));
        if (!key) {
          Z = Z.add(d.mul(di));
        }
      }
      if (key) {
        Z = M.mul(key);
      }
      return { M, Z };
    }
    function challenge(params, points) {
      let h2Input = new Uint8Array();
      for (const p of points) {
        const P = p.serialize();
        h2Input = (0, util_js_1.joinAll)([h2Input, ...(0, util_js_1.toU16LenPrefix)(P)]);
      }
      const te = new TextEncoder();
      h2Input = (0, util_js_1.joinAll)([h2Input, te.encode(LABELS.Challenge)]);
      const h2sDST = te.encode(LABELS.HashToScalar + params.dst);
      return params.gg.hashToScalar(h2Input, h2sDST);
    }
    var DLEQProof2 = class _DLEQProof {
      constructor(params, c, s) {
        this.params = params;
        this.c = c;
        this.s = s;
      }
      verify(p0, p1) {
        return this.verify_batch(p0, [p1]);
      }
      // verify_batch implements the VerifyProof function
      // from https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-voprf-21#name-discrete-logarithm-equivale
      // The argument p0 corresponds to the elements A, B, and the argument p1s
      // corresponds to the arrays of elements C and D from the specification.
      async verify_batch(p0, p1s) {
        const { M, Z } = await computeComposites(this.params, p0[1], p1s);
        const t2 = p0[0].mul2(this.s, p0[1], this.c);
        const t3 = M.mul2(this.s, Z, this.c);
        const c = await challenge(this.params, [p0[1], M, Z, t2, t3]);
        return this.c.isEqual(c);
      }
      isEqual(p) {
        return this.params.dst === p.params.dst && this.params.gg.id === p.params.gg.id && this.params.hash === p.params.hash && this.c.isEqual(p.c) && this.s.isEqual(p.s);
      }
      serialize() {
        return (0, util_js_1.joinAll)([this.c.serialize(), this.s.serialize()]);
      }
      static size(params) {
        return 2 * params.gg.scalarSize();
      }
      static deserialize(params, bytes) {
        (0, util_js_1.checkSize)(bytes, _DLEQProof, params);
        const group = params.gg;
        const n = group.scalarSize();
        const c = group.desScalar(bytes.subarray(0, n));
        const s = group.desScalar(bytes.subarray(n, 2 * n));
        return new _DLEQProof(params, c, s);
      }
    };
    exports.DLEQProof = DLEQProof2;
    var DLEQProver = class {
      constructor(params) {
        this.params = params;
      }
      prove(k, p0, p1, r) {
        return this.prove_batch(k, p0, [p1], r);
      }
      // prove_batch implements the GenerateProof function
      // from https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-voprf-21#name-discrete-logarithm-equivale
      // The argument p0 corresponds to the elements A, B, and the argument p1s
      // corresponds to the arrays of elements C and D from the specification.
      async prove_batch(key, p0, p1s, r) {
        const rnd = r ? r : await this.params.gg.randomScalar();
        const { M, Z } = await computeComposites(this.params, p0[1], p1s, key);
        const t2 = p0[0].mul(rnd);
        const t3 = M.mul(rnd);
        const c = await challenge(this.params, [p0[1], M, Z, t2, t3]);
        const s = rnd.sub(c.mul(key));
        return new DLEQProof2(this.params, c, s);
      }
    };
    exports.DLEQProver = DLEQProver;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/sjcl/index.js
var require_sjcl = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/sjcl/index.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var sjcl2 = {
      /**
       * Symmetric ciphers.
       * @namespace
       */
      cipher: {},
      /**
       * Hash functions.  Right now only SHA256 is implemented.
       * @namespace
       */
      hash: {},
      /**
       * Key exchange functions.  Right now only SRP is implemented.
       * @namespace
       */
      keyexchange: {},
      /**
       * Cipher modes of operation.
       * @namespace
       */
      mode: {},
      /**
       * Miscellaneous.  HMAC and PBKDF2.
       * @namespace
       */
      misc: {},
      /**
       * Bit array encoders and decoders.
       * @namespace
       *
       * @description
       * The members of this namespace are functions which translate between
       * SJCL's bitArrays and other objects (usually strings).  Because it
       * isn't always clear which direction is encoding and which is decoding,
       * the method names are "fromBits" and "toBits".
       */
      codec: {},
      /**
       * Exceptions.
       * @namespace
       */
      exception: {
        /**
         * Ciphertext is corrupt.
         * @constructor
         */
        corrupt: function(message) {
          this.toString = function() {
            return "CORRUPT: " + this.message;
          };
          this.message = message;
        },
        /**
         * Invalid parameter.
         * @constructor
         */
        invalid: function(message) {
          this.toString = function() {
            return "INVALID: " + this.message;
          };
          this.message = message;
        },
        /**
         * Bug or missing feature in SJCL.
         * @constructor
         */
        bug: function(message) {
          this.toString = function() {
            return "BUG: " + this.message;
          };
          this.message = message;
        },
        /**
         * Something isn't ready.
         * @constructor
         */
        notReady: function(message) {
          this.toString = function() {
            return "NOT READY: " + this.message;
          };
          this.message = message;
        }
      }
    };
    sjcl2.cipher.aes = function(key) {
      if (!this._tables[0][0][0]) {
        this._precompute();
      }
      var i, j, tmp, encKey, decKey, sbox = this._tables[0][4], decTable = this._tables[1], keyLen = key.length, rcon = 1;
      if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
        throw new sjcl2.exception.invalid("invalid aes key size");
      }
      this._key = [encKey = key.slice(0), decKey = []];
      for (i = keyLen; i < 4 * keyLen + 28; i++) {
        tmp = encKey[i - 1];
        if (i % keyLen === 0 || keyLen === 8 && i % keyLen === 4) {
          tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];
          if (i % keyLen === 0) {
            tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
            rcon = rcon << 1 ^ (rcon >> 7) * 283;
          }
        }
        encKey[i] = encKey[i - keyLen] ^ tmp;
      }
      for (j = 0; i; j++, i--) {
        tmp = encKey[j & 3 ? i : i - 4];
        if (i <= 4 || j < 4) {
          decKey[j] = tmp;
        } else {
          decKey[j] = decTable[0][sbox[tmp >>> 24]] ^ decTable[1][sbox[tmp >> 16 & 255]] ^ decTable[2][sbox[tmp >> 8 & 255]] ^ decTable[3][sbox[tmp & 255]];
        }
      }
    };
    sjcl2.cipher.aes.prototype = {
      // public
      /* Something like this might appear here eventually
      name: "AES",
      blockSize: 4,
      keySizes: [4,6,8],
      */
      /**
       * Encrypt an array of 4 big-endian words.
       * @param {Array} data The plaintext.
       * @return {Array} The ciphertext.
       */
      encrypt: function(data) {
        return this._crypt(data, 0);
      },
      /**
       * Decrypt an array of 4 big-endian words.
       * @param {Array} data The ciphertext.
       * @return {Array} The plaintext.
       */
      decrypt: function(data) {
        return this._crypt(data, 1);
      },
      /**
       * The expanded S-box and inverse S-box tables.  These will be computed
       * on the client so that we don't have to send them down the wire.
       *
       * There are two tables, _tables[0] is for encryption and
       * _tables[1] is for decryption.
       *
       * The first 4 sub-tables are the expanded S-box with MixColumns.  The
       * last (_tables[01][4]) is the S-box itself.
       *
       * @private
       */
      _tables: [[[], [], [], [], []], [[], [], [], [], []]],
      /**
       * Expand the S-box tables.
       *
       * @private
       */
      _precompute: function() {
        var encTable = this._tables[0], decTable = this._tables[1], sbox = encTable[4], sboxInv = decTable[4], i, x, xInv, d = [], th = [], x2, x4, x8, s, tEnc, tDec;
        for (i = 0; i < 256; i++) {
          th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
        }
        for (x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
          s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
          s = s >> 8 ^ s & 255 ^ 99;
          sbox[x] = s;
          sboxInv[s] = x;
          x8 = d[x4 = d[x2 = d[x]]];
          tDec = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
          tEnc = d[s] * 257 ^ s * 16843008;
          for (i = 0; i < 4; i++) {
            encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
            decTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;
          }
        }
        for (i = 0; i < 5; i++) {
          encTable[i] = encTable[i].slice(0);
          decTable[i] = decTable[i].slice(0);
        }
      },
      /**
       * Encryption and decryption core.
       * @param {Array} input Four words to be encrypted or decrypted.
       * @param dir The direction, 0 for encrypt and 1 for decrypt.
       * @return {Array} The four encrypted or decrypted words.
       * @private
       */
      _crypt: function(input, dir) {
        if (input.length !== 4) {
          throw new sjcl2.exception.invalid("invalid aes block size");
        }
        var key = this._key[dir], a = input[0] ^ key[0], b = input[dir ? 3 : 1] ^ key[1], c = input[2] ^ key[2], d = input[dir ? 1 : 3] ^ key[3], a2, b2, c2, nInnerRounds = key.length / 4 - 2, i, kIndex = 4, out = [0, 0, 0, 0], table = this._tables[dir], t0 = table[0], t1 = table[1], t2 = table[2], t3 = table[3], sbox = table[4];
        for (i = 0; i < nInnerRounds; i++) {
          a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
          b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
          c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
          d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
          kIndex += 4;
          a = a2;
          b = b2;
          c = c2;
        }
        for (i = 0; i < 4; i++) {
          out[dir ? 3 & -i : i] = sbox[a >>> 24] << 24 ^ sbox[b >> 16 & 255] << 16 ^ sbox[c >> 8 & 255] << 8 ^ sbox[d & 255] ^ key[kIndex++];
          a2 = a;
          a = b;
          b = c;
          c = d;
          d = a2;
        }
        return out;
      }
    };
    sjcl2.bitArray = {
      /**
       * Array slices in units of bits.
       * @param {bitArray} a The array to slice.
       * @param {Number} bstart The offset to the start of the slice, in bits.
       * @param {Number} bend The offset to the end of the slice, in bits.  If this is undefined,
       * slice until the end of the array.
       * @return {bitArray} The requested slice.
       */
      bitSlice: function(a, bstart, bend) {
        a = sjcl2.bitArray._shiftRight(a.slice(bstart / 32), 32 - (bstart & 31)).slice(1);
        return bend === void 0 ? a : sjcl2.bitArray.clamp(a, bend - bstart);
      },
      /**
       * Extract a number packed into a bit array.
       * @param {bitArray} a The array to slice.
       * @param {Number} bstart The offset to the start of the slice, in bits.
       * @param {Number} blength The length of the number to extract.
       * @return {Number} The requested slice.
       */
      extract: function(a, bstart, blength) {
        var x, sh = Math.floor(-bstart - blength & 31);
        if ((bstart + blength - 1 ^ bstart) & -32) {
          x = a[bstart / 32 | 0] << 32 - sh ^ a[bstart / 32 + 1 | 0] >>> sh;
        } else {
          x = a[bstart / 32 | 0] >>> sh;
        }
        return x & (1 << blength) - 1;
      },
      /**
       * Concatenate two bit arrays.
       * @param {bitArray} a1 The first array.
       * @param {bitArray} a2 The second array.
       * @return {bitArray} The concatenation of a1 and a2.
       */
      concat: function(a1, a2) {
        if (a1.length === 0 || a2.length === 0) {
          return a1.concat(a2);
        }
        var last = a1[a1.length - 1], shift = sjcl2.bitArray.getPartial(last);
        if (shift === 32) {
          return a1.concat(a2);
        } else {
          return sjcl2.bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
        }
      },
      /**
       * Find the length of an array of bits.
       * @param {bitArray} a The array.
       * @return {Number} The length of a, in bits.
       */
      bitLength: function(a) {
        var l = a.length, x;
        if (l === 0) {
          return 0;
        }
        x = a[l - 1];
        return (l - 1) * 32 + sjcl2.bitArray.getPartial(x);
      },
      /**
       * Truncate an array.
       * @param {bitArray} a The array.
       * @param {Number} len The length to truncate to, in bits.
       * @return {bitArray} A new array, truncated to len bits.
       */
      clamp: function(a, len) {
        if (a.length * 32 < len) {
          return a;
        }
        a = a.slice(0, Math.ceil(len / 32));
        var l = a.length;
        len = len & 31;
        if (l > 0 && len) {
          a[l - 1] = sjcl2.bitArray.partial(len, a[l - 1] & 2147483648 >> len - 1, 1);
        }
        return a;
      },
      /**
       * Make a partial word for a bit array.
       * @param {Number} len The number of bits in the word.
       * @param {Number} x The bits.
       * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
       * @return {Number} The partial word.
       */
      partial: function(len, x, _end) {
        if (len === 32) {
          return x;
        }
        return (_end ? x | 0 : x << 32 - len) + len * 1099511627776;
      },
      /**
       * Get the number of bits used by a partial word.
       * @param {Number} x The partial word.
       * @return {Number} The number of bits used by the partial word.
       */
      getPartial: function(x) {
        return Math.round(x / 1099511627776) || 32;
      },
      /**
       * Compare two arrays for equality in a predictable amount of time.
       * @param {bitArray} a The first array.
       * @param {bitArray} b The second array.
       * @return {boolean} true if a == b; false otherwise.
       */
      equal: function(a, b) {
        if (sjcl2.bitArray.bitLength(a) !== sjcl2.bitArray.bitLength(b)) {
          return false;
        }
        var x = 0, i;
        for (i = 0; i < a.length; i++) {
          x |= a[i] ^ b[i];
        }
        return x === 0;
      },
      /** Shift an array right.
       * @param {bitArray} a The array to shift.
       * @param {Number} shift The number of bits to shift.
       * @param {Number} [carry=0] A byte to carry in
       * @param {bitArray} [out=[]] An array to prepend to the output.
       * @private
       */
      _shiftRight: function(a, shift, carry, out) {
        var i, last2 = 0, shift2;
        if (out === void 0) {
          out = [];
        }
        for (; shift >= 32; shift -= 32) {
          out.push(carry);
          carry = 0;
        }
        if (shift === 0) {
          return out.concat(a);
        }
        for (i = 0; i < a.length; i++) {
          out.push(carry | a[i] >>> shift);
          carry = a[i] << 32 - shift;
        }
        last2 = a.length ? a[a.length - 1] : 0;
        shift2 = sjcl2.bitArray.getPartial(last2);
        out.push(sjcl2.bitArray.partial(shift + shift2 & 31, shift + shift2 > 32 ? carry : out.pop(), 1));
        return out;
      },
      /** xor a block of 4 words together.
       * @private
       */
      _xor4: function(x, y) {
        return [x[0] ^ y[0], x[1] ^ y[1], x[2] ^ y[2], x[3] ^ y[3]];
      },
      /** byteswap a word array inplace.
       * (does not handle partial words)
       * @param {sjcl.bitArray} a word array
       * @return {sjcl.bitArray} byteswapped array
       */
      byteswapM: function(a) {
        var i, v, m = 65280;
        for (i = 0; i < a.length; ++i) {
          v = a[i];
          a[i] = v >>> 24 | v >>> 8 & m | (v & m) << 8 | v << 24;
        }
        return a;
      }
    };
    sjcl2.codec.utf8String = {
      /** Convert from a bitArray to a UTF-8 string. */
      fromBits: function(arr) {
        var out = "", bl = sjcl2.bitArray.bitLength(arr), i, tmp;
        for (i = 0; i < bl / 8; i++) {
          if ((i & 3) === 0) {
            tmp = arr[i / 4];
          }
          out += String.fromCharCode(tmp >>> 8 >>> 8 >>> 8);
          tmp <<= 8;
        }
        return decodeURIComponent(escape(out));
      },
      /** Convert from a UTF-8 string to a bitArray. */
      toBits: function(str) {
        str = unescape(encodeURIComponent(str));
        var out = [], i, tmp = 0;
        for (i = 0; i < str.length; i++) {
          tmp = tmp << 8 | str.charCodeAt(i);
          if ((i & 3) === 3) {
            out.push(tmp);
            tmp = 0;
          }
        }
        if (i & 3) {
          out.push(sjcl2.bitArray.partial(8 * (i & 3), tmp));
        }
        return out;
      }
    };
    sjcl2.codec.hex = {
      /** Convert from a bitArray to a hex string. */
      fromBits: function(arr) {
        var out = "", i;
        for (i = 0; i < arr.length; i++) {
          out += ((arr[i] | 0) + 263882790666240).toString(16).substr(4);
        }
        return out.substr(0, sjcl2.bitArray.bitLength(arr) / 4);
      },
      /** Convert from a hex string to a bitArray. */
      toBits: function(str) {
        var i, out = [], len;
        str = str.replace(/\s|0x/g, "");
        len = str.length;
        str = str + "00000000";
        for (i = 0; i < str.length; i += 8) {
          out.push(parseInt(str.substr(i, 8), 16) ^ 0);
        }
        return sjcl2.bitArray.clamp(out, len * 4);
      }
    };
    sjcl2.codec.base64 = {
      /** The base64 alphabet.
       * @private
       */
      _chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      /** Convert from a bitArray to a base64 string. */
      fromBits: function(arr, _noEquals, _url) {
        var out = "", i, bits = 0, c = sjcl2.codec.base64._chars, ta = 0, bl = sjcl2.bitArray.bitLength(arr);
        if (_url) {
          c = c.substr(0, 62) + "-_";
        }
        for (i = 0; out.length * 6 < bl; ) {
          out += c.charAt((ta ^ arr[i] >>> bits) >>> 26);
          if (bits < 6) {
            ta = arr[i] << 6 - bits;
            bits += 26;
            i++;
          } else {
            ta <<= 6;
            bits -= 6;
          }
        }
        while (out.length & 3 && !_noEquals) {
          out += "=";
        }
        return out;
      },
      /** Convert from a base64 string to a bitArray */
      toBits: function(str, _url) {
        str = str.replace(/\s|=/g, "");
        var out = [], i, bits = 0, c = sjcl2.codec.base64._chars, ta = 0, x;
        if (_url) {
          c = c.substr(0, 62) + "-_";
        }
        for (i = 0; i < str.length; i++) {
          x = c.indexOf(str.charAt(i));
          if (x < 0) {
            throw new sjcl2.exception.invalid("this isn't base64!");
          }
          if (bits > 26) {
            bits -= 26;
            out.push(ta ^ x >>> bits);
            ta = x << 32 - bits;
          } else {
            bits += 6;
            ta ^= x << 32 - bits;
          }
        }
        if (bits & 56) {
          out.push(sjcl2.bitArray.partial(bits & 56, ta, 1));
        }
        return out;
      }
    };
    sjcl2.codec.base64url = {
      fromBits: function(arr) {
        return sjcl2.codec.base64.fromBits(arr, 1, 1);
      },
      toBits: function(str) {
        return sjcl2.codec.base64.toBits(str, 1);
      }
    };
    sjcl2.codec.bytes = {
      /** Convert from a bitArray to an array of bytes. */
      fromBits: function(arr) {
        var out = [], bl = sjcl2.bitArray.bitLength(arr), i, tmp;
        for (i = 0; i < bl / 8; i++) {
          if ((i & 3) === 0) {
            tmp = arr[i / 4];
          }
          out.push(tmp >>> 24);
          tmp <<= 8;
        }
        return out;
      },
      /** Convert from an array of bytes to a bitArray. */
      toBits: function(bytes) {
        var out = [], i, tmp = 0;
        for (i = 0; i < bytes.length; i++) {
          tmp = tmp << 8 | bytes[i];
          if ((i & 3) === 3) {
            out.push(tmp);
            tmp = 0;
          }
        }
        if (i & 3) {
          out.push(sjcl2.bitArray.partial(8 * (i & 3), tmp));
        }
        return out;
      }
    };
    sjcl2.hash.sha256 = function(hash) {
      if (!this._key[0]) {
        this._precompute();
      }
      if (hash) {
        this._h = hash._h.slice(0);
        this._buffer = hash._buffer.slice(0);
        this._length = hash._length;
      } else {
        this.reset();
      }
    };
    sjcl2.hash.sha256.hash = function(data) {
      return new sjcl2.hash.sha256().update(data).finalize();
    };
    sjcl2.hash.sha256.prototype = {
      /**
       * The hash's block size, in bits.
       * @constant
       */
      blockSize: 512,
      /**
       * Reset the hash state.
       * @return this
       */
      reset: function() {
        this._h = this._init.slice(0);
        this._buffer = [];
        this._length = 0;
        return this;
      },
      /**
       * Input several words to the hash.
       * @param {bitArray|String} data the data to hash.
       * @return this
       */
      update: function(data) {
        if (typeof data === "string") {
          data = sjcl2.codec.utf8String.toBits(data);
        }
        var i, b = this._buffer = sjcl2.bitArray.concat(this._buffer, data), ol = this._length, nl = this._length = ol + sjcl2.bitArray.bitLength(data);
        if (nl > 9007199254740991) {
          throw new sjcl2.exception.invalid("Cannot hash more than 2^53 - 1 bits");
        }
        if (typeof Uint32Array !== "undefined") {
          var c = new Uint32Array(b);
          var j = 0;
          for (i = 512 + ol - (512 + ol & 511); i <= nl; i += 512) {
            this._block(c.subarray(16 * j, 16 * (j + 1)));
            j += 1;
          }
          b.splice(0, 16 * j);
        } else {
          for (i = 512 + ol - (512 + ol & 511); i <= nl; i += 512) {
            this._block(b.splice(0, 16));
          }
        }
        return this;
      },
      /**
       * Complete hashing and output the hash value.
       * @return {bitArray} The hash value, an array of 8 big-endian words.
       */
      finalize: function() {
        var i, b = this._buffer, h = this._h;
        b = sjcl2.bitArray.concat(b, [sjcl2.bitArray.partial(1, 1)]);
        for (i = b.length + 2; i & 15; i++) {
          b.push(0);
        }
        b.push(Math.floor(this._length / 4294967296));
        b.push(this._length | 0);
        while (b.length) {
          this._block(b.splice(0, 16));
        }
        this.reset();
        return h;
      },
      /**
       * The SHA-256 initialization vector, to be precomputed.
       * @private
       */
      _init: [],
      /*
      _init:[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],
      */
      /**
       * The SHA-256 hash key, to be precomputed.
       * @private
       */
      _key: [],
      /*
      _key:
        [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
         0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
         0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
         0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
         0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
         0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
         0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
         0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
      */
      /**
       * Function to precompute _init and _key.
       * @private
       */
      _precompute: function() {
        var i = 0, prime = 2, factor, isPrime;
        function frac(x) {
          return (x - Math.floor(x)) * 4294967296 | 0;
        }
        for (; i < 64; prime++) {
          isPrime = true;
          for (factor = 2; factor * factor <= prime; factor++) {
            if (prime % factor === 0) {
              isPrime = false;
              break;
            }
          }
          if (isPrime) {
            if (i < 8) {
              this._init[i] = frac(Math.pow(prime, 1 / 2));
            }
            this._key[i] = frac(Math.pow(prime, 1 / 3));
            i++;
          }
        }
      },
      /**
       * Perform one cycle of SHA-256.
       * @param {Uint32Array|bitArray} w one block of words.
       * @private
       */
      _block: function(w) {
        var i, tmp, a, b, h = this._h, k = this._key, h0 = h[0], h1 = h[1], h2 = h[2], h3 = h[3], h4 = h[4], h5 = h[5], h6 = h[6], h7 = h[7];
        for (i = 0; i < 64; i++) {
          if (i < 16) {
            tmp = w[i];
          } else {
            a = w[i + 1 & 15];
            b = w[i + 14 & 15];
            tmp = w[i & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i & 15] + w[i + 9 & 15] | 0;
          }
          tmp = tmp + h7 + (h4 >>> 6 ^ h4 >>> 11 ^ h4 >>> 25 ^ h4 << 26 ^ h4 << 21 ^ h4 << 7) + (h6 ^ h4 & (h5 ^ h6)) + k[i];
          h7 = h6;
          h6 = h5;
          h5 = h4;
          h4 = h3 + tmp | 0;
          h3 = h2;
          h2 = h1;
          h1 = h0;
          h0 = tmp + (h1 & h2 ^ h3 & (h1 ^ h2)) + (h1 >>> 2 ^ h1 >>> 13 ^ h1 >>> 22 ^ h1 << 30 ^ h1 << 19 ^ h1 << 10) | 0;
        }
        h[0] = h[0] + h0 | 0;
        h[1] = h[1] + h1 | 0;
        h[2] = h[2] + h2 | 0;
        h[3] = h[3] + h3 | 0;
        h[4] = h[4] + h4 | 0;
        h[5] = h[5] + h5 | 0;
        h[6] = h[6] + h6 | 0;
        h[7] = h[7] + h7 | 0;
      }
    };
    sjcl2.mode.ccm = {
      /** The name of the mode.
       * @constant
       */
      name: "ccm",
      _progressListeners: [],
      listenProgress: function(cb) {
        sjcl2.mode.ccm._progressListeners.push(cb);
      },
      unListenProgress: function(cb) {
        var index = sjcl2.mode.ccm._progressListeners.indexOf(cb);
        if (index > -1) {
          sjcl2.mode.ccm._progressListeners.splice(index, 1);
        }
      },
      _callProgressListener: function(val) {
        var p = sjcl2.mode.ccm._progressListeners.slice(), i;
        for (i = 0; i < p.length; i += 1) {
          p[i](val);
        }
      },
      /** Encrypt in CCM mode.
       * @static
       * @param {Object} prf The pseudorandom function.  It must have a block size of 16 bytes.
       * @param {bitArray} plaintext The plaintext data.
       * @param {bitArray} iv The initialization value.
       * @param {bitArray} [adata=[]] The authenticated data.
       * @param {Number} [tlen=64] the desired tag length, in bits.
       * @return {bitArray} The encrypted data, an array of bytes.
       */
      encrypt: function(prf, plaintext, iv, adata, tlen) {
        var L, out = plaintext.slice(0), tag, w = sjcl2.bitArray, ivl = w.bitLength(iv) / 8, ol = w.bitLength(out) / 8;
        tlen = tlen || 64;
        adata = adata || [];
        if (ivl < 7) {
          throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");
        }
        for (L = 2; L < 4 && ol >>> 8 * L; L++) {
        }
        if (L < 15 - ivl) {
          L = 15 - ivl;
        }
        iv = w.clamp(iv, 8 * (15 - L));
        tag = sjcl2.mode.ccm._computeTag(prf, plaintext, iv, adata, tlen, L);
        out = sjcl2.mode.ccm._ctrMode(prf, out, iv, tag, tlen, L);
        return w.concat(out.data, out.tag);
      },
      /** Decrypt in CCM mode.
       * @static
       * @param {Object} prf The pseudorandom function.  It must have a block size of 16 bytes.
       * @param {bitArray} ciphertext The ciphertext data.
       * @param {bitArray} iv The initialization value.
       * @param {bitArray} [adata=[]] adata The authenticated data.
       * @param {Number} [tlen=64] tlen the desired tag length, in bits.
       * @return {bitArray} The decrypted data.
       */
      decrypt: function(prf, ciphertext, iv, adata, tlen) {
        tlen = tlen || 64;
        adata = adata || [];
        var L, w = sjcl2.bitArray, ivl = w.bitLength(iv) / 8, ol = w.bitLength(ciphertext), out = w.clamp(ciphertext, ol - tlen), tag = w.bitSlice(ciphertext, ol - tlen), tag2;
        ol = (ol - tlen) / 8;
        if (ivl < 7) {
          throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");
        }
        for (L = 2; L < 4 && ol >>> 8 * L; L++) {
        }
        if (L < 15 - ivl) {
          L = 15 - ivl;
        }
        iv = w.clamp(iv, 8 * (15 - L));
        out = sjcl2.mode.ccm._ctrMode(prf, out, iv, tag, tlen, L);
        tag2 = sjcl2.mode.ccm._computeTag(prf, out.data, iv, adata, tlen, L);
        if (!w.equal(out.tag, tag2)) {
          throw new sjcl2.exception.corrupt("ccm: tag doesn't match");
        }
        return out.data;
      },
      _macAdditionalData: function(prf, adata, iv, tlen, ol, L) {
        var mac, tmp, i, macData = [], w = sjcl2.bitArray, xor2 = w._xor4;
        mac = [w.partial(8, (adata.length ? 1 << 6 : 0) | tlen - 2 << 2 | L - 1)];
        mac = w.concat(mac, iv);
        mac[3] |= ol;
        mac = prf.encrypt(mac);
        if (adata.length) {
          tmp = w.bitLength(adata) / 8;
          if (tmp <= 65279) {
            macData = [w.partial(16, tmp)];
          } else if (tmp <= 4294967295) {
            macData = w.concat([w.partial(16, 65534)], [tmp]);
          }
          macData = w.concat(macData, adata);
          for (i = 0; i < macData.length; i += 4) {
            mac = prf.encrypt(xor2(mac, macData.slice(i, i + 4).concat([0, 0, 0])));
          }
        }
        return mac;
      },
      /* Compute the (unencrypted) authentication tag, according to the CCM specification
       * @param {Object} prf The pseudorandom function.
       * @param {bitArray} plaintext The plaintext data.
       * @param {bitArray} iv The initialization value.
       * @param {bitArray} adata The authenticated data.
       * @param {Number} tlen the desired tag length, in bits.
       * @return {bitArray} The tag, but not yet encrypted.
       * @private
       */
      _computeTag: function(prf, plaintext, iv, adata, tlen, L) {
        var mac, i, w = sjcl2.bitArray, xor2 = w._xor4;
        tlen /= 8;
        if (tlen % 2 || tlen < 4 || tlen > 16) {
          throw new sjcl2.exception.invalid("ccm: invalid tag length");
        }
        if (adata.length > 4294967295 || plaintext.length > 4294967295) {
          throw new sjcl2.exception.bug("ccm: can't deal with 4GiB or more data");
        }
        mac = sjcl2.mode.ccm._macAdditionalData(prf, adata, iv, tlen, w.bitLength(plaintext) / 8, L);
        for (i = 0; i < plaintext.length; i += 4) {
          mac = prf.encrypt(xor2(mac, plaintext.slice(i, i + 4).concat([0, 0, 0])));
        }
        return w.clamp(mac, tlen * 8);
      },
      /** CCM CTR mode.
       * Encrypt or decrypt data and tag with the prf in CCM-style CTR mode.
       * May mutate its arguments.
       * @param {Object} prf The PRF.
       * @param {bitArray} data The data to be encrypted or decrypted.
       * @param {bitArray} iv The initialization vector.
       * @param {bitArray} tag The authentication tag.
       * @param {Number} tlen The length of th etag, in bits.
       * @param {Number} L The CCM L value.
       * @return {Object} An object with data and tag, the en/decryption of data and tag values.
       * @private
       */
      _ctrMode: function(prf, data, iv, tag, tlen, L) {
        var enc, i, w = sjcl2.bitArray, xor2 = w._xor4, ctr, l = data.length, bl = w.bitLength(data), n = l / 50, p = n;
        ctr = w.concat([w.partial(8, L - 1)], iv).concat([0, 0, 0]).slice(0, 4);
        tag = w.bitSlice(xor2(tag, prf.encrypt(ctr)), 0, tlen);
        if (!l) {
          return { tag, data: [] };
        }
        for (i = 0; i < l; i += 4) {
          if (i > n) {
            sjcl2.mode.ccm._callProgressListener(i / l);
            n += p;
          }
          ctr[3]++;
          enc = prf.encrypt(ctr);
          data[i] ^= enc[0];
          data[i + 1] ^= enc[1];
          data[i + 2] ^= enc[2];
          data[i + 3] ^= enc[3];
        }
        return { tag, data: w.clamp(data, bl) };
      }
    };
    sjcl2.misc.hmac = function(key, Hash) {
      this._hash = Hash = Hash || sjcl2.hash.sha256;
      var exKey = [[], []], i, bs = Hash.prototype.blockSize / 32;
      this._baseHash = [new Hash(), new Hash()];
      if (key.length > bs) {
        key = Hash.hash(key);
      }
      for (i = 0; i < bs; i++) {
        exKey[0][i] = key[i] ^ 909522486;
        exKey[1][i] = key[i] ^ 1549556828;
      }
      this._baseHash[0].update(exKey[0]);
      this._baseHash[1].update(exKey[1]);
      this._resultHash = new Hash(this._baseHash[0]);
    };
    sjcl2.misc.hmac.prototype.encrypt = sjcl2.misc.hmac.prototype.mac = function(data) {
      if (!this._updated) {
        this.update(data);
        return this.digest(data);
      } else {
        throw new sjcl2.exception.invalid("encrypt on already updated hmac called!");
      }
    };
    sjcl2.misc.hmac.prototype.reset = function() {
      this._resultHash = new this._hash(this._baseHash[0]);
      this._updated = false;
    };
    sjcl2.misc.hmac.prototype.update = function(data) {
      this._updated = true;
      this._resultHash.update(data);
    };
    sjcl2.misc.hmac.prototype.digest = function() {
      var w = this._resultHash.finalize(), result = new this._hash(this._baseHash[1]).update(w).finalize();
      this.reset();
      return result;
    };
    sjcl2.misc.pbkdf2 = function(password, salt, count, length, Prff) {
      count = count || 1e4;
      if (length < 0 || count < 0) {
        throw new sjcl2.exception.invalid("invalid params to pbkdf2");
      }
      if (typeof password === "string") {
        password = sjcl2.codec.utf8String.toBits(password);
      }
      if (typeof salt === "string") {
        salt = sjcl2.codec.utf8String.toBits(salt);
      }
      Prff = Prff || sjcl2.misc.hmac;
      var prf = new Prff(password), u, ui, i, j, k, out = [], b = sjcl2.bitArray;
      for (k = 1; 32 * out.length < (length || 1); k++) {
        u = ui = prf.encrypt(b.concat(salt, [k]));
        for (i = 1; i < count; i++) {
          ui = prf.encrypt(ui);
          for (j = 0; j < ui.length; j++) {
            u[j] ^= ui[j];
          }
        }
        out = out.concat(u);
      }
      if (length) {
        out = b.clamp(out, length);
      }
      return out;
    };
    sjcl2.prng = function(defaultParanoia) {
      this._pools = [new sjcl2.hash.sha256()];
      this._poolEntropy = [0];
      this._reseedCount = 0;
      this._robins = {};
      this._eventId = 0;
      this._collectorIds = {};
      this._collectorIdNext = 0;
      this._strength = 0;
      this._poolStrength = 0;
      this._nextReseed = 0;
      this._key = [0, 0, 0, 0, 0, 0, 0, 0];
      this._counter = [0, 0, 0, 0];
      this._cipher = void 0;
      this._defaultParanoia = defaultParanoia;
      this._collectorsStarted = false;
      this._callbacks = { progress: {}, seeded: {} };
      this._callbackI = 0;
      this._NOT_READY = 0;
      this._READY = 1;
      this._REQUIRES_RESEED = 2;
      this._MAX_WORDS_PER_BURST = 65536;
      this._PARANOIA_LEVELS = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024];
      this._MILLISECONDS_PER_RESEED = 3e4;
      this._BITS_PER_RESEED = 80;
    };
    sjcl2.prng.prototype = {
      /** Generate several random words, and return them in an array.
       * A word consists of 32 bits (4 bytes)
       * @param {Number} nwords The number of words to generate.
       */
      randomWords: function(nwords, paranoia) {
        var out = [], i, readiness = this.isReady(paranoia), g;
        if (readiness === this._NOT_READY) {
          throw new sjcl2.exception.notReady("generator isn't seeded");
        } else if (readiness & this._REQUIRES_RESEED) {
          this._reseedFromPools(!(readiness & this._READY));
        }
        for (i = 0; i < nwords; i += 4) {
          if ((i + 1) % this._MAX_WORDS_PER_BURST === 0) {
            this._gate();
          }
          g = this._gen4words();
          out.push(g[0], g[1], g[2], g[3]);
        }
        this._gate();
        return out.slice(0, nwords);
      },
      setDefaultParanoia: function(paranoia, allowZeroParanoia) {
        if (paranoia === 0 && allowZeroParanoia !== "Setting paranoia=0 will ruin your security; use it only for testing") {
          throw new sjcl2.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");
        }
        this._defaultParanoia = paranoia;
      },
      /**
       * Add entropy to the pools.
       * @param data The entropic value.  Should be a 32-bit integer, array of 32-bit integers, or string
       * @param {Number} estimatedEntropy The estimated entropy of data, in bits
       * @param {String} source The source of the entropy, eg "mouse"
       */
      addEntropy: function(data, estimatedEntropy, source) {
        source = source || "user";
        var id, i, tmp, t = (/* @__PURE__ */ new Date()).valueOf(), robin = this._robins[source], oldReady = this.isReady(), err = 0, objName;
        id = this._collectorIds[source];
        if (id === void 0) {
          id = this._collectorIds[source] = this._collectorIdNext++;
        }
        if (robin === void 0) {
          robin = this._robins[source] = 0;
        }
        this._robins[source] = (this._robins[source] + 1) % this._pools.length;
        switch (typeof data) {
          case "number":
            if (estimatedEntropy === void 0) {
              estimatedEntropy = 1;
            }
            this._pools[robin].update([id, this._eventId++, 1, estimatedEntropy, t, 1, data | 0]);
            break;
          case "object":
            objName = Object.prototype.toString.call(data);
            if (objName === "[object Uint32Array]") {
              tmp = [];
              for (i = 0; i < data.length; i++) {
                tmp.push(data[i]);
              }
              data = tmp;
            } else {
              if (objName !== "[object Array]") {
                err = 1;
              }
              for (i = 0; i < data.length && !err; i++) {
                if (typeof data[i] !== "number") {
                  err = 1;
                }
              }
            }
            if (!err) {
              if (estimatedEntropy === void 0) {
                estimatedEntropy = 0;
                for (i = 0; i < data.length; i++) {
                  tmp = data[i];
                  while (tmp > 0) {
                    estimatedEntropy++;
                    tmp = tmp >>> 1;
                  }
                }
              }
              this._pools[robin].update([id, this._eventId++, 2, estimatedEntropy, t, data.length].concat(data));
            }
            break;
          case "string":
            if (estimatedEntropy === void 0) {
              estimatedEntropy = data.length;
            }
            this._pools[robin].update([id, this._eventId++, 3, estimatedEntropy, t, data.length]);
            this._pools[robin].update(data);
            break;
          default:
            err = 1;
        }
        if (err) {
          throw new sjcl2.exception.bug("random: addEntropy only supports number, array of numbers or string");
        }
        this._poolEntropy[robin] += estimatedEntropy;
        this._poolStrength += estimatedEntropy;
        if (oldReady === this._NOT_READY) {
          if (this.isReady() !== this._NOT_READY) {
            this._fireEvent("seeded", Math.max(this._strength, this._poolStrength));
          }
          this._fireEvent("progress", this.getProgress());
        }
      },
      /** Is the generator ready? */
      isReady: function(paranoia) {
        var entropyRequired = this._PARANOIA_LEVELS[paranoia !== void 0 ? paranoia : this._defaultParanoia];
        if (this._strength && this._strength >= entropyRequired) {
          return this._poolEntropy[0] > this._BITS_PER_RESEED && (/* @__PURE__ */ new Date()).valueOf() > this._nextReseed ? this._REQUIRES_RESEED | this._READY : this._READY;
        } else {
          return this._poolStrength >= entropyRequired ? this._REQUIRES_RESEED | this._NOT_READY : this._NOT_READY;
        }
      },
      /** Get the generator's progress toward readiness, as a fraction */
      getProgress: function(paranoia) {
        var entropyRequired = this._PARANOIA_LEVELS[paranoia ? paranoia : this._defaultParanoia];
        if (this._strength >= entropyRequired) {
          return 1;
        } else {
          return this._poolStrength > entropyRequired ? 1 : this._poolStrength / entropyRequired;
        }
      },
      /** start the built-in entropy collectors */
      startCollectors: function() {
        if (this._collectorsStarted) {
          return;
        }
        this._eventListener = {
          loadTimeCollector: this._bind(this._loadTimeCollector),
          mouseCollector: this._bind(this._mouseCollector),
          keyboardCollector: this._bind(this._keyboardCollector),
          accelerometerCollector: this._bind(this._accelerometerCollector),
          touchCollector: this._bind(this._touchCollector)
        };
        if (window.addEventListener) {
          window.addEventListener("load", this._eventListener.loadTimeCollector, false);
          window.addEventListener("mousemove", this._eventListener.mouseCollector, false);
          window.addEventListener("keypress", this._eventListener.keyboardCollector, false);
          window.addEventListener("devicemotion", this._eventListener.accelerometerCollector, false);
          window.addEventListener("touchmove", this._eventListener.touchCollector, false);
        } else if (document.attachEvent) {
          document.attachEvent("onload", this._eventListener.loadTimeCollector);
          document.attachEvent("onmousemove", this._eventListener.mouseCollector);
          document.attachEvent("keypress", this._eventListener.keyboardCollector);
        } else {
          throw new sjcl2.exception.bug("can't attach event");
        }
        this._collectorsStarted = true;
      },
      /** stop the built-in entropy collectors */
      stopCollectors: function() {
        if (!this._collectorsStarted) {
          return;
        }
        if (window.removeEventListener) {
          window.removeEventListener("load", this._eventListener.loadTimeCollector, false);
          window.removeEventListener("mousemove", this._eventListener.mouseCollector, false);
          window.removeEventListener("keypress", this._eventListener.keyboardCollector, false);
          window.removeEventListener("devicemotion", this._eventListener.accelerometerCollector, false);
          window.removeEventListener("touchmove", this._eventListener.touchCollector, false);
        } else if (document.detachEvent) {
          document.detachEvent("onload", this._eventListener.loadTimeCollector);
          document.detachEvent("onmousemove", this._eventListener.mouseCollector);
          document.detachEvent("keypress", this._eventListener.keyboardCollector);
        }
        this._collectorsStarted = false;
      },
      /* use a cookie to store entropy.
      useCookie: function (all_cookies) {
          throw new sjcl.exception.bug("random: useCookie is unimplemented");
      },*/
      /** add an event listener for progress or seeded-ness. */
      addEventListener: function(name, callback) {
        this._callbacks[name][this._callbackI++] = callback;
      },
      /** remove an event listener for progress or seeded-ness */
      removeEventListener: function(name, cb) {
        var i, j, cbs = this._callbacks[name], jsTemp = [];
        for (j in cbs) {
          if (cbs.hasOwnProperty(j) && cbs[j] === cb) {
            jsTemp.push(j);
          }
        }
        for (i = 0; i < jsTemp.length; i++) {
          j = jsTemp[i];
          delete cbs[j];
        }
      },
      _bind: function(func) {
        var that = this;
        return function() {
          func.apply(that, arguments);
        };
      },
      /** Generate 4 random words, no reseed, no gate.
       * @private
       */
      _gen4words: function() {
        for (var i = 0; i < 4; i++) {
          this._counter[i] = this._counter[i] + 1 | 0;
          if (this._counter[i]) {
            break;
          }
        }
        return this._cipher.encrypt(this._counter);
      },
      /* Rekey the AES instance with itself after a request, or every _MAX_WORDS_PER_BURST words.
       * @private
       */
      _gate: function() {
        this._key = this._gen4words().concat(this._gen4words());
        this._cipher = new sjcl2.cipher.aes(this._key);
      },
      /** Reseed the generator with the given words
       * @private
       */
      _reseed: function(seedWords) {
        this._key = sjcl2.hash.sha256.hash(this._key.concat(seedWords));
        this._cipher = new sjcl2.cipher.aes(this._key);
        for (var i = 0; i < 4; i++) {
          this._counter[i] = this._counter[i] + 1 | 0;
          if (this._counter[i]) {
            break;
          }
        }
      },
      /** reseed the data from the entropy pools
       * @param full If set, use all the entropy pools in the reseed.
       */
      _reseedFromPools: function(full) {
        var reseedData = [], strength = 0, i;
        this._nextReseed = reseedData[0] = (/* @__PURE__ */ new Date()).valueOf() + this._MILLISECONDS_PER_RESEED;
        for (i = 0; i < 16; i++) {
          reseedData.push(Math.random() * 4294967296 | 0);
        }
        for (i = 0; i < this._pools.length; i++) {
          reseedData = reseedData.concat(this._pools[i].finalize());
          strength += this._poolEntropy[i];
          this._poolEntropy[i] = 0;
          if (!full && this._reseedCount & 1 << i) {
            break;
          }
        }
        if (this._reseedCount >= 1 << this._pools.length) {
          this._pools.push(new sjcl2.hash.sha256());
          this._poolEntropy.push(0);
        }
        this._poolStrength -= strength;
        if (strength > this._strength) {
          this._strength = strength;
        }
        this._reseedCount++;
        this._reseed(reseedData);
      },
      _keyboardCollector: function() {
        this._addCurrentTimeToEntropy(1);
      },
      _mouseCollector: function(ev) {
        var x, y;
        try {
          x = ev.x || ev.clientX || ev.offsetX || 0;
          y = ev.y || ev.clientY || ev.offsetY || 0;
        } catch (err) {
          x = 0;
          y = 0;
        }
        if (x != 0 && y != 0) {
          this.addEntropy([x, y], 2, "mouse");
        }
        this._addCurrentTimeToEntropy(0);
      },
      _touchCollector: function(ev) {
        var touch = ev.touches[0] || ev.changedTouches[0];
        var x = touch.pageX || touch.clientX, y = touch.pageY || touch.clientY;
        this.addEntropy([x, y], 1, "touch");
        this._addCurrentTimeToEntropy(0);
      },
      _loadTimeCollector: function() {
        this._addCurrentTimeToEntropy(2);
      },
      _addCurrentTimeToEntropy: function(estimatedEntropy) {
        if (typeof window !== "undefined" && window.performance && typeof window.performance.now === "function") {
          this.addEntropy(window.performance.now(), estimatedEntropy, "loadtime");
        } else {
          this.addEntropy((/* @__PURE__ */ new Date()).valueOf(), estimatedEntropy, "loadtime");
        }
      },
      _accelerometerCollector: function(ev) {
        var ac = ev.accelerationIncludingGravity.x || ev.accelerationIncludingGravity.y || ev.accelerationIncludingGravity.z;
        if (window.orientation) {
          var or = window.orientation;
          if (typeof or === "number") {
            this.addEntropy(or, 1, "accelerometer");
          }
        }
        if (ac) {
          this.addEntropy(ac, 2, "accelerometer");
        }
        this._addCurrentTimeToEntropy(0);
      },
      _fireEvent: function(name, arg) {
        var j, cbs = sjcl2.random._callbacks[name], cbsTemp = [];
        for (j in cbs) {
          if (cbs.hasOwnProperty(j)) {
            cbsTemp.push(cbs[j]);
          }
        }
        for (j = 0; j < cbsTemp.length; j++) {
          cbsTemp[j](arg);
        }
      }
    };
    sjcl2.random = new sjcl2.prng(6);
    (function() {
      function getCryptoModule() {
        try {
          return __require("crypto");
        } catch (e) {
          return null;
        }
      }
      try {
        var buf, crypt, ab;
        if (typeof module2 !== "undefined" && module2.exports && (crypt = getCryptoModule()) && crypt.randomBytes) {
          buf = crypt.randomBytes(1024 / 8);
          buf = new Uint32Array(new Uint8Array(buf).buffer);
          sjcl2.random.addEntropy(buf, 1024, "crypto.randomBytes");
        } else if (typeof window !== "undefined" && typeof Uint32Array !== "undefined") {
          ab = new Uint32Array(32);
          if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(ab);
          } else if (window.msCrypto && window.msCrypto.getRandomValues) {
            window.msCrypto.getRandomValues(ab);
          } else {
            return;
          }
          sjcl2.random.addEntropy(ab, 1024, "crypto.getRandomValues");
        } else {
        }
      } catch (e) {
        if (typeof window !== "undefined" && window.console) {
          console.log("There was an error collecting entropy from the browser:");
          console.log(e);
        }
      }
    })();
    sjcl2.json = {
      /** Default values for encryption */
      defaults: { v: 1, iter: 1e4, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes" },
      /** Simple encryption function.
       * @param {String|bitArray} password The password or key.
       * @param {String} plaintext The data to encrypt.
       * @param {Object} [params] The parameters including tag, iv and salt.
       * @param {Object} [rp] A returned version with filled-in parameters.
       * @return {Object} The cipher raw data.
       * @throws {sjcl.exception.invalid} if a parameter is invalid.
       */
      _encrypt: function(password, plaintext, params, rp) {
        params = params || {};
        rp = rp || {};
        var j = sjcl2.json, p = j._add({ iv: sjcl2.random.randomWords(4, 0) }, j.defaults), tmp, prp, adata;
        j._add(p, params);
        adata = p.adata;
        if (typeof p.salt === "string") {
          p.salt = sjcl2.codec.base64.toBits(p.salt);
        }
        if (typeof p.iv === "string") {
          p.iv = sjcl2.codec.base64.toBits(p.iv);
        }
        if (!sjcl2.mode[p.mode] || !sjcl2.cipher[p.cipher] || typeof password === "string" && p.iter <= 100 || p.ts !== 64 && p.ts !== 96 && p.ts !== 128 || p.ks !== 128 && p.ks !== 192 && p.ks !== 256 || (p.iv.length < 2 || p.iv.length > 4)) {
          throw new sjcl2.exception.invalid("json encrypt: invalid parameters");
        }
        if (typeof password === "string") {
          tmp = sjcl2.misc.cachedPbkdf2(password, p);
          password = tmp.key.slice(0, p.ks / 32);
          p.salt = tmp.salt;
        } else if (sjcl2.ecc && password instanceof sjcl2.ecc.elGamal.publicKey) {
          tmp = password.kem();
          p.kemtag = tmp.tag;
          password = tmp.key.slice(0, p.ks / 32);
        }
        if (typeof plaintext === "string") {
          plaintext = sjcl2.codec.utf8String.toBits(plaintext);
        }
        if (typeof adata === "string") {
          p.adata = adata = sjcl2.codec.utf8String.toBits(adata);
        }
        prp = new sjcl2.cipher[p.cipher](password);
        j._add(rp, p);
        rp.key = password;
        if (p.mode === "ccm" && sjcl2.arrayBuffer && sjcl2.arrayBuffer.ccm && plaintext instanceof ArrayBuffer) {
          p.ct = sjcl2.arrayBuffer.ccm.encrypt(prp, plaintext, p.iv, adata, p.ts);
        } else {
          p.ct = sjcl2.mode[p.mode].encrypt(prp, plaintext, p.iv, adata, p.ts);
        }
        return p;
      },
      /** Simple encryption function.
       * @param {String|bitArray} password The password or key.
       * @param {String} plaintext The data to encrypt.
       * @param {Object} [params] The parameters including tag, iv and salt.
       * @param {Object} [rp] A returned version with filled-in parameters.
       * @return {String} The ciphertext serialized data.
       * @throws {sjcl.exception.invalid} if a parameter is invalid.
       */
      encrypt: function(password, plaintext, params, rp) {
        var j = sjcl2.json, p = j._encrypt.apply(j, arguments);
        return j.encode(p);
      },
      /** Simple decryption function.
       * @param {String|bitArray} password The password or key.
       * @param {Object} ciphertext The cipher raw data to decrypt.
       * @param {Object} [params] Additional non-default parameters.
       * @param {Object} [rp] A returned object with filled parameters.
       * @return {String} The plaintext.
       * @throws {sjcl.exception.invalid} if a parameter is invalid.
       * @throws {sjcl.exception.corrupt} if the ciphertext is corrupt.
       */
      _decrypt: function(password, ciphertext, params, rp) {
        params = params || {};
        rp = rp || {};
        var j = sjcl2.json, p = j._add(j._add(j._add({}, j.defaults), ciphertext), params, true), ct, tmp, prp, adata = p.adata;
        if (typeof p.salt === "string") {
          p.salt = sjcl2.codec.base64.toBits(p.salt);
        }
        if (typeof p.iv === "string") {
          p.iv = sjcl2.codec.base64.toBits(p.iv);
        }
        if (!sjcl2.mode[p.mode] || !sjcl2.cipher[p.cipher] || typeof password === "string" && p.iter <= 100 || p.ts !== 64 && p.ts !== 96 && p.ts !== 128 || p.ks !== 128 && p.ks !== 192 && p.ks !== 256 || !p.iv || (p.iv.length < 2 || p.iv.length > 4)) {
          throw new sjcl2.exception.invalid("json decrypt: invalid parameters");
        }
        if (typeof password === "string") {
          tmp = sjcl2.misc.cachedPbkdf2(password, p);
          password = tmp.key.slice(0, p.ks / 32);
          p.salt = tmp.salt;
        } else if (sjcl2.ecc && password instanceof sjcl2.ecc.elGamal.secretKey) {
          password = password.unkem(sjcl2.codec.base64.toBits(p.kemtag)).slice(0, p.ks / 32);
        }
        if (typeof adata === "string") {
          adata = sjcl2.codec.utf8String.toBits(adata);
        }
        prp = new sjcl2.cipher[p.cipher](password);
        if (p.mode === "ccm" && sjcl2.arrayBuffer && sjcl2.arrayBuffer.ccm && p.ct instanceof ArrayBuffer) {
          ct = sjcl2.arrayBuffer.ccm.decrypt(prp, p.ct, p.iv, p.tag, adata, p.ts);
        } else {
          ct = sjcl2.mode[p.mode].decrypt(prp, p.ct, p.iv, adata, p.ts);
        }
        j._add(rp, p);
        rp.key = password;
        if (params.raw === 1) {
          return ct;
        } else {
          return sjcl2.codec.utf8String.fromBits(ct);
        }
      },
      /** Simple decryption function.
       * @param {String|bitArray} password The password or key.
       * @param {String} ciphertext The ciphertext to decrypt.
       * @param {Object} [params] Additional non-default parameters.
       * @param {Object} [rp] A returned object with filled parameters.
       * @return {String} The plaintext.
       * @throws {sjcl.exception.invalid} if a parameter is invalid.
       * @throws {sjcl.exception.corrupt} if the ciphertext is corrupt.
       */
      decrypt: function(password, ciphertext, params, rp) {
        var j = sjcl2.json;
        return j._decrypt(password, j.decode(ciphertext), params, rp);
      },
      /** Encode a flat structure into a JSON string.
       * @param {Object} obj The structure to encode.
       * @return {String} A JSON string.
       * @throws {sjcl.exception.invalid} if obj has a non-alphanumeric property.
       * @throws {sjcl.exception.bug} if a parameter has an unsupported type.
       */
      encode: function(obj) {
        var i, out = "{", comma = "";
        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (!i.match(/^[a-z0-9]+$/i)) {
              throw new sjcl2.exception.invalid("json encode: invalid property name");
            }
            out += comma + '"' + i + '":';
            comma = ",";
            switch (typeof obj[i]) {
              case "number":
              case "boolean":
                out += obj[i];
                break;
              case "string":
                out += '"' + escape(obj[i]) + '"';
                break;
              case "object":
                out += '"' + sjcl2.codec.base64.fromBits(obj[i], 0) + '"';
                break;
              default:
                throw new sjcl2.exception.bug("json encode: unsupported type");
            }
          }
        }
        return out + "}";
      },
      /** Decode a simple (flat) JSON string into a structure.  The ciphertext,
       * adata, salt and iv will be base64-decoded.
       * @param {String} str The string.
       * @return {Object} The decoded structure.
       * @throws {sjcl.exception.invalid} if str isn't (simple) JSON.
       */
      decode: function(str) {
        str = str.replace(/\s/g, "");
        if (!str.match(/^\{.*\}$/)) {
          throw new sjcl2.exception.invalid("json decode: this isn't json!");
        }
        var a = str.replace(/^\{|\}$/g, "").split(/,/), out = {}, i, m;
        for (i = 0; i < a.length; i++) {
          if (!(m = a[i].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i))) {
            throw new sjcl2.exception.invalid("json decode: this isn't json!");
          }
          if (m[3] != null) {
            out[m[2]] = parseInt(m[3], 10);
          } else if (m[4] != null) {
            out[m[2]] = m[2].match(/^(ct|adata|salt|iv)$/) ? sjcl2.codec.base64.toBits(m[4]) : unescape(m[4]);
          } else if (m[5] != null) {
            out[m[2]] = m[5] === "true";
          }
        }
        return out;
      },
      /** Insert all elements of src into target, modifying and returning target.
       * @param {Object} target The object to be modified.
       * @param {Object} src The object to pull data from.
       * @param {boolean} [requireSame=false] If true, throw an exception if any field of target differs from corresponding field of src.
       * @return {Object} target.
       * @private
       */
      _add: function(target, src, requireSame) {
        if (target === void 0) {
          target = {};
        }
        if (src === void 0) {
          return target;
        }
        var i;
        for (i in src) {
          if (src.hasOwnProperty(i)) {
            if (requireSame && target[i] !== void 0 && target[i] !== src[i]) {
              throw new sjcl2.exception.invalid("required parameter overridden");
            }
            target[i] = src[i];
          }
        }
        return target;
      },
      /** Remove all elements of minus from plus.  Does not modify plus.
       * @private
       */
      _subtract: function(plus, minus) {
        var out = {}, i;
        for (i in plus) {
          if (plus.hasOwnProperty(i) && plus[i] !== minus[i]) {
            out[i] = plus[i];
          }
        }
        return out;
      },
      /** Return only the specified elements of src.
       * @private
       */
      _filter: function(src, filter) {
        var out = {}, i;
        for (i = 0; i < filter.length; i++) {
          if (src[filter[i]] !== void 0) {
            out[filter[i]] = src[filter[i]];
          }
        }
        return out;
      }
    };
    sjcl2.encrypt = sjcl2.json.encrypt;
    sjcl2.decrypt = sjcl2.json.decrypt;
    sjcl2.misc._pbkdf2Cache = {};
    sjcl2.misc.cachedPbkdf2 = function(password, obj) {
      var cache = sjcl2.misc._pbkdf2Cache, c, cp, str, salt, iter;
      obj = obj || {};
      iter = obj.iter || 1e3;
      cp = cache[password] = cache[password] || {};
      c = cp[iter] = cp[iter] || { firstSalt: obj.salt && obj.salt.length ? obj.salt.slice(0) : sjcl2.random.randomWords(2, 0) };
      salt = obj.salt === void 0 ? c.firstSalt : obj.salt;
      c[salt] = c[salt] || sjcl2.misc.pbkdf2(password, salt, obj.iter);
      return { key: c[salt].slice(0), salt: salt.slice(0) };
    };
    sjcl2.bn = function(it) {
      this.initWith(it);
    };
    sjcl2.bn.prototype = {
      radix: 24,
      maxMul: 8,
      _class: sjcl2.bn,
      copy: function() {
        return new this._class(this);
      },
      /**
       * Initializes this with it, either as a bn, a number, or a hex string.
       */
      initWith: function(it) {
        var i = 0, k;
        switch (typeof it) {
          case "object":
            this.limbs = it.limbs.slice(0);
            break;
          case "number":
            this.limbs = [it];
            this.normalize();
            break;
          case "string":
            it = it.replace(/^0x/, "");
            this.limbs = [];
            k = this.radix / 4;
            for (i = 0; i < it.length; i += k) {
              this.limbs.push(parseInt(it.substring(Math.max(it.length - i - k, 0), it.length - i), 16));
            }
            break;
          default:
            this.limbs = [0];
        }
        return this;
      },
      /**
       * Returns true if "this" and "that" are equal.  Calls fullReduce().
       * Equality test is in constant time.
       */
      equals: function(that) {
        if (typeof that === "number") {
          that = new this._class(that);
        }
        var difference = 0, i;
        this.fullReduce();
        that.fullReduce();
        for (i = 0; i < this.limbs.length || i < that.limbs.length; i++) {
          difference |= this.getLimb(i) ^ that.getLimb(i);
        }
        return difference === 0;
      },
      /**
       * Get the i'th limb of this, zero if i is too large.
       */
      getLimb: function(i) {
        return i >= this.limbs.length ? 0 : this.limbs[i];
      },
      /**
       * Constant time comparison function.
       * Returns 1 if this >= that, or zero otherwise.
       */
      greaterEquals: function(that) {
        if (typeof that === "number") {
          that = new this._class(that);
        }
        var less = 0, greater = 0, i, a, b;
        i = Math.max(this.limbs.length, that.limbs.length) - 1;
        for (; i >= 0; i--) {
          a = this.getLimb(i);
          b = that.getLimb(i);
          greater |= b - a & ~less;
          less |= a - b & ~greater;
        }
        return (greater | ~less) >>> 31;
      },
      /**
       * Convert to a hex string.
       */
      toString: function() {
        this.fullReduce();
        var out = "", i, s, l = this.limbs;
        for (i = 0; i < this.limbs.length; i++) {
          s = l[i].toString(16);
          while (i < this.limbs.length - 1 && s.length < 6) {
            s = "0" + s;
          }
          out = s + out;
        }
        return "0x" + out;
      },
      /** this += that.  Does not normalize. */
      addM: function(that) {
        if (typeof that !== "object") {
          that = new this._class(that);
        }
        var i, l = this.limbs, ll = that.limbs;
        for (i = l.length; i < ll.length; i++) {
          l[i] = 0;
        }
        for (i = 0; i < ll.length; i++) {
          l[i] += ll[i];
        }
        return this;
      },
      /** this *= 2.  Requires normalized; ends up normalized. */
      doubleM: function() {
        var i, carry = 0, tmp, r = this.radix, m = this.radixMask, l = this.limbs;
        for (i = 0; i < l.length; i++) {
          tmp = l[i];
          tmp = tmp + tmp + carry;
          l[i] = tmp & m;
          carry = tmp >> r;
        }
        if (carry) {
          l.push(carry);
        }
        return this;
      },
      /** this /= 2, rounded down.  Requires normalized; ends up normalized. */
      halveM: function() {
        var i, carry = 0, tmp, r = this.radix, l = this.limbs;
        for (i = l.length - 1; i >= 0; i--) {
          tmp = l[i];
          l[i] = tmp + carry >> 1;
          carry = (tmp & 1) << r;
        }
        if (!l[l.length - 1]) {
          l.pop();
        }
        return this;
      },
      /** this -= that.  Does not normalize. */
      subM: function(that) {
        if (typeof that !== "object") {
          that = new this._class(that);
        }
        var i, l = this.limbs, ll = that.limbs;
        for (i = l.length; i < ll.length; i++) {
          l[i] = 0;
        }
        for (i = 0; i < ll.length; i++) {
          l[i] -= ll[i];
        }
        return this;
      },
      mod: function(that) {
        var neg = !this.greaterEquals(new sjcl2.bn(0));
        that = new sjcl2.bn(that).normalize();
        var out = new sjcl2.bn(this).normalize(), ci = 0;
        if (neg)
          out = new sjcl2.bn(0).subM(out).normalize();
        for (; out.greaterEquals(that); ci++) {
          that.doubleM();
        }
        if (neg)
          out = that.sub(out).normalize();
        for (; ci > 0; ci--) {
          that.halveM();
          if (out.greaterEquals(that)) {
            out.subM(that).normalize();
          }
        }
        return out.trim();
      },
      /** return inverse mod prime p.  p must be odd. Binary extended Euclidean algorithm mod p. */
      inverseMod: function(p) {
        var a = new sjcl2.bn(1), b = new sjcl2.bn(0), x = new sjcl2.bn(this), y = new sjcl2.bn(p), tmp, i, nz = 1;
        if (!(p.limbs[0] & 1)) {
          throw new sjcl2.exception.invalid("inverseMod: p must be odd");
        }
        do {
          if (x.limbs[0] & 1) {
            if (!x.greaterEquals(y)) {
              tmp = x;
              x = y;
              y = tmp;
              tmp = a;
              a = b;
              b = tmp;
            }
            x.subM(y);
            x.normalize();
            if (!a.greaterEquals(b)) {
              a.addM(p);
            }
            a.subM(b);
          }
          x.halveM();
          if (a.limbs[0] & 1) {
            a.addM(p);
          }
          a.normalize();
          a.halveM();
          for (i = nz = 0; i < x.limbs.length; i++) {
            nz |= x.limbs[i];
          }
        } while (nz);
        if (!y.equals(1)) {
          throw new sjcl2.exception.invalid("inverseMod: p and x must be relatively prime");
        }
        return b;
      },
      /** this + that.  Does not normalize. */
      add: function(that) {
        return this.copy().addM(that);
      },
      /** this - that.  Does not normalize. */
      sub: function(that) {
        return this.copy().subM(that);
      },
      /** this * that.  Normalizes and reduces. */
      mul: function(that) {
        if (typeof that === "number") {
          that = new this._class(that);
        } else {
          that.normalize();
        }
        this.normalize();
        var i, j, a = this.limbs, b = that.limbs, al = a.length, bl = b.length, out = new this._class(), c = out.limbs, ai, ii = this.maxMul;
        for (i = 0; i < this.limbs.length + that.limbs.length + 1; i++) {
          c[i] = 0;
        }
        for (i = 0; i < al; i++) {
          ai = a[i];
          for (j = 0; j < bl; j++) {
            c[i + j] += ai * b[j];
          }
          if (!--ii) {
            ii = this.maxMul;
            out.cnormalize();
          }
        }
        return out.cnormalize().reduce();
      },
      /** this ^ 2.  Normalizes and reduces. */
      square: function() {
        return this.mul(this);
      },
      /** this ^ n.  Uses square-and-multiply.  Normalizes and reduces. */
      power: function(l) {
        l = new sjcl2.bn(l).normalize().trim().limbs;
        var i, j, out = new this._class(1), pow = this;
        for (i = 0; i < l.length; i++) {
          for (j = 0; j < this.radix; j++) {
            if (l[i] & 1 << j) {
              out = out.mul(pow);
            }
            if (i == l.length - 1 && l[i] >> j + 1 == 0) {
              break;
            }
            pow = pow.square();
          }
        }
        return out;
      },
      /** this * that mod N */
      mulmod: function(that, N) {
        return this.mod(N).mul(that.mod(N)).mod(N);
      },
      /** this ^ x mod N */
      powermod: function(x, N) {
        x = new sjcl2.bn(x);
        N = new sjcl2.bn(N);
        if ((N.limbs[0] & 1) == 1) {
          var montOut = this.montpowermod(x, N);
          if (montOut != false) {
            return montOut;
          }
        }
        var i, j, l = x.normalize().trim().limbs, out = new this._class(1), pow = this;
        for (i = 0; i < l.length; i++) {
          for (j = 0; j < this.radix; j++) {
            if (l[i] & 1 << j) {
              out = out.mulmod(pow, N);
            }
            if (i == l.length - 1 && l[i] >> j + 1 == 0) {
              break;
            }
            pow = pow.mulmod(pow, N);
          }
        }
        return out;
      },
      /** this ^ x mod N with Montomery reduction */
      montpowermod: function(x, N) {
        x = new sjcl2.bn(x).normalize().trim();
        N = new sjcl2.bn(N);
        var i, j, radix = this.radix, out = new this._class(1), pow = this.copy();
        var R, s, wind, bitsize = x.bitLength();
        R = new sjcl2.bn({
          limbs: N.copy().normalize().trim().limbs.map(function() {
            return 0;
          })
        });
        for (s = this.radix; s > 0; s--) {
          if ((N.limbs[N.limbs.length - 1] >> s & 1) == 1) {
            R.limbs[R.limbs.length - 1] = 1 << s;
            break;
          }
        }
        if (bitsize == 0) {
          return this;
        } else if (bitsize < 18) {
          wind = 1;
        } else if (bitsize < 48) {
          wind = 3;
        } else if (bitsize < 144) {
          wind = 4;
        } else if (bitsize < 768) {
          wind = 5;
        } else {
          wind = 6;
        }
        var RR = R.copy(), NN = N.copy(), RP = new sjcl2.bn(1), NP = new sjcl2.bn(0), RT = R.copy();
        while (RT.greaterEquals(1)) {
          RT.halveM();
          if ((RP.limbs[0] & 1) == 0) {
            RP.halveM();
            NP.halveM();
          } else {
            RP.addM(NN);
            RP.halveM();
            NP.halveM();
            NP.addM(RR);
          }
        }
        RP = RP.normalize();
        NP = NP.normalize();
        RR.doubleM();
        var R2 = RR.mulmod(RR, N);
        if (!RR.mul(RP).sub(N.mul(NP)).equals(1)) {
          return false;
        }
        var montIn = function(c) {
          return montMul(c, R2);
        }, montMul = function(a, b) {
          var k, ab, right, abBar, mask = (1 << s + 1) - 1;
          ab = a.mul(b);
          right = ab.mul(NP);
          right.limbs = right.limbs.slice(0, R.limbs.length);
          if (right.limbs.length == R.limbs.length) {
            right.limbs[R.limbs.length - 1] &= mask;
          }
          right = right.mul(N);
          abBar = ab.add(right).normalize().trim();
          abBar.limbs = abBar.limbs.slice(R.limbs.length - 1);
          for (k = 0; k < abBar.limbs.length; k++) {
            if (k > 0) {
              abBar.limbs[k - 1] |= (abBar.limbs[k] & mask) << radix - s - 1;
            }
            abBar.limbs[k] = abBar.limbs[k] >> s + 1;
          }
          if (abBar.greaterEquals(N)) {
            abBar.subM(N);
          }
          return abBar;
        }, montOut = function(c) {
          return montMul(c, 1);
        };
        pow = montIn(pow);
        out = montIn(out);
        var h, precomp = {}, cap = (1 << wind - 1) - 1;
        precomp[1] = pow.copy();
        precomp[2] = montMul(pow, pow);
        for (h = 1; h <= cap; h++) {
          precomp[2 * h + 1] = montMul(precomp[2 * h - 1], precomp[2]);
        }
        var getBit = function(exp, i2) {
          var off = i2 % exp.radix;
          return (exp.limbs[Math.floor(i2 / exp.radix)] & 1 << off) >> off;
        };
        for (i = x.bitLength() - 1; i >= 0; ) {
          if (getBit(x, i) == 0) {
            out = montMul(out, out);
            i = i - 1;
          } else {
            var l = i - wind + 1;
            while (getBit(x, l) == 0) {
              l++;
            }
            var indx = 0;
            for (j = l; j <= i; j++) {
              indx += getBit(x, j) << j - l;
              out = montMul(out, out);
            }
            out = montMul(out, precomp[indx]);
            i = l - 1;
          }
        }
        return montOut(out);
      },
      trim: function() {
        var l = this.limbs, p;
        do {
          p = l.pop();
        } while (l.length && p === 0);
        l.push(p);
        return this;
      },
      /** Reduce mod a modulus.  Stubbed for subclassing. */
      reduce: function() {
        return this;
      },
      /** Reduce and normalize. */
      fullReduce: function() {
        return this.normalize();
      },
      /** Propagate carries. */
      normalize: function() {
        var carry = 0, i, pv = this.placeVal, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
        for (i = 0; i < ll || carry !== 0 && carry !== -1; i++) {
          l = (limbs[i] || 0) + carry;
          m = limbs[i] = l & mask;
          carry = (l - m) * ipv;
        }
        if (carry === -1) {
          limbs[i - 1] -= pv;
        }
        this.trim();
        return this;
      },
      /** Constant-time normalize. Does not allocate additional space. */
      cnormalize: function() {
        var carry = 0, i, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
        for (i = 0; i < ll - 1; i++) {
          l = limbs[i] + carry;
          m = limbs[i] = l & mask;
          carry = (l - m) * ipv;
        }
        limbs[i] += carry;
        return this;
      },
      /** Serialize to a bit array */
      toBits: function(len) {
        this.fullReduce();
        len = len || this.exponent || this.bitLength();
        var i = Math.floor((len - 1) / 24), w = sjcl2.bitArray, e = (len + 7 & -8) % this.radix || this.radix, out = [w.partial(e, this.getLimb(i))];
        for (i--; i >= 0; i--) {
          out = w.concat(out, [w.partial(Math.min(this.radix, len), this.getLimb(i))]);
          len -= this.radix;
        }
        return out;
      },
      /** Return the length in bits, rounded up to the nearest byte. */
      bitLength: function() {
        this.fullReduce();
        var out = this.radix * (this.limbs.length - 1), b = this.limbs[this.limbs.length - 1];
        for (; b; b >>>= 1) {
          out++;
        }
        return out + 7 & -8;
      }
    };
    sjcl2.bn.fromBits = function(bits) {
      var Class = this, out = new Class(), words = [], w = sjcl2.bitArray, t = this.prototype, l = Math.min(this.bitLength || 4294967296, w.bitLength(bits)), e = l % t.radix || t.radix;
      words[0] = w.extract(bits, 0, e);
      for (; e < l; e += t.radix) {
        words.unshift(w.extract(bits, e, t.radix));
      }
      out.limbs = words;
      return out;
    };
    sjcl2.bn.prototype.ipv = 1 / (sjcl2.bn.prototype.placeVal = Math.pow(2, sjcl2.bn.prototype.radix));
    sjcl2.bn.prototype.radixMask = (1 << sjcl2.bn.prototype.radix) - 1;
    sjcl2.bn.pseudoMersennePrime = function(exponent, coeff) {
      function p(it) {
        this.initWith(it);
      }
      var ppr = p.prototype = new sjcl2.bn(), i, tmp, mo;
      mo = ppr.modOffset = Math.ceil(tmp = exponent / ppr.radix);
      ppr.exponent = exponent;
      ppr.offset = [];
      ppr.factor = [];
      ppr.minOffset = mo;
      ppr.fullMask = 0;
      ppr.fullOffset = [];
      ppr.fullFactor = [];
      ppr.modulus = p.modulus = new sjcl2.bn(Math.pow(2, exponent));
      ppr.fullMask = 0 | -Math.pow(2, exponent % ppr.radix);
      for (i = 0; i < coeff.length; i++) {
        ppr.offset[i] = Math.floor(coeff[i][0] / ppr.radix - tmp);
        ppr.fullOffset[i] = Math.floor(coeff[i][0] / ppr.radix) - mo + 1;
        ppr.factor[i] = coeff[i][1] * Math.pow(1 / 2, exponent - coeff[i][0] + ppr.offset[i] * ppr.radix);
        ppr.fullFactor[i] = coeff[i][1] * Math.pow(1 / 2, exponent - coeff[i][0] + ppr.fullOffset[i] * ppr.radix);
        ppr.modulus.addM(new sjcl2.bn(Math.pow(2, coeff[i][0]) * coeff[i][1]));
        ppr.minOffset = Math.min(ppr.minOffset, -ppr.offset[i]);
      }
      ppr._class = p;
      ppr.modulus.cnormalize();
      ppr.reduce = function() {
        var i2, k, l, mo2 = this.modOffset, limbs = this.limbs, off = this.offset, ol = this.offset.length, fac = this.factor, ll;
        i2 = this.minOffset;
        while (limbs.length > mo2) {
          l = limbs.pop();
          ll = limbs.length;
          for (k = 0; k < ol; k++) {
            limbs[ll + off[k]] -= fac[k] * l;
          }
          i2--;
          if (!i2) {
            limbs.push(0);
            this.cnormalize();
            i2 = this.minOffset;
          }
        }
        this.cnormalize();
        return this;
      };
      ppr._strongReduce = ppr.fullMask === -1 ? ppr.reduce : function() {
        var limbs = this.limbs, i2 = limbs.length - 1, k, l;
        this.reduce();
        if (i2 === this.modOffset - 1) {
          l = limbs[i2] & this.fullMask;
          limbs[i2] -= l;
          for (k = 0; k < this.fullOffset.length; k++) {
            limbs[i2 + this.fullOffset[k]] -= this.fullFactor[k] * l;
          }
          this.normalize();
        }
      };
      ppr.fullReduce = function() {
        var greater, i2;
        this._strongReduce();
        this.addM(this.modulus);
        this.addM(this.modulus);
        this.normalize();
        this._strongReduce();
        for (i2 = this.limbs.length; i2 < this.modOffset; i2++) {
          this.limbs[i2] = 0;
        }
        greater = this.greaterEquals(this.modulus);
        for (i2 = 0; i2 < this.limbs.length; i2++) {
          this.limbs[i2] -= this.modulus.limbs[i2] * greater;
        }
        this.cnormalize();
        return this;
      };
      ppr.inverse = function() {
        return this.power(this.modulus.sub(2));
      };
      p.fromBits = sjcl2.bn.fromBits;
      return p;
    };
    var sbp2 = sjcl2.bn.pseudoMersennePrime;
    sjcl2.bn.prime = {
      p127: sbp2(127, [[0, -1]]),
      // Bernstein's prime for Curve25519
      p25519: sbp2(255, [[0, -19]]),
      // Koblitz primes
      p192k: sbp2(192, [[32, -1], [12, -1], [8, -1], [7, -1], [6, -1], [3, -1], [0, -1]]),
      p224k: sbp2(224, [[32, -1], [12, -1], [11, -1], [9, -1], [7, -1], [4, -1], [1, -1], [0, -1]]),
      p256k: sbp2(256, [[32, -1], [9, -1], [8, -1], [7, -1], [6, -1], [4, -1], [0, -1]]),
      // NIST primes
      p192: sbp2(192, [[0, -1], [64, -1]]),
      p224: sbp2(224, [[0, 1], [96, -1]]),
      p256: sbp2(256, [[0, -1], [96, 1], [192, 1], [224, -1]]),
      p384: sbp2(384, [[0, -1], [32, 1], [96, -1], [128, -1]]),
      p521: sbp2(521, [[0, -1]])
    };
    sjcl2.bn.random = function(modulus, paranoia) {
      if (typeof modulus !== "object") {
        modulus = new sjcl2.bn(modulus);
      }
      var words, i, l = modulus.limbs.length, m = modulus.limbs[l - 1] + 1, out = new sjcl2.bn();
      while (true) {
        do {
          words = sjcl2.random.randomWords(l, paranoia);
          if (words[l - 1] < 0) {
            words[l - 1] += 4294967296;
          }
        } while (Math.floor(words[l - 1] / m) === Math.floor(4294967296 / m));
        words[l - 1] %= m;
        for (i = 0; i < l - 1; i++) {
          words[i] &= modulus.radixMask;
        }
        out.limbs = words;
        if (!out.greaterEquals(modulus)) {
          return out;
        }
      }
    };
    sjcl2.ecc = {};
    sjcl2.ecc.point = function(curve, x, y) {
      if (x === void 0) {
        this.isIdentity = true;
      } else {
        if (x instanceof sjcl2.bn) {
          x = new curve.field(x);
        }
        if (y instanceof sjcl2.bn) {
          y = new curve.field(y);
        }
        this.x = x;
        this.y = y;
        this.isIdentity = false;
      }
      this.curve = curve;
    };
    sjcl2.ecc.point.prototype = {
      toJac: function() {
        return new sjcl2.ecc.pointJac(this.curve, this.x, this.y, new this.curve.field(1));
      },
      mult: function(k) {
        return this.toJac().mult(k, this).toAffine();
      },
      /**
       * Multiply this point by k, added to affine2*k2, and return the answer in Jacobian coordinates.
       * @param {bigInt} k The coefficient to multiply this by.
       * @param {bigInt} k2 The coefficient to multiply affine2 this by.
       * @param {sjcl.ecc.point} affine The other point in affine coordinates.
       * @return {sjcl.ecc.pointJac} The result of the multiplication and addition, in Jacobian coordinates.
       */
      mult2: function(k, k2, affine2) {
        return this.toJac().mult2(k, this, k2, affine2).toAffine();
      },
      multiples: function() {
        var m, i, j;
        if (this._multiples === void 0) {
          j = this.toJac().doubl();
          m = this._multiples = [new sjcl2.ecc.point(this.curve), this, j.toAffine()];
          for (i = 3; i < 16; i++) {
            j = j.add(this);
            m.push(j.toAffine());
          }
        }
        return this._multiples;
      },
      negate: function() {
        var newY = new this.curve.field(0).sub(this.y).normalize().reduce();
        return new sjcl2.ecc.point(this.curve, this.x, newY);
      },
      isValid: function() {
        return this.y.square().equals(this.curve.b.add(this.x.mul(this.curve.a.add(this.x.square()))));
      },
      toBits: function() {
        return sjcl2.bitArray.concat(this.x.toBits(), this.y.toBits());
      }
    };
    sjcl2.ecc.pointJac = function(curve, x, y, z) {
      if (x === void 0) {
        this.isIdentity = true;
      } else {
        this.x = x;
        this.y = y;
        this.z = z;
        this.isIdentity = false;
      }
      this.curve = curve;
    };
    sjcl2.ecc.pointJac.prototype = {
      /**
       * Adds S and T and returns the result in Jacobian coordinates. Note that S must be in Jacobian coordinates and T must be in affine coordinates.
       * @param {sjcl.ecc.pointJac} S One of the points to add, in Jacobian coordinates.
       * @param {sjcl.ecc.point} T The other point to add, in affine coordinates.
       * @return {sjcl.ecc.pointJac} The sum of the two points, in Jacobian coordinates.
       */
      add: function(T) {
        var S = this, sz2, c, d, c2, x1, x2, x, y1, y2, y, z;
        if (S.curve !== T.curve) {
          throw new sjcl2.exception.invalid("sjcl.ecc.add(): Points must be on the same curve to add them!");
        }
        if (S.isIdentity) {
          return T.toJac();
        } else if (T.isIdentity) {
          return S;
        }
        sz2 = S.z.square();
        c = T.x.mul(sz2).subM(S.x);
        if (c.equals(0)) {
          if (S.y.equals(T.y.mul(sz2.mul(S.z)))) {
            return S.doubl();
          } else {
            return new sjcl2.ecc.pointJac(S.curve);
          }
        }
        d = T.y.mul(sz2.mul(S.z)).subM(S.y);
        c2 = c.square();
        x1 = d.square();
        x2 = c.square().mul(c).addM(S.x.add(S.x).mul(c2));
        x = x1.subM(x2);
        y1 = S.x.mul(c2).subM(x).mul(d);
        y2 = S.y.mul(c.square().mul(c));
        y = y1.subM(y2);
        z = S.z.mul(c);
        return new sjcl2.ecc.pointJac(this.curve, x, y, z);
      },
      /**
       * doubles this point.
       * @return {sjcl.ecc.pointJac} The doubled point.
       */
      doubl: function() {
        if (this.isIdentity) {
          return this;
        }
        var y2 = this.y.square(), a = y2.mul(this.x.mul(4)), b = y2.square().mul(8), z2 = this.z.square(), c = this.curve.a.toString() == new sjcl2.bn(-3).toString() ? this.x.sub(z2).mul(3).mul(this.x.add(z2)) : this.x.square().mul(3).add(z2.square().mul(this.curve.a)), x = c.square().subM(a).subM(a), y = a.sub(x).mul(c).subM(b), z = this.y.add(this.y).mul(this.z);
        return new sjcl2.ecc.pointJac(this.curve, x, y, z);
      },
      /**
       * Returns a copy of this point converted to affine coordinates.
       * @return {sjcl.ecc.point} The converted point.
       */
      toAffine: function() {
        if (this.isIdentity || this.z.equals(0)) {
          return new sjcl2.ecc.point(this.curve);
        }
        var zi = this.z.inverse(), zi2 = zi.square();
        return new sjcl2.ecc.point(this.curve, this.x.mul(zi2).fullReduce(), this.y.mul(zi2.mul(zi)).fullReduce());
      },
      /**
       * Multiply this point by k and return the answer in Jacobian coordinates.
       * @param {bigInt} k The coefficient to multiply by.
       * @param {sjcl.ecc.point} affine This point in affine coordinates.
       * @return {sjcl.ecc.pointJac} The result of the multiplication, in Jacobian coordinates.
       */
      mult: function(k, affine) {
        if (typeof k === "number") {
          k = [k];
        } else if (k.limbs !== void 0) {
          k = k.normalize().limbs;
        }
        var i, j, out = new sjcl2.ecc.point(this.curve).toJac(), multiples = affine.multiples();
        for (i = k.length - 1; i >= 0; i--) {
          for (j = sjcl2.bn.prototype.radix - 4; j >= 0; j -= 4) {
            out = out.doubl().doubl().doubl().doubl().add(multiples[k[i] >> j & 15]);
          }
        }
        return out;
      },
      /**
       * Multiply this point by k, added to affine2*k2, and return the answer in Jacobian coordinates.
       * @param {bigInt} k The coefficient to multiply this by.
       * @param {sjcl.ecc.point} affine This point in affine coordinates.
       * @param {bigInt} k2 The coefficient to multiply affine2 this by.
       * @param {sjcl.ecc.point} affine The other point in affine coordinates.
       * @return {sjcl.ecc.pointJac} The result of the multiplication and addition, in Jacobian coordinates.
       */
      mult2: function(k1, affine, k2, affine2) {
        if (typeof k1 === "number") {
          k1 = [k1];
        } else if (k1.limbs !== void 0) {
          k1 = k1.normalize().limbs;
        }
        if (typeof k2 === "number") {
          k2 = [k2];
        } else if (k2.limbs !== void 0) {
          k2 = k2.normalize().limbs;
        }
        var i, j, out = new sjcl2.ecc.point(this.curve).toJac(), m1 = affine.multiples(), m2 = affine2.multiples(), l1, l2;
        for (i = Math.max(k1.length, k2.length) - 1; i >= 0; i--) {
          l1 = k1[i] | 0;
          l2 = k2[i] | 0;
          for (j = sjcl2.bn.prototype.radix - 4; j >= 0; j -= 4) {
            out = out.doubl().doubl().doubl().doubl().add(m1[l1 >> j & 15]).add(m2[l2 >> j & 15]);
          }
        }
        return out;
      },
      negate: function() {
        return this.toAffine().negate().toJac();
      },
      isValid: function() {
        var z2 = this.z.square(), z4 = z2.square(), z6 = z4.mul(z2);
        return this.y.square().equals(this.curve.b.mul(z6).add(this.x.mul(this.curve.a.mul(z4).add(this.x.square()))));
      }
    };
    sjcl2.ecc.curve = function(Field, r, a, b, x, y) {
      this.field = Field;
      this.r = new sjcl2.bn(r);
      this.a = new Field(a);
      this.b = new Field(b);
      this.G = new sjcl2.ecc.point(this, new Field(x), new Field(y));
    };
    sjcl2.ecc.curve.prototype.fromBits = function(bits) {
      var w = sjcl2.bitArray, l = this.field.prototype.exponent + 7 & -8, p = new sjcl2.ecc.point(this, this.field.fromBits(w.bitSlice(bits, 0, l)), this.field.fromBits(w.bitSlice(bits, l, 2 * l)));
      if (!p.isValid()) {
        throw new sjcl2.exception.corrupt("not on the curve!");
      }
      return p;
    };
    sjcl2.ecc.curves = {
      c192: new sjcl2.ecc.curve(sjcl2.bn.prime.p192, "0xffffffffffffffffffffffff99def836146bc9b1b4d22831", -3, "0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1", "0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012", "0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),
      c224: new sjcl2.ecc.curve(sjcl2.bn.prime.p224, "0xffffffffffffffffffffffffffff16a2e0b8f03e13dd29455c5c2a3d", -3, "0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4", "0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21", "0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"),
      c256: new sjcl2.ecc.curve(sjcl2.bn.prime.p256, "0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551", -3, "0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b", "0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296", "0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),
      c384: new sjcl2.ecc.curve(sjcl2.bn.prime.p384, "0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973", -3, "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef", "0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7", "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f"),
      c521: new sjcl2.ecc.curve(sjcl2.bn.prime.p521, "0x1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409", -3, "0x051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00", "0xC6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66", "0x11839296A789A3BC0045C8A5FB42C7D1BD998F54449579B446817AFBD17273E662C97EE72995EF42640C550B9013FAD0761353C7086A272C24088BE94769FD16650"),
      k192: new sjcl2.ecc.curve(sjcl2.bn.prime.p192k, "0xfffffffffffffffffffffffe26f2fc170f69466a74defd8d", 0, 3, "0xdb4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d", "0x9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"),
      k224: new sjcl2.ecc.curve(sjcl2.bn.prime.p224k, "0x010000000000000000000000000001dce8d2ec6184caf0a971769fb1f7", 0, 5, "0xa1455b334df099df30fc28a169a467e9e47075a90f7e650eb6b7a45c", "0x7e089fed7fba344282cafbd6f7e319f7c0b0bd59e2ca4bdb556d61a5"),
      k256: new sjcl2.ecc.curve(sjcl2.bn.prime.p256k, "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 0, 7, "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
    };
    sjcl2.ecc.curveName = function(curve) {
      var curcurve;
      for (curcurve in sjcl2.ecc.curves) {
        if (sjcl2.ecc.curves.hasOwnProperty(curcurve)) {
          if (sjcl2.ecc.curves[curcurve] === curve) {
            return curcurve;
          }
        }
      }
      throw new sjcl2.exception.invalid("no such curve");
    };
    sjcl2.ecc.deserialize = function(key) {
      var types = ["elGamal", "ecdsa"];
      if (!key || !key.curve || !sjcl2.ecc.curves[key.curve]) {
        throw new sjcl2.exception.invalid("invalid serialization");
      }
      if (types.indexOf(key.type) === -1) {
        throw new sjcl2.exception.invalid("invalid type");
      }
      var curve = sjcl2.ecc.curves[key.curve];
      if (key.secretKey) {
        if (!key.exponent) {
          throw new sjcl2.exception.invalid("invalid exponent");
        }
        var exponent = new sjcl2.bn(key.exponent);
        return new sjcl2.ecc[key.type].secretKey(curve, exponent);
      } else {
        if (!key.point) {
          throw new sjcl2.exception.invalid("invalid point");
        }
        var point = curve.fromBits(sjcl2.codec.hex.toBits(key.point));
        return new sjcl2.ecc[key.type].publicKey(curve, point);
      }
    };
    sjcl2.ecc.basicKey = {
      /** ecc publicKey.
      * @constructor
      * @param {curve} curve the elliptic curve
      * @param {point} point the point on the curve
      */
      publicKey: function(curve, point) {
        this._curve = curve;
        this._curveBitLength = curve.r.bitLength();
        if (point instanceof Array) {
          this._point = curve.fromBits(point);
        } else {
          this._point = point;
        }
        this.serialize = function() {
          var curveName = sjcl2.ecc.curveName(curve);
          return {
            type: this.getType(),
            secretKey: false,
            point: sjcl2.codec.hex.fromBits(this._point.toBits()),
            curve: curveName
          };
        };
        this.get = function() {
          var pointbits = this._point.toBits();
          var len = sjcl2.bitArray.bitLength(pointbits);
          var x = sjcl2.bitArray.bitSlice(pointbits, 0, len / 2);
          var y = sjcl2.bitArray.bitSlice(pointbits, len / 2);
          return { x, y };
        };
      },
      /** ecc secretKey
      * @constructor
      * @param {curve} curve the elliptic curve
      * @param exponent
      */
      secretKey: function(curve, exponent) {
        this._curve = curve;
        this._curveBitLength = curve.r.bitLength();
        this._exponent = exponent;
        this.serialize = function() {
          var exponent2 = this.get();
          var curveName = sjcl2.ecc.curveName(curve);
          return {
            type: this.getType(),
            secretKey: true,
            exponent: sjcl2.codec.hex.fromBits(exponent2),
            curve: curveName
          };
        };
        this.get = function() {
          return this._exponent.toBits();
        };
      }
    };
    sjcl2.ecc.basicKey.generateKeys = function(cn) {
      return function generateKeys(curve, paranoia, sec) {
        curve = curve || 256;
        if (typeof curve === "number") {
          curve = sjcl2.ecc.curves["c" + curve];
          if (curve === void 0) {
            throw new sjcl2.exception.invalid("no such curve");
          }
        }
        sec = sec || sjcl2.bn.random(curve.r, paranoia);
        var pub = curve.G.mult(sec);
        return {
          pub: new sjcl2.ecc[cn].publicKey(curve, pub),
          sec: new sjcl2.ecc[cn].secretKey(curve, sec)
        };
      };
    };
    sjcl2.ecc.elGamal = {
      /** generate keys
      * @function
      * @param curve
      * @param {int} paranoia Paranoia for generation (default 6)
      * @param {secretKey} sec secret Key to use. used to get the publicKey for ones secretKey
      */
      generateKeys: sjcl2.ecc.basicKey.generateKeys("elGamal"),
      /** elGamal publicKey.
      * @constructor
      * @augments sjcl.ecc.basicKey.publicKey
      */
      publicKey: function(curve, point) {
        sjcl2.ecc.basicKey.publicKey.apply(this, arguments);
      },
      /** elGamal secretKey
      * @constructor
      * @augments sjcl.ecc.basicKey.secretKey
      */
      secretKey: function(curve, exponent) {
        sjcl2.ecc.basicKey.secretKey.apply(this, arguments);
      }
    };
    sjcl2.ecc.elGamal.publicKey.prototype = {
      /** Kem function of elGamal Public Key
      * @param paranoia paranoia to use for randomization.
      * @return {object} key and tag. unkem(tag) with the corresponding secret key results in the key returned.
      */
      kem: function(paranoia) {
        var sec = sjcl2.bn.random(this._curve.r, paranoia), tag = this._curve.G.mult(sec).toBits(), key = sjcl2.hash.sha256.hash(this._point.mult(sec).toBits());
        return { key, tag };
      },
      getType: function() {
        return "elGamal";
      }
    };
    sjcl2.ecc.elGamal.secretKey.prototype = {
      /** UnKem function of elGamal Secret Key
      * @param {bitArray} tag The Tag to decrypt.
      * @return {bitArray} decrypted key.
      */
      unkem: function(tag) {
        return sjcl2.hash.sha256.hash(this._curve.fromBits(tag).mult(this._exponent).toBits());
      },
      /** Diffie-Hellmann function
      * @param {elGamal.publicKey} pk The Public Key to do Diffie-Hellmann with
      * @return {bitArray} diffie-hellmann result for this key combination.
      */
      dh: function(pk) {
        return sjcl2.hash.sha256.hash(pk._point.mult(this._exponent).toBits());
      },
      /** Diffie-Hellmann function, compatible with Java generateSecret
      * @param {elGamal.publicKey} pk The Public Key to do Diffie-Hellmann with
      * @return {bitArray} undigested X value, diffie-hellmann result for this key combination,
      * compatible with Java generateSecret().
      */
      dhJavaEc: function(pk) {
        return pk._point.mult(this._exponent).x.toBits();
      },
      getType: function() {
        return "elGamal";
      }
    };
    sjcl2.ecc.ecdsa = {
      /** generate keys
      * @function
      * @param curve
      * @param {int} paranoia Paranoia for generation (default 6)
      * @param {secretKey} sec secret Key to use. used to get the publicKey for ones secretKey
      */
      generateKeys: sjcl2.ecc.basicKey.generateKeys("ecdsa")
    };
    sjcl2.ecc.ecdsa.publicKey = function(curve, point) {
      sjcl2.ecc.basicKey.publicKey.apply(this, arguments);
    };
    sjcl2.ecc.ecdsa.publicKey.prototype = {
      /** Diffie-Hellmann function
      * @param {bitArray} hash hash to verify.
      * @param {bitArray} rs signature bitArray.
      * @param {boolean}  fakeLegacyVersion use old legacy version
      */
      verify: function(hash, rs, fakeLegacyVersion) {
        if (sjcl2.bitArray.bitLength(hash) > this._curveBitLength) {
          hash = sjcl2.bitArray.clamp(hash, this._curveBitLength);
        }
        var w = sjcl2.bitArray, R = this._curve.r, l = this._curveBitLength, r = sjcl2.bn.fromBits(w.bitSlice(rs, 0, l)), ss = sjcl2.bn.fromBits(w.bitSlice(rs, l, 2 * l)), s = fakeLegacyVersion ? ss : ss.inverseMod(R), hG = sjcl2.bn.fromBits(hash).mul(s).mod(R), hA = r.mul(s).mod(R), r2 = this._curve.G.mult2(hG, hA, this._point).x;
        if (r.equals(0) || ss.equals(0) || r.greaterEquals(R) || ss.greaterEquals(R) || !r2.equals(r)) {
          if (fakeLegacyVersion === void 0) {
            return this.verify(hash, rs, true);
          } else {
            throw new sjcl2.exception.corrupt("signature didn't check out");
          }
        }
        return true;
      },
      getType: function() {
        return "ecdsa";
      }
    };
    sjcl2.ecc.ecdsa.secretKey = function(curve, exponent) {
      sjcl2.ecc.basicKey.secretKey.apply(this, arguments);
    };
    sjcl2.ecc.ecdsa.secretKey.prototype = {
      /** Diffie-Hellmann function
      * @param {bitArray} hash hash to sign.
      * @param {int} paranoia paranoia for random number generation
      * @param {boolean} fakeLegacyVersion use old legacy version
      */
      sign: function(hash, paranoia, fakeLegacyVersion, fixedKForTesting) {
        if (sjcl2.bitArray.bitLength(hash) > this._curveBitLength) {
          hash = sjcl2.bitArray.clamp(hash, this._curveBitLength);
        }
        var R = this._curve.r, l = R.bitLength(), k = fixedKForTesting || sjcl2.bn.random(R.sub(1), paranoia).add(1), r = this._curve.G.mult(k).x.mod(R), ss = sjcl2.bn.fromBits(hash).add(r.mul(this._exponent)), s = fakeLegacyVersion ? ss.inverseMod(R).mul(k).mod(R) : ss.mul(k.inverseMod(R)).mod(R);
        return sjcl2.bitArray.concat(r.toBits(l), s.toBits(l));
      },
      getType: function() {
        return "ecdsa";
      }
    };
    if (typeof ArrayBuffer === "undefined") {
      (function(globals) {
        "use strict";
        globals.ArrayBuffer = function() {
        };
        globals.DataView = function() {
        };
      })(exports);
    }
    sjcl2.codec.arrayBuffer = {
      /** Convert from a bitArray to an ArrayBuffer.
       * Will default to 8byte padding if padding is undefined*/
      fromBits: function(arr, padding, padding_count) {
        var out, i, ol, tmp, smallest;
        padding = padding == void 0 ? true : padding;
        padding_count = padding_count || 8;
        if (arr.length === 0) {
          return new ArrayBuffer(0);
        }
        ol = sjcl2.bitArray.bitLength(arr) / 8;
        if (sjcl2.bitArray.bitLength(arr) % 8 !== 0) {
          throw new sjcl2.exception.invalid("Invalid bit size, must be divisble by 8 to fit in an arraybuffer correctly");
        }
        if (padding && ol % padding_count !== 0) {
          ol += padding_count - ol % padding_count;
        }
        tmp = new DataView(new ArrayBuffer(arr.length * 4));
        for (i = 0; i < arr.length; i++) {
          tmp.setUint32(i * 4, arr[i] << 32);
        }
        out = new DataView(new ArrayBuffer(ol));
        if (out.byteLength === tmp.byteLength) {
          return tmp.buffer;
        }
        smallest = tmp.byteLength < out.byteLength ? tmp.byteLength : out.byteLength;
        for (i = 0; i < smallest; i++) {
          out.setUint8(i, tmp.getUint8(i));
        }
        return out.buffer;
      },
      /** Convert from an ArrayBuffer to a bitArray. */
      toBits: function(buffer) {
        var i, out = [], len, inView, tmp;
        if (buffer.byteLength === 0) {
          return [];
        }
        inView = new DataView(buffer);
        len = inView.byteLength - inView.byteLength % 4;
        for (var i = 0; i < len; i += 4) {
          out.push(inView.getUint32(i));
        }
        if (inView.byteLength % 4 != 0) {
          tmp = new DataView(new ArrayBuffer(4));
          for (var i = 0, l = inView.byteLength % 4; i < l; i++) {
            tmp.setUint8(i + 4 - l, inView.getUint8(len + i));
          }
          out.push(sjcl2.bitArray.partial(inView.byteLength % 4 * 8, tmp.getUint32(0)));
        }
        return out;
      },
      /** Prints a hex output of the buffer contents, akin to hexdump **/
      hexDumpBuffer: function(buffer) {
        var stringBufferView = new DataView(buffer);
        var string = "";
        var pad = function(n, width) {
          n = n + "";
          return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
        };
        for (var i = 0; i < stringBufferView.byteLength; i += 2) {
          if (i % 16 == 0)
            string += "\n" + i.toString(16) + "	";
          string += pad(stringBufferView.getUint16(i).toString(16), 4) + " ";
        }
        if (typeof console === void 0) {
          console = console || { log: function() {
          } };
        }
        console.log(string.toUpperCase());
      }
    };
    if (typeof module2 !== "undefined" && module2.exports) {
      module2.exports = sjcl2;
    }
    if (typeof define === "function") {
      define([], function() {
        return sjcl2;
      });
    }
    exports.default = sjcl2;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/groupSjcl.js
var require_groupSjcl = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/groupSjcl.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GroupConsSjcl = void 0;
    var util_js_1 = require_util();
    var index_js_1 = __importDefault(require_sjcl());
    var groupTypes_js_1 = require_groupTypes();
    function hashParams(hash) {
      switch (hash) {
        case "SHA-1":
          return { outLenBytes: 20, blockLenBytes: 64 };
        case "SHA-256":
          return { outLenBytes: 32, blockLenBytes: 64 };
        case "SHA-384":
          return { outLenBytes: 48, blockLenBytes: 128 };
        case "SHA-512":
          return { outLenBytes: 64, blockLenBytes: 128 };
        default:
          throw new Error(`invalid hash name: ${hash}`);
      }
    }
    async function expandXMD(hash, msg, dst, numBytes) {
      const { outLenBytes, blockLenBytes } = hashParams(hash);
      const ell = Math.ceil(numBytes / outLenBytes);
      if (ell > 255) {
        throw new Error("too big");
      }
      let dstPrime = dst;
      if (dst.length > 255) {
        const te = new TextEncoder();
        const input = (0, util_js_1.joinAll)([te.encode("H2C-OVERSIZE-DST-"), dst]);
        dstPrime = new Uint8Array(await crypto.subtle.digest(hash, input));
      }
      dstPrime = (0, util_js_1.joinAll)([dstPrime, new Uint8Array([dstPrime.length])]);
      const zPad = new Uint8Array(blockLenBytes);
      const libStr = new Uint8Array(2);
      libStr[0] = numBytes >> 8 & 255;
      libStr[1] = numBytes & 255;
      const b0Input = (0, util_js_1.joinAll)([zPad, msg, libStr, new Uint8Array([0]), dstPrime]);
      const b0 = new Uint8Array(await crypto.subtle.digest(hash, b0Input));
      const b1Input = (0, util_js_1.joinAll)([b0, new Uint8Array([1]), dstPrime]);
      let bi = new Uint8Array(await crypto.subtle.digest(hash, b1Input));
      let pseudo = (0, util_js_1.joinAll)([bi]);
      for (let i = 2; i <= ell; i++) {
        const biInput = (0, util_js_1.joinAll)([(0, util_js_1.xor)(bi, b0), new Uint8Array([i]), dstPrime]);
        bi = new Uint8Array(await crypto.subtle.digest(hash, biInput));
        pseudo = (0, util_js_1.joinAll)([pseudo, bi]);
      }
      return pseudo.slice(0, numBytes);
    }
    function getCurve(gid) {
      switch (gid) {
        case groupTypes_js_1.Groups.P256:
          return index_js_1.default.ecc.curves.c256;
        case groupTypes_js_1.Groups.P384:
          return index_js_1.default.ecc.curves.c384;
        case groupTypes_js_1.Groups.P521:
          return index_js_1.default.ecc.curves.c521;
        case groupTypes_js_1.Groups.DECAF448:
        case groupTypes_js_1.Groups.RISTRETTO255:
          throw new Error("group: non-supported ciphersuite");
        default:
          throw (0, groupTypes_js_1.errBadGroup)(gid);
      }
    }
    var ScalarSj = class _ScalarSj {
      constructor(g, k) {
        this.g = g;
        this.k = k;
        this.order = getCurve(this.g.id).r;
      }
      static create(g) {
        return new _ScalarSj(g, new index_js_1.default.bn(0));
      }
      isEqual(s) {
        return this.k.equals(s.k);
      }
      isZero() {
        return this.k.equals(0);
      }
      add(s) {
        (0, util_js_1.compat)(this, s);
        const c = this.k.add(s.k).mod(this.order);
        c.normalize();
        return new _ScalarSj(this.g, c);
      }
      sub(s) {
        (0, util_js_1.compat)(this, s);
        const c = this.k.sub(s.k).mod(this.order);
        c.normalize();
        return new _ScalarSj(this.g, c);
      }
      mul(s) {
        (0, util_js_1.compat)(this, s);
        const c = this.k.mulmod(s.k, this.order);
        c.normalize();
        return new _ScalarSj(this.g, c);
      }
      inv() {
        return new _ScalarSj(this.g, this.k.inverseMod(this.order));
      }
      serialize() {
        const k = this.k.mod(this.order);
        k.normalize();
        const ab = index_js_1.default.codec.arrayBuffer.fromBits(k.toBits(), false);
        const unpaded = new Uint8Array(ab);
        const serScalar = new Uint8Array(this.g.size);
        serScalar.set(unpaded, this.g.size - unpaded.length);
        return serScalar;
      }
      static size(g) {
        return g.size;
      }
      static deserialize(g, bytes) {
        (0, util_js_1.checkSize)(bytes, _ScalarSj, g);
        const array = Array.from(bytes.subarray(0, g.size));
        const k = index_js_1.default.bn.fromBits(index_js_1.default.codec.bytes.toBits(array));
        k.normalize();
        if (k.greaterEquals(getCurve(g.id).r)) {
          throw (0, util_js_1.errDeserialization)(_ScalarSj);
        }
        return new _ScalarSj(g, k);
      }
      static async hash(g, msg, dst) {
        const { hash, L } = getHashParams2(g.id);
        const bytes = await expandXMD(hash, msg, dst, L);
        const array = Array.from(bytes);
        const bitArr = index_js_1.default.codec.bytes.toBits(array);
        const k = index_js_1.default.bn.fromBits(bitArr).mod(getCurve(g.id).r);
        return new _ScalarSj(g, k);
      }
    };
    function getSSWUParams(gid) {
      const curve = getCurve(gid);
      let Z;
      let c2;
      switch (gid) {
        case groupTypes_js_1.Groups.P256:
          Z = -10;
          c2 = "0x25ac71c31e27646736870398ae7f554d8472e008b3aa2a49d332cbd81bcc3b80";
          break;
        case groupTypes_js_1.Groups.P384:
          Z = -12;
          c2 = "0x2accb4a656b0249c71f0500e83da2fdd7f98e383d68b53871f872fcb9ccb80c53c0de1f8a80f7e1914e2ec69f5a626b3";
          break;
        case groupTypes_js_1.Groups.P521:
          Z = -4;
          c2 = "0x2";
          break;
        default:
          throw (0, groupTypes_js_1.errBadGroup)(gid);
      }
      const p = curve.field.modulus;
      const c1 = p.sub(new index_js_1.default.bn(3)).halveM().halveM();
      Z = new curve.field(Z);
      c2 = new curve.field(c2);
      return { Z, c1, c2 };
    }
    function getHashParams2(gid) {
      switch (gid) {
        case groupTypes_js_1.Groups.P256:
          return { hash: "SHA-256", L: 48 };
        case groupTypes_js_1.Groups.P384:
          return { hash: "SHA-384", L: 72 };
        case groupTypes_js_1.Groups.P521:
          return { hash: "SHA-512", L: 98 };
        default:
          throw (0, groupTypes_js_1.errBadGroup)(gid);
      }
    }
    var EltSj = class _EltSj {
      constructor(g, p) {
        this.g = g;
        this.p = p;
      }
      static create(g) {
        return new _EltSj(g, new index_js_1.default.ecc.point(getCurve(g.id)));
      }
      static gen(g) {
        return new _EltSj(g, getCurve(g.id).G);
      }
      isIdentity() {
        return this.p.isIdentity;
      }
      isEqual(a) {
        (0, util_js_1.compat)(this, a);
        if (this.p.isIdentity && a.p.isIdentity) {
          return true;
        } else if (this.p.isIdentity || a.p.isIdentity) {
          return false;
        }
        const { x: x1, y: y1 } = this.p;
        const { x: x2, y: y2 } = a.p;
        return x1.equals(x2) && y1.equals(y2);
      }
      neg() {
        return this.p.negate();
      }
      add(a) {
        (0, util_js_1.compat)(this, a);
        return new _EltSj(this.g, this.p.toJac().add(a.p).toAffine());
      }
      mul(s) {
        (0, util_js_1.compat)(this, s);
        return new _EltSj(this.g, this.p.mult(s.k));
      }
      mul2(k1, a, k2) {
        (0, util_js_1.compat)(this, k1);
        (0, util_js_1.compat)(this, k2);
        (0, util_js_1.compat)(this, a);
        return new _EltSj(this.g, this.p.mult2(k1.k, k2.k, a.p));
      }
      // Serializes an element in uncompressed form.
      serUnComp(a) {
        const xy = index_js_1.default.codec.arrayBuffer.fromBits(a.toBits(), false);
        const bytes = new Uint8Array(xy);
        if (bytes.length !== 2 * this.g.size) {
          throw new Error("error serializing element");
        }
        const serElt = new Uint8Array(1 + 2 * this.g.size);
        serElt[0] = 4;
        serElt.set(bytes, 1);
        return serElt;
      }
      // Serializes an element in compressed form.
      serComp(a) {
        const x = new Uint8Array(index_js_1.default.codec.arrayBuffer.fromBits(a.x.toBits(null), false));
        const serElt = new Uint8Array(1 + this.g.size);
        serElt[0] = 2 | a.y.getLimb(0) & 1;
        serElt.set(x, 1 + this.g.size - x.length);
        return serElt;
      }
      serialize(compressed = true) {
        if (this.p.isIdentity) {
          return Uint8Array.from([0]);
        }
        const p = this.p;
        p.x.fullReduce();
        p.y.fullReduce();
        return compressed ? this.serComp(p) : this.serUnComp(p);
      }
      // size returns the number of bytes of a non-zero element in compressed or uncompressed form.
      static size(g, compressed = true) {
        return 1 + (compressed ? g.size : g.size * 2);
      }
      // Deserializes an element in compressed form.
      static deserComp(g, bytes) {
        const array = Array.from(bytes.subarray(1));
        const bits = index_js_1.default.codec.bytes.toBits(array);
        const curve = getCurve(g.id);
        const x = new curve.field(index_js_1.default.bn.fromBits(bits));
        const p = curve.field.modulus;
        const exp = p.add(new index_js_1.default.bn(1)).halveM().halveM();
        let y = x.square().add(curve.a).mul(x).add(curve.b).power(exp);
        y.fullReduce();
        if ((bytes[0] & 1) !== (y.getLimb(0) & 1)) {
          y = p.sub(y).mod(p);
        }
        const point = new index_js_1.default.ecc.point(curve, new curve.field(x), new curve.field(y));
        if (!point.isValid()) {
          throw (0, util_js_1.errDeserialization)(_EltSj);
        }
        return new _EltSj(g, point);
      }
      // Deserializes an element in uncompressed form.
      static deserUnComp(g, bytes) {
        const array = Array.from(bytes.subarray(1));
        const b = index_js_1.default.codec.bytes.toBits(array);
        const curve = getCurve(g.id);
        const point = curve.fromBits(b);
        point.x.fullReduce();
        point.y.fullReduce();
        return new _EltSj(g, point);
      }
      // Deserializes an element, handles both compressed and uncompressed forms.
      static deserialize(g, bytes) {
        const len = bytes.length;
        switch (true) {
          case (len === 1 && bytes[0] === 0):
            return g.identity();
          case (len === 1 + g.size && (bytes[0] === 2 || bytes[0] === 3)):
            return _EltSj.deserComp(g, bytes);
          case (len === 1 + 2 * g.size && bytes[0] === 4):
            return _EltSj.deserUnComp(g, bytes);
          default:
            throw (0, util_js_1.errDeserialization)(_EltSj);
        }
      }
      static async hashToField(g, msg, dst, count) {
        const curve = getCurve(g.id);
        const { hash, L } = getHashParams2(g.id);
        const bytes = await expandXMD(hash, msg, dst, count * L);
        const u = new Array();
        for (let i = 0; i < count; i++) {
          const j = i * L;
          const array = Array.from(bytes.slice(j, j + L));
          const bitArr = index_js_1.default.codec.bytes.toBits(array);
          u.push(new curve.field(index_js_1.default.bn.fromBits(bitArr)));
        }
        return u;
      }
      static sswu(g, u) {
        const curve = getCurve(g.id);
        const { a: A, b: B } = curve;
        const { Z, c1, c2 } = getSSWUParams(g.id);
        const zero = new curve.field(0);
        const one = new curve.field(1);
        function sgn(x2) {
          x2.fullReduce();
          return x2.getLimb(0) & 1;
        }
        function cmov(x2, y2, b) {
          return b ? y2 : x2;
        }
        function sqrt_ratio_3mod4(u2, v) {
          let tv12 = v.square();
          const tv22 = u2.mul(v);
          tv12 = tv12.mul(tv22);
          let y12 = tv12.power(c1);
          y12 = y12.mul(tv22);
          const y2 = y12.mul(c2);
          let tv32 = y12.square();
          tv32 = tv32.mul(v);
          const isQR2 = tv32.equals(u2);
          const y3 = cmov(y2, y12, isQR2);
          return { isQR: isQR2, root: y3 };
        }
        let tv1 = u.square();
        tv1 = Z.mul(tv1);
        let tv2 = tv1.square();
        tv2 = tv2.add(tv1);
        let tv3 = tv2.add(one);
        tv3 = B.mul(tv3);
        let tv4 = cmov(Z, zero.sub(tv2), !tv2.equals(zero));
        tv4 = A.mul(tv4);
        tv2 = tv3.square();
        let tv6 = tv4.square();
        let tv5 = A.mul(tv6);
        tv2 = tv2.add(tv5);
        tv2 = tv2.mul(tv3);
        tv6 = tv6.mul(tv4);
        tv5 = B.mul(tv6);
        tv2 = tv2.add(tv5);
        let x = tv1.mul(tv3);
        const { isQR, root: y1 } = sqrt_ratio_3mod4(tv2, tv6);
        let y = tv1.mul(u);
        y = y.mul(y1);
        x = cmov(x, tv3, isQR);
        y = cmov(y, y1, isQR);
        const e1 = sgn(u) === sgn(y);
        y = cmov(zero.sub(y), y, e1);
        const z = tv4;
        x = x.mul(z);
        tv1 = z.square();
        tv1 = tv1.mul(z);
        y = y.mul(tv1);
        const point = new index_js_1.default.ecc.pointJac(curve, x, y, z).toAffine();
        if (!point.isValid()) {
          throw new Error("point not in curve");
        }
        return new _EltSj(g, point);
      }
      static async hash(g, msg, dst) {
        const u = await _EltSj.hashToField(g, msg, dst, 2);
        const Q0 = _EltSj.sswu(g, u[0]);
        const Q1 = _EltSj.sswu(g, u[1]);
        return Q0.add(Q1);
      }
    };
    var GroupSj = class {
      static fromID(gid) {
        return new this(gid);
      }
      constructor(gid) {
        switch (gid) {
          case groupTypes_js_1.Groups.P256:
            this.size = 32;
            break;
          case groupTypes_js_1.Groups.P384:
            this.size = 48;
            break;
          case groupTypes_js_1.Groups.P521:
            this.size = 66;
            break;
          default:
            throw (0, groupTypes_js_1.errBadGroup)(gid);
        }
        this.id = gid;
      }
      newScalar() {
        return ScalarSj.create(this);
      }
      newElt() {
        return this.identity();
      }
      identity() {
        return EltSj.create(this);
      }
      generator() {
        return EltSj.gen(this);
      }
      mulGen(s) {
        return EltSj.gen(this).mul(s);
      }
      randomScalar() {
        const msg = crypto.getRandomValues(new Uint8Array(this.size));
        return ScalarSj.hash(this, msg, new Uint8Array());
      }
      hashToGroup(msg, dst) {
        return EltSj.hash(this, msg, dst);
      }
      hashToScalar(msg, dst) {
        return ScalarSj.hash(this, msg, dst);
      }
      get eltDes() {
        return {
          size: (compressed) => EltSj.size(this, compressed),
          deserialize: (b) => EltSj.deserialize(this, b)
        };
      }
      get scalarDes() {
        return {
          size: () => ScalarSj.size(this),
          deserialize: (b) => ScalarSj.deserialize(this, b)
        };
      }
      desElt(bytes) {
        return EltSj.deserialize(this, bytes);
      }
      desScalar(bytes) {
        return ScalarSj.deserialize(this, bytes);
      }
      eltSize(compressed) {
        return EltSj.size(this, compressed);
      }
      scalarSize() {
        return ScalarSj.size(this);
      }
    };
    GroupSj.supportedGroups = [groupTypes_js_1.Groups.P256, groupTypes_js_1.Groups.P384, groupTypes_js_1.Groups.P521];
    exports.GroupConsSjcl = GroupSj;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/cryptoSjcl.js
var require_cryptoSjcl = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/cryptoSjcl.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CryptoSjcl = void 0;
    var groupSjcl_js_1 = require_groupSjcl();
    exports.CryptoSjcl = {
      Group: groupSjcl_js_1.GroupConsSjcl,
      async hash(hashID, input) {
        return new Uint8Array(await crypto.subtle.digest(hashID, input));
      }
    };
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/oprf.js
var require_oprf = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/oprf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FinalizeData = exports.EvaluationRequest = exports.Evaluation = exports.Oprf = exports.getSupportedSuites = void 0;
    var dleq_js_1 = require_dleq();
    var groupTypes_js_1 = require_groupTypes();
    var util_js_1 = require_util();
    var cryptoSjcl_js_1 = require_cryptoSjcl();
    function assertNever2(name, x) {
      throw new Error(`unexpected ${name} identifier: ${x}`);
    }
    function getOprfParams(id) {
      switch (id) {
        case Oprf2.Suite.P256_SHA256:
          return [Oprf2.Suite.P256_SHA256, groupTypes_js_1.Groups.P256, "SHA-256", 32];
        case Oprf2.Suite.P384_SHA384:
          return [Oprf2.Suite.P384_SHA384, groupTypes_js_1.Groups.P384, "SHA-384", 48];
        case Oprf2.Suite.P521_SHA512:
          return [Oprf2.Suite.P521_SHA512, groupTypes_js_1.Groups.P521, "SHA-512", 64];
        case Oprf2.Suite.RISTRETTO255_SHA512:
          return [Oprf2.Suite.RISTRETTO255_SHA512, groupTypes_js_1.Groups.RISTRETTO255, "SHA-512", 64];
        case Oprf2.Suite.DECAF448_SHAKE256:
          return [Oprf2.Suite.DECAF448_SHAKE256, groupTypes_js_1.Groups.DECAF448, "SHAKE256", 64];
        default:
          assertNever2("Oprf.Suite", id);
      }
    }
    function getSupportedSuites(g) {
      return Object.values(Oprf2.Suite).filter((v) => g.supportedGroups.includes(getOprfParams(v)[1]));
    }
    exports.getSupportedSuites = getSupportedSuites;
    var Oprf2 = class _Oprf {
      static get Group() {
        return this.Crypto.Group;
      }
      static validateMode(m) {
        switch (m) {
          case _Oprf.Mode.OPRF:
          case _Oprf.Mode.VOPRF:
          case _Oprf.Mode.POPRF:
            return m;
          default:
            assertNever2("Oprf.Mode", m);
        }
      }
      static getGroup(suite) {
        return _Oprf.Group.fromID(getOprfParams(suite)[1]);
      }
      static getHash(suite) {
        return getOprfParams(suite)[2];
      }
      static getOprfSize(suite) {
        return getOprfParams(suite)[3];
      }
      static getDST(mode, suite, name) {
        const m = _Oprf.validateMode(mode);
        const te = new TextEncoder();
        return (0, util_js_1.joinAll)([
          te.encode(name + _Oprf.LABELS.Version),
          Uint8Array.of(m),
          te.encode("-" + suite)
        ]);
      }
      constructor(mode, suite) {
        const [ID, gid, hash] = getOprfParams(suite);
        this.ID = ID;
        this.gg = _Oprf.Group.fromID(gid);
        this.hashID = hash;
        this.mode = _Oprf.validateMode(mode);
      }
      getDST(name) {
        return _Oprf.getDST(this.mode, this.ID, name);
      }
      async coreFinalize(input, issuedElement, info) {
        let hasInfo = [];
        if (this.mode === _Oprf.Mode.POPRF) {
          hasInfo = (0, util_js_1.toU16LenPrefix)(info);
        }
        const hashInput = (0, util_js_1.joinAll)([
          ...(0, util_js_1.toU16LenPrefix)(input),
          ...hasInfo,
          ...(0, util_js_1.toU16LenPrefix)(issuedElement),
          new TextEncoder().encode(_Oprf.LABELS.FinalizeDST)
        ]);
        return await _Oprf.Crypto.hash(this.hashID, hashInput);
      }
      scalarFromInfo(info) {
        if (info.length >= 1 << 16) {
          throw new Error("invalid info length");
        }
        const te = new TextEncoder();
        const framedInfo = (0, util_js_1.joinAll)([te.encode(_Oprf.LABELS.InfoLabel), ...(0, util_js_1.toU16LenPrefix)(info)]);
        return this.gg.hashToScalar(framedInfo, this.getDST(_Oprf.LABELS.HashToScalarDST));
      }
    };
    exports.Oprf = Oprf2;
    Oprf2.Crypto = cryptoSjcl_js_1.CryptoSjcl;
    Oprf2.Mode = {
      OPRF: 0,
      VOPRF: 1,
      POPRF: 2
    };
    Oprf2.Suite = {
      P256_SHA256: "P256-SHA256",
      P384_SHA384: "P384-SHA384",
      P521_SHA512: "P521-SHA512",
      RISTRETTO255_SHA512: "ristretto255-SHA512",
      DECAF448_SHAKE256: "decaf448-SHAKE256"
    };
    Oprf2.LABELS = {
      Version: "OPRFV1-",
      FinalizeDST: "Finalize",
      HashToGroupDST: "HashToGroup-",
      HashToScalarDST: "HashToScalar-",
      DeriveKeyPairDST: "DeriveKeyPair",
      InfoLabel: "Info"
    };
    var Evaluation2 = class _Evaluation {
      constructor(mode, evaluated, proof) {
        this.mode = mode;
        this.evaluated = evaluated;
        this.proof = proof;
      }
      serialize() {
        let proofBytes = new Uint8Array();
        if (this.proof && (this.mode == Oprf2.Mode.VOPRF || this.mode == Oprf2.Mode.POPRF)) {
          proofBytes = this.proof.serialize();
        }
        return (0, util_js_1.joinAll)([
          ...(0, util_js_1.toU16LenPrefixClass)(this.evaluated),
          Uint8Array.from([this.mode]),
          proofBytes
        ]);
      }
      isEqual(e) {
        if (this.mode !== e.mode || this.proof && !e.proof || !this.proof && e.proof) {
          return false;
        }
        let res = this.evaluated.every((x, i) => x.isEqual(e.evaluated[i]));
        if (this.proof && e.proof) {
          res && (res = this.proof.isEqual(e.proof));
        }
        return res;
      }
      static deserialize(params, bytes) {
        const { head: evalList, tail } = (0, util_js_1.fromU16LenPrefixDes)(params.gg.eltDes, bytes);
        let proof;
        const prSize = dleq_js_1.DLEQProof.size(params);
        const proofBytes = tail.subarray(1, 1 + prSize);
        const mode = tail[0];
        switch (mode) {
          case Oprf2.Mode.OPRF:
            break;
          case Oprf2.Mode.VOPRF:
          case Oprf2.Mode.POPRF:
            proof = dleq_js_1.DLEQProof.deserialize(params, proofBytes);
            break;
          default:
            assertNever2("Oprf.Mode", mode);
        }
        return new _Evaluation(mode, evalList, proof);
      }
    };
    exports.Evaluation = Evaluation2;
    var EvaluationRequest2 = class _EvaluationRequest {
      constructor(blinded) {
        this.blinded = blinded;
      }
      serialize() {
        return (0, util_js_1.joinAll)((0, util_js_1.toU16LenPrefixClass)(this.blinded));
      }
      isEqual(e) {
        return this.blinded.every((x, i) => x.isEqual(e.blinded[i]));
      }
      static deserialize(g, bytes) {
        const { head: blindedList } = (0, util_js_1.fromU16LenPrefixDes)(g.eltDes, bytes);
        return new _EvaluationRequest(blindedList);
      }
    };
    exports.EvaluationRequest = EvaluationRequest2;
    var FinalizeData2 = class _FinalizeData {
      constructor(inputs, blinds, evalReq) {
        this.inputs = inputs;
        this.blinds = blinds;
        this.evalReq = evalReq;
      }
      serialize() {
        return (0, util_js_1.joinAll)([
          ...(0, util_js_1.toU16LenPrefixUint8Array)(this.inputs),
          ...(0, util_js_1.toU16LenPrefixClass)(this.blinds),
          this.evalReq.serialize()
        ]);
      }
      isEqual(f) {
        return this.inputs.every((x, i) => x.toString() === f.inputs[i].toString()) && this.blinds.every((x, i) => x.isEqual(f.blinds[i])) && this.evalReq.isEqual(f.evalReq);
      }
      static deserialize(g, bytes) {
        const { head: inputs, tail: t0 } = (0, util_js_1.fromU16LenPrefixUint8Array)(bytes);
        const { head: blinds, tail: t1 } = (0, util_js_1.fromU16LenPrefixDes)(g.scalarDes, t0);
        const evalReq = EvaluationRequest2.deserialize(g, t1);
        return new _FinalizeData(inputs, blinds, evalReq);
      }
    };
    exports.FinalizeData = FinalizeData2;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/client.js
var require_client = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.POPRFClient = exports.VOPRFClient = exports.OPRFClient = void 0;
    var oprf_js_1 = require_oprf();
    var util_js_1 = require_util();
    var baseClient = class extends oprf_js_1.Oprf {
      constructor(mode, suite) {
        super(mode, suite);
      }
      randomBlinder() {
        return this.gg.randomScalar();
      }
      async blind(inputs) {
        const eltList = [];
        const blinds = [];
        for (const input of inputs) {
          const scalar = await this.randomBlinder();
          const inputElement = await this.gg.hashToGroup(input, this.getDST(oprf_js_1.Oprf.LABELS.HashToGroupDST));
          if (inputElement.isIdentity()) {
            throw new Error("InvalidInputError");
          }
          eltList.push(inputElement.mul(scalar));
          blinds.push(scalar);
        }
        const evalReq = new oprf_js_1.EvaluationRequest(eltList);
        const finData = new oprf_js_1.FinalizeData(inputs, blinds, evalReq);
        return [finData, evalReq];
      }
      async doFinalize(finData, evaluation, info = new Uint8Array(0)) {
        const n = finData.inputs.length;
        if (finData.blinds.length !== n || evaluation.evaluated.length !== n) {
          throw new Error("mismatched lengths");
        }
        const outputList = [];
        for (let i = 0; i < n; i++) {
          const blindInv = finData.blinds[i].inv();
          const N = evaluation.evaluated[i].mul(blindInv);
          const unblinded = N.serialize();
          outputList.push(await this.coreFinalize(finData.inputs[i], unblinded, info));
        }
        return outputList;
      }
    };
    var OPRFClient = class extends baseClient {
      constructor(suite) {
        super(oprf_js_1.Oprf.Mode.OPRF, suite);
      }
      finalize(finData, evaluation) {
        return super.doFinalize(finData, evaluation);
      }
    };
    exports.OPRFClient = OPRFClient;
    var VOPRFClient2 = class extends baseClient {
      constructor(suite, pubKeyServer) {
        super(oprf_js_1.Oprf.Mode.VOPRF, suite);
        this.pubKeyServer = pubKeyServer;
      }
      async finalize(finData, evaluation) {
        if (!evaluation.proof) {
          throw new Error("no proof provided");
        }
        const pkS = this.gg.desElt(this.pubKeyServer);
        const n = finData.inputs.length;
        if (evaluation.evaluated.length !== n) {
          throw new Error("mismatched lengths");
        }
        if (!await evaluation.proof.verify_batch([this.gg.generator(), pkS], (0, util_js_1.zip)(finData.evalReq.blinded, evaluation.evaluated))) {
          throw new Error("proof failed");
        }
        return super.doFinalize(finData, evaluation);
      }
    };
    exports.VOPRFClient = VOPRFClient2;
    var POPRFClient = class extends baseClient {
      constructor(suite, pubKeyServer) {
        super(oprf_js_1.Oprf.Mode.POPRF, suite);
        this.pubKeyServer = pubKeyServer;
      }
      async pointFromInfo(info) {
        const m = await this.scalarFromInfo(info);
        const T = this.gg.mulGen(m);
        const pkS = this.gg.desElt(this.pubKeyServer);
        const tw = pkS.add(T);
        if (tw.isIdentity()) {
          throw new Error("invalid info");
        }
        return tw;
      }
      async finalize(finData, evaluation, info = new Uint8Array(0)) {
        if (!evaluation.proof) {
          throw new Error("no proof provided");
        }
        const tw = await this.pointFromInfo(info);
        const n = finData.inputs.length;
        if (evaluation.evaluated.length !== n) {
          throw new Error("mismatched lengths");
        }
        if (!await evaluation.proof.verify_batch([this.gg.generator(), tw], (0, util_js_1.zip)(evaluation.evaluated, finData.evalReq.blinded))) {
          throw new Error("proof failed");
        }
        return super.doFinalize(finData, evaluation, info);
      }
    };
    exports.POPRFClient = POPRFClient;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/server.js
var require_server = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/server.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.POPRFServer = exports.VOPRFServer = exports.OPRFServer = void 0;
    var dleq_js_1 = require_dleq();
    var oprf_js_1 = require_oprf();
    var util_js_1 = require_util();
    var baseServer = class extends oprf_js_1.Oprf {
      constructor(mode, suite, privateKey) {
        super(mode, suite);
        this.supportsWebCryptoOPRF = false;
        this.privateKey = privateKey;
      }
      doBlindEvaluation(blinded, key) {
        return this.supportsWebCryptoOPRF ? this.blindEvaluateWebCrypto(blinded, key) : Promise.resolve(this.blindEvaluateGroup(blinded, key));
      }
      async blindEvaluateWebCrypto(blinded, key) {
        const crKey = await crypto.subtle.importKey("raw", key, {
          name: "OPRF",
          namedCurve: this.gg.id
        }, true, ["sign"]);
        const compressed = blinded.serialize(true);
        const evalBytes = new Uint8Array(await crypto.subtle.sign("OPRF", crKey, compressed));
        return this.gg.desElt(evalBytes);
      }
      blindEvaluateGroup(blinded, key) {
        return blinded.mul(this.gg.desScalar(key));
      }
      async secretFromInfo(info) {
        const m = await this.scalarFromInfo(info);
        const skS = this.gg.desScalar(this.privateKey);
        const t = m.add(skS);
        if (t.isZero()) {
          throw new Error("inverse of zero");
        }
        const tInv = t.inv();
        return [t, tInv];
      }
      async doEvaluate(input, info = new Uint8Array(0)) {
        let secret = this.privateKey;
        if (this.mode === oprf_js_1.Oprf.Mode.POPRF) {
          const [, evalSecret] = await this.secretFromInfo(info);
          secret = evalSecret.serialize();
        }
        const P = await this.gg.hashToGroup(input, this.getDST(oprf_js_1.Oprf.LABELS.HashToGroupDST));
        if (P.isIdentity()) {
          throw new Error("InvalidInputError");
        }
        const evaluated = await this.doBlindEvaluation(P, secret);
        return this.coreFinalize(input, evaluated.serialize(true), info);
      }
      constructDLEQParams() {
        return { gg: this.gg, hashID: this.hashID, hash: oprf_js_1.Oprf.Crypto.hash, dst: "" };
      }
    };
    var OPRFServer = class extends baseServer {
      constructor(suite, privateKey) {
        super(oprf_js_1.Oprf.Mode.OPRF, suite, privateKey);
      }
      async blindEvaluate(req) {
        return new oprf_js_1.Evaluation(this.mode, await Promise.all(req.blinded.map((b) => this.doBlindEvaluation(b, this.privateKey))));
      }
      async evaluate(input) {
        return this.doEvaluate(input);
      }
      async verifyFinalize(input, output) {
        return (0, util_js_1.ctEqual)(output, await this.doEvaluate(input));
      }
    };
    exports.OPRFServer = OPRFServer;
    var VOPRFServer2 = class extends baseServer {
      constructor(suite, privateKey) {
        super(oprf_js_1.Oprf.Mode.VOPRF, suite, privateKey);
      }
      async blindEvaluate(req) {
        const evalList = await Promise.all(req.blinded.map((b) => this.doBlindEvaluation(b, this.privateKey)));
        const prover = new dleq_js_1.DLEQProver(this.constructDLEQParams());
        const skS = this.gg.desScalar(this.privateKey);
        const pkS = this.gg.mulGen(skS);
        const proof = await prover.prove_batch(skS, [this.gg.generator(), pkS], (0, util_js_1.zip)(req.blinded, evalList));
        return new oprf_js_1.Evaluation(this.mode, evalList, proof);
      }
      async evaluate(input) {
        return this.doEvaluate(input);
      }
      async verifyFinalize(input, output) {
        return (0, util_js_1.ctEqual)(output, await this.doEvaluate(input));
      }
    };
    exports.VOPRFServer = VOPRFServer2;
    var POPRFServer = class extends baseServer {
      constructor(suite, privateKey) {
        super(oprf_js_1.Oprf.Mode.POPRF, suite, privateKey);
      }
      async blindEvaluate(req, info = new Uint8Array(0)) {
        const [keyProof, evalSecret] = await this.secretFromInfo(info);
        const secret = evalSecret.serialize();
        const evalList = await Promise.all(req.blinded.map((b) => this.doBlindEvaluation(b, secret)));
        const prover = new dleq_js_1.DLEQProver(this.constructDLEQParams());
        const kG = this.gg.mulGen(keyProof);
        const proof = await prover.prove_batch(keyProof, [this.gg.generator(), kG], (0, util_js_1.zip)(evalList, req.blinded));
        return new oprf_js_1.Evaluation(this.mode, evalList, proof);
      }
      async evaluate(input, info = new Uint8Array(0)) {
        return this.doEvaluate(input, info);
      }
      async verifyFinalize(input, output, info = new Uint8Array(0)) {
        return (0, util_js_1.ctEqual)(output, await this.doEvaluate(input, info));
      }
    };
    exports.POPRFServer = POPRFServer;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/keys.js
var require_keys = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/keys.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deriveKeyPair = exports.generateKeyPair = exports.generatePublicKey = exports.derivePrivateKey = exports.randomPrivateKey = exports.validatePublicKey = exports.validatePrivateKey = exports.getKeySizes = void 0;
    var oprf_js_1 = require_oprf();
    var util_js_1 = require_util();
    function getKeySizes(id) {
      const gg = oprf_js_1.Oprf.getGroup(id);
      return { Nsk: gg.scalarSize(), Npk: gg.eltSize(true) };
    }
    exports.getKeySizes = getKeySizes;
    function validatePrivateKey(id, privateKey) {
      try {
        const s = oprf_js_1.Oprf.getGroup(id).desScalar(privateKey);
        return !s.isZero();
      } catch (_) {
        return false;
      }
    }
    exports.validatePrivateKey = validatePrivateKey;
    function validatePublicKey(id, publicKey) {
      try {
        const P = oprf_js_1.Oprf.getGroup(id).desElt(publicKey);
        return !P.isIdentity();
      } catch (_) {
        return false;
      }
    }
    exports.validatePublicKey = validatePublicKey;
    async function randomPrivateKey(id) {
      const gg = oprf_js_1.Oprf.getGroup(id);
      let priv;
      do {
        priv = await gg.randomScalar();
      } while (priv.isZero());
      return priv.serialize();
    }
    exports.randomPrivateKey = randomPrivateKey;
    async function derivePrivateKey(mode, id, seed, info) {
      const gg = oprf_js_1.Oprf.getGroup(id);
      const deriveInput = (0, util_js_1.joinAll)([seed, ...(0, util_js_1.toU16LenPrefix)(info)]);
      let counter = 0;
      let priv;
      do {
        if (counter > 255) {
          throw new Error("DeriveKeyPairError");
        }
        const hashInput = (0, util_js_1.joinAll)([deriveInput, Uint8Array.from([counter])]);
        priv = await gg.hashToScalar(hashInput, oprf_js_1.Oprf.getDST(mode, id, oprf_js_1.Oprf.LABELS.DeriveKeyPairDST));
        counter++;
      } while (priv.isZero());
      return priv.serialize();
    }
    exports.derivePrivateKey = derivePrivateKey;
    function generatePublicKey(id, privateKey) {
      const gg = oprf_js_1.Oprf.getGroup(id);
      const priv = gg.desScalar(privateKey);
      const pub = gg.mulGen(priv);
      return pub.serialize(true);
    }
    exports.generatePublicKey = generatePublicKey;
    async function generateKeyPair2(id) {
      const privateKey = await randomPrivateKey(id);
      const publicKey = generatePublicKey(id, privateKey);
      return { privateKey, publicKey };
    }
    exports.generateKeyPair = generateKeyPair2;
    async function deriveKeyPair(mode, id, seed, info) {
      const privateKey = await derivePrivateKey(mode, id, seed, info);
      const publicKey = generatePublicKey(id, privateKey);
      return { privateKey, publicKey };
    }
    exports.deriveKeyPair = deriveKeyPair;
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/cryptoTypes.js
var require_cryptoTypes = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/cryptoTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@cloudflare/voprf-ts/lib/cjs/src/index.js
var require_src = __commonJS({
  "node_modules/@cloudflare/voprf-ts/lib/cjs/src/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_groupTypes(), exports);
    __exportStar(require_dleq(), exports);
    __exportStar(require_oprf(), exports);
    __exportStar(require_client(), exports);
    __exportStar(require_server(), exports);
    __exportStar(require_keys(), exports);
    __exportStar(require_cryptoTypes(), exports);
  }
});

// node_modules/promjs/utils.js
var require_utils = __commonJS({
  "node_modules/promjs/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.formatHistogramOrSummary = formatHistogramOrSummary;
    exports.findExistingMetric = findExistingMetric;
    exports.formatCounterOrGauge = formatCounterOrGauge;
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
    function _iterableToArrayLimit(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function getLabelPairs(metric) {
      var pairs = Object.entries(metric.labels || {}).map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 2), k = _ref2[0], v = _ref2[1];
        return "".concat(k, '="').concat(v, '"');
      });
      return pairs.length === 0 ? "" : "".concat(pairs.join(","));
    }
    function formatHistogramOrSummary(name, metric) {
      var bucketLabel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "le";
      var str = "";
      var labels = getLabelPairs(metric);
      if (labels.length > 0) {
        str += "".concat(name, "_count{").concat(labels, "} ").concat(metric.value.count, "\n");
        str += "".concat(name, "_sum{").concat(labels, "} ").concat(metric.value.sum, "\n");
      } else {
        str += "".concat(name, "_count ").concat(metric.value.count, "\n");
        str += "".concat(name, "_sum ").concat(metric.value.sum, "\n");
      }
      return Object.entries(metric.value.entries).reduce(function(result, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), bucket = _ref4[0], count = _ref4[1];
        if (labels.length > 0) {
          return "".concat(result).concat(name, "_bucket{").concat(bucketLabel, '="').concat(bucket, '",').concat(labels, "} ").concat(count, "\n");
        }
        return "".concat(result).concat(name, "_bucket{").concat(bucketLabel, '="').concat(bucket, '"} ').concat(count, "\n");
      }, str);
    }
    function findExistingMetric(labels) {
      var values = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      if (!labels) {
        return values[0];
      }
      return values.find(function(v) {
        if (!v.labels) {
          return false;
        }
        if (Object.keys(v.labels || {}).length !== Object.keys(labels).length) {
          return false;
        }
        var entries = Object.entries(labels);
        for (var i = 0; i < entries.length; i += 1) {
          var _entries$i = _slicedToArray(entries[i], 2), label = _entries$i[0], value = _entries$i[1];
          if (v.labels[label] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    function formatCounterOrGauge(name, metric) {
      var value = " ".concat(metric.value.toString());
      if (metric.labels == null || Object.keys(metric.labels).length === 0) {
        return "".concat(name).concat(value, "\n");
      }
      var pair = Object.entries(metric.labels).map(function(_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2), k = _ref6[0], v = _ref6[1];
        return "".concat(k, '="').concat(v, '"');
      });
      return "".concat(name, "{").concat(pair.join(","), "}").concat(value, "\n");
    }
  }
});

// node_modules/promjs/collector.js
var require_collector = __commonJS({
  "node_modules/promjs/collector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Collector = void 0;
    var _utils = require_utils();
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
    function _iterableToArrayLimit(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var Collector = /* @__PURE__ */ function() {
      function Collector2() {
        _classCallCheck(this, Collector2);
        _defineProperty(this, "data", void 0);
        this.data = [];
      }
      _createClass(Collector2, [{
        key: "get",
        value: function get(labels) {
          return (0, _utils.findExistingMetric)(labels, this.data);
        }
      }, {
        key: "set",
        value: function set(value, labels) {
          var existing = (0, _utils.findExistingMetric)(labels, this.data);
          if (existing) {
            existing.value = value;
          } else {
            this.data.push({
              labels,
              value
            });
          }
          return this;
        }
      }, {
        key: "collect",
        value: function collect(labels) {
          if (!labels) {
            return this.data;
          }
          return this.data.filter(function(item) {
            if (!item.labels) {
              return false;
            }
            var entries = Object.entries(labels);
            for (var i = 0; i < entries.length; i += 1) {
              var _entries$i = _slicedToArray(entries[i], 2), label = _entries$i[0], value = _entries$i[1];
              if (item.labels[label] !== value) {
                return false;
              }
            }
            return true;
          });
        }
      }, {
        key: "resetAll",
        value: function resetAll() {
          for (var i = 0; i < this.data.length; i += 1) {
            this.reset(this.data[i].labels);
          }
          return this;
        }
      }]);
      return Collector2;
    }();
    exports.Collector = Collector;
  }
});

// node_modules/promjs/counter.js
var require_counter = __commonJS({
  "node_modules/promjs/counter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Counter = void 0;
    var _collector = require_collector();
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _possibleConstructorReturn(self2, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var Counter = /* @__PURE__ */ function(_Collector) {
      _inherits(Counter2, _Collector);
      function Counter2() {
        _classCallCheck(this, Counter2);
        return _possibleConstructorReturn(this, _getPrototypeOf(Counter2).apply(this, arguments));
      }
      _createClass(Counter2, [{
        key: "inc",
        value: function inc(labels) {
          this.add(1, labels);
          return this;
        }
      }, {
        key: "add",
        value: function add(amount, labels) {
          if (amount < 0) {
            throw new Error("Expected increment amount to be greater than -1. Received: ".concat(amount));
          }
          var metric = this.get(labels);
          this.set(metric ? metric.value + amount : amount, labels);
          return this;
        }
      }, {
        key: "reset",
        value: function reset(labels) {
          this.set(0, labels);
        }
      }]);
      return Counter2;
    }(_collector.Collector);
    exports.Counter = Counter;
  }
});

// node_modules/promjs/gauge.js
var require_gauge = __commonJS({
  "node_modules/promjs/gauge.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Gauge = void 0;
    var _counter = require_counter();
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _possibleConstructorReturn(self2, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    var Gauge = /* @__PURE__ */ function(_Counter) {
      _inherits(Gauge2, _Counter);
      function Gauge2() {
        _classCallCheck(this, Gauge2);
        return _possibleConstructorReturn(this, _getPrototypeOf(Gauge2).apply(this, arguments));
      }
      _createClass(Gauge2, [{
        key: "dec",
        value: function dec(labels) {
          var metric = this.get(labels);
          this.set(metric ? metric.value - 1 : 0, labels);
          return this;
        }
      }, {
        key: "sub",
        value: function sub(amount, labels) {
          var metric = this.get(labels);
          this.set(metric ? metric.value - amount : 0, labels);
          return this;
        }
      }]);
      return Gauge2;
    }(_counter.Counter);
    exports.Gauge = Gauge;
  }
});

// node_modules/promjs/histogram.js
var require_histogram = __commonJS({
  "node_modules/promjs/histogram.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Histogram = void 0;
    var _collector = require_collector();
    function _typeof(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _possibleConstructorReturn(self2, call) {
      if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
      }
      return _assertThisInitialized(self2);
    }
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      };
      return _getPrototypeOf(o);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      };
      return _setPrototypeOf(o, p);
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function findMinBucketIndex(ary, num) {
      if (num < ary[ary.length - 1]) {
        for (var i = 0; i < ary.length; i += 1) {
          if (num <= ary[i]) {
            return i;
          }
        }
      }
      return void 0;
    }
    function getInitialValue(buckets) {
      var entries = buckets.reduce(function(result, b) {
        result[b.toString()] = 0;
        return result;
      }, {
        "+Inf": 0
      });
      return {
        entries,
        sum: 0,
        count: 0,
        raw: []
      };
    }
    var Histogram = /* @__PURE__ */ function(_Collector) {
      _inherits(Histogram2, _Collector);
      function Histogram2() {
        var _this;
        var buckets = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
        _classCallCheck(this, Histogram2);
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Histogram2).call(this));
        _defineProperty(_assertThisInitialized(_this), "buckets", void 0);
        _this.buckets = buckets.sort(function(a, b) {
          return a > b ? 1 : -1;
        });
        _this.set(getInitialValue(_this.buckets));
        _this.observe = _this.observe.bind(_assertThisInitialized(_this));
        return _this;
      }
      _createClass(Histogram2, [{
        key: "observe",
        value: function observe(value, labels) {
          var metric = this.get(labels);
          if (metric == null) {
            metric = this.set(getInitialValue(this.buckets), labels).get(labels);
          }
          metric.value.raw.push(value);
          metric.value.entries["+Inf"] += 1;
          var minBucketIndex = findMinBucketIndex(this.buckets, value);
          if (minBucketIndex != null) {
            for (var i = minBucketIndex; i < this.buckets.length; i += 1) {
              var val = metric.value.entries[this.buckets[i].toString()];
              metric.value.entries[this.buckets[i].toString()] = val + 1;
            }
          }
          metric.value.sum = metric.value.raw.reduce(function(sum, v) {
            return sum + v;
          }, 0);
          metric.value.count += 1;
          return this;
        }
      }, {
        key: "reset",
        value: function reset(labels) {
          this.set(getInitialValue(this.buckets), labels);
        }
      }]);
      return Histogram2;
    }(_collector.Collector);
    exports.Histogram = Histogram;
  }
});

// node_modules/promjs/registry.js
var require_registry = __commonJS({
  "node_modules/promjs/registry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Registry = void 0;
    var _counter = require_counter();
    var _gauge = require_gauge();
    var _histogram = require_histogram();
    var _utils = require_utils();
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
    function _iterableToArrayLimit(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var Registry2 = /* @__PURE__ */ function() {
      function Registry3() {
        _classCallCheck(this, Registry3);
        _defineProperty(this, "data", void 0);
        this.data = {
          counter: {},
          gauge: {},
          histogram: {}
        };
      }
      _createClass(Registry3, [{
        key: "validateInput",
        value: function validateInput(type, name, help, buckets) {
          if (String(name) === "") {
            throw new Error("Metric name cannot be empty");
          }
          if (["counter", "gauge", "histogram"].indexOf(type) === -1) {
            throw new Error("Unknown metric type ".concat(type));
          }
          if (typeof help !== "string" && help != null) {
            throw new Error("help must be string or undefined/null");
          }
          if (this.data[type][name]) {
            throw new Error("A metric with the name '".concat(name, "' already exists for type '").concat(type, "'"));
          }
          if (!Array.isArray(buckets) && buckets != null) {
            throw new Error("buckets must be array or undefined/null");
          }
        }
      }, {
        key: "create",
        value: function create(type, name) {
          var help = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
          var histogramBuckets = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : [];
          this.validateInput(type, name, help, histogramBuckets);
          var instance;
          if (type === "counter") {
            instance = new _counter.Counter();
            this.data.counter[name] = {
              help,
              instance,
              type
            };
          } else if (type === "gauge") {
            instance = new _gauge.Gauge();
            this.data.gauge[name] = {
              help,
              instance,
              type
            };
          } else {
            instance = new _histogram.Histogram(histogramBuckets);
            this.data.histogram[name] = {
              help,
              instance,
              type
            };
          }
          return instance;
        }
        /**
         * Returns a string in the prometheus' desired format
         * More info: https://prometheus.io/docs/concepts/data_model/
         * Loop through each metric type (counter, histogram, etc);
         *
         * @return {string}
         */
      }, {
        key: "metrics",
        value: function metrics() {
          return Object.entries(this.data).reduce(function(out, _ref) {
            var _ref2 = _slicedToArray(_ref, 2), type = _ref2[0], metrics2 = _ref2[1];
            return out + Object.entries(metrics2).reduce(function(src, _ref3) {
              var _ref4 = _slicedToArray(_ref3, 2), name = _ref4[0], metric = _ref4[1];
              var values = metric.instance.collect();
              var result = src;
              if (metric.help.length > 0) {
                result += "# HELP ".concat(name, " ").concat(metric.help, "\n");
              }
              result += "# TYPE ".concat(name, " ").concat(type, "\n");
              result += values.reduce(function(str, value) {
                var formatted = type === "histogram" ? (0, _utils.formatHistogramOrSummary)(name, value) : (0, _utils.formatCounterOrGauge)(name, value);
                return str + formatted;
              }, "");
              return result;
            }, "");
          }, "");
        }
      }, {
        key: "reset",
        value: function reset() {
          Object.values(this.data).map(function(m) {
            return Object.values(m).map(function(_ref5) {
              var instance = _ref5.instance;
              return instance.resetAll();
            });
          });
          return this;
        }
      }, {
        key: "clear",
        value: function clear() {
          this.data = {
            counter: {},
            gauge: {},
            histogram: {}
          };
          return this;
        }
      }, {
        key: "get",
        value: function get(type, name) {
          var registryItems = type != null ? [this.data[type]] : Object.values(this.data);
          var metric = registryItems.find(function(v) {
            return name in v;
          });
          return metric != null ? metric[name].instance : void 0;
        }
      }]);
      return Registry3;
    }();
    exports.Registry = Registry2;
  }
});

// node_modules/luxon/build/node/luxon.js
var require_luxon = __commonJS({
  "node_modules/luxon/build/node/luxon.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LuxonError = class extends Error {
    };
    var InvalidDateTimeError = class extends LuxonError {
      constructor(reason) {
        super(`Invalid DateTime: ${reason.toMessage()}`);
      }
    };
    var InvalidIntervalError = class extends LuxonError {
      constructor(reason) {
        super(`Invalid Interval: ${reason.toMessage()}`);
      }
    };
    var InvalidDurationError = class extends LuxonError {
      constructor(reason) {
        super(`Invalid Duration: ${reason.toMessage()}`);
      }
    };
    var ConflictingSpecificationError = class extends LuxonError {
    };
    var InvalidUnitError = class extends LuxonError {
      constructor(unit) {
        super(`Invalid unit ${unit}`);
      }
    };
    var InvalidArgumentError = class extends LuxonError {
    };
    var ZoneIsAbstractError = class extends LuxonError {
      constructor() {
        super("Zone is an abstract class");
      }
    };
    var n = "numeric";
    var s = "short";
    var l = "long";
    var DATE_SHORT = {
      year: n,
      month: n,
      day: n
    };
    var DATE_MED = {
      year: n,
      month: s,
      day: n
    };
    var DATE_MED_WITH_WEEKDAY = {
      year: n,
      month: s,
      day: n,
      weekday: s
    };
    var DATE_FULL = {
      year: n,
      month: l,
      day: n
    };
    var DATE_HUGE = {
      year: n,
      month: l,
      day: n,
      weekday: l
    };
    var TIME_SIMPLE = {
      hour: n,
      minute: n
    };
    var TIME_WITH_SECONDS = {
      hour: n,
      minute: n,
      second: n
    };
    var TIME_WITH_SHORT_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      timeZoneName: s
    };
    var TIME_WITH_LONG_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      timeZoneName: l
    };
    var TIME_24_SIMPLE = {
      hour: n,
      minute: n,
      hourCycle: "h23"
    };
    var TIME_24_WITH_SECONDS = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23"
    };
    var TIME_24_WITH_SHORT_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23",
      timeZoneName: s
    };
    var TIME_24_WITH_LONG_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23",
      timeZoneName: l
    };
    var DATETIME_SHORT = {
      year: n,
      month: n,
      day: n,
      hour: n,
      minute: n
    };
    var DATETIME_SHORT_WITH_SECONDS = {
      year: n,
      month: n,
      day: n,
      hour: n,
      minute: n,
      second: n
    };
    var DATETIME_MED = {
      year: n,
      month: s,
      day: n,
      hour: n,
      minute: n
    };
    var DATETIME_MED_WITH_SECONDS = {
      year: n,
      month: s,
      day: n,
      hour: n,
      minute: n,
      second: n
    };
    var DATETIME_MED_WITH_WEEKDAY = {
      year: n,
      month: s,
      day: n,
      weekday: s,
      hour: n,
      minute: n
    };
    var DATETIME_FULL = {
      year: n,
      month: l,
      day: n,
      hour: n,
      minute: n,
      timeZoneName: s
    };
    var DATETIME_FULL_WITH_SECONDS = {
      year: n,
      month: l,
      day: n,
      hour: n,
      minute: n,
      second: n,
      timeZoneName: s
    };
    var DATETIME_HUGE = {
      year: n,
      month: l,
      day: n,
      weekday: l,
      hour: n,
      minute: n,
      timeZoneName: l
    };
    var DATETIME_HUGE_WITH_SECONDS = {
      year: n,
      month: l,
      day: n,
      weekday: l,
      hour: n,
      minute: n,
      second: n,
      timeZoneName: l
    };
    var Zone = class {
      /**
       * The type of zone
       * @abstract
       * @type {string}
       */
      get type() {
        throw new ZoneIsAbstractError();
      }
      /**
       * The name of this zone.
       * @abstract
       * @type {string}
       */
      get name() {
        throw new ZoneIsAbstractError();
      }
      /**
       * The IANA name of this zone.
       * Defaults to `name` if not overwritten by a subclass.
       * @abstract
       * @type {string}
       */
      get ianaName() {
        return this.name;
      }
      /**
       * Returns whether the offset is known to be fixed for the whole year.
       * @abstract
       * @type {boolean}
       */
      get isUniversal() {
        throw new ZoneIsAbstractError();
      }
      /**
       * Returns the offset's common name (such as EST) at the specified timestamp
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to get the name
       * @param {Object} opts - Options to affect the format
       * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
       * @param {string} opts.locale - What locale to return the offset name in.
       * @return {string}
       */
      offsetName(ts, opts) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Returns the offset's value as a string
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to get the offset
       * @param {string} format - What style of offset to return.
       *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
       * @return {string}
       */
      formatOffset(ts, format) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Return the offset in minutes for this zone at the specified timestamp.
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to compute the offset
       * @return {number}
       */
      offset(ts) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Return whether this Zone is equal to another zone
       * @abstract
       * @param {Zone} otherZone - the zone to compare
       * @return {boolean}
       */
      equals(otherZone) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Return whether this Zone is valid.
       * @abstract
       * @type {boolean}
       */
      get isValid() {
        throw new ZoneIsAbstractError();
      }
    };
    var singleton$1 = null;
    var SystemZone = class _SystemZone extends Zone {
      /**
       * Get a singleton instance of the local zone
       * @return {SystemZone}
       */
      static get instance() {
        if (singleton$1 === null) {
          singleton$1 = new _SystemZone();
        }
        return singleton$1;
      }
      /** @override **/
      get type() {
        return "system";
      }
      /** @override **/
      get name() {
        return new Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      /** @override **/
      get isUniversal() {
        return false;
      }
      /** @override **/
      offsetName(ts, {
        format,
        locale
      }) {
        return parseZoneInfo(ts, format, locale);
      }
      /** @override **/
      formatOffset(ts, format) {
        return formatOffset(this.offset(ts), format);
      }
      /** @override **/
      offset(ts) {
        return -new Date(ts).getTimezoneOffset();
      }
      /** @override **/
      equals(otherZone) {
        return otherZone.type === "system";
      }
      /** @override **/
      get isValid() {
        return true;
      }
    };
    var dtfCache = {};
    function makeDTF(zone) {
      if (!dtfCache[zone]) {
        dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
          hour12: false,
          timeZone: zone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          era: "short"
        });
      }
      return dtfCache[zone];
    }
    var typeToPos = {
      year: 0,
      month: 1,
      day: 2,
      era: 3,
      hour: 4,
      minute: 5,
      second: 6
    };
    function hackyOffset(dtf, date) {
      const formatted = dtf.format(date).replace(/\u200E/g, ""), parsed = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(formatted), [, fMonth, fDay, fYear, fadOrBc, fHour, fMinute, fSecond] = parsed;
      return [fYear, fMonth, fDay, fadOrBc, fHour, fMinute, fSecond];
    }
    function partsOffset(dtf, date) {
      const formatted = dtf.formatToParts(date);
      const filled = [];
      for (let i = 0; i < formatted.length; i++) {
        const {
          type,
          value
        } = formatted[i];
        const pos = typeToPos[type];
        if (type === "era") {
          filled[pos] = value;
        } else if (!isUndefined(pos)) {
          filled[pos] = parseInt(value, 10);
        }
      }
      return filled;
    }
    var ianaZoneCache = {};
    var IANAZone = class _IANAZone extends Zone {
      /**
       * @param {string} name - Zone name
       * @return {IANAZone}
       */
      static create(name) {
        if (!ianaZoneCache[name]) {
          ianaZoneCache[name] = new _IANAZone(name);
        }
        return ianaZoneCache[name];
      }
      /**
       * Reset local caches. Should only be necessary in testing scenarios.
       * @return {void}
       */
      static resetCache() {
        ianaZoneCache = {};
        dtfCache = {};
      }
      /**
       * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
       * @param {string} s - The string to check validity on
       * @example IANAZone.isValidSpecifier("America/New_York") //=> true
       * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
       * @deprecated For backward compatibility, this forwards to isValidZone, better use `isValidZone()` directly instead.
       * @return {boolean}
       */
      static isValidSpecifier(s2) {
        return this.isValidZone(s2);
      }
      /**
       * Returns whether the provided string identifies a real zone
       * @param {string} zone - The string to check
       * @example IANAZone.isValidZone("America/New_York") //=> true
       * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
       * @example IANAZone.isValidZone("Sport~~blorp") //=> false
       * @return {boolean}
       */
      static isValidZone(zone) {
        if (!zone) {
          return false;
        }
        try {
          new Intl.DateTimeFormat("en-US", {
            timeZone: zone
          }).format();
          return true;
        } catch (e) {
          return false;
        }
      }
      constructor(name) {
        super();
        this.zoneName = name;
        this.valid = _IANAZone.isValidZone(name);
      }
      /**
       * The type of zone. `iana` for all instances of `IANAZone`.
       * @override
       * @type {string}
       */
      get type() {
        return "iana";
      }
      /**
       * The name of this zone (i.e. the IANA zone name).
       * @override
       * @type {string}
       */
      get name() {
        return this.zoneName;
      }
      /**
       * Returns whether the offset is known to be fixed for the whole year:
       * Always returns false for all IANA zones.
       * @override
       * @type {boolean}
       */
      get isUniversal() {
        return false;
      }
      /**
       * Returns the offset's common name (such as EST) at the specified timestamp
       * @override
       * @param {number} ts - Epoch milliseconds for which to get the name
       * @param {Object} opts - Options to affect the format
       * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
       * @param {string} opts.locale - What locale to return the offset name in.
       * @return {string}
       */
      offsetName(ts, {
        format,
        locale
      }) {
        return parseZoneInfo(ts, format, locale, this.name);
      }
      /**
       * Returns the offset's value as a string
       * @override
       * @param {number} ts - Epoch milliseconds for which to get the offset
       * @param {string} format - What style of offset to return.
       *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
       * @return {string}
       */
      formatOffset(ts, format) {
        return formatOffset(this.offset(ts), format);
      }
      /**
       * Return the offset in minutes for this zone at the specified timestamp.
       * @override
       * @param {number} ts - Epoch milliseconds for which to compute the offset
       * @return {number}
       */
      offset(ts) {
        const date = new Date(ts);
        if (isNaN(date)) return NaN;
        const dtf = makeDTF(this.name);
        let [year, month, day, adOrBc, hour, minute, second] = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date);
        if (adOrBc === "BC") {
          year = -Math.abs(year) + 1;
        }
        const adjustedHour = hour === 24 ? 0 : hour;
        const asUTC = objToLocalTS({
          year,
          month,
          day,
          hour: adjustedHour,
          minute,
          second,
          millisecond: 0
        });
        let asTS = +date;
        const over = asTS % 1e3;
        asTS -= over >= 0 ? over : 1e3 + over;
        return (asUTC - asTS) / (60 * 1e3);
      }
      /**
       * Return whether this Zone is equal to another zone
       * @override
       * @param {Zone} otherZone - the zone to compare
       * @return {boolean}
       */
      equals(otherZone) {
        return otherZone.type === "iana" && otherZone.name === this.name;
      }
      /**
       * Return whether this Zone is valid.
       * @override
       * @type {boolean}
       */
      get isValid() {
        return this.valid;
      }
    };
    var intlLFCache = {};
    function getCachedLF(locString, opts = {}) {
      const key = JSON.stringify([locString, opts]);
      let dtf = intlLFCache[key];
      if (!dtf) {
        dtf = new Intl.ListFormat(locString, opts);
        intlLFCache[key] = dtf;
      }
      return dtf;
    }
    var intlDTCache = {};
    function getCachedDTF(locString, opts = {}) {
      const key = JSON.stringify([locString, opts]);
      let dtf = intlDTCache[key];
      if (!dtf) {
        dtf = new Intl.DateTimeFormat(locString, opts);
        intlDTCache[key] = dtf;
      }
      return dtf;
    }
    var intlNumCache = {};
    function getCachedINF(locString, opts = {}) {
      const key = JSON.stringify([locString, opts]);
      let inf = intlNumCache[key];
      if (!inf) {
        inf = new Intl.NumberFormat(locString, opts);
        intlNumCache[key] = inf;
      }
      return inf;
    }
    var intlRelCache = {};
    function getCachedRTF(locString, opts = {}) {
      const {
        base,
        ...cacheKeyOpts
      } = opts;
      const key = JSON.stringify([locString, cacheKeyOpts]);
      let inf = intlRelCache[key];
      if (!inf) {
        inf = new Intl.RelativeTimeFormat(locString, opts);
        intlRelCache[key] = inf;
      }
      return inf;
    }
    var sysLocaleCache = null;
    function systemLocale() {
      if (sysLocaleCache) {
        return sysLocaleCache;
      } else {
        sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
        return sysLocaleCache;
      }
    }
    var weekInfoCache = {};
    function getCachedWeekInfo(locString) {
      let data = weekInfoCache[locString];
      if (!data) {
        const locale = new Intl.Locale(locString);
        data = "getWeekInfo" in locale ? locale.getWeekInfo() : locale.weekInfo;
        weekInfoCache[locString] = data;
      }
      return data;
    }
    function parseLocaleString(localeStr) {
      const xIndex = localeStr.indexOf("-x-");
      if (xIndex !== -1) {
        localeStr = localeStr.substring(0, xIndex);
      }
      const uIndex = localeStr.indexOf("-u-");
      if (uIndex === -1) {
        return [localeStr];
      } else {
        let options;
        let selectedStr;
        try {
          options = getCachedDTF(localeStr).resolvedOptions();
          selectedStr = localeStr;
        } catch (e) {
          const smaller = localeStr.substring(0, uIndex);
          options = getCachedDTF(smaller).resolvedOptions();
          selectedStr = smaller;
        }
        const {
          numberingSystem,
          calendar
        } = options;
        return [selectedStr, numberingSystem, calendar];
      }
    }
    function intlConfigString(localeStr, numberingSystem, outputCalendar) {
      if (outputCalendar || numberingSystem) {
        if (!localeStr.includes("-u-")) {
          localeStr += "-u";
        }
        if (outputCalendar) {
          localeStr += `-ca-${outputCalendar}`;
        }
        if (numberingSystem) {
          localeStr += `-nu-${numberingSystem}`;
        }
        return localeStr;
      } else {
        return localeStr;
      }
    }
    function mapMonths(f) {
      const ms = [];
      for (let i = 1; i <= 12; i++) {
        const dt = DateTime2.utc(2009, i, 1);
        ms.push(f(dt));
      }
      return ms;
    }
    function mapWeekdays(f) {
      const ms = [];
      for (let i = 1; i <= 7; i++) {
        const dt = DateTime2.utc(2016, 11, 13 + i);
        ms.push(f(dt));
      }
      return ms;
    }
    function listStuff(loc, length, englishFn, intlFn) {
      const mode = loc.listingMode();
      if (mode === "error") {
        return null;
      } else if (mode === "en") {
        return englishFn(length);
      } else {
        return intlFn(length);
      }
    }
    function supportsFastNumbers(loc) {
      if (loc.numberingSystem && loc.numberingSystem !== "latn") {
        return false;
      } else {
        return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
      }
    }
    var PolyNumberFormatter = class {
      constructor(intl, forceSimple, opts) {
        this.padTo = opts.padTo || 0;
        this.floor = opts.floor || false;
        const {
          padTo,
          floor,
          ...otherOpts
        } = opts;
        if (!forceSimple || Object.keys(otherOpts).length > 0) {
          const intlOpts = {
            useGrouping: false,
            ...opts
          };
          if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
          this.inf = getCachedINF(intl, intlOpts);
        }
      }
      format(i) {
        if (this.inf) {
          const fixed = this.floor ? Math.floor(i) : i;
          return this.inf.format(fixed);
        } else {
          const fixed = this.floor ? Math.floor(i) : roundTo(i, 3);
          return padStart(fixed, this.padTo);
        }
      }
    };
    var PolyDateFormatter = class {
      constructor(dt, intl, opts) {
        this.opts = opts;
        this.originalZone = void 0;
        let z = void 0;
        if (this.opts.timeZone) {
          this.dt = dt;
        } else if (dt.zone.type === "fixed") {
          const gmtOffset = -1 * (dt.offset / 60);
          const offsetZ = gmtOffset >= 0 ? `Etc/GMT+${gmtOffset}` : `Etc/GMT${gmtOffset}`;
          if (dt.offset !== 0 && IANAZone.create(offsetZ).valid) {
            z = offsetZ;
            this.dt = dt;
          } else {
            z = "UTC";
            this.dt = dt.offset === 0 ? dt : dt.setZone("UTC").plus({
              minutes: dt.offset
            });
            this.originalZone = dt.zone;
          }
        } else if (dt.zone.type === "system") {
          this.dt = dt;
        } else if (dt.zone.type === "iana") {
          this.dt = dt;
          z = dt.zone.name;
        } else {
          z = "UTC";
          this.dt = dt.setZone("UTC").plus({
            minutes: dt.offset
          });
          this.originalZone = dt.zone;
        }
        const intlOpts = {
          ...this.opts
        };
        intlOpts.timeZone = intlOpts.timeZone || z;
        this.dtf = getCachedDTF(intl, intlOpts);
      }
      format() {
        if (this.originalZone) {
          return this.formatToParts().map(({
            value
          }) => value).join("");
        }
        return this.dtf.format(this.dt.toJSDate());
      }
      formatToParts() {
        const parts = this.dtf.formatToParts(this.dt.toJSDate());
        if (this.originalZone) {
          return parts.map((part) => {
            if (part.type === "timeZoneName") {
              const offsetName = this.originalZone.offsetName(this.dt.ts, {
                locale: this.dt.locale,
                format: this.opts.timeZoneName
              });
              return {
                ...part,
                value: offsetName
              };
            } else {
              return part;
            }
          });
        }
        return parts;
      }
      resolvedOptions() {
        return this.dtf.resolvedOptions();
      }
    };
    var PolyRelFormatter = class {
      constructor(intl, isEnglish, opts) {
        this.opts = {
          style: "long",
          ...opts
        };
        if (!isEnglish && hasRelative()) {
          this.rtf = getCachedRTF(intl, opts);
        }
      }
      format(count, unit) {
        if (this.rtf) {
          return this.rtf.format(count, unit);
        } else {
          return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
        }
      }
      formatToParts(count, unit) {
        if (this.rtf) {
          return this.rtf.formatToParts(count, unit);
        } else {
          return [];
        }
      }
    };
    var fallbackWeekSettings = {
      firstDay: 1,
      minimalDays: 4,
      weekend: [6, 7]
    };
    var Locale = class _Locale {
      static fromOpts(opts) {
        return _Locale.create(opts.locale, opts.numberingSystem, opts.outputCalendar, opts.weekSettings, opts.defaultToEN);
      }
      static create(locale, numberingSystem, outputCalendar, weekSettings, defaultToEN = false) {
        const specifiedLocale = locale || Settings.defaultLocale;
        const localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale());
        const numberingSystemR = numberingSystem || Settings.defaultNumberingSystem;
        const outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
        const weekSettingsR = validateWeekSettings(weekSettings) || Settings.defaultWeekSettings;
        return new _Locale(localeR, numberingSystemR, outputCalendarR, weekSettingsR, specifiedLocale);
      }
      static resetCache() {
        sysLocaleCache = null;
        intlDTCache = {};
        intlNumCache = {};
        intlRelCache = {};
      }
      static fromObject({
        locale,
        numberingSystem,
        outputCalendar,
        weekSettings
      } = {}) {
        return _Locale.create(locale, numberingSystem, outputCalendar, weekSettings);
      }
      constructor(locale, numbering, outputCalendar, weekSettings, specifiedLocale) {
        const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);
        this.locale = parsedLocale;
        this.numberingSystem = numbering || parsedNumberingSystem || null;
        this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
        this.weekSettings = weekSettings;
        this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
        this.weekdaysCache = {
          format: {},
          standalone: {}
        };
        this.monthsCache = {
          format: {},
          standalone: {}
        };
        this.meridiemCache = null;
        this.eraCache = {};
        this.specifiedLocale = specifiedLocale;
        this.fastNumbersCached = null;
      }
      get fastNumbers() {
        if (this.fastNumbersCached == null) {
          this.fastNumbersCached = supportsFastNumbers(this);
        }
        return this.fastNumbersCached;
      }
      listingMode() {
        const isActuallyEn = this.isEnglish();
        const hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
        return isActuallyEn && hasNoWeirdness ? "en" : "intl";
      }
      clone(alts) {
        if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
          return this;
        } else {
          return _Locale.create(alts.locale || this.specifiedLocale, alts.numberingSystem || this.numberingSystem, alts.outputCalendar || this.outputCalendar, validateWeekSettings(alts.weekSettings) || this.weekSettings, alts.defaultToEN || false);
        }
      }
      redefaultToEN(alts = {}) {
        return this.clone({
          ...alts,
          defaultToEN: true
        });
      }
      redefaultToSystem(alts = {}) {
        return this.clone({
          ...alts,
          defaultToEN: false
        });
      }
      months(length, format = false) {
        return listStuff(this, length, months, () => {
          const intl = format ? {
            month: length,
            day: "numeric"
          } : {
            month: length
          }, formatStr = format ? "format" : "standalone";
          if (!this.monthsCache[formatStr][length]) {
            this.monthsCache[formatStr][length] = mapMonths((dt) => this.extract(dt, intl, "month"));
          }
          return this.monthsCache[formatStr][length];
        });
      }
      weekdays(length, format = false) {
        return listStuff(this, length, weekdays, () => {
          const intl = format ? {
            weekday: length,
            year: "numeric",
            month: "long",
            day: "numeric"
          } : {
            weekday: length
          }, formatStr = format ? "format" : "standalone";
          if (!this.weekdaysCache[formatStr][length]) {
            this.weekdaysCache[formatStr][length] = mapWeekdays((dt) => this.extract(dt, intl, "weekday"));
          }
          return this.weekdaysCache[formatStr][length];
        });
      }
      meridiems() {
        return listStuff(this, void 0, () => meridiems, () => {
          if (!this.meridiemCache) {
            const intl = {
              hour: "numeric",
              hourCycle: "h12"
            };
            this.meridiemCache = [DateTime2.utc(2016, 11, 13, 9), DateTime2.utc(2016, 11, 13, 19)].map((dt) => this.extract(dt, intl, "dayperiod"));
          }
          return this.meridiemCache;
        });
      }
      eras(length) {
        return listStuff(this, length, eras, () => {
          const intl = {
            era: length
          };
          if (!this.eraCache[length]) {
            this.eraCache[length] = [DateTime2.utc(-40, 1, 1), DateTime2.utc(2017, 1, 1)].map((dt) => this.extract(dt, intl, "era"));
          }
          return this.eraCache[length];
        });
      }
      extract(dt, intlOpts, field) {
        const df = this.dtFormatter(dt, intlOpts), results = df.formatToParts(), matching = results.find((m) => m.type.toLowerCase() === field);
        return matching ? matching.value : null;
      }
      numberFormatter(opts = {}) {
        return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
      }
      dtFormatter(dt, intlOpts = {}) {
        return new PolyDateFormatter(dt, this.intl, intlOpts);
      }
      relFormatter(opts = {}) {
        return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
      }
      listFormatter(opts = {}) {
        return getCachedLF(this.intl, opts);
      }
      isEnglish() {
        return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
      }
      getWeekSettings() {
        if (this.weekSettings) {
          return this.weekSettings;
        } else if (!hasLocaleWeekInfo()) {
          return fallbackWeekSettings;
        } else {
          return getCachedWeekInfo(this.locale);
        }
      }
      getStartOfWeek() {
        return this.getWeekSettings().firstDay;
      }
      getMinDaysInFirstWeek() {
        return this.getWeekSettings().minimalDays;
      }
      getWeekendDays() {
        return this.getWeekSettings().weekend;
      }
      equals(other) {
        return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
      }
      toString() {
        return `Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`;
      }
    };
    var singleton = null;
    var FixedOffsetZone = class _FixedOffsetZone extends Zone {
      /**
       * Get a singleton instance of UTC
       * @return {FixedOffsetZone}
       */
      static get utcInstance() {
        if (singleton === null) {
          singleton = new _FixedOffsetZone(0);
        }
        return singleton;
      }
      /**
       * Get an instance with a specified offset
       * @param {number} offset - The offset in minutes
       * @return {FixedOffsetZone}
       */
      static instance(offset2) {
        return offset2 === 0 ? _FixedOffsetZone.utcInstance : new _FixedOffsetZone(offset2);
      }
      /**
       * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
       * @param {string} s - The offset string to parse
       * @example FixedOffsetZone.parseSpecifier("UTC+6")
       * @example FixedOffsetZone.parseSpecifier("UTC+06")
       * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
       * @return {FixedOffsetZone}
       */
      static parseSpecifier(s2) {
        if (s2) {
          const r = s2.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
          if (r) {
            return new _FixedOffsetZone(signedOffset(r[1], r[2]));
          }
        }
        return null;
      }
      constructor(offset2) {
        super();
        this.fixed = offset2;
      }
      /**
       * The type of zone. `fixed` for all instances of `FixedOffsetZone`.
       * @override
       * @type {string}
       */
      get type() {
        return "fixed";
      }
      /**
       * The name of this zone.
       * All fixed zones' names always start with "UTC" (plus optional offset)
       * @override
       * @type {string}
       */
      get name() {
        return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
      }
      /**
       * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
       *
       * @override
       * @type {string}
       */
      get ianaName() {
        if (this.fixed === 0) {
          return "Etc/UTC";
        } else {
          return `Etc/GMT${formatOffset(-this.fixed, "narrow")}`;
        }
      }
      /**
       * Returns the offset's common name at the specified timestamp.
       *
       * For fixed offset zones this equals to the zone name.
       * @override
       */
      offsetName() {
        return this.name;
      }
      /**
       * Returns the offset's value as a string
       * @override
       * @param {number} ts - Epoch milliseconds for which to get the offset
       * @param {string} format - What style of offset to return.
       *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
       * @return {string}
       */
      formatOffset(ts, format) {
        return formatOffset(this.fixed, format);
      }
      /**
       * Returns whether the offset is known to be fixed for the whole year:
       * Always returns true for all fixed offset zones.
       * @override
       * @type {boolean}
       */
      get isUniversal() {
        return true;
      }
      /**
       * Return the offset in minutes for this zone at the specified timestamp.
       *
       * For fixed offset zones, this is constant and does not depend on a timestamp.
       * @override
       * @return {number}
       */
      offset() {
        return this.fixed;
      }
      /**
       * Return whether this Zone is equal to another zone (i.e. also fixed and same offset)
       * @override
       * @param {Zone} otherZone - the zone to compare
       * @return {boolean}
       */
      equals(otherZone) {
        return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
      }
      /**
       * Return whether this Zone is valid:
       * All fixed offset zones are valid.
       * @override
       * @type {boolean}
       */
      get isValid() {
        return true;
      }
    };
    var InvalidZone = class extends Zone {
      constructor(zoneName) {
        super();
        this.zoneName = zoneName;
      }
      /** @override **/
      get type() {
        return "invalid";
      }
      /** @override **/
      get name() {
        return this.zoneName;
      }
      /** @override **/
      get isUniversal() {
        return false;
      }
      /** @override **/
      offsetName() {
        return null;
      }
      /** @override **/
      formatOffset() {
        return "";
      }
      /** @override **/
      offset() {
        return NaN;
      }
      /** @override **/
      equals() {
        return false;
      }
      /** @override **/
      get isValid() {
        return false;
      }
    };
    function normalizeZone(input, defaultZone2) {
      if (isUndefined(input) || input === null) {
        return defaultZone2;
      } else if (input instanceof Zone) {
        return input;
      } else if (isString2(input)) {
        const lowered = input.toLowerCase();
        if (lowered === "default") return defaultZone2;
        else if (lowered === "local" || lowered === "system") return SystemZone.instance;
        else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;
        else return FixedOffsetZone.parseSpecifier(lowered) || IANAZone.create(input);
      } else if (isNumber(input)) {
        return FixedOffsetZone.instance(input);
      } else if (typeof input === "object" && "offset" in input && typeof input.offset === "function") {
        return input;
      } else {
        return new InvalidZone(input);
      }
    }
    var numberingSystems = {
      arab: "[\u0660-\u0669]",
      arabext: "[\u06F0-\u06F9]",
      bali: "[\u1B50-\u1B59]",
      beng: "[\u09E6-\u09EF]",
      deva: "[\u0966-\u096F]",
      fullwide: "[\uFF10-\uFF19]",
      gujr: "[\u0AE6-\u0AEF]",
      hanidec: "[\u3007|\u4E00|\u4E8C|\u4E09|\u56DB|\u4E94|\u516D|\u4E03|\u516B|\u4E5D]",
      khmr: "[\u17E0-\u17E9]",
      knda: "[\u0CE6-\u0CEF]",
      laoo: "[\u0ED0-\u0ED9]",
      limb: "[\u1946-\u194F]",
      mlym: "[\u0D66-\u0D6F]",
      mong: "[\u1810-\u1819]",
      mymr: "[\u1040-\u1049]",
      orya: "[\u0B66-\u0B6F]",
      tamldec: "[\u0BE6-\u0BEF]",
      telu: "[\u0C66-\u0C6F]",
      thai: "[\u0E50-\u0E59]",
      tibt: "[\u0F20-\u0F29]",
      latn: "\\d"
    };
    var numberingSystemsUTF16 = {
      arab: [1632, 1641],
      arabext: [1776, 1785],
      bali: [6992, 7001],
      beng: [2534, 2543],
      deva: [2406, 2415],
      fullwide: [65296, 65303],
      gujr: [2790, 2799],
      khmr: [6112, 6121],
      knda: [3302, 3311],
      laoo: [3792, 3801],
      limb: [6470, 6479],
      mlym: [3430, 3439],
      mong: [6160, 6169],
      mymr: [4160, 4169],
      orya: [2918, 2927],
      tamldec: [3046, 3055],
      telu: [3174, 3183],
      thai: [3664, 3673],
      tibt: [3872, 3881]
    };
    var hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
    function parseDigits(str) {
      let value = parseInt(str, 10);
      if (isNaN(value)) {
        value = "";
        for (let i = 0; i < str.length; i++) {
          const code = str.charCodeAt(i);
          if (str[i].search(numberingSystems.hanidec) !== -1) {
            value += hanidecChars.indexOf(str[i]);
          } else {
            for (const key in numberingSystemsUTF16) {
              const [min, max] = numberingSystemsUTF16[key];
              if (code >= min && code <= max) {
                value += code - min;
              }
            }
          }
        }
        return parseInt(value, 10);
      } else {
        return value;
      }
    }
    var digitRegexCache = {};
    function resetDigitRegexCache() {
      digitRegexCache = {};
    }
    function digitRegex({
      numberingSystem
    }, append = "") {
      const ns = numberingSystem || "latn";
      if (!digitRegexCache[ns]) {
        digitRegexCache[ns] = {};
      }
      if (!digitRegexCache[ns][append]) {
        digitRegexCache[ns][append] = new RegExp(`${numberingSystems[ns]}${append}`);
      }
      return digitRegexCache[ns][append];
    }
    var now = () => Date.now();
    var defaultZone = "system";
    var defaultLocale = null;
    var defaultNumberingSystem = null;
    var defaultOutputCalendar = null;
    var twoDigitCutoffYear = 60;
    var throwOnInvalid;
    var defaultWeekSettings = null;
    var Settings = class {
      /**
       * Get the callback for returning the current timestamp.
       * @type {function}
       */
      static get now() {
        return now;
      }
      /**
       * Set the callback for returning the current timestamp.
       * The function should return a number, which will be interpreted as an Epoch millisecond count
       * @type {function}
       * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
       * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
       */
      static set now(n2) {
        now = n2;
      }
      /**
       * Set the default time zone to create DateTimes in. Does not affect existing instances.
       * Use the value "system" to reset this value to the system's time zone.
       * @type {string}
       */
      static set defaultZone(zone) {
        defaultZone = zone;
      }
      /**
       * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
       * The default value is the system's time zone (the one set on the machine that runs this code).
       * @type {Zone}
       */
      static get defaultZone() {
        return normalizeZone(defaultZone, SystemZone.instance);
      }
      /**
       * Get the default locale to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static get defaultLocale() {
        return defaultLocale;
      }
      /**
       * Set the default locale to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static set defaultLocale(locale) {
        defaultLocale = locale;
      }
      /**
       * Get the default numbering system to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static get defaultNumberingSystem() {
        return defaultNumberingSystem;
      }
      /**
       * Set the default numbering system to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static set defaultNumberingSystem(numberingSystem) {
        defaultNumberingSystem = numberingSystem;
      }
      /**
       * Get the default output calendar to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static get defaultOutputCalendar() {
        return defaultOutputCalendar;
      }
      /**
       * Set the default output calendar to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static set defaultOutputCalendar(outputCalendar) {
        defaultOutputCalendar = outputCalendar;
      }
      /**
       * @typedef {Object} WeekSettings
       * @property {number} firstDay
       * @property {number} minimalDays
       * @property {number[]} weekend
       */
      /**
       * @return {WeekSettings|null}
       */
      static get defaultWeekSettings() {
        return defaultWeekSettings;
      }
      /**
       * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
       * how many days are required in the first week of a year.
       * Does not affect existing instances.
       *
       * @param {WeekSettings|null} weekSettings
       */
      static set defaultWeekSettings(weekSettings) {
        defaultWeekSettings = validateWeekSettings(weekSettings);
      }
      /**
       * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
       * @type {number}
       */
      static get twoDigitCutoffYear() {
        return twoDigitCutoffYear;
      }
      /**
       * Set the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
       * @type {number}
       * @example Settings.twoDigitCutoffYear = 0 // all 'yy' are interpreted as 20th century
       * @example Settings.twoDigitCutoffYear = 99 // all 'yy' are interpreted as 21st century
       * @example Settings.twoDigitCutoffYear = 50 // '49' -> 2049; '50' -> 1950
       * @example Settings.twoDigitCutoffYear = 1950 // interpreted as 50
       * @example Settings.twoDigitCutoffYear = 2050 // ALSO interpreted as 50
       */
      static set twoDigitCutoffYear(cutoffYear) {
        twoDigitCutoffYear = cutoffYear % 100;
      }
      /**
       * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
       * @type {boolean}
       */
      static get throwOnInvalid() {
        return throwOnInvalid;
      }
      /**
       * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
       * @type {boolean}
       */
      static set throwOnInvalid(t) {
        throwOnInvalid = t;
      }
      /**
       * Reset Luxon's global caches. Should only be necessary in testing scenarios.
       * @return {void}
       */
      static resetCaches() {
        Locale.resetCache();
        IANAZone.resetCache();
        DateTime2.resetCache();
        resetDigitRegexCache();
      }
    };
    var Invalid = class {
      constructor(reason, explanation) {
        this.reason = reason;
        this.explanation = explanation;
      }
      toMessage() {
        if (this.explanation) {
          return `${this.reason}: ${this.explanation}`;
        } else {
          return this.reason;
        }
      }
    };
    var nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
    function unitOutOfRange(unit, value) {
      return new Invalid("unit out of range", `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`);
    }
    function dayOfWeek(year, month, day) {
      const d = new Date(Date.UTC(year, month - 1, day));
      if (year < 100 && year >= 0) {
        d.setUTCFullYear(d.getUTCFullYear() - 1900);
      }
      const js = d.getUTCDay();
      return js === 0 ? 7 : js;
    }
    function computeOrdinal(year, month, day) {
      return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
    }
    function uncomputeOrdinal(year, ordinal) {
      const table = isLeapYear(year) ? leapLadder : nonLeapLadder, month0 = table.findIndex((i) => i < ordinal), day = ordinal - table[month0];
      return {
        month: month0 + 1,
        day
      };
    }
    function isoWeekdayToLocal(isoWeekday, startOfWeek) {
      return (isoWeekday - startOfWeek + 7) % 7 + 1;
    }
    function gregorianToWeek(gregObj, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const {
        year,
        month,
        day
      } = gregObj, ordinal = computeOrdinal(year, month, day), weekday = isoWeekdayToLocal(dayOfWeek(year, month, day), startOfWeek);
      let weekNumber = Math.floor((ordinal - weekday + 14 - minDaysInFirstWeek) / 7), weekYear;
      if (weekNumber < 1) {
        weekYear = year - 1;
        weekNumber = weeksInWeekYear(weekYear, minDaysInFirstWeek, startOfWeek);
      } else if (weekNumber > weeksInWeekYear(year, minDaysInFirstWeek, startOfWeek)) {
        weekYear = year + 1;
        weekNumber = 1;
      } else {
        weekYear = year;
      }
      return {
        weekYear,
        weekNumber,
        weekday,
        ...timeObject(gregObj)
      };
    }
    function weekToGregorian(weekData, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const {
        weekYear,
        weekNumber,
        weekday
      } = weekData, weekdayOfJan4 = isoWeekdayToLocal(dayOfWeek(weekYear, 1, minDaysInFirstWeek), startOfWeek), yearInDays = daysInYear(weekYear);
      let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 7 + minDaysInFirstWeek, year;
      if (ordinal < 1) {
        year = weekYear - 1;
        ordinal += daysInYear(year);
      } else if (ordinal > yearInDays) {
        year = weekYear + 1;
        ordinal -= daysInYear(weekYear);
      } else {
        year = weekYear;
      }
      const {
        month,
        day
      } = uncomputeOrdinal(year, ordinal);
      return {
        year,
        month,
        day,
        ...timeObject(weekData)
      };
    }
    function gregorianToOrdinal(gregData) {
      const {
        year,
        month,
        day
      } = gregData;
      const ordinal = computeOrdinal(year, month, day);
      return {
        year,
        ordinal,
        ...timeObject(gregData)
      };
    }
    function ordinalToGregorian(ordinalData) {
      const {
        year,
        ordinal
      } = ordinalData;
      const {
        month,
        day
      } = uncomputeOrdinal(year, ordinal);
      return {
        year,
        month,
        day,
        ...timeObject(ordinalData)
      };
    }
    function usesLocalWeekValues(obj, loc) {
      const hasLocaleWeekData = !isUndefined(obj.localWeekday) || !isUndefined(obj.localWeekNumber) || !isUndefined(obj.localWeekYear);
      if (hasLocaleWeekData) {
        const hasIsoWeekData = !isUndefined(obj.weekday) || !isUndefined(obj.weekNumber) || !isUndefined(obj.weekYear);
        if (hasIsoWeekData) {
          throw new ConflictingSpecificationError("Cannot mix locale-based week fields with ISO-based week fields");
        }
        if (!isUndefined(obj.localWeekday)) obj.weekday = obj.localWeekday;
        if (!isUndefined(obj.localWeekNumber)) obj.weekNumber = obj.localWeekNumber;
        if (!isUndefined(obj.localWeekYear)) obj.weekYear = obj.localWeekYear;
        delete obj.localWeekday;
        delete obj.localWeekNumber;
        delete obj.localWeekYear;
        return {
          minDaysInFirstWeek: loc.getMinDaysInFirstWeek(),
          startOfWeek: loc.getStartOfWeek()
        };
      } else {
        return {
          minDaysInFirstWeek: 4,
          startOfWeek: 1
        };
      }
    }
    function hasInvalidWeekData(obj, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const validYear = isInteger(obj.weekYear), validWeek = integerBetween(obj.weekNumber, 1, weeksInWeekYear(obj.weekYear, minDaysInFirstWeek, startOfWeek)), validWeekday = integerBetween(obj.weekday, 1, 7);
      if (!validYear) {
        return unitOutOfRange("weekYear", obj.weekYear);
      } else if (!validWeek) {
        return unitOutOfRange("week", obj.weekNumber);
      } else if (!validWeekday) {
        return unitOutOfRange("weekday", obj.weekday);
      } else return false;
    }
    function hasInvalidOrdinalData(obj) {
      const validYear = isInteger(obj.year), validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));
      if (!validYear) {
        return unitOutOfRange("year", obj.year);
      } else if (!validOrdinal) {
        return unitOutOfRange("ordinal", obj.ordinal);
      } else return false;
    }
    function hasInvalidGregorianData(obj) {
      const validYear = isInteger(obj.year), validMonth = integerBetween(obj.month, 1, 12), validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));
      if (!validYear) {
        return unitOutOfRange("year", obj.year);
      } else if (!validMonth) {
        return unitOutOfRange("month", obj.month);
      } else if (!validDay) {
        return unitOutOfRange("day", obj.day);
      } else return false;
    }
    function hasInvalidTimeData(obj) {
      const {
        hour,
        minute,
        second,
        millisecond
      } = obj;
      const validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween(minute, 0, 59), validSecond = integerBetween(second, 0, 59), validMillisecond = integerBetween(millisecond, 0, 999);
      if (!validHour) {
        return unitOutOfRange("hour", hour);
      } else if (!validMinute) {
        return unitOutOfRange("minute", minute);
      } else if (!validSecond) {
        return unitOutOfRange("second", second);
      } else if (!validMillisecond) {
        return unitOutOfRange("millisecond", millisecond);
      } else return false;
    }
    function isUndefined(o) {
      return typeof o === "undefined";
    }
    function isNumber(o) {
      return typeof o === "number";
    }
    function isInteger(o) {
      return typeof o === "number" && o % 1 === 0;
    }
    function isString2(o) {
      return typeof o === "string";
    }
    function isDate(o) {
      return Object.prototype.toString.call(o) === "[object Date]";
    }
    function hasRelative() {
      try {
        return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
      } catch (e) {
        return false;
      }
    }
    function hasLocaleWeekInfo() {
      try {
        return typeof Intl !== "undefined" && !!Intl.Locale && ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype);
      } catch (e) {
        return false;
      }
    }
    function maybeArray(thing) {
      return Array.isArray(thing) ? thing : [thing];
    }
    function bestBy(arr, by, compare) {
      if (arr.length === 0) {
        return void 0;
      }
      return arr.reduce((best, next) => {
        const pair = [by(next), next];
        if (!best) {
          return pair;
        } else if (compare(best[0], pair[0]) === best[0]) {
          return best;
        } else {
          return pair;
        }
      }, null)[1];
    }
    function pick(obj, keys) {
      return keys.reduce((a, k) => {
        a[k] = obj[k];
        return a;
      }, {});
    }
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    function validateWeekSettings(settings) {
      if (settings == null) {
        return null;
      } else if (typeof settings !== "object") {
        throw new InvalidArgumentError("Week settings must be an object");
      } else {
        if (!integerBetween(settings.firstDay, 1, 7) || !integerBetween(settings.minimalDays, 1, 7) || !Array.isArray(settings.weekend) || settings.weekend.some((v) => !integerBetween(v, 1, 7))) {
          throw new InvalidArgumentError("Invalid week settings");
        }
        return {
          firstDay: settings.firstDay,
          minimalDays: settings.minimalDays,
          weekend: Array.from(settings.weekend)
        };
      }
    }
    function integerBetween(thing, bottom, top) {
      return isInteger(thing) && thing >= bottom && thing <= top;
    }
    function floorMod(x, n2) {
      return x - n2 * Math.floor(x / n2);
    }
    function padStart(input, n2 = 2) {
      const isNeg = input < 0;
      let padded;
      if (isNeg) {
        padded = "-" + ("" + -input).padStart(n2, "0");
      } else {
        padded = ("" + input).padStart(n2, "0");
      }
      return padded;
    }
    function parseInteger(string) {
      if (isUndefined(string) || string === null || string === "") {
        return void 0;
      } else {
        return parseInt(string, 10);
      }
    }
    function parseFloating(string) {
      if (isUndefined(string) || string === null || string === "") {
        return void 0;
      } else {
        return parseFloat(string);
      }
    }
    function parseMillis(fraction) {
      if (isUndefined(fraction) || fraction === null || fraction === "") {
        return void 0;
      } else {
        const f = parseFloat("0." + fraction) * 1e3;
        return Math.floor(f);
      }
    }
    function roundTo(number, digits, towardZero = false) {
      const factor = 10 ** digits, rounder = towardZero ? Math.trunc : Math.round;
      return rounder(number * factor) / factor;
    }
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    function daysInYear(year) {
      return isLeapYear(year) ? 366 : 365;
    }
    function daysInMonth(year, month) {
      const modMonth = floorMod(month - 1, 12) + 1, modYear = year + (month - modMonth) / 12;
      if (modMonth === 2) {
        return isLeapYear(modYear) ? 29 : 28;
      } else {
        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
      }
    }
    function objToLocalTS(obj) {
      let d = Date.UTC(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond);
      if (obj.year < 100 && obj.year >= 0) {
        d = new Date(d);
        d.setUTCFullYear(obj.year, obj.month - 1, obj.day);
      }
      return +d;
    }
    function firstWeekOffset(year, minDaysInFirstWeek, startOfWeek) {
      const fwdlw = isoWeekdayToLocal(dayOfWeek(year, 1, minDaysInFirstWeek), startOfWeek);
      return -fwdlw + minDaysInFirstWeek - 1;
    }
    function weeksInWeekYear(weekYear, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const weekOffset = firstWeekOffset(weekYear, minDaysInFirstWeek, startOfWeek);
      const weekOffsetNext = firstWeekOffset(weekYear + 1, minDaysInFirstWeek, startOfWeek);
      return (daysInYear(weekYear) - weekOffset + weekOffsetNext) / 7;
    }
    function untruncateYear(year) {
      if (year > 99) {
        return year;
      } else return year > Settings.twoDigitCutoffYear ? 1900 + year : 2e3 + year;
    }
    function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
      const date = new Date(ts), intlOpts = {
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      };
      if (timeZone) {
        intlOpts.timeZone = timeZone;
      }
      const modified = {
        timeZoneName: offsetFormat,
        ...intlOpts
      };
      const parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find((m) => m.type.toLowerCase() === "timezonename");
      return parsed ? parsed.value : null;
    }
    function signedOffset(offHourStr, offMinuteStr) {
      let offHour = parseInt(offHourStr, 10);
      if (Number.isNaN(offHour)) {
        offHour = 0;
      }
      const offMin = parseInt(offMinuteStr, 10) || 0, offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
      return offHour * 60 + offMinSigned;
    }
    function asNumber(value) {
      const numericValue = Number(value);
      if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue)) throw new InvalidArgumentError(`Invalid unit value ${value}`);
      return numericValue;
    }
    function normalizeObject(obj, normalizer) {
      const normalized = {};
      for (const u in obj) {
        if (hasOwnProperty(obj, u)) {
          const v = obj[u];
          if (v === void 0 || v === null) continue;
          normalized[normalizer(u)] = asNumber(v);
        }
      }
      return normalized;
    }
    function formatOffset(offset2, format) {
      const hours = Math.trunc(Math.abs(offset2 / 60)), minutes = Math.trunc(Math.abs(offset2 % 60)), sign = offset2 >= 0 ? "+" : "-";
      switch (format) {
        case "short":
          return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
        case "narrow":
          return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
        case "techie":
          return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
        default:
          throw new RangeError(`Value format ${format} is out of range for property format`);
      }
    }
    function timeObject(obj) {
      return pick(obj, ["hour", "minute", "second", "millisecond"]);
    }
    var monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    function months(length) {
      switch (length) {
        case "narrow":
          return [...monthsNarrow];
        case "short":
          return [...monthsShort];
        case "long":
          return [...monthsLong];
        case "numeric":
          return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        case "2-digit":
          return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        default:
          return null;
      }
    }
    var weekdaysLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];
    function weekdays(length) {
      switch (length) {
        case "narrow":
          return [...weekdaysNarrow];
        case "short":
          return [...weekdaysShort];
        case "long":
          return [...weekdaysLong];
        case "numeric":
          return ["1", "2", "3", "4", "5", "6", "7"];
        default:
          return null;
      }
    }
    var meridiems = ["AM", "PM"];
    var erasLong = ["Before Christ", "Anno Domini"];
    var erasShort = ["BC", "AD"];
    var erasNarrow = ["B", "A"];
    function eras(length) {
      switch (length) {
        case "narrow":
          return [...erasNarrow];
        case "short":
          return [...erasShort];
        case "long":
          return [...erasLong];
        default:
          return null;
      }
    }
    function meridiemForDateTime(dt) {
      return meridiems[dt.hour < 12 ? 0 : 1];
    }
    function weekdayForDateTime(dt, length) {
      return weekdays(length)[dt.weekday - 1];
    }
    function monthForDateTime(dt, length) {
      return months(length)[dt.month - 1];
    }
    function eraForDateTime(dt, length) {
      return eras(length)[dt.year < 0 ? 0 : 1];
    }
    function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
      const units = {
        years: ["year", "yr."],
        quarters: ["quarter", "qtr."],
        months: ["month", "mo."],
        weeks: ["week", "wk."],
        days: ["day", "day", "days"],
        hours: ["hour", "hr."],
        minutes: ["minute", "min."],
        seconds: ["second", "sec."]
      };
      const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;
      if (numeric === "auto" && lastable) {
        const isDay = unit === "days";
        switch (count) {
          case 1:
            return isDay ? "tomorrow" : `next ${units[unit][0]}`;
          case -1:
            return isDay ? "yesterday" : `last ${units[unit][0]}`;
          case 0:
            return isDay ? "today" : `this ${units[unit][0]}`;
        }
      }
      const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
      return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
    }
    function stringifyTokens(splits, tokenToString) {
      let s2 = "";
      for (const token of splits) {
        if (token.literal) {
          s2 += token.val;
        } else {
          s2 += tokenToString(token.val);
        }
      }
      return s2;
    }
    var macroTokenToFormatOpts = {
      D: DATE_SHORT,
      DD: DATE_MED,
      DDD: DATE_FULL,
      DDDD: DATE_HUGE,
      t: TIME_SIMPLE,
      tt: TIME_WITH_SECONDS,
      ttt: TIME_WITH_SHORT_OFFSET,
      tttt: TIME_WITH_LONG_OFFSET,
      T: TIME_24_SIMPLE,
      TT: TIME_24_WITH_SECONDS,
      TTT: TIME_24_WITH_SHORT_OFFSET,
      TTTT: TIME_24_WITH_LONG_OFFSET,
      f: DATETIME_SHORT,
      ff: DATETIME_MED,
      fff: DATETIME_FULL,
      ffff: DATETIME_HUGE,
      F: DATETIME_SHORT_WITH_SECONDS,
      FF: DATETIME_MED_WITH_SECONDS,
      FFF: DATETIME_FULL_WITH_SECONDS,
      FFFF: DATETIME_HUGE_WITH_SECONDS
    };
    var Formatter = class _Formatter {
      static create(locale, opts = {}) {
        return new _Formatter(locale, opts);
      }
      static parseFormat(fmt) {
        let current = null, currentFull = "", bracketed = false;
        const splits = [];
        for (let i = 0; i < fmt.length; i++) {
          const c = fmt.charAt(i);
          if (c === "'") {
            if (currentFull.length > 0) {
              splits.push({
                literal: bracketed || /^\s+$/.test(currentFull),
                val: currentFull
              });
            }
            current = null;
            currentFull = "";
            bracketed = !bracketed;
          } else if (bracketed) {
            currentFull += c;
          } else if (c === current) {
            currentFull += c;
          } else {
            if (currentFull.length > 0) {
              splits.push({
                literal: /^\s+$/.test(currentFull),
                val: currentFull
              });
            }
            currentFull = c;
            current = c;
          }
        }
        if (currentFull.length > 0) {
          splits.push({
            literal: bracketed || /^\s+$/.test(currentFull),
            val: currentFull
          });
        }
        return splits;
      }
      static macroTokenToFormatOpts(token) {
        return macroTokenToFormatOpts[token];
      }
      constructor(locale, formatOpts) {
        this.opts = formatOpts;
        this.loc = locale;
        this.systemLoc = null;
      }
      formatWithSystemDefault(dt, opts) {
        if (this.systemLoc === null) {
          this.systemLoc = this.loc.redefaultToSystem();
        }
        const df = this.systemLoc.dtFormatter(dt, {
          ...this.opts,
          ...opts
        });
        return df.format();
      }
      dtFormatter(dt, opts = {}) {
        return this.loc.dtFormatter(dt, {
          ...this.opts,
          ...opts
        });
      }
      formatDateTime(dt, opts) {
        return this.dtFormatter(dt, opts).format();
      }
      formatDateTimeParts(dt, opts) {
        return this.dtFormatter(dt, opts).formatToParts();
      }
      formatInterval(interval, opts) {
        const df = this.dtFormatter(interval.start, opts);
        return df.dtf.formatRange(interval.start.toJSDate(), interval.end.toJSDate());
      }
      resolvedOptions(dt, opts) {
        return this.dtFormatter(dt, opts).resolvedOptions();
      }
      num(n2, p = 0) {
        if (this.opts.forceSimple) {
          return padStart(n2, p);
        }
        const opts = {
          ...this.opts
        };
        if (p > 0) {
          opts.padTo = p;
        }
        return this.loc.numberFormatter(opts).format(n2);
      }
      formatDateTimeFromString(dt, fmt) {
        const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory", string = (opts, extract) => this.loc.extract(dt, opts, extract), formatOffset2 = (opts) => {
          if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
            return "Z";
          }
          return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
        }, meridiem = () => knownEnglish ? meridiemForDateTime(dt) : string({
          hour: "numeric",
          hourCycle: "h12"
        }, "dayperiod"), month = (length, standalone) => knownEnglish ? monthForDateTime(dt, length) : string(standalone ? {
          month: length
        } : {
          month: length,
          day: "numeric"
        }, "month"), weekday = (length, standalone) => knownEnglish ? weekdayForDateTime(dt, length) : string(standalone ? {
          weekday: length
        } : {
          weekday: length,
          month: "long",
          day: "numeric"
        }, "weekday"), maybeMacro = (token) => {
          const formatOpts = _Formatter.macroTokenToFormatOpts(token);
          if (formatOpts) {
            return this.formatWithSystemDefault(dt, formatOpts);
          } else {
            return token;
          }
        }, era = (length) => knownEnglish ? eraForDateTime(dt, length) : string({
          era: length
        }, "era"), tokenToString = (token) => {
          switch (token) {
            case "S":
              return this.num(dt.millisecond);
            case "u":
            case "SSS":
              return this.num(dt.millisecond, 3);
            case "s":
              return this.num(dt.second);
            case "ss":
              return this.num(dt.second, 2);
            case "uu":
              return this.num(Math.floor(dt.millisecond / 10), 2);
            case "uuu":
              return this.num(Math.floor(dt.millisecond / 100));
            case "m":
              return this.num(dt.minute);
            case "mm":
              return this.num(dt.minute, 2);
            case "h":
              return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
            case "hh":
              return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
            case "H":
              return this.num(dt.hour);
            case "HH":
              return this.num(dt.hour, 2);
            case "Z":
              return formatOffset2({
                format: "narrow",
                allowZ: this.opts.allowZ
              });
            case "ZZ":
              return formatOffset2({
                format: "short",
                allowZ: this.opts.allowZ
              });
            case "ZZZ":
              return formatOffset2({
                format: "techie",
                allowZ: this.opts.allowZ
              });
            case "ZZZZ":
              return dt.zone.offsetName(dt.ts, {
                format: "short",
                locale: this.loc.locale
              });
            case "ZZZZZ":
              return dt.zone.offsetName(dt.ts, {
                format: "long",
                locale: this.loc.locale
              });
            case "z":
              return dt.zoneName;
            case "a":
              return meridiem();
            case "d":
              return useDateTimeFormatter ? string({
                day: "numeric"
              }, "day") : this.num(dt.day);
            case "dd":
              return useDateTimeFormatter ? string({
                day: "2-digit"
              }, "day") : this.num(dt.day, 2);
            case "c":
              return this.num(dt.weekday);
            case "ccc":
              return weekday("short", true);
            case "cccc":
              return weekday("long", true);
            case "ccccc":
              return weekday("narrow", true);
            case "E":
              return this.num(dt.weekday);
            case "EEE":
              return weekday("short", false);
            case "EEEE":
              return weekday("long", false);
            case "EEEEE":
              return weekday("narrow", false);
            case "L":
              return useDateTimeFormatter ? string({
                month: "numeric",
                day: "numeric"
              }, "month") : this.num(dt.month);
            case "LL":
              return useDateTimeFormatter ? string({
                month: "2-digit",
                day: "numeric"
              }, "month") : this.num(dt.month, 2);
            case "LLL":
              return month("short", true);
            case "LLLL":
              return month("long", true);
            case "LLLLL":
              return month("narrow", true);
            case "M":
              return useDateTimeFormatter ? string({
                month: "numeric"
              }, "month") : this.num(dt.month);
            case "MM":
              return useDateTimeFormatter ? string({
                month: "2-digit"
              }, "month") : this.num(dt.month, 2);
            case "MMM":
              return month("short", false);
            case "MMMM":
              return month("long", false);
            case "MMMMM":
              return month("narrow", false);
            case "y":
              return useDateTimeFormatter ? string({
                year: "numeric"
              }, "year") : this.num(dt.year);
            case "yy":
              return useDateTimeFormatter ? string({
                year: "2-digit"
              }, "year") : this.num(dt.year.toString().slice(-2), 2);
            case "yyyy":
              return useDateTimeFormatter ? string({
                year: "numeric"
              }, "year") : this.num(dt.year, 4);
            case "yyyyyy":
              return useDateTimeFormatter ? string({
                year: "numeric"
              }, "year") : this.num(dt.year, 6);
            case "G":
              return era("short");
            case "GG":
              return era("long");
            case "GGGGG":
              return era("narrow");
            case "kk":
              return this.num(dt.weekYear.toString().slice(-2), 2);
            case "kkkk":
              return this.num(dt.weekYear, 4);
            case "W":
              return this.num(dt.weekNumber);
            case "WW":
              return this.num(dt.weekNumber, 2);
            case "n":
              return this.num(dt.localWeekNumber);
            case "nn":
              return this.num(dt.localWeekNumber, 2);
            case "ii":
              return this.num(dt.localWeekYear.toString().slice(-2), 2);
            case "iiii":
              return this.num(dt.localWeekYear, 4);
            case "o":
              return this.num(dt.ordinal);
            case "ooo":
              return this.num(dt.ordinal, 3);
            case "q":
              return this.num(dt.quarter);
            case "qq":
              return this.num(dt.quarter, 2);
            case "X":
              return this.num(Math.floor(dt.ts / 1e3));
            case "x":
              return this.num(dt.ts);
            default:
              return maybeMacro(token);
          }
        };
        return stringifyTokens(_Formatter.parseFormat(fmt), tokenToString);
      }
      formatDurationFromString(dur, fmt) {
        const tokenToField = (token) => {
          switch (token[0]) {
            case "S":
              return "millisecond";
            case "s":
              return "second";
            case "m":
              return "minute";
            case "h":
              return "hour";
            case "d":
              return "day";
            case "w":
              return "week";
            case "M":
              return "month";
            case "y":
              return "year";
            default:
              return null;
          }
        }, tokenToString = (lildur) => (token) => {
          const mapped = tokenToField(token);
          if (mapped) {
            return this.num(lildur.get(mapped), token.length);
          } else {
            return token;
          }
        }, tokens = _Formatter.parseFormat(fmt), realTokens = tokens.reduce((found, {
          literal,
          val
        }) => literal ? found : found.concat(val), []), collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t) => t));
        return stringifyTokens(tokens, tokenToString(collapsed));
      }
    };
    var ianaRegex = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
    function combineRegexes(...regexes) {
      const full = regexes.reduce((f, r) => f + r.source, "");
      return RegExp(`^${full}$`);
    }
    function combineExtractors(...extractors) {
      return (m) => extractors.reduce(([mergedVals, mergedZone, cursor], ex) => {
        const [val, zone, next] = ex(m, cursor);
        return [{
          ...mergedVals,
          ...val
        }, zone || mergedZone, next];
      }, [{}, null, 1]).slice(0, 2);
    }
    function parse(s2, ...patterns) {
      if (s2 == null) {
        return [null, null];
      }
      for (const [regex, extractor] of patterns) {
        const m = regex.exec(s2);
        if (m) {
          return extractor(m);
        }
      }
      return [null, null];
    }
    function simpleParse(...keys) {
      return (match2, cursor) => {
        const ret = {};
        let i;
        for (i = 0; i < keys.length; i++) {
          ret[keys[i]] = parseInteger(match2[cursor + i]);
        }
        return [ret, null, cursor + i];
      };
    }
    var offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
    var isoExtendedZone = `(?:${offsetRegex.source}?(?:\\[(${ianaRegex.source})\\])?)?`;
    var isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
    var isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${isoExtendedZone}`);
    var isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`);
    var isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
    var isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
    var isoOrdinalRegex = /(\d{4})-?(\d{3})/;
    var extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay");
    var extractISOOrdinalData = simpleParse("year", "ordinal");
    var sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/;
    var sqlTimeRegex = RegExp(`${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`);
    var sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);
    function int(match2, pos, fallback) {
      const m = match2[pos];
      return isUndefined(m) ? fallback : parseInteger(m);
    }
    function extractISOYmd(match2, cursor) {
      const item = {
        year: int(match2, cursor),
        month: int(match2, cursor + 1, 1),
        day: int(match2, cursor + 2, 1)
      };
      return [item, null, cursor + 3];
    }
    function extractISOTime(match2, cursor) {
      const item = {
        hours: int(match2, cursor, 0),
        minutes: int(match2, cursor + 1, 0),
        seconds: int(match2, cursor + 2, 0),
        milliseconds: parseMillis(match2[cursor + 3])
      };
      return [item, null, cursor + 4];
    }
    function extractISOOffset(match2, cursor) {
      const local = !match2[cursor] && !match2[cursor + 1], fullOffset = signedOffset(match2[cursor + 1], match2[cursor + 2]), zone = local ? null : FixedOffsetZone.instance(fullOffset);
      return [{}, zone, cursor + 3];
    }
    function extractIANAZone(match2, cursor) {
      const zone = match2[cursor] ? IANAZone.create(match2[cursor]) : null;
      return [{}, zone, cursor + 1];
    }
    var isoTimeOnly = RegExp(`^T?${isoTimeBaseRegex.source}$`);
    var isoDuration = /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
    function extractISODuration(match2) {
      const [s2, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match2;
      const hasNegativePrefix = s2[0] === "-";
      const negativeSeconds = secondStr && secondStr[0] === "-";
      const maybeNegate = (num, force = false) => num !== void 0 && (force || num && hasNegativePrefix) ? -num : num;
      return [{
        years: maybeNegate(parseFloating(yearStr)),
        months: maybeNegate(parseFloating(monthStr)),
        weeks: maybeNegate(parseFloating(weekStr)),
        days: maybeNegate(parseFloating(dayStr)),
        hours: maybeNegate(parseFloating(hourStr)),
        minutes: maybeNegate(parseFloating(minuteStr)),
        seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
        milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds)
      }];
    }
    var obsOffsets = {
      GMT: 0,
      EDT: -4 * 60,
      EST: -5 * 60,
      CDT: -5 * 60,
      CST: -6 * 60,
      MDT: -6 * 60,
      MST: -7 * 60,
      PDT: -7 * 60,
      PST: -8 * 60
    };
    function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
      const result = {
        year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
        month: monthsShort.indexOf(monthStr) + 1,
        day: parseInteger(dayStr),
        hour: parseInteger(hourStr),
        minute: parseInteger(minuteStr)
      };
      if (secondStr) result.second = parseInteger(secondStr);
      if (weekdayStr) {
        result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
      }
      return result;
    }
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
    function extractRFC2822(match2) {
      const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr, obsOffset, milOffset, offHourStr, offMinuteStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      let offset2;
      if (obsOffset) {
        offset2 = obsOffsets[obsOffset];
      } else if (milOffset) {
        offset2 = 0;
      } else {
        offset2 = signedOffset(offHourStr, offMinuteStr);
      }
      return [result, new FixedOffsetZone(offset2)];
    }
    function preprocessRFC2822(s2) {
      return s2.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
    }
    var rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/;
    var rfc850 = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/;
    var ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
    function extractRFC1123Or850(match2) {
      const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      return [result, FixedOffsetZone.utcInstance];
    }
    function extractASCII(match2) {
      const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      return [result, FixedOffsetZone.utcInstance];
    }
    var isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
    var isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
    var isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
    var isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
    var extractISOYmdTimeAndOffset = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset, extractIANAZone);
    var extractISOWeekTimeAndOffset = combineExtractors(extractISOWeekData, extractISOTime, extractISOOffset, extractIANAZone);
    var extractISOOrdinalDateAndTime = combineExtractors(extractISOOrdinalData, extractISOTime, extractISOOffset, extractIANAZone);
    var extractISOTimeAndOffset = combineExtractors(extractISOTime, extractISOOffset, extractIANAZone);
    function parseISODate(s2) {
      return parse(s2, [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset], [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset], [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime], [isoTimeCombinedRegex, extractISOTimeAndOffset]);
    }
    function parseRFC2822Date(s2) {
      return parse(preprocessRFC2822(s2), [rfc2822, extractRFC2822]);
    }
    function parseHTTPDate(s2) {
      return parse(s2, [rfc1123, extractRFC1123Or850], [rfc850, extractRFC1123Or850], [ascii, extractASCII]);
    }
    function parseISODuration(s2) {
      return parse(s2, [isoDuration, extractISODuration]);
    }
    var extractISOTimeOnly = combineExtractors(extractISOTime);
    function parseISOTimeOnly(s2) {
      return parse(s2, [isoTimeOnly, extractISOTimeOnly]);
    }
    var sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
    var sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
    var extractISOTimeOffsetAndIANAZone = combineExtractors(extractISOTime, extractISOOffset, extractIANAZone);
    function parseSQL(s2) {
      return parse(s2, [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset], [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]);
    }
    var INVALID$2 = "Invalid Duration";
    var lowOrderMatrix = {
      weeks: {
        days: 7,
        hours: 7 * 24,
        minutes: 7 * 24 * 60,
        seconds: 7 * 24 * 60 * 60,
        milliseconds: 7 * 24 * 60 * 60 * 1e3
      },
      days: {
        hours: 24,
        minutes: 24 * 60,
        seconds: 24 * 60 * 60,
        milliseconds: 24 * 60 * 60 * 1e3
      },
      hours: {
        minutes: 60,
        seconds: 60 * 60,
        milliseconds: 60 * 60 * 1e3
      },
      minutes: {
        seconds: 60,
        milliseconds: 60 * 1e3
      },
      seconds: {
        milliseconds: 1e3
      }
    };
    var casualMatrix = {
      years: {
        quarters: 4,
        months: 12,
        weeks: 52,
        days: 365,
        hours: 365 * 24,
        minutes: 365 * 24 * 60,
        seconds: 365 * 24 * 60 * 60,
        milliseconds: 365 * 24 * 60 * 60 * 1e3
      },
      quarters: {
        months: 3,
        weeks: 13,
        days: 91,
        hours: 91 * 24,
        minutes: 91 * 24 * 60,
        seconds: 91 * 24 * 60 * 60,
        milliseconds: 91 * 24 * 60 * 60 * 1e3
      },
      months: {
        weeks: 4,
        days: 30,
        hours: 30 * 24,
        minutes: 30 * 24 * 60,
        seconds: 30 * 24 * 60 * 60,
        milliseconds: 30 * 24 * 60 * 60 * 1e3
      },
      ...lowOrderMatrix
    };
    var daysInYearAccurate = 146097 / 400;
    var daysInMonthAccurate = 146097 / 4800;
    var accurateMatrix = {
      years: {
        quarters: 4,
        months: 12,
        weeks: daysInYearAccurate / 7,
        days: daysInYearAccurate,
        hours: daysInYearAccurate * 24,
        minutes: daysInYearAccurate * 24 * 60,
        seconds: daysInYearAccurate * 24 * 60 * 60,
        milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3
      },
      quarters: {
        months: 3,
        weeks: daysInYearAccurate / 28,
        days: daysInYearAccurate / 4,
        hours: daysInYearAccurate * 24 / 4,
        minutes: daysInYearAccurate * 24 * 60 / 4,
        seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
        milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3 / 4
      },
      months: {
        weeks: daysInMonthAccurate / 7,
        days: daysInMonthAccurate,
        hours: daysInMonthAccurate * 24,
        minutes: daysInMonthAccurate * 24 * 60,
        seconds: daysInMonthAccurate * 24 * 60 * 60,
        milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1e3
      },
      ...lowOrderMatrix
    };
    var orderedUnits$1 = ["years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
    var reverseUnits = orderedUnits$1.slice(0).reverse();
    function clone$1(dur, alts, clear = false) {
      const conf = {
        values: clear ? alts.values : {
          ...dur.values,
          ...alts.values || {}
        },
        loc: dur.loc.clone(alts.loc),
        conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy,
        matrix: alts.matrix || dur.matrix
      };
      return new Duration2(conf);
    }
    function durationToMillis(matrix, vals) {
      var _vals$milliseconds;
      let sum = (_vals$milliseconds = vals.milliseconds) != null ? _vals$milliseconds : 0;
      for (const unit of reverseUnits.slice(1)) {
        if (vals[unit]) {
          sum += vals[unit] * matrix[unit]["milliseconds"];
        }
      }
      return sum;
    }
    function normalizeValues(matrix, vals) {
      const factor = durationToMillis(matrix, vals) < 0 ? -1 : 1;
      orderedUnits$1.reduceRight((previous, current) => {
        if (!isUndefined(vals[current])) {
          if (previous) {
            const previousVal = vals[previous] * factor;
            const conv = matrix[current][previous];
            const rollUp = Math.floor(previousVal / conv);
            vals[current] += rollUp * factor;
            vals[previous] -= rollUp * conv * factor;
          }
          return current;
        } else {
          return previous;
        }
      }, null);
      orderedUnits$1.reduce((previous, current) => {
        if (!isUndefined(vals[current])) {
          if (previous) {
            const fraction = vals[previous] % 1;
            vals[previous] -= fraction;
            vals[current] += fraction * matrix[previous][current];
          }
          return current;
        } else {
          return previous;
        }
      }, null);
    }
    function removeZeroes(vals) {
      const newVals = {};
      for (const [key, value] of Object.entries(vals)) {
        if (value !== 0) {
          newVals[key] = value;
        }
      }
      return newVals;
    }
    var Duration2 = class _Duration {
      /**
       * @private
       */
      constructor(config) {
        const accurate = config.conversionAccuracy === "longterm" || false;
        let matrix = accurate ? accurateMatrix : casualMatrix;
        if (config.matrix) {
          matrix = config.matrix;
        }
        this.values = config.values;
        this.loc = config.loc || Locale.create();
        this.conversionAccuracy = accurate ? "longterm" : "casual";
        this.invalid = config.invalid || null;
        this.matrix = matrix;
        this.isLuxonDuration = true;
      }
      /**
       * Create Duration from a number of milliseconds.
       * @param {number} count of milliseconds
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @return {Duration}
       */
      static fromMillis(count, opts) {
        return _Duration.fromObject({
          milliseconds: count
        }, opts);
      }
      /**
       * Create a Duration from a JavaScript object with keys like 'years' and 'hours'.
       * If this object is empty then a zero milliseconds duration is returned.
       * @param {Object} obj - the object to create the DateTime from
       * @param {number} obj.years
       * @param {number} obj.quarters
       * @param {number} obj.months
       * @param {number} obj.weeks
       * @param {number} obj.days
       * @param {number} obj.hours
       * @param {number} obj.minutes
       * @param {number} obj.seconds
       * @param {number} obj.milliseconds
       * @param {Object} [opts=[]] - options for creating this Duration
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
       * @param {string} [opts.matrix=Object] - the custom conversion system to use
       * @return {Duration}
       */
      static fromObject(obj, opts = {}) {
        if (obj == null || typeof obj !== "object") {
          throw new InvalidArgumentError(`Duration.fromObject: argument expected to be an object, got ${obj === null ? "null" : typeof obj}`);
        }
        return new _Duration({
          values: normalizeObject(obj, _Duration.normalizeUnit),
          loc: Locale.fromObject(opts),
          conversionAccuracy: opts.conversionAccuracy,
          matrix: opts.matrix
        });
      }
      /**
       * Create a Duration from DurationLike.
       *
       * @param {Object | number | Duration} durationLike
       * One of:
       * - object with keys like 'years' and 'hours'.
       * - number representing milliseconds
       * - Duration instance
       * @return {Duration}
       */
      static fromDurationLike(durationLike) {
        if (isNumber(durationLike)) {
          return _Duration.fromMillis(durationLike);
        } else if (_Duration.isDuration(durationLike)) {
          return durationLike;
        } else if (typeof durationLike === "object") {
          return _Duration.fromObject(durationLike);
        } else {
          throw new InvalidArgumentError(`Unknown duration argument ${durationLike} of type ${typeof durationLike}`);
        }
      }
      /**
       * Create a Duration from an ISO 8601 duration string.
       * @param {string} text - text to parse
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
       * @param {string} [opts.matrix=Object] - the preset conversion system to use
       * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
       * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
       * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
       * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
       * @return {Duration}
       */
      static fromISO(text, opts) {
        const [parsed] = parseISODuration(text);
        if (parsed) {
          return _Duration.fromObject(parsed, opts);
        } else {
          return _Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
        }
      }
      /**
       * Create a Duration from an ISO 8601 time string.
       * @param {string} text - text to parse
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
       * @param {string} [opts.matrix=Object] - the conversion system to use
       * @see https://en.wikipedia.org/wiki/ISO_8601#Times
       * @example Duration.fromISOTime('11:22:33.444').toObject() //=> { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
       * @example Duration.fromISOTime('11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('T11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('T1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @return {Duration}
       */
      static fromISOTime(text, opts) {
        const [parsed] = parseISOTimeOnly(text);
        if (parsed) {
          return _Duration.fromObject(parsed, opts);
        } else {
          return _Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
        }
      }
      /**
       * Create an invalid Duration.
       * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {Duration}
       */
      static invalid(reason, explanation = null) {
        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
        }
        const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
        if (Settings.throwOnInvalid) {
          throw new InvalidDurationError(invalid);
        } else {
          return new _Duration({
            invalid
          });
        }
      }
      /**
       * @private
       */
      static normalizeUnit(unit) {
        const normalized = {
          year: "years",
          years: "years",
          quarter: "quarters",
          quarters: "quarters",
          month: "months",
          months: "months",
          week: "weeks",
          weeks: "weeks",
          day: "days",
          days: "days",
          hour: "hours",
          hours: "hours",
          minute: "minutes",
          minutes: "minutes",
          second: "seconds",
          seconds: "seconds",
          millisecond: "milliseconds",
          milliseconds: "milliseconds"
        }[unit ? unit.toLowerCase() : unit];
        if (!normalized) throw new InvalidUnitError(unit);
        return normalized;
      }
      /**
       * Check if an object is a Duration. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      static isDuration(o) {
        return o && o.isLuxonDuration || false;
      }
      /**
       * Get  the locale of a Duration, such 'en-GB'
       * @type {string}
       */
      get locale() {
        return this.isValid ? this.loc.locale : null;
      }
      /**
       * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
       *
       * @type {string}
       */
      get numberingSystem() {
        return this.isValid ? this.loc.numberingSystem : null;
      }
      /**
       * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
       * * `S` for milliseconds
       * * `s` for seconds
       * * `m` for minutes
       * * `h` for hours
       * * `d` for days
       * * `w` for weeks
       * * `M` for months
       * * `y` for years
       * Notes:
       * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
       * * Tokens can be escaped by wrapping with single quotes.
       * * The duration will be converted to the set of units in the format string using {@link Duration#shiftTo} and the Durations's conversion accuracy setting.
       * @param {string} fmt - the format string
       * @param {Object} opts - options
       * @param {boolean} [opts.floor=true] - floor numerical values
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
       * @return {string}
       */
      toFormat(fmt, opts = {}) {
        const fmtOpts = {
          ...opts,
          floor: opts.round !== false && opts.floor !== false
        };
        return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID$2;
      }
      /**
       * Returns a string representation of a Duration with all units included.
       * To modify its behavior, use `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
       * @param {Object} opts - Formatting options. Accepts the same keys as the options parameter of the native `Intl.NumberFormat` constructor, as well as `listStyle`.
       * @param {string} [opts.listStyle='narrow'] - How to format the merged list. Corresponds to the `style` property of the options parameter of the native `Intl.ListFormat` constructor.
       * @example
       * ```js
       * var dur = Duration.fromObject({ days: 1, hours: 5, minutes: 6 })
       * dur.toHuman() //=> '1 day, 5 hours, 6 minutes'
       * dur.toHuman({ listStyle: "long" }) //=> '1 day, 5 hours, and 6 minutes'
       * dur.toHuman({ unitDisplay: "short" }) //=> '1 day, 5 hr, 6 min'
       * ```
       */
      toHuman(opts = {}) {
        if (!this.isValid) return INVALID$2;
        const l2 = orderedUnits$1.map((unit) => {
          const val = this.values[unit];
          if (isUndefined(val)) {
            return null;
          }
          return this.loc.numberFormatter({
            style: "unit",
            unitDisplay: "long",
            ...opts,
            unit: unit.slice(0, -1)
          }).format(val);
        }).filter((n2) => n2);
        return this.loc.listFormatter({
          type: "conjunction",
          style: opts.listStyle || "narrow",
          ...opts
        }).format(l2);
      }
      /**
       * Returns a JavaScript object with this Duration's values.
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
       * @return {Object}
       */
      toObject() {
        if (!this.isValid) return {};
        return {
          ...this.values
        };
      }
      /**
       * Returns an ISO 8601-compliant string representation of this Duration.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
       * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
       * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
       * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
       * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
       * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
       * @return {string}
       */
      toISO() {
        if (!this.isValid) return null;
        let s2 = "P";
        if (this.years !== 0) s2 += this.years + "Y";
        if (this.months !== 0 || this.quarters !== 0) s2 += this.months + this.quarters * 3 + "M";
        if (this.weeks !== 0) s2 += this.weeks + "W";
        if (this.days !== 0) s2 += this.days + "D";
        if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) s2 += "T";
        if (this.hours !== 0) s2 += this.hours + "H";
        if (this.minutes !== 0) s2 += this.minutes + "M";
        if (this.seconds !== 0 || this.milliseconds !== 0)
          s2 += roundTo(this.seconds + this.milliseconds / 1e3, 3) + "S";
        if (s2 === "P") s2 += "T0S";
        return s2;
      }
      /**
       * Returns an ISO 8601-compliant string representation of this Duration, formatted as a time of day.
       * Note that this will return null if the duration is invalid, negative, or equal to or greater than 24 hours.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Times
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example Duration.fromObject({ hours: 11 }).toISOTime() //=> '11:00:00.000'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true }) //=> '11:00:00'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressSeconds: true }) //=> '11:00'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ includePrefix: true }) //=> 'T11:00:00.000'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ format: 'basic' }) //=> '110000.000'
       * @return {string}
       */
      toISOTime(opts = {}) {
        if (!this.isValid) return null;
        const millis = this.toMillis();
        if (millis < 0 || millis >= 864e5) return null;
        opts = {
          suppressMilliseconds: false,
          suppressSeconds: false,
          includePrefix: false,
          format: "extended",
          ...opts,
          includeOffset: false
        };
        const dateTime = DateTime2.fromMillis(millis, {
          zone: "UTC"
        });
        return dateTime.toISOTime(opts);
      }
      /**
       * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
       * @return {string}
       */
      toJSON() {
        return this.toISO();
      }
      /**
       * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
       * @return {string}
       */
      toString() {
        return this.toISO();
      }
      /**
       * Returns a string representation of this Duration appropriate for the REPL.
       * @return {string}
       */
      [Symbol.for("nodejs.util.inspect.custom")]() {
        if (this.isValid) {
          return `Duration { values: ${JSON.stringify(this.values)} }`;
        } else {
          return `Duration { Invalid, reason: ${this.invalidReason} }`;
        }
      }
      /**
       * Returns an milliseconds value of this Duration.
       * @return {number}
       */
      toMillis() {
        if (!this.isValid) return NaN;
        return durationToMillis(this.matrix, this.values);
      }
      /**
       * Returns an milliseconds value of this Duration. Alias of {@link toMillis}
       * @return {number}
       */
      valueOf() {
        return this.toMillis();
      }
      /**
       * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
       * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @return {Duration}
       */
      plus(duration) {
        if (!this.isValid) return this;
        const dur = _Duration.fromDurationLike(duration), result = {};
        for (const k of orderedUnits$1) {
          if (hasOwnProperty(dur.values, k) || hasOwnProperty(this.values, k)) {
            result[k] = dur.get(k) + this.get(k);
          }
        }
        return clone$1(this, {
          values: result
        }, true);
      }
      /**
       * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
       * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @return {Duration}
       */
      minus(duration) {
        if (!this.isValid) return this;
        const dur = _Duration.fromDurationLike(duration);
        return this.plus(dur.negate());
      }
      /**
       * Scale this Duration by the specified amount. Return a newly-constructed Duration.
       * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
       * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
       * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
       * @return {Duration}
       */
      mapUnits(fn) {
        if (!this.isValid) return this;
        const result = {};
        for (const k of Object.keys(this.values)) {
          result[k] = asNumber(fn(this.values[k], k));
        }
        return clone$1(this, {
          values: result
        }, true);
      }
      /**
       * Get the value of unit.
       * @param {string} unit - a unit such as 'minute' or 'day'
       * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
       * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
       * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
       * @return {number}
       */
      get(unit) {
        return this[_Duration.normalizeUnit(unit)];
      }
      /**
       * "Set" the values of specified units. Return a newly-constructed Duration.
       * @param {Object} values - a mapping of units to numbers
       * @example dur.set({ years: 2017 })
       * @example dur.set({ hours: 8, minutes: 30 })
       * @return {Duration}
       */
      set(values) {
        if (!this.isValid) return this;
        const mixed = {
          ...this.values,
          ...normalizeObject(values, _Duration.normalizeUnit)
        };
        return clone$1(this, {
          values: mixed
        });
      }
      /**
       * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
       * @example dur.reconfigure({ locale: 'en-GB' })
       * @return {Duration}
       */
      reconfigure({
        locale,
        numberingSystem,
        conversionAccuracy,
        matrix
      } = {}) {
        const loc = this.loc.clone({
          locale,
          numberingSystem
        });
        const opts = {
          loc,
          matrix,
          conversionAccuracy
        };
        return clone$1(this, opts);
      }
      /**
       * Return the length of the duration in the specified unit.
       * @param {string} unit - a unit such as 'minutes' or 'days'
       * @example Duration.fromObject({years: 1}).as('days') //=> 365
       * @example Duration.fromObject({years: 1}).as('months') //=> 12
       * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
       * @return {number}
       */
      as(unit) {
        return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
      }
      /**
       * Reduce this Duration to its canonical representation in its current units.
       * Assuming the overall value of the Duration is positive, this means:
       * - excessive values for lower-order units are converted to higher-order units (if possible, see first and second example)
       * - negative lower-order units are converted to higher order units (there must be such a higher order unit, otherwise
       *   the overall value would be negative, see third example)
       * - fractional values for higher-order units are converted to lower-order units (if possible, see fourth example)
       *
       * If the overall value is negative, the result of this method is equivalent to `this.negate().normalize().negate()`.
       * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
       * @example Duration.fromObject({ days: 5000 }).normalize().toObject() //=> { days: 5000 }
       * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
       * @example Duration.fromObject({ years: 2.5, days: 0, hours: 0 }).normalize().toObject() //=> { years: 2, days: 182, hours: 12 }
       * @return {Duration}
       */
      normalize() {
        if (!this.isValid) return this;
        const vals = this.toObject();
        normalizeValues(this.matrix, vals);
        return clone$1(this, {
          values: vals
        }, true);
      }
      /**
       * Rescale units to its largest representation
       * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
       * @return {Duration}
       */
      rescale() {
        if (!this.isValid) return this;
        const vals = removeZeroes(this.normalize().shiftToAll().toObject());
        return clone$1(this, {
          values: vals
        }, true);
      }
      /**
       * Convert this Duration into its representation in a different set of units.
       * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
       * @return {Duration}
       */
      shiftTo(...units) {
        if (!this.isValid) return this;
        if (units.length === 0) {
          return this;
        }
        units = units.map((u) => _Duration.normalizeUnit(u));
        const built = {}, accumulated = {}, vals = this.toObject();
        let lastUnit;
        for (const k of orderedUnits$1) {
          if (units.indexOf(k) >= 0) {
            lastUnit = k;
            let own = 0;
            for (const ak in accumulated) {
              own += this.matrix[ak][k] * accumulated[ak];
              accumulated[ak] = 0;
            }
            if (isNumber(vals[k])) {
              own += vals[k];
            }
            const i = Math.trunc(own);
            built[k] = i;
            accumulated[k] = (own * 1e3 - i * 1e3) / 1e3;
          } else if (isNumber(vals[k])) {
            accumulated[k] = vals[k];
          }
        }
        for (const key in accumulated) {
          if (accumulated[key] !== 0) {
            built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
          }
        }
        normalizeValues(this.matrix, built);
        return clone$1(this, {
          values: built
        }, true);
      }
      /**
       * Shift this Duration to all available units.
       * Same as shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
       * @return {Duration}
       */
      shiftToAll() {
        if (!this.isValid) return this;
        return this.shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds");
      }
      /**
       * Return the negative of this Duration.
       * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
       * @return {Duration}
       */
      negate() {
        if (!this.isValid) return this;
        const negated = {};
        for (const k of Object.keys(this.values)) {
          negated[k] = this.values[k] === 0 ? 0 : -this.values[k];
        }
        return clone$1(this, {
          values: negated
        }, true);
      }
      /**
       * Get the years.
       * @type {number}
       */
      get years() {
        return this.isValid ? this.values.years || 0 : NaN;
      }
      /**
       * Get the quarters.
       * @type {number}
       */
      get quarters() {
        return this.isValid ? this.values.quarters || 0 : NaN;
      }
      /**
       * Get the months.
       * @type {number}
       */
      get months() {
        return this.isValid ? this.values.months || 0 : NaN;
      }
      /**
       * Get the weeks
       * @type {number}
       */
      get weeks() {
        return this.isValid ? this.values.weeks || 0 : NaN;
      }
      /**
       * Get the days.
       * @type {number}
       */
      get days() {
        return this.isValid ? this.values.days || 0 : NaN;
      }
      /**
       * Get the hours.
       * @type {number}
       */
      get hours() {
        return this.isValid ? this.values.hours || 0 : NaN;
      }
      /**
       * Get the minutes.
       * @type {number}
       */
      get minutes() {
        return this.isValid ? this.values.minutes || 0 : NaN;
      }
      /**
       * Get the seconds.
       * @return {number}
       */
      get seconds() {
        return this.isValid ? this.values.seconds || 0 : NaN;
      }
      /**
       * Get the milliseconds.
       * @return {number}
       */
      get milliseconds() {
        return this.isValid ? this.values.milliseconds || 0 : NaN;
      }
      /**
       * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
       * on invalid DateTimes or Intervals.
       * @return {boolean}
       */
      get isValid() {
        return this.invalid === null;
      }
      /**
       * Returns an error code if this Duration became invalid, or null if the Duration is valid
       * @return {string}
       */
      get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
      }
      /**
       * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
       * @type {string}
       */
      get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
      }
      /**
       * Equality check
       * Two Durations are equal iff they have the same units and the same values for each unit.
       * @param {Duration} other
       * @return {boolean}
       */
      equals(other) {
        if (!this.isValid || !other.isValid) {
          return false;
        }
        if (!this.loc.equals(other.loc)) {
          return false;
        }
        function eq(v1, v2) {
          if (v1 === void 0 || v1 === 0) return v2 === void 0 || v2 === 0;
          return v1 === v2;
        }
        for (const u of orderedUnits$1) {
          if (!eq(this.values[u], other.values[u])) {
            return false;
          }
        }
        return true;
      }
    };
    var INVALID$1 = "Invalid Interval";
    function validateStartEnd(start, end) {
      if (!start || !start.isValid) {
        return Interval.invalid("missing or invalid start");
      } else if (!end || !end.isValid) {
        return Interval.invalid("missing or invalid end");
      } else if (end < start) {
        return Interval.invalid("end before start", `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`);
      } else {
        return null;
      }
    }
    var Interval = class _Interval {
      /**
       * @private
       */
      constructor(config) {
        this.s = config.start;
        this.e = config.end;
        this.invalid = config.invalid || null;
        this.isLuxonInterval = true;
      }
      /**
       * Create an invalid Interval.
       * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {Interval}
       */
      static invalid(reason, explanation = null) {
        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
        }
        const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
        if (Settings.throwOnInvalid) {
          throw new InvalidIntervalError(invalid);
        } else {
          return new _Interval({
            invalid
          });
        }
      }
      /**
       * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
       * @param {DateTime|Date|Object} start
       * @param {DateTime|Date|Object} end
       * @return {Interval}
       */
      static fromDateTimes(start, end) {
        const builtStart = friendlyDateTime(start), builtEnd = friendlyDateTime(end);
        const validateError = validateStartEnd(builtStart, builtEnd);
        if (validateError == null) {
          return new _Interval({
            start: builtStart,
            end: builtEnd
          });
        } else {
          return validateError;
        }
      }
      /**
       * Create an Interval from a start DateTime and a Duration to extend to.
       * @param {DateTime|Date|Object} start
       * @param {Duration|Object|number} duration - the length of the Interval.
       * @return {Interval}
       */
      static after(start, duration) {
        const dur = Duration2.fromDurationLike(duration), dt = friendlyDateTime(start);
        return _Interval.fromDateTimes(dt, dt.plus(dur));
      }
      /**
       * Create an Interval from an end DateTime and a Duration to extend backwards to.
       * @param {DateTime|Date|Object} end
       * @param {Duration|Object|number} duration - the length of the Interval.
       * @return {Interval}
       */
      static before(end, duration) {
        const dur = Duration2.fromDurationLike(duration), dt = friendlyDateTime(end);
        return _Interval.fromDateTimes(dt.minus(dur), dt);
      }
      /**
       * Create an Interval from an ISO 8601 string.
       * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
       * @param {string} text - the ISO string to parse
       * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @return {Interval}
       */
      static fromISO(text, opts) {
        const [s2, e] = (text || "").split("/", 2);
        if (s2 && e) {
          let start, startIsValid;
          try {
            start = DateTime2.fromISO(s2, opts);
            startIsValid = start.isValid;
          } catch (e2) {
            startIsValid = false;
          }
          let end, endIsValid;
          try {
            end = DateTime2.fromISO(e, opts);
            endIsValid = end.isValid;
          } catch (e2) {
            endIsValid = false;
          }
          if (startIsValid && endIsValid) {
            return _Interval.fromDateTimes(start, end);
          }
          if (startIsValid) {
            const dur = Duration2.fromISO(e, opts);
            if (dur.isValid) {
              return _Interval.after(start, dur);
            }
          } else if (endIsValid) {
            const dur = Duration2.fromISO(s2, opts);
            if (dur.isValid) {
              return _Interval.before(end, dur);
            }
          }
        }
        return _Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
      }
      /**
       * Check if an object is an Interval. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      static isInterval(o) {
        return o && o.isLuxonInterval || false;
      }
      /**
       * Returns the start of the Interval
       * @type {DateTime}
       */
      get start() {
        return this.isValid ? this.s : null;
      }
      /**
       * Returns the end of the Interval
       * @type {DateTime}
       */
      get end() {
        return this.isValid ? this.e : null;
      }
      /**
       * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
       * @type {boolean}
       */
      get isValid() {
        return this.invalidReason === null;
      }
      /**
       * Returns an error code if this Interval is invalid, or null if the Interval is valid
       * @type {string}
       */
      get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
      }
      /**
       * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
       * @type {string}
       */
      get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
      }
      /**
       * Returns the length of the Interval in the specified unit.
       * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
       * @return {number}
       */
      length(unit = "milliseconds") {
        return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
      }
      /**
       * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
       * Unlike {@link Interval#length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
       * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
       * @param {string} [unit='milliseconds'] - the unit of time to count.
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; this operation will always use the locale of the start DateTime
       * @return {number}
       */
      count(unit = "milliseconds", opts) {
        if (!this.isValid) return NaN;
        const start = this.start.startOf(unit, opts);
        let end;
        if (opts != null && opts.useLocaleWeeks) {
          end = this.end.reconfigure({
            locale: start.locale
          });
        } else {
          end = this.end;
        }
        end = end.startOf(unit, opts);
        return Math.floor(end.diff(start, unit).get(unit)) + (end.valueOf() !== this.end.valueOf());
      }
      /**
       * Returns whether this Interval's start and end are both in the same unit of time
       * @param {string} unit - the unit of time to check sameness on
       * @return {boolean}
       */
      hasSame(unit) {
        return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
      }
      /**
       * Return whether this Interval has the same start and end DateTimes.
       * @return {boolean}
       */
      isEmpty() {
        return this.s.valueOf() === this.e.valueOf();
      }
      /**
       * Return whether this Interval's start is after the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      isAfter(dateTime) {
        if (!this.isValid) return false;
        return this.s > dateTime;
      }
      /**
       * Return whether this Interval's end is before the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      isBefore(dateTime) {
        if (!this.isValid) return false;
        return this.e <= dateTime;
      }
      /**
       * Return whether this Interval contains the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      contains(dateTime) {
        if (!this.isValid) return false;
        return this.s <= dateTime && this.e > dateTime;
      }
      /**
       * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
       * @param {Object} values - the values to set
       * @param {DateTime} values.start - the starting DateTime
       * @param {DateTime} values.end - the ending DateTime
       * @return {Interval}
       */
      set({
        start,
        end
      } = {}) {
        if (!this.isValid) return this;
        return _Interval.fromDateTimes(start || this.s, end || this.e);
      }
      /**
       * Split this Interval at each of the specified DateTimes
       * @param {...DateTime} dateTimes - the unit of time to count.
       * @return {Array}
       */
      splitAt(...dateTimes) {
        if (!this.isValid) return [];
        const sorted = dateTimes.map(friendlyDateTime).filter((d) => this.contains(d)).sort((a, b) => a.toMillis() - b.toMillis()), results = [];
        let {
          s: s2
        } = this, i = 0;
        while (s2 < this.e) {
          const added = sorted[i] || this.e, next = +added > +this.e ? this.e : added;
          results.push(_Interval.fromDateTimes(s2, next));
          s2 = next;
          i += 1;
        }
        return results;
      }
      /**
       * Split this Interval into smaller Intervals, each of the specified length.
       * Left over time is grouped into a smaller interval
       * @param {Duration|Object|number} duration - The length of each resulting interval.
       * @return {Array}
       */
      splitBy(duration) {
        const dur = Duration2.fromDurationLike(duration);
        if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
          return [];
        }
        let {
          s: s2
        } = this, idx = 1, next;
        const results = [];
        while (s2 < this.e) {
          const added = this.start.plus(dur.mapUnits((x) => x * idx));
          next = +added > +this.e ? this.e : added;
          results.push(_Interval.fromDateTimes(s2, next));
          s2 = next;
          idx += 1;
        }
        return results;
      }
      /**
       * Split this Interval into the specified number of smaller intervals.
       * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
       * @return {Array}
       */
      divideEqually(numberOfParts) {
        if (!this.isValid) return [];
        return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
      }
      /**
       * Return whether this Interval overlaps with the specified Interval
       * @param {Interval} other
       * @return {boolean}
       */
      overlaps(other) {
        return this.e > other.s && this.s < other.e;
      }
      /**
       * Return whether this Interval's end is adjacent to the specified Interval's start.
       * @param {Interval} other
       * @return {boolean}
       */
      abutsStart(other) {
        if (!this.isValid) return false;
        return +this.e === +other.s;
      }
      /**
       * Return whether this Interval's start is adjacent to the specified Interval's end.
       * @param {Interval} other
       * @return {boolean}
       */
      abutsEnd(other) {
        if (!this.isValid) return false;
        return +other.e === +this.s;
      }
      /**
       * Returns true if this Interval fully contains the specified Interval, specifically if the intersect (of this Interval and the other Interval) is equal to the other Interval; false otherwise.
       * @param {Interval} other
       * @return {boolean}
       */
      engulfs(other) {
        if (!this.isValid) return false;
        return this.s <= other.s && this.e >= other.e;
      }
      /**
       * Return whether this Interval has the same start and end as the specified Interval.
       * @param {Interval} other
       * @return {boolean}
       */
      equals(other) {
        if (!this.isValid || !other.isValid) {
          return false;
        }
        return this.s.equals(other.s) && this.e.equals(other.e);
      }
      /**
       * Return an Interval representing the intersection of this Interval and the specified Interval.
       * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
       * Returns null if the intersection is empty, meaning, the intervals don't intersect.
       * @param {Interval} other
       * @return {Interval}
       */
      intersection(other) {
        if (!this.isValid) return this;
        const s2 = this.s > other.s ? this.s : other.s, e = this.e < other.e ? this.e : other.e;
        if (s2 >= e) {
          return null;
        } else {
          return _Interval.fromDateTimes(s2, e);
        }
      }
      /**
       * Return an Interval representing the union of this Interval and the specified Interval.
       * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
       * @param {Interval} other
       * @return {Interval}
       */
      union(other) {
        if (!this.isValid) return this;
        const s2 = this.s < other.s ? this.s : other.s, e = this.e > other.e ? this.e : other.e;
        return _Interval.fromDateTimes(s2, e);
      }
      /**
       * Merge an array of Intervals into a equivalent minimal set of Intervals.
       * Combines overlapping and adjacent Intervals.
       * @param {Array} intervals
       * @return {Array}
       */
      static merge(intervals) {
        const [found, final] = intervals.sort((a, b) => a.s - b.s).reduce(([sofar, current], item) => {
          if (!current) {
            return [sofar, item];
          } else if (current.overlaps(item) || current.abutsStart(item)) {
            return [sofar, current.union(item)];
          } else {
            return [sofar.concat([current]), item];
          }
        }, [[], null]);
        if (final) {
          found.push(final);
        }
        return found;
      }
      /**
       * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
       * @param {Array} intervals
       * @return {Array}
       */
      static xor(intervals) {
        let start = null, currentCount = 0;
        const results = [], ends = intervals.map((i) => [{
          time: i.s,
          type: "s"
        }, {
          time: i.e,
          type: "e"
        }]), flattened = Array.prototype.concat(...ends), arr = flattened.sort((a, b) => a.time - b.time);
        for (const i of arr) {
          currentCount += i.type === "s" ? 1 : -1;
          if (currentCount === 1) {
            start = i.time;
          } else {
            if (start && +start !== +i.time) {
              results.push(_Interval.fromDateTimes(start, i.time));
            }
            start = null;
          }
        }
        return _Interval.merge(results);
      }
      /**
       * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
       * @param {...Interval} intervals
       * @return {Array}
       */
      difference(...intervals) {
        return _Interval.xor([this].concat(intervals)).map((i) => this.intersection(i)).filter((i) => i && !i.isEmpty());
      }
      /**
       * Returns a string representation of this Interval appropriate for debugging.
       * @return {string}
       */
      toString() {
        if (!this.isValid) return INVALID$1;
        return `[${this.s.toISO()} \u2013 ${this.e.toISO()})`;
      }
      /**
       * Returns a string representation of this Interval appropriate for the REPL.
       * @return {string}
       */
      [Symbol.for("nodejs.util.inspect.custom")]() {
        if (this.isValid) {
          return `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`;
        } else {
          return `Interval { Invalid, reason: ${this.invalidReason} }`;
        }
      }
      /**
       * Returns a localized string representing this Interval. Accepts the same options as the
       * Intl.DateTimeFormat constructor and any presets defined by Luxon, such as
       * {@link DateTime.DATE_FULL} or {@link DateTime.TIME_SIMPLE}. The exact behavior of this method
       * is browser-specific, but in general it will return an appropriate representation of the
       * Interval in the assigned locale. Defaults to the system's locale if no locale has been
       * specified.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {Object} [formatOpts=DateTime.DATE_SHORT] - Either a DateTime preset or
       * Intl.DateTimeFormat constructor options.
       * @param {Object} opts - Options to override the configuration of the start DateTime.
       * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(); //=> 11/7/2022 – 11/8/2022
       * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL); //=> November 7 – 8, 2022
       * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL, { locale: 'fr-FR' }); //=> 7–8 novembre 2022
       * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString(DateTime.TIME_SIMPLE); //=> 6:00 – 8:00 PM
       * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> Mon, Nov 07, 6:00 – 8:00 p
       * @return {string}
       */
      toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
        return this.isValid ? Formatter.create(this.s.loc.clone(opts), formatOpts).formatInterval(this) : INVALID$1;
      }
      /**
       * Returns an ISO 8601-compliant string representation of this Interval.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @param {Object} opts - The same options as {@link DateTime#toISO}
       * @return {string}
       */
      toISO(opts) {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
      }
      /**
       * Returns an ISO 8601-compliant string representation of date of this Interval.
       * The time components are ignored.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @return {string}
       */
      toISODate() {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toISODate()}/${this.e.toISODate()}`;
      }
      /**
       * Returns an ISO 8601-compliant string representation of time of this Interval.
       * The date components are ignored.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @param {Object} opts - The same options as {@link DateTime#toISO}
       * @return {string}
       */
      toISOTime(opts) {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
      }
      /**
       * Returns a string representation of this Interval formatted according to the specified format
       * string. **You may not want this.** See {@link Interval#toLocaleString} for a more flexible
       * formatting tool.
       * @param {string} dateFormat - The format string. This string formats the start and end time.
       * See {@link DateTime#toFormat} for details.
       * @param {Object} opts - Options.
       * @param {string} [opts.separator =  ' – '] - A separator to place between the start and end
       * representations.
       * @return {string}
       */
      toFormat(dateFormat, {
        separator = " \u2013 "
      } = {}) {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
      }
      /**
       * Return a Duration representing the time spanned by this interval.
       * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
       * @return {Duration}
       */
      toDuration(unit, opts) {
        if (!this.isValid) {
          return Duration2.invalid(this.invalidReason);
        }
        return this.e.diff(this.s, unit, opts);
      }
      /**
       * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
       * @param {function} mapFn
       * @return {Interval}
       * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
       * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
       */
      mapEndpoints(mapFn) {
        return _Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
      }
    };
    var Info = class {
      /**
       * Return whether the specified zone contains a DST.
       * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
       * @return {boolean}
       */
      static hasDST(zone = Settings.defaultZone) {
        const proto = DateTime2.now().setZone(zone).set({
          month: 12
        });
        return !zone.isUniversal && proto.offset !== proto.set({
          month: 6
        }).offset;
      }
      /**
       * Return whether the specified zone is a valid IANA specifier.
       * @param {string} zone - Zone to check
       * @return {boolean}
       */
      static isValidIANAZone(zone) {
        return IANAZone.isValidZone(zone);
      }
      /**
       * Converts the input into a {@link Zone} instance.
       *
       * * If `input` is already a Zone instance, it is returned unchanged.
       * * If `input` is a string containing a valid time zone name, a Zone instance
       *   with that name is returned.
       * * If `input` is a string that doesn't refer to a known time zone, a Zone
       *   instance with {@link Zone#isValid} == false is returned.
       * * If `input is a number, a Zone instance with the specified fixed offset
       *   in minutes is returned.
       * * If `input` is `null` or `undefined`, the default zone is returned.
       * @param {string|Zone|number} [input] - the value to be converted
       * @return {Zone}
       */
      static normalizeZone(input) {
        return normalizeZone(input, Settings.defaultZone);
      }
      /**
       * Get the weekday on which the week starts according to the given locale.
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
       */
      static getStartOfWeek({
        locale = null,
        locObj = null
      } = {}) {
        return (locObj || Locale.create(locale)).getStartOfWeek();
      }
      /**
       * Get the minimum number of days necessary in a week before it is considered part of the next year according
       * to the given locale.
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @returns {number}
       */
      static getMinimumDaysInFirstWeek({
        locale = null,
        locObj = null
      } = {}) {
        return (locObj || Locale.create(locale)).getMinDaysInFirstWeek();
      }
      /**
       * Get the weekdays, which are considered the weekend according to the given locale
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
       */
      static getWeekendWeekdays({
        locale = null,
        locObj = null
      } = {}) {
        return (locObj || Locale.create(locale)).getWeekendDays().slice();
      }
      /**
       * Return an array of standalone month names.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @param {string} [opts.outputCalendar='gregory'] - the calendar
       * @example Info.months()[0] //=> 'January'
       * @example Info.months('short')[0] //=> 'Jan'
       * @example Info.months('numeric')[0] //=> '1'
       * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
       * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
       * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
       * @return {Array}
       */
      static months(length = "long", {
        locale = null,
        numberingSystem = null,
        locObj = null,
        outputCalendar = "gregory"
      } = {}) {
        return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length);
      }
      /**
       * Return an array of format month names.
       * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
       * changes the string.
       * See {@link Info#months}
       * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @param {string} [opts.outputCalendar='gregory'] - the calendar
       * @return {Array}
       */
      static monthsFormat(length = "long", {
        locale = null,
        numberingSystem = null,
        locObj = null,
        outputCalendar = "gregory"
      } = {}) {
        return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length, true);
      }
      /**
       * Return an array of standalone week names.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {string} [length='long'] - the length of the weekday representation, such as "narrow", "short", "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @example Info.weekdays()[0] //=> 'Monday'
       * @example Info.weekdays('short')[0] //=> 'Mon'
       * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
       * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
       * @return {Array}
       */
      static weekdays(length = "long", {
        locale = null,
        numberingSystem = null,
        locObj = null
      } = {}) {
        return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length);
      }
      /**
       * Return an array of format week names.
       * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
       * changes the string.
       * See {@link Info#weekdays}
       * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale=null] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @return {Array}
       */
      static weekdaysFormat(length = "long", {
        locale = null,
        numberingSystem = null,
        locObj = null
      } = {}) {
        return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length, true);
      }
      /**
       * Return an array of meridiems.
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @example Info.meridiems() //=> [ 'AM', 'PM' ]
       * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
       * @return {Array}
       */
      static meridiems({
        locale = null
      } = {}) {
        return Locale.create(locale).meridiems();
      }
      /**
       * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
       * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @example Info.eras() //=> [ 'BC', 'AD' ]
       * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
       * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
       * @return {Array}
       */
      static eras(length = "short", {
        locale = null
      } = {}) {
        return Locale.create(locale, null, "gregory").eras(length);
      }
      /**
       * Return the set of available features in this environment.
       * Some features of Luxon are not available in all environments. For example, on older browsers, relative time formatting support is not available. Use this function to figure out if that's the case.
       * Keys:
       * * `relative`: whether this environment supports relative time formatting
       * * `localeWeek`: whether this environment supports different weekdays for the start of the week based on the locale
       * @example Info.features() //=> { relative: false, localeWeek: true }
       * @return {Object}
       */
      static features() {
        return {
          relative: hasRelative(),
          localeWeek: hasLocaleWeekInfo()
        };
      }
    };
    function dayDiff(earlier, later) {
      const utcDayStart = (dt) => dt.toUTC(0, {
        keepLocalTime: true
      }).startOf("day").valueOf(), ms = utcDayStart(later) - utcDayStart(earlier);
      return Math.floor(Duration2.fromMillis(ms).as("days"));
    }
    function highOrderDiffs(cursor, later, units) {
      const differs = [["years", (a, b) => b.year - a.year], ["quarters", (a, b) => b.quarter - a.quarter + (b.year - a.year) * 4], ["months", (a, b) => b.month - a.month + (b.year - a.year) * 12], ["weeks", (a, b) => {
        const days = dayDiff(a, b);
        return (days - days % 7) / 7;
      }], ["days", dayDiff]];
      const results = {};
      const earlier = cursor;
      let lowestOrder, highWater;
      for (const [unit, differ] of differs) {
        if (units.indexOf(unit) >= 0) {
          lowestOrder = unit;
          results[unit] = differ(cursor, later);
          highWater = earlier.plus(results);
          if (highWater > later) {
            results[unit]--;
            cursor = earlier.plus(results);
            if (cursor > later) {
              highWater = cursor;
              results[unit]--;
              cursor = earlier.plus(results);
            }
          } else {
            cursor = highWater;
          }
        }
      }
      return [cursor, results, highWater, lowestOrder];
    }
    function diff(earlier, later, units, opts) {
      let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);
      const remainingMillis = later - cursor;
      const lowerOrderUnits = units.filter((u) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u) >= 0);
      if (lowerOrderUnits.length === 0) {
        if (highWater < later) {
          highWater = cursor.plus({
            [lowestOrder]: 1
          });
        }
        if (highWater !== cursor) {
          results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
        }
      }
      const duration = Duration2.fromObject(results, opts);
      if (lowerOrderUnits.length > 0) {
        return Duration2.fromMillis(remainingMillis, opts).shiftTo(...lowerOrderUnits).plus(duration);
      } else {
        return duration;
      }
    }
    var MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";
    function intUnit(regex, post = (i) => i) {
      return {
        regex,
        deser: ([s2]) => post(parseDigits(s2))
      };
    }
    var NBSP = String.fromCharCode(160);
    var spaceOrNBSP = `[ ${NBSP}]`;
    var spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");
    function fixListRegex(s2) {
      return s2.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
    }
    function stripInsensitivities(s2) {
      return s2.replace(/\./g, "").replace(spaceOrNBSPRegExp, " ").toLowerCase();
    }
    function oneOf(strings, startIndex) {
      if (strings === null) {
        return null;
      } else {
        return {
          regex: RegExp(strings.map(fixListRegex).join("|")),
          deser: ([s2]) => strings.findIndex((i) => stripInsensitivities(s2) === stripInsensitivities(i)) + startIndex
        };
      }
    }
    function offset(regex, groups) {
      return {
        regex,
        deser: ([, h, m]) => signedOffset(h, m),
        groups
      };
    }
    function simple(regex) {
      return {
        regex,
        deser: ([s2]) => s2
      };
    }
    function escapeToken(value) {
      return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    function unitForToken(token, loc) {
      const one = digitRegex(loc), two = digitRegex(loc, "{2}"), three = digitRegex(loc, "{3}"), four = digitRegex(loc, "{4}"), six = digitRegex(loc, "{6}"), oneOrTwo = digitRegex(loc, "{1,2}"), oneToThree = digitRegex(loc, "{1,3}"), oneToSix = digitRegex(loc, "{1,6}"), oneToNine = digitRegex(loc, "{1,9}"), twoToFour = digitRegex(loc, "{2,4}"), fourToSix = digitRegex(loc, "{4,6}"), literal = (t) => ({
        regex: RegExp(escapeToken(t.val)),
        deser: ([s2]) => s2,
        literal: true
      }), unitate = (t) => {
        if (token.literal) {
          return literal(t);
        }
        switch (t.val) {
          case "G":
            return oneOf(loc.eras("short"), 0);
          case "GG":
            return oneOf(loc.eras("long"), 0);
          case "y":
            return intUnit(oneToSix);
          case "yy":
            return intUnit(twoToFour, untruncateYear);
          case "yyyy":
            return intUnit(four);
          case "yyyyy":
            return intUnit(fourToSix);
          case "yyyyyy":
            return intUnit(six);
          case "M":
            return intUnit(oneOrTwo);
          case "MM":
            return intUnit(two);
          case "MMM":
            return oneOf(loc.months("short", true), 1);
          case "MMMM":
            return oneOf(loc.months("long", true), 1);
          case "L":
            return intUnit(oneOrTwo);
          case "LL":
            return intUnit(two);
          case "LLL":
            return oneOf(loc.months("short", false), 1);
          case "LLLL":
            return oneOf(loc.months("long", false), 1);
          case "d":
            return intUnit(oneOrTwo);
          case "dd":
            return intUnit(two);
          case "o":
            return intUnit(oneToThree);
          case "ooo":
            return intUnit(three);
          case "HH":
            return intUnit(two);
          case "H":
            return intUnit(oneOrTwo);
          case "hh":
            return intUnit(two);
          case "h":
            return intUnit(oneOrTwo);
          case "mm":
            return intUnit(two);
          case "m":
            return intUnit(oneOrTwo);
          case "q":
            return intUnit(oneOrTwo);
          case "qq":
            return intUnit(two);
          case "s":
            return intUnit(oneOrTwo);
          case "ss":
            return intUnit(two);
          case "S":
            return intUnit(oneToThree);
          case "SSS":
            return intUnit(three);
          case "u":
            return simple(oneToNine);
          case "uu":
            return simple(oneOrTwo);
          case "uuu":
            return intUnit(one);
          case "a":
            return oneOf(loc.meridiems(), 0);
          case "kkkk":
            return intUnit(four);
          case "kk":
            return intUnit(twoToFour, untruncateYear);
          case "W":
            return intUnit(oneOrTwo);
          case "WW":
            return intUnit(two);
          case "E":
          case "c":
            return intUnit(one);
          case "EEE":
            return oneOf(loc.weekdays("short", false), 1);
          case "EEEE":
            return oneOf(loc.weekdays("long", false), 1);
          case "ccc":
            return oneOf(loc.weekdays("short", true), 1);
          case "cccc":
            return oneOf(loc.weekdays("long", true), 1);
          case "Z":
          case "ZZ":
            return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
          case "ZZZ":
            return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
          case "z":
            return simple(/[a-z_+-/]{1,256}?/i);
          case " ":
            return simple(/[^\S\n\r]/);
          default:
            return literal(t);
        }
      };
      const unit = unitate(token) || {
        invalidReason: MISSING_FTP
      };
      unit.token = token;
      return unit;
    }
    var partTypeStyleToTokenVal = {
      year: {
        "2-digit": "yy",
        numeric: "yyyyy"
      },
      month: {
        numeric: "M",
        "2-digit": "MM",
        short: "MMM",
        long: "MMMM"
      },
      day: {
        numeric: "d",
        "2-digit": "dd"
      },
      weekday: {
        short: "EEE",
        long: "EEEE"
      },
      dayperiod: "a",
      dayPeriod: "a",
      hour12: {
        numeric: "h",
        "2-digit": "hh"
      },
      hour24: {
        numeric: "H",
        "2-digit": "HH"
      },
      minute: {
        numeric: "m",
        "2-digit": "mm"
      },
      second: {
        numeric: "s",
        "2-digit": "ss"
      },
      timeZoneName: {
        long: "ZZZZZ",
        short: "ZZZ"
      }
    };
    function tokenForPart(part, formatOpts, resolvedOpts) {
      const {
        type,
        value
      } = part;
      if (type === "literal") {
        const isSpace = /^\s+$/.test(value);
        return {
          literal: !isSpace,
          val: isSpace ? " " : value
        };
      }
      const style = formatOpts[type];
      let actualType = type;
      if (type === "hour") {
        if (formatOpts.hour12 != null) {
          actualType = formatOpts.hour12 ? "hour12" : "hour24";
        } else if (formatOpts.hourCycle != null) {
          if (formatOpts.hourCycle === "h11" || formatOpts.hourCycle === "h12") {
            actualType = "hour12";
          } else {
            actualType = "hour24";
          }
        } else {
          actualType = resolvedOpts.hour12 ? "hour12" : "hour24";
        }
      }
      let val = partTypeStyleToTokenVal[actualType];
      if (typeof val === "object") {
        val = val[style];
      }
      if (val) {
        return {
          literal: false,
          val
        };
      }
      return void 0;
    }
    function buildRegex(units) {
      const re = units.map((u) => u.regex).reduce((f, r) => `${f}(${r.source})`, "");
      return [`^${re}$`, units];
    }
    function match(input, regex, handlers2) {
      const matches = input.match(regex);
      if (matches) {
        const all = {};
        let matchIndex = 1;
        for (const i in handlers2) {
          if (hasOwnProperty(handlers2, i)) {
            const h = handlers2[i], groups = h.groups ? h.groups + 1 : 1;
            if (!h.literal && h.token) {
              all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
            }
            matchIndex += groups;
          }
        }
        return [matches, all];
      } else {
        return [matches, {}];
      }
    }
    function dateTimeFromMatches(matches) {
      const toField = (token) => {
        switch (token) {
          case "S":
            return "millisecond";
          case "s":
            return "second";
          case "m":
            return "minute";
          case "h":
          case "H":
            return "hour";
          case "d":
            return "day";
          case "o":
            return "ordinal";
          case "L":
          case "M":
            return "month";
          case "y":
            return "year";
          case "E":
          case "c":
            return "weekday";
          case "W":
            return "weekNumber";
          case "k":
            return "weekYear";
          case "q":
            return "quarter";
          default:
            return null;
        }
      };
      let zone = null;
      let specificOffset;
      if (!isUndefined(matches.z)) {
        zone = IANAZone.create(matches.z);
      }
      if (!isUndefined(matches.Z)) {
        if (!zone) {
          zone = new FixedOffsetZone(matches.Z);
        }
        specificOffset = matches.Z;
      }
      if (!isUndefined(matches.q)) {
        matches.M = (matches.q - 1) * 3 + 1;
      }
      if (!isUndefined(matches.h)) {
        if (matches.h < 12 && matches.a === 1) {
          matches.h += 12;
        } else if (matches.h === 12 && matches.a === 0) {
          matches.h = 0;
        }
      }
      if (matches.G === 0 && matches.y) {
        matches.y = -matches.y;
      }
      if (!isUndefined(matches.u)) {
        matches.S = parseMillis(matches.u);
      }
      const vals = Object.keys(matches).reduce((r, k) => {
        const f = toField(k);
        if (f) {
          r[f] = matches[k];
        }
        return r;
      }, {});
      return [vals, zone, specificOffset];
    }
    var dummyDateTimeCache = null;
    function getDummyDateTime() {
      if (!dummyDateTimeCache) {
        dummyDateTimeCache = DateTime2.fromMillis(1555555555555);
      }
      return dummyDateTimeCache;
    }
    function maybeExpandMacroToken(token, locale) {
      if (token.literal) {
        return token;
      }
      const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
      const tokens = formatOptsToTokens(formatOpts, locale);
      if (tokens == null || tokens.includes(void 0)) {
        return token;
      }
      return tokens;
    }
    function expandMacroTokens(tokens, locale) {
      return Array.prototype.concat(...tokens.map((t) => maybeExpandMacroToken(t, locale)));
    }
    var TokenParser = class {
      constructor(locale, format) {
        this.locale = locale;
        this.format = format;
        this.tokens = expandMacroTokens(Formatter.parseFormat(format), locale);
        this.units = this.tokens.map((t) => unitForToken(t, locale));
        this.disqualifyingUnit = this.units.find((t) => t.invalidReason);
        if (!this.disqualifyingUnit) {
          const [regexString, handlers2] = buildRegex(this.units);
          this.regex = RegExp(regexString, "i");
          this.handlers = handlers2;
        }
      }
      explainFromTokens(input) {
        if (!this.isValid) {
          return {
            input,
            tokens: this.tokens,
            invalidReason: this.invalidReason
          };
        } else {
          const [rawMatches, matches] = match(input, this.regex, this.handlers), [result, zone, specificOffset] = matches ? dateTimeFromMatches(matches) : [null, null, void 0];
          if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
            throw new ConflictingSpecificationError("Can't include meridiem when specifying 24-hour format");
          }
          return {
            input,
            tokens: this.tokens,
            regex: this.regex,
            rawMatches,
            matches,
            result,
            zone,
            specificOffset
          };
        }
      }
      get isValid() {
        return !this.disqualifyingUnit;
      }
      get invalidReason() {
        return this.disqualifyingUnit ? this.disqualifyingUnit.invalidReason : null;
      }
    };
    function explainFromTokens(locale, input, format) {
      const parser = new TokenParser(locale, format);
      return parser.explainFromTokens(input);
    }
    function parseFromTokens(locale, input, format) {
      const {
        result,
        zone,
        specificOffset,
        invalidReason
      } = explainFromTokens(locale, input, format);
      return [result, zone, specificOffset, invalidReason];
    }
    function formatOptsToTokens(formatOpts, locale) {
      if (!formatOpts) {
        return null;
      }
      const formatter = Formatter.create(locale, formatOpts);
      const df = formatter.dtFormatter(getDummyDateTime());
      const parts = df.formatToParts();
      const resolvedOpts = df.resolvedOptions();
      return parts.map((p) => tokenForPart(p, formatOpts, resolvedOpts));
    }
    var INVALID = "Invalid DateTime";
    var MAX_DATE = 864e13;
    function unsupportedZone(zone) {
      return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
    }
    function possiblyCachedWeekData(dt) {
      if (dt.weekData === null) {
        dt.weekData = gregorianToWeek(dt.c);
      }
      return dt.weekData;
    }
    function possiblyCachedLocalWeekData(dt) {
      if (dt.localWeekData === null) {
        dt.localWeekData = gregorianToWeek(dt.c, dt.loc.getMinDaysInFirstWeek(), dt.loc.getStartOfWeek());
      }
      return dt.localWeekData;
    }
    function clone(inst, alts) {
      const current = {
        ts: inst.ts,
        zone: inst.zone,
        c: inst.c,
        o: inst.o,
        loc: inst.loc,
        invalid: inst.invalid
      };
      return new DateTime2({
        ...current,
        ...alts,
        old: current
      });
    }
    function fixOffset(localTS, o, tz) {
      let utcGuess = localTS - o * 60 * 1e3;
      const o2 = tz.offset(utcGuess);
      if (o === o2) {
        return [utcGuess, o];
      }
      utcGuess -= (o2 - o) * 60 * 1e3;
      const o3 = tz.offset(utcGuess);
      if (o2 === o3) {
        return [utcGuess, o2];
      }
      return [localTS - Math.min(o2, o3) * 60 * 1e3, Math.max(o2, o3)];
    }
    function tsToObj(ts, offset2) {
      ts += offset2 * 60 * 1e3;
      const d = new Date(ts);
      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
        second: d.getUTCSeconds(),
        millisecond: d.getUTCMilliseconds()
      };
    }
    function objToTS(obj, offset2, zone) {
      return fixOffset(objToLocalTS(obj), offset2, zone);
    }
    function adjustTime(inst, dur) {
      const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c = {
        ...inst.c,
        year,
        month,
        day: Math.min(inst.c.day, daysInMonth(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
      }, millisToAdd = Duration2.fromObject({
        years: dur.years - Math.trunc(dur.years),
        quarters: dur.quarters - Math.trunc(dur.quarters),
        months: dur.months - Math.trunc(dur.months),
        weeks: dur.weeks - Math.trunc(dur.weeks),
        days: dur.days - Math.trunc(dur.days),
        hours: dur.hours,
        minutes: dur.minutes,
        seconds: dur.seconds,
        milliseconds: dur.milliseconds
      }).as("milliseconds"), localTS = objToLocalTS(c);
      let [ts, o] = fixOffset(localTS, oPre, inst.zone);
      if (millisToAdd !== 0) {
        ts += millisToAdd;
        o = inst.zone.offset(ts);
      }
      return {
        ts,
        o
      };
    }
    function parseDataToDateTime(parsed, parsedZone, opts, format, text, specificOffset) {
      const {
        setZone,
        zone
      } = opts;
      if (parsed && Object.keys(parsed).length !== 0 || parsedZone) {
        const interpretationZone = parsedZone || zone, inst = DateTime2.fromObject(parsed, {
          ...opts,
          zone: interpretationZone,
          specificOffset
        });
        return setZone ? inst : inst.setZone(zone);
      } else {
        return DateTime2.invalid(new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`));
      }
    }
    function toTechFormat(dt, format, allowZ = true) {
      return dt.isValid ? Formatter.create(Locale.create("en-US"), {
        allowZ,
        forceSimple: true
      }).formatDateTimeFromString(dt, format) : null;
    }
    function toISODate(o, extended) {
      const longFormat = o.c.year > 9999 || o.c.year < 0;
      let c = "";
      if (longFormat && o.c.year >= 0) c += "+";
      c += padStart(o.c.year, longFormat ? 6 : 4);
      if (extended) {
        c += "-";
        c += padStart(o.c.month);
        c += "-";
        c += padStart(o.c.day);
      } else {
        c += padStart(o.c.month);
        c += padStart(o.c.day);
      }
      return c;
    }
    function toISOTime(o, extended, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone) {
      let c = padStart(o.c.hour);
      if (extended) {
        c += ":";
        c += padStart(o.c.minute);
        if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
          c += ":";
        }
      } else {
        c += padStart(o.c.minute);
      }
      if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
        c += padStart(o.c.second);
        if (o.c.millisecond !== 0 || !suppressMilliseconds) {
          c += ".";
          c += padStart(o.c.millisecond, 3);
        }
      }
      if (includeOffset) {
        if (o.isOffsetFixed && o.offset === 0 && !extendedZone) {
          c += "Z";
        } else if (o.o < 0) {
          c += "-";
          c += padStart(Math.trunc(-o.o / 60));
          c += ":";
          c += padStart(Math.trunc(-o.o % 60));
        } else {
          c += "+";
          c += padStart(Math.trunc(o.o / 60));
          c += ":";
          c += padStart(Math.trunc(o.o % 60));
        }
      }
      if (extendedZone) {
        c += "[" + o.zone.ianaName + "]";
      }
      return c;
    }
    var defaultUnitValues = {
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
    var defaultWeekUnitValues = {
      weekNumber: 1,
      weekday: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
    var defaultOrdinalUnitValues = {
      ordinal: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
    var orderedUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
    var orderedWeekUnits = ["weekYear", "weekNumber", "weekday", "hour", "minute", "second", "millisecond"];
    var orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
    function normalizeUnit(unit) {
      const normalized = {
        year: "year",
        years: "year",
        month: "month",
        months: "month",
        day: "day",
        days: "day",
        hour: "hour",
        hours: "hour",
        minute: "minute",
        minutes: "minute",
        quarter: "quarter",
        quarters: "quarter",
        second: "second",
        seconds: "second",
        millisecond: "millisecond",
        milliseconds: "millisecond",
        weekday: "weekday",
        weekdays: "weekday",
        weeknumber: "weekNumber",
        weeksnumber: "weekNumber",
        weeknumbers: "weekNumber",
        weekyear: "weekYear",
        weekyears: "weekYear",
        ordinal: "ordinal"
      }[unit.toLowerCase()];
      if (!normalized) throw new InvalidUnitError(unit);
      return normalized;
    }
    function normalizeUnitWithLocalWeeks(unit) {
      switch (unit.toLowerCase()) {
        case "localweekday":
        case "localweekdays":
          return "localWeekday";
        case "localweeknumber":
        case "localweeknumbers":
          return "localWeekNumber";
        case "localweekyear":
        case "localweekyears":
          return "localWeekYear";
        default:
          return normalizeUnit(unit);
      }
    }
    function guessOffsetForZone(zone) {
      if (!zoneOffsetGuessCache[zone]) {
        if (zoneOffsetTs === void 0) {
          zoneOffsetTs = Settings.now();
        }
        zoneOffsetGuessCache[zone] = zone.offset(zoneOffsetTs);
      }
      return zoneOffsetGuessCache[zone];
    }
    function quickDT(obj, opts) {
      const zone = normalizeZone(opts.zone, Settings.defaultZone);
      if (!zone.isValid) {
        return DateTime2.invalid(unsupportedZone(zone));
      }
      const loc = Locale.fromObject(opts);
      let ts, o;
      if (!isUndefined(obj.year)) {
        for (const u of orderedUnits) {
          if (isUndefined(obj[u])) {
            obj[u] = defaultUnitValues[u];
          }
        }
        const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
        if (invalid) {
          return DateTime2.invalid(invalid);
        }
        const offsetProvis = guessOffsetForZone(zone);
        [ts, o] = objToTS(obj, offsetProvis, zone);
      } else {
        ts = Settings.now();
      }
      return new DateTime2({
        ts,
        zone,
        loc,
        o
      });
    }
    function diffRelative(start, end, opts) {
      const round = isUndefined(opts.round) ? true : opts.round, format = (c, unit) => {
        c = roundTo(c, round || opts.calendary ? 0 : 2, true);
        const formatter = end.loc.clone(opts).relFormatter(opts);
        return formatter.format(c, unit);
      }, differ = (unit) => {
        if (opts.calendary) {
          if (!end.hasSame(start, unit)) {
            return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
          } else return 0;
        } else {
          return end.diff(start, unit).get(unit);
        }
      };
      if (opts.unit) {
        return format(differ(opts.unit), opts.unit);
      }
      for (const unit of opts.units) {
        const count = differ(unit);
        if (Math.abs(count) >= 1) {
          return format(count, unit);
        }
      }
      return format(start > end ? -0 : 0, opts.units[opts.units.length - 1]);
    }
    function lastOpts(argList) {
      let opts = {}, args;
      if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
        opts = argList[argList.length - 1];
        args = Array.from(argList).slice(0, argList.length - 1);
      } else {
        args = Array.from(argList);
      }
      return [opts, args];
    }
    var zoneOffsetTs;
    var zoneOffsetGuessCache = {};
    var DateTime2 = class _DateTime {
      /**
       * @access private
       */
      constructor(config) {
        const zone = config.zone || Settings.defaultZone;
        let invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
        this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;
        let c = null, o = null;
        if (!invalid) {
          const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);
          if (unchanged) {
            [c, o] = [config.old.c, config.old.o];
          } else {
            const ot = isNumber(config.o) && !config.old ? config.o : zone.offset(this.ts);
            c = tsToObj(this.ts, ot);
            invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
            c = invalid ? null : c;
            o = invalid ? null : ot;
          }
        }
        this._zone = zone;
        this.loc = config.loc || Locale.create();
        this.invalid = invalid;
        this.weekData = null;
        this.localWeekData = null;
        this.c = c;
        this.o = o;
        this.isLuxonDateTime = true;
      }
      // CONSTRUCT
      /**
       * Create a DateTime for the current instant, in the system's time zone.
       *
       * Use Settings to override these default values if needed.
       * @example DateTime.now().toISO() //~> now in the ISO format
       * @return {DateTime}
       */
      static now() {
        return new _DateTime({});
      }
      /**
       * Create a local DateTime
       * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
       * @param {number} [month=1] - The month, 1-indexed
       * @param {number} [day=1] - The day of the month, 1-indexed
       * @param {number} [hour=0] - The hour of the day, in 24-hour time
       * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
       * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
       * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
       * @example DateTime.local()                                  //~> now
       * @example DateTime.local({ zone: "America/New_York" })      //~> now, in US east coast time
       * @example DateTime.local(2017)                              //~> 2017-01-01T00:00:00
       * @example DateTime.local(2017, 3)                           //~> 2017-03-01T00:00:00
       * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
       * @example DateTime.local(2017, 3, 12, 5)                    //~> 2017-03-12T05:00:00
       * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" })   //~> 2017-03-12T05:00:00, in UTC
       * @example DateTime.local(2017, 3, 12, 5, 45)                //~> 2017-03-12T05:45:00
       * @example DateTime.local(2017, 3, 12, 5, 45, 10)            //~> 2017-03-12T05:45:10
       * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)       //~> 2017-03-12T05:45:10.765
       * @return {DateTime}
       */
      static local() {
        const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
        return quickDT({
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond
        }, opts);
      }
      /**
       * Create a DateTime in UTC
       * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
       * @param {number} [month=1] - The month, 1-indexed
       * @param {number} [day=1] - The day of the month
       * @param {number} [hour=0] - The hour of the day, in 24-hour time
       * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
       * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
       * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
       * @param {Object} options - configuration options for the DateTime
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
       * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
       * @param {string} [options.weekSettings] - the week settings to set on the resulting DateTime instance
       * @example DateTime.utc()                                              //~> now
       * @example DateTime.utc(2017)                                          //~> 2017-01-01T00:00:00Z
       * @example DateTime.utc(2017, 3)                                       //~> 2017-03-01T00:00:00Z
       * @example DateTime.utc(2017, 3, 12)                                   //~> 2017-03-12T00:00:00Z
       * @example DateTime.utc(2017, 3, 12, 5)                                //~> 2017-03-12T05:00:00Z
       * @example DateTime.utc(2017, 3, 12, 5, 45)                            //~> 2017-03-12T05:45:00Z
       * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" })          //~> 2017-03-12T05:45:00Z with a French locale
       * @example DateTime.utc(2017, 3, 12, 5, 45, 10)                        //~> 2017-03-12T05:45:10Z
       * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr" }) //~> 2017-03-12T05:45:10.765Z with a French locale
       * @return {DateTime}
       */
      static utc() {
        const [opts, args] = lastOpts(arguments), [year, month, day, hour, minute, second, millisecond] = args;
        opts.zone = FixedOffsetZone.utcInstance;
        return quickDT({
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond
        }, opts);
      }
      /**
       * Create a DateTime from a JavaScript Date object. Uses the default zone.
       * @param {Date} date - a JavaScript Date object
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @return {DateTime}
       */
      static fromJSDate(date, options = {}) {
        const ts = isDate(date) ? date.valueOf() : NaN;
        if (Number.isNaN(ts)) {
          return _DateTime.invalid("invalid input");
        }
        const zoneToUse = normalizeZone(options.zone, Settings.defaultZone);
        if (!zoneToUse.isValid) {
          return _DateTime.invalid(unsupportedZone(zoneToUse));
        }
        return new _DateTime({
          ts,
          zone: zoneToUse,
          loc: Locale.fromObject(options)
        });
      }
      /**
       * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
       * @param {number} milliseconds - a number of milliseconds since 1970 UTC
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
       * @return {DateTime}
       */
      static fromMillis(milliseconds, options = {}) {
        if (!isNumber(milliseconds)) {
          throw new InvalidArgumentError(`fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`);
        } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
          return _DateTime.invalid("Timestamp out of range");
        } else {
          return new _DateTime({
            ts: milliseconds,
            zone: normalizeZone(options.zone, Settings.defaultZone),
            loc: Locale.fromObject(options)
          });
        }
      }
      /**
       * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
       * @param {number} seconds - a number of seconds since 1970 UTC
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
       * @return {DateTime}
       */
      static fromSeconds(seconds, options = {}) {
        if (!isNumber(seconds)) {
          throw new InvalidArgumentError("fromSeconds requires a numerical input");
        } else {
          return new _DateTime({
            ts: seconds * 1e3,
            zone: normalizeZone(options.zone, Settings.defaultZone),
            loc: Locale.fromObject(options)
          });
        }
      }
      /**
       * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
       * @param {Object} obj - the object to create the DateTime from
       * @param {number} obj.year - a year, such as 1987
       * @param {number} obj.month - a month, 1-12
       * @param {number} obj.day - a day of the month, 1-31, depending on the month
       * @param {number} obj.ordinal - day of the year, 1-365 or 366
       * @param {number} obj.weekYear - an ISO week year
       * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
       * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
       * @param {number} obj.localWeekYear - a week year, according to the locale
       * @param {number} obj.localWeekNumber - a week number, between 1 and 52 or 53, depending on the year, according to the locale
       * @param {number} obj.localWeekday - a weekday, 1-7, where 1 is the first and 7 is the last day of the week, according to the locale
       * @param {number} obj.hour - hour of the day, 0-23
       * @param {number} obj.minute - minute of the hour, 0-59
       * @param {number} obj.second - second of the minute, 0-59
       * @param {number} obj.millisecond - millisecond of the second, 0-999
       * @param {Object} opts - options for creating this DateTime
       * @param {string|Zone} [opts.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
       * @param {string} [opts.locale='system\'s locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
       * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
       * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
       * @example DateTime.fromObject({ localWeekYear: 2022, localWeekNumber: 1, localWeekday: 1 }, { locale: "en-US" }).toISODate() //=> '2021-12-26'
       * @return {DateTime}
       */
      static fromObject(obj, opts = {}) {
        obj = obj || {};
        const zoneToUse = normalizeZone(opts.zone, Settings.defaultZone);
        if (!zoneToUse.isValid) {
          return _DateTime.invalid(unsupportedZone(zoneToUse));
        }
        const loc = Locale.fromObject(opts);
        const normalized = normalizeObject(obj, normalizeUnitWithLocalWeeks);
        const {
          minDaysInFirstWeek,
          startOfWeek
        } = usesLocalWeekValues(normalized, loc);
        const tsNow = Settings.now(), offsetProvis = !isUndefined(opts.specificOffset) ? opts.specificOffset : zoneToUse.offset(tsNow), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
        if ((containsGregor || containsOrdinal) && definiteWeekDef) {
          throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
        }
        if (containsGregorMD && containsOrdinal) {
          throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
        }
        const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
        let units, defaultValues, objNow = tsToObj(tsNow, offsetProvis);
        if (useWeekData) {
          units = orderedWeekUnits;
          defaultValues = defaultWeekUnitValues;
          objNow = gregorianToWeek(objNow, minDaysInFirstWeek, startOfWeek);
        } else if (containsOrdinal) {
          units = orderedOrdinalUnits;
          defaultValues = defaultOrdinalUnitValues;
          objNow = gregorianToOrdinal(objNow);
        } else {
          units = orderedUnits;
          defaultValues = defaultUnitValues;
        }
        let foundFirst = false;
        for (const u of units) {
          const v = normalized[u];
          if (!isUndefined(v)) {
            foundFirst = true;
          } else if (foundFirst) {
            normalized[u] = defaultValues[u];
          } else {
            normalized[u] = objNow[u];
          }
        }
        const higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized), invalid = higherOrderInvalid || hasInvalidTimeData(normalized);
        if (invalid) {
          return _DateTime.invalid(invalid);
        }
        const gregorian = useWeekData ? weekToGregorian(normalized, minDaysInFirstWeek, startOfWeek) : containsOrdinal ? ordinalToGregorian(normalized) : normalized, [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse), inst = new _DateTime({
          ts: tsFinal,
          zone: zoneToUse,
          o: offsetFinal,
          loc
        });
        if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
          return _DateTime.invalid("mismatched weekday", `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`);
        }
        if (!inst.isValid) {
          return _DateTime.invalid(inst.invalid);
        }
        return inst;
      }
      /**
       * Create a DateTime from an ISO 8601 string
       * @param {string} text - the ISO string
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
       * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
       * @param {string} [opts.weekSettings] - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromISO('2016-05-25T09:08:34.123')
       * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
       * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
       * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
       * @example DateTime.fromISO('2016-W05-4')
       * @return {DateTime}
       */
      static fromISO(text, opts = {}) {
        const [vals, parsedZone] = parseISODate(text);
        return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
      }
      /**
       * Create a DateTime from an RFC 2822 string
       * @param {string} text - the RFC 2822 string
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
       * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
       * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
       * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
       * @return {DateTime}
       */
      static fromRFC2822(text, opts = {}) {
        const [vals, parsedZone] = parseRFC2822Date(text);
        return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
      }
      /**
       * Create a DateTime from an HTTP header date
       * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
       * @param {string} text - the HTTP header date
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
       * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
       * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
       * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
       * @return {DateTime}
       */
      static fromHTTP(text, opts = {}) {
        const [vals, parsedZone] = parseHTTPDate(text);
        return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
      }
      /**
       * Create a DateTime from an input string and format string.
       * Defaults to en-US if no locale has been specified, regardless of the system's locale. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/parsing?id=table-of-tokens).
       * @param {string} text - the string to parse
       * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
       * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @return {DateTime}
       */
      static fromFormat(text, fmt, opts = {}) {
        if (isUndefined(text) || isUndefined(fmt)) {
          throw new InvalidArgumentError("fromFormat requires an input string and a format");
        }
        const {
          locale = null,
          numberingSystem = null
        } = opts, localeToUse = Locale.fromOpts({
          locale,
          numberingSystem,
          defaultToEN: true
        }), [vals, parsedZone, specificOffset, invalid] = parseFromTokens(localeToUse, text, fmt);
        if (invalid) {
          return _DateTime.invalid(invalid);
        } else {
          return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text, specificOffset);
        }
      }
      /**
       * @deprecated use fromFormat instead
       */
      static fromString(text, fmt, opts = {}) {
        return _DateTime.fromFormat(text, fmt, opts);
      }
      /**
       * Create a DateTime from a SQL date, time, or datetime
       * Defaults to en-US if no locale has been specified, regardless of the system's locale
       * @param {string} text - the string to parse
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
       * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @example DateTime.fromSQL('2017-05-15')
       * @example DateTime.fromSQL('2017-05-15 09:12:34')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
       * @example DateTime.fromSQL('09:12:34.342')
       * @return {DateTime}
       */
      static fromSQL(text, opts = {}) {
        const [vals, parsedZone] = parseSQL(text);
        return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
      }
      /**
       * Create an invalid DateTime.
       * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {DateTime}
       */
      static invalid(reason, explanation = null) {
        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
        }
        const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
        if (Settings.throwOnInvalid) {
          throw new InvalidDateTimeError(invalid);
        } else {
          return new _DateTime({
            invalid
          });
        }
      }
      /**
       * Check if an object is an instance of DateTime. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      static isDateTime(o) {
        return o && o.isLuxonDateTime || false;
      }
      /**
       * Produce the format string for a set of options
       * @param formatOpts
       * @param localeOpts
       * @returns {string}
       */
      static parseFormatForOpts(formatOpts, localeOpts = {}) {
        const tokenList = formatOptsToTokens(formatOpts, Locale.fromObject(localeOpts));
        return !tokenList ? null : tokenList.map((t) => t ? t.val : null).join("");
      }
      /**
       * Produce the the fully expanded format token for the locale
       * Does NOT quote characters, so quoted tokens will not round trip correctly
       * @param fmt
       * @param localeOpts
       * @returns {string}
       */
      static expandFormat(fmt, localeOpts = {}) {
        const expanded = expandMacroTokens(Formatter.parseFormat(fmt), Locale.fromObject(localeOpts));
        return expanded.map((t) => t.val).join("");
      }
      static resetCache() {
        zoneOffsetTs = void 0;
        zoneOffsetGuessCache = {};
      }
      // INFO
      /**
       * Get the value of unit.
       * @param {string} unit - a unit such as 'minute' or 'day'
       * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
       * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
       * @return {number}
       */
      get(unit) {
        return this[unit];
      }
      /**
       * Returns whether the DateTime is valid. Invalid DateTimes occur when:
       * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
       * * The DateTime was created by an operation on another invalid date
       * @type {boolean}
       */
      get isValid() {
        return this.invalid === null;
      }
      /**
       * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
       * @type {string}
       */
      get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
      }
      /**
       * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
       * @type {string}
       */
      get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
      }
      /**
       * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
       *
       * @type {string}
       */
      get locale() {
        return this.isValid ? this.loc.locale : null;
      }
      /**
       * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
       *
       * @type {string}
       */
      get numberingSystem() {
        return this.isValid ? this.loc.numberingSystem : null;
      }
      /**
       * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
       *
       * @type {string}
       */
      get outputCalendar() {
        return this.isValid ? this.loc.outputCalendar : null;
      }
      /**
       * Get the time zone associated with this DateTime.
       * @type {Zone}
       */
      get zone() {
        return this._zone;
      }
      /**
       * Get the name of the time zone.
       * @type {string}
       */
      get zoneName() {
        return this.isValid ? this.zone.name : null;
      }
      /**
       * Get the year
       * @example DateTime.local(2017, 5, 25).year //=> 2017
       * @type {number}
       */
      get year() {
        return this.isValid ? this.c.year : NaN;
      }
      /**
       * Get the quarter
       * @example DateTime.local(2017, 5, 25).quarter //=> 2
       * @type {number}
       */
      get quarter() {
        return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
      }
      /**
       * Get the month (1-12).
       * @example DateTime.local(2017, 5, 25).month //=> 5
       * @type {number}
       */
      get month() {
        return this.isValid ? this.c.month : NaN;
      }
      /**
       * Get the day of the month (1-30ish).
       * @example DateTime.local(2017, 5, 25).day //=> 25
       * @type {number}
       */
      get day() {
        return this.isValid ? this.c.day : NaN;
      }
      /**
       * Get the hour of the day (0-23).
       * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
       * @type {number}
       */
      get hour() {
        return this.isValid ? this.c.hour : NaN;
      }
      /**
       * Get the minute of the hour (0-59).
       * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
       * @type {number}
       */
      get minute() {
        return this.isValid ? this.c.minute : NaN;
      }
      /**
       * Get the second of the minute (0-59).
       * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
       * @type {number}
       */
      get second() {
        return this.isValid ? this.c.second : NaN;
      }
      /**
       * Get the millisecond of the second (0-999).
       * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
       * @type {number}
       */
      get millisecond() {
        return this.isValid ? this.c.millisecond : NaN;
      }
      /**
       * Get the week year
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
       * @type {number}
       */
      get weekYear() {
        return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
      }
      /**
       * Get the week number of the week year (1-52ish).
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
       * @type {number}
       */
      get weekNumber() {
        return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
      }
      /**
       * Get the day of the week.
       * 1 is Monday and 7 is Sunday
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2014, 11, 31).weekday //=> 4
       * @type {number}
       */
      get weekday() {
        return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
      }
      /**
       * Returns true if this date is on a weekend according to the locale, false otherwise
       * @returns {boolean}
       */
      get isWeekend() {
        return this.isValid && this.loc.getWeekendDays().includes(this.weekday);
      }
      /**
       * Get the day of the week according to the locale.
       * 1 is the first day of the week and 7 is the last day of the week.
       * If the locale assigns Sunday as the first day of the week, then a date which is a Sunday will return 1,
       * @returns {number}
       */
      get localWeekday() {
        return this.isValid ? possiblyCachedLocalWeekData(this).weekday : NaN;
      }
      /**
       * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
       * because the week can start on different days of the week (see localWeekday) and because a different number of days
       * is required for a week to count as the first week of a year.
       * @returns {number}
       */
      get localWeekNumber() {
        return this.isValid ? possiblyCachedLocalWeekData(this).weekNumber : NaN;
      }
      /**
       * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
       * differently, see localWeekNumber.
       * @returns {number}
       */
      get localWeekYear() {
        return this.isValid ? possiblyCachedLocalWeekData(this).weekYear : NaN;
      }
      /**
       * Get the ordinal (meaning the day of the year)
       * @example DateTime.local(2017, 5, 25).ordinal //=> 145
       * @type {number|DateTime}
       */
      get ordinal() {
        return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
      }
      /**
       * Get the human readable short month name, such as 'Oct'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
       * @type {string}
       */
      get monthShort() {
        return this.isValid ? Info.months("short", {
          locObj: this.loc
        })[this.month - 1] : null;
      }
      /**
       * Get the human readable long month name, such as 'October'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).monthLong //=> October
       * @type {string}
       */
      get monthLong() {
        return this.isValid ? Info.months("long", {
          locObj: this.loc
        })[this.month - 1] : null;
      }
      /**
       * Get the human readable short weekday, such as 'Mon'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
       * @type {string}
       */
      get weekdayShort() {
        return this.isValid ? Info.weekdays("short", {
          locObj: this.loc
        })[this.weekday - 1] : null;
      }
      /**
       * Get the human readable long weekday, such as 'Monday'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
       * @type {string}
       */
      get weekdayLong() {
        return this.isValid ? Info.weekdays("long", {
          locObj: this.loc
        })[this.weekday - 1] : null;
      }
      /**
       * Get the UTC offset of this DateTime in minutes
       * @example DateTime.now().offset //=> -240
       * @example DateTime.utc().offset //=> 0
       * @type {number}
       */
      get offset() {
        return this.isValid ? +this.o : NaN;
      }
      /**
       * Get the short human name for the zone's current offset, for example "EST" or "EDT".
       * Defaults to the system's locale if no locale has been specified
       * @type {string}
       */
      get offsetNameShort() {
        if (this.isValid) {
          return this.zone.offsetName(this.ts, {
            format: "short",
            locale: this.locale
          });
        } else {
          return null;
        }
      }
      /**
       * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
       * Defaults to the system's locale if no locale has been specified
       * @type {string}
       */
      get offsetNameLong() {
        if (this.isValid) {
          return this.zone.offsetName(this.ts, {
            format: "long",
            locale: this.locale
          });
        } else {
          return null;
        }
      }
      /**
       * Get whether this zone's offset ever changes, as in a DST.
       * @type {boolean}
       */
      get isOffsetFixed() {
        return this.isValid ? this.zone.isUniversal : null;
      }
      /**
       * Get whether the DateTime is in a DST.
       * @type {boolean}
       */
      get isInDST() {
        if (this.isOffsetFixed) {
          return false;
        } else {
          return this.offset > this.set({
            month: 1,
            day: 1
          }).offset || this.offset > this.set({
            month: 5
          }).offset;
        }
      }
      /**
       * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
       * in this DateTime's zone. During DST changes local time can be ambiguous, for example
       * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
       * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
       * @returns {DateTime[]}
       */
      getPossibleOffsets() {
        if (!this.isValid || this.isOffsetFixed) {
          return [this];
        }
        const dayMs = 864e5;
        const minuteMs = 6e4;
        const localTS = objToLocalTS(this.c);
        const oEarlier = this.zone.offset(localTS - dayMs);
        const oLater = this.zone.offset(localTS + dayMs);
        const o1 = this.zone.offset(localTS - oEarlier * minuteMs);
        const o2 = this.zone.offset(localTS - oLater * minuteMs);
        if (o1 === o2) {
          return [this];
        }
        const ts1 = localTS - o1 * minuteMs;
        const ts2 = localTS - o2 * minuteMs;
        const c1 = tsToObj(ts1, o1);
        const c2 = tsToObj(ts2, o2);
        if (c1.hour === c2.hour && c1.minute === c2.minute && c1.second === c2.second && c1.millisecond === c2.millisecond) {
          return [clone(this, {
            ts: ts1
          }), clone(this, {
            ts: ts2
          })];
        }
        return [this];
      }
      /**
       * Returns true if this DateTime is in a leap year, false otherwise
       * @example DateTime.local(2016).isInLeapYear //=> true
       * @example DateTime.local(2013).isInLeapYear //=> false
       * @type {boolean}
       */
      get isInLeapYear() {
        return isLeapYear(this.year);
      }
      /**
       * Returns the number of days in this DateTime's month
       * @example DateTime.local(2016, 2).daysInMonth //=> 29
       * @example DateTime.local(2016, 3).daysInMonth //=> 31
       * @type {number}
       */
      get daysInMonth() {
        return daysInMonth(this.year, this.month);
      }
      /**
       * Returns the number of days in this DateTime's year
       * @example DateTime.local(2016).daysInYear //=> 366
       * @example DateTime.local(2013).daysInYear //=> 365
       * @type {number}
       */
      get daysInYear() {
        return this.isValid ? daysInYear(this.year) : NaN;
      }
      /**
       * Returns the number of weeks in this DateTime's year
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2004).weeksInWeekYear //=> 53
       * @example DateTime.local(2013).weeksInWeekYear //=> 52
       * @type {number}
       */
      get weeksInWeekYear() {
        return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
      }
      /**
       * Returns the number of weeks in this DateTime's local week year
       * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
       * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
       * @type {number}
       */
      get weeksInLocalWeekYear() {
        return this.isValid ? weeksInWeekYear(this.localWeekYear, this.loc.getMinDaysInFirstWeek(), this.loc.getStartOfWeek()) : NaN;
      }
      /**
       * Returns the resolved Intl options for this DateTime.
       * This is useful in understanding the behavior of formatting methods
       * @param {Object} opts - the same options as toLocaleString
       * @return {Object}
       */
      resolvedLocaleOptions(opts = {}) {
        const {
          locale,
          numberingSystem,
          calendar
        } = Formatter.create(this.loc.clone(opts), opts).resolvedOptions(this);
        return {
          locale,
          numberingSystem,
          outputCalendar: calendar
        };
      }
      // TRANSFORM
      /**
       * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
       *
       * Equivalent to {@link DateTime#setZone}('utc')
       * @param {number} [offset=0] - optionally, an offset from UTC in minutes
       * @param {Object} [opts={}] - options to pass to `setZone()`
       * @return {DateTime}
       */
      toUTC(offset2 = 0, opts = {}) {
        return this.setZone(FixedOffsetZone.instance(offset2), opts);
      }
      /**
       * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
       *
       * Equivalent to `setZone('local')`
       * @return {DateTime}
       */
      toLocal() {
        return this.setZone(Settings.defaultZone);
      }
      /**
       * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
       *
       * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
       * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link DateTime#Zone} class.
       * @param {Object} opts - options
       * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
       * @return {DateTime}
       */
      setZone(zone, {
        keepLocalTime = false,
        keepCalendarTime = false
      } = {}) {
        zone = normalizeZone(zone, Settings.defaultZone);
        if (zone.equals(this.zone)) {
          return this;
        } else if (!zone.isValid) {
          return _DateTime.invalid(unsupportedZone(zone));
        } else {
          let newTS = this.ts;
          if (keepLocalTime || keepCalendarTime) {
            const offsetGuess = zone.offset(this.ts);
            const asObj = this.toObject();
            [newTS] = objToTS(asObj, offsetGuess, zone);
          }
          return clone(this, {
            ts: newTS,
            zone
          });
        }
      }
      /**
       * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
       * @param {Object} properties - the properties to set
       * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
       * @return {DateTime}
       */
      reconfigure({
        locale,
        numberingSystem,
        outputCalendar
      } = {}) {
        const loc = this.loc.clone({
          locale,
          numberingSystem,
          outputCalendar
        });
        return clone(this, {
          loc
        });
      }
      /**
       * "Set" the locale. Returns a newly-constructed DateTime.
       * Just a convenient alias for reconfigure({ locale })
       * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
       * @return {DateTime}
       */
      setLocale(locale) {
        return this.reconfigure({
          locale
        });
      }
      /**
       * "Set" the values of specified units. Returns a newly-constructed DateTime.
       * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
       *
       * This method also supports setting locale-based week units, i.e. `localWeekday`, `localWeekNumber` and `localWeekYear`.
       * They cannot be mixed with ISO-week units like `weekday`.
       * @param {Object} values - a mapping of units to numbers
       * @example dt.set({ year: 2017 })
       * @example dt.set({ hour: 8, minute: 30 })
       * @example dt.set({ weekday: 5 })
       * @example dt.set({ year: 2005, ordinal: 234 })
       * @return {DateTime}
       */
      set(values) {
        if (!this.isValid) return this;
        const normalized = normalizeObject(values, normalizeUnitWithLocalWeeks);
        const {
          minDaysInFirstWeek,
          startOfWeek
        } = usesLocalWeekValues(normalized, this.loc);
        const settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber;
        if ((containsGregor || containsOrdinal) && definiteWeekDef) {
          throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
        }
        if (containsGregorMD && containsOrdinal) {
          throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
        }
        let mixed;
        if (settingWeekStuff) {
          mixed = weekToGregorian({
            ...gregorianToWeek(this.c, minDaysInFirstWeek, startOfWeek),
            ...normalized
          }, minDaysInFirstWeek, startOfWeek);
        } else if (!isUndefined(normalized.ordinal)) {
          mixed = ordinalToGregorian({
            ...gregorianToOrdinal(this.c),
            ...normalized
          });
        } else {
          mixed = {
            ...this.toObject(),
            ...normalized
          };
          if (isUndefined(normalized.day)) {
            mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
          }
        }
        const [ts, o] = objToTS(mixed, this.o, this.zone);
        return clone(this, {
          ts,
          o
        });
      }
      /**
       * Add a period of time to this DateTime and return the resulting DateTime
       *
       * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
       * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @example DateTime.now().plus(123) //~> in 123 milliseconds
       * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
       * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
       * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
       * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
       * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
       * @return {DateTime}
       */
      plus(duration) {
        if (!this.isValid) return this;
        const dur = Duration2.fromDurationLike(duration);
        return clone(this, adjustTime(this, dur));
      }
      /**
       * Subtract a period of time to this DateTime and return the resulting DateTime
       * See {@link DateTime#plus}
       * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       @return {DateTime}
       */
      minus(duration) {
        if (!this.isValid) return this;
        const dur = Duration2.fromDurationLike(duration).negate();
        return clone(this, adjustTime(this, dur));
      }
      /**
       * "Set" this DateTime to the beginning of a unit of time.
       * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
       * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
       * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
       * @example DateTime.local(2014, 3, 3).startOf('week').toISODate(); //=> '2014-03-03', weeks always start on Mondays
       * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
       * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
       * @return {DateTime}
       */
      startOf(unit, {
        useLocaleWeeks = false
      } = {}) {
        if (!this.isValid) return this;
        const o = {}, normalizedUnit = Duration2.normalizeUnit(unit);
        switch (normalizedUnit) {
          case "years":
            o.month = 1;
          case "quarters":
          case "months":
            o.day = 1;
          case "weeks":
          case "days":
            o.hour = 0;
          case "hours":
            o.minute = 0;
          case "minutes":
            o.second = 0;
          case "seconds":
            o.millisecond = 0;
            break;
        }
        if (normalizedUnit === "weeks") {
          if (useLocaleWeeks) {
            const startOfWeek = this.loc.getStartOfWeek();
            const {
              weekday
            } = this;
            if (weekday < startOfWeek) {
              o.weekNumber = this.weekNumber - 1;
            }
            o.weekday = startOfWeek;
          } else {
            o.weekday = 1;
          }
        }
        if (normalizedUnit === "quarters") {
          const q = Math.ceil(this.month / 3);
          o.month = (q - 1) * 3 + 1;
        }
        return this.set(o);
      }
      /**
       * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
       * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
       * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3).endOf('week').toISO(); // => '2014-03-09T23:59:59.999-05:00', weeks start on Mondays
       * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
       * @return {DateTime}
       */
      endOf(unit, opts) {
        return this.isValid ? this.plus({
          [unit]: 1
        }).startOf(unit, opts).minus(1) : this;
      }
      // OUTPUT
      /**
       * Returns a string representation of this DateTime formatted according to the specified format string.
       * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
       * Defaults to en-US if no locale has been specified, regardless of the system's locale.
       * @param {string} fmt - the format string
       * @param {Object} opts - opts to override the configuration options on this DateTime
       * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
       * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
       * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
       * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
       * @return {string}
       */
      toFormat(fmt, opts = {}) {
        return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID;
      }
      /**
       * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
       * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
       * of the DateTime in the assigned locale.
       * Defaults to the system's locale if no locale has been specified
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
       * @param {Object} opts - opts to override the configuration options on this DateTime
       * @example DateTime.now().toLocaleString(); //=> 4/20/2017
       * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
       * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
       * @example DateTime.now().toLocaleString(DateTime.DATE_FULL, { locale: 'fr' }); //=> '28 août 2022'
       * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
       * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
       * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
       * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
       * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
       * @return {string}
       */
      toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
        return this.isValid ? Formatter.create(this.loc.clone(opts), formatOpts).formatDateTime(this) : INVALID;
      }
      /**
       * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
       * Defaults to the system's locale if no locale has been specified
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
       * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
       * @example DateTime.now().toLocaleParts(); //=> [
       *                                   //=>   { type: 'day', value: '25' },
       *                                   //=>   { type: 'literal', value: '/' },
       *                                   //=>   { type: 'month', value: '05' },
       *                                   //=>   { type: 'literal', value: '/' },
       *                                   //=>   { type: 'year', value: '1982' }
       *                                   //=> ]
       */
      toLocaleParts(opts = {}) {
        return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.extendedZone=false] - add the time zone format extension
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
       * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
       * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
       * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
       * @return {string}
       */
      toISO({
        format = "extended",
        suppressSeconds = false,
        suppressMilliseconds = false,
        includeOffset = true,
        extendedZone = false
      } = {}) {
        if (!this.isValid) {
          return null;
        }
        const ext = format === "extended";
        let c = toISODate(this, ext);
        c += "T";
        c += toISOTime(this, ext, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone);
        return c;
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's date component
       * @param {Object} opts - options
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
       * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
       * @return {string}
       */
      toISODate({
        format = "extended"
      } = {}) {
        if (!this.isValid) {
          return null;
        }
        return toISODate(this, format === "extended");
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's week date
       * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
       * @return {string}
       */
      toISOWeekDate() {
        return toTechFormat(this, "kkkk-'W'WW-c");
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's time component
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.extendedZone=true] - add the time zone format extension
       * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
       * @return {string}
       */
      toISOTime({
        suppressMilliseconds = false,
        suppressSeconds = false,
        includeOffset = true,
        includePrefix = false,
        extendedZone = false,
        format = "extended"
      } = {}) {
        if (!this.isValid) {
          return null;
        }
        let c = includePrefix ? "T" : "";
        return c + toISOTime(this, format === "extended", suppressSeconds, suppressMilliseconds, includeOffset, extendedZone);
      }
      /**
       * Returns an RFC 2822-compatible string representation of this DateTime
       * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
       * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
       * @return {string}
       */
      toRFC2822() {
        return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT.
       * Specifically, the string conforms to RFC 1123.
       * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
       * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
       * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
       * @return {string}
       */
      toHTTP() {
        return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in SQL Date
       * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
       * @return {string}
       */
      toSQLDate() {
        if (!this.isValid) {
          return null;
        }
        return toISODate(this, true);
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in SQL Time
       * @param {Object} opts - options
       * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
       * @example DateTime.utc().toSQL() //=> '05:15:16.345'
       * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
       * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
       * @example DateTime.now().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
       * @return {string}
       */
      toSQLTime({
        includeOffset = true,
        includeZone = false,
        includeOffsetSpace = true
      } = {}) {
        let fmt = "HH:mm:ss.SSS";
        if (includeZone || includeOffset) {
          if (includeOffsetSpace) {
            fmt += " ";
          }
          if (includeZone) {
            fmt += "z";
          } else if (includeOffset) {
            fmt += "ZZ";
          }
        }
        return toTechFormat(this, fmt, true);
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in SQL DateTime
       * @param {Object} opts - options
       * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
       * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
       * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
       * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
       * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
       * @return {string}
       */
      toSQL(opts = {}) {
        if (!this.isValid) {
          return null;
        }
        return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
      }
      /**
       * Returns a string representation of this DateTime appropriate for debugging
       * @return {string}
       */
      toString() {
        return this.isValid ? this.toISO() : INVALID;
      }
      /**
       * Returns a string representation of this DateTime appropriate for the REPL.
       * @return {string}
       */
      [Symbol.for("nodejs.util.inspect.custom")]() {
        if (this.isValid) {
          return `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`;
        } else {
          return `DateTime { Invalid, reason: ${this.invalidReason} }`;
        }
      }
      /**
       * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
       * @return {number}
       */
      valueOf() {
        return this.toMillis();
      }
      /**
       * Returns the epoch milliseconds of this DateTime.
       * @return {number}
       */
      toMillis() {
        return this.isValid ? this.ts : NaN;
      }
      /**
       * Returns the epoch seconds of this DateTime.
       * @return {number}
       */
      toSeconds() {
        return this.isValid ? this.ts / 1e3 : NaN;
      }
      /**
       * Returns the epoch seconds (as a whole number) of this DateTime.
       * @return {number}
       */
      toUnixInteger() {
        return this.isValid ? Math.floor(this.ts / 1e3) : NaN;
      }
      /**
       * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
       * @return {string}
       */
      toJSON() {
        return this.toISO();
      }
      /**
       * Returns a BSON serializable equivalent to this DateTime.
       * @return {Date}
       */
      toBSON() {
        return this.toJSDate();
      }
      /**
       * Returns a JavaScript object with this DateTime's year, month, day, and so on.
       * @param opts - options for generating the object
       * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
       * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
       * @return {Object}
       */
      toObject(opts = {}) {
        if (!this.isValid) return {};
        const base = {
          ...this.c
        };
        if (opts.includeConfig) {
          base.outputCalendar = this.outputCalendar;
          base.numberingSystem = this.loc.numberingSystem;
          base.locale = this.loc.locale;
        }
        return base;
      }
      /**
       * Returns a JavaScript Date equivalent to this DateTime.
       * @return {Date}
       */
      toJSDate() {
        return new Date(this.isValid ? this.ts : NaN);
      }
      // COMPARE
      /**
       * Return the difference between two DateTimes as a Duration.
       * @param {DateTime} otherDateTime - the DateTime to compare this one to
       * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @example
       * var i1 = DateTime.fromISO('1982-05-25T09:45'),
       *     i2 = DateTime.fromISO('1983-10-14T10:30');
       * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
       * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
       * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
       * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
       * @return {Duration}
       */
      diff(otherDateTime, unit = "milliseconds", opts = {}) {
        if (!this.isValid || !otherDateTime.isValid) {
          return Duration2.invalid("created by diffing an invalid DateTime");
        }
        const durOpts = {
          locale: this.locale,
          numberingSystem: this.numberingSystem,
          ...opts
        };
        const units = maybeArray(unit).map(Duration2.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = diff(earlier, later, units, durOpts);
        return otherIsLater ? diffed.negate() : diffed;
      }
      /**
       * Return the difference between this DateTime and right now.
       * See {@link DateTime#diff}
       * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @return {Duration}
       */
      diffNow(unit = "milliseconds", opts = {}) {
        return this.diff(_DateTime.now(), unit, opts);
      }
      /**
       * Return an Interval spanning between this DateTime and another DateTime
       * @param {DateTime} otherDateTime - the other end point of the Interval
       * @return {Interval}
       */
      until(otherDateTime) {
        return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
      }
      /**
       * Return whether this DateTime is in the same unit of time as another DateTime.
       * Higher-order units must also be identical for this function to return `true`.
       * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
       * @param {DateTime} otherDateTime - the other DateTime
       * @param {string} unit - the unit of time to check sameness on
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; only the locale of this DateTime is used
       * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
       * @return {boolean}
       */
      hasSame(otherDateTime, unit, opts) {
        if (!this.isValid) return false;
        const inputMs = otherDateTime.valueOf();
        const adjustedToZone = this.setZone(otherDateTime.zone, {
          keepLocalTime: true
        });
        return adjustedToZone.startOf(unit, opts) <= inputMs && inputMs <= adjustedToZone.endOf(unit, opts);
      }
      /**
       * Equality check
       * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
       * To compare just the millisecond values, use `+dt1 === +dt2`.
       * @param {DateTime} other - the other DateTime
       * @return {boolean}
       */
      equals(other) {
        return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
      }
      /**
       * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
       * platform supports Intl.RelativeTimeFormat. Rounds down by default.
       * @param {Object} options - options that affect the output
       * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
       * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
       * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
       * @param {boolean} [options.round=true] - whether to round the numbers in the output.
       * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
       * @param {string} options.locale - override the locale of this DateTime
       * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
       * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
       * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
       * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
       * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
       * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
       * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
       */
      toRelative(options = {}) {
        if (!this.isValid) return null;
        const base = options.base || _DateTime.fromObject({}, {
          zone: this.zone
        }), padding = options.padding ? this < base ? -options.padding : options.padding : 0;
        let units = ["years", "months", "days", "hours", "minutes", "seconds"];
        let unit = options.unit;
        if (Array.isArray(options.unit)) {
          units = options.unit;
          unit = void 0;
        }
        return diffRelative(base, this.plus(padding), {
          ...options,
          numeric: "always",
          units,
          unit
        });
      }
      /**
       * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
       * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
       * @param {Object} options - options that affect the output
       * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
       * @param {string} options.locale - override the locale of this DateTime
       * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
       * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
       * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
       * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
       * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
       * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
       */
      toRelativeCalendar(options = {}) {
        if (!this.isValid) return null;
        return diffRelative(options.base || _DateTime.fromObject({}, {
          zone: this.zone
        }), this, {
          ...options,
          numeric: "auto",
          units: ["years", "months", "days"],
          calendary: true
        });
      }
      /**
       * Return the min of several date times
       * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
       * @return {DateTime} the min DateTime, or undefined if called with no argument
       */
      static min(...dateTimes) {
        if (!dateTimes.every(_DateTime.isDateTime)) {
          throw new InvalidArgumentError("min requires all arguments be DateTimes");
        }
        return bestBy(dateTimes, (i) => i.valueOf(), Math.min);
      }
      /**
       * Return the max of several date times
       * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
       * @return {DateTime} the max DateTime, or undefined if called with no argument
       */
      static max(...dateTimes) {
        if (!dateTimes.every(_DateTime.isDateTime)) {
          throw new InvalidArgumentError("max requires all arguments be DateTimes");
        }
        return bestBy(dateTimes, (i) => i.valueOf(), Math.max);
      }
      // MISC
      /**
       * Explain how a string would be parsed by fromFormat()
       * @param {string} text - the string to parse
       * @param {string} fmt - the format the string is expected to be in (see description)
       * @param {Object} options - options taken by fromFormat()
       * @return {Object}
       */
      static fromFormatExplain(text, fmt, options = {}) {
        const {
          locale = null,
          numberingSystem = null
        } = options, localeToUse = Locale.fromOpts({
          locale,
          numberingSystem,
          defaultToEN: true
        });
        return explainFromTokens(localeToUse, text, fmt);
      }
      /**
       * @deprecated use fromFormatExplain instead
       */
      static fromStringExplain(text, fmt, options = {}) {
        return _DateTime.fromFormatExplain(text, fmt, options);
      }
      /**
       * Build a parser for `fmt` using the given locale. This parser can be passed
       * to {@link DateTime.fromFormatParser} to a parse a date in this format. This
       * can be used to optimize cases where many dates need to be parsed in a
       * specific format.
       *
       * @param {String} fmt - the format the string is expected to be in (see
       * description)
       * @param {Object} options - options used to set locale and numberingSystem
       * for parser
       * @returns {TokenParser} - opaque object to be used
       */
      static buildFormatParser(fmt, options = {}) {
        const {
          locale = null,
          numberingSystem = null
        } = options, localeToUse = Locale.fromOpts({
          locale,
          numberingSystem,
          defaultToEN: true
        });
        return new TokenParser(localeToUse, fmt);
      }
      /**
       * Create a DateTime from an input string and format parser.
       *
       * The format parser must have been created with the same locale as this call.
       *
       * @param {String} text - the string to parse
       * @param {TokenParser} formatParser - parser from {@link DateTime.buildFormatParser}
       * @param {Object} opts - options taken by fromFormat()
       * @returns {DateTime}
       */
      static fromFormatParser(text, formatParser, opts = {}) {
        if (isUndefined(text) || isUndefined(formatParser)) {
          throw new InvalidArgumentError("fromFormatParser requires an input string and a format parser");
        }
        const {
          locale = null,
          numberingSystem = null
        } = opts, localeToUse = Locale.fromOpts({
          locale,
          numberingSystem,
          defaultToEN: true
        });
        if (!localeToUse.equals(formatParser.locale)) {
          throw new InvalidArgumentError(`fromFormatParser called with a locale of ${localeToUse}, but the format parser was created for ${formatParser.locale}`);
        }
        const {
          result,
          zone,
          specificOffset,
          invalidReason
        } = formatParser.explainFromTokens(text);
        if (invalidReason) {
          return _DateTime.invalid(invalidReason);
        } else {
          return parseDataToDateTime(result, zone, opts, `format ${formatParser.format}`, text, specificOffset);
        }
      }
      // FORMAT PRESETS
      /**
       * {@link DateTime#toLocaleString} format like 10/14/1983
       * @type {Object}
       */
      static get DATE_SHORT() {
        return DATE_SHORT;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
       * @type {Object}
       */
      static get DATE_MED() {
        return DATE_MED;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
       * @type {Object}
       */
      static get DATE_MED_WITH_WEEKDAY() {
        return DATE_MED_WITH_WEEKDAY;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'October 14, 1983'
       * @type {Object}
       */
      static get DATE_FULL() {
        return DATE_FULL;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
       * @type {Object}
       */
      static get DATE_HUGE() {
        return DATE_HUGE;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_SIMPLE() {
        return TIME_SIMPLE;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_WITH_SECONDS() {
        return TIME_WITH_SECONDS;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_WITH_SHORT_OFFSET() {
        return TIME_WITH_SHORT_OFFSET;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_WITH_LONG_OFFSET() {
        return TIME_WITH_LONG_OFFSET;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_SIMPLE() {
        return TIME_24_SIMPLE;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_WITH_SECONDS() {
        return TIME_24_WITH_SECONDS;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_WITH_SHORT_OFFSET() {
        return TIME_24_WITH_SHORT_OFFSET;
      }
      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_WITH_LONG_OFFSET() {
        return TIME_24_WITH_LONG_OFFSET;
      }
      /**
       * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_SHORT() {
        return DATETIME_SHORT;
      }
      /**
       * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_SHORT_WITH_SECONDS() {
        return DATETIME_SHORT_WITH_SECONDS;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_MED() {
        return DATETIME_MED;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_MED_WITH_SECONDS() {
        return DATETIME_MED_WITH_SECONDS;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_MED_WITH_WEEKDAY() {
        return DATETIME_MED_WITH_WEEKDAY;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_FULL() {
        return DATETIME_FULL;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_FULL_WITH_SECONDS() {
        return DATETIME_FULL_WITH_SECONDS;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_HUGE() {
        return DATETIME_HUGE;
      }
      /**
       * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_HUGE_WITH_SECONDS() {
        return DATETIME_HUGE_WITH_SECONDS;
      }
    };
    function friendlyDateTime(dateTimeish) {
      if (DateTime2.isDateTime(dateTimeish)) {
        return dateTimeish;
      } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
        return DateTime2.fromJSDate(dateTimeish);
      } else if (dateTimeish && typeof dateTimeish === "object") {
        return DateTime2.fromObject(dateTimeish);
      } else {
        throw new InvalidArgumentError(`Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`);
      }
    }
    var VERSION = "3.5.0";
    exports.DateTime = DateTime2;
    exports.Duration = Duration2;
    exports.FixedOffsetZone = FixedOffsetZone;
    exports.IANAZone = IANAZone;
    exports.Info = Info;
    exports.Interval = Interval;
    exports.InvalidZone = InvalidZone;
    exports.Settings = Settings;
    exports.SystemZone = SystemZone;
    exports.VERSION = VERSION;
    exports.Zone = Zone;
  }
});

// node_modules/cron-parser/lib/date.js
var require_date = __commonJS({
  "node_modules/cron-parser/lib/date.js"(exports, module2) {
    "use strict";
    var luxon = require_luxon();
    CronDate.prototype.addYear = function() {
      this._date = this._date.plus({ years: 1 });
    };
    CronDate.prototype.addMonth = function() {
      this._date = this._date.plus({ months: 1 }).startOf("month");
    };
    CronDate.prototype.addDay = function() {
      this._date = this._date.plus({ days: 1 }).startOf("day");
    };
    CronDate.prototype.addHour = function() {
      var prev = this._date;
      this._date = this._date.plus({ hours: 1 }).startOf("hour");
      if (this._date <= prev) {
        this._date = this._date.plus({ hours: 1 });
      }
    };
    CronDate.prototype.addMinute = function() {
      var prev = this._date;
      this._date = this._date.plus({ minutes: 1 }).startOf("minute");
      if (this._date < prev) {
        this._date = this._date.plus({ hours: 1 });
      }
    };
    CronDate.prototype.addSecond = function() {
      var prev = this._date;
      this._date = this._date.plus({ seconds: 1 }).startOf("second");
      if (this._date < prev) {
        this._date = this._date.plus({ hours: 1 });
      }
    };
    CronDate.prototype.subtractYear = function() {
      this._date = this._date.minus({ years: 1 });
    };
    CronDate.prototype.subtractMonth = function() {
      this._date = this._date.minus({ months: 1 }).endOf("month").startOf("second");
    };
    CronDate.prototype.subtractDay = function() {
      this._date = this._date.minus({ days: 1 }).endOf("day").startOf("second");
    };
    CronDate.prototype.subtractHour = function() {
      var prev = this._date;
      this._date = this._date.minus({ hours: 1 }).endOf("hour").startOf("second");
      if (this._date >= prev) {
        this._date = this._date.minus({ hours: 1 });
      }
    };
    CronDate.prototype.subtractMinute = function() {
      var prev = this._date;
      this._date = this._date.minus({ minutes: 1 }).endOf("minute").startOf("second");
      if (this._date > prev) {
        this._date = this._date.minus({ hours: 1 });
      }
    };
    CronDate.prototype.subtractSecond = function() {
      var prev = this._date;
      this._date = this._date.minus({ seconds: 1 }).startOf("second");
      if (this._date > prev) {
        this._date = this._date.minus({ hours: 1 });
      }
    };
    CronDate.prototype.getDate = function() {
      return this._date.day;
    };
    CronDate.prototype.getFullYear = function() {
      return this._date.year;
    };
    CronDate.prototype.getDay = function() {
      var weekday = this._date.weekday;
      return weekday == 7 ? 0 : weekday;
    };
    CronDate.prototype.getMonth = function() {
      return this._date.month - 1;
    };
    CronDate.prototype.getHours = function() {
      return this._date.hour;
    };
    CronDate.prototype.getMinutes = function() {
      return this._date.minute;
    };
    CronDate.prototype.getSeconds = function() {
      return this._date.second;
    };
    CronDate.prototype.getMilliseconds = function() {
      return this._date.millisecond;
    };
    CronDate.prototype.getTime = function() {
      return this._date.valueOf();
    };
    CronDate.prototype.getUTCDate = function() {
      return this._getUTC().day;
    };
    CronDate.prototype.getUTCFullYear = function() {
      return this._getUTC().year;
    };
    CronDate.prototype.getUTCDay = function() {
      var weekday = this._getUTC().weekday;
      return weekday == 7 ? 0 : weekday;
    };
    CronDate.prototype.getUTCMonth = function() {
      return this._getUTC().month - 1;
    };
    CronDate.prototype.getUTCHours = function() {
      return this._getUTC().hour;
    };
    CronDate.prototype.getUTCMinutes = function() {
      return this._getUTC().minute;
    };
    CronDate.prototype.getUTCSeconds = function() {
      return this._getUTC().second;
    };
    CronDate.prototype.toISOString = function() {
      return this._date.toUTC().toISO();
    };
    CronDate.prototype.toJSON = function() {
      return this._date.toJSON();
    };
    CronDate.prototype.setDate = function(d) {
      this._date = this._date.set({ day: d });
    };
    CronDate.prototype.setFullYear = function(y) {
      this._date = this._date.set({ year: y });
    };
    CronDate.prototype.setDay = function(d) {
      this._date = this._date.set({ weekday: d });
    };
    CronDate.prototype.setMonth = function(m) {
      this._date = this._date.set({ month: m + 1 });
    };
    CronDate.prototype.setHours = function(h) {
      this._date = this._date.set({ hour: h });
    };
    CronDate.prototype.setMinutes = function(m) {
      this._date = this._date.set({ minute: m });
    };
    CronDate.prototype.setSeconds = function(s) {
      this._date = this._date.set({ second: s });
    };
    CronDate.prototype.setMilliseconds = function(s) {
      this._date = this._date.set({ millisecond: s });
    };
    CronDate.prototype._getUTC = function() {
      return this._date.toUTC();
    };
    CronDate.prototype.toString = function() {
      return this.toDate().toString();
    };
    CronDate.prototype.toDate = function() {
      return this._date.toJSDate();
    };
    CronDate.prototype.isLastDayOfMonth = function() {
      var newDate = this._date.plus({ days: 1 }).startOf("day");
      return this._date.month !== newDate.month;
    };
    CronDate.prototype.isLastWeekdayOfMonth = function() {
      var newDate = this._date.plus({ days: 7 }).startOf("day");
      return this._date.month !== newDate.month;
    };
    function CronDate(timestamp, tz) {
      var dateOpts = { zone: tz };
      if (!timestamp) {
        this._date = luxon.DateTime.local();
      } else if (timestamp instanceof CronDate) {
        this._date = timestamp._date;
      } else if (timestamp instanceof Date) {
        this._date = luxon.DateTime.fromJSDate(timestamp, dateOpts);
      } else if (typeof timestamp === "number") {
        this._date = luxon.DateTime.fromMillis(timestamp, dateOpts);
      } else if (typeof timestamp === "string") {
        this._date = luxon.DateTime.fromISO(timestamp, dateOpts);
        this._date.isValid || (this._date = luxon.DateTime.fromRFC2822(timestamp, dateOpts));
        this._date.isValid || (this._date = luxon.DateTime.fromSQL(timestamp, dateOpts));
        this._date.isValid || (this._date = luxon.DateTime.fromFormat(timestamp, "EEE, d MMM yyyy HH:mm:ss", dateOpts));
      }
      if (!this._date || !this._date.isValid) {
        throw new Error("CronDate: unhandled timestamp: " + JSON.stringify(timestamp));
      }
      if (tz && tz !== this._date.zoneName) {
        this._date = this._date.setZone(tz);
      }
    }
    module2.exports = CronDate;
  }
});

// node_modules/cron-parser/lib/field_compactor.js
var require_field_compactor = __commonJS({
  "node_modules/cron-parser/lib/field_compactor.js"(exports, module2) {
    "use strict";
    function buildRange(item) {
      return {
        start: item,
        count: 1
      };
    }
    function completeRangeWithItem(range, item) {
      range.end = item;
      range.step = item - range.start;
      range.count = 2;
    }
    function finalizeCurrentRange(results, currentRange, currentItemRange) {
      if (currentRange) {
        if (currentRange.count === 2) {
          results.push(buildRange(currentRange.start));
          results.push(buildRange(currentRange.end));
        } else {
          results.push(currentRange);
        }
      }
      if (currentItemRange) {
        results.push(currentItemRange);
      }
    }
    function compactField(arr) {
      var results = [];
      var currentRange = void 0;
      for (var i = 0; i < arr.length; i++) {
        var currentItem = arr[i];
        if (typeof currentItem !== "number") {
          finalizeCurrentRange(results, currentRange, buildRange(currentItem));
          currentRange = void 0;
        } else if (!currentRange) {
          currentRange = buildRange(currentItem);
        } else if (currentRange.count === 1) {
          completeRangeWithItem(currentRange, currentItem);
        } else {
          if (currentRange.step === currentItem - currentRange.end) {
            currentRange.count++;
            currentRange.end = currentItem;
          } else if (currentRange.count === 2) {
            results.push(buildRange(currentRange.start));
            currentRange = buildRange(currentRange.end);
            completeRangeWithItem(currentRange, currentItem);
          } else {
            finalizeCurrentRange(results, currentRange);
            currentRange = buildRange(currentItem);
          }
        }
      }
      finalizeCurrentRange(results, currentRange);
      return results;
    }
    module2.exports = compactField;
  }
});

// node_modules/cron-parser/lib/field_stringify.js
var require_field_stringify = __commonJS({
  "node_modules/cron-parser/lib/field_stringify.js"(exports, module2) {
    "use strict";
    var compactField = require_field_compactor();
    function stringifyField(arr, min, max) {
      var ranges = compactField(arr);
      if (ranges.length === 1) {
        var singleRange = ranges[0];
        var step = singleRange.step;
        if (step === 1 && singleRange.start === min && singleRange.end === max) {
          return "*";
        }
        if (step !== 1 && singleRange.start === min && singleRange.end === max - step + 1) {
          return "*/" + step;
        }
      }
      var result = [];
      for (var i = 0, l = ranges.length; i < l; ++i) {
        var range = ranges[i];
        if (range.count === 1) {
          result.push(range.start);
          continue;
        }
        var step = range.step;
        if (range.step === 1) {
          result.push(range.start + "-" + range.end);
          continue;
        }
        var multiplier = range.start == 0 ? range.count - 1 : range.count;
        if (range.step * multiplier > range.end) {
          result = result.concat(
            Array.from({ length: range.end - range.start + 1 }).map(function(_, index) {
              var value = range.start + index;
              if ((value - range.start) % range.step === 0) {
                return value;
              }
              return null;
            }).filter(function(value) {
              return value != null;
            })
          );
        } else if (range.end === max - range.step + 1) {
          result.push(range.start + "/" + range.step);
        } else {
          result.push(range.start + "-" + range.end + "/" + range.step);
        }
      }
      return result.join(",");
    }
    module2.exports = stringifyField;
  }
});

// node_modules/cron-parser/lib/expression.js
var require_expression = __commonJS({
  "node_modules/cron-parser/lib/expression.js"(exports, module2) {
    "use strict";
    var CronDate = require_date();
    var stringifyField = require_field_stringify();
    var LOOP_LIMIT = 1e4;
    function CronExpression(fields, options) {
      this._options = options;
      this._utc = options.utc || false;
      this._tz = this._utc ? "UTC" : options.tz;
      this._currentDate = new CronDate(options.currentDate, this._tz);
      this._startDate = options.startDate ? new CronDate(options.startDate, this._tz) : null;
      this._endDate = options.endDate ? new CronDate(options.endDate, this._tz) : null;
      this._isIterator = options.iterator || false;
      this._hasIterated = false;
      this._nthDayOfWeek = options.nthDayOfWeek || 0;
      this.fields = CronExpression._freezeFields(fields);
    }
    CronExpression.map = ["second", "minute", "hour", "dayOfMonth", "month", "dayOfWeek"];
    CronExpression.predefined = {
      "@yearly": "0 0 1 1 *",
      "@monthly": "0 0 1 * *",
      "@weekly": "0 0 * * 0",
      "@daily": "0 0 * * *",
      "@hourly": "0 * * * *"
    };
    CronExpression.constraints = [
      { min: 0, max: 59, chars: [] },
      // Second
      { min: 0, max: 59, chars: [] },
      // Minute
      { min: 0, max: 23, chars: [] },
      // Hour
      { min: 1, max: 31, chars: ["L"] },
      // Day of month
      { min: 1, max: 12, chars: [] },
      // Month
      { min: 0, max: 7, chars: ["L"] }
      // Day of week
    ];
    CronExpression.daysInMonth = [
      31,
      29,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ];
    CronExpression.aliases = {
      month: {
        jan: 1,
        feb: 2,
        mar: 3,
        apr: 4,
        may: 5,
        jun: 6,
        jul: 7,
        aug: 8,
        sep: 9,
        oct: 10,
        nov: 11,
        dec: 12
      },
      dayOfWeek: {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6
      }
    };
    CronExpression.parseDefaults = ["0", "*", "*", "*", "*", "*"];
    CronExpression.standardValidCharacters = /^[,*\d/-]+$/;
    CronExpression.dayOfWeekValidCharacters = /^[?,*\dL#/-]+$/;
    CronExpression.dayOfMonthValidCharacters = /^[?,*\dL/-]+$/;
    CronExpression.validCharacters = {
      second: CronExpression.standardValidCharacters,
      minute: CronExpression.standardValidCharacters,
      hour: CronExpression.standardValidCharacters,
      dayOfMonth: CronExpression.dayOfMonthValidCharacters,
      month: CronExpression.standardValidCharacters,
      dayOfWeek: CronExpression.dayOfWeekValidCharacters
    };
    CronExpression._isValidConstraintChar = function _isValidConstraintChar(constraints, value) {
      if (typeof value !== "string") {
        return false;
      }
      return constraints.chars.some(function(char) {
        return value.indexOf(char) > -1;
      });
    };
    CronExpression._parseField = function _parseField(field, value, constraints) {
      switch (field) {
        case "month":
        case "dayOfWeek":
          var aliases = CronExpression.aliases[field];
          value = value.replace(/[a-z]{3}/gi, function(match) {
            match = match.toLowerCase();
            if (typeof aliases[match] !== "undefined") {
              return aliases[match];
            } else {
              throw new Error('Validation error, cannot resolve alias "' + match + '"');
            }
          });
          break;
      }
      if (!CronExpression.validCharacters[field].test(value)) {
        throw new Error("Invalid characters, got value: " + value);
      }
      if (value.indexOf("*") !== -1) {
        value = value.replace(/\*/g, constraints.min + "-" + constraints.max);
      } else if (value.indexOf("?") !== -1) {
        value = value.replace(/\?/g, constraints.min + "-" + constraints.max);
      }
      function parseSequence(val) {
        var stack = [];
        function handleResult(result) {
          if (result instanceof Array) {
            for (var i2 = 0, c2 = result.length; i2 < c2; i2++) {
              var value2 = result[i2];
              if (CronExpression._isValidConstraintChar(constraints, value2)) {
                stack.push(value2);
                continue;
              }
              if (typeof value2 !== "number" || Number.isNaN(value2) || value2 < constraints.min || value2 > constraints.max) {
                throw new Error(
                  "Constraint error, got value " + value2 + " expected range " + constraints.min + "-" + constraints.max
                );
              }
              stack.push(value2);
            }
          } else {
            if (CronExpression._isValidConstraintChar(constraints, result)) {
              stack.push(result);
              return;
            }
            var numResult = +result;
            if (Number.isNaN(numResult) || numResult < constraints.min || numResult > constraints.max) {
              throw new Error(
                "Constraint error, got value " + result + " expected range " + constraints.min + "-" + constraints.max
              );
            }
            if (field === "dayOfWeek") {
              numResult = numResult % 7;
            }
            stack.push(numResult);
          }
        }
        var atoms = val.split(",");
        if (!atoms.every(function(atom) {
          return atom.length > 0;
        })) {
          throw new Error("Invalid list value format");
        }
        if (atoms.length > 1) {
          for (var i = 0, c = atoms.length; i < c; i++) {
            handleResult(parseRepeat(atoms[i]));
          }
        } else {
          handleResult(parseRepeat(val));
        }
        stack.sort(CronExpression._sortCompareFn);
        return stack;
      }
      function parseRepeat(val) {
        var repeatInterval = 1;
        var atoms = val.split("/");
        if (atoms.length > 2) {
          throw new Error("Invalid repeat: " + val);
        }
        if (atoms.length > 1) {
          if (atoms[0] == +atoms[0]) {
            atoms = [atoms[0] + "-" + constraints.max, atoms[1]];
          }
          return parseRange(atoms[0], atoms[atoms.length - 1]);
        }
        return parseRange(val, repeatInterval);
      }
      function parseRange(val, repeatInterval) {
        var stack = [];
        var atoms = val.split("-");
        if (atoms.length > 1) {
          if (atoms.length < 2) {
            return +val;
          }
          if (!atoms[0].length) {
            if (!atoms[1].length) {
              throw new Error("Invalid range: " + val);
            }
            return +val;
          }
          var min = +atoms[0];
          var max = +atoms[1];
          if (Number.isNaN(min) || Number.isNaN(max) || min < constraints.min || max > constraints.max) {
            throw new Error(
              "Constraint error, got range " + min + "-" + max + " expected range " + constraints.min + "-" + constraints.max
            );
          } else if (min > max) {
            throw new Error("Invalid range: " + val);
          }
          var repeatIndex = +repeatInterval;
          if (Number.isNaN(repeatIndex) || repeatIndex <= 0) {
            throw new Error("Constraint error, cannot repeat at every " + repeatIndex + " time.");
          }
          if (field === "dayOfWeek" && max % 7 === 0) {
            stack.push(0);
          }
          for (var index = min, count = max; index <= count; index++) {
            var exists = stack.indexOf(index) !== -1;
            if (!exists && repeatIndex > 0 && repeatIndex % repeatInterval === 0) {
              repeatIndex = 1;
              stack.push(index);
            } else {
              repeatIndex++;
            }
          }
          return stack;
        }
        return Number.isNaN(+val) ? val : +val;
      }
      return parseSequence(value);
    };
    CronExpression._sortCompareFn = function(a, b) {
      var aIsNumber = typeof a === "number";
      var bIsNumber = typeof b === "number";
      if (aIsNumber && bIsNumber) {
        return a - b;
      }
      if (!aIsNumber && bIsNumber) {
        return 1;
      }
      if (aIsNumber && !bIsNumber) {
        return -1;
      }
      return a.localeCompare(b);
    };
    CronExpression._handleMaxDaysInMonth = function(mappedFields) {
      if (mappedFields.month.length === 1) {
        var daysInMonth = CronExpression.daysInMonth[mappedFields.month[0] - 1];
        if (mappedFields.dayOfMonth[0] > daysInMonth) {
          throw new Error("Invalid explicit day of month definition");
        }
        return mappedFields.dayOfMonth.filter(function(dayOfMonth) {
          return dayOfMonth === "L" ? true : dayOfMonth <= daysInMonth;
        }).sort(CronExpression._sortCompareFn);
      }
    };
    CronExpression._freezeFields = function(fields) {
      for (var i = 0, c = CronExpression.map.length; i < c; ++i) {
        var field = CronExpression.map[i];
        var value = fields[field];
        fields[field] = Object.freeze(value);
      }
      return Object.freeze(fields);
    };
    CronExpression.prototype._applyTimezoneShift = function(currentDate, dateMathVerb, method) {
      if (method === "Month" || method === "Day") {
        var prevTime = currentDate.getTime();
        currentDate[dateMathVerb + method]();
        var currTime = currentDate.getTime();
        if (prevTime === currTime) {
          if (currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {
            currentDate.addHour();
          } else if (currentDate.getMinutes() === 59 && currentDate.getSeconds() === 59) {
            currentDate.subtractHour();
          }
        }
      } else {
        var previousHour = currentDate.getHours();
        currentDate[dateMathVerb + method]();
        var currentHour = currentDate.getHours();
        var diff = currentHour - previousHour;
        if (diff === 2) {
          if (this.fields.hour.length !== 24) {
            this._dstStart = currentHour;
          }
        } else if (diff === 0 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {
          if (this.fields.hour.length !== 24) {
            this._dstEnd = currentHour;
          }
        }
      }
    };
    CronExpression.prototype._findSchedule = function _findSchedule(reverse) {
      function matchSchedule(value, sequence) {
        for (var i = 0, c = sequence.length; i < c; i++) {
          if (sequence[i] >= value) {
            return sequence[i] === value;
          }
        }
        return sequence[0] === value;
      }
      function isNthDayMatch(date, nthDayOfWeek) {
        if (nthDayOfWeek < 6) {
          if (date.getDate() < 8 && nthDayOfWeek === 1) {
            return true;
          }
          var offset = date.getDate() % 7 ? 1 : 0;
          var adjustedDate = date.getDate() - date.getDate() % 7;
          var occurrence = Math.floor(adjustedDate / 7) + offset;
          return occurrence === nthDayOfWeek;
        }
        return false;
      }
      function isLInExpressions(expressions) {
        return expressions.length > 0 && expressions.some(function(expression) {
          return typeof expression === "string" && expression.indexOf("L") >= 0;
        });
      }
      reverse = reverse || false;
      var dateMathVerb = reverse ? "subtract" : "add";
      var currentDate = new CronDate(this._currentDate, this._tz);
      var startDate = this._startDate;
      var endDate = this._endDate;
      var startTimestamp = currentDate.getTime();
      var stepCount = 0;
      function isLastWeekdayOfMonthMatch(expressions) {
        return expressions.some(function(expression) {
          if (!isLInExpressions([expression])) {
            return false;
          }
          var weekday = Number.parseInt(expression[0]) % 7;
          if (Number.isNaN(weekday)) {
            throw new Error("Invalid last weekday of the month expression: " + expression);
          }
          return currentDate.getDay() === weekday && currentDate.isLastWeekdayOfMonth();
        });
      }
      while (stepCount < LOOP_LIMIT) {
        stepCount++;
        if (reverse) {
          if (startDate && currentDate.getTime() - startDate.getTime() < 0) {
            throw new Error("Out of the timespan range");
          }
        } else {
          if (endDate && endDate.getTime() - currentDate.getTime() < 0) {
            throw new Error("Out of the timespan range");
          }
        }
        var dayOfMonthMatch = matchSchedule(currentDate.getDate(), this.fields.dayOfMonth);
        if (isLInExpressions(this.fields.dayOfMonth)) {
          dayOfMonthMatch = dayOfMonthMatch || currentDate.isLastDayOfMonth();
        }
        var dayOfWeekMatch = matchSchedule(currentDate.getDay(), this.fields.dayOfWeek);
        if (isLInExpressions(this.fields.dayOfWeek)) {
          dayOfWeekMatch = dayOfWeekMatch || isLastWeekdayOfMonthMatch(this.fields.dayOfWeek);
        }
        var isDayOfMonthWildcardMatch = this.fields.dayOfMonth.length >= CronExpression.daysInMonth[currentDate.getMonth()];
        var isDayOfWeekWildcardMatch = this.fields.dayOfWeek.length === CronExpression.constraints[5].max - CronExpression.constraints[5].min + 1;
        var currentHour = currentDate.getHours();
        if (!dayOfMonthMatch && (!dayOfWeekMatch || isDayOfWeekWildcardMatch)) {
          this._applyTimezoneShift(currentDate, dateMathVerb, "Day");
          continue;
        }
        if (!isDayOfMonthWildcardMatch && isDayOfWeekWildcardMatch && !dayOfMonthMatch) {
          this._applyTimezoneShift(currentDate, dateMathVerb, "Day");
          continue;
        }
        if (isDayOfMonthWildcardMatch && !isDayOfWeekWildcardMatch && !dayOfWeekMatch) {
          this._applyTimezoneShift(currentDate, dateMathVerb, "Day");
          continue;
        }
        if (this._nthDayOfWeek > 0 && !isNthDayMatch(currentDate, this._nthDayOfWeek)) {
          this._applyTimezoneShift(currentDate, dateMathVerb, "Day");
          continue;
        }
        if (!matchSchedule(currentDate.getMonth() + 1, this.fields.month)) {
          this._applyTimezoneShift(currentDate, dateMathVerb, "Month");
          continue;
        }
        if (!matchSchedule(currentHour, this.fields.hour)) {
          if (this._dstStart !== currentHour) {
            this._dstStart = null;
            this._applyTimezoneShift(currentDate, dateMathVerb, "Hour");
            continue;
          } else if (!matchSchedule(currentHour - 1, this.fields.hour)) {
            currentDate[dateMathVerb + "Hour"]();
            continue;
          }
        } else if (this._dstEnd === currentHour) {
          if (!reverse) {
            this._dstEnd = null;
            this._applyTimezoneShift(currentDate, "add", "Hour");
            continue;
          }
        }
        if (!matchSchedule(currentDate.getMinutes(), this.fields.minute)) {
          this._applyTimezoneShift(currentDate, dateMathVerb, "Minute");
          continue;
        }
        if (!matchSchedule(currentDate.getSeconds(), this.fields.second)) {
          this._applyTimezoneShift(currentDate, dateMathVerb, "Second");
          continue;
        }
        if (startTimestamp === currentDate.getTime()) {
          if (dateMathVerb === "add" || currentDate.getMilliseconds() === 0) {
            this._applyTimezoneShift(currentDate, dateMathVerb, "Second");
          } else {
            currentDate.setMilliseconds(0);
          }
          continue;
        }
        break;
      }
      if (stepCount >= LOOP_LIMIT) {
        throw new Error("Invalid expression, loop limit exceeded");
      }
      this._currentDate = new CronDate(currentDate, this._tz);
      this._hasIterated = true;
      return currentDate;
    };
    CronExpression.prototype.next = function next() {
      var schedule = this._findSchedule();
      if (this._isIterator) {
        return {
          value: schedule,
          done: !this.hasNext()
        };
      }
      return schedule;
    };
    CronExpression.prototype.prev = function prev() {
      var schedule = this._findSchedule(true);
      if (this._isIterator) {
        return {
          value: schedule,
          done: !this.hasPrev()
        };
      }
      return schedule;
    };
    CronExpression.prototype.hasNext = function() {
      var current = this._currentDate;
      var hasIterated = this._hasIterated;
      try {
        this._findSchedule();
        return true;
      } catch (err) {
        return false;
      } finally {
        this._currentDate = current;
        this._hasIterated = hasIterated;
      }
    };
    CronExpression.prototype.hasPrev = function() {
      var current = this._currentDate;
      var hasIterated = this._hasIterated;
      try {
        this._findSchedule(true);
        return true;
      } catch (err) {
        return false;
      } finally {
        this._currentDate = current;
        this._hasIterated = hasIterated;
      }
    };
    CronExpression.prototype.iterate = function iterate(steps, callback) {
      var dates = [];
      if (steps >= 0) {
        for (var i = 0, c = steps; i < c; i++) {
          try {
            var item = this.next();
            dates.push(item);
            if (callback) {
              callback(item, i);
            }
          } catch (err) {
            break;
          }
        }
      } else {
        for (var i = 0, c = steps; i > c; i--) {
          try {
            var item = this.prev();
            dates.push(item);
            if (callback) {
              callback(item, i);
            }
          } catch (err) {
            break;
          }
        }
      }
      return dates;
    };
    CronExpression.prototype.reset = function reset(newDate) {
      this._currentDate = new CronDate(newDate || this._options.currentDate);
    };
    CronExpression.prototype.stringify = function stringify(includeSeconds) {
      var resultArr = [];
      for (var i = includeSeconds ? 0 : 1, c = CronExpression.map.length; i < c; ++i) {
        var field = CronExpression.map[i];
        var value = this.fields[field];
        var constraint = CronExpression.constraints[i];
        if (field === "dayOfMonth" && this.fields.month.length === 1) {
          constraint = { min: 1, max: CronExpression.daysInMonth[this.fields.month[0] - 1] };
        } else if (field === "dayOfWeek") {
          constraint = { min: 0, max: 6 };
          value = value[value.length - 1] === 7 ? value.slice(0, -1) : value;
        }
        resultArr.push(stringifyField(value, constraint.min, constraint.max));
      }
      return resultArr.join(" ");
    };
    CronExpression.parse = function parse(expression, options) {
      var self2 = this;
      if (typeof options === "function") {
        options = {};
      }
      function parse2(expression2, options2) {
        if (!options2) {
          options2 = {};
        }
        if (typeof options2.currentDate === "undefined") {
          options2.currentDate = new CronDate(void 0, self2._tz);
        }
        if (CronExpression.predefined[expression2]) {
          expression2 = CronExpression.predefined[expression2];
        }
        var fields = [];
        var atoms = (expression2 + "").trim().split(/\s+/);
        if (atoms.length > 6) {
          throw new Error("Invalid cron expression");
        }
        var start = CronExpression.map.length - atoms.length;
        for (var i = 0, c = CronExpression.map.length; i < c; ++i) {
          var field = CronExpression.map[i];
          var value = atoms[atoms.length > c ? i : i - start];
          if (i < start || !value) {
            fields.push(
              CronExpression._parseField(
                field,
                CronExpression.parseDefaults[i],
                CronExpression.constraints[i]
              )
            );
          } else {
            var val = field === "dayOfWeek" ? parseNthDay(value) : value;
            fields.push(
              CronExpression._parseField(
                field,
                val,
                CronExpression.constraints[i]
              )
            );
          }
        }
        var mappedFields = {};
        for (var i = 0, c = CronExpression.map.length; i < c; i++) {
          var key = CronExpression.map[i];
          mappedFields[key] = fields[i];
        }
        var dayOfMonth = CronExpression._handleMaxDaysInMonth(mappedFields);
        mappedFields.dayOfMonth = dayOfMonth || mappedFields.dayOfMonth;
        return new CronExpression(mappedFields, options2);
        function parseNthDay(val2) {
          var atoms2 = val2.split("#");
          if (atoms2.length > 1) {
            var nthValue = +atoms2[atoms2.length - 1];
            if (/,/.test(val2)) {
              throw new Error("Constraint error, invalid dayOfWeek `#` and `,` special characters are incompatible");
            }
            if (/\//.test(val2)) {
              throw new Error("Constraint error, invalid dayOfWeek `#` and `/` special characters are incompatible");
            }
            if (/-/.test(val2)) {
              throw new Error("Constraint error, invalid dayOfWeek `#` and `-` special characters are incompatible");
            }
            if (atoms2.length > 2 || Number.isNaN(nthValue) || (nthValue < 1 || nthValue > 5)) {
              throw new Error("Constraint error, invalid dayOfWeek occurrence number (#)");
            }
            options2.nthDayOfWeek = nthValue;
            return atoms2[0];
          }
          return val2;
        }
      }
      return parse2(expression, options);
    };
    CronExpression.fieldsToExpression = function fieldsToExpression(fields, options) {
      function validateConstraints(field2, values2, constraints) {
        if (!values2) {
          throw new Error("Validation error, Field " + field2 + " is missing");
        }
        if (values2.length === 0) {
          throw new Error("Validation error, Field " + field2 + " contains no values");
        }
        for (var i2 = 0, c2 = values2.length; i2 < c2; i2++) {
          var value = values2[i2];
          if (CronExpression._isValidConstraintChar(constraints, value)) {
            continue;
          }
          if (typeof value !== "number" || Number.isNaN(value) || value < constraints.min || value > constraints.max) {
            throw new Error(
              "Constraint error, got value " + value + " expected range " + constraints.min + "-" + constraints.max
            );
          }
        }
      }
      var mappedFields = {};
      for (var i = 0, c = CronExpression.map.length; i < c; ++i) {
        var field = CronExpression.map[i];
        var values = fields[field];
        validateConstraints(
          field,
          values,
          CronExpression.constraints[i]
        );
        var copy = [];
        var j = -1;
        while (++j < values.length) {
          copy[j] = values[j];
        }
        values = copy.sort(CronExpression._sortCompareFn).filter(function(item, pos, ary) {
          return !pos || item !== ary[pos - 1];
        });
        if (values.length !== copy.length) {
          throw new Error("Validation error, Field " + field + " contains duplicate values");
        }
        mappedFields[field] = values;
      }
      var dayOfMonth = CronExpression._handleMaxDaysInMonth(mappedFields);
      mappedFields.dayOfMonth = dayOfMonth || mappedFields.dayOfMonth;
      return new CronExpression(mappedFields, options || {});
    };
    module2.exports = CronExpression;
  }
});

// (disabled):fs
var require_fs = __commonJS({
  "(disabled):fs"() {
  }
});

// node_modules/cron-parser/lib/parser.js
var require_parser = __commonJS({
  "node_modules/cron-parser/lib/parser.js"(exports, module2) {
    "use strict";
    var CronExpression = require_expression();
    function CronParser() {
    }
    CronParser._parseEntry = function _parseEntry(entry) {
      var atoms = entry.split(" ");
      if (atoms.length === 6) {
        return {
          interval: CronExpression.parse(entry)
        };
      } else if (atoms.length > 6) {
        return {
          interval: CronExpression.parse(
            atoms.slice(0, 6).join(" ")
          ),
          command: atoms.slice(6, atoms.length)
        };
      } else {
        throw new Error("Invalid entry: " + entry);
      }
    };
    CronParser.parseExpression = function parseExpression(expression, options) {
      return CronExpression.parse(expression, options);
    };
    CronParser.fieldsToExpression = function fieldsToExpression(fields, options) {
      return CronExpression.fieldsToExpression(fields, options);
    };
    CronParser.parseString = function parseString(data) {
      var blocks = data.split("\n");
      var response = {
        variables: {},
        expressions: [],
        errors: {}
      };
      for (var i = 0, c = blocks.length; i < c; i++) {
        var block = blocks[i];
        var matches = null;
        var entry = block.trim();
        if (entry.length > 0) {
          if (entry.match(/^#/)) {
            continue;
          } else if (matches = entry.match(/^(.*)=(.*)$/)) {
            response.variables[matches[1]] = matches[2];
          } else {
            var result = null;
            try {
              result = CronParser._parseEntry("0 " + entry);
              response.expressions.push(result.interval);
            } catch (err) {
              response.errors[entry] = err;
            }
          }
        }
      }
      return response;
    };
    CronParser.parseFile = function parseFile(filePath, callback) {
      require_fs().readFile(filePath, function(err, data) {
        if (err) {
          callback(err);
          return;
        }
        return callback(null, CronParser.parseString(data.toString()));
      });
    };
    module2.exports = CronParser;
  }
});

// src/utils/base64.ts
var u8ToB64 = (u) => btoa(String.fromCharCode(...u));
var b64Tou8 = (b) => Uint8Array.from(atob(b), (c) => c.charCodeAt(0));
var b64ToB64URL = (s) => s.replace(/\+/g, "-").replace(/\//g, "_");
var b64URLtoB64 = (s) => s.replace(/-/g, "+").replace(/_/g, "/");

// node_modules/rfc4648/lib/index.mjs
var import_index = __toESM(require_lib(), 1);
var base16 = import_index.default.base16;
var base32 = import_index.default.base32;
var base32hex = import_index.default.base32hex;
var base64 = import_index.default.base64;
var base64url = import_index.default.base64url;
var codec = import_index.default.codec;

// node_modules/asn1js/build/index.es.js
var pvtsutils = __toESM(require_build());

// node_modules/pvutils/build/utils.es.js
function utilFromBase(inputBuffer, inputBase) {
  let result = 0;
  if (inputBuffer.length === 1) {
    return inputBuffer[0];
  }
  for (let i = inputBuffer.length - 1; i >= 0; i--) {
    result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
  }
  return result;
}
function utilToBase(value, base, reserved = -1) {
  const internalReserved = reserved;
  let internalValue = value;
  let result = 0;
  let biggest = Math.pow(2, base);
  for (let i = 1; i < 8; i++) {
    if (value < biggest) {
      let retBuf;
      if (internalReserved < 0) {
        retBuf = new ArrayBuffer(i);
        result = i;
      } else {
        if (internalReserved < i) {
          return new ArrayBuffer(0);
        }
        retBuf = new ArrayBuffer(internalReserved);
        result = internalReserved;
      }
      const retView = new Uint8Array(retBuf);
      for (let j = i - 1; j >= 0; j--) {
        const basis = Math.pow(2, j * base);
        retView[result - j - 1] = Math.floor(internalValue / basis);
        internalValue -= retView[result - j - 1] * basis;
      }
      return retBuf;
    }
    biggest *= Math.pow(2, base);
  }
  return new ArrayBuffer(0);
}
function utilConcatView(...views) {
  let outputLength = 0;
  let prevLength = 0;
  for (const view of views) {
    outputLength += view.length;
  }
  const retBuf = new ArrayBuffer(outputLength);
  const retView = new Uint8Array(retBuf);
  for (const view of views) {
    retView.set(view, prevLength);
    prevLength += view.length;
  }
  return retView;
}
function utilDecodeTC() {
  const buf = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const condition1 = buf[0] === 255 && buf[1] & 128;
    const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
    if (condition1 || condition2) {
      this.warnings.push("Needlessly long format");
    }
  }
  const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const bigIntView = new Uint8Array(bigIntBuffer);
  for (let i = 0; i < this.valueHex.byteLength; i++) {
    bigIntView[i] = 0;
  }
  bigIntView[0] = buf[0] & 128;
  const bigInt = utilFromBase(bigIntView, 8);
  const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const smallIntView = new Uint8Array(smallIntBuffer);
  for (let j = 0; j < this.valueHex.byteLength; j++) {
    smallIntView[j] = buf[j];
  }
  smallIntView[0] &= 127;
  const smallInt = utilFromBase(smallIntView, 8);
  return smallInt - bigInt;
}
function utilEncodeTC(value) {
  const modValue = value < 0 ? value * -1 : value;
  let bigInt = 128;
  for (let i = 1; i < 8; i++) {
    if (modValue <= bigInt) {
      if (value < 0) {
        const smallInt = bigInt - modValue;
        const retBuf2 = utilToBase(smallInt, 8, i);
        const retView2 = new Uint8Array(retBuf2);
        retView2[0] |= 128;
        return retBuf2;
      }
      let retBuf = utilToBase(modValue, 8, i);
      let retView = new Uint8Array(retBuf);
      if (retView[0] & 128) {
        const tempBuf = retBuf.slice(0);
        const tempView = new Uint8Array(tempBuf);
        retBuf = new ArrayBuffer(retBuf.byteLength + 1);
        retView = new Uint8Array(retBuf);
        for (let k = 0; k < tempBuf.byteLength; k++) {
          retView[k + 1] = tempView[k];
        }
        retView[0] = 0;
      }
      return retBuf;
    }
    bigInt *= Math.pow(2, 8);
  }
  return new ArrayBuffer(0);
}
function isEqualBuffer(inputBuffer1, inputBuffer2) {
  if (inputBuffer1.byteLength !== inputBuffer2.byteLength) {
    return false;
  }
  const view1 = new Uint8Array(inputBuffer1);
  const view2 = new Uint8Array(inputBuffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) {
      return false;
    }
  }
  return true;
}
function padNumber(inputNumber, fullLength) {
  const str = inputNumber.toString(10);
  if (fullLength < str.length) {
    return "";
  }
  const dif = fullLength - str.length;
  const padding = new Array(dif);
  for (let i = 0; i < dif; i++) {
    padding[i] = "0";
  }
  const paddingString = padding.join("");
  return paddingString.concat(str);
}
var log2 = Math.log(2);

// node_modules/asn1js/build/index.es.js
function assertBigInt() {
  if (typeof BigInt === "undefined") {
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
  }
}
function concat(buffers) {
  let outputLength = 0;
  let prevLength = 0;
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    outputLength += buffer.byteLength;
  }
  const retView = new Uint8Array(outputLength);
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    retView.set(new Uint8Array(buffer), prevLength);
    prevLength += buffer.byteLength;
  }
  return retView.buffer;
}
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
  if (!(inputBuffer instanceof Uint8Array)) {
    baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
    return false;
  }
  if (!inputBuffer.byteLength) {
    baseBlock.error = "Wrong parameter: inputBuffer has zero length";
    return false;
  }
  if (inputOffset < 0) {
    baseBlock.error = "Wrong parameter: inputOffset less than zero";
    return false;
  }
  if (inputLength < 0) {
    baseBlock.error = "Wrong parameter: inputLength less than zero";
    return false;
  }
  if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
    baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
    return false;
  }
  return true;
}
var ViewWriter = class {
  constructor() {
    this.items = [];
  }
  write(buf) {
    this.items.push(buf);
  }
  final() {
    return concat(this.items);
  }
};
var powers2 = [new Uint8Array([1])];
var digitsString = "0123456789";
var NAME = "name";
var VALUE_HEX_VIEW = "valueHexView";
var IS_HEX_ONLY = "isHexOnly";
var ID_BLOCK = "idBlock";
var TAG_CLASS = "tagClass";
var TAG_NUMBER = "tagNumber";
var IS_CONSTRUCTED = "isConstructed";
var FROM_BER = "fromBER";
var TO_BER = "toBER";
var LOCAL = "local";
var EMPTY_STRING = "";
var EMPTY_BUFFER = new ArrayBuffer(0);
var EMPTY_VIEW = new Uint8Array(0);
var END_OF_CONTENT_NAME = "EndOfContent";
var OCTET_STRING_NAME = "OCTET STRING";
var BIT_STRING_NAME = "BIT STRING";
function HexBlock(BaseClass) {
  var _a2;
  return _a2 = class Some extends BaseClass {
    constructor(...args) {
      var _a3;
      super(...args);
      const params = args[0] || {};
      this.isHexOnly = (_a3 = params.isHexOnly) !== null && _a3 !== void 0 ? _a3 : false;
      this.valueHexView = params.valueHex ? pvtsutils.BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
    }
    get valueHex() {
      return this.valueHexView.slice().buffer;
    }
    set valueHex(value) {
      this.valueHexView = new Uint8Array(value);
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
      const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
      if (!checkBufferParams(this, view, inputOffset, inputLength)) {
        return -1;
      }
      const endLength = inputOffset + inputLength;
      this.valueHexView = view.subarray(inputOffset, endLength);
      if (!this.valueHexView.length) {
        this.warnings.push("Zero buffer length");
        return inputOffset;
      }
      this.blockLength = inputLength;
      return endLength;
    }
    toBER(sizeOnly = false) {
      if (!this.isHexOnly) {
        this.error = "Flag 'isHexOnly' is not set, abort";
        return EMPTY_BUFFER;
      }
      if (sizeOnly) {
        return new ArrayBuffer(this.valueHexView.byteLength);
      }
      return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer;
    }
    toJSON() {
      return {
        ...super.toJSON(),
        isHexOnly: this.isHexOnly,
        valueHex: pvtsutils.Convert.ToHex(this.valueHexView)
      };
    }
  }, _a2.NAME = "hexBlock", _a2;
}
var LocalBaseBlock = class {
  constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW } = {}) {
    this.blockLength = blockLength;
    this.error = error;
    this.warnings = warnings;
    this.valueBeforeDecodeView = pvtsutils.BufferSourceConverter.toUint8Array(valueBeforeDecode);
  }
  static blockName() {
    return this.NAME;
  }
  get valueBeforeDecode() {
    return this.valueBeforeDecodeView.slice().buffer;
  }
  set valueBeforeDecode(value) {
    this.valueBeforeDecodeView = new Uint8Array(value);
  }
  toJSON() {
    return {
      blockName: this.constructor.NAME,
      blockLength: this.blockLength,
      error: this.error,
      warnings: this.warnings,
      valueBeforeDecode: pvtsutils.Convert.ToHex(this.valueBeforeDecodeView)
    };
  }
};
LocalBaseBlock.NAME = "baseBlock";
var ValueBlock = class extends LocalBaseBlock {
  fromBER(inputBuffer, inputOffset, inputLength) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(sizeOnly, writer) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
};
ValueBlock.NAME = "valueBlock";
var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
  constructor({ idBlock = {} } = {}) {
    var _a2, _b, _c, _d;
    super();
    if (idBlock) {
      this.isHexOnly = (_a2 = idBlock.isHexOnly) !== null && _a2 !== void 0 ? _a2 : false;
      this.valueHexView = idBlock.valueHex ? pvtsutils.BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
      this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
      this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
      this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
    } else {
      this.tagClass = -1;
      this.tagNumber = -1;
      this.isConstructed = false;
    }
  }
  toBER(sizeOnly = false) {
    let firstOctet = 0;
    switch (this.tagClass) {
      case 1:
        firstOctet |= 0;
        break;
      case 2:
        firstOctet |= 64;
        break;
      case 3:
        firstOctet |= 128;
        break;
      case 4:
        firstOctet |= 192;
        break;
      default:
        this.error = "Unknown tag class";
        return EMPTY_BUFFER;
    }
    if (this.isConstructed)
      firstOctet |= 32;
    if (this.tagNumber < 31 && !this.isHexOnly) {
      const retView2 = new Uint8Array(1);
      if (!sizeOnly) {
        let number = this.tagNumber;
        number &= 31;
        firstOctet |= number;
        retView2[0] = firstOctet;
      }
      return retView2.buffer;
    }
    if (!this.isHexOnly) {
      const encodedBuf = utilToBase(this.tagNumber, 7);
      const encodedView = new Uint8Array(encodedBuf);
      const size = encodedBuf.byteLength;
      const retView2 = new Uint8Array(size + 1);
      retView2[0] = firstOctet | 31;
      if (!sizeOnly) {
        for (let i = 0; i < size - 1; i++)
          retView2[i + 1] = encodedView[i] | 128;
        retView2[size] = encodedView[size - 1];
      }
      return retView2.buffer;
    }
    const retView = new Uint8Array(this.valueHexView.byteLength + 1);
    retView[0] = firstOctet | 31;
    if (!sizeOnly) {
      const curView = this.valueHexView;
      for (let i = 0; i < curView.length - 1; i++)
        retView[i + 1] = curView[i] | 128;
      retView[this.valueHexView.byteLength] = curView[curView.length - 1];
    }
    return retView.buffer;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    const tagClassMask = intBuffer[0] & 192;
    switch (tagClassMask) {
      case 0:
        this.tagClass = 1;
        break;
      case 64:
        this.tagClass = 2;
        break;
      case 128:
        this.tagClass = 3;
        break;
      case 192:
        this.tagClass = 4;
        break;
      default:
        this.error = "Unknown tag class";
        return -1;
    }
    this.isConstructed = (intBuffer[0] & 32) === 32;
    this.isHexOnly = false;
    const tagNumberMask = intBuffer[0] & 31;
    if (tagNumberMask !== 31) {
      this.tagNumber = tagNumberMask;
      this.blockLength = 1;
    } else {
      let count = 1;
      let intTagNumberBuffer = this.valueHexView = new Uint8Array(255);
      let tagNumberBufferMaxLength = 255;
      while (intBuffer[count] & 128) {
        intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
        count++;
        if (count >= intBuffer.length) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }
        if (count === tagNumberBufferMaxLength) {
          tagNumberBufferMaxLength += 255;
          const tempBufferView2 = new Uint8Array(tagNumberBufferMaxLength);
          for (let i = 0; i < intTagNumberBuffer.length; i++)
            tempBufferView2[i] = intTagNumberBuffer[i];
          intTagNumberBuffer = this.valueHexView = new Uint8Array(tagNumberBufferMaxLength);
        }
      }
      this.blockLength = count + 1;
      intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
      const tempBufferView = new Uint8Array(count);
      for (let i = 0; i < count; i++)
        tempBufferView[i] = intTagNumberBuffer[i];
      intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
      intTagNumberBuffer.set(tempBufferView);
      if (this.blockLength <= 9)
        this.tagNumber = utilFromBase(intTagNumberBuffer, 7);
      else {
        this.isHexOnly = true;
        this.warnings.push("Tag too long, represented as hex-coded");
      }
    }
    if (this.tagClass === 1 && this.isConstructed) {
      switch (this.tagNumber) {
        case 1:
        case 2:
        case 5:
        case 6:
        case 9:
        case 13:
        case 14:
        case 23:
        case 24:
        case 31:
        case 32:
        case 33:
        case 34:
          this.error = "Constructed encoding used for primitive type";
          return -1;
      }
    }
    return inputOffset + this.blockLength;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      tagClass: this.tagClass,
      tagNumber: this.tagNumber,
      isConstructed: this.isConstructed
    };
  }
};
LocalIdentificationBlock.NAME = "identificationBlock";
var LocalLengthBlock = class extends LocalBaseBlock {
  constructor({ lenBlock = {} } = {}) {
    var _a2, _b, _c;
    super();
    this.isIndefiniteForm = (_a2 = lenBlock.isIndefiniteForm) !== null && _a2 !== void 0 ? _a2 : false;
    this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
    this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const view = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    if (intBuffer[0] === 255) {
      this.error = "Length block 0xFF is reserved by standard";
      return -1;
    }
    this.isIndefiniteForm = intBuffer[0] === 128;
    if (this.isIndefiniteForm) {
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    this.longFormUsed = !!(intBuffer[0] & 128);
    if (this.longFormUsed === false) {
      this.length = intBuffer[0];
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    const count = intBuffer[0] & 127;
    if (count > 8) {
      this.error = "Too big integer";
      return -1;
    }
    if (count + 1 > intBuffer.length) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    const lenOffset = inputOffset + 1;
    const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
    if (lengthBufferView[count - 1] === 0)
      this.warnings.push("Needlessly long encoded length");
    this.length = utilFromBase(lengthBufferView, 8);
    if (this.longFormUsed && this.length <= 127)
      this.warnings.push("Unnecessary usage of long length form");
    this.blockLength = count + 1;
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly = false) {
    let retBuf;
    let retView;
    if (this.length > 127)
      this.longFormUsed = true;
    if (this.isIndefiniteForm) {
      retBuf = new ArrayBuffer(1);
      if (sizeOnly === false) {
        retView = new Uint8Array(retBuf);
        retView[0] = 128;
      }
      return retBuf;
    }
    if (this.longFormUsed) {
      const encodedBuf = utilToBase(this.length, 8);
      if (encodedBuf.byteLength > 127) {
        this.error = "Too big length";
        return EMPTY_BUFFER;
      }
      retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
      if (sizeOnly)
        return retBuf;
      const encodedView = new Uint8Array(encodedBuf);
      retView = new Uint8Array(retBuf);
      retView[0] = encodedBuf.byteLength | 128;
      for (let i = 0; i < encodedBuf.byteLength; i++)
        retView[i + 1] = encodedView[i];
      return retBuf;
    }
    retBuf = new ArrayBuffer(1);
    if (sizeOnly === false) {
      retView = new Uint8Array(retBuf);
      retView[0] = this.length;
    }
    return retBuf;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      longFormUsed: this.longFormUsed,
      length: this.length
    };
  }
};
LocalLengthBlock.NAME = "lengthBlock";
var typeStore = {};
var BaseBlock = class extends LocalBaseBlock {
  constructor({ name = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
    super(parameters);
    this.name = name;
    this.optional = optional;
    if (primitiveSchema) {
      this.primitiveSchema = primitiveSchema;
    }
    this.idBlock = new LocalIdentificationBlock(parameters);
    this.lenBlock = new LocalLengthBlock(parameters);
    this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    if (!writer) {
      prepareIndefiniteForm(this);
    }
    const idBlockBuf = this.idBlock.toBER(sizeOnly);
    _writer.write(idBlockBuf);
    if (this.lenBlock.isIndefiniteForm) {
      _writer.write(new Uint8Array([128]).buffer);
      this.valueBlock.toBER(sizeOnly, _writer);
      _writer.write(new ArrayBuffer(2));
    } else {
      const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
      this.lenBlock.length = valueBlockBuf.byteLength;
      const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
      _writer.write(lenBlockBuf);
      _writer.write(valueBlockBuf);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      idBlock: this.idBlock.toJSON(),
      lenBlock: this.lenBlock.toJSON(),
      valueBlock: this.valueBlock.toJSON(),
      name: this.name,
      optional: this.optional
    };
    if (this.primitiveSchema)
      object.primitiveSchema = this.primitiveSchema.toJSON();
    return object;
  }
  toString(encoding = "ascii") {
    if (encoding === "ascii") {
      return this.onAsciiEncoding();
    }
    return pvtsutils.Convert.ToHex(this.toBER());
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${pvtsutils.Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
  }
  isEqual(other) {
    if (this === other) {
      return true;
    }
    if (!(other instanceof this.constructor)) {
      return false;
    }
    const thisRaw = this.toBER();
    const otherRaw = other.toBER();
    return isEqualBuffer(thisRaw, otherRaw);
  }
};
BaseBlock.NAME = "BaseBlock";
function prepareIndefiniteForm(baseBlock) {
  if (baseBlock instanceof typeStore.Constructed) {
    for (const value of baseBlock.valueBlock.value) {
      if (prepareIndefiniteForm(value)) {
        baseBlock.lenBlock.isIndefiniteForm = true;
      }
    }
  }
  return !!baseBlock.lenBlock.isIndefiniteForm;
}
var BaseStringBlock = class extends BaseBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
    super(parameters, stringValueBlockType);
    if (value) {
      this.fromString(value);
    }
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    this.fromBuffer(this.valueBlock.valueHexView);
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
  }
};
BaseStringBlock.NAME = "BaseStringBlock";
var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ isHexOnly = true, ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = isHexOnly;
  }
};
LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
var _a$w;
var Primitive = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalPrimitiveValueBlock);
    this.idBlock.isConstructed = false;
  }
};
_a$w = Primitive;
(() => {
  typeStore.Primitive = _a$w;
})();
Primitive.NAME = "PRIMITIVE";
function localChangeType(inputObject, newType) {
  if (inputObject instanceof newType) {
    return inputObject;
  }
  const newObject = new newType();
  newObject.idBlock = inputObject.idBlock;
  newObject.lenBlock = inputObject.lenBlock;
  newObject.warnings = inputObject.warnings;
  newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
  return newObject;
}
function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length) {
  const incomingOffset = inputOffset;
  let returnObject = new BaseBlock({}, ValueBlock);
  const baseBlock = new LocalBaseBlock();
  if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
    returnObject.error = baseBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  const intBuffer = inputBuffer.subarray(inputOffset, inputOffset + inputLength);
  if (!intBuffer.length) {
    returnObject.error = "Zero buffer length";
    return {
      offset: -1,
      result: returnObject
    };
  }
  let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.idBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.idBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.idBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.idBlock.blockLength;
  resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.lenBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.lenBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.lenBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.lenBlock.blockLength;
  if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
    returnObject.error = "Indefinite length form used for primitive encoding form";
    return {
      offset: -1,
      result: returnObject
    };
  }
  let newASN1Type = BaseBlock;
  switch (returnObject.idBlock.tagClass) {
    case 1:
      if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
        returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
        return {
          offset: -1,
          result: returnObject
        };
      }
      switch (returnObject.idBlock.tagNumber) {
        case 0:
          if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
            returnObject.error = "Type [UNIVERSAL 0] is reserved";
            return {
              offset: -1,
              result: returnObject
            };
          }
          newASN1Type = typeStore.EndOfContent;
          break;
        case 1:
          newASN1Type = typeStore.Boolean;
          break;
        case 2:
          newASN1Type = typeStore.Integer;
          break;
        case 3:
          newASN1Type = typeStore.BitString;
          break;
        case 4:
          newASN1Type = typeStore.OctetString;
          break;
        case 5:
          newASN1Type = typeStore.Null;
          break;
        case 6:
          newASN1Type = typeStore.ObjectIdentifier;
          break;
        case 10:
          newASN1Type = typeStore.Enumerated;
          break;
        case 12:
          newASN1Type = typeStore.Utf8String;
          break;
        case 13:
          newASN1Type = typeStore.RelativeObjectIdentifier;
          break;
        case 14:
          newASN1Type = typeStore.TIME;
          break;
        case 15:
          returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
          return {
            offset: -1,
            result: returnObject
          };
        case 16:
          newASN1Type = typeStore.Sequence;
          break;
        case 17:
          newASN1Type = typeStore.Set;
          break;
        case 18:
          newASN1Type = typeStore.NumericString;
          break;
        case 19:
          newASN1Type = typeStore.PrintableString;
          break;
        case 20:
          newASN1Type = typeStore.TeletexString;
          break;
        case 21:
          newASN1Type = typeStore.VideotexString;
          break;
        case 22:
          newASN1Type = typeStore.IA5String;
          break;
        case 23:
          newASN1Type = typeStore.UTCTime;
          break;
        case 24:
          newASN1Type = typeStore.GeneralizedTime;
          break;
        case 25:
          newASN1Type = typeStore.GraphicString;
          break;
        case 26:
          newASN1Type = typeStore.VisibleString;
          break;
        case 27:
          newASN1Type = typeStore.GeneralString;
          break;
        case 28:
          newASN1Type = typeStore.UniversalString;
          break;
        case 29:
          newASN1Type = typeStore.CharacterString;
          break;
        case 30:
          newASN1Type = typeStore.BmpString;
          break;
        case 31:
          newASN1Type = typeStore.DATE;
          break;
        case 32:
          newASN1Type = typeStore.TimeOfDay;
          break;
        case 33:
          newASN1Type = typeStore.DateTime;
          break;
        case 34:
          newASN1Type = typeStore.Duration;
          break;
        default: {
          const newObject = returnObject.idBlock.isConstructed ? new typeStore.Constructed() : new typeStore.Primitive();
          newObject.idBlock = returnObject.idBlock;
          newObject.lenBlock = returnObject.lenBlock;
          newObject.warnings = returnObject.warnings;
          returnObject = newObject;
        }
      }
      break;
    case 2:
    case 3:
    case 4:
    default: {
      newASN1Type = returnObject.idBlock.isConstructed ? typeStore.Constructed : typeStore.Primitive;
    }
  }
  returnObject = localChangeType(returnObject, newASN1Type);
  resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length);
  returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
  return {
    offset: resultOffset,
    result: returnObject
  };
}
function fromBER(inputBuffer) {
  if (!inputBuffer.byteLength) {
    const result = new BaseBlock({}, ValueBlock);
    result.error = "Input buffer has zero length";
    return {
      offset: -1,
      result
    };
  }
  return localFromBER(pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength);
}
function checkLen(indefiniteLength, length) {
  if (indefiniteLength) {
    return 1;
  }
  return length;
}
var LocalConstructedValueBlock = class extends ValueBlock {
  constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
    super(parameters);
    this.value = value;
    this.isIndefiniteForm = isIndefiniteForm;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const view = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
    if (this.valueBeforeDecodeView.length === 0) {
      this.warnings.push("Zero buffer length");
      return inputOffset;
    }
    let currentOffset = inputOffset;
    while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
      const returnObject = localFromBER(view, currentOffset, inputLength);
      if (returnObject.offset === -1) {
        this.error = returnObject.result.error;
        this.warnings.concat(returnObject.result.warnings);
        return -1;
      }
      currentOffset = returnObject.offset;
      this.blockLength += returnObject.result.blockLength;
      inputLength -= returnObject.result.blockLength;
      this.value.push(returnObject.result);
      if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) {
        break;
      }
    }
    if (this.isIndefiniteForm) {
      if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) {
        this.value.pop();
      } else {
        this.warnings.push("No EndOfContent block encoded");
      }
    }
    return currentOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    for (let i = 0; i < this.value.length; i++) {
      this.value[i].toBER(sizeOnly, _writer);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      value: []
    };
    for (const value of this.value) {
      object.value.push(value.toJSON());
    }
    return object;
  }
};
LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
var _a$v;
var Constructed = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalConstructedValueBlock);
    this.idBlock.isConstructed = true;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    const values = [];
    for (const value of this.valueBlock.value) {
      values.push(value.toString("ascii").split("\n").map((o) => `  ${o}`).join("\n"));
    }
    const blockName = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
    return values.length ? `${blockName} :
${values.join("\n")}` : `${blockName} :`;
  }
};
_a$v = Constructed;
(() => {
  typeStore.Constructed = _a$v;
})();
Constructed.NAME = "CONSTRUCTED";
var LocalEndOfContentValueBlock = class extends ValueBlock {
  fromBER(inputBuffer, inputOffset, inputLength) {
    return inputOffset;
  }
  toBER(sizeOnly) {
    return EMPTY_BUFFER;
  }
};
LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
var _a$u;
var EndOfContent = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalEndOfContentValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 0;
  }
};
_a$u = EndOfContent;
(() => {
  typeStore.EndOfContent = _a$u;
})();
EndOfContent.NAME = END_OF_CONTENT_NAME;
var _a$t;
var Null = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, ValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 5;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (this.lenBlock.length > 0)
      this.warnings.push("Non-zero length of value block for Null type");
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    this.blockLength += inputLength;
    if (inputOffset + inputLength > inputBuffer.byteLength) {
      this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
      return -1;
    }
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    const retBuf = new ArrayBuffer(2);
    if (!sizeOnly) {
      const retView = new Uint8Array(retBuf);
      retView[0] = 5;
      retView[1] = 0;
    }
    if (writer) {
      writer.write(retBuf);
    }
    return retBuf;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME}`;
  }
};
_a$t = Null;
(() => {
  typeStore.Null = _a$t;
})();
Null.NAME = "NULL";
var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    if (parameters.valueHex) {
      this.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(parameters.valueHex);
    } else {
      this.valueHexView = new Uint8Array(1);
    }
    if (value) {
      this.value = value;
    }
  }
  get value() {
    for (const octet of this.valueHexView) {
      if (octet > 0) {
        return true;
      }
    }
    return false;
  }
  set value(value) {
    this.valueHexView[0] = value ? 255 : 0;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (inputLength > 1)
      this.warnings.push("Boolean value encoded in more then 1 octet");
    this.isHexOnly = true;
    utilDecodeTC.call(this);
    this.blockLength = inputLength;
    return inputOffset + inputLength;
  }
  toBER() {
    return this.valueHexView.slice();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
};
LocalBooleanValueBlock.NAME = "BooleanValueBlock";
var _a$s;
var Boolean2 = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalBooleanValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 1;
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.getValue}`;
  }
};
_a$s = Boolean2;
(() => {
  typeStore.Boolean = _a$s;
})();
Boolean2.NAME = "BOOLEAN";
var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  constructor({ isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.isConstructed = isConstructed;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = 0;
    if (this.isConstructed) {
      this.isHexOnly = false;
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1)
        return resultOffset;
      for (let i = 0; i < this.value.length; i++) {
        const currentBlockName = this.value[i].constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm)
            break;
          else {
            this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== OCTET_STRING_NAME) {
          this.error = "OCTET STRING may consists of OCTET STRINGs only";
          return -1;
        }
      }
    } else {
      this.isHexOnly = true;
      resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
      this.blockLength = inputLength;
    }
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed)
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    return sizeOnly ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isConstructed: this.isConstructed
    };
  }
};
LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
var _a$r;
var OctetString = class _OctetString extends BaseBlock {
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
    super({
      idBlock: {
        isConstructed: parameters.isConstructed,
        ...idBlock
      },
      lenBlock: {
        ...lenBlock,
        isIndefiniteForm: !!parameters.isIndefiniteForm
      },
      ...parameters
    }, LocalOctetStringValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 4;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    if (inputLength === 0) {
      if (this.idBlock.error.length === 0)
        this.blockLength += this.idBlock.blockLength;
      if (this.lenBlock.error.length === 0)
        this.blockLength += this.lenBlock.blockLength;
      return inputOffset;
    }
    if (!this.valueBlock.isConstructed) {
      const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
      const buf = view.subarray(inputOffset, inputOffset + inputLength);
      try {
        if (buf.byteLength) {
          const asn = localFromBER(buf, 0, buf.byteLength);
          if (asn.offset !== -1 && asn.offset === inputLength) {
            this.valueBlock.value = [asn.result];
          }
        }
      } catch (e) {
      }
    }
    return super.fromBER(inputBuffer, inputOffset, inputLength);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    }
    return `${this.constructor.NAME} : ${pvtsutils.Convert.ToHex(this.valueBlock.valueHexView)}`;
  }
  getValue() {
    if (!this.idBlock.isConstructed) {
      return this.valueBlock.valueHexView.slice().buffer;
    }
    const array = [];
    for (const content of this.valueBlock.value) {
      if (content instanceof _OctetString) {
        array.push(content.valueBlock.valueHexView);
      }
    }
    return pvtsutils.BufferSourceConverter.concat(array);
  }
};
_a$r = OctetString;
(() => {
  typeStore.OctetString = _a$r;
})();
OctetString.NAME = OCTET_STRING_NAME;
var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.unusedBits = unusedBits;
    this.isConstructed = isConstructed;
    this.blockLength = this.valueHexView.byteLength;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (!inputLength) {
      return inputOffset;
    }
    let resultOffset = -1;
    if (this.isConstructed) {
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1)
        return resultOffset;
      for (const value of this.value) {
        const currentBlockName = value.constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm)
            break;
          else {
            this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== BIT_STRING_NAME) {
          this.error = "BIT STRING may consists of BIT STRINGs only";
          return -1;
        }
        const valueBlock = value.valueBlock;
        if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
          this.error = 'Using of "unused bits" inside constructive BIT STRING allowed for least one only';
          return -1;
        }
        this.unusedBits = valueBlock.unusedBits;
      }
      return resultOffset;
    }
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.unusedBits = intBuffer[0];
    if (this.unusedBits > 7) {
      this.error = "Unused bits for BitString must be in range 0-7";
      return -1;
    }
    if (!this.unusedBits) {
      const buf = intBuffer.subarray(1);
      try {
        if (buf.byteLength) {
          const asn = localFromBER(buf, 0, buf.byteLength);
          if (asn.offset !== -1 && asn.offset === inputLength - 1) {
            this.value = [asn.result];
          }
        }
      } catch (e) {
      }
    }
    this.valueHexView = intBuffer.subarray(1);
    this.blockLength = intBuffer.length;
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed) {
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    }
    if (sizeOnly) {
      return new ArrayBuffer(this.valueHexView.byteLength + 1);
    }
    if (!this.valueHexView.byteLength) {
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(this.valueHexView.length + 1);
    retView[0] = this.unusedBits;
    retView.set(this.valueHexView, 1);
    return retView.buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      unusedBits: this.unusedBits,
      isConstructed: this.isConstructed
    };
  }
};
LocalBitStringValueBlock.NAME = "BitStringValueBlock";
var _a$q;
var BitString = class extends BaseBlock {
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
    super({
      idBlock: {
        isConstructed: parameters.isConstructed,
        ...idBlock
      },
      lenBlock: {
        ...lenBlock,
        isIndefiniteForm: !!parameters.isIndefiniteForm
      },
      ...parameters
    }, LocalBitStringValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 3;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    return super.fromBER(inputBuffer, inputOffset, inputLength);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    } else {
      const bits = [];
      const valueHex = this.valueBlock.valueHexView;
      for (const byte of valueHex) {
        bits.push(byte.toString(2).padStart(8, "0"));
      }
      const bitsStr = bits.join("");
      return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
    }
  }
};
_a$q = BitString;
(() => {
  typeStore.BitString = _a$q;
})();
BitString.NAME = BIT_STRING_NAME;
var _a$p;
function viewAdd(first, second) {
  const c = new Uint8Array([0]);
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
  let firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value = 0;
  const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
  let counter = 0;
  for (let i = max; i >= 0; i--, counter++) {
    switch (true) {
      case counter < secondViewCopy.length:
        value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
        break;
      default:
        value = firstViewCopy[firstViewCopyLength - counter] + c[0];
    }
    c[0] = value / 10;
    switch (true) {
      case counter >= firstViewCopy.length:
        firstViewCopy = utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
        break;
      default:
        firstViewCopy[firstViewCopyLength - counter] = value % 10;
    }
  }
  if (c[0] > 0)
    firstViewCopy = utilConcatView(c, firstViewCopy);
  return firstViewCopy;
}
function power2(n) {
  if (n >= powers2.length) {
    for (let p = powers2.length; p <= n; p++) {
      const c = new Uint8Array([0]);
      let digits = powers2[p - 1].slice(0);
      for (let i = digits.length - 1; i >= 0; i--) {
        const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
        c[0] = newValue[0] / 10;
        digits[i] = newValue[0] % 10;
      }
      if (c[0] > 0)
        digits = utilConcatView(c, digits);
      powers2.push(digits);
    }
  }
  return powers2[n];
}
function viewSub(first, second) {
  let b = 0;
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
  const firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value;
  let counter = 0;
  for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
    value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
    switch (true) {
      case value < 0:
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
        break;
      default:
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
    }
  }
  if (b > 0) {
    for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
      value = firstViewCopy[firstViewCopyLength - counter] - b;
      if (value < 0) {
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
      } else {
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
        break;
      }
    }
  }
  return firstViewCopy.slice();
}
var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    this._valueDec = 0;
    if (parameters.valueHex) {
      this.setValueHex();
    }
    if (value !== void 0) {
      this.valueDec = value;
    }
  }
  setValueHex() {
    if (this.valueHexView.length >= 4) {
      this.warnings.push("Too big Integer for decoding, hex only");
      this.isHexOnly = true;
      this._valueDec = 0;
    } else {
      this.isHexOnly = false;
      if (this.valueHexView.length > 0) {
        this._valueDec = utilDecodeTC.call(this);
      }
    }
  }
  set valueDec(v) {
    this._valueDec = v;
    this.isHexOnly = false;
    this.valueHexView = new Uint8Array(utilEncodeTC(v));
  }
  get valueDec() {
    return this._valueDec;
  }
  fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
    const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
    if (offset === -1)
      return offset;
    const view = this.valueHexView;
    if (view[0] === 0 && (view[1] & 128) !== 0) {
      this.valueHexView = view.subarray(1);
    } else {
      if (expectedLength !== 0) {
        if (view.length < expectedLength) {
          if (expectedLength - view.length > 1)
            expectedLength = view.length + 1;
          this.valueHexView = view.subarray(expectedLength - view.length);
        }
      }
    }
    return offset;
  }
  toDER(sizeOnly = false) {
    const view = this.valueHexView;
    switch (true) {
      case (view[0] & 128) !== 0:
        {
          const updatedView = new Uint8Array(this.valueHexView.length + 1);
          updatedView[0] = 0;
          updatedView.set(view, 1);
          this.valueHexView = updatedView;
        }
        break;
      case (view[0] === 0 && (view[1] & 128) === 0):
        {
          this.valueHexView = this.valueHexView.subarray(1);
        }
        break;
    }
    return this.toBER(sizeOnly);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
    if (resultOffset === -1) {
      return resultOffset;
    }
    this.setValueHex();
    return resultOffset;
  }
  toBER(sizeOnly) {
    return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
  toString() {
    const firstBit = this.valueHexView.length * 8 - 1;
    let digits = new Uint8Array(this.valueHexView.length * 8 / 3);
    let bitNumber = 0;
    let currentByte;
    const asn1View = this.valueHexView;
    let result = "";
    let flag = false;
    for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
      currentByte = asn1View[byteNumber];
      for (let i = 0; i < 8; i++) {
        if ((currentByte & 1) === 1) {
          switch (bitNumber) {
            case firstBit:
              digits = viewSub(power2(bitNumber), digits);
              result = "-";
              break;
            default:
              digits = viewAdd(digits, power2(bitNumber));
          }
        }
        bitNumber++;
        currentByte >>= 1;
      }
    }
    for (let i = 0; i < digits.length; i++) {
      if (digits[i])
        flag = true;
      if (flag)
        result += digitsString.charAt(digits[i]);
    }
    if (flag === false)
      result += digitsString.charAt(0);
    return result;
  }
};
_a$p = LocalIntegerValueBlock;
LocalIntegerValueBlock.NAME = "IntegerValueBlock";
(() => {
  Object.defineProperty(_a$p.prototype, "valueHex", {
    set: function(v) {
      this.valueHexView = new Uint8Array(v);
      this.setValueHex();
    },
    get: function() {
      return this.valueHexView.slice().buffer;
    }
  });
})();
var _a$o;
var Integer = class _Integer extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalIntegerValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    assertBigInt();
    return BigInt(this.valueBlock.toString());
  }
  static fromBigInt(value) {
    assertBigInt();
    const bigIntValue = BigInt(value);
    const writer = new ViewWriter();
    const hex = bigIntValue.toString(16).replace(/^-/, "");
    const view = new Uint8Array(pvtsutils.Convert.FromHex(hex));
    if (bigIntValue < 0) {
      const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
      first[0] |= 128;
      const firstInt = BigInt(`0x${pvtsutils.Convert.ToHex(first)}`);
      const secondInt = firstInt + bigIntValue;
      const second = pvtsutils.BufferSourceConverter.toUint8Array(pvtsutils.Convert.FromHex(secondInt.toString(16)));
      second[0] |= 128;
      writer.write(second);
    } else {
      if (view[0] & 128) {
        writer.write(new Uint8Array([0]));
      }
      writer.write(view);
    }
    const res = new _Integer({
      valueHex: writer.final()
    });
    return res;
  }
  convertToDER() {
    const integer = new _Integer({ valueHex: this.valueBlock.valueHexView });
    integer.valueBlock.toDER();
    return integer;
  }
  convertFromDER() {
    return new _Integer({
      valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView
    });
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
  }
};
_a$o = Integer;
(() => {
  typeStore.Integer = _a$o;
})();
Integer.NAME = "INTEGER";
var _a$n;
var Enumerated = class extends Integer {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 10;
  }
};
_a$n = Enumerated;
(() => {
  typeStore.Enumerated = _a$n;
})();
Enumerated.NAME = "ENUMERATED";
var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
    this.isFirstSid = isFirstSid;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (!inputLength) {
      return inputOffset;
    }
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0)
        break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++) {
      tempView[i] = this.valueHexView[i];
    }
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0)
      this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8)
      this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  set valueBigInt(value) {
    assertBigInt();
    let bits = BigInt(value).toString(2);
    while (bits.length % 7) {
      bits = "0" + bits;
    }
    const bytes = new Uint8Array(bits.length / 7);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes.length ? 128 : 0);
    }
    this.fromBER(bytes.buffer, 0, bytes.length);
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++)
        retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++)
        retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView;
  }
  toString() {
    let result = "";
    if (this.isHexOnly)
      result = pvtsutils.Convert.ToHex(this.valueHexView);
    else {
      if (this.isFirstSid) {
        let sidValue = this.valueDec;
        if (this.valueDec <= 39)
          result = "0.";
        else {
          if (this.valueDec <= 79) {
            result = "1.";
            sidValue -= 40;
          } else {
            result = "2.";
            sidValue -= 80;
          }
        }
        result += sidValue.toString();
      } else
        result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec,
      isFirstSid: this.isFirstSid
    };
  }
};
LocalSidValueBlock.NAME = "sidBlock";
var LocalObjectIdentifierValueBlock = class extends ValueBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      if (this.value.length === 0)
        sidBlock.isFirstSid = true;
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    let flag = false;
    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string.substring(pos1);
      else
        sid = string.substring(pos1, pos2);
      pos1 = pos2 + 1;
      if (flag) {
        const sidBlock = this.value[0];
        let plus = 0;
        switch (sidBlock.valueDec) {
          case 0:
            break;
          case 1:
            plus = 40;
            break;
          case 2:
            plus = 80;
            break;
          default:
            this.value = [];
            return;
        }
        const parsedSID = parseInt(sid, 10);
        if (isNaN(parsedSID))
          return;
        sidBlock.valueDec = parsedSID + plus;
        flag = false;
      } else {
        const sidBlock = new LocalSidValueBlock();
        if (sid > Number.MAX_SAFE_INTEGER) {
          assertBigInt();
          const sidValue = BigInt(sid);
          sidBlock.valueBigInt = sidValue;
        } else {
          sidBlock.valueDec = parseInt(sid, 10);
          if (isNaN(sidBlock.valueDec))
            return;
        }
        if (!this.value.length) {
          sidBlock.isFirstSid = true;
          flag = true;
        }
        this.value.push(sidBlock);
      }
    } while (pos2 !== -1);
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0)
        result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        if (this.value[i].isFirstSid)
          result = `2.{${sidStr} - 80}`;
        else
          result += sidStr;
      } else
        result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let i = 0; i < this.value.length; i++) {
      object.sidArray.push(this.value[i].toJSON());
    }
    return object;
  }
};
LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
var _a$m;
var ObjectIdentifier = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 6;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
};
_a$m = ObjectIdentifier;
(() => {
  typeStore.ObjectIdentifier = _a$m;
})();
ObjectIdentifier.NAME = "OBJECT IDENTIFIER";
var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
  constructor({ valueDec = 0, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (inputLength === 0)
      return inputOffset;
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength))
      return -1;
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0)
        break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++)
      tempView[i] = this.valueHexView[i];
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0)
      this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8)
      this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++)
        retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++)
        retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView.buffer;
  }
  toString() {
    let result = "";
    if (this.isHexOnly)
      result = pvtsutils.Convert.ToHex(this.valueHexView);
    else {
      result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
};
LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalRelativeSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string.substring(pos1);
      else
        sid = string.substring(pos1, pos2);
      pos1 = pos2 + 1;
      const sidBlock = new LocalRelativeSidValueBlock();
      sidBlock.valueDec = parseInt(sid, 10);
      if (isNaN(sidBlock.valueDec))
        return true;
      this.value.push(sidBlock);
    } while (pos2 !== -1);
    return true;
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0)
        result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        result += sidStr;
      } else
        result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let i = 0; i < this.value.length; i++)
      object.sidArray.push(this.value[i].toJSON());
    return object;
  }
};
LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
var _a$l;
var RelativeObjectIdentifier = class extends BaseBlock {
  constructor(parameters = {}) {
    super(parameters, LocalRelativeObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 13;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
};
_a$l = RelativeObjectIdentifier;
(() => {
  typeStore.RelativeObjectIdentifier = _a$l;
})();
RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
var _a$k;
var Sequence = class extends Constructed {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 16;
  }
};
_a$k = Sequence;
(() => {
  typeStore.Sequence = _a$k;
})();
Sequence.NAME = "SEQUENCE";
var _a$j;
var Set2 = class extends Constructed {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 17;
  }
};
_a$j = Set2;
(() => {
  typeStore.Set = _a$j;
})();
Set2.NAME = "SET";
var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = true;
    this.value = EMPTY_STRING;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
};
LocalStringValueBlock.NAME = "StringValueBlock";
var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {
};
LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
var LocalSimpleStringBlock = class extends BaseStringBlock {
  constructor({ ...parameters } = {}) {
    super(parameters, LocalSimpleStringValueBlock);
  }
  fromBuffer(inputBuffer) {
    this.valueBlock.value = String.fromCharCode.apply(null, pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer));
  }
  fromString(inputString) {
    const strLen = inputString.length;
    const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
    for (let i = 0; i < strLen; i++)
      view[i] = inputString.charCodeAt(i);
    this.valueBlock.value = inputString;
  }
};
LocalSimpleStringBlock.NAME = "SIMPLE STRING";
var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    this.valueBlock.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    try {
      this.valueBlock.value = pvtsutils.Convert.ToUtf8String(inputBuffer);
    } catch (ex) {
      this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
      this.valueBlock.value = pvtsutils.Convert.ToBinary(inputBuffer);
    }
  }
  fromString(inputString) {
    this.valueBlock.valueHexView = new Uint8Array(pvtsutils.Convert.FromUtf8String(inputString));
    this.valueBlock.value = inputString;
  }
};
LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
var _a$i;
var Utf8String = class extends LocalUtf8StringValueBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 12;
  }
};
_a$i = Utf8String;
(() => {
  typeStore.Utf8String = _a$i;
})();
Utf8String.NAME = "UTF8String";
var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    this.valueBlock.value = pvtsutils.Convert.ToUtf16String(inputBuffer);
    this.valueBlock.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
  }
  fromString(inputString) {
    this.valueBlock.value = inputString;
    this.valueBlock.valueHexView = new Uint8Array(pvtsutils.Convert.FromUtf16String(inputString));
  }
};
LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
var _a$h;
var BmpString = class extends LocalBmpStringValueBlock {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 30;
  }
};
_a$h = BmpString;
(() => {
  typeStore.BmpString = _a$h;
})();
BmpString.NAME = "BMPString";
var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
  fromBuffer(inputBuffer) {
    const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
    const valueView = new Uint8Array(copyBuffer);
    for (let i = 0; i < valueView.length; i += 4) {
      valueView[i] = valueView[i + 3];
      valueView[i + 1] = valueView[i + 2];
      valueView[i + 2] = 0;
      valueView[i + 3] = 0;
    }
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
  }
  fromString(inputString) {
    const strLength = inputString.length;
    const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
    for (let i = 0; i < strLength; i++) {
      const codeBuf = utilToBase(inputString.charCodeAt(i), 8);
      const codeView = new Uint8Array(codeBuf);
      if (codeView.length > 4)
        continue;
      const dif = 4 - codeView.length;
      for (let j = codeView.length - 1; j >= 0; j--)
        valueHexView[i * 4 + j + dif] = codeView[j];
    }
    this.valueBlock.value = inputString;
  }
};
LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
var _a$g;
var UniversalString = class extends LocalUniversalStringValueBlock {
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 28;
  }
};
_a$g = UniversalString;
(() => {
  typeStore.UniversalString = _a$g;
})();
UniversalString.NAME = "UniversalString";
var _a$f;
var NumericString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 18;
  }
};
_a$f = NumericString;
(() => {
  typeStore.NumericString = _a$f;
})();
NumericString.NAME = "NumericString";
var _a$e;
var PrintableString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 19;
  }
};
_a$e = PrintableString;
(() => {
  typeStore.PrintableString = _a$e;
})();
PrintableString.NAME = "PrintableString";
var _a$d;
var TeletexString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 20;
  }
};
_a$d = TeletexString;
(() => {
  typeStore.TeletexString = _a$d;
})();
TeletexString.NAME = "TeletexString";
var _a$c;
var VideotexString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 21;
  }
};
_a$c = VideotexString;
(() => {
  typeStore.VideotexString = _a$c;
})();
VideotexString.NAME = "VideotexString";
var _a$b;
var IA5String = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 22;
  }
};
_a$b = IA5String;
(() => {
  typeStore.IA5String = _a$b;
})();
IA5String.NAME = "IA5String";
var _a$a;
var GraphicString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 25;
  }
};
_a$a = GraphicString;
(() => {
  typeStore.GraphicString = _a$a;
})();
GraphicString.NAME = "GraphicString";
var _a$9;
var VisibleString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 26;
  }
};
_a$9 = VisibleString;
(() => {
  typeStore.VisibleString = _a$9;
})();
VisibleString.NAME = "VisibleString";
var _a$8;
var GeneralString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 27;
  }
};
_a$8 = GeneralString;
(() => {
  typeStore.GeneralString = _a$8;
})();
GeneralString.NAME = "GeneralString";
var _a$7;
var CharacterString = class extends LocalSimpleStringBlock {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 29;
  }
};
_a$7 = CharacterString;
(() => {
  typeStore.CharacterString = _a$7;
})();
CharacterString.NAME = "CharacterString";
var _a$6;
var UTCTime = class extends VisibleString {
  constructor({ value, valueDate, ...parameters } = {}) {
    super(parameters);
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    if (value) {
      this.fromString(value);
      this.valueBlock.valueHexView = new Uint8Array(value.length);
      for (let i = 0; i < value.length; i++)
        this.valueBlock.valueHexView[i] = value.charCodeAt(i);
    }
    if (valueDate) {
      this.fromDate(valueDate);
      this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
    }
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 23;
  }
  fromBuffer(inputBuffer) {
    this.fromString(String.fromCharCode.apply(null, pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer)));
  }
  toBuffer() {
    const str = this.toString();
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++)
      view[i] = str.charCodeAt(i);
    return buffer;
  }
  fromDate(inputDate) {
    this.year = inputDate.getUTCFullYear();
    this.month = inputDate.getUTCMonth() + 1;
    this.day = inputDate.getUTCDate();
    this.hour = inputDate.getUTCHours();
    this.minute = inputDate.getUTCMinutes();
    this.second = inputDate.getUTCSeconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
  }
  fromString(inputString) {
    const parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
    const parserArray = parser.exec(inputString);
    if (parserArray === null) {
      this.error = "Wrong input string for conversion";
      return;
    }
    const year = parseInt(parserArray[1], 10);
    if (year >= 50)
      this.year = 1900 + year;
    else
      this.year = 2e3 + year;
    this.month = parseInt(parserArray[2], 10);
    this.day = parseInt(parserArray[3], 10);
    this.hour = parseInt(parserArray[4], 10);
    this.minute = parseInt(parserArray[5], 10);
    this.second = parseInt(parserArray[6], 10);
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = new Array(7);
      outputArray[0] = padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
      outputArray[1] = padNumber(this.month, 2);
      outputArray[2] = padNumber(this.day, 2);
      outputArray[3] = padNumber(this.hour, 2);
      outputArray[4] = padNumber(this.minute, 2);
      outputArray[5] = padNumber(this.second, 2);
      outputArray[6] = "Z";
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second
    };
  }
};
_a$6 = UTCTime;
(() => {
  typeStore.UTCTime = _a$6;
})();
UTCTime.NAME = "UTCTime";
var _a$5;
var GeneralizedTime = class extends UTCTime {
  constructor(parameters = {}) {
    var _b;
    super(parameters);
    (_b = this.millisecond) !== null && _b !== void 0 ? _b : this.millisecond = 0;
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 24;
  }
  fromDate(inputDate) {
    super.fromDate(inputDate);
    this.millisecond = inputDate.getUTCMilliseconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
  }
  fromString(inputString) {
    let isUTC = false;
    let timeString = "";
    let dateTimeString = "";
    let fractionPart = 0;
    let parser;
    let hourDifference = 0;
    let minuteDifference = 0;
    if (inputString[inputString.length - 1] === "Z") {
      timeString = inputString.substring(0, inputString.length - 1);
      isUTC = true;
    } else {
      const number = new Number(inputString[inputString.length - 1]);
      if (isNaN(number.valueOf()))
        throw new Error("Wrong input string for conversion");
      timeString = inputString;
    }
    if (isUTC) {
      if (timeString.indexOf("+") !== -1)
        throw new Error("Wrong input string for conversion");
      if (timeString.indexOf("-") !== -1)
        throw new Error("Wrong input string for conversion");
    } else {
      let multiplier = 1;
      let differencePosition = timeString.indexOf("+");
      let differenceString = "";
      if (differencePosition === -1) {
        differencePosition = timeString.indexOf("-");
        multiplier = -1;
      }
      if (differencePosition !== -1) {
        differenceString = timeString.substring(differencePosition + 1);
        timeString = timeString.substring(0, differencePosition);
        if (differenceString.length !== 2 && differenceString.length !== 4)
          throw new Error("Wrong input string for conversion");
        let number = parseInt(differenceString.substring(0, 2), 10);
        if (isNaN(number.valueOf()))
          throw new Error("Wrong input string for conversion");
        hourDifference = multiplier * number;
        if (differenceString.length === 4) {
          number = parseInt(differenceString.substring(2, 4), 10);
          if (isNaN(number.valueOf()))
            throw new Error("Wrong input string for conversion");
          minuteDifference = multiplier * number;
        }
      }
    }
    let fractionPointPosition = timeString.indexOf(".");
    if (fractionPointPosition === -1)
      fractionPointPosition = timeString.indexOf(",");
    if (fractionPointPosition !== -1) {
      const fractionPartCheck = new Number(`0${timeString.substring(fractionPointPosition)}`);
      if (isNaN(fractionPartCheck.valueOf()))
        throw new Error("Wrong input string for conversion");
      fractionPart = fractionPartCheck.valueOf();
      dateTimeString = timeString.substring(0, fractionPointPosition);
    } else
      dateTimeString = timeString;
    switch (true) {
      case dateTimeString.length === 8:
        parser = /(\d{4})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1)
          throw new Error("Wrong input string for conversion");
        break;
      case dateTimeString.length === 10:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.minute = Math.floor(fractionResult);
          fractionResult = 60 * (fractionResult - this.minute);
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 12:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 14:
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          const fractionResult = 1e3 * fractionPart;
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      default:
        throw new Error("Wrong input string for conversion");
    }
    const parserArray = parser.exec(dateTimeString);
    if (parserArray === null)
      throw new Error("Wrong input string for conversion");
    for (let j = 1; j < parserArray.length; j++) {
      switch (j) {
        case 1:
          this.year = parseInt(parserArray[j], 10);
          break;
        case 2:
          this.month = parseInt(parserArray[j], 10);
          break;
        case 3:
          this.day = parseInt(parserArray[j], 10);
          break;
        case 4:
          this.hour = parseInt(parserArray[j], 10) + hourDifference;
          break;
        case 5:
          this.minute = parseInt(parserArray[j], 10) + minuteDifference;
          break;
        case 6:
          this.second = parseInt(parserArray[j], 10);
          break;
        default:
          throw new Error("Wrong input string for conversion");
      }
    }
    if (isUTC === false) {
      const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
      this.year = tempDate.getUTCFullYear();
      this.month = tempDate.getUTCMonth();
      this.day = tempDate.getUTCDay();
      this.hour = tempDate.getUTCHours();
      this.minute = tempDate.getUTCMinutes();
      this.second = tempDate.getUTCSeconds();
      this.millisecond = tempDate.getUTCMilliseconds();
    }
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = [];
      outputArray.push(padNumber(this.year, 4));
      outputArray.push(padNumber(this.month, 2));
      outputArray.push(padNumber(this.day, 2));
      outputArray.push(padNumber(this.hour, 2));
      outputArray.push(padNumber(this.minute, 2));
      outputArray.push(padNumber(this.second, 2));
      if (this.millisecond !== 0) {
        outputArray.push(".");
        outputArray.push(padNumber(this.millisecond, 3));
      }
      outputArray.push("Z");
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  toJSON() {
    return {
      ...super.toJSON(),
      millisecond: this.millisecond
    };
  }
};
_a$5 = GeneralizedTime;
(() => {
  typeStore.GeneralizedTime = _a$5;
})();
GeneralizedTime.NAME = "GeneralizedTime";
var _a$4;
var DATE = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 31;
  }
};
_a$4 = DATE;
(() => {
  typeStore.DATE = _a$4;
})();
DATE.NAME = "DATE";
var _a$3;
var TimeOfDay = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 32;
  }
};
_a$3 = TimeOfDay;
(() => {
  typeStore.TimeOfDay = _a$3;
})();
TimeOfDay.NAME = "TimeOfDay";
var _a$2;
var DateTime = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 33;
  }
};
_a$2 = DateTime;
(() => {
  typeStore.DateTime = _a$2;
})();
DateTime.NAME = "DateTime";
var _a$1;
var Duration = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 34;
  }
};
_a$1 = Duration;
(() => {
  typeStore.Duration = _a$1;
})();
Duration.NAME = "Duration";
var _a;
var TIME = class extends Utf8String {
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 14;
  }
};
_a = TIME;
(() => {
  typeStore.TIME = _a;
})();
TIME.NAME = "TIME";
var Any = class {
  constructor({ name = EMPTY_STRING, optional = false } = {}) {
    this.name = name;
    this.optional = optional;
  }
};
var Choice = class extends Any {
  constructor({ value = [], ...parameters } = {}) {
    super(parameters);
    this.value = value;
  }
};
var Repeated = class extends Any {
  constructor({ value = new Any(), local = false, ...parameters } = {}) {
    super(parameters);
    this.value = value;
    this.local = local;
  }
};
function compareSchema(root, inputData, inputSchema) {
  if (inputSchema instanceof Choice) {
    for (let j = 0; j < inputSchema.value.length; j++) {
      const result = compareSchema(root, inputData, inputSchema.value[j]);
      if (result.verified) {
        return {
          verified: true,
          result: root
        };
      }
    }
    {
      const _result = {
        verified: false,
        result: {
          error: "Wrong values for Choice type"
        }
      };
      if (inputSchema.hasOwnProperty(NAME))
        _result.name = inputSchema.name;
      return _result;
    }
  }
  if (inputSchema instanceof Any) {
    if (inputSchema.hasOwnProperty(NAME))
      root[inputSchema.name] = inputData;
    return {
      verified: true,
      result: root
    };
  }
  if (root instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong root object" }
    };
  }
  if (inputData instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 data" }
    };
  }
  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (ID_BLOCK in inputSchema === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (FROM_BER in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (TO_BER in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  const encodedId = inputSchema.idBlock.toBER(false);
  if (encodedId.byteLength === 0) {
    return {
      verified: false,
      result: { error: "Error encoding idBlock for ASN.1 schema" }
    };
  }
  const decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);
  if (decodedOffset === -1) {
    return {
      verified: false,
      result: { error: "Error decoding idBlock for ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(TAG_CLASS) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) {
    return {
      verified: false,
      result: root
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(TAG_NUMBER) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) {
    return {
      verified: false,
      result: root
    };
  }
  if (inputSchema.idBlock.hasOwnProperty(IS_CONSTRUCTED) === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) {
    return {
      verified: false,
      result: root
    };
  }
  if (!(IS_HEX_ONLY in inputSchema.idBlock)) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema" }
    };
  }
  if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) {
    return {
      verified: false,
      result: root
    };
  }
  if (inputSchema.idBlock.isHexOnly) {
    if (VALUE_HEX_VIEW in inputSchema.idBlock === false) {
      return {
        verified: false,
        result: { error: "Wrong ASN.1 schema" }
      };
    }
    const schemaView = inputSchema.idBlock.valueHexView;
    const asn1View = inputData.idBlock.valueHexView;
    if (schemaView.length !== asn1View.length) {
      return {
        verified: false,
        result: root
      };
    }
    for (let i = 0; i < schemaView.length; i++) {
      if (schemaView[i] !== asn1View[1]) {
        return {
          verified: false,
          result: root
        };
      }
    }
  }
  if (inputSchema.name) {
    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
    if (inputSchema.name)
      root[inputSchema.name] = inputData;
  }
  if (inputSchema instanceof typeStore.Constructed) {
    let admission = 0;
    let result = {
      verified: false,
      result: {
        error: "Unknown error"
      }
    };
    let maxLength = inputSchema.valueBlock.value.length;
    if (maxLength > 0) {
      if (inputSchema.valueBlock.value[0] instanceof Repeated) {
        maxLength = inputData.valueBlock.value.length;
      }
    }
    if (maxLength === 0) {
      return {
        verified: true,
        result: root
      };
    }
    if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
      let _optional = true;
      for (let i = 0; i < inputSchema.valueBlock.value.length; i++)
        _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);
      if (_optional) {
        return {
          verified: true,
          result: root
        };
      }
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name)
          delete root[inputSchema.name];
      }
      root.error = "Inconsistent object length";
      return {
        verified: false,
        result: root
      };
    }
    for (let i = 0; i < maxLength; i++) {
      if (i - admission >= inputData.valueBlock.value.length) {
        if (inputSchema.valueBlock.value[i].optional === false) {
          const _result = {
            verified: false,
            result: root
          };
          root.error = "Inconsistent length between ASN.1 data and schema";
          if (inputSchema.name) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
            if (inputSchema.name) {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          }
          return _result;
        }
      } else {
        if (inputSchema.valueBlock.value[0] instanceof Repeated) {
          result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);
          if (result.verified === false) {
            if (inputSchema.valueBlock.value[0].optional)
              admission++;
            else {
              if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name)
                  delete root[inputSchema.name];
              }
              return result;
            }
          }
          if (NAME in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
            let arrayRoot = {};
            if (LOCAL in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local)
              arrayRoot = inputData;
            else
              arrayRoot = root;
            if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined")
              arrayRoot[inputSchema.valueBlock.value[0].name] = [];
            arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
          }
        } else {
          result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);
          if (result.verified === false) {
            if (inputSchema.valueBlock.value[i].optional)
              admission++;
            else {
              if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name)
                  delete root[inputSchema.name];
              }
              return result;
            }
          }
        }
      }
    }
    if (result.verified === false) {
      const _result = {
        verified: false,
        result: root
      };
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name) {
          delete root[inputSchema.name];
          _result.name = inputSchema.name;
        }
      }
      return _result;
    }
    return {
      verified: true,
      result: root
    };
  }
  if (inputSchema.primitiveSchema && VALUE_HEX_VIEW in inputData.valueBlock) {
    const asn1 = localFromBER(inputData.valueBlock.valueHexView);
    if (asn1.offset === -1) {
      const _result = {
        verified: false,
        result: asn1.result
      };
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name) {
          delete root[inputSchema.name];
          _result.name = inputSchema.name;
        }
      }
      return _result;
    }
    return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
  }
  return {
    verified: true,
    result: root
  };
}
function verifySchema(inputBuffer, inputSchema) {
  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: { error: "Wrong ASN.1 schema type" }
    };
  }
  const asn1 = localFromBER(pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer));
  if (asn1.offset === -1) {
    return {
      verified: false,
      result: asn1.result
    };
  }
  return compareSchema(asn1.result, asn1.result, inputSchema);
}

// node_modules/@cloudflare/privacypass-ts/lib/src/util.js
function convertRSASSAPSSToEnc(keyRSAPSSEncSpki) {
  const RSAEncryptionAlgID = "1.2.840.113549.1.1.1";
  const schema = new Sequence({
    value: [
      new Sequence({ name: "algorithm" }),
      new BitString({ name: "subjectPublicKey" })
    ]
  });
  const cmp = verifySchema(keyRSAPSSEncSpki, schema);
  if (cmp.verified != true) {
    throw new Error("bad parsing");
  }
  const keyASN = new Sequence({
    value: [
      new Sequence({
        value: [
          new ObjectIdentifier({ value: RSAEncryptionAlgID }),
          new Null()
        ]
      }),
      cmp.result.subjectPublicKey
    ]
  });
  return new Uint8Array(keyASN.toBER());
}
function algorithm() {
  const RSAPSSAlgID = "1.2.840.113549.1.1.10";
  const publicKeyParams = new Sequence({
    value: [
      new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 0
          // [0]
        },
        value: [
          new Sequence({
            value: [
              new ObjectIdentifier({ value: "2.16.840.1.101.3.4.2.2" })
              // sha-384
            ]
          })
        ]
      }),
      new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 1
          // [1]
        },
        value: [
          new Sequence({
            value: [
              new ObjectIdentifier({ value: "1.2.840.113549.1.1.8" }),
              new Sequence({
                value: [
                  new ObjectIdentifier({
                    value: "2.16.840.1.101.3.4.2.2"
                  })
                  // sha-384
                ]
              })
            ]
          })
        ]
      }),
      new Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: 2
          // [2]
        },
        value: [
          new Integer({ value: 48 })
          // sLen = 48
        ]
      })
    ]
  });
  return new Sequence({
    value: [new ObjectIdentifier({ value: RSAPSSAlgID }), publicKeyParams]
  });
}
function convertEncToRSASSAPSS(keyEncRSAPSSSpki) {
  const algorithmID = algorithm();
  const s2 = fromBER(keyEncRSAPSSSpki).result;
  const spki = s2.valueBlock.value[1];
  const asn = new Sequence({
    value: [algorithmID, spki]
  });
  return new Uint8Array(asn.toBER());
}
function joinAll(a) {
  let size = 0;
  for (const ai of a) {
    size += ai.byteLength;
  }
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);
  let offset = 0;
  for (const ai of a) {
    view.set(new Uint8Array(ai), offset);
    offset += ai.byteLength;
  }
  return buffer;
}

// node_modules/@cloudflare/privacypass-ts/lib/src/auth_scheme/private_token.js
var AuthenticatorInput = class _AuthenticatorInput {
  tokenType;
  nonce;
  challengeDigest;
  tokenKeyId;
  // This class represents the following structure:
  // See https://datatracker.ietf.org/doc/html/draft-ietf-privacypass-auth-scheme-14#name-token-verification
  //
  // struct {
  //     uint16_t token_type;
  //     uint8_t nonce[32];
  //     uint8_t challenge_digest[32];
  //     uint8_t token_key_id[Nid];
  // } AuthenticatorInput;
  static NONCE_LENGTH = 32;
  static CHALLENGE_LENGTH = 32;
  constructor(tokenTypeEntry, tokenType, nonce, challengeDigest, tokenKeyId) {
    this.tokenType = tokenType;
    this.nonce = nonce;
    this.challengeDigest = challengeDigest;
    this.tokenKeyId = tokenKeyId;
    if (tokenType !== tokenTypeEntry.value) {
      throw new Error("mismatch of token type");
    }
    if (nonce.length !== _AuthenticatorInput.NONCE_LENGTH) {
      throw new Error("invalid nonce size");
    }
    if (challengeDigest.length !== _AuthenticatorInput.CHALLENGE_LENGTH) {
      throw new Error("invalid challenge size");
    }
    if (tokenKeyId.length !== tokenTypeEntry.Nid) {
      throw new Error("invalid tokenKeyId size");
    }
    this.tokenType = tokenTypeEntry.value;
  }
  static deserialize(tokenTypeEntry, bytes, ops) {
    let offset = 0;
    const input = new DataView(bytes.buffer);
    const type = input.getUint16(offset);
    offset += 2;
    let len = _AuthenticatorInput.NONCE_LENGTH;
    const nonce = new Uint8Array(input.buffer.slice(offset, offset + len));
    offset += len;
    len = _AuthenticatorInput.CHALLENGE_LENGTH;
    const challengeDigest = new Uint8Array(input.buffer.slice(offset, offset + len));
    offset += len;
    len = tokenTypeEntry.Nid;
    const tokenKeyId = new Uint8Array(input.buffer.slice(offset, offset + len));
    offset += len;
    ops.bytesRead = offset;
    return new _AuthenticatorInput(tokenTypeEntry, type, nonce, challengeDigest, tokenKeyId);
  }
  serialize() {
    const output = new Array();
    let b = new ArrayBuffer(2);
    new DataView(b).setUint16(0, this.tokenType);
    output.push(b);
    b = this.nonce.buffer;
    output.push(b);
    b = this.challengeDigest.buffer;
    output.push(b);
    b = this.tokenKeyId.buffer;
    output.push(b);
    return new Uint8Array(joinAll(output));
  }
};
var Token = class _Token {
  authInput;
  authenticator;
  // This class represents the following structure:
  // See https://datatracker.ietf.org/doc/html/draft-ietf-privacypass-auth-scheme-14#name-token-structure
  //
  // struct {
  //     uint16_t token_type;
  //     uint8_t nonce[32];
  //     uint8_t challenge_digest[32];
  //     uint8_t token_key_id[Nid];
  //     uint8_t authenticator[Nk];
  // } Token;
  constructor(tokenTypeEntry, authInput, authenticator) {
    this.authInput = authInput;
    this.authenticator = authenticator;
    if (authenticator.length !== tokenTypeEntry.Nk) {
      throw new Error("invalid authenticator size");
    }
  }
  static deserialize(tokenTypeEntry, bytes) {
    let offset = 0;
    const input = new DataView(bytes.buffer);
    const ops = { bytesRead: 0 };
    const payload = AuthenticatorInput.deserialize(tokenTypeEntry, bytes, ops);
    offset += ops.bytesRead;
    const len = tokenTypeEntry.Nk;
    const authenticator = new Uint8Array(input.buffer.slice(offset, offset + len));
    offset += len;
    return new _Token(tokenTypeEntry, payload, authenticator);
  }
  serialize() {
    return new Uint8Array(joinAll([this.authInput.serialize().buffer, this.authenticator.buffer]));
  }
};

// node_modules/@cloudflare/privacypass-ts/lib/src/pub_verif_token.js
var pub_verif_token_exports = {};
__export(pub_verif_token_exports, {
  BLIND_RSA: () => BLIND_RSA,
  BlindRSAMode: () => BlindRSAMode,
  Client: () => Client,
  Issuer: () => Issuer,
  TokenRequest: () => TokenRequest,
  TokenResponse: () => TokenResponse,
  getPublicKeyBytes: () => getPublicKeyBytes,
  keyGen: () => keyGen,
  verifyToken: () => verifyToken
});

// node_modules/@cloudflare/blindrsa-ts/lib/src/sjcl/index.js
var sjcl = {
  /**
   * Symmetric ciphers.
   * @namespace
   */
  cipher: {},
  /**
   * Hash functions.  Right now only SHA256 is implemented.
   * @namespace
   */
  hash: {},
  /**
   * Key exchange functions.  Right now only SRP is implemented.
   * @namespace
   */
  keyexchange: {},
  /**
   * Cipher modes of operation.
   * @namespace
   */
  mode: {},
  /**
   * Miscellaneous.  HMAC and PBKDF2.
   * @namespace
   */
  misc: {},
  /**
   * Bit array encoders and decoders.
   * @namespace
   *
   * @description
   * The members of this namespace are functions which translate between
   * SJCL's bitArrays and other objects (usually strings).  Because it
   * isn't always clear which direction is encoding and which is decoding,
   * the method names are "fromBits" and "toBits".
   */
  codec: {},
  /**
   * Exceptions.
   * @namespace
   */
  exception: {
    /**
     * Ciphertext is corrupt.
     * @constructor
     */
    corrupt: function(message) {
      this.toString = function() {
        return "CORRUPT: " + this.message;
      };
      this.message = message;
    },
    /**
     * Invalid parameter.
     * @constructor
     */
    invalid: function(message) {
      this.toString = function() {
        return "INVALID: " + this.message;
      };
      this.message = message;
    },
    /**
     * Bug or missing feature in SJCL.
     * @constructor
     */
    bug: function(message) {
      this.toString = function() {
        return "BUG: " + this.message;
      };
      this.message = message;
    },
    /**
     * Something isn't ready.
     * @constructor
     */
    notReady: function(message) {
      this.toString = function() {
        return "NOT READY: " + this.message;
      };
      this.message = message;
    }
  }
};
sjcl.cipher.aes = function(key) {
  if (!this._tables[0][0][0]) {
    this._precompute();
  }
  var i, j, tmp, encKey, decKey, sbox = this._tables[0][4], decTable = this._tables[1], keyLen = key.length, rcon = 1;
  if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
    throw new sjcl.exception.invalid("invalid aes key size");
  }
  this._key = [encKey = key.slice(0), decKey = []];
  for (i = keyLen; i < 4 * keyLen + 28; i++) {
    tmp = encKey[i - 1];
    if (i % keyLen === 0 || keyLen === 8 && i % keyLen === 4) {
      tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];
      if (i % keyLen === 0) {
        tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
        rcon = rcon << 1 ^ (rcon >> 7) * 283;
      }
    }
    encKey[i] = encKey[i - keyLen] ^ tmp;
  }
  for (j = 0; i; j++, i--) {
    tmp = encKey[j & 3 ? i : i - 4];
    if (i <= 4 || j < 4) {
      decKey[j] = tmp;
    } else {
      decKey[j] = decTable[0][sbox[tmp >>> 24]] ^ decTable[1][sbox[tmp >> 16 & 255]] ^ decTable[2][sbox[tmp >> 8 & 255]] ^ decTable[3][sbox[tmp & 255]];
    }
  }
};
sjcl.cipher.aes.prototype = {
  // public
  /* Something like this might appear here eventually
  name: "AES",
  blockSize: 4,
  keySizes: [4,6,8],
  */
  /**
   * Encrypt an array of 4 big-endian words.
   * @param {Array} data The plaintext.
   * @return {Array} The ciphertext.
   */
  encrypt: function(data) {
    return this._crypt(data, 0);
  },
  /**
   * Decrypt an array of 4 big-endian words.
   * @param {Array} data The ciphertext.
   * @return {Array} The plaintext.
   */
  decrypt: function(data) {
    return this._crypt(data, 1);
  },
  /**
   * The expanded S-box and inverse S-box tables.  These will be computed
   * on the client so that we don't have to send them down the wire.
   *
   * There are two tables, _tables[0] is for encryption and
   * _tables[1] is for decryption.
   *
   * The first 4 sub-tables are the expanded S-box with MixColumns.  The
   * last (_tables[01][4]) is the S-box itself.
   *
   * @private
   */
  _tables: [[[], [], [], [], []], [[], [], [], [], []]],
  /**
   * Expand the S-box tables.
   *
   * @private
   */
  _precompute: function() {
    var encTable = this._tables[0], decTable = this._tables[1], sbox = encTable[4], sboxInv = decTable[4], i, x, xInv, d = [], th = [], x2, x4, x8, s, tEnc, tDec;
    for (i = 0; i < 256; i++) {
      th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
    }
    for (x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
      s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
      s = s >> 8 ^ s & 255 ^ 99;
      sbox[x] = s;
      sboxInv[s] = x;
      x8 = d[x4 = d[x2 = d[x]]];
      tDec = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
      tEnc = d[s] * 257 ^ s * 16843008;
      for (i = 0; i < 4; i++) {
        encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
        decTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;
      }
    }
    for (i = 0; i < 5; i++) {
      encTable[i] = encTable[i].slice(0);
      decTable[i] = decTable[i].slice(0);
    }
  },
  /**
   * Encryption and decryption core.
   * @param {Array} input Four words to be encrypted or decrypted.
   * @param dir The direction, 0 for encrypt and 1 for decrypt.
   * @return {Array} The four encrypted or decrypted words.
   * @private
   */
  _crypt: function(input, dir) {
    if (input.length !== 4) {
      throw new sjcl.exception.invalid("invalid aes block size");
    }
    var key = this._key[dir], a = input[0] ^ key[0], b = input[dir ? 3 : 1] ^ key[1], c = input[2] ^ key[2], d = input[dir ? 1 : 3] ^ key[3], a2, b2, c2, nInnerRounds = key.length / 4 - 2, i, kIndex = 4, out = [0, 0, 0, 0], table = this._tables[dir], t0 = table[0], t1 = table[1], t2 = table[2], t3 = table[3], sbox = table[4];
    for (i = 0; i < nInnerRounds; i++) {
      a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
      b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
      c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
      d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
      kIndex += 4;
      a = a2;
      b = b2;
      c = c2;
    }
    for (i = 0; i < 4; i++) {
      out[dir ? 3 & -i : i] = sbox[a >>> 24] << 24 ^ sbox[b >> 16 & 255] << 16 ^ sbox[c >> 8 & 255] << 8 ^ sbox[d & 255] ^ key[kIndex++];
      a2 = a;
      a = b;
      b = c;
      c = d;
      d = a2;
    }
    return out;
  }
};
sjcl.bitArray = {
  /**
   * Array slices in units of bits.
   * @param {bitArray} a The array to slice.
   * @param {Number} bstart The offset to the start of the slice, in bits.
   * @param {Number} bend The offset to the end of the slice, in bits.  If this is undefined,
   * slice until the end of the array.
   * @return {bitArray} The requested slice.
   */
  bitSlice: function(a, bstart, bend) {
    a = sjcl.bitArray._shiftRight(a.slice(bstart / 32), 32 - (bstart & 31)).slice(1);
    return bend === void 0 ? a : sjcl.bitArray.clamp(a, bend - bstart);
  },
  /**
   * Extract a number packed into a bit array.
   * @param {bitArray} a The array to slice.
   * @param {Number} bstart The offset to the start of the slice, in bits.
   * @param {Number} blength The length of the number to extract.
   * @return {Number} The requested slice.
   */
  extract: function(a, bstart, blength) {
    var x, sh = Math.floor(-bstart - blength & 31);
    if ((bstart + blength - 1 ^ bstart) & -32) {
      x = a[bstart / 32 | 0] << 32 - sh ^ a[bstart / 32 + 1 | 0] >>> sh;
    } else {
      x = a[bstart / 32 | 0] >>> sh;
    }
    return x & (1 << blength) - 1;
  },
  /**
   * Concatenate two bit arrays.
   * @param {bitArray} a1 The first array.
   * @param {bitArray} a2 The second array.
   * @return {bitArray} The concatenation of a1 and a2.
   */
  concat: function(a1, a2) {
    if (a1.length === 0 || a2.length === 0) {
      return a1.concat(a2);
    }
    var last = a1[a1.length - 1], shift = sjcl.bitArray.getPartial(last);
    if (shift === 32) {
      return a1.concat(a2);
    } else {
      return sjcl.bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
    }
  },
  /**
   * Find the length of an array of bits.
   * @param {bitArray} a The array.
   * @return {Number} The length of a, in bits.
   */
  bitLength: function(a) {
    var l = a.length, x;
    if (l === 0) {
      return 0;
    }
    x = a[l - 1];
    return (l - 1) * 32 + sjcl.bitArray.getPartial(x);
  },
  /**
   * Truncate an array.
   * @param {bitArray} a The array.
   * @param {Number} len The length to truncate to, in bits.
   * @return {bitArray} A new array, truncated to len bits.
   */
  clamp: function(a, len) {
    if (a.length * 32 < len) {
      return a;
    }
    a = a.slice(0, Math.ceil(len / 32));
    var l = a.length;
    len = len & 31;
    if (l > 0 && len) {
      a[l - 1] = sjcl.bitArray.partial(len, a[l - 1] & 2147483648 >> len - 1, 1);
    }
    return a;
  },
  /**
   * Make a partial word for a bit array.
   * @param {Number} len The number of bits in the word.
   * @param {Number} x The bits.
   * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
   * @return {Number} The partial word.
   */
  partial: function(len, x, _end) {
    if (len === 32) {
      return x;
    }
    return (_end ? x | 0 : x << 32 - len) + len * 1099511627776;
  },
  /**
   * Get the number of bits used by a partial word.
   * @param {Number} x The partial word.
   * @return {Number} The number of bits used by the partial word.
   */
  getPartial: function(x) {
    return Math.round(x / 1099511627776) || 32;
  },
  /**
   * Compare two arrays for equality in a predictable amount of time.
   * @param {bitArray} a The first array.
   * @param {bitArray} b The second array.
   * @return {boolean} true if a == b; false otherwise.
   */
  equal: function(a, b) {
    if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) {
      return false;
    }
    var x = 0, i;
    for (i = 0; i < a.length; i++) {
      x |= a[i] ^ b[i];
    }
    return x === 0;
  },
  /** Shift an array right.
   * @param {bitArray} a The array to shift.
   * @param {Number} shift The number of bits to shift.
   * @param {Number} [carry=0] A byte to carry in
   * @param {bitArray} [out=[]] An array to prepend to the output.
   * @private
   */
  _shiftRight: function(a, shift, carry, out) {
    var i, last2 = 0, shift2;
    if (out === void 0) {
      out = [];
    }
    for (; shift >= 32; shift -= 32) {
      out.push(carry);
      carry = 0;
    }
    if (shift === 0) {
      return out.concat(a);
    }
    for (i = 0; i < a.length; i++) {
      out.push(carry | a[i] >>> shift);
      carry = a[i] << 32 - shift;
    }
    last2 = a.length ? a[a.length - 1] : 0;
    shift2 = sjcl.bitArray.getPartial(last2);
    out.push(sjcl.bitArray.partial(shift + shift2 & 31, shift + shift2 > 32 ? carry : out.pop(), 1));
    return out;
  },
  /** xor a block of 4 words together.
   * @private
   */
  _xor4: function(x, y) {
    return [x[0] ^ y[0], x[1] ^ y[1], x[2] ^ y[2], x[3] ^ y[3]];
  },
  /** byteswap a word array inplace.
   * (does not handle partial words)
   * @param {sjcl.bitArray} a word array
   * @return {sjcl.bitArray} byteswapped array
   */
  byteswapM: function(a) {
    var i, v, m = 65280;
    for (i = 0; i < a.length; ++i) {
      v = a[i];
      a[i] = v >>> 24 | v >>> 8 & m | (v & m) << 8 | v << 24;
    }
    return a;
  }
};
sjcl.codec.utf8String = {
  /** Convert from a bitArray to a UTF-8 string. */
  fromBits: function(arr) {
    var out = "", bl = sjcl.bitArray.bitLength(arr), i, tmp;
    for (i = 0; i < bl / 8; i++) {
      if ((i & 3) === 0) {
        tmp = arr[i / 4];
      }
      out += String.fromCharCode(tmp >>> 8 >>> 8 >>> 8);
      tmp <<= 8;
    }
    return decodeURIComponent(escape(out));
  },
  /** Convert from a UTF-8 string to a bitArray. */
  toBits: function(str) {
    str = unescape(encodeURIComponent(str));
    var out = [], i, tmp = 0;
    for (i = 0; i < str.length; i++) {
      tmp = tmp << 8 | str.charCodeAt(i);
      if ((i & 3) === 3) {
        out.push(tmp);
        tmp = 0;
      }
    }
    if (i & 3) {
      out.push(sjcl.bitArray.partial(8 * (i & 3), tmp));
    }
    return out;
  }
};
sjcl.codec.hex = {
  /** Convert from a bitArray to a hex string. */
  fromBits: function(arr) {
    var out = "", i;
    for (i = 0; i < arr.length; i++) {
      out += ((arr[i] | 0) + 263882790666240).toString(16).substr(4);
    }
    return out.substr(0, sjcl.bitArray.bitLength(arr) / 4);
  },
  /** Convert from a hex string to a bitArray. */
  toBits: function(str) {
    var i, out = [], len;
    str = str.replace(/\s|0x/g, "");
    len = str.length;
    str = str + "00000000";
    for (i = 0; i < str.length; i += 8) {
      out.push(parseInt(str.substr(i, 8), 16) ^ 0);
    }
    return sjcl.bitArray.clamp(out, len * 4);
  }
};
sjcl.codec.base64 = {
  /** The base64 alphabet.
   * @private
   */
  _chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  /** Convert from a bitArray to a base64 string. */
  fromBits: function(arr, _noEquals, _url) {
    var out = "", i, bits = 0, c = sjcl.codec.base64._chars, ta = 0, bl = sjcl.bitArray.bitLength(arr);
    if (_url) {
      c = c.substr(0, 62) + "-_";
    }
    for (i = 0; out.length * 6 < bl; ) {
      out += c.charAt((ta ^ arr[i] >>> bits) >>> 26);
      if (bits < 6) {
        ta = arr[i] << 6 - bits;
        bits += 26;
        i++;
      } else {
        ta <<= 6;
        bits -= 6;
      }
    }
    while (out.length & 3 && !_noEquals) {
      out += "=";
    }
    return out;
  },
  /** Convert from a base64 string to a bitArray */
  toBits: function(str, _url) {
    str = str.replace(/\s|=/g, "");
    var out = [], i, bits = 0, c = sjcl.codec.base64._chars, ta = 0, x;
    if (_url) {
      c = c.substr(0, 62) + "-_";
    }
    for (i = 0; i < str.length; i++) {
      x = c.indexOf(str.charAt(i));
      if (x < 0) {
        throw new sjcl.exception.invalid("this isn't base64!");
      }
      if (bits > 26) {
        bits -= 26;
        out.push(ta ^ x >>> bits);
        ta = x << 32 - bits;
      } else {
        bits += 6;
        ta ^= x << 32 - bits;
      }
    }
    if (bits & 56) {
      out.push(sjcl.bitArray.partial(bits & 56, ta, 1));
    }
    return out;
  }
};
sjcl.codec.base64url = {
  fromBits: function(arr) {
    return sjcl.codec.base64.fromBits(arr, 1, 1);
  },
  toBits: function(str) {
    return sjcl.codec.base64.toBits(str, 1);
  }
};
sjcl.codec.bytes = {
  /** Convert from a bitArray to an array of bytes. */
  fromBits: function(arr) {
    var out = [], bl = sjcl.bitArray.bitLength(arr), i, tmp;
    for (i = 0; i < bl / 8; i++) {
      if ((i & 3) === 0) {
        tmp = arr[i / 4];
      }
      out.push(tmp >>> 24);
      tmp <<= 8;
    }
    return out;
  },
  /** Convert from an array of bytes to a bitArray. */
  toBits: function(bytes) {
    var out = [], i, tmp = 0;
    for (i = 0; i < bytes.length; i++) {
      tmp = tmp << 8 | bytes[i];
      if ((i & 3) === 3) {
        out.push(tmp);
        tmp = 0;
      }
    }
    if (i & 3) {
      out.push(sjcl.bitArray.partial(8 * (i & 3), tmp));
    }
    return out;
  }
};
sjcl.hash.sha256 = function(hash) {
  if (!this._key[0]) {
    this._precompute();
  }
  if (hash) {
    this._h = hash._h.slice(0);
    this._buffer = hash._buffer.slice(0);
    this._length = hash._length;
  } else {
    this.reset();
  }
};
sjcl.hash.sha256.hash = function(data) {
  return new sjcl.hash.sha256().update(data).finalize();
};
sjcl.hash.sha256.prototype = {
  /**
   * The hash's block size, in bits.
   * @constant
   */
  blockSize: 512,
  /**
   * Reset the hash state.
   * @return this
   */
  reset: function() {
    this._h = this._init.slice(0);
    this._buffer = [];
    this._length = 0;
    return this;
  },
  /**
   * Input several words to the hash.
   * @param {bitArray|String} data the data to hash.
   * @return this
   */
  update: function(data) {
    if (typeof data === "string") {
      data = sjcl.codec.utf8String.toBits(data);
    }
    var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data), ol = this._length, nl = this._length = ol + sjcl.bitArray.bitLength(data);
    if (nl > 9007199254740991) {
      throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");
    }
    if (typeof Uint32Array !== "undefined") {
      var c = new Uint32Array(b);
      var j = 0;
      for (i = 512 + ol - (512 + ol & 511); i <= nl; i += 512) {
        this._block(c.subarray(16 * j, 16 * (j + 1)));
        j += 1;
      }
      b.splice(0, 16 * j);
    } else {
      for (i = 512 + ol - (512 + ol & 511); i <= nl; i += 512) {
        this._block(b.splice(0, 16));
      }
    }
    return this;
  },
  /**
   * Complete hashing and output the hash value.
   * @return {bitArray} The hash value, an array of 8 big-endian words.
   */
  finalize: function() {
    var i, b = this._buffer, h = this._h;
    b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
    for (i = b.length + 2; i & 15; i++) {
      b.push(0);
    }
    b.push(Math.floor(this._length / 4294967296));
    b.push(this._length | 0);
    while (b.length) {
      this._block(b.splice(0, 16));
    }
    this.reset();
    return h;
  },
  /**
   * The SHA-256 initialization vector, to be precomputed.
   * @private
   */
  _init: [],
  /*
  _init:[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],
  */
  /**
   * The SHA-256 hash key, to be precomputed.
   * @private
   */
  _key: [],
  /*
  _key:
    [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
     0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
     0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
     0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
     0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
     0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
     0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
     0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
  */
  /**
   * Function to precompute _init and _key.
   * @private
   */
  _precompute: function() {
    var i = 0, prime = 2, factor, isPrime;
    function frac(x) {
      return (x - Math.floor(x)) * 4294967296 | 0;
    }
    for (; i < 64; prime++) {
      isPrime = true;
      for (factor = 2; factor * factor <= prime; factor++) {
        if (prime % factor === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) {
        if (i < 8) {
          this._init[i] = frac(Math.pow(prime, 1 / 2));
        }
        this._key[i] = frac(Math.pow(prime, 1 / 3));
        i++;
      }
    }
  },
  /**
   * Perform one cycle of SHA-256.
   * @param {Uint32Array|bitArray} w one block of words.
   * @private
   */
  _block: function(w) {
    var i, tmp, a, b, h = this._h, k = this._key, h0 = h[0], h1 = h[1], h2 = h[2], h3 = h[3], h4 = h[4], h5 = h[5], h6 = h[6], h7 = h[7];
    for (i = 0; i < 64; i++) {
      if (i < 16) {
        tmp = w[i];
      } else {
        a = w[i + 1 & 15];
        b = w[i + 14 & 15];
        tmp = w[i & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i & 15] + w[i + 9 & 15] | 0;
      }
      tmp = tmp + h7 + (h4 >>> 6 ^ h4 >>> 11 ^ h4 >>> 25 ^ h4 << 26 ^ h4 << 21 ^ h4 << 7) + (h6 ^ h4 & (h5 ^ h6)) + k[i];
      h7 = h6;
      h6 = h5;
      h5 = h4;
      h4 = h3 + tmp | 0;
      h3 = h2;
      h2 = h1;
      h1 = h0;
      h0 = tmp + (h1 & h2 ^ h3 & (h1 ^ h2)) + (h1 >>> 2 ^ h1 >>> 13 ^ h1 >>> 22 ^ h1 << 30 ^ h1 << 19 ^ h1 << 10) | 0;
    }
    h[0] = h[0] + h0 | 0;
    h[1] = h[1] + h1 | 0;
    h[2] = h[2] + h2 | 0;
    h[3] = h[3] + h3 | 0;
    h[4] = h[4] + h4 | 0;
    h[5] = h[5] + h5 | 0;
    h[6] = h[6] + h6 | 0;
    h[7] = h[7] + h7 | 0;
  }
};
sjcl.mode.ccm = {
  /** The name of the mode.
   * @constant
   */
  name: "ccm",
  _progressListeners: [],
  listenProgress: function(cb) {
    sjcl.mode.ccm._progressListeners.push(cb);
  },
  unListenProgress: function(cb) {
    var index = sjcl.mode.ccm._progressListeners.indexOf(cb);
    if (index > -1) {
      sjcl.mode.ccm._progressListeners.splice(index, 1);
    }
  },
  _callProgressListener: function(val) {
    var p = sjcl.mode.ccm._progressListeners.slice(), i;
    for (i = 0; i < p.length; i += 1) {
      p[i](val);
    }
  },
  /** Encrypt in CCM mode.
   * @static
   * @param {Object} prf The pseudorandom function.  It must have a block size of 16 bytes.
   * @param {bitArray} plaintext The plaintext data.
   * @param {bitArray} iv The initialization value.
   * @param {bitArray} [adata=[]] The authenticated data.
   * @param {Number} [tlen=64] the desired tag length, in bits.
   * @return {bitArray} The encrypted data, an array of bytes.
   */
  encrypt: function(prf, plaintext, iv, adata, tlen) {
    var L, out = plaintext.slice(0), tag, w = sjcl.bitArray, ivl = w.bitLength(iv) / 8, ol = w.bitLength(out) / 8;
    tlen = tlen || 64;
    adata = adata || [];
    if (ivl < 7) {
      throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
    }
    for (L = 2; L < 4 && ol >>> 8 * L; L++) {
    }
    if (L < 15 - ivl) {
      L = 15 - ivl;
    }
    iv = w.clamp(iv, 8 * (15 - L));
    tag = sjcl.mode.ccm._computeTag(prf, plaintext, iv, adata, tlen, L);
    out = sjcl.mode.ccm._ctrMode(prf, out, iv, tag, tlen, L);
    return w.concat(out.data, out.tag);
  },
  /** Decrypt in CCM mode.
   * @static
   * @param {Object} prf The pseudorandom function.  It must have a block size of 16 bytes.
   * @param {bitArray} ciphertext The ciphertext data.
   * @param {bitArray} iv The initialization value.
   * @param {bitArray} [adata=[]] adata The authenticated data.
   * @param {Number} [tlen=64] tlen the desired tag length, in bits.
   * @return {bitArray} The decrypted data.
   */
  decrypt: function(prf, ciphertext, iv, adata, tlen) {
    tlen = tlen || 64;
    adata = adata || [];
    var L, w = sjcl.bitArray, ivl = w.bitLength(iv) / 8, ol = w.bitLength(ciphertext), out = w.clamp(ciphertext, ol - tlen), tag = w.bitSlice(ciphertext, ol - tlen), tag2;
    ol = (ol - tlen) / 8;
    if (ivl < 7) {
      throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
    }
    for (L = 2; L < 4 && ol >>> 8 * L; L++) {
    }
    if (L < 15 - ivl) {
      L = 15 - ivl;
    }
    iv = w.clamp(iv, 8 * (15 - L));
    out = sjcl.mode.ccm._ctrMode(prf, out, iv, tag, tlen, L);
    tag2 = sjcl.mode.ccm._computeTag(prf, out.data, iv, adata, tlen, L);
    if (!w.equal(out.tag, tag2)) {
      throw new sjcl.exception.corrupt("ccm: tag doesn't match");
    }
    return out.data;
  },
  _macAdditionalData: function(prf, adata, iv, tlen, ol, L) {
    var mac, tmp, i, macData = [], w = sjcl.bitArray, xor2 = w._xor4;
    mac = [w.partial(8, (adata.length ? 1 << 6 : 0) | tlen - 2 << 2 | L - 1)];
    mac = w.concat(mac, iv);
    mac[3] |= ol;
    mac = prf.encrypt(mac);
    if (adata.length) {
      tmp = w.bitLength(adata) / 8;
      if (tmp <= 65279) {
        macData = [w.partial(16, tmp)];
      } else if (tmp <= 4294967295) {
        macData = w.concat([w.partial(16, 65534)], [tmp]);
      }
      macData = w.concat(macData, adata);
      for (i = 0; i < macData.length; i += 4) {
        mac = prf.encrypt(xor2(mac, macData.slice(i, i + 4).concat([0, 0, 0])));
      }
    }
    return mac;
  },
  /* Compute the (unencrypted) authentication tag, according to the CCM specification
   * @param {Object} prf The pseudorandom function.
   * @param {bitArray} plaintext The plaintext data.
   * @param {bitArray} iv The initialization value.
   * @param {bitArray} adata The authenticated data.
   * @param {Number} tlen the desired tag length, in bits.
   * @return {bitArray} The tag, but not yet encrypted.
   * @private
   */
  _computeTag: function(prf, plaintext, iv, adata, tlen, L) {
    var mac, i, w = sjcl.bitArray, xor2 = w._xor4;
    tlen /= 8;
    if (tlen % 2 || tlen < 4 || tlen > 16) {
      throw new sjcl.exception.invalid("ccm: invalid tag length");
    }
    if (adata.length > 4294967295 || plaintext.length > 4294967295) {
      throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
    }
    mac = sjcl.mode.ccm._macAdditionalData(prf, adata, iv, tlen, w.bitLength(plaintext) / 8, L);
    for (i = 0; i < plaintext.length; i += 4) {
      mac = prf.encrypt(xor2(mac, plaintext.slice(i, i + 4).concat([0, 0, 0])));
    }
    return w.clamp(mac, tlen * 8);
  },
  /** CCM CTR mode.
   * Encrypt or decrypt data and tag with the prf in CCM-style CTR mode.
   * May mutate its arguments.
   * @param {Object} prf The PRF.
   * @param {bitArray} data The data to be encrypted or decrypted.
   * @param {bitArray} iv The initialization vector.
   * @param {bitArray} tag The authentication tag.
   * @param {Number} tlen The length of th etag, in bits.
   * @param {Number} L The CCM L value.
   * @return {Object} An object with data and tag, the en/decryption of data and tag values.
   * @private
   */
  _ctrMode: function(prf, data, iv, tag, tlen, L) {
    var enc, i, w = sjcl.bitArray, xor2 = w._xor4, ctr, l = data.length, bl = w.bitLength(data), n = l / 50, p = n;
    ctr = w.concat([w.partial(8, L - 1)], iv).concat([0, 0, 0]).slice(0, 4);
    tag = w.bitSlice(xor2(tag, prf.encrypt(ctr)), 0, tlen);
    if (!l) {
      return { tag, data: [] };
    }
    for (i = 0; i < l; i += 4) {
      if (i > n) {
        sjcl.mode.ccm._callProgressListener(i / l);
        n += p;
      }
      ctr[3]++;
      enc = prf.encrypt(ctr);
      data[i] ^= enc[0];
      data[i + 1] ^= enc[1];
      data[i + 2] ^= enc[2];
      data[i + 3] ^= enc[3];
    }
    return { tag, data: w.clamp(data, bl) };
  }
};
sjcl.misc.hmac = function(key, Hash) {
  this._hash = Hash = Hash || sjcl.hash.sha256;
  var exKey = [[], []], i, bs = Hash.prototype.blockSize / 32;
  this._baseHash = [new Hash(), new Hash()];
  if (key.length > bs) {
    key = Hash.hash(key);
  }
  for (i = 0; i < bs; i++) {
    exKey[0][i] = key[i] ^ 909522486;
    exKey[1][i] = key[i] ^ 1549556828;
  }
  this._baseHash[0].update(exKey[0]);
  this._baseHash[1].update(exKey[1]);
  this._resultHash = new Hash(this._baseHash[0]);
};
sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function(data) {
  if (!this._updated) {
    this.update(data);
    return this.digest(data);
  } else {
    throw new sjcl.exception.invalid("encrypt on already updated hmac called!");
  }
};
sjcl.misc.hmac.prototype.reset = function() {
  this._resultHash = new this._hash(this._baseHash[0]);
  this._updated = false;
};
sjcl.misc.hmac.prototype.update = function(data) {
  this._updated = true;
  this._resultHash.update(data);
};
sjcl.misc.hmac.prototype.digest = function() {
  var w = this._resultHash.finalize(), result = new this._hash(this._baseHash[1]).update(w).finalize();
  this.reset();
  return result;
};
sjcl.misc.pbkdf2 = function(password, salt, count, length, Prff) {
  count = count || 1e4;
  if (length < 0 || count < 0) {
    throw new sjcl.exception.invalid("invalid params to pbkdf2");
  }
  if (typeof password === "string") {
    password = sjcl.codec.utf8String.toBits(password);
  }
  if (typeof salt === "string") {
    salt = sjcl.codec.utf8String.toBits(salt);
  }
  Prff = Prff || sjcl.misc.hmac;
  var prf = new Prff(password), u, ui, i, j, k, out = [], b = sjcl.bitArray;
  for (k = 1; 32 * out.length < (length || 1); k++) {
    u = ui = prf.encrypt(b.concat(salt, [k]));
    for (i = 1; i < count; i++) {
      ui = prf.encrypt(ui);
      for (j = 0; j < ui.length; j++) {
        u[j] ^= ui[j];
      }
    }
    out = out.concat(u);
  }
  if (length) {
    out = b.clamp(out, length);
  }
  return out;
};
sjcl.prng = function(defaultParanoia) {
  this._pools = [new sjcl.hash.sha256()];
  this._poolEntropy = [0];
  this._reseedCount = 0;
  this._robins = {};
  this._eventId = 0;
  this._collectorIds = {};
  this._collectorIdNext = 0;
  this._strength = 0;
  this._poolStrength = 0;
  this._nextReseed = 0;
  this._key = [0, 0, 0, 0, 0, 0, 0, 0];
  this._counter = [0, 0, 0, 0];
  this._cipher = void 0;
  this._defaultParanoia = defaultParanoia;
  this._collectorsStarted = false;
  this._callbacks = { progress: {}, seeded: {} };
  this._callbackI = 0;
  this._NOT_READY = 0;
  this._READY = 1;
  this._REQUIRES_RESEED = 2;
  this._MAX_WORDS_PER_BURST = 65536;
  this._PARANOIA_LEVELS = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024];
  this._MILLISECONDS_PER_RESEED = 3e4;
  this._BITS_PER_RESEED = 80;
};
sjcl.prng.prototype = {
  /** Generate several random words, and return them in an array.
   * A word consists of 32 bits (4 bytes)
   * @param {Number} nwords The number of words to generate.
   */
  randomWords: function(nwords, paranoia) {
    var out = [], i, readiness = this.isReady(paranoia), g;
    if (readiness === this._NOT_READY) {
      throw new sjcl.exception.notReady("generator isn't seeded");
    } else if (readiness & this._REQUIRES_RESEED) {
      this._reseedFromPools(!(readiness & this._READY));
    }
    for (i = 0; i < nwords; i += 4) {
      if ((i + 1) % this._MAX_WORDS_PER_BURST === 0) {
        this._gate();
      }
      g = this._gen4words();
      out.push(g[0], g[1], g[2], g[3]);
    }
    this._gate();
    return out.slice(0, nwords);
  },
  setDefaultParanoia: function(paranoia, allowZeroParanoia) {
    if (paranoia === 0 && allowZeroParanoia !== "Setting paranoia=0 will ruin your security; use it only for testing") {
      throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");
    }
    this._defaultParanoia = paranoia;
  },
  /**
   * Add entropy to the pools.
   * @param data The entropic value.  Should be a 32-bit integer, array of 32-bit integers, or string
   * @param {Number} estimatedEntropy The estimated entropy of data, in bits
   * @param {String} source The source of the entropy, eg "mouse"
   */
  addEntropy: function(data, estimatedEntropy, source) {
    source = source || "user";
    var id, i, tmp, t = (/* @__PURE__ */ new Date()).valueOf(), robin = this._robins[source], oldReady = this.isReady(), err = 0, objName;
    id = this._collectorIds[source];
    if (id === void 0) {
      id = this._collectorIds[source] = this._collectorIdNext++;
    }
    if (robin === void 0) {
      robin = this._robins[source] = 0;
    }
    this._robins[source] = (this._robins[source] + 1) % this._pools.length;
    switch (typeof data) {
      case "number":
        if (estimatedEntropy === void 0) {
          estimatedEntropy = 1;
        }
        this._pools[robin].update([id, this._eventId++, 1, estimatedEntropy, t, 1, data | 0]);
        break;
      case "object":
        objName = Object.prototype.toString.call(data);
        if (objName === "[object Uint32Array]") {
          tmp = [];
          for (i = 0; i < data.length; i++) {
            tmp.push(data[i]);
          }
          data = tmp;
        } else {
          if (objName !== "[object Array]") {
            err = 1;
          }
          for (i = 0; i < data.length && !err; i++) {
            if (typeof data[i] !== "number") {
              err = 1;
            }
          }
        }
        if (!err) {
          if (estimatedEntropy === void 0) {
            estimatedEntropy = 0;
            for (i = 0; i < data.length; i++) {
              tmp = data[i];
              while (tmp > 0) {
                estimatedEntropy++;
                tmp = tmp >>> 1;
              }
            }
          }
          this._pools[robin].update([id, this._eventId++, 2, estimatedEntropy, t, data.length].concat(data));
        }
        break;
      case "string":
        if (estimatedEntropy === void 0) {
          estimatedEntropy = data.length;
        }
        this._pools[robin].update([id, this._eventId++, 3, estimatedEntropy, t, data.length]);
        this._pools[robin].update(data);
        break;
      default:
        err = 1;
    }
    if (err) {
      throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");
    }
    this._poolEntropy[robin] += estimatedEntropy;
    this._poolStrength += estimatedEntropy;
    if (oldReady === this._NOT_READY) {
      if (this.isReady() !== this._NOT_READY) {
        this._fireEvent("seeded", Math.max(this._strength, this._poolStrength));
      }
      this._fireEvent("progress", this.getProgress());
    }
  },
  /** Is the generator ready? */
  isReady: function(paranoia) {
    var entropyRequired = this._PARANOIA_LEVELS[paranoia !== void 0 ? paranoia : this._defaultParanoia];
    if (this._strength && this._strength >= entropyRequired) {
      return this._poolEntropy[0] > this._BITS_PER_RESEED && (/* @__PURE__ */ new Date()).valueOf() > this._nextReseed ? this._REQUIRES_RESEED | this._READY : this._READY;
    } else {
      return this._poolStrength >= entropyRequired ? this._REQUIRES_RESEED | this._NOT_READY : this._NOT_READY;
    }
  },
  /** Get the generator's progress toward readiness, as a fraction */
  getProgress: function(paranoia) {
    var entropyRequired = this._PARANOIA_LEVELS[paranoia ? paranoia : this._defaultParanoia];
    if (this._strength >= entropyRequired) {
      return 1;
    } else {
      return this._poolStrength > entropyRequired ? 1 : this._poolStrength / entropyRequired;
    }
  },
  /** start the built-in entropy collectors */
  startCollectors: function() {
    if (this._collectorsStarted) {
      return;
    }
    this._eventListener = {
      loadTimeCollector: this._bind(this._loadTimeCollector),
      mouseCollector: this._bind(this._mouseCollector),
      keyboardCollector: this._bind(this._keyboardCollector),
      accelerometerCollector: this._bind(this._accelerometerCollector),
      touchCollector: this._bind(this._touchCollector)
    };
    if (window.addEventListener) {
      window.addEventListener("load", this._eventListener.loadTimeCollector, false);
      window.addEventListener("mousemove", this._eventListener.mouseCollector, false);
      window.addEventListener("keypress", this._eventListener.keyboardCollector, false);
      window.addEventListener("devicemotion", this._eventListener.accelerometerCollector, false);
      window.addEventListener("touchmove", this._eventListener.touchCollector, false);
    } else if (document.attachEvent) {
      document.attachEvent("onload", this._eventListener.loadTimeCollector);
      document.attachEvent("onmousemove", this._eventListener.mouseCollector);
      document.attachEvent("keypress", this._eventListener.keyboardCollector);
    } else {
      throw new sjcl.exception.bug("can't attach event");
    }
    this._collectorsStarted = true;
  },
  /** stop the built-in entropy collectors */
  stopCollectors: function() {
    if (!this._collectorsStarted) {
      return;
    }
    if (window.removeEventListener) {
      window.removeEventListener("load", this._eventListener.loadTimeCollector, false);
      window.removeEventListener("mousemove", this._eventListener.mouseCollector, false);
      window.removeEventListener("keypress", this._eventListener.keyboardCollector, false);
      window.removeEventListener("devicemotion", this._eventListener.accelerometerCollector, false);
      window.removeEventListener("touchmove", this._eventListener.touchCollector, false);
    } else if (document.detachEvent) {
      document.detachEvent("onload", this._eventListener.loadTimeCollector);
      document.detachEvent("onmousemove", this._eventListener.mouseCollector);
      document.detachEvent("keypress", this._eventListener.keyboardCollector);
    }
    this._collectorsStarted = false;
  },
  /* use a cookie to store entropy.
  useCookie: function (all_cookies) {
      throw new sjcl.exception.bug("random: useCookie is unimplemented");
  },*/
  /** add an event listener for progress or seeded-ness. */
  addEventListener: function(name, callback) {
    this._callbacks[name][this._callbackI++] = callback;
  },
  /** remove an event listener for progress or seeded-ness */
  removeEventListener: function(name, cb) {
    var i, j, cbs = this._callbacks[name], jsTemp = [];
    for (j in cbs) {
      if (cbs.hasOwnProperty(j) && cbs[j] === cb) {
        jsTemp.push(j);
      }
    }
    for (i = 0; i < jsTemp.length; i++) {
      j = jsTemp[i];
      delete cbs[j];
    }
  },
  _bind: function(func) {
    var that = this;
    return function() {
      func.apply(that, arguments);
    };
  },
  /** Generate 4 random words, no reseed, no gate.
   * @private
   */
  _gen4words: function() {
    for (var i = 0; i < 4; i++) {
      this._counter[i] = this._counter[i] + 1 | 0;
      if (this._counter[i]) {
        break;
      }
    }
    return this._cipher.encrypt(this._counter);
  },
  /* Rekey the AES instance with itself after a request, or every _MAX_WORDS_PER_BURST words.
   * @private
   */
  _gate: function() {
    this._key = this._gen4words().concat(this._gen4words());
    this._cipher = new sjcl.cipher.aes(this._key);
  },
  /** Reseed the generator with the given words
   * @private
   */
  _reseed: function(seedWords) {
    this._key = sjcl.hash.sha256.hash(this._key.concat(seedWords));
    this._cipher = new sjcl.cipher.aes(this._key);
    for (var i = 0; i < 4; i++) {
      this._counter[i] = this._counter[i] + 1 | 0;
      if (this._counter[i]) {
        break;
      }
    }
  },
  /** reseed the data from the entropy pools
   * @param full If set, use all the entropy pools in the reseed.
   */
  _reseedFromPools: function(full) {
    var reseedData = [], strength = 0, i;
    this._nextReseed = reseedData[0] = (/* @__PURE__ */ new Date()).valueOf() + this._MILLISECONDS_PER_RESEED;
    for (i = 0; i < 16; i++) {
      reseedData.push(Math.random() * 4294967296 | 0);
    }
    for (i = 0; i < this._pools.length; i++) {
      reseedData = reseedData.concat(this._pools[i].finalize());
      strength += this._poolEntropy[i];
      this._poolEntropy[i] = 0;
      if (!full && this._reseedCount & 1 << i) {
        break;
      }
    }
    if (this._reseedCount >= 1 << this._pools.length) {
      this._pools.push(new sjcl.hash.sha256());
      this._poolEntropy.push(0);
    }
    this._poolStrength -= strength;
    if (strength > this._strength) {
      this._strength = strength;
    }
    this._reseedCount++;
    this._reseed(reseedData);
  },
  _keyboardCollector: function() {
    this._addCurrentTimeToEntropy(1);
  },
  _mouseCollector: function(ev) {
    var x, y;
    try {
      x = ev.x || ev.clientX || ev.offsetX || 0;
      y = ev.y || ev.clientY || ev.offsetY || 0;
    } catch (err) {
      x = 0;
      y = 0;
    }
    if (x != 0 && y != 0) {
      this.addEntropy([x, y], 2, "mouse");
    }
    this._addCurrentTimeToEntropy(0);
  },
  _touchCollector: function(ev) {
    var touch = ev.touches[0] || ev.changedTouches[0];
    var x = touch.pageX || touch.clientX, y = touch.pageY || touch.clientY;
    this.addEntropy([x, y], 1, "touch");
    this._addCurrentTimeToEntropy(0);
  },
  _loadTimeCollector: function() {
    this._addCurrentTimeToEntropy(2);
  },
  _addCurrentTimeToEntropy: function(estimatedEntropy) {
    if (typeof window !== "undefined" && window.performance && typeof window.performance.now === "function") {
      this.addEntropy(window.performance.now(), estimatedEntropy, "loadtime");
    } else {
      this.addEntropy((/* @__PURE__ */ new Date()).valueOf(), estimatedEntropy, "loadtime");
    }
  },
  _accelerometerCollector: function(ev) {
    var ac = ev.accelerationIncludingGravity.x || ev.accelerationIncludingGravity.y || ev.accelerationIncludingGravity.z;
    if (window.orientation) {
      var or = window.orientation;
      if (typeof or === "number") {
        this.addEntropy(or, 1, "accelerometer");
      }
    }
    if (ac) {
      this.addEntropy(ac, 2, "accelerometer");
    }
    this._addCurrentTimeToEntropy(0);
  },
  _fireEvent: function(name, arg) {
    var j, cbs = sjcl.random._callbacks[name], cbsTemp = [];
    for (j in cbs) {
      if (cbs.hasOwnProperty(j)) {
        cbsTemp.push(cbs[j]);
      }
    }
    for (j = 0; j < cbsTemp.length; j++) {
      cbsTemp[j](arg);
    }
  }
};
sjcl.random = new sjcl.prng(6);
(function() {
  function getCryptoModule() {
    try {
      return __require("crypto");
    } catch (e) {
      return null;
    }
  }
  try {
    var buf, crypt, ab;
    if (typeof module !== "undefined" && module.exports && (crypt = getCryptoModule()) && crypt.randomBytes) {
      buf = crypt.randomBytes(1024 / 8);
      buf = new Uint32Array(new Uint8Array(buf).buffer);
      sjcl.random.addEntropy(buf, 1024, "crypto.randomBytes");
    } else if (typeof window !== "undefined" && typeof Uint32Array !== "undefined") {
      ab = new Uint32Array(32);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(ab);
      } else if (window.msCrypto && window.msCrypto.getRandomValues) {
        window.msCrypto.getRandomValues(ab);
      } else {
        return;
      }
      sjcl.random.addEntropy(ab, 1024, "crypto.getRandomValues");
    } else {
    }
  } catch (e) {
    if (typeof window !== "undefined" && window.console) {
      console.log("There was an error collecting entropy from the browser:");
      console.log(e);
    }
  }
})();
sjcl.json = {
  /** Default values for encryption */
  defaults: { v: 1, iter: 1e4, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes" },
  /** Simple encryption function.
   * @param {String|bitArray} password The password or key.
   * @param {String} plaintext The data to encrypt.
   * @param {Object} [params] The parameters including tag, iv and salt.
   * @param {Object} [rp] A returned version with filled-in parameters.
   * @return {Object} The cipher raw data.
   * @throws {sjcl.exception.invalid} if a parameter is invalid.
   */
  _encrypt: function(password, plaintext, params, rp) {
    params = params || {};
    rp = rp || {};
    var j = sjcl.json, p = j._add({ iv: sjcl.random.randomWords(4, 0) }, j.defaults), tmp, prp, adata;
    j._add(p, params);
    adata = p.adata;
    if (typeof p.salt === "string") {
      p.salt = sjcl.codec.base64.toBits(p.salt);
    }
    if (typeof p.iv === "string") {
      p.iv = sjcl.codec.base64.toBits(p.iv);
    }
    if (!sjcl.mode[p.mode] || !sjcl.cipher[p.cipher] || typeof password === "string" && p.iter <= 100 || p.ts !== 64 && p.ts !== 96 && p.ts !== 128 || p.ks !== 128 && p.ks !== 192 && p.ks !== 256 || (p.iv.length < 2 || p.iv.length > 4)) {
      throw new sjcl.exception.invalid("json encrypt: invalid parameters");
    }
    if (typeof password === "string") {
      tmp = sjcl.misc.cachedPbkdf2(password, p);
      password = tmp.key.slice(0, p.ks / 32);
      p.salt = tmp.salt;
    } else if (sjcl.ecc && password instanceof sjcl.ecc.elGamal.publicKey) {
      tmp = password.kem();
      p.kemtag = tmp.tag;
      password = tmp.key.slice(0, p.ks / 32);
    }
    if (typeof plaintext === "string") {
      plaintext = sjcl.codec.utf8String.toBits(plaintext);
    }
    if (typeof adata === "string") {
      p.adata = adata = sjcl.codec.utf8String.toBits(adata);
    }
    prp = new sjcl.cipher[p.cipher](password);
    j._add(rp, p);
    rp.key = password;
    if (p.mode === "ccm" && sjcl.arrayBuffer && sjcl.arrayBuffer.ccm && plaintext instanceof ArrayBuffer) {
      p.ct = sjcl.arrayBuffer.ccm.encrypt(prp, plaintext, p.iv, adata, p.ts);
    } else {
      p.ct = sjcl.mode[p.mode].encrypt(prp, plaintext, p.iv, adata, p.ts);
    }
    return p;
  },
  /** Simple encryption function.
   * @param {String|bitArray} password The password or key.
   * @param {String} plaintext The data to encrypt.
   * @param {Object} [params] The parameters including tag, iv and salt.
   * @param {Object} [rp] A returned version with filled-in parameters.
   * @return {String} The ciphertext serialized data.
   * @throws {sjcl.exception.invalid} if a parameter is invalid.
   */
  encrypt: function(password, plaintext, params, rp) {
    var j = sjcl.json, p = j._encrypt.apply(j, arguments);
    return j.encode(p);
  },
  /** Simple decryption function.
   * @param {String|bitArray} password The password or key.
   * @param {Object} ciphertext The cipher raw data to decrypt.
   * @param {Object} [params] Additional non-default parameters.
   * @param {Object} [rp] A returned object with filled parameters.
   * @return {String} The plaintext.
   * @throws {sjcl.exception.invalid} if a parameter is invalid.
   * @throws {sjcl.exception.corrupt} if the ciphertext is corrupt.
   */
  _decrypt: function(password, ciphertext, params, rp) {
    params = params || {};
    rp = rp || {};
    var j = sjcl.json, p = j._add(j._add(j._add({}, j.defaults), ciphertext), params, true), ct, tmp, prp, adata = p.adata;
    if (typeof p.salt === "string") {
      p.salt = sjcl.codec.base64.toBits(p.salt);
    }
    if (typeof p.iv === "string") {
      p.iv = sjcl.codec.base64.toBits(p.iv);
    }
    if (!sjcl.mode[p.mode] || !sjcl.cipher[p.cipher] || typeof password === "string" && p.iter <= 100 || p.ts !== 64 && p.ts !== 96 && p.ts !== 128 || p.ks !== 128 && p.ks !== 192 && p.ks !== 256 || !p.iv || (p.iv.length < 2 || p.iv.length > 4)) {
      throw new sjcl.exception.invalid("json decrypt: invalid parameters");
    }
    if (typeof password === "string") {
      tmp = sjcl.misc.cachedPbkdf2(password, p);
      password = tmp.key.slice(0, p.ks / 32);
      p.salt = tmp.salt;
    } else if (sjcl.ecc && password instanceof sjcl.ecc.elGamal.secretKey) {
      password = password.unkem(sjcl.codec.base64.toBits(p.kemtag)).slice(0, p.ks / 32);
    }
    if (typeof adata === "string") {
      adata = sjcl.codec.utf8String.toBits(adata);
    }
    prp = new sjcl.cipher[p.cipher](password);
    if (p.mode === "ccm" && sjcl.arrayBuffer && sjcl.arrayBuffer.ccm && p.ct instanceof ArrayBuffer) {
      ct = sjcl.arrayBuffer.ccm.decrypt(prp, p.ct, p.iv, p.tag, adata, p.ts);
    } else {
      ct = sjcl.mode[p.mode].decrypt(prp, p.ct, p.iv, adata, p.ts);
    }
    j._add(rp, p);
    rp.key = password;
    if (params.raw === 1) {
      return ct;
    } else {
      return sjcl.codec.utf8String.fromBits(ct);
    }
  },
  /** Simple decryption function.
   * @param {String|bitArray} password The password or key.
   * @param {String} ciphertext The ciphertext to decrypt.
   * @param {Object} [params] Additional non-default parameters.
   * @param {Object} [rp] A returned object with filled parameters.
   * @return {String} The plaintext.
   * @throws {sjcl.exception.invalid} if a parameter is invalid.
   * @throws {sjcl.exception.corrupt} if the ciphertext is corrupt.
   */
  decrypt: function(password, ciphertext, params, rp) {
    var j = sjcl.json;
    return j._decrypt(password, j.decode(ciphertext), params, rp);
  },
  /** Encode a flat structure into a JSON string.
   * @param {Object} obj The structure to encode.
   * @return {String} A JSON string.
   * @throws {sjcl.exception.invalid} if obj has a non-alphanumeric property.
   * @throws {sjcl.exception.bug} if a parameter has an unsupported type.
   */
  encode: function(obj) {
    var i, out = "{", comma = "";
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (!i.match(/^[a-z0-9]+$/i)) {
          throw new sjcl.exception.invalid("json encode: invalid property name");
        }
        out += comma + '"' + i + '":';
        comma = ",";
        switch (typeof obj[i]) {
          case "number":
          case "boolean":
            out += obj[i];
            break;
          case "string":
            out += '"' + escape(obj[i]) + '"';
            break;
          case "object":
            out += '"' + sjcl.codec.base64.fromBits(obj[i], 0) + '"';
            break;
          default:
            throw new sjcl.exception.bug("json encode: unsupported type");
        }
      }
    }
    return out + "}";
  },
  /** Decode a simple (flat) JSON string into a structure.  The ciphertext,
   * adata, salt and iv will be base64-decoded.
   * @param {String} str The string.
   * @return {Object} The decoded structure.
   * @throws {sjcl.exception.invalid} if str isn't (simple) JSON.
   */
  decode: function(str) {
    str = str.replace(/\s/g, "");
    if (!str.match(/^\{.*\}$/)) {
      throw new sjcl.exception.invalid("json decode: this isn't json!");
    }
    var a = str.replace(/^\{|\}$/g, "").split(/,/), out = {}, i, m;
    for (i = 0; i < a.length; i++) {
      if (!(m = a[i].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i))) {
        throw new sjcl.exception.invalid("json decode: this isn't json!");
      }
      if (m[3] != null) {
        out[m[2]] = parseInt(m[3], 10);
      } else if (m[4] != null) {
        out[m[2]] = m[2].match(/^(ct|adata|salt|iv)$/) ? sjcl.codec.base64.toBits(m[4]) : unescape(m[4]);
      } else if (m[5] != null) {
        out[m[2]] = m[5] === "true";
      }
    }
    return out;
  },
  /** Insert all elements of src into target, modifying and returning target.
   * @param {Object} target The object to be modified.
   * @param {Object} src The object to pull data from.
   * @param {boolean} [requireSame=false] If true, throw an exception if any field of target differs from corresponding field of src.
   * @return {Object} target.
   * @private
   */
  _add: function(target, src, requireSame) {
    if (target === void 0) {
      target = {};
    }
    if (src === void 0) {
      return target;
    }
    var i;
    for (i in src) {
      if (src.hasOwnProperty(i)) {
        if (requireSame && target[i] !== void 0 && target[i] !== src[i]) {
          throw new sjcl.exception.invalid("required parameter overridden");
        }
        target[i] = src[i];
      }
    }
    return target;
  },
  /** Remove all elements of minus from plus.  Does not modify plus.
   * @private
   */
  _subtract: function(plus, minus) {
    var out = {}, i;
    for (i in plus) {
      if (plus.hasOwnProperty(i) && plus[i] !== minus[i]) {
        out[i] = plus[i];
      }
    }
    return out;
  },
  /** Return only the specified elements of src.
   * @private
   */
  _filter: function(src, filter) {
    var out = {}, i;
    for (i = 0; i < filter.length; i++) {
      if (src[filter[i]] !== void 0) {
        out[filter[i]] = src[filter[i]];
      }
    }
    return out;
  }
};
sjcl.encrypt = sjcl.json.encrypt;
sjcl.decrypt = sjcl.json.decrypt;
sjcl.misc._pbkdf2Cache = {};
sjcl.misc.cachedPbkdf2 = function(password, obj) {
  var cache = sjcl.misc._pbkdf2Cache, c, cp, str, salt, iter;
  obj = obj || {};
  iter = obj.iter || 1e3;
  cp = cache[password] = cache[password] || {};
  c = cp[iter] = cp[iter] || { firstSalt: obj.salt && obj.salt.length ? obj.salt.slice(0) : sjcl.random.randomWords(2, 0) };
  salt = obj.salt === void 0 ? c.firstSalt : obj.salt;
  c[salt] = c[salt] || sjcl.misc.pbkdf2(password, salt, obj.iter);
  return { key: c[salt].slice(0), salt: salt.slice(0) };
};
sjcl.bn = function(it) {
  this.initWith(it);
};
sjcl.bn.prototype = {
  radix: 24,
  maxMul: 8,
  _class: sjcl.bn,
  copy: function() {
    return new this._class(this);
  },
  /**
   * Initializes this with it, either as a bn, a number, or a hex string.
   */
  initWith: function(it) {
    var i = 0, k;
    switch (typeof it) {
      case "object":
        this.limbs = it.limbs.slice(0);
        break;
      case "number":
        this.limbs = [it];
        this.normalize();
        break;
      case "string":
        it = it.replace(/^0x/, "");
        this.limbs = [];
        k = this.radix / 4;
        for (i = 0; i < it.length; i += k) {
          this.limbs.push(parseInt(it.substring(Math.max(it.length - i - k, 0), it.length - i), 16));
        }
        break;
      default:
        this.limbs = [0];
    }
    return this;
  },
  /**
   * Returns true if "this" and "that" are equal.  Calls fullReduce().
   * Equality test is in constant time.
   */
  equals: function(that) {
    if (typeof that === "number") {
      that = new this._class(that);
    }
    var difference = 0, i;
    this.fullReduce();
    that.fullReduce();
    for (i = 0; i < this.limbs.length || i < that.limbs.length; i++) {
      difference |= this.getLimb(i) ^ that.getLimb(i);
    }
    return difference === 0;
  },
  /**
   * Get the i'th limb of this, zero if i is too large.
   */
  getLimb: function(i) {
    return i >= this.limbs.length ? 0 : this.limbs[i];
  },
  /**
   * Constant time comparison function.
   * Returns 1 if this >= that, or zero otherwise.
   */
  greaterEquals: function(that) {
    if (typeof that === "number") {
      that = new this._class(that);
    }
    var less = 0, greater = 0, i, a, b;
    i = Math.max(this.limbs.length, that.limbs.length) - 1;
    for (; i >= 0; i--) {
      a = this.getLimb(i);
      b = that.getLimb(i);
      greater |= b - a & ~less;
      less |= a - b & ~greater;
    }
    return (greater | ~less) >>> 31;
  },
  /**
   * Convert to a hex string.
   */
  toString: function() {
    this.fullReduce();
    var out = "", i, s, l = this.limbs;
    for (i = 0; i < this.limbs.length; i++) {
      s = l[i].toString(16);
      while (i < this.limbs.length - 1 && s.length < 6) {
        s = "0" + s;
      }
      out = s + out;
    }
    return "0x" + out;
  },
  /** this += that.  Does not normalize. */
  addM: function(that) {
    if (typeof that !== "object") {
      that = new this._class(that);
    }
    var i, l = this.limbs, ll = that.limbs;
    for (i = l.length; i < ll.length; i++) {
      l[i] = 0;
    }
    for (i = 0; i < ll.length; i++) {
      l[i] += ll[i];
    }
    return this;
  },
  /** this *= 2.  Requires normalized; ends up normalized. */
  doubleM: function() {
    var i, carry = 0, tmp, r = this.radix, m = this.radixMask, l = this.limbs;
    for (i = 0; i < l.length; i++) {
      tmp = l[i];
      tmp = tmp + tmp + carry;
      l[i] = tmp & m;
      carry = tmp >> r;
    }
    if (carry) {
      l.push(carry);
    }
    return this;
  },
  /** this /= 2, rounded down.  Requires normalized; ends up normalized. */
  halveM: function() {
    var i, carry = 0, tmp, r = this.radix, l = this.limbs;
    for (i = l.length - 1; i >= 0; i--) {
      tmp = l[i];
      l[i] = tmp + carry >> 1;
      carry = (tmp & 1) << r;
    }
    if (!l[l.length - 1]) {
      l.pop();
    }
    return this;
  },
  /** this -= that.  Does not normalize. */
  subM: function(that) {
    if (typeof that !== "object") {
      that = new this._class(that);
    }
    var i, l = this.limbs, ll = that.limbs;
    for (i = l.length; i < ll.length; i++) {
      l[i] = 0;
    }
    for (i = 0; i < ll.length; i++) {
      l[i] -= ll[i];
    }
    return this;
  },
  mod: function(that) {
    var neg = !this.greaterEquals(new sjcl.bn(0));
    that = new sjcl.bn(that).normalize();
    var out = new sjcl.bn(this).normalize(), ci = 0;
    if (neg)
      out = new sjcl.bn(0).subM(out).normalize();
    for (; out.greaterEquals(that); ci++) {
      that.doubleM();
    }
    if (neg)
      out = that.sub(out).normalize();
    for (; ci > 0; ci--) {
      that.halveM();
      if (out.greaterEquals(that)) {
        out.subM(that).normalize();
      }
    }
    return out.trim();
  },
  /** return inverse mod prime p.  p must be odd. Binary extended Euclidean algorithm mod p. */
  inverseMod: function(p) {
    var a = new sjcl.bn(1), b = new sjcl.bn(0), x = new sjcl.bn(this), y = new sjcl.bn(p), tmp, i, nz = 1;
    if (!(p.limbs[0] & 1)) {
      throw new sjcl.exception.invalid("inverseMod: p must be odd");
    }
    do {
      if (x.limbs[0] & 1) {
        if (!x.greaterEquals(y)) {
          tmp = x;
          x = y;
          y = tmp;
          tmp = a;
          a = b;
          b = tmp;
        }
        x.subM(y);
        x.normalize();
        if (!a.greaterEquals(b)) {
          a.addM(p);
        }
        a.subM(b);
      }
      x.halveM();
      if (a.limbs[0] & 1) {
        a.addM(p);
      }
      a.normalize();
      a.halveM();
      for (i = nz = 0; i < x.limbs.length; i++) {
        nz |= x.limbs[i];
      }
    } while (nz);
    if (!y.equals(1)) {
      throw new sjcl.exception.invalid("inverseMod: p and x must be relatively prime");
    }
    return b;
  },
  /** this + that.  Does not normalize. */
  add: function(that) {
    return this.copy().addM(that);
  },
  /** this - that.  Does not normalize. */
  sub: function(that) {
    return this.copy().subM(that);
  },
  /** this * that.  Normalizes and reduces. */
  mul: function(that) {
    if (typeof that === "number") {
      that = new this._class(that);
    } else {
      that.normalize();
    }
    this.normalize();
    var i, j, a = this.limbs, b = that.limbs, al = a.length, bl = b.length, out = new this._class(), c = out.limbs, ai, ii = this.maxMul;
    for (i = 0; i < this.limbs.length + that.limbs.length + 1; i++) {
      c[i] = 0;
    }
    for (i = 0; i < al; i++) {
      ai = a[i];
      for (j = 0; j < bl; j++) {
        c[i + j] += ai * b[j];
      }
      if (!--ii) {
        ii = this.maxMul;
        out.cnormalize();
      }
    }
    return out.cnormalize().reduce();
  },
  /** this ^ 2.  Normalizes and reduces. */
  square: function() {
    return this.mul(this);
  },
  /** this ^ n.  Uses square-and-multiply.  Normalizes and reduces. */
  power: function(l) {
    l = new sjcl.bn(l).normalize().trim().limbs;
    var i, j, out = new this._class(1), pow = this;
    for (i = 0; i < l.length; i++) {
      for (j = 0; j < this.radix; j++) {
        if (l[i] & 1 << j) {
          out = out.mul(pow);
        }
        if (i == l.length - 1 && l[i] >> j + 1 == 0) {
          break;
        }
        pow = pow.square();
      }
    }
    return out;
  },
  /** this * that mod N */
  mulmod: function(that, N) {
    return this.mod(N).mul(that.mod(N)).mod(N);
  },
  /** this ^ x mod N */
  powermod: function(x, N) {
    x = new sjcl.bn(x);
    N = new sjcl.bn(N);
    if ((N.limbs[0] & 1) == 1) {
      var montOut = this.montpowermod(x, N);
      if (montOut != false) {
        return montOut;
      }
    }
    var i, j, l = x.normalize().trim().limbs, out = new this._class(1), pow = this;
    for (i = 0; i < l.length; i++) {
      for (j = 0; j < this.radix; j++) {
        if (l[i] & 1 << j) {
          out = out.mulmod(pow, N);
        }
        if (i == l.length - 1 && l[i] >> j + 1 == 0) {
          break;
        }
        pow = pow.mulmod(pow, N);
      }
    }
    return out;
  },
  /** this ^ x mod N with Montomery reduction */
  montpowermod: function(x, N) {
    x = new sjcl.bn(x).normalize().trim();
    N = new sjcl.bn(N);
    var i, j, radix = this.radix, out = new this._class(1), pow = this.copy();
    var R, s, wind, bitsize = x.bitLength();
    R = new sjcl.bn({
      limbs: N.copy().normalize().trim().limbs.map(function() {
        return 0;
      })
    });
    for (s = this.radix; s > 0; s--) {
      if ((N.limbs[N.limbs.length - 1] >> s & 1) == 1) {
        R.limbs[R.limbs.length - 1] = 1 << s;
        break;
      }
    }
    if (bitsize == 0) {
      return this;
    } else if (bitsize < 18) {
      wind = 1;
    } else if (bitsize < 48) {
      wind = 3;
    } else if (bitsize < 144) {
      wind = 4;
    } else if (bitsize < 768) {
      wind = 5;
    } else {
      wind = 6;
    }
    var RR = R.copy(), NN = N.copy(), RP = new sjcl.bn(1), NP = new sjcl.bn(0), RT = R.copy();
    while (RT.greaterEquals(1)) {
      RT.halveM();
      if ((RP.limbs[0] & 1) == 0) {
        RP.halveM();
        NP.halveM();
      } else {
        RP.addM(NN);
        RP.halveM();
        NP.halveM();
        NP.addM(RR);
      }
    }
    RP = RP.normalize();
    NP = NP.normalize();
    RR.doubleM();
    var R2 = RR.mulmod(RR, N);
    if (!RR.mul(RP).sub(N.mul(NP)).equals(1)) {
      return false;
    }
    var montIn = function(c) {
      return montMul(c, R2);
    }, montMul = function(a, b) {
      var k, ab, right, abBar, mask = (1 << s + 1) - 1;
      ab = a.mul(b);
      right = ab.mul(NP);
      right.limbs = right.limbs.slice(0, R.limbs.length);
      if (right.limbs.length == R.limbs.length) {
        right.limbs[R.limbs.length - 1] &= mask;
      }
      right = right.mul(N);
      abBar = ab.add(right).normalize().trim();
      abBar.limbs = abBar.limbs.slice(R.limbs.length - 1);
      for (k = 0; k < abBar.limbs.length; k++) {
        if (k > 0) {
          abBar.limbs[k - 1] |= (abBar.limbs[k] & mask) << radix - s - 1;
        }
        abBar.limbs[k] = abBar.limbs[k] >> s + 1;
      }
      if (abBar.greaterEquals(N)) {
        abBar.subM(N);
      }
      return abBar;
    }, montOut = function(c) {
      return montMul(c, 1);
    };
    pow = montIn(pow);
    out = montIn(out);
    var h, precomp = {}, cap = (1 << wind - 1) - 1;
    precomp[1] = pow.copy();
    precomp[2] = montMul(pow, pow);
    for (h = 1; h <= cap; h++) {
      precomp[2 * h + 1] = montMul(precomp[2 * h - 1], precomp[2]);
    }
    var getBit = function(exp, i2) {
      var off = i2 % exp.radix;
      return (exp.limbs[Math.floor(i2 / exp.radix)] & 1 << off) >> off;
    };
    for (i = x.bitLength() - 1; i >= 0; ) {
      if (getBit(x, i) == 0) {
        out = montMul(out, out);
        i = i - 1;
      } else {
        var l = i - wind + 1;
        while (getBit(x, l) == 0) {
          l++;
        }
        var indx = 0;
        for (j = l; j <= i; j++) {
          indx += getBit(x, j) << j - l;
          out = montMul(out, out);
        }
        out = montMul(out, precomp[indx]);
        i = l - 1;
      }
    }
    return montOut(out);
  },
  trim: function() {
    var l = this.limbs, p;
    do {
      p = l.pop();
    } while (l.length && p === 0);
    l.push(p);
    return this;
  },
  /** Reduce mod a modulus.  Stubbed for subclassing. */
  reduce: function() {
    return this;
  },
  /** Reduce and normalize. */
  fullReduce: function() {
    return this.normalize();
  },
  /** Propagate carries. */
  normalize: function() {
    var carry = 0, i, pv = this.placeVal, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
    for (i = 0; i < ll || carry !== 0 && carry !== -1; i++) {
      l = (limbs[i] || 0) + carry;
      m = limbs[i] = l & mask;
      carry = (l - m) * ipv;
    }
    if (carry === -1) {
      limbs[i - 1] -= pv;
    }
    this.trim();
    return this;
  },
  /** Constant-time normalize. Does not allocate additional space. */
  cnormalize: function() {
    var carry = 0, i, ipv = this.ipv, l, m, limbs = this.limbs, ll = limbs.length, mask = this.radixMask;
    for (i = 0; i < ll - 1; i++) {
      l = limbs[i] + carry;
      m = limbs[i] = l & mask;
      carry = (l - m) * ipv;
    }
    limbs[i] += carry;
    return this;
  },
  /** Serialize to a bit array */
  toBits: function(len) {
    this.fullReduce();
    len = len || this.exponent || this.bitLength();
    var i = Math.floor((len - 1) / 24), w = sjcl.bitArray, e = (len + 7 & -8) % this.radix || this.radix, out = [w.partial(e, this.getLimb(i))];
    for (i--; i >= 0; i--) {
      out = w.concat(out, [w.partial(Math.min(this.radix, len), this.getLimb(i))]);
      len -= this.radix;
    }
    return out;
  },
  /** Return the length in bits, rounded up to the nearest byte. */
  bitLength: function() {
    this.fullReduce();
    var out = this.radix * (this.limbs.length - 1), b = this.limbs[this.limbs.length - 1];
    for (; b; b >>>= 1) {
      out++;
    }
    return out + 7 & -8;
  }
};
sjcl.bn.fromBits = function(bits) {
  var Class = this, out = new Class(), words = [], w = sjcl.bitArray, t = this.prototype, l = Math.min(this.bitLength || 4294967296, w.bitLength(bits)), e = l % t.radix || t.radix;
  words[0] = w.extract(bits, 0, e);
  for (; e < l; e += t.radix) {
    words.unshift(w.extract(bits, e, t.radix));
  }
  out.limbs = words;
  return out;
};
sjcl.bn.prototype.ipv = 1 / (sjcl.bn.prototype.placeVal = Math.pow(2, sjcl.bn.prototype.radix));
sjcl.bn.prototype.radixMask = (1 << sjcl.bn.prototype.radix) - 1;
sjcl.bn.pseudoMersennePrime = function(exponent, coeff) {
  function p(it) {
    this.initWith(it);
  }
  var ppr = p.prototype = new sjcl.bn(), i, tmp, mo;
  mo = ppr.modOffset = Math.ceil(tmp = exponent / ppr.radix);
  ppr.exponent = exponent;
  ppr.offset = [];
  ppr.factor = [];
  ppr.minOffset = mo;
  ppr.fullMask = 0;
  ppr.fullOffset = [];
  ppr.fullFactor = [];
  ppr.modulus = p.modulus = new sjcl.bn(Math.pow(2, exponent));
  ppr.fullMask = 0 | -Math.pow(2, exponent % ppr.radix);
  for (i = 0; i < coeff.length; i++) {
    ppr.offset[i] = Math.floor(coeff[i][0] / ppr.radix - tmp);
    ppr.fullOffset[i] = Math.floor(coeff[i][0] / ppr.radix) - mo + 1;
    ppr.factor[i] = coeff[i][1] * Math.pow(1 / 2, exponent - coeff[i][0] + ppr.offset[i] * ppr.radix);
    ppr.fullFactor[i] = coeff[i][1] * Math.pow(1 / 2, exponent - coeff[i][0] + ppr.fullOffset[i] * ppr.radix);
    ppr.modulus.addM(new sjcl.bn(Math.pow(2, coeff[i][0]) * coeff[i][1]));
    ppr.minOffset = Math.min(ppr.minOffset, -ppr.offset[i]);
  }
  ppr._class = p;
  ppr.modulus.cnormalize();
  ppr.reduce = function() {
    var i2, k, l, mo2 = this.modOffset, limbs = this.limbs, off = this.offset, ol = this.offset.length, fac = this.factor, ll;
    i2 = this.minOffset;
    while (limbs.length > mo2) {
      l = limbs.pop();
      ll = limbs.length;
      for (k = 0; k < ol; k++) {
        limbs[ll + off[k]] -= fac[k] * l;
      }
      i2--;
      if (!i2) {
        limbs.push(0);
        this.cnormalize();
        i2 = this.minOffset;
      }
    }
    this.cnormalize();
    return this;
  };
  ppr._strongReduce = ppr.fullMask === -1 ? ppr.reduce : function() {
    var limbs = this.limbs, i2 = limbs.length - 1, k, l;
    this.reduce();
    if (i2 === this.modOffset - 1) {
      l = limbs[i2] & this.fullMask;
      limbs[i2] -= l;
      for (k = 0; k < this.fullOffset.length; k++) {
        limbs[i2 + this.fullOffset[k]] -= this.fullFactor[k] * l;
      }
      this.normalize();
    }
  };
  ppr.fullReduce = function() {
    var greater, i2;
    this._strongReduce();
    this.addM(this.modulus);
    this.addM(this.modulus);
    this.normalize();
    this._strongReduce();
    for (i2 = this.limbs.length; i2 < this.modOffset; i2++) {
      this.limbs[i2] = 0;
    }
    greater = this.greaterEquals(this.modulus);
    for (i2 = 0; i2 < this.limbs.length; i2++) {
      this.limbs[i2] -= this.modulus.limbs[i2] * greater;
    }
    this.cnormalize();
    return this;
  };
  ppr.inverse = function() {
    return this.power(this.modulus.sub(2));
  };
  p.fromBits = sjcl.bn.fromBits;
  return p;
};
var sbp = sjcl.bn.pseudoMersennePrime;
sjcl.bn.prime = {
  p127: sbp(127, [[0, -1]]),
  // Bernstein's prime for Curve25519
  p25519: sbp(255, [[0, -19]]),
  // Koblitz primes
  p192k: sbp(192, [[32, -1], [12, -1], [8, -1], [7, -1], [6, -1], [3, -1], [0, -1]]),
  p224k: sbp(224, [[32, -1], [12, -1], [11, -1], [9, -1], [7, -1], [4, -1], [1, -1], [0, -1]]),
  p256k: sbp(256, [[32, -1], [9, -1], [8, -1], [7, -1], [6, -1], [4, -1], [0, -1]]),
  // NIST primes
  p192: sbp(192, [[0, -1], [64, -1]]),
  p224: sbp(224, [[0, 1], [96, -1]]),
  p256: sbp(256, [[0, -1], [96, 1], [192, 1], [224, -1]]),
  p384: sbp(384, [[0, -1], [32, 1], [96, -1], [128, -1]]),
  p521: sbp(521, [[0, -1]])
};
sjcl.bn.random = function(modulus, paranoia) {
  if (typeof modulus !== "object") {
    modulus = new sjcl.bn(modulus);
  }
  var words, i, l = modulus.limbs.length, m = modulus.limbs[l - 1] + 1, out = new sjcl.bn();
  while (true) {
    do {
      words = sjcl.random.randomWords(l, paranoia);
      if (words[l - 1] < 0) {
        words[l - 1] += 4294967296;
      }
    } while (Math.floor(words[l - 1] / m) === Math.floor(4294967296 / m));
    words[l - 1] %= m;
    for (i = 0; i < l - 1; i++) {
      words[i] &= modulus.radixMask;
    }
    out.limbs = words;
    if (!out.greaterEquals(modulus)) {
      return out;
    }
  }
};
if (typeof ArrayBuffer === "undefined") {
  (function(globals) {
    "use strict";
    globals.ArrayBuffer = function() {
    };
    globals.DataView = function() {
    };
  })(void 0);
}
sjcl.codec.arrayBuffer = {
  /** Convert from a bitArray to an ArrayBuffer.
   * Will default to 8byte padding if padding is undefined*/
  fromBits: function(arr, padding, padding_count) {
    var out, i, ol, tmp, smallest;
    padding = padding == void 0 ? true : padding;
    padding_count = padding_count || 8;
    if (arr.length === 0) {
      return new ArrayBuffer(0);
    }
    ol = sjcl.bitArray.bitLength(arr) / 8;
    if (sjcl.bitArray.bitLength(arr) % 8 !== 0) {
      throw new sjcl.exception.invalid("Invalid bit size, must be divisble by 8 to fit in an arraybuffer correctly");
    }
    if (padding && ol % padding_count !== 0) {
      ol += padding_count - ol % padding_count;
    }
    tmp = new DataView(new ArrayBuffer(arr.length * 4));
    for (i = 0; i < arr.length; i++) {
      tmp.setUint32(i * 4, arr[i] << 32);
    }
    out = new DataView(new ArrayBuffer(ol));
    if (out.byteLength === tmp.byteLength) {
      return tmp.buffer;
    }
    smallest = tmp.byteLength < out.byteLength ? tmp.byteLength : out.byteLength;
    for (i = 0; i < smallest; i++) {
      out.setUint8(i, tmp.getUint8(i));
    }
    return out.buffer;
  },
  /** Convert from an ArrayBuffer to a bitArray. */
  toBits: function(buffer) {
    var i, out = [], len, inView, tmp;
    if (buffer.byteLength === 0) {
      return [];
    }
    inView = new DataView(buffer);
    len = inView.byteLength - inView.byteLength % 4;
    for (var i = 0; i < len; i += 4) {
      out.push(inView.getUint32(i));
    }
    if (inView.byteLength % 4 != 0) {
      tmp = new DataView(new ArrayBuffer(4));
      for (var i = 0, l = inView.byteLength % 4; i < l; i++) {
        tmp.setUint8(i + 4 - l, inView.getUint8(len + i));
      }
      out.push(sjcl.bitArray.partial(inView.byteLength % 4 * 8, tmp.getUint32(0)));
    }
    return out;
  },
  /** Prints a hex output of the buffer contents, akin to hexdump **/
  hexDumpBuffer: function(buffer) {
    var stringBufferView = new DataView(buffer);
    var string = "";
    var pad = function(n, width) {
      n = n + "";
      return n.length >= width ? n : new Array(width - n.length + 1).join("0") + n;
    };
    for (var i = 0; i < stringBufferView.byteLength; i += 2) {
      if (i % 16 == 0)
        string += "\n" + i.toString(16) + "	";
      string += pad(stringBufferView.getUint16(i).toString(16), 4) + " ";
    }
    if (typeof console === void 0) {
      console = console || { log: function() {
      } };
    }
    console.log(string.toUpperCase());
  }
};
if (typeof module !== "undefined" && module.exports) {
  module.exports = sjcl;
}
if (typeof define === "function") {
  define([], function() {
    return sjcl;
  });
}
var sjcl_default = sjcl;

// node_modules/@cloudflare/blindrsa-ts/lib/src/util.js
function assertNever(name, x) {
  throw new Error(`unexpected ${name} identifier: ${x}`);
}
function getHashParams(hash) {
  switch (hash) {
    case "SHA-1":
      return { name: hash, hLen: 20 };
    case "SHA-256":
      return { name: hash, hLen: 32 };
    case "SHA-384":
      return { name: hash, hLen: 48 };
    case "SHA-512":
      return { name: hash, hLen: 64 };
    default:
      assertNever("Hash", hash);
  }
}
function os2ip(bytes) {
  return sjcl_default.bn.fromBits(sjcl_default.codec.bytes.toBits(bytes));
}
function i2osp(num, byteLength) {
  if (Math.ceil(num.bitLength() / 8) > byteLength) {
    throw new Error(`number does not fit in ${byteLength} bytes`);
  }
  const bytes = new Uint8Array(byteLength);
  const unpadded = new Uint8Array(sjcl_default.codec.bytes.fromBits(num.toBits(void 0), false));
  bytes.set(unpadded, byteLength - unpadded.length);
  return bytes;
}
function joinAll2(a) {
  let size = 0;
  for (let i = 0; i < a.length; i++) {
    size += a[i].length;
  }
  const ret = new Uint8Array(new ArrayBuffer(size));
  for (let i = 0, offset = 0; i < a.length; i++) {
    ret.set(a[i], offset);
    offset += a[i].length;
  }
  return ret;
}
function xor(a, b) {
  if (a.length !== b.length || a.length === 0) {
    throw new Error("arrays of different length");
  }
  const n = a.length;
  const c = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    c[i] = a[i] ^ b[i];
  }
  return c;
}
function incCounter(c) {
  c[3]++;
  if (c[3] != 0) {
    return;
  }
  c[2]++;
  if (c[2] != 0) {
    return;
  }
  c[1]++;
  if (c[1] != 0) {
    return;
  }
  c[0]++;
  return;
}
async function mgf1(h, seed, mLen) {
  const n = Math.ceil(mLen / h.hLen);
  if (n > Math.pow(2, 32)) {
    throw new Error("mask too long");
  }
  let T = new Uint8Array();
  const counter = new Uint8Array(4);
  for (let i = 0; i < n; i++) {
    const hash = new Uint8Array(await crypto.subtle.digest(h.name, joinAll2([seed, counter])));
    T = joinAll2([T, hash]);
    incCounter(counter);
  }
  return T.subarray(0, mLen);
}
async function emsa_pss_encode(msg, emBits, opts, mgf = mgf1) {
  const { hash, sLen } = opts;
  const hashParams = getHashParams(hash);
  const { hLen } = hashParams;
  const emLen = Math.ceil(emBits / 8);
  const mHash = new Uint8Array(await crypto.subtle.digest(hash, msg));
  if (emLen < hLen + sLen + 2) {
    throw new Error("encoding error");
  }
  const salt = crypto.getRandomValues(new Uint8Array(sLen));
  const mPrime = joinAll2([new Uint8Array(8), mHash, salt]);
  const h = new Uint8Array(await crypto.subtle.digest(hash, mPrime));
  const ps = new Uint8Array(emLen - sLen - hLen - 2);
  const db = joinAll2([ps, Uint8Array.of(1), salt]);
  const dbMask = await mgf(hashParams, h, emLen - hLen - 1);
  const maskedDB = xor(db, dbMask);
  maskedDB[0] &= 255 >> 8 * emLen - emBits;
  const em = joinAll2([maskedDB, h, Uint8Array.of(188)]);
  return em;
}
function rsavp1(pkS, s) {
  if (!s.greaterEquals(new sjcl_default.bn(0)) || s.greaterEquals(pkS.n) == 1) {
    throw new Error("signature representative out of range");
  }
  const m = s.powermod(pkS.e, pkS.n);
  return m;
}
function rsasp1(skS, m) {
  if (!m.greaterEquals(new sjcl_default.bn(0)) || m.greaterEquals(skS.n) == 1) {
    throw new Error("signature representative out of range");
  }
  const s = m.powermod(skS.d, skS.n);
  return s;
}
function is_coprime(x, n) {
  try {
    x.inverseMod(n);
  } catch (_) {
    return false;
  }
  return true;
}
function random_integer_uniform(n, kLen) {
  const MAX_NUM_TRIES = 8;
  for (let i = 0; i < MAX_NUM_TRIES; i++) {
    const r = os2ip(crypto.getRandomValues(new Uint8Array(kLen)));
    if (!(r.greaterEquals(n) || r.equals(0))) {
      return r;
    }
  }
  throw new Error("reached maximum tries for random integer generation");
}

// node_modules/@cloudflare/blindrsa-ts/lib/src/blindrsa.js
var PrepareType;
(function(PrepareType2) {
  PrepareType2[PrepareType2["Deterministic"] = 0] = "Deterministic";
  PrepareType2[PrepareType2["Randomized"] = 32] = "Randomized";
})(PrepareType || (PrepareType = {}));
var BlindRSA = class _BlindRSA {
  constructor(params) {
    this.params = params;
    switch (params.prepareType) {
      case PrepareType.Deterministic:
      case PrepareType.Randomized:
        return;
      default:
        assertNever("PrepareType", params.prepareType);
    }
  }
  toString() {
    const hash = this.params.hash.replace("-", "");
    const pssType = "PSS" + (this.params.saltLength === 0 ? "ZERO" : "");
    const prepare = PrepareType[this.params.prepareType];
    return `RSABSSA-${hash}-${pssType}-${prepare}`;
  }
  prepare(msg) {
    const msg_prefix_len = this.params.prepareType;
    const msg_prefix = crypto.getRandomValues(new Uint8Array(msg_prefix_len));
    return joinAll2([msg_prefix, msg]);
  }
  // Returns the parameters of the input key: the JSONWebKey data, the length
  // in bits and in bytes of the modulus, and the hash function used.
  async extractKeyParams(key, type) {
    if (key.type !== type || key.algorithm.name !== _BlindRSA.NAME) {
      throw new Error(`key is not ${_BlindRSA.NAME}`);
    }
    if (!key.extractable) {
      throw new Error("key is not extractable");
    }
    const { modulusLength: modulusLengthBits, hash: hashFn } = key.algorithm;
    const modulusLengthBytes = Math.ceil(modulusLengthBits / 8);
    const hash = hashFn.name;
    if (hash.toLowerCase() !== this.params.hash.toLowerCase()) {
      throw new Error(`hash is not ${this.params.hash}`);
    }
    const jwkKey = await crypto.subtle.exportKey("jwk", key);
    return { jwkKey, modulusLengthBits, modulusLengthBytes, hash };
  }
  async blind(publicKey, msg) {
    const { jwkKey, modulusLengthBits: modulusLength, modulusLengthBytes: kLen, hash } = await this.extractKeyParams(publicKey, "public");
    if (!jwkKey.n || !jwkKey.e) {
      throw new Error("key has invalid parameters");
    }
    const n = sjcl_default.bn.fromBits(sjcl_default.codec.base64url.toBits(jwkKey.n));
    const e = sjcl_default.bn.fromBits(sjcl_default.codec.base64url.toBits(jwkKey.e));
    const pk = { e, n };
    const opts = { sLen: this.params.saltLength, hash };
    const encoded_msg = await emsa_pss_encode(msg, modulusLength - 1, opts);
    const m = os2ip(encoded_msg);
    const c = is_coprime(m, n);
    if (c === false) {
      throw new Error("invalid input");
    }
    const r = random_integer_uniform(n, kLen);
    let inv;
    try {
      inv = i2osp(r.inverseMod(n), kLen);
    } catch (e2) {
      throw new Error(`blinding error: ${e2.toString()}`);
    }
    const x = rsavp1(pk, r);
    const z = m.mulmod(x, n);
    const blindedMsg = i2osp(z, kLen);
    return { blindedMsg, inv };
  }
  async blindSign(privateKey, blindMsg) {
    if (this.params.supportsRSARAW) {
      return this.rsaRawBlingSign(privateKey, blindMsg);
    }
    const { jwkKey, modulusLengthBytes: kLen } = await this.extractKeyParams(privateKey, "private");
    if (!jwkKey.n || !jwkKey.d) {
      throw new Error("key has invalid parameters");
    }
    const n = sjcl_default.bn.fromBits(sjcl_default.codec.base64url.toBits(jwkKey.n));
    const d = sjcl_default.bn.fromBits(sjcl_default.codec.base64url.toBits(jwkKey.d));
    const e = sjcl_default.bn.fromBits(sjcl_default.codec.base64url.toBits(jwkKey.e));
    const sk = { n, d };
    const pk = { n, e };
    const m = os2ip(blindMsg);
    const s = rsasp1(sk, m);
    const mp = rsavp1(pk, s);
    if (m.equals(mp) === false) {
      throw new Error("signing failure");
    }
    return i2osp(s, kLen);
  }
  async rsaRawBlingSign(privateKey, blindMsg) {
    const algorithmName = privateKey.algorithm.name;
    privateKey.algorithm.name = _BlindRSA.NATIVE_SUPPORT_NAME;
    try {
      const signature = await crypto.subtle.sign({ name: _BlindRSA.NATIVE_SUPPORT_NAME }, privateKey, blindMsg);
      return new Uint8Array(signature);
    } finally {
      privateKey.algorithm.name = algorithmName;
    }
  }
  async finalize(publicKey, msg, blindSig, inv) {
    const { jwkKey, modulusLengthBytes: kLen } = await this.extractKeyParams(publicKey, "public");
    if (!jwkKey.n) {
      throw new Error("key has invalid parameters");
    }
    const n = sjcl_default.bn.fromBits(sjcl_default.codec.base64url.toBits(jwkKey.n));
    if (inv.length != kLen) {
      throw new Error("unexpected input size");
    }
    const rInv = os2ip(inv);
    if (blindSig.length != kLen) {
      throw new Error("unexpected input size");
    }
    const z = os2ip(blindSig);
    const s = z.mulmod(rInv, n);
    const sig = i2osp(s, kLen);
    const algorithm2 = { name: _BlindRSA.NAME, saltLength: this.params.saltLength };
    if (!await crypto.subtle.verify(algorithm2, publicKey, sig, msg)) {
      throw new Error("invalid signature");
    }
    return sig;
  }
  static generateKey(algorithm2) {
    return crypto.subtle.generateKey({ ...algorithm2, name: _BlindRSA.NAME }, true, [
      "sign",
      "verify"
    ]);
  }
  generateKey(algorithm2) {
    return _BlindRSA.generateKey({ ...algorithm2, hash: this.params.hash });
  }
  verify(publicKey, signature, message) {
    return crypto.subtle.verify({ name: _BlindRSA.NAME, saltLength: this.params.saltLength }, publicKey, signature, message);
  }
};
BlindRSA.NAME = "RSA-PSS";
BlindRSA.NATIVE_SUPPORT_NAME = "RSA-RAW";

// node_modules/@cloudflare/blindrsa-ts/lib/src/index.js
var Params = {
  RSABSSA_SHA384_PSS_Randomized: {
    name: "RSABSSA-SHA384-PSS-Randomized",
    hash: "SHA-384",
    saltLength: 48,
    prepareType: PrepareType.Randomized
  },
  RSABSSA_SHA384_PSS_Deterministic: {
    name: "RSABSSA-SHA384-PSS-Deterministic",
    hash: "SHA-384",
    saltLength: 48,
    prepareType: PrepareType.Deterministic
  },
  RSABSSA_SHA384_PSSZERO_Randomized: {
    name: "RSABSSA-SHA384-PSSZERO-Randomized",
    hash: "SHA-384",
    saltLength: 0,
    prepareType: PrepareType.Randomized
  },
  RSABSSA_SHA384_PSSZERO_Deterministic: {
    name: "RSABSSA-SHA384-PSSZERO-Deterministic",
    hash: "SHA-384",
    saltLength: 0,
    prepareType: PrepareType.Deterministic
  }
};
var RSABSSA = {
  SHA384: {
    generateKey: (algorithm2) => BlindRSA.generateKey({ ...algorithm2, hash: "SHA-384" }),
    PSS: {
      Randomized: (params = { supportsRSARAW: false }) => new BlindRSA({ ...Params.RSABSSA_SHA384_PSS_Randomized, ...params }),
      Deterministic: (params = { supportsRSARAW: false }) => new BlindRSA({ ...Params.RSABSSA_SHA384_PSS_Deterministic, ...params })
    },
    PSSZero: {
      Randomized: (params = { supportsRSARAW: false }) => new BlindRSA({ ...Params.RSABSSA_SHA384_PSSZERO_Randomized, ...params }),
      Deterministic: (params = { supportsRSARAW: false }) => new BlindRSA({ ...Params.RSABSSA_SHA384_PSSZERO_Deterministic, ...params })
    }
  }
};

// node_modules/@cloudflare/privacypass-ts/lib/src/pub_verif_token.js
var BlindRSAMode;
(function(BlindRSAMode3) {
  BlindRSAMode3[BlindRSAMode3["PSSZero"] = 0] = "PSSZero";
  BlindRSAMode3[BlindRSAMode3["PSS"] = 48] = "PSS";
})(BlindRSAMode || (BlindRSAMode = {}));
var BLINDRSA_EXTRA_PARAMS = {
  suite: {
    [BlindRSAMode.PSSZero]: RSABSSA.SHA384.PSSZero.Deterministic,
    [BlindRSAMode.PSS]: RSABSSA.SHA384.PSS.Deterministic
  },
  rsaParams: {
    name: "RSA-PSS",
    hash: "SHA-384"
  }
};
var BLIND_RSA = {
  value: 2,
  name: "Blind RSA (2048)",
  Nk: 256,
  Nid: 32,
  publicVerifiable: true,
  publicMetadata: false,
  privateMetadata: false,
  ...BLINDRSA_EXTRA_PARAMS
};
function keyGen(mode, algorithm2) {
  const suite = BLIND_RSA.suite[mode]();
  return suite.generateKey(algorithm2);
}
function getCryptoKey(publicKey) {
  const spkiEncoded = convertRSASSAPSSToEnc(publicKey);
  return crypto.subtle.importKey("spki", spkiEncoded, BLIND_RSA.rsaParams, true, ["verify"]);
}
async function getPublicKeyBytes(publicKey) {
  return new Uint8Array(await crypto.subtle.exportKey("spki", publicKey));
}
async function getTokenKeyID(publicKey) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", publicKey));
}
var TokenRequest = class _TokenRequest {
  truncatedTokenKeyId;
  blindedMsg;
  // struct {
  //     uint16_t token_type = 0x0002; /* Type Blind RSA (2048-bit) */
  //     uint8_t truncated_token_key_id;
  //     uint8_t blinded_msg[Nk];
  // } TokenRequest;
  tokenType;
  constructor(truncatedTokenKeyId, blindedMsg) {
    this.truncatedTokenKeyId = truncatedTokenKeyId;
    this.blindedMsg = blindedMsg;
    if (blindedMsg.length !== BLIND_RSA.Nk) {
      throw new Error("invalid blinded message size");
    }
    this.tokenType = BLIND_RSA.value;
  }
  static deserialize(bytes) {
    let offset = 0;
    const input = new DataView(bytes.buffer);
    const type = input.getUint16(offset);
    offset += 2;
    if (type !== BLIND_RSA.value) {
      throw new Error("mismatch of token type");
    }
    const tokenKeyId = input.getUint8(offset);
    offset += 1;
    const len = BLIND_RSA.Nk;
    const blindedMsg = new Uint8Array(input.buffer.slice(offset, offset + len));
    offset += len;
    return new _TokenRequest(tokenKeyId, blindedMsg);
  }
  serialize() {
    const output = new Array();
    let b = new ArrayBuffer(2);
    new DataView(b).setUint16(0, this.tokenType);
    output.push(b);
    b = new ArrayBuffer(1);
    new DataView(b).setUint8(0, this.truncatedTokenKeyId);
    output.push(b);
    b = this.blindedMsg.buffer;
    output.push(b);
    return new Uint8Array(joinAll(output));
  }
};
var TokenResponse = class _TokenResponse {
  blindSig;
  // struct {
  //     uint8_t blind_sig[Nk];
  // } TokenResponse;
  constructor(blindSig) {
    this.blindSig = blindSig;
    if (blindSig.length !== BLIND_RSA.Nk) {
      throw new Error("blind signature has invalid size");
    }
  }
  static deserialize(bytes) {
    return new _TokenResponse(bytes.slice(0, BLIND_RSA.Nk));
  }
  serialize() {
    return new Uint8Array(this.blindSig);
  }
};
function verifyToken(blindRSAMode, token, publicKeyIssuer) {
  return crypto.subtle.verify({
    ...BLIND_RSA.rsaParams,
    saltLength: blindRSAMode
  }, publicKeyIssuer, token.authenticator, token.authInput.serialize());
}
var Issuer = class {
  mode;
  name;
  privateKey;
  publicKey;
  params;
  constructor(mode, name, privateKey, publicKey, params) {
    this.mode = mode;
    this.name = name;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.params = params;
  }
  async issue(tokReq) {
    const suite = BLIND_RSA.suite[this.mode](this.params);
    const blindSig = await suite.blindSign(this.privateKey, tokReq.blindedMsg);
    return new TokenResponse(blindSig);
  }
  verify(token) {
    return verifyToken(this.mode, token, this.publicKey);
  }
};
var Client = class {
  mode;
  finData;
  suite;
  constructor(mode) {
    this.mode = mode;
    this.suite = BLIND_RSA.suite[this.mode]();
  }
  async createTokenRequest(tokChl, issuerPublicKey) {
    const nonce = crypto.getRandomValues(new Uint8Array(32));
    const challengeDigest = new Uint8Array(await crypto.subtle.digest("SHA-256", tokChl.serialize()));
    const tokenKeyId = await getTokenKeyID(issuerPublicKey);
    const authInput = new AuthenticatorInput(BLIND_RSA, BLIND_RSA.value, nonce, challengeDigest, tokenKeyId);
    const tokenInput = authInput.serialize();
    const pkIssuer = await getCryptoKey(issuerPublicKey);
    const { blindedMsg, inv } = await this.suite.blind(pkIssuer, tokenInput);
    const truncatedTokenKeyId = tokenKeyId[tokenKeyId.length - 1];
    const tokenRequest = new TokenRequest(truncatedTokenKeyId, blindedMsg);
    this.finData = { tokenInput, authInput, inv, pkIssuer };
    return tokenRequest;
  }
  deserializeTokenResponse(bytes) {
    return TokenResponse.deserialize(bytes);
  }
  async finalize(tokRes) {
    if (!this.finData) {
      throw new Error("no token request was created yet");
    }
    const authenticator = await this.suite.finalize(this.finData.pkIssuer, this.finData.tokenInput, tokRes.blindSig, this.finData.inv);
    const token = new Token(BLIND_RSA, this.finData.authInput, authenticator);
    this.finData = void 0;
    return token;
  }
};

// node_modules/@cloudflare/privacypass-ts/lib/src/priv_verif_token.js
var import_voprf_ts = __toESM(require_src(), 1);
var VOPRF_SUITE = import_voprf_ts.Oprf.Suite.P384_SHA384;
var VOPRF_GROUP = import_voprf_ts.Oprf.getGroup(VOPRF_SUITE);
var VOPRF_HASH = import_voprf_ts.Oprf.getHash(VOPRF_SUITE);
var VOPRF_EXTRA_PARAMS = {
  suite: VOPRF_SUITE,
  group: VOPRF_GROUP,
  Ne: VOPRF_GROUP.eltSize(),
  Ns: VOPRF_GROUP.scalarSize(),
  Nk: import_voprf_ts.Oprf.getOprfSize(VOPRF_SUITE),
  hash: VOPRF_HASH,
  dleqParams: {
    gg: VOPRF_GROUP,
    hashID: VOPRF_HASH,
    hash: import_voprf_ts.Oprf.Crypto.hash,
    dst: ""
  }
};
var VOPRF = {
  value: 1,
  name: "VOPRF (P-384, SHA-384)",
  Nid: 32,
  publicVerifiable: false,
  publicMetadata: false,
  privateMetadata: false,
  ...VOPRF_EXTRA_PARAMS
};

// node_modules/@cloudflare/privacypass-ts/lib/src/issuance.js
var PRIVATE_TOKEN_ISSUER_DIRECTORY = "/.well-known/private-token-issuer-directory";
var MediaType;
(function(MediaType2) {
  MediaType2["PRIVATE_TOKEN_ISSUER_DIRECTORY"] = "application/private-token-issuer-directory";
  MediaType2["PRIVATE_TOKEN_REQUEST"] = "application/private-token-request";
  MediaType2["PRIVATE_TOKEN_RESPONSE"] = "application/private-token-response";
})(MediaType || (MediaType = {}));

// node_modules/@cloudflare/privacypass-ts/lib/src/index.js
var util = { convertEncToRSASSAPSS, convertRSASSAPSSToEnc };
var TOKEN_TYPES = {
  // Token Type Blind RSA (2048-bit)
  BLIND_RSA,
  // Token Type VOPRF (P-384, SHA-384)
  VOPRF
};

// src/cache.ts
var getDirectoryCache = async () => {
  return caches.open("response/issuer-directory");
};
var DIRECTORY_CACHE_REQUEST = (hostname) => new Request(`https://${hostname}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);
var clearDirectoryCache = async (ctx) => {
  const cache = await getDirectoryCache();
  return cache.delete(DIRECTORY_CACHE_REQUEST(ctx.hostname));
};
var serialize = (value) => {
  return JSON.stringify(value, (_key, value2) => {
    if (value2 instanceof Uint8Array) {
      return `u8-${u8ToB64(value2)}`;
    }
    if (value2 instanceof Date) {
      return `date-${value2.toJSON()}`;
    }
    if (typeof value2 === "string") {
      if (value2.startsWith("u8-") || value2.startsWith("date-")) {
        throw new Error("serialization error");
      }
    }
    return value2;
  });
};
var deserialize = (value) => {
  return JSON.parse(value, (_key, value2) => {
    if (!value2) {
      return value2;
    }
    if (value2.startsWith && value2.startsWith("u8-")) {
      return b64Tou8(value2.slice("u8-".length));
    }
    if (value2.startsWith && value2.startsWith("date-")) {
      return new Date(value2.slice("date-".length));
    }
    return value2;
  });
};
var STALE_WHILE_REVALIDATE_IN_MS = 3e4;
function shouldRevalidate(expirationDate) {
  const now = Date.now();
  const expiration = expirationDate.getTime();
  const timeSinceExpiration = now - expiration;
  if (timeSinceExpiration <= 0) {
    return false;
  }
  if (timeSinceExpiration >= STALE_WHILE_REVALIDATE_IN_MS) {
    return true;
  }
  const PRECOMPUTED_PROBABILITY_THESHOLD = [
    9313225746154785e-25,
    1862645149230957e-24,
    3725290298461914e-24,
    7450580596923828e-24,
    1490116119384765e-23,
    2980232238769531e-23,
    5960464477539063e-23,
    1192092895507812e-22,
    2384185791015625e-22,
    476837158203125e-21,
    95367431640625e-20,
    19073486328125e-19,
    3814697265625e-18,
    762939453125e-17,
    152587890625e-16,
    30517578125e-15,
    6103515625e-14,
    1220703125e-13,
    244140625e-12,
    48828125e-11,
    9765625e-10,
    1953125e-9,
    390625e-8,
    78125e-7,
    0.015625,
    0.03125,
    0.0625,
    0.125,
    0.25,
    0.5
  ];
  const timeSinceExpirationWholeSeconds = Math.floor(timeSinceExpiration / 1e3);
  const probabilityThreshold = PRECOMPUTED_PROBABILITY_THESHOLD[timeSinceExpirationWholeSeconds];
  return Math.random() < probabilityThreshold;
}
var InMemoryCryptoKeyCache = class _InMemoryCryptoKeyCache {
  constructor(ctx) {
    this.ctx = ctx;
  }
  static {
    this.store = /* @__PURE__ */ new Map();
  }
  // The read method tries to retrieve the cached value, refresh it if necessary, and return the cached or refreshed value
  async read(key, setValFn) {
    const refreshCache = async () => {
      const val = await setValFn(key);
      _InMemoryCryptoKeyCache.store.set(key, val);
      return val.value;
    };
    const cachedValue = _InMemoryCryptoKeyCache.store.get(key);
    if (cachedValue) {
      this.ctx.waitUntil(
        (() => {
          const expiration = new Date(cachedValue.expiration.getTime());
          if (shouldRevalidate(expiration)) {
            this.ctx.wshimLogger.log("InMemoryCache is stale. Revalidating with waitUntil.");
            return refreshCache();
          }
          return Promise.resolve();
        })()
      );
      return cachedValue.value;
    }
    return refreshCache();
  }
};
var InMemoryCache = class _InMemoryCache {
  constructor(ctx) {
    this.ctx = ctx;
  }
  static {
    this.store = /* @__PURE__ */ new Map();
  }
  async read(key, setValFn) {
    const refreshCache = async () => {
      const val = await setValFn(key);
      const newCacheValue = { value: serialize(val.value), expiration: val.expiration };
      _InMemoryCache.store.set(key, newCacheValue);
      return val.value;
    };
    const cachedValue = _InMemoryCache.store.get(key);
    if (cachedValue) {
      this.ctx.waitUntil(
        (() => {
          const expiration = new Date(cachedValue.expiration.getTime());
          if (shouldRevalidate(expiration)) {
            this.ctx.wshimLogger.log("InMemoryCache is stale. Revalidating with waitUntil.");
            return refreshCache();
          }
          return Promise.resolve();
        })()
      );
      return deserialize(cachedValue.value);
    }
    return refreshCache();
  }
};
var APICache = class {
  constructor(ctx, cacheKey) {
    this.ctx = ctx;
    this.cacheKey = cacheKey;
  }
  async read(key, setValFn) {
    const cache = await caches.open(this.cacheKey);
    const request = new Request(`https://${this.ctx.hostname}/${key}`);
    const refreshCache = async () => {
      const val = await setValFn(key);
      val.expiration.setTime(val.expiration.getTime() + STALE_WHILE_REVALIDATE_IN_MS);
      await cache.put(
        request,
        new Response(serialize(val.value), {
          headers: {
            "expires": val.expiration.toUTCString(),
            "x-expires": val.expiration.toUTCString()
            // somehow `expires` header is modified by cache. Using a distinct header allows the header to be preserved for internal processing
          }
        })
      );
      return val.value;
    };
    const cachedValue = await cache.match(request);
    if (cachedValue) {
      this.ctx.waitUntil(
        (() => {
          const now = Date.now();
          const expirationWithRevalidate = new Date(cachedValue.headers.get("x-expires") ?? now);
          const expiration = new Date(
            expirationWithRevalidate.getTime() - STALE_WHILE_REVALIDATE_IN_MS
          );
          if (shouldRevalidate(expiration)) {
            this.ctx.wshimLogger.log("APICache is stale. Revalidating with waitUntil.");
            return refreshCache();
          }
          return Promise.resolve();
        })()
      );
      const val = await cachedValue.text();
      return deserialize(val);
    }
    return refreshCache();
  }
};
var CascadingCache = class {
  constructor(...caches2) {
    this.caches = caches2;
  }
  async read(key, setValFn) {
    const caches2 = this.caches;
    const setValFnBuilder = (i) => {
      if (i >= caches2.length) {
        return setValFn;
      }
      return async (key2) => ({
        value: await caches2[i].read(key2, setValFnBuilder(i + 1)),
        expiration: /* @__PURE__ */ new Date()
        // TODO: find a way to use setVal expiration instead
      });
    };
    const cachedValue = await setValFnBuilder(0)(key);
    return cachedValue.value;
  }
};
var DEFAULT_R2_BUCKET_CACHE_TTL_IN_MS = 5 * 60 * 1e3;
var CachedR2Object = class {
  constructor(object, data) {
    this.data = data;
    this.checksums = object.checksums;
    this.customMetadata = object.customMetadata;
    this.etag = object.etag;
    this.httpEtag = object.httpEtag;
    this.httpMetadata = object.httpMetadata;
    this.key = object.key;
    this.size = object.size;
    this.uploaded = object.uploaded;
    this.version = object.version;
  }
};
var CachedR2Objects = class {
  constructor(objects) {
    this.delimitedPrefixes = objects.delimitedPrefixes;
    this.objects = objects.objects.map((o) => new CachedR2Object(o));
    this.truncated = objects.truncated;
  }
};
var R2Method = {
  DELETE: "delete",
  GET: "get",
  HEAD: "head",
  LIST: "list",
  PUT: "put"
};
var R2MethodSet = new Set(Object.values(R2Method));
var CachedR2Bucket = class {
  constructor(ctx, bucket, cache, ttl_in_ms = DEFAULT_R2_BUCKET_CACHE_TTL_IN_MS) {
    this.ctx = ctx;
    this.cache = cache;
    this.ttl_in_ms = ttl_in_ms;
    this.bucket = new Proxy(bucket, {
      get: (target, prop, receiver) => {
        const method = Reflect.get(target, prop, receiver);
        if (R2MethodSet.has(prop.toString())) {
          const startTime = ctx.performance.now();
          return async function(...args) {
            try {
              return await Reflect.apply(method, target, args);
            } finally {
              const duration = ctx.performance.now() - startTime;
              ctx.metrics.r2RequestsDurationMs.observe(duration, { method: prop.toString() });
            }
          };
        }
        return method;
      }
    });
  }
  shouldUseCache(options) {
    return options?.shouldUseCache ?? true;
  }
  // WARNING: key should be lowered than 1024 bytes
  // See https://developers.cloudflare.com/r2/reference/limits/
  head(key, options) {
    if (!this.shouldUseCache(options)) {
      return this.bucket.head(key);
    }
    const cacheKey = `head/${key}`;
    return this.cache.read(cacheKey, async () => {
      const object = await this.bucket.head(key);
      if (object === null) {
        return { value: null, expiration: /* @__PURE__ */ new Date() };
      }
      const value = new CachedR2Object(object);
      return {
        value,
        expiration: new Date(Date.now() + this.ttl_in_ms)
      };
    });
  }
  list(options) {
    if (!this.shouldUseCache(options)) {
      return this.bucket.list(options);
    }
    const cacheKey = `list/${JSON.stringify(options)}`;
    return this.cache.read(cacheKey, async () => {
      const objects = await this.bucket.list(options);
      const value = new CachedR2Objects(objects);
      return {
        value,
        expiration: new Date(Date.now() + this.ttl_in_ms)
      };
    });
  }
  // WARNING: key should be lowered than 1024 bytes
  // See https://developers.cloudflare.com/r2/reference/limits/
  async get(key, options) {
    if (!this.shouldUseCache(options)) {
      return this.bucket.get(key, options);
    }
    const cacheKey = `get/${key}`;
    return this.cache.read(cacheKey, async () => {
      const object = await this.bucket.get(key, options);
      if (object === null) {
        return { value: null, expiration: /* @__PURE__ */ new Date() };
      }
      const value = new CachedR2Object(object, new Uint8Array(await object.arrayBuffer()));
      return {
        value,
        expiration: new Date(Date.now() + this.ttl_in_ms)
      };
    });
  }
  put(...args) {
    return this.bucket.put(...args);
  }
  delete(...args) {
    return this.bucket.delete(...args);
  }
};

// src/utils/promises.ts
var DEFAULT_RETRIES = 2;
function asyncRetries(ctx, f, retries = DEFAULT_RETRIES, labels = {}) {
  return async function(...args) {
    let result;
    let error;
    let i = 0;
    for (i = 0; i < retries; i += 1) {
      try {
        result = await f(...args);
        break;
      } catch (e) {
        error = e;
      }
    }
    const shouldReturnResult = i < retries;
    ctx.metrics.asyncRetriesTotal.inc({
      retries: i,
      success: shouldReturnResult ? "true" : "false",
      ...labels
    });
    if (!shouldReturnResult) {
      throw error;
    }
    return result;
  };
}

// src/context/index.ts
var Context = class {
  constructor(request, env, _waitUntil, logger2, metrics, wshimLogger) {
    this.env = env;
    this._waitUntil = _waitUntil;
    this.logger = logger2;
    this.metrics = metrics;
    this.wshimLogger = wshimLogger;
    this.promises = [];
    const ctx = this;
    const cache = new CascadingCache(new InMemoryCache(ctx), new APICache(ctx, "r2/issuance_keys"));
    const cachedR2Bucket = new CachedR2Bucket(ctx, env.ISSUANCE_KEYS, cache);
    const cachedR2BucketWithRetries = new Proxy(cachedR2Bucket, {
      get: (target, prop, receiver) => {
        const method = Reflect.get(target, prop, receiver);
        if (typeof method !== "function") {
          return method;
        }
        const operation = typeof prop === "string" ? prop : prop.toString();
        const asyncMethod = asyncRetries(ctx, method.bind(target), DEFAULT_RETRIES, { operation });
        return asyncMethod;
      }
    });
    this.hostname = new URL(request.url).hostname;
    this.bucket = {
      ISSUANCE_KEYS: cachedR2BucketWithRetries
    };
    this.performance = env.PERFORMANCE ?? self.performance;
    this.startTime = this.performance.now();
  }
  isTest() {
    return false;
  }
  /**
   * Registers async tasks with the runtime, tracks them internally and adds error reporting for uncaught exceptions
   * @param p - Promise for the async task to track
   */
  waitUntil(p) {
    this._waitUntil(p);
    this.promises.push(
      p.catch((e) => {
        this.wshimLogger.error(e.message);
      })
    );
  }
  /**
   * Waits for promises to complete in the order that they were registered.
   *
   * @remark
   * It is important to wait for the promises in the array to complete sequentially since new promises created by async tasks may be added to the end of the array while this function runs.
   */
  async waitForPromises() {
    for (let i = 0; i < this.promises.length; i++) {
      try {
        await this.promises[i];
      } catch (e) {
        this.wshimLogger.error(e);
      }
    }
  }
};

// node_modules/@sentry/utils/esm/is.js
var objectToString = Object.prototype.toString;
function isError(wat) {
  switch (objectToString.call(wat)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}
function isString(wat) {
  return isBuiltin(wat, "String");
}
function isPrimitive(wat) {
  return wat === null || typeof wat !== "object" && typeof wat !== "function";
}
function isPlainObject(wat) {
  return isBuiltin(wat, "Object");
}
function isEvent(wat) {
  return typeof Event !== "undefined" && isInstanceOf(wat, Event);
}
function isElement(wat) {
  return typeof Element !== "undefined" && isInstanceOf(wat, Element);
}
function isThenable(wat) {
  return Boolean(wat && wat.then && typeof wat.then === "function");
}
function isSyntheticEvent(wat) {
  return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
}
function isNaN2(wat) {
  return typeof wat === "number" && wat !== wat;
}
function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}
function isVueViewModel(wat) {
  return !!(typeof wat === "object" && wat !== null && (wat.__isVue || wat._isVue));
}

// node_modules/@sentry/utils/esm/string.js
function truncate(str, max = 0) {
  if (typeof str !== "string" || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.slice(0, max)}...`;
}

// node_modules/@sentry/utils/esm/worldwide.js
function isGlobalObj(obj) {
  return obj && obj.Math == Math ? obj : void 0;
}
var GLOBAL_OBJ = typeof globalThis == "object" && isGlobalObj(globalThis) || // eslint-disable-next-line no-restricted-globals
typeof window == "object" && isGlobalObj(window) || typeof self == "object" && isGlobalObj(self) || typeof global == "object" && isGlobalObj(global) || /* @__PURE__ */ function() {
  return this;
}() || {};
function getGlobalObject() {
  return GLOBAL_OBJ;
}
function getGlobalSingleton(name, creator, obj) {
  const gbl = obj || GLOBAL_OBJ;
  const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
  const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
  return singleton;
}

// node_modules/@sentry/utils/esm/browser.js
var WINDOW = getGlobalObject();
var DEFAULT_MAX_STRING_LENGTH = 80;
function htmlTreeAsString(elem, options = {}) {
  if (!elem) {
    return "<unknown>";
  }
  try {
    let currentElem = elem;
    const MAX_TRAVERSE_HEIGHT = 5;
    const out = [];
    let height = 0;
    let len = 0;
    const separator = " > ";
    const sepLength = separator.length;
    let nextStr;
    const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
    const maxStringLength = !Array.isArray(options) && options.maxStringLength || DEFAULT_MAX_STRING_LENGTH;
    while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
      nextStr = _htmlElementAsString(currentElem, keyAttrs);
      if (nextStr === "html" || height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength) {
        break;
      }
      out.push(nextStr);
      len += nextStr.length;
      currentElem = currentElem.parentNode;
    }
    return out.reverse().join(separator);
  } catch (_oO) {
    return "<unknown>";
  }
}
function _htmlElementAsString(el, keyAttrs) {
  const elem = el;
  const out = [];
  let className;
  let classes;
  let key;
  let attr;
  let i;
  if (!elem || !elem.tagName) {
    return "";
  }
  out.push(elem.tagName.toLowerCase());
  const keyAttrPairs = keyAttrs && keyAttrs.length ? keyAttrs.filter((keyAttr) => elem.getAttribute(keyAttr)).map((keyAttr) => [keyAttr, elem.getAttribute(keyAttr)]) : null;
  if (keyAttrPairs && keyAttrPairs.length) {
    keyAttrPairs.forEach((keyAttrPair) => {
      out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
    });
  } else {
    if (elem.id) {
      out.push(`#${elem.id}`);
    }
    className = elem.className;
    if (className && isString(className)) {
      classes = className.split(/\s+/);
      for (i = 0; i < classes.length; i++) {
        out.push(`.${classes[i]}`);
      }
    }
  }
  const allowedAttrs = ["aria-label", "type", "name", "title", "alt"];
  for (i = 0; i < allowedAttrs.length; i++) {
    key = allowedAttrs[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.push(`[${key}="${attr}"]`);
    }
  }
  return out.join("");
}

// node_modules/@sentry/utils/esm/logger.js
var PREFIX = "Sentry Logger ";
var CONSOLE_LEVELS = ["debug", "info", "warn", "error", "log", "assert", "trace"];
var originalConsoleMethods = {};
function consoleSandbox(callback) {
  if (!("console" in GLOBAL_OBJ)) {
    return callback();
  }
  const console2 = GLOBAL_OBJ.console;
  const wrappedFuncs = {};
  const wrappedLevels = Object.keys(originalConsoleMethods);
  wrappedLevels.forEach((level) => {
    const originalConsoleMethod = originalConsoleMethods[level];
    wrappedFuncs[level] = console2[level];
    console2[level] = originalConsoleMethod;
  });
  try {
    return callback();
  } finally {
    wrappedLevels.forEach((level) => {
      console2[level] = wrappedFuncs[level];
    });
  }
}
function makeLogger() {
  let enabled = false;
  const logger2 = {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
    isEnabled: () => enabled
  };
  if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
    CONSOLE_LEVELS.forEach((name) => {
      logger2[name] = (...args) => {
        if (enabled) {
          consoleSandbox(() => {
            GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
          });
        }
      };
    });
  } else {
    CONSOLE_LEVELS.forEach((name) => {
      logger2[name] = () => void 0;
    });
  }
  return logger2;
}
var logger = makeLogger();

// node_modules/@sentry/utils/esm/dsn.js
var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
  return protocol === "http" || protocol === "https";
}
function dsnToString(dsn, withPassword = false) {
  const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
  return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
}
function dsnFromString(str) {
  const match = DSN_REGEX.exec(str);
  if (!match) {
    console.error(`Invalid Sentry Dsn: ${str}`);
    return void 0;
  }
  const [protocol, publicKey, pass = "", host, port = "", lastPath] = match.slice(1);
  let path = "";
  let projectId = lastPath;
  const split = projectId.split("/");
  if (split.length > 1) {
    path = split.slice(0, -1).join("/");
    projectId = split.pop();
  }
  if (projectId) {
    const projectMatch = projectId.match(/^\d+/);
    if (projectMatch) {
      projectId = projectMatch[0];
    }
  }
  return dsnFromComponents({ host, pass, path, projectId, port, protocol, publicKey });
}
function dsnFromComponents(components) {
  return {
    protocol: components.protocol,
    publicKey: components.publicKey || "",
    pass: components.pass || "",
    host: components.host,
    port: components.port || "",
    path: components.path || "",
    projectId: components.projectId
  };
}
function validateDsn(dsn) {
  if (!(typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__)) {
    return true;
  }
  const { port, projectId, protocol } = dsn;
  const requiredComponents = ["protocol", "publicKey", "host", "projectId"];
  const hasMissingRequiredComponent = requiredComponents.find((component) => {
    if (!dsn[component]) {
      logger.error(`Invalid Sentry Dsn: ${component} missing`);
      return true;
    }
    return false;
  });
  if (hasMissingRequiredComponent) {
    return false;
  }
  if (!projectId.match(/^\d+$/)) {
    logger.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
    return false;
  }
  if (!isValidProtocol(protocol)) {
    logger.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
    return false;
  }
  if (port && isNaN(parseInt(port, 10))) {
    logger.error(`Invalid Sentry Dsn: Invalid port ${port}`);
    return false;
  }
  return true;
}
function makeDsn(from) {
  const components = typeof from === "string" ? dsnFromString(from) : dsnFromComponents(from);
  if (!components || !validateDsn(components)) {
    return void 0;
  }
  return components;
}

// node_modules/@sentry/utils/esm/error.js
var SentryError = class extends Error {
  /** Display name of this error instance. */
  constructor(message, logLevel = "warn") {
    super(message);
    this.message = message;
    this.name = new.target.prototype.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    this.logLevel = logLevel;
  }
};

// node_modules/@sentry/utils/esm/object.js
function fill(source, name, replacementFactory) {
  if (!(name in source)) {
    return;
  }
  const original = source[name];
  const wrapped = replacementFactory(original);
  if (typeof wrapped === "function") {
    markFunctionWrapped(wrapped, original);
  }
  source[name] = wrapped;
}
function addNonEnumerableProperty(obj, name, value) {
  try {
    Object.defineProperty(obj, name, {
      // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
      value,
      writable: true,
      configurable: true
    });
  } catch (o_O) {
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Failed to add non-enumerable property "${name}" to object`, obj);
  }
}
function markFunctionWrapped(wrapped, original) {
  try {
    const proto = original.prototype || {};
    wrapped.prototype = original.prototype = proto;
    addNonEnumerableProperty(wrapped, "__sentry_original__", original);
  } catch (o_O) {
  }
}
function urlEncode(object) {
  return Object.keys(object).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join("&");
}
function convertToPlainObject(value) {
  if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...getOwnProperties(value)
    };
  } else if (isEvent(value)) {
    const newObj = {
      type: value.type,
      target: serializeEventTarget(value.target),
      currentTarget: serializeEventTarget(value.currentTarget),
      ...getOwnProperties(value)
    };
    if (typeof CustomEvent !== "undefined" && isInstanceOf(value, CustomEvent)) {
      newObj.detail = value.detail;
    }
    return newObj;
  } else {
    return value;
  }
}
function serializeEventTarget(target) {
  try {
    return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
  } catch (_oO) {
    return "<unknown>";
  }
}
function getOwnProperties(obj) {
  if (typeof obj === "object" && obj !== null) {
    const extractedProps = {};
    for (const property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        extractedProps[property] = obj[property];
      }
    }
    return extractedProps;
  } else {
    return {};
  }
}
function extractExceptionKeysForMessage(exception, maxLength = 40) {
  const keys = Object.keys(convertToPlainObject(exception));
  keys.sort();
  if (!keys.length) {
    return "[object has no keys]";
  }
  if (keys[0].length >= maxLength) {
    return truncate(keys[0], maxLength);
  }
  for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
    const serialized = keys.slice(0, includedKeys).join(", ");
    if (serialized.length > maxLength) {
      continue;
    }
    if (includedKeys === keys.length) {
      return serialized;
    }
    return truncate(serialized, maxLength);
  }
  return "";
}
function dropUndefinedKeys(inputValue) {
  const memoizationMap = /* @__PURE__ */ new Map();
  return _dropUndefinedKeys(inputValue, memoizationMap);
}
function _dropUndefinedKeys(inputValue, memoizationMap) {
  if (isPlainObject(inputValue)) {
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== void 0) {
      return memoVal;
    }
    const returnValue = {};
    memoizationMap.set(inputValue, returnValue);
    for (const key of Object.keys(inputValue)) {
      if (typeof inputValue[key] !== "undefined") {
        returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
      }
    }
    return returnValue;
  }
  if (Array.isArray(inputValue)) {
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== void 0) {
      return memoVal;
    }
    const returnValue = [];
    memoizationMap.set(inputValue, returnValue);
    inputValue.forEach((item) => {
      returnValue.push(_dropUndefinedKeys(item, memoizationMap));
    });
    return returnValue;
  }
  return inputValue;
}

// node_modules/@sentry/utils/esm/node-stack-trace.js
function filenameIsInApp(filename, isNative = false) {
  const isInternal = isNative || filename && // It's not internal if it's an absolute linux path
  !filename.startsWith("/") && // It's not internal if it's an absolute windows path
  !filename.includes(":\\") && // It's not internal if the path is starting with a dot
  !filename.startsWith(".") && // It's not internal if the frame has a protocol. In node, this is usually the case if the file got pre-processed with a bundler like webpack
  !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//);
  return !isInternal && filename !== void 0 && !filename.includes("node_modules/");
}
function node(getModule2) {
  const FILENAME_MATCH = /^\s*[-]{4,}$/;
  const FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
  return (line) => {
    const lineMatch = line.match(FULL_MATCH);
    if (lineMatch) {
      let object;
      let method;
      let functionName;
      let typeName;
      let methodName;
      if (lineMatch[1]) {
        functionName = lineMatch[1];
        let methodStart = functionName.lastIndexOf(".");
        if (functionName[methodStart - 1] === ".") {
          methodStart--;
        }
        if (methodStart > 0) {
          object = functionName.slice(0, methodStart);
          method = functionName.slice(methodStart + 1);
          const objectEnd = object.indexOf(".Module");
          if (objectEnd > 0) {
            functionName = functionName.slice(objectEnd + 1);
            object = object.slice(0, objectEnd);
          }
        }
        typeName = void 0;
      }
      if (method) {
        typeName = object;
        methodName = method;
      }
      if (method === "<anonymous>") {
        methodName = void 0;
        functionName = void 0;
      }
      if (functionName === void 0) {
        methodName = methodName || "<anonymous>";
        functionName = typeName ? `${typeName}.${methodName}` : methodName;
      }
      let filename = lineMatch[2] && lineMatch[2].startsWith("file://") ? lineMatch[2].slice(7) : lineMatch[2];
      const isNative = lineMatch[5] === "native";
      if (!filename && lineMatch[5] && !isNative) {
        filename = lineMatch[5];
      }
      return {
        filename,
        module: getModule2 ? getModule2(filename) : void 0,
        function: functionName,
        lineno: parseInt(lineMatch[3], 10) || void 0,
        colno: parseInt(lineMatch[4], 10) || void 0,
        in_app: filenameIsInApp(filename, isNative)
      };
    }
    if (line.match(FILENAME_MATCH)) {
      return {
        filename: line
      };
    }
    return void 0;
  };
}

// node_modules/@sentry/utils/esm/stacktrace.js
var STACKTRACE_FRAME_LIMIT = 50;
var WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
var STRIP_FRAME_REGEXP = /captureMessage|captureException/;
function createStackParser(...parsers) {
  const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return (stack, skipFirst = 0) => {
    const frames = [];
    const lines = stack.split("\n");
    for (let i = skipFirst; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 1024) {
        continue;
      }
      const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
      if (cleanedLine.match(/\S*Error: /)) {
        continue;
      }
      for (const parser of sortedParsers) {
        const frame = parser(cleanedLine);
        if (frame) {
          frames.push(frame);
          break;
        }
      }
      if (frames.length >= STACKTRACE_FRAME_LIMIT) {
        break;
      }
    }
    return stripSentryFramesAndReverse(frames);
  };
}
function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser);
  }
  return stackParser;
}
function stripSentryFramesAndReverse(stack) {
  if (!stack.length) {
    return [];
  }
  const localStack = Array.from(stack);
  if (/sentryWrapped/.test(localStack[localStack.length - 1].function || "")) {
    localStack.pop();
  }
  localStack.reverse();
  if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
    localStack.pop();
    if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
      localStack.pop();
    }
  }
  return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame) => ({
    ...frame,
    filename: frame.filename || localStack[localStack.length - 1].filename,
    function: frame.function || "?"
  }));
}
var defaultFunctionName = "<anonymous>";
function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== "function") {
      return defaultFunctionName;
    }
    return fn.name || defaultFunctionName;
  } catch (e) {
    return defaultFunctionName;
  }
}
function nodeStackLineParser(getModule2) {
  return [90, node(getModule2)];
}

// node_modules/@sentry/utils/esm/supports.js
var WINDOW2 = getGlobalObject();
function supportsFetch() {
  if (!("fetch" in WINDOW2)) {
    return false;
  }
  try {
    new Headers();
    new Request("http://www.example.com");
    new Response();
    return true;
  } catch (e) {
    return false;
  }
}
function isNativeFetch(func) {
  return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
function supportsNativeFetch() {
  if (!supportsFetch()) {
    return false;
  }
  if (isNativeFetch(WINDOW2.fetch)) {
    return true;
  }
  let result = false;
  const doc = WINDOW2.document;
  if (doc && typeof doc.createElement === "function") {
    try {
      const sandbox = doc.createElement("iframe");
      sandbox.hidden = true;
      doc.head.appendChild(sandbox);
      if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
        result = isNativeFetch(sandbox.contentWindow.fetch);
      }
      doc.head.removeChild(sandbox);
    } catch (err) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
    }
  }
  return result;
}

// node_modules/@sentry/utils/esm/vendor/supportsHistory.js
var WINDOW3 = getGlobalObject();
function supportsHistory() {
  const chrome = WINDOW3.chrome;
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi = "history" in WINDOW3 && !!WINDOW3.history.pushState && !!WINDOW3.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}

// node_modules/@sentry/utils/esm/instrument.js
var WINDOW4 = getGlobalObject();
var SENTRY_XHR_DATA_KEY = "__sentry_xhr_v2__";
var handlers = {};
var instrumented = {};
function instrument(type) {
  if (instrumented[type]) {
    return;
  }
  instrumented[type] = true;
  switch (type) {
    case "console":
      instrumentConsole();
      break;
    case "dom":
      instrumentDOM();
      break;
    case "xhr":
      instrumentXHR();
      break;
    case "fetch":
      instrumentFetch();
      break;
    case "history":
      instrumentHistory();
      break;
    case "error":
      instrumentError();
      break;
    case "unhandledrejection":
      instrumentUnhandledRejection();
      break;
    default:
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("unknown instrumentation type:", type);
      return;
  }
}
function addInstrumentationHandler(type, callback) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(callback);
  instrument(type);
}
function triggerHandlers(type, data) {
  if (!type || !handlers[type]) {
    return;
  }
  for (const handler2 of handlers[type] || []) {
    try {
      handler2(data);
    } catch (e) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error(
        `Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler2)}
Error:`,
        e
      );
    }
  }
}
function instrumentConsole() {
  if (!("console" in GLOBAL_OBJ)) {
    return;
  }
  CONSOLE_LEVELS.forEach(function(level) {
    if (!(level in GLOBAL_OBJ.console)) {
      return;
    }
    fill(GLOBAL_OBJ.console, level, function(originalConsoleMethod) {
      originalConsoleMethods[level] = originalConsoleMethod;
      return function(...args) {
        triggerHandlers("console", { args, level });
        const log = originalConsoleMethods[level];
        log && log.apply(GLOBAL_OBJ.console, args);
      };
    });
  });
}
function instrumentFetch() {
  if (!supportsNativeFetch()) {
    return;
  }
  fill(GLOBAL_OBJ, "fetch", function(originalFetch) {
    return function(...args) {
      const { method, url } = parseFetchArgs(args);
      const handlerData = {
        args,
        fetchData: {
          method,
          url
        },
        startTimestamp: Date.now()
      };
      triggerHandlers("fetch", {
        ...handlerData
      });
      return originalFetch.apply(GLOBAL_OBJ, args).then(
        (response) => {
          triggerHandlers("fetch", {
            ...handlerData,
            endTimestamp: Date.now(),
            response
          });
          return response;
        },
        (error) => {
          triggerHandlers("fetch", {
            ...handlerData,
            endTimestamp: Date.now(),
            error
          });
          throw error;
        }
      );
    };
  });
}
function hasProp(obj, prop) {
  return !!obj && typeof obj === "object" && !!obj[prop];
}
function getUrlFromResource(resource) {
  if (typeof resource === "string") {
    return resource;
  }
  if (!resource) {
    return "";
  }
  if (hasProp(resource, "url")) {
    return resource.url;
  }
  if (resource.toString) {
    return resource.toString();
  }
  return "";
}
function parseFetchArgs(fetchArgs) {
  if (fetchArgs.length === 0) {
    return { method: "GET", url: "" };
  }
  if (fetchArgs.length === 2) {
    const [url, options] = fetchArgs;
    return {
      url: getUrlFromResource(url),
      method: hasProp(options, "method") ? String(options.method).toUpperCase() : "GET"
    };
  }
  const arg = fetchArgs[0];
  return {
    url: getUrlFromResource(arg),
    method: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET"
  };
}
function instrumentXHR() {
  if (!WINDOW4.XMLHttpRequest) {
    return;
  }
  const xhrproto = XMLHttpRequest.prototype;
  fill(xhrproto, "open", function(originalOpen) {
    return function(...args) {
      const startTimestamp = Date.now();
      const url = args[1];
      const xhrInfo = this[SENTRY_XHR_DATA_KEY] = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        method: isString(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
        request_headers: {}
      };
      if (isString(url) && xhrInfo.method === "POST" && url.match(/sentry_key/)) {
        this.__sentry_own_request__ = true;
      }
      const onreadystatechangeHandler = () => {
        const xhrInfo2 = this[SENTRY_XHR_DATA_KEY];
        if (!xhrInfo2) {
          return;
        }
        if (this.readyState === 4) {
          try {
            xhrInfo2.status_code = this.status;
          } catch (e) {
          }
          triggerHandlers("xhr", {
            args,
            endTimestamp: Date.now(),
            startTimestamp,
            xhr: this
          });
        }
      };
      if ("onreadystatechange" in this && typeof this.onreadystatechange === "function") {
        fill(this, "onreadystatechange", function(original) {
          return function(...readyStateArgs) {
            onreadystatechangeHandler();
            return original.apply(this, readyStateArgs);
          };
        });
      } else {
        this.addEventListener("readystatechange", onreadystatechangeHandler);
      }
      fill(this, "setRequestHeader", function(original) {
        return function(...setRequestHeaderArgs) {
          const [header, value] = setRequestHeaderArgs;
          const xhrInfo2 = this[SENTRY_XHR_DATA_KEY];
          if (xhrInfo2) {
            xhrInfo2.request_headers[header.toLowerCase()] = value;
          }
          return original.apply(this, setRequestHeaderArgs);
        };
      });
      return originalOpen.apply(this, args);
    };
  });
  fill(xhrproto, "send", function(originalSend) {
    return function(...args) {
      const sentryXhrData = this[SENTRY_XHR_DATA_KEY];
      if (sentryXhrData && args[0] !== void 0) {
        sentryXhrData.body = args[0];
      }
      triggerHandlers("xhr", {
        args,
        startTimestamp: Date.now(),
        xhr: this
      });
      return originalSend.apply(this, args);
    };
  });
}
var lastHref;
function instrumentHistory() {
  if (!supportsHistory()) {
    return;
  }
  const oldOnPopState = WINDOW4.onpopstate;
  WINDOW4.onpopstate = function(...args) {
    const to = WINDOW4.location.href;
    const from = lastHref;
    lastHref = to;
    triggerHandlers("history", {
      from,
      to
    });
    if (oldOnPopState) {
      try {
        return oldOnPopState.apply(this, args);
      } catch (_oO) {
      }
    }
  };
  function historyReplacementFunction(originalHistoryFunction) {
    return function(...args) {
      const url = args.length > 2 ? args[2] : void 0;
      if (url) {
        const from = lastHref;
        const to = String(url);
        lastHref = to;
        triggerHandlers("history", {
          from,
          to
        });
      }
      return originalHistoryFunction.apply(this, args);
    };
  }
  fill(WINDOW4.history, "pushState", historyReplacementFunction);
  fill(WINDOW4.history, "replaceState", historyReplacementFunction);
}
var DEBOUNCE_DURATION = 1e3;
var debounceTimerID;
var lastCapturedEvent;
function areSimilarDomEvents(a, b) {
  if (a.type !== b.type) {
    return false;
  }
  try {
    if (a.target !== b.target) {
      return false;
    }
  } catch (e) {
  }
  return true;
}
function shouldSkipDOMEvent(event) {
  if (event.type !== "keypress") {
    return false;
  }
  try {
    const target = event.target;
    if (!target || !target.tagName) {
      return true;
    }
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return false;
    }
  } catch (e) {
  }
  return true;
}
function makeDOMEventHandler(handler2, globalListener = false) {
  return (event) => {
    if (!event || event["_sentryCaptured"]) {
      return;
    }
    if (shouldSkipDOMEvent(event)) {
      return;
    }
    addNonEnumerableProperty(event, "_sentryCaptured", true);
    const name = event.type === "keypress" ? "input" : event.type;
    if (lastCapturedEvent === void 0 || !areSimilarDomEvents(lastCapturedEvent, event)) {
      handler2({
        event,
        name,
        global: globalListener
      });
      lastCapturedEvent = event;
    }
    clearTimeout(debounceTimerID);
    debounceTimerID = WINDOW4.setTimeout(() => {
      lastCapturedEvent = void 0;
    }, DEBOUNCE_DURATION);
  };
}
function instrumentDOM() {
  if (!WINDOW4.document) {
    return;
  }
  const triggerDOMHandler = triggerHandlers.bind(null, "dom");
  const globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
  WINDOW4.document.addEventListener("click", globalDOMEventHandler, false);
  WINDOW4.document.addEventListener("keypress", globalDOMEventHandler, false);
  ["EventTarget", "Node"].forEach((target) => {
    const proto = WINDOW4[target] && WINDOW4[target].prototype;
    if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty("addEventListener")) {
      return;
    }
    fill(proto, "addEventListener", function(originalAddEventListener) {
      return function(type, listener, options) {
        if (type === "click" || type == "keypress") {
          try {
            const el = this;
            const handlers2 = el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {};
            const handlerForType = handlers2[type] = handlers2[type] || { refCount: 0 };
            if (!handlerForType.handler) {
              const handler2 = makeDOMEventHandler(triggerDOMHandler);
              handlerForType.handler = handler2;
              originalAddEventListener.call(this, type, handler2, options);
            }
            handlerForType.refCount++;
          } catch (e) {
          }
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    });
    fill(
      proto,
      "removeEventListener",
      function(originalRemoveEventListener) {
        return function(type, listener, options) {
          if (type === "click" || type == "keypress") {
            try {
              const el = this;
              const handlers2 = el.__sentry_instrumentation_handlers__ || {};
              const handlerForType = handlers2[type];
              if (handlerForType) {
                handlerForType.refCount--;
                if (handlerForType.refCount <= 0) {
                  originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                  handlerForType.handler = void 0;
                  delete handlers2[type];
                }
                if (Object.keys(handlers2).length === 0) {
                  delete el.__sentry_instrumentation_handlers__;
                }
              }
            } catch (e) {
            }
          }
          return originalRemoveEventListener.call(this, type, listener, options);
        };
      }
    );
  });
}
var _oldOnErrorHandler = null;
function instrumentError() {
  _oldOnErrorHandler = WINDOW4.onerror;
  WINDOW4.onerror = function(msg, url, line, column, error) {
    triggerHandlers("error", {
      column,
      error,
      line,
      msg,
      url
    });
    if (_oldOnErrorHandler && !_oldOnErrorHandler.__SENTRY_LOADER__) {
      return _oldOnErrorHandler.apply(this, arguments);
    }
    return false;
  };
  WINDOW4.onerror.__SENTRY_INSTRUMENTED__ = true;
}
var _oldOnUnhandledRejectionHandler = null;
function instrumentUnhandledRejection() {
  _oldOnUnhandledRejectionHandler = WINDOW4.onunhandledrejection;
  WINDOW4.onunhandledrejection = function(e) {
    triggerHandlers("unhandledrejection", e);
    if (_oldOnUnhandledRejectionHandler && !_oldOnUnhandledRejectionHandler.__SENTRY_LOADER__) {
      return _oldOnUnhandledRejectionHandler.apply(this, arguments);
    }
    return true;
  };
  WINDOW4.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}

// node_modules/@sentry/utils/esm/env.js
function isBrowserBundle() {
  return typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" && !!__SENTRY_BROWSER_BUNDLE__;
}

// node_modules/@sentry/utils/esm/node.js
function isNodeEnv() {
  return !isBrowserBundle() && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
}
function dynamicRequire(mod, request) {
  return mod.require(request);
}

// node_modules/@sentry/utils/esm/memo.js
function memoBuilder() {
  const hasWeakSet = typeof WeakSet === "function";
  const inner = hasWeakSet ? /* @__PURE__ */ new WeakSet() : [];
  function memoize(obj) {
    if (hasWeakSet) {
      if (inner.has(obj)) {
        return true;
      }
      inner.add(obj);
      return false;
    }
    for (let i = 0; i < inner.length; i++) {
      const value = inner[i];
      if (value === obj) {
        return true;
      }
    }
    inner.push(obj);
    return false;
  }
  function unmemoize(obj) {
    if (hasWeakSet) {
      inner.delete(obj);
    } else {
      for (let i = 0; i < inner.length; i++) {
        if (inner[i] === obj) {
          inner.splice(i, 1);
          break;
        }
      }
    }
  }
  return [memoize, unmemoize];
}

// node_modules/@sentry/utils/esm/misc.js
function uuid4() {
  const gbl = GLOBAL_OBJ;
  const crypto2 = gbl.crypto || gbl.msCrypto;
  let getRandomByte = () => Math.random() * 16;
  try {
    if (crypto2 && crypto2.randomUUID) {
      return crypto2.randomUUID().replace(/-/g, "");
    }
    if (crypto2 && crypto2.getRandomValues) {
      getRandomByte = () => crypto2.getRandomValues(new Uint8Array(1))[0];
    }
  } catch (_) {
  }
  return ("10000000100040008000" + 1e11).replace(
    /[018]/g,
    (c) => (
      // eslint-disable-next-line no-bitwise
      (c ^ (getRandomByte() & 15) >> c / 4).toString(16)
    )
  );
}
function getFirstException(event) {
  return event.exception && event.exception.values ? event.exception.values[0] : void 0;
}
function addExceptionTypeValue(event, value, type) {
  const exception = event.exception = event.exception || {};
  const values = exception.values = exception.values || [];
  const firstException = values[0] = values[0] || {};
  if (!firstException.value) {
    firstException.value = value || "";
  }
  if (!firstException.type) {
    firstException.type = type || "Error";
  }
}
function addExceptionMechanism(event, newMechanism) {
  const firstException = getFirstException(event);
  if (!firstException) {
    return;
  }
  const defaultMechanism = { type: "generic", handled: true };
  const currentMechanism = firstException.mechanism;
  firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };
  if (newMechanism && "data" in newMechanism) {
    const mergedData = { ...currentMechanism && currentMechanism.data, ...newMechanism.data };
    firstException.mechanism.data = mergedData;
  }
}
function checkOrSetAlreadyCaught(exception) {
  if (exception && exception.__sentry_captured__) {
    return true;
  }
  try {
    addNonEnumerableProperty(exception, "__sentry_captured__", true);
  } catch (err) {
  }
  return false;
}
function arrayify(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

// node_modules/@sentry/utils/esm/normalize.js
function normalize(input, depth = 100, maxProperties = Infinity) {
  try {
    return visit("", input, depth, maxProperties);
  } catch (err) {
    return { ERROR: `**non-serializable** (${err})` };
  }
}
function normalizeToSize(object, depth = 3, maxSize = 100 * 1024) {
  const normalized = normalize(object, depth);
  if (jsonSize(normalized) > maxSize) {
    return normalizeToSize(object, depth - 1, maxSize);
  }
  return normalized;
}
function visit(key, value, depth = Infinity, maxProperties = Infinity, memo = memoBuilder()) {
  const [memoize, unmemoize] = memo;
  if (value == null || // this matches null and undefined -> eqeq not eqeqeq
  ["number", "boolean", "string"].includes(typeof value) && !isNaN2(value)) {
    return value;
  }
  const stringified = stringifyValue(key, value);
  if (!stringified.startsWith("[object ")) {
    return stringified;
  }
  if (value["__sentry_skip_normalization__"]) {
    return value;
  }
  const remainingDepth = typeof value["__sentry_override_normalization_depth__"] === "number" ? value["__sentry_override_normalization_depth__"] : depth;
  if (remainingDepth === 0) {
    return stringified.replace("object ", "");
  }
  if (memoize(value)) {
    return "[Circular ~]";
  }
  const valueWithToJSON = value;
  if (valueWithToJSON && typeof valueWithToJSON.toJSON === "function") {
    try {
      const jsonValue = valueWithToJSON.toJSON();
      return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
    } catch (err) {
    }
  }
  const normalized = Array.isArray(value) ? [] : {};
  let numAdded = 0;
  const visitable = convertToPlainObject(value);
  for (const visitKey in visitable) {
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
      continue;
    }
    if (numAdded >= maxProperties) {
      normalized[visitKey] = "[MaxProperties ~]";
      break;
    }
    const visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
    numAdded++;
  }
  unmemoize(value);
  return normalized;
}
function stringifyValue(key, value) {
  try {
    if (key === "domain" && value && typeof value === "object" && value._events) {
      return "[Domain]";
    }
    if (key === "domainEmitter") {
      return "[DomainEmitter]";
    }
    if (typeof global !== "undefined" && value === global) {
      return "[Global]";
    }
    if (typeof window !== "undefined" && value === window) {
      return "[Window]";
    }
    if (typeof document !== "undefined" && value === document) {
      return "[Document]";
    }
    if (isVueViewModel(value)) {
      return "[VueViewModel]";
    }
    if (isSyntheticEvent(value)) {
      return "[SyntheticEvent]";
    }
    if (typeof value === "number" && value !== value) {
      return "[NaN]";
    }
    if (typeof value === "function") {
      return `[Function: ${getFunctionName(value)}]`;
    }
    if (typeof value === "symbol") {
      return `[${String(value)}]`;
    }
    if (typeof value === "bigint") {
      return `[BigInt: ${String(value)}]`;
    }
    const objName = getConstructorName(value);
    if (/^HTML(\w*)Element$/.test(objName)) {
      return `[HTMLElement: ${objName}]`;
    }
    return `[object ${objName}]`;
  } catch (err) {
    return `**non-serializable** (${err})`;
  }
}
function getConstructorName(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype ? prototype.constructor.name : "null prototype";
}
function utf8Length(value) {
  return ~-encodeURI(value).split(/%..|./).length;
}
function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}

// node_modules/@sentry/utils/esm/path.js
function normalizeArray(parts, allowAboveRoot) {
  let up = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    const last = parts[i];
    if (last === ".") {
      parts.splice(i, 1);
    } else if (last === "..") {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift("..");
    }
  }
  return parts;
}
var splitPathRe = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
function splitPath(filename) {
  const truncated = filename.length > 1024 ? `<truncated>${filename.slice(-1024)}` : filename;
  const parts = splitPathRe.exec(truncated);
  return parts ? parts.slice(1) : [];
}
function resolve(...args) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    const path = i >= 0 ? args[i] : "/";
    if (!path) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = path.charAt(0) === "/";
  }
  resolvedPath = normalizeArray(
    resolvedPath.split("/").filter((p) => !!p),
    !resolvedAbsolute
  ).join("/");
  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
}
function trim(arr) {
  let start = 0;
  for (; start < arr.length; start++) {
    if (arr[start] !== "") {
      break;
    }
  }
  let end = arr.length - 1;
  for (; end >= 0; end--) {
    if (arr[end] !== "") {
      break;
    }
  }
  if (start > end) {
    return [];
  }
  return arr.slice(start, end - start + 1);
}
function relative(from, to) {
  from = resolve(from).slice(1);
  to = resolve(to).slice(1);
  const fromParts = trim(from.split("/"));
  const toParts = trim(to.split("/"));
  const length = Math.min(fromParts.length, toParts.length);
  let samePartsLength = length;
  for (let i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }
  let outputParts = [];
  for (let i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
}
function basename(path, ext) {
  let f = splitPath(path)[2];
  if (ext && f.slice(ext.length * -1) === ext) {
    f = f.slice(0, f.length - ext.length);
  }
  return f;
}

// node_modules/@sentry/utils/esm/syncpromise.js
var States;
(function(States2) {
  const PENDING = 0;
  States2[States2["PENDING"] = PENDING] = "PENDING";
  const RESOLVED = 1;
  States2[States2["RESOLVED"] = RESOLVED] = "RESOLVED";
  const REJECTED = 2;
  States2[States2["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {}));
function resolvedSyncPromise(value) {
  return new SyncPromise((resolve2) => {
    resolve2(value);
  });
}
function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}
var SyncPromise = class _SyncPromise {
  constructor(executor) {
    _SyncPromise.prototype.__init.call(this);
    _SyncPromise.prototype.__init2.call(this);
    _SyncPromise.prototype.__init3.call(this);
    _SyncPromise.prototype.__init4.call(this);
    this._state = States.PENDING;
    this._handlers = [];
    try {
      executor(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }
  /** JSDoc */
  then(onfulfilled, onrejected) {
    return new _SyncPromise((resolve2, reject) => {
      this._handlers.push([
        false,
        (result) => {
          if (!onfulfilled) {
            resolve2(result);
          } else {
            try {
              resolve2(onfulfilled(result));
            } catch (e) {
              reject(e);
            }
          }
        },
        (reason) => {
          if (!onrejected) {
            reject(reason);
          } else {
            try {
              resolve2(onrejected(reason));
            } catch (e) {
              reject(e);
            }
          }
        }
      ]);
      this._executeHandlers();
    });
  }
  /** JSDoc */
  catch(onrejected) {
    return this.then((val) => val, onrejected);
  }
  /** JSDoc */
  finally(onfinally) {
    return new _SyncPromise((resolve2, reject) => {
      let val;
      let isRejected;
      return this.then(
        (value) => {
          isRejected = false;
          val = value;
          if (onfinally) {
            onfinally();
          }
        },
        (reason) => {
          isRejected = true;
          val = reason;
          if (onfinally) {
            onfinally();
          }
        }
      ).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }
        resolve2(val);
      });
    });
  }
  /** JSDoc */
  __init() {
    this._resolve = (value) => {
      this._setResult(States.RESOLVED, value);
    };
  }
  /** JSDoc */
  __init2() {
    this._reject = (reason) => {
      this._setResult(States.REJECTED, reason);
    };
  }
  /** JSDoc */
  __init3() {
    this._setResult = (state, value) => {
      if (this._state !== States.PENDING) {
        return;
      }
      if (isThenable(value)) {
        void value.then(this._resolve, this._reject);
        return;
      }
      this._state = state;
      this._value = value;
      this._executeHandlers();
    };
  }
  /** JSDoc */
  __init4() {
    this._executeHandlers = () => {
      if (this._state === States.PENDING) {
        return;
      }
      const cachedHandlers = this._handlers.slice();
      this._handlers = [];
      cachedHandlers.forEach((handler2) => {
        if (handler2[0]) {
          return;
        }
        if (this._state === States.RESOLVED) {
          handler2[1](this._value);
        }
        if (this._state === States.REJECTED) {
          handler2[2](this._value);
        }
        handler2[0] = true;
      });
    };
  }
};

// node_modules/@sentry/utils/esm/promisebuffer.js
function makePromiseBuffer(limit) {
  const buffer = [];
  function isReady() {
    return limit === void 0 || buffer.length < limit;
  }
  function remove(task) {
    return buffer.splice(buffer.indexOf(task), 1)[0];
  }
  function add(taskProducer) {
    if (!isReady()) {
      return rejectedSyncPromise(new SentryError("Not adding Promise because buffer limit was reached."));
    }
    const task = taskProducer();
    if (buffer.indexOf(task) === -1) {
      buffer.push(task);
    }
    void task.then(() => remove(task)).then(
      null,
      () => remove(task).then(null, () => {
      })
    );
    return task;
  }
  function drain(timeout) {
    return new SyncPromise((resolve2, reject) => {
      let counter = buffer.length;
      if (!counter) {
        return resolve2(true);
      }
      const capturedSetTimeout = setTimeout(() => {
        if (timeout && timeout > 0) {
          resolve2(false);
        }
      }, timeout);
      buffer.forEach((item) => {
        void resolvedSyncPromise(item).then(() => {
          if (!--counter) {
            clearTimeout(capturedSetTimeout);
            resolve2(true);
          }
        }, reject);
      });
    });
  }
  return {
    $: buffer,
    add,
    drain
  };
}

// node_modules/@sentry/utils/esm/time.js
var WINDOW5 = getGlobalObject();
var dateTimestampSource = {
  nowSeconds: () => Date.now() / 1e3
};
function getBrowserPerformance() {
  const { performance } = WINDOW5;
  if (!performance || !performance.now) {
    return void 0;
  }
  const timeOrigin = Date.now() - performance.now();
  return {
    now: () => performance.now(),
    timeOrigin
  };
}
function getNodePerformance() {
  try {
    const perfHooks = dynamicRequire(module, "perf_hooks");
    return perfHooks.performance;
  } catch (_) {
    return void 0;
  }
}
var platformPerformance = isNodeEnv() ? getNodePerformance() : getBrowserPerformance();
var timestampSource = platformPerformance === void 0 ? dateTimestampSource : {
  nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1e3
};
var dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
var timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);
var _browserPerformanceTimeOriginMode;
var browserPerformanceTimeOrigin = (() => {
  const { performance } = WINDOW5;
  if (!performance || !performance.now) {
    _browserPerformanceTimeOriginMode = "none";
    return void 0;
  }
  const threshold = 3600 * 1e3;
  const performanceNow = performance.now();
  const dateNow = Date.now();
  const timeOriginDelta = performance.timeOrigin ? Math.abs(performance.timeOrigin + performanceNow - dateNow) : threshold;
  const timeOriginIsReliable = timeOriginDelta < threshold;
  const navigationStart = performance.timing && performance.timing.navigationStart;
  const hasNavigationStart = typeof navigationStart === "number";
  const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
  const navigationStartIsReliable = navigationStartDelta < threshold;
  if (timeOriginIsReliable || navigationStartIsReliable) {
    if (timeOriginDelta <= navigationStartDelta) {
      _browserPerformanceTimeOriginMode = "timeOrigin";
      return performance.timeOrigin;
    } else {
      _browserPerformanceTimeOriginMode = "navigationStart";
      return navigationStart;
    }
  }
  _browserPerformanceTimeOriginMode = "dateNow";
  return dateNow;
})();

// node_modules/@sentry/utils/esm/tracing.js
var TRACEPARENT_REGEXP = new RegExp(
  "^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$"
  // whitespace
);
function generateSentryTraceHeader(traceId = uuid4(), spanId = uuid4().substring(16), sampled) {
  let sampledString = "";
  if (sampled !== void 0) {
    sampledString = sampled ? "-1" : "-0";
  }
  return `${traceId}-${spanId}${sampledString}`;
}

// node_modules/@sentry/utils/esm/envelope.js
function createEnvelope(headers, items = []) {
  return [headers, items];
}
function addItemToEnvelope(envelope, newItem) {
  const [headers, items] = envelope;
  return [headers, [...items, newItem]];
}
function forEachEnvelopeItem(envelope, callback) {
  const envelopeItems = envelope[1];
  for (const envelopeItem of envelopeItems) {
    const envelopeItemType = envelopeItem[0].type;
    const result = callback(envelopeItem, envelopeItemType);
    if (result) {
      return true;
    }
  }
  return false;
}
function encodeUTF8(input, textEncoder) {
  const utf8 = textEncoder || new TextEncoder();
  return utf8.encode(input);
}
function serializeEnvelope(envelope, textEncoder) {
  const [envHeaders, items] = envelope;
  let parts = JSON.stringify(envHeaders);
  function append(next) {
    if (typeof parts === "string") {
      parts = typeof next === "string" ? parts + next : [encodeUTF8(parts, textEncoder), next];
    } else {
      parts.push(typeof next === "string" ? encodeUTF8(next, textEncoder) : next);
    }
  }
  for (const item of items) {
    const [itemHeaders, payload] = item;
    append(`
${JSON.stringify(itemHeaders)}
`);
    if (typeof payload === "string" || payload instanceof Uint8Array) {
      append(payload);
    } else {
      let stringifiedPayload;
      try {
        stringifiedPayload = JSON.stringify(payload);
      } catch (e) {
        stringifiedPayload = JSON.stringify(normalize(payload));
      }
      append(stringifiedPayload);
    }
  }
  return typeof parts === "string" ? parts : concatBuffers(parts);
}
function concatBuffers(buffers) {
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    merged.set(buffer, offset);
    offset += buffer.length;
  }
  return merged;
}
function createAttachmentEnvelopeItem(attachment, textEncoder) {
  const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data, textEncoder) : attachment.data;
  return [
    dropUndefinedKeys({
      type: "attachment",
      length: buffer.length,
      filename: attachment.filename,
      content_type: attachment.contentType,
      attachment_type: attachment.attachmentType
    }),
    buffer
  ];
}
var ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
  session: "session",
  sessions: "session",
  attachment: "attachment",
  transaction: "transaction",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  // TODO: This is a temporary workaround until we have a proper data category for metrics
  statsd: "unknown"
};
function envelopeItemTypeToDataCategory(type) {
  return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}
function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
  if (!metadataOrEvent || !metadataOrEvent.sdk) {
    return;
  }
  const { name, version } = metadataOrEvent.sdk;
  return { name, version };
}
function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
  const dynamicSamplingContext = event.sdkProcessingMetadata && event.sdkProcessingMetadata.dynamicSamplingContext;
  return {
    event_id: event.event_id,
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) },
    ...dynamicSamplingContext && {
      trace: dropUndefinedKeys({ ...dynamicSamplingContext })
    }
  };
}

// node_modules/@sentry/utils/esm/ratelimit.js
var DEFAULT_RETRY_AFTER = 60 * 1e3;
function parseRetryAfterHeader(header, now = Date.now()) {
  const headerDelay = parseInt(`${header}`, 10);
  if (!isNaN(headerDelay)) {
    return headerDelay * 1e3;
  }
  const headerDate = Date.parse(`${header}`);
  if (!isNaN(headerDate)) {
    return headerDate - now;
  }
  return DEFAULT_RETRY_AFTER;
}
function disabledUntil(limits, category) {
  return limits[category] || limits.all || 0;
}
function isRateLimited(limits, category, now = Date.now()) {
  return disabledUntil(limits, category) > now;
}
function updateRateLimits(limits, { statusCode, headers }, now = Date.now()) {
  const updatedRateLimits = {
    ...limits
  };
  const rateLimitHeader = headers && headers["x-sentry-rate-limits"];
  const retryAfterHeader = headers && headers["retry-after"];
  if (rateLimitHeader) {
    for (const limit of rateLimitHeader.trim().split(",")) {
      const [retryAfter, categories] = limit.split(":", 2);
      const headerDelay = parseInt(retryAfter, 10);
      const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1e3;
      if (!categories) {
        updatedRateLimits.all = now + delay;
      } else {
        for (const category of categories.split(";")) {
          updatedRateLimits[category] = now + delay;
        }
      }
    }
  } else if (retryAfterHeader) {
    updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
  } else if (statusCode === 429) {
    updatedRateLimits.all = now + 60 * 1e3;
  }
  return updatedRateLimits;
}

// node_modules/@sentry/utils/esm/eventbuilder.js
function parseStackFrames(stackParser, error) {
  return stackParser(error.stack || "", 1);
}
function exceptionFromError(stackParser, error) {
  const exception = {
    type: error.name || error.constructor.name,
    value: error.message
  };
  const frames = parseStackFrames(stackParser, error);
  if (frames.length) {
    exception.stacktrace = { frames };
  }
  return exception;
}
function getMessageForObject(exception) {
  if ("name" in exception && typeof exception.name === "string") {
    let message = `'${exception.name}' captured as exception`;
    if ("message" in exception && typeof exception.message === "string") {
      message += ` with message '${exception.message}'`;
    }
    return message;
  } else if ("message" in exception && typeof exception.message === "string") {
    return exception.message;
  } else {
    return `Object captured as exception with keys: ${extractExceptionKeysForMessage(
      exception
    )}`;
  }
}
function eventFromUnknownInput(getCurrentHub2, stackParser, exception, hint) {
  let ex = exception;
  const providedMechanism = hint && hint.data && hint.data.mechanism;
  const mechanism = providedMechanism || {
    handled: true,
    type: "generic"
  };
  if (!isError(exception)) {
    if (isPlainObject(exception)) {
      const hub = getCurrentHub2();
      const client = hub.getClient();
      const normalizeDepth = client && client.getOptions().normalizeDepth;
      hub.configureScope((scope) => {
        scope.setExtra("__serialized__", normalizeToSize(exception, normalizeDepth));
      });
      const message = getMessageForObject(exception);
      ex = hint && hint.syntheticException || new Error(message);
      ex.message = message;
    } else {
      ex = hint && hint.syntheticException || new Error(exception);
      ex.message = exception;
    }
    mechanism.synthetic = true;
  }
  const event = {
    exception: {
      values: [exceptionFromError(stackParser, ex)]
    }
  };
  addExceptionTypeValue(event, void 0, void 0);
  addExceptionMechanism(event, mechanism);
  return {
    ...event,
    event_id: hint && hint.event_id
  };
}
function eventFromMessage(stackParser, message, level = "info", hint, attachStacktrace) {
  const event = {
    event_id: hint && hint.event_id,
    level,
    message
  };
  if (attachStacktrace && hint && hint.syntheticException) {
    const frames = parseStackFrames(stackParser, hint.syntheticException);
    if (frames.length) {
      event.exception = {
        values: [
          {
            value: message,
            stacktrace: { frames }
          }
        ]
      };
    }
  }
  return event;
}

// node_modules/@sentry/integrations/esm/rewriteframes.js
var RewriteFrames = class _RewriteFrames {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "RewriteFrames";
  }
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  constructor(options = {}) {
    _RewriteFrames.prototype.__init.call(this);
    this.name = _RewriteFrames.id;
    if (options.root) {
      this._root = options.root;
    }
    this._prefix = options.prefix || "app:///";
    if (options.iteratee) {
      this._iteratee = options.iteratee;
    }
  }
  /**
   * @inheritDoc
   */
  setupOnce(_addGlobaleventProcessor, _getCurrentHub) {
  }
  /** @inheritDoc */
  processEvent(event) {
    return this.process(event);
  }
  /**
   * TODO (v8): Make this private/internal
   */
  process(originalEvent) {
    let processedEvent = originalEvent;
    if (originalEvent.exception && Array.isArray(originalEvent.exception.values)) {
      processedEvent = this._processExceptionsEvent(processedEvent);
    }
    return processedEvent;
  }
  /**
   * @inheritDoc
   */
  __init() {
    this._iteratee = (frame) => {
      if (!frame.filename) {
        return frame;
      }
      const isWindowsFrame = /^[a-zA-Z]:\\/.test(frame.filename) || // or the presence of a backslash without a forward slash (which are not allowed on Windows)
      frame.filename.includes("\\") && !frame.filename.includes("/");
      const startsWithSlash = /^\//.test(frame.filename);
      if (isWindowsFrame || startsWithSlash) {
        const filename = isWindowsFrame ? frame.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/") : frame.filename;
        const base = this._root ? relative(this._root, filename) : basename(filename);
        frame.filename = `${this._prefix}${base}`;
      }
      return frame;
    };
  }
  /** JSDoc */
  _processExceptionsEvent(event) {
    try {
      return {
        ...event,
        exception: {
          ...event.exception,
          // The check for this is performed inside `process` call itself, safe to skip here
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          values: event.exception.values.map((value) => ({
            ...value,
            ...value.stacktrace && { stacktrace: this._processStacktrace(value.stacktrace) }
          }))
        }
      };
    } catch (_oO) {
      return event;
    }
  }
  /** JSDoc */
  _processStacktrace(stacktrace) {
    return {
      ...stacktrace,
      frames: stacktrace && stacktrace.frames && stacktrace.frames.map((f) => this._iteratee(f))
    };
  }
};
RewriteFrames.__initStatic();

// node_modules/@sentry/core/esm/constants.js
var DEFAULT_ENVIRONMENT = "production";

// node_modules/@sentry/core/esm/eventProcessors.js
function getGlobalEventProcessors() {
  return getGlobalSingleton("globalEventProcessors", () => []);
}
function addGlobalEventProcessor(callback) {
  getGlobalEventProcessors().push(callback);
}
function notifyEventProcessors(processors, event, hint, index = 0) {
  return new SyncPromise((resolve2, reject) => {
    const processor = processors[index];
    if (event === null || typeof processor !== "function") {
      resolve2(event);
    } else {
      const result = processor({ ...event }, hint);
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && processor.id && result === null && logger.log(`Event processor "${processor.id}" dropped event`);
      if (isThenable(result)) {
        void result.then((final) => notifyEventProcessors(processors, final, hint, index + 1).then(resolve2)).then(null, reject);
      } else {
        void notifyEventProcessors(processors, result, hint, index + 1).then(resolve2).then(null, reject);
      }
    }
  });
}

// node_modules/@sentry/core/esm/session.js
function makeSession(context) {
  const startingTime = timestampInSeconds();
  const session = {
    sid: uuid4(),
    init: true,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: false,
    toJSON: () => sessionToJSON(session)
  };
  if (context) {
    updateSession(session, context);
  }
  return session;
}
function updateSession(session, context = {}) {
  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }
    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }
  session.timestamp = context.timestamp || timestampInSeconds();
  if (context.abnormal_mechanism) {
    session.abnormal_mechanism = context.abnormal_mechanism;
  }
  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }
  if (context.sid) {
    session.sid = context.sid.length === 32 ? context.sid : uuid4();
  }
  if (context.init !== void 0) {
    session.init = context.init;
  }
  if (!session.did && context.did) {
    session.did = `${context.did}`;
  }
  if (typeof context.started === "number") {
    session.started = context.started;
  }
  if (session.ignoreDuration) {
    session.duration = void 0;
  } else if (typeof context.duration === "number") {
    session.duration = context.duration;
  } else {
    const duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  if (context.release) {
    session.release = context.release;
  }
  if (context.environment) {
    session.environment = context.environment;
  }
  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }
  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }
  if (typeof context.errors === "number") {
    session.errors = context.errors;
  }
  if (context.status) {
    session.status = context.status;
  }
}
function closeSession(session, status) {
  let context = {};
  if (status) {
    context = { status };
  } else if (session.status === "ok") {
    context = { status: "exited" };
  }
  updateSession(session, context);
}
function sessionToJSON(session) {
  return dropUndefinedKeys({
    sid: `${session.sid}`,
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1e3).toISOString(),
    timestamp: new Date(session.timestamp * 1e3).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did === "number" || typeof session.did === "string" ? `${session.did}` : void 0,
    duration: session.duration,
    abnormal_mechanism: session.abnormal_mechanism,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent
    }
  });
}

// node_modules/@sentry/core/esm/scope.js
var DEFAULT_MAX_BREADCRUMBS = 100;
var Scope = class _Scope {
  /** Flag if notifying is happening. */
  /** Callback for client to receive scope changes. */
  /** Callback list that will be called after {@link applyToEvent}. */
  /** Array of breadcrumbs. */
  /** User */
  /** Tags */
  /** Extra */
  /** Contexts */
  /** Attachments */
  /** Propagation Context for distributed tracing */
  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */
  /** Fingerprint */
  /** Severity */
  // eslint-disable-next-line deprecation/deprecation
  /** Transaction Name */
  /** Span */
  /** Session */
  /** Request Mode Session Status */
  // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
  constructor() {
    this._notifyingListeners = false;
    this._scopeListeners = [];
    this._eventProcessors = [];
    this._breadcrumbs = [];
    this._attachments = [];
    this._user = {};
    this._tags = {};
    this._extra = {};
    this._contexts = {};
    this._sdkProcessingMetadata = {};
    this._propagationContext = generatePropagationContext();
  }
  /**
   * Inherit values from the parent scope.
   * @param scope to clone.
   */
  static clone(scope) {
    const newScope = new _Scope();
    if (scope) {
      newScope._breadcrumbs = [...scope._breadcrumbs];
      newScope._tags = { ...scope._tags };
      newScope._extra = { ...scope._extra };
      newScope._contexts = { ...scope._contexts };
      newScope._user = scope._user;
      newScope._level = scope._level;
      newScope._span = scope._span;
      newScope._session = scope._session;
      newScope._transactionName = scope._transactionName;
      newScope._fingerprint = scope._fingerprint;
      newScope._eventProcessors = [...scope._eventProcessors];
      newScope._requestSession = scope._requestSession;
      newScope._attachments = [...scope._attachments];
      newScope._sdkProcessingMetadata = { ...scope._sdkProcessingMetadata };
      newScope._propagationContext = { ...scope._propagationContext };
    }
    return newScope;
  }
  /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */
  addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }
  /**
   * @inheritDoc
   */
  addEventProcessor(callback) {
    this._eventProcessors.push(callback);
    return this;
  }
  /**
   * @inheritDoc
   */
  setUser(user) {
    this._user = user || {};
    if (this._session) {
      updateSession(this._session, { user });
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getUser() {
    return this._user;
  }
  /**
   * @inheritDoc
   */
  getRequestSession() {
    return this._requestSession;
  }
  /**
   * @inheritDoc
   */
  setRequestSession(requestSession) {
    this._requestSession = requestSession;
    return this;
  }
  /**
   * @inheritDoc
   */
  setTags(tags) {
    this._tags = {
      ...this._tags,
      ...tags
    };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setTag(key, value) {
    this._tags = { ...this._tags, [key]: value };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setExtras(extras) {
    this._extra = {
      ...this._extra,
      ...extras
    };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setExtra(key, extra) {
    this._extra = { ...this._extra, [key]: extra };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setFingerprint(fingerprint) {
    this._fingerprint = fingerprint;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setLevel(level) {
    this._level = level;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setTransactionName(name) {
    this._transactionName = name;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setContext(key, context) {
    if (context === null) {
      delete this._contexts[key];
    } else {
      this._contexts[key] = context;
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setSpan(span) {
    this._span = span;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getSpan() {
    return this._span;
  }
  /**
   * @inheritDoc
   */
  getTransaction() {
    const span = this.getSpan();
    return span && span.transaction;
  }
  /**
   * @inheritDoc
   */
  setSession(session) {
    if (!session) {
      delete this._session;
    } else {
      this._session = session;
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getSession() {
    return this._session;
  }
  /**
   * @inheritDoc
   */
  update(captureContext) {
    if (!captureContext) {
      return this;
    }
    if (typeof captureContext === "function") {
      const updatedScope = captureContext(this);
      return updatedScope instanceof _Scope ? updatedScope : this;
    }
    if (captureContext instanceof _Scope) {
      this._tags = { ...this._tags, ...captureContext._tags };
      this._extra = { ...this._extra, ...captureContext._extra };
      this._contexts = { ...this._contexts, ...captureContext._contexts };
      if (captureContext._user && Object.keys(captureContext._user).length) {
        this._user = captureContext._user;
      }
      if (captureContext._level) {
        this._level = captureContext._level;
      }
      if (captureContext._fingerprint) {
        this._fingerprint = captureContext._fingerprint;
      }
      if (captureContext._requestSession) {
        this._requestSession = captureContext._requestSession;
      }
      if (captureContext._propagationContext) {
        this._propagationContext = captureContext._propagationContext;
      }
    } else if (isPlainObject(captureContext)) {
      captureContext = captureContext;
      this._tags = { ...this._tags, ...captureContext.tags };
      this._extra = { ...this._extra, ...captureContext.extra };
      this._contexts = { ...this._contexts, ...captureContext.contexts };
      if (captureContext.user) {
        this._user = captureContext.user;
      }
      if (captureContext.level) {
        this._level = captureContext.level;
      }
      if (captureContext.fingerprint) {
        this._fingerprint = captureContext.fingerprint;
      }
      if (captureContext.requestSession) {
        this._requestSession = captureContext.requestSession;
      }
      if (captureContext.propagationContext) {
        this._propagationContext = captureContext.propagationContext;
      }
    }
    return this;
  }
  /**
   * @inheritDoc
   */
  clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = void 0;
    this._transactionName = void 0;
    this._fingerprint = void 0;
    this._requestSession = void 0;
    this._span = void 0;
    this._session = void 0;
    this._notifyScopeListeners();
    this._attachments = [];
    this._propagationContext = generatePropagationContext();
    return this;
  }
  /**
   * @inheritDoc
   */
  addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    const maxCrumbs = typeof maxBreadcrumbs === "number" ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
    if (maxCrumbs <= 0) {
      return this;
    }
    const mergedBreadcrumb = {
      timestamp: dateTimestampInSeconds(),
      ...breadcrumb
    };
    const breadcrumbs = this._breadcrumbs;
    breadcrumbs.push(mergedBreadcrumb);
    this._breadcrumbs = breadcrumbs.length > maxCrumbs ? breadcrumbs.slice(-maxCrumbs) : breadcrumbs;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  /**
   * @inheritDoc
   */
  clearBreadcrumbs() {
    this._breadcrumbs = [];
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  addAttachment(attachment) {
    this._attachments.push(attachment);
    return this;
  }
  /**
   * @inheritDoc
   */
  getAttachments() {
    return this._attachments;
  }
  /**
   * @inheritDoc
   */
  clearAttachments() {
    this._attachments = [];
    return this;
  }
  /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   */
  applyToEvent(event, hint = {}, additionalEventProcessors) {
    if (this._extra && Object.keys(this._extra).length) {
      event.extra = { ...this._extra, ...event.extra };
    }
    if (this._tags && Object.keys(this._tags).length) {
      event.tags = { ...this._tags, ...event.tags };
    }
    if (this._user && Object.keys(this._user).length) {
      event.user = { ...this._user, ...event.user };
    }
    if (this._contexts && Object.keys(this._contexts).length) {
      event.contexts = { ...this._contexts, ...event.contexts };
    }
    if (this._level) {
      event.level = this._level;
    }
    if (this._transactionName) {
      event.transaction = this._transactionName;
    }
    if (this._span) {
      event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };
      const transaction = this._span.transaction;
      if (transaction) {
        event.sdkProcessingMetadata = {
          dynamicSamplingContext: transaction.getDynamicSamplingContext(),
          ...event.sdkProcessingMetadata
        };
        const transactionName = transaction.name;
        if (transactionName) {
          event.tags = { transaction: transactionName, ...event.tags };
        }
      }
    }
    this._applyFingerprint(event);
    const scopeBreadcrumbs = this._getBreadcrumbs();
    const breadcrumbs = [...event.breadcrumbs || [], ...scopeBreadcrumbs];
    event.breadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : void 0;
    event.sdkProcessingMetadata = {
      ...event.sdkProcessingMetadata,
      ...this._sdkProcessingMetadata,
      propagationContext: this._propagationContext
    };
    return notifyEventProcessors(
      [...additionalEventProcessors || [], ...getGlobalEventProcessors(), ...this._eventProcessors],
      event,
      hint
    );
  }
  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */
  setSDKProcessingMetadata(newData) {
    this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };
    return this;
  }
  /**
   * @inheritDoc
   */
  setPropagationContext(context) {
    this._propagationContext = context;
    return this;
  }
  /**
   * @inheritDoc
   */
  getPropagationContext() {
    return this._propagationContext;
  }
  /**
   * Get the breadcrumbs for this scope.
   */
  _getBreadcrumbs() {
    return this._breadcrumbs;
  }
  /**
   * This will be called on every set call.
   */
  _notifyScopeListeners() {
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;
      this._scopeListeners.forEach((callback) => {
        callback(this);
      });
      this._notifyingListeners = false;
    }
  }
  /**
   * Applies fingerprint from the scope to the event if there's one,
   * uses message if there's one instead or get rid of empty fingerprint
   */
  _applyFingerprint(event) {
    event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : [];
    if (this._fingerprint) {
      event.fingerprint = event.fingerprint.concat(this._fingerprint);
    }
    if (event.fingerprint && !event.fingerprint.length) {
      delete event.fingerprint;
    }
  }
};
function generatePropagationContext() {
  return {
    traceId: uuid4(),
    spanId: uuid4().substring(16)
  };
}

// node_modules/@sentry/core/esm/hub.js
var API_VERSION = 4;
var DEFAULT_BREADCRUMBS = 100;
var Hub = class {
  /** Is a {@link Layer}[] containing the client and scope */
  /** Contains the last event id of a captured event.  */
  /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   */
  constructor(client, scope = new Scope(), _version = API_VERSION) {
    this._version = _version;
    this._stack = [{ scope }];
    if (client) {
      this.bindClient(client);
    }
  }
  /**
   * @inheritDoc
   */
  isOlderThan(version) {
    return this._version < version;
  }
  /**
   * @inheritDoc
   */
  bindClient(client) {
    const top = this.getStackTop();
    top.client = client;
    if (client && client.setupIntegrations) {
      client.setupIntegrations();
    }
  }
  /**
   * @inheritDoc
   */
  pushScope() {
    const scope = Scope.clone(this.getScope());
    this.getStack().push({
      client: this.getClient(),
      scope
    });
    return scope;
  }
  /**
   * @inheritDoc
   */
  popScope() {
    if (this.getStack().length <= 1) return false;
    return !!this.getStack().pop();
  }
  /**
   * @inheritDoc
   */
  withScope(callback) {
    const scope = this.pushScope();
    try {
      callback(scope);
    } finally {
      this.popScope();
    }
  }
  /**
   * @inheritDoc
   */
  getClient() {
    return this.getStackTop().client;
  }
  /** Returns the scope of the top stack. */
  getScope() {
    return this.getStackTop().scope;
  }
  /** Returns the scope stack for domains or the process. */
  getStack() {
    return this._stack;
  }
  /** Returns the topmost scope layer in the order domain > local > process. */
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  /**
   * @inheritDoc
   */
  captureException(exception, hint) {
    const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
    const syntheticException = new Error("Sentry syntheticException");
    this._withClient((client, scope) => {
      client.captureException(
        exception,
        {
          originalException: exception,
          syntheticException,
          ...hint,
          event_id: eventId
        },
        scope
      );
    });
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureMessage(message, level, hint) {
    const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
    const syntheticException = new Error(message);
    this._withClient((client, scope) => {
      client.captureMessage(
        message,
        level,
        {
          originalException: message,
          syntheticException,
          ...hint,
          event_id: eventId
        },
        scope
      );
    });
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint) {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4();
    if (!event.type) {
      this._lastEventId = eventId;
    }
    this._withClient((client, scope) => {
      client.captureEvent(event, { ...hint, event_id: eventId }, scope);
    });
    return eventId;
  }
  /**
   * @inheritDoc
   */
  lastEventId() {
    return this._lastEventId;
  }
  /**
   * @inheritDoc
   */
  addBreadcrumb(breadcrumb, hint) {
    const { scope, client } = this.getStackTop();
    if (!client) return;
    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions && client.getOptions() || {};
    if (maxBreadcrumbs <= 0) return;
    const timestamp = dateTimestampInSeconds();
    const mergedBreadcrumb = { timestamp, ...breadcrumb };
    const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
    if (finalBreadcrumb === null) return;
    if (client.emit) {
      client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint);
    }
    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
  }
  /**
   * @inheritDoc
   */
  setUser(user) {
    this.getScope().setUser(user);
  }
  /**
   * @inheritDoc
   */
  setTags(tags) {
    this.getScope().setTags(tags);
  }
  /**
   * @inheritDoc
   */
  setExtras(extras) {
    this.getScope().setExtras(extras);
  }
  /**
   * @inheritDoc
   */
  setTag(key, value) {
    this.getScope().setTag(key, value);
  }
  /**
   * @inheritDoc
   */
  setExtra(key, extra) {
    this.getScope().setExtra(key, extra);
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setContext(name, context) {
    this.getScope().setContext(name, context);
  }
  /**
   * @inheritDoc
   */
  configureScope(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(scope);
    }
  }
  /**
   * @inheritDoc
   */
  run(callback) {
    const oldHub = makeMain(this);
    try {
      callback(this);
    } finally {
      makeMain(oldHub);
    }
  }
  /**
   * @inheritDoc
   */
  getIntegration(integration) {
    const client = this.getClient();
    if (!client) return null;
    try {
      return client.getIntegration(integration);
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
      return null;
    }
  }
  /**
   * @inheritDoc
   */
  startTransaction(context, customSamplingContext) {
    const result = this._callExtensionMethod("startTransaction", context, customSamplingContext);
    if ((typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && !result) {
      const client = this.getClient();
      if (!client) {
        console.warn(
          "Tracing extension 'startTransaction' is missing. You should 'init' the SDK before calling 'startTransaction'"
        );
      } else {
        console.warn(`Tracing extension 'startTransaction' has not been added. Call 'addTracingExtensions' before calling 'init':
Sentry.addTracingExtensions();
Sentry.init({...});
`);
      }
    }
    return result;
  }
  /**
   * @inheritDoc
   */
  traceHeaders() {
    return this._callExtensionMethod("traceHeaders");
  }
  /**
   * @inheritDoc
   */
  captureSession(endSession = false) {
    if (endSession) {
      return this.endSession();
    }
    this._sendSessionUpdate();
  }
  /**
   * @inheritDoc
   */
  endSession() {
    const layer = this.getStackTop();
    const scope = layer.scope;
    const session = scope.getSession();
    if (session) {
      closeSession(session);
    }
    this._sendSessionUpdate();
    scope.setSession();
  }
  /**
   * @inheritDoc
   */
  startSession(context) {
    const { scope, client } = this.getStackTop();
    const { release, environment = DEFAULT_ENVIRONMENT } = client && client.getOptions() || {};
    const { userAgent } = GLOBAL_OBJ.navigator || {};
    const session = makeSession({
      release,
      environment,
      user: scope.getUser(),
      ...userAgent && { userAgent },
      ...context
    });
    const currentSession = scope.getSession && scope.getSession();
    if (currentSession && currentSession.status === "ok") {
      updateSession(currentSession, { status: "exited" });
    }
    this.endSession();
    scope.setSession(session);
    return session;
  }
  /**
   * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
   * when Tracing is used.
   */
  shouldSendDefaultPii() {
    const client = this.getClient();
    const options = client && client.getOptions();
    return Boolean(options && options.sendDefaultPii);
  }
  /**
   * Sends the current Session on the scope
   */
  _sendSessionUpdate() {
    const { scope, client } = this.getStackTop();
    const session = scope.getSession();
    if (session && client && client.captureSession) {
      client.captureSession(session);
    }
  }
  /**
   * Internal helper function to call a method on the top client if it exists.
   *
   * @param method The method to call on the client.
   * @param args Arguments to pass to the client function.
   */
  _withClient(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(client, scope);
    }
  }
  /**
   * Calls global extension method and binding current instance to the function call
   */
  // @ts-expect-error Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _callExtensionMethod(method, ...args) {
    const carrier = getMainCarrier();
    const sentry = carrier.__SENTRY__;
    if (sentry && sentry.extensions && typeof sentry.extensions[method] === "function") {
      return sentry.extensions[method].apply(this, args);
    }
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
  }
};
function getMainCarrier() {
  GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
    extensions: {},
    hub: void 0
  };
  return GLOBAL_OBJ;
}
function makeMain(hub) {
  const registry = getMainCarrier();
  const oldHub = getHubFromCarrier(registry);
  setHubOnCarrier(registry, hub);
  return oldHub;
}
function getCurrentHub() {
  const registry = getMainCarrier();
  if (registry.__SENTRY__ && registry.__SENTRY__.acs) {
    const hub = registry.__SENTRY__.acs.getCurrentHub();
    if (hub) {
      return hub;
    }
  }
  return getGlobalHub(registry);
}
function getGlobalHub(registry = getMainCarrier()) {
  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
    setHubOnCarrier(registry, new Hub());
  }
  return getHubFromCarrier(registry);
}
function hasHubOnCarrier(carrier) {
  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
function getHubFromCarrier(carrier) {
  return getGlobalSingleton("hub", () => new Hub(), carrier);
}
function setHubOnCarrier(carrier, hub) {
  if (!carrier) return false;
  const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
  __SENTRY__.hub = hub;
  return true;
}

// node_modules/@sentry/core/esm/tracing/utils.js
function getActiveTransaction(maybeHub) {
  const hub = maybeHub || getCurrentHub();
  const scope = hub.getScope();
  return scope.getTransaction();
}

// node_modules/@sentry/core/esm/tracing/errors.js
var errorsInstrumented = false;
function registerErrorInstrumentation() {
  if (errorsInstrumented) {
    return;
  }
  errorsInstrumented = true;
  addInstrumentationHandler("error", errorCallback);
  addInstrumentationHandler("unhandledrejection", errorCallback);
}
function errorCallback() {
  const activeTransaction = getActiveTransaction();
  if (activeTransaction) {
    const status = "internal_error";
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
    activeTransaction.setStatus(status);
  }
}
errorCallback.tag = "sentry_tracingErrorCallback";

// node_modules/@sentry/core/esm/tracing/span.js
var SpanRecorder = class {
  constructor(maxlen = 1e3) {
    this._maxlen = maxlen;
    this.spans = [];
  }
  /**
   * This is just so that we don't run out of memory while recording a lot
   * of spans. At some point we just stop and flush out the start of the
   * trace tree (i.e.the first n spans with the smallest
   * start_timestamp).
   */
  add(span) {
    if (this.spans.length > this._maxlen) {
      span.spanRecorder = void 0;
    } else {
      this.spans.push(span);
    }
  }
};
var Span = class _Span {
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * Internal keeper of the status
   */
  /**
   * @inheritDoc
   */
  /**
   * Timestamp in seconds when the span was created.
   */
  /**
   * Timestamp in seconds when the span ended.
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /**
   * List of spans that were finalized
   */
  /**
   * @inheritDoc
   */
  /**
   * The instrumenter that created this span.
   */
  /**
   * The origin of the span, giving context about what created the span.
   */
  /**
   * You should never call the constructor manually, always use `Sentry.startTransaction()`
   * or call `startChild()` on an existing span.
   * @internal
   * @hideconstructor
   * @hidden
   */
  constructor(spanContext = {}) {
    this.traceId = spanContext.traceId || uuid4();
    this.spanId = spanContext.spanId || uuid4().substring(16);
    this.startTimestamp = spanContext.startTimestamp || timestampInSeconds();
    this.tags = spanContext.tags || {};
    this.data = spanContext.data || {};
    this.instrumenter = spanContext.instrumenter || "sentry";
    this.origin = spanContext.origin || "manual";
    if (spanContext.parentSpanId) {
      this.parentSpanId = spanContext.parentSpanId;
    }
    if ("sampled" in spanContext) {
      this.sampled = spanContext.sampled;
    }
    if (spanContext.op) {
      this.op = spanContext.op;
    }
    if (spanContext.description) {
      this.description = spanContext.description;
    }
    if (spanContext.name) {
      this.description = spanContext.name;
    }
    if (spanContext.status) {
      this.status = spanContext.status;
    }
    if (spanContext.endTimestamp) {
      this.endTimestamp = spanContext.endTimestamp;
    }
  }
  /** An alias for `description` of the Span. */
  get name() {
    return this.description || "";
  }
  /** Update the name of the span. */
  set name(name) {
    this.setName(name);
  }
  /**
   * @inheritDoc
   */
  startChild(spanContext) {
    const childSpan = new _Span({
      ...spanContext,
      parentSpanId: this.spanId,
      sampled: this.sampled,
      traceId: this.traceId
    });
    childSpan.spanRecorder = this.spanRecorder;
    if (childSpan.spanRecorder) {
      childSpan.spanRecorder.add(childSpan);
    }
    childSpan.transaction = this.transaction;
    if ((typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && childSpan.transaction) {
      const opStr = spanContext && spanContext.op || "< unknown op >";
      const nameStr = childSpan.transaction.name || "< unknown name >";
      const idStr = childSpan.transaction.spanId;
      const logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
      childSpan.transaction.metadata.spanMetadata[childSpan.spanId] = { logMessage };
      logger.log(logMessage);
    }
    return childSpan;
  }
  /**
   * @inheritDoc
   */
  setTag(key, value) {
    this.tags = { ...this.tags, [key]: value };
    return this;
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  setData(key, value) {
    this.data = { ...this.data, [key]: value };
    return this;
  }
  /**
   * @inheritDoc
   */
  setStatus(value) {
    this.status = value;
    return this;
  }
  /**
   * @inheritDoc
   */
  setHttpStatus(httpStatus) {
    this.setTag("http.status_code", String(httpStatus));
    this.setData("http.response.status_code", httpStatus);
    const spanStatus = spanStatusfromHttpCode(httpStatus);
    if (spanStatus !== "unknown_error") {
      this.setStatus(spanStatus);
    }
    return this;
  }
  /**
   * @inheritDoc
   */
  setName(name) {
    this.description = name;
  }
  /**
   * @inheritDoc
   */
  isSuccess() {
    return this.status === "ok";
  }
  /**
   * @inheritDoc
   */
  finish(endTimestamp) {
    if ((typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && // Don't call this for transactions
    this.transaction && this.transaction.spanId !== this.spanId) {
      const { logMessage } = this.transaction.metadata.spanMetadata[this.spanId];
      if (logMessage) {
        logger.log(logMessage.replace("Starting", "Finishing"));
      }
    }
    this.endTimestamp = typeof endTimestamp === "number" ? endTimestamp : timestampInSeconds();
  }
  /**
   * @inheritDoc
   */
  toTraceparent() {
    return generateSentryTraceHeader(this.traceId, this.spanId, this.sampled);
  }
  /**
   * @inheritDoc
   */
  toContext() {
    return dropUndefinedKeys({
      data: this.data,
      description: this.description,
      endTimestamp: this.endTimestamp,
      op: this.op,
      parentSpanId: this.parentSpanId,
      sampled: this.sampled,
      spanId: this.spanId,
      startTimestamp: this.startTimestamp,
      status: this.status,
      tags: this.tags,
      traceId: this.traceId
    });
  }
  /**
   * @inheritDoc
   */
  updateWithContext(spanContext) {
    this.data = spanContext.data || {};
    this.description = spanContext.description;
    this.endTimestamp = spanContext.endTimestamp;
    this.op = spanContext.op;
    this.parentSpanId = spanContext.parentSpanId;
    this.sampled = spanContext.sampled;
    this.spanId = spanContext.spanId || this.spanId;
    this.startTimestamp = spanContext.startTimestamp || this.startTimestamp;
    this.status = spanContext.status;
    this.tags = spanContext.tags || {};
    this.traceId = spanContext.traceId || this.traceId;
    return this;
  }
  /**
   * @inheritDoc
   */
  getTraceContext() {
    return dropUndefinedKeys({
      data: Object.keys(this.data).length > 0 ? this.data : void 0,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
      trace_id: this.traceId
    });
  }
  /**
   * @inheritDoc
   */
  toJSON() {
    return dropUndefinedKeys({
      data: Object.keys(this.data).length > 0 ? this.data : void 0,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      start_timestamp: this.startTimestamp,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
      timestamp: this.endTimestamp,
      trace_id: this.traceId,
      origin: this.origin
    });
  }
};
function spanStatusfromHttpCode(httpStatus) {
  if (httpStatus < 400 && httpStatus >= 100) {
    return "ok";
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return "unauthenticated";
      case 403:
        return "permission_denied";
      case 404:
        return "not_found";
      case 409:
        return "already_exists";
      case 413:
        return "failed_precondition";
      case 429:
        return "resource_exhausted";
      default:
        return "invalid_argument";
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return "unimplemented";
      case 503:
        return "unavailable";
      case 504:
        return "deadline_exceeded";
      default:
        return "internal_error";
    }
  }
  return "unknown_error";
}

// node_modules/@sentry/core/esm/tracing/dynamicSamplingContext.js
function getDynamicSamplingContextFromClient(trace_id, client, scope) {
  const options = client.getOptions();
  const { publicKey: public_key } = client.getDsn() || {};
  const { segment: user_segment } = scope && scope.getUser() || {};
  const dsc = dropUndefinedKeys({
    environment: options.environment || DEFAULT_ENVIRONMENT,
    release: options.release,
    user_segment,
    public_key,
    trace_id
  });
  client.emit && client.emit("createDsc", dsc);
  return dsc;
}

// node_modules/@sentry/core/esm/tracing/transaction.js
var Transaction = class extends Span {
  /**
   * The reference to the current hub.
   */
  /**
   * This constructor should never be called manually. Those instrumenting tracing should use
   * `Sentry.startTransaction()`, and internal methods should use `hub.startTransaction()`.
   * @internal
   * @hideconstructor
   * @hidden
   */
  constructor(transactionContext, hub) {
    super(transactionContext);
    delete this.description;
    this._measurements = {};
    this._contexts = {};
    this._hub = hub || getCurrentHub();
    this._name = transactionContext.name || "";
    this.metadata = {
      source: "custom",
      ...transactionContext.metadata,
      spanMetadata: {}
    };
    this._trimEnd = transactionContext.trimEnd;
    this.transaction = this;
    const incomingDynamicSamplingContext = this.metadata.dynamicSamplingContext;
    if (incomingDynamicSamplingContext) {
      this._frozenDynamicSamplingContext = { ...incomingDynamicSamplingContext };
    }
  }
  /** Getter for `name` property */
  get name() {
    return this._name;
  }
  /** Setter for `name` property, which also sets `source` as custom */
  set name(newName) {
    this.setName(newName);
  }
  /**
   * JSDoc
   */
  setName(name, source = "custom") {
    this._name = name;
    this.metadata.source = source;
  }
  /**
   * Attaches SpanRecorder to the span itself
   * @param maxlen maximum number of spans that can be recorded
   */
  initSpanRecorder(maxlen = 1e3) {
    if (!this.spanRecorder) {
      this.spanRecorder = new SpanRecorder(maxlen);
    }
    this.spanRecorder.add(this);
  }
  /**
   * @inheritDoc
   */
  setContext(key, context) {
    if (context === null) {
      delete this._contexts[key];
    } else {
      this._contexts[key] = context;
    }
  }
  /**
   * @inheritDoc
   */
  setMeasurement(name, value, unit = "") {
    this._measurements[name] = { value, unit };
  }
  /**
   * @inheritDoc
   */
  setMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
  }
  /**
   * @inheritDoc
   */
  finish(endTimestamp) {
    const transaction = this._finishTransaction(endTimestamp);
    if (!transaction) {
      return void 0;
    }
    return this._hub.captureEvent(transaction);
  }
  /**
   * @inheritDoc
   */
  toContext() {
    const spanContext = super.toContext();
    return dropUndefinedKeys({
      ...spanContext,
      name: this.name,
      trimEnd: this._trimEnd
    });
  }
  /**
   * @inheritDoc
   */
  updateWithContext(transactionContext) {
    super.updateWithContext(transactionContext);
    this.name = transactionContext.name || "";
    this._trimEnd = transactionContext.trimEnd;
    return this;
  }
  /**
   * @inheritdoc
   *
   * @experimental
   */
  getDynamicSamplingContext() {
    if (this._frozenDynamicSamplingContext) {
      return this._frozenDynamicSamplingContext;
    }
    const hub = this._hub || getCurrentHub();
    const client = hub.getClient();
    if (!client) return {};
    const scope = hub.getScope();
    const dsc = getDynamicSamplingContextFromClient(this.traceId, client, scope);
    const maybeSampleRate = this.metadata.sampleRate;
    if (maybeSampleRate !== void 0) {
      dsc.sample_rate = `${maybeSampleRate}`;
    }
    const source = this.metadata.source;
    if (source && source !== "url") {
      dsc.transaction = this.name;
    }
    if (this.sampled !== void 0) {
      dsc.sampled = String(this.sampled);
    }
    return dsc;
  }
  /**
   * Override the current hub with a new one.
   * Used if you want another hub to finish the transaction.
   *
   * @internal
   */
  setHub(hub) {
    this._hub = hub;
  }
  /**
   * Finish the transaction & prepare the event to send to Sentry.
   */
  _finishTransaction(endTimestamp) {
    if (this.endTimestamp !== void 0) {
      return void 0;
    }
    if (!this.name) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Transaction has no name, falling back to `<unlabeled transaction>`.");
      this.name = "<unlabeled transaction>";
    }
    super.finish(endTimestamp);
    const client = this._hub.getClient();
    if (client && client.emit) {
      client.emit("finishTransaction", this);
    }
    if (this.sampled !== true) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled.");
      if (client) {
        client.recordDroppedEvent("sample_rate", "transaction");
      }
      return void 0;
    }
    const finishedSpans = this.spanRecorder ? this.spanRecorder.spans.filter((s) => s !== this && s.endTimestamp) : [];
    if (this._trimEnd && finishedSpans.length > 0) {
      this.endTimestamp = finishedSpans.reduce((prev, current) => {
        if (prev.endTimestamp && current.endTimestamp) {
          return prev.endTimestamp > current.endTimestamp ? prev : current;
        }
        return prev;
      }).endTimestamp;
    }
    const metadata = this.metadata;
    const transaction = {
      contexts: {
        ...this._contexts,
        // We don't want to override trace context
        trace: this.getTraceContext()
      },
      spans: finishedSpans,
      start_timestamp: this.startTimestamp,
      tags: this.tags,
      timestamp: this.endTimestamp,
      transaction: this.name,
      type: "transaction",
      sdkProcessingMetadata: {
        ...metadata,
        dynamicSamplingContext: this.getDynamicSamplingContext()
      },
      ...metadata.source && {
        transaction_info: {
          source: metadata.source
        }
      }
    };
    const hasMeasurements = Object.keys(this._measurements).length > 0;
    if (hasMeasurements) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
        "[Measurements] Adding measurements to transaction",
        JSON.stringify(this._measurements, void 0, 2)
      );
      transaction.measurements = this._measurements;
    }
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] Finishing ${this.op} transaction: ${this.name}.`);
    return transaction;
  }
};

// node_modules/@sentry/core/esm/utils/hasTracingEnabled.js
function hasTracingEnabled(maybeOptions) {
  if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) {
    return false;
  }
  const client = getCurrentHub().getClient();
  const options = maybeOptions || client && client.getOptions();
  return !!options && (options.enableTracing || "tracesSampleRate" in options || "tracesSampler" in options);
}

// node_modules/@sentry/core/esm/tracing/sampling.js
function sampleTransaction(transaction, options, samplingContext) {
  if (!hasTracingEnabled(options)) {
    transaction.sampled = false;
    return transaction;
  }
  if (transaction.sampled !== void 0) {
    transaction.setMetadata({
      sampleRate: Number(transaction.sampled)
    });
    return transaction;
  }
  let sampleRate;
  if (typeof options.tracesSampler === "function") {
    sampleRate = options.tracesSampler(samplingContext);
    transaction.setMetadata({
      sampleRate: Number(sampleRate)
    });
  } else if (samplingContext.parentSampled !== void 0) {
    sampleRate = samplingContext.parentSampled;
  } else if (typeof options.tracesSampleRate !== "undefined") {
    sampleRate = options.tracesSampleRate;
    transaction.setMetadata({
      sampleRate: Number(sampleRate)
    });
  } else {
    sampleRate = 1;
    transaction.setMetadata({
      sampleRate
    });
  }
  if (!isValidSampleRate(sampleRate)) {
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("[Tracing] Discarding transaction because of invalid sample rate.");
    transaction.sampled = false;
    return transaction;
  }
  if (!sampleRate) {
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
      `[Tracing] Discarding transaction because ${typeof options.tracesSampler === "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`
    );
    transaction.sampled = false;
    return transaction;
  }
  transaction.sampled = Math.random() < sampleRate;
  if (!transaction.sampled) {
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(
      `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(
        sampleRate
      )})`
    );
    return transaction;
  }
  (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`[Tracing] starting ${transaction.op} transaction - ${transaction.name}`);
  return transaction;
}
function isValidSampleRate(rate) {
  if (isNaN2(rate) || !(typeof rate === "number" || typeof rate === "boolean")) {
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(
      `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
        rate
      )} of type ${JSON.stringify(typeof rate)}.`
    );
    return false;
  }
  if (rate < 0 || rate > 1) {
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${rate}.`);
    return false;
  }
  return true;
}

// node_modules/@sentry/core/esm/tracing/hubextensions.js
function traceHeaders() {
  const scope = this.getScope();
  const span = scope.getSpan();
  return span ? {
    "sentry-trace": span.toTraceparent()
  } : {};
}
function _startTransaction(transactionContext, customSamplingContext) {
  const client = this.getClient();
  const options = client && client.getOptions() || {};
  const configInstrumenter = options.instrumenter || "sentry";
  const transactionInstrumenter = transactionContext.instrumenter || "sentry";
  if (configInstrumenter !== transactionInstrumenter) {
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error(
      `A transaction was started with instrumenter=\`${transactionInstrumenter}\`, but the SDK is configured with the \`${configInstrumenter}\` instrumenter.
The transaction will not be sampled. Please use the ${configInstrumenter} instrumentation to start transactions.`
    );
    transactionContext.sampled = false;
  }
  let transaction = new Transaction(transactionContext, this);
  transaction = sampleTransaction(transaction, options, {
    parentSampled: transactionContext.parentSampled,
    transactionContext,
    ...customSamplingContext
  });
  if (transaction.sampled) {
    transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
  }
  if (client && client.emit) {
    client.emit("startTransaction", transaction);
  }
  return transaction;
}
function addTracingExtensions() {
  const carrier = getMainCarrier();
  if (!carrier.__SENTRY__) {
    return;
  }
  carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
  if (!carrier.__SENTRY__.extensions.startTransaction) {
    carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
  }
  if (!carrier.__SENTRY__.extensions.traceHeaders) {
    carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
  }
  registerErrorInstrumentation();
}

// node_modules/@sentry/core/esm/sessionflusher.js
var SessionFlusher = class {
  constructor(client, attrs) {
    this._client = client;
    this.flushTimeout = 60;
    this._pendingAggregates = {};
    this._isEnabled = true;
    this._intervalId = setInterval(() => this.flush(), this.flushTimeout * 1e3);
    this._sessionAttrs = attrs;
  }
  /** Checks if `pendingAggregates` has entries, and if it does flushes them by calling `sendSession` */
  flush() {
    const sessionAggregates = this.getSessionAggregates();
    if (sessionAggregates.aggregates.length === 0) {
      return;
    }
    this._pendingAggregates = {};
    this._client.sendSession(sessionAggregates);
  }
  /** Massages the entries in `pendingAggregates` and returns aggregated sessions */
  getSessionAggregates() {
    const aggregates = Object.keys(this._pendingAggregates).map((key) => {
      return this._pendingAggregates[parseInt(key)];
    });
    const sessionAggregates = {
      attrs: this._sessionAttrs,
      aggregates
    };
    return dropUndefinedKeys(sessionAggregates);
  }
  /** JSDoc */
  close() {
    clearInterval(this._intervalId);
    this._isEnabled = false;
    this.flush();
  }
  /**
   * Wrapper function for _incrementSessionStatusCount that checks if the instance of SessionFlusher is enabled then
   * fetches the session status of the request from `Scope.getRequestSession().status` on the scope and passes them to
   * `_incrementSessionStatusCount` along with the start date
   */
  incrementSessionStatusCount() {
    if (!this._isEnabled) {
      return;
    }
    const scope = getCurrentHub().getScope();
    const requestSession = scope.getRequestSession();
    if (requestSession && requestSession.status) {
      this._incrementSessionStatusCount(requestSession.status, /* @__PURE__ */ new Date());
      scope.setRequestSession(void 0);
    }
  }
  /**
   * Increments status bucket in pendingAggregates buffer (internal state) corresponding to status of
   * the session received
   */
  _incrementSessionStatusCount(status, date) {
    const sessionStartedTrunc = new Date(date).setSeconds(0, 0);
    this._pendingAggregates[sessionStartedTrunc] = this._pendingAggregates[sessionStartedTrunc] || {};
    const aggregationCounts = this._pendingAggregates[sessionStartedTrunc];
    if (!aggregationCounts.started) {
      aggregationCounts.started = new Date(sessionStartedTrunc).toISOString();
    }
    switch (status) {
      case "errored":
        aggregationCounts.errored = (aggregationCounts.errored || 0) + 1;
        return aggregationCounts.errored;
      case "ok":
        aggregationCounts.exited = (aggregationCounts.exited || 0) + 1;
        return aggregationCounts.exited;
      default:
        aggregationCounts.crashed = (aggregationCounts.crashed || 0) + 1;
        return aggregationCounts.crashed;
    }
  }
};

// node_modules/@sentry/core/esm/api.js
var SENTRY_API_VERSION = "7";
function getBaseApiEndpoint(dsn) {
  const protocol = dsn.protocol ? `${dsn.protocol}:` : "";
  const port = dsn.port ? `:${dsn.port}` : "";
  return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
}
function _getIngestEndpoint(dsn) {
  return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
function _encodedAuth(dsn, sdkInfo) {
  return urlEncode({
    // We send only the minimum set of required information. See
    // https://github.com/getsentry/sentry-javascript/issues/2572.
    sentry_key: dsn.publicKey,
    sentry_version: SENTRY_API_VERSION,
    ...sdkInfo && { sentry_client: `${sdkInfo.name}/${sdkInfo.version}` }
  });
}
function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnelOrOptions = {}) {
  const tunnel = typeof tunnelOrOptions === "string" ? tunnelOrOptions : tunnelOrOptions.tunnel;
  const sdkInfo = typeof tunnelOrOptions === "string" || !tunnelOrOptions._metadata ? void 0 : tunnelOrOptions._metadata.sdk;
  return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}

// node_modules/@sentry/core/esm/envelope.js
function enhanceEventWithSdkInfo(event, sdkInfo) {
  if (!sdkInfo) {
    return event;
  }
  event.sdk = event.sdk || {};
  event.sdk.name = event.sdk.name || sdkInfo.name;
  event.sdk.version = event.sdk.version || sdkInfo.version;
  event.sdk.integrations = [...event.sdk.integrations || [], ...sdkInfo.integrations || []];
  event.sdk.packages = [...event.sdk.packages || [], ...sdkInfo.packages || []];
  return event;
}
function createSessionEnvelope(session, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const envelopeHeaders = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) }
  };
  const envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session.toJSON()];
  return createEnvelope(envelopeHeaders, [envelopeItem]);
}
function createEventEnvelope(event, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const eventType = event.type && event.type !== "replay_event" ? event.type : "event";
  enhanceEventWithSdkInfo(event, metadata && metadata.sdk);
  const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
  delete event.sdkProcessingMetadata;
  const eventItem = [{ type: eventType }, event];
  return createEnvelope(envelopeHeaders, [eventItem]);
}

// node_modules/@sentry/core/esm/integration.js
var installedIntegrations = [];
function filterDuplicates(integrations) {
  const integrationsByName = {};
  integrations.forEach((currentInstance) => {
    const { name } = currentInstance;
    const existingInstance = integrationsByName[name];
    if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
      return;
    }
    integrationsByName[name] = currentInstance;
  });
  return Object.keys(integrationsByName).map((k) => integrationsByName[k]);
}
function getIntegrationsToSetup(options) {
  const defaultIntegrations = options.defaultIntegrations || [];
  const userIntegrations = options.integrations;
  defaultIntegrations.forEach((integration) => {
    integration.isDefaultInstance = true;
  });
  let integrations;
  if (Array.isArray(userIntegrations)) {
    integrations = [...defaultIntegrations, ...userIntegrations];
  } else if (typeof userIntegrations === "function") {
    integrations = arrayify(userIntegrations(defaultIntegrations));
  } else {
    integrations = defaultIntegrations;
  }
  const finalIntegrations = filterDuplicates(integrations);
  const debugIndex = findIndex(finalIntegrations, (integration) => integration.name === "Debug");
  if (debugIndex !== -1) {
    const [debugInstance] = finalIntegrations.splice(debugIndex, 1);
    finalIntegrations.push(debugInstance);
  }
  return finalIntegrations;
}
function setupIntegrations(client, integrations) {
  const integrationIndex = {};
  integrations.forEach((integration) => {
    if (integration) {
      setupIntegration(client, integration, integrationIndex);
    }
  });
  return integrationIndex;
}
function setupIntegration(client, integration, integrationIndex) {
  integrationIndex[integration.name] = integration;
  if (installedIntegrations.indexOf(integration.name) === -1) {
    integration.setupOnce(addGlobalEventProcessor, getCurrentHub);
    installedIntegrations.push(integration.name);
  }
  if (client.on && typeof integration.preprocessEvent === "function") {
    const callback = integration.preprocessEvent.bind(integration);
    client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
  }
  if (client.addEventProcessor && typeof integration.processEvent === "function") {
    const callback = integration.processEvent.bind(integration);
    const processor = Object.assign((event, hint) => callback(event, hint, client), {
      id: integration.name
    });
    client.addEventProcessor(processor);
  }
  (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Integration installed: ${integration.name}`);
}
function findIndex(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i]) === true) {
      return i;
    }
  }
  return -1;
}

// node_modules/@sentry/core/esm/utils/prepareEvent.js
function prepareEvent(options, event, hint, scope, client) {
  const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options;
  const prepared = {
    ...event,
    event_id: event.event_id || hint.event_id || uuid4(),
    timestamp: event.timestamp || dateTimestampInSeconds()
  };
  const integrations = hint.integrations || options.integrations.map((i) => i.name);
  applyClientOptions(prepared, options);
  applyIntegrationsMetadata(prepared, integrations);
  if (event.type === void 0) {
    applyDebugIds(prepared, options.stackParser);
  }
  let finalScope = scope;
  if (hint.captureContext) {
    finalScope = Scope.clone(finalScope).update(hint.captureContext);
  }
  let result = resolvedSyncPromise(prepared);
  const clientEventProcessors = client && client.getEventProcessors ? client.getEventProcessors() : [];
  if (finalScope) {
    if (finalScope.getAttachments) {
      const attachments = [...hint.attachments || [], ...finalScope.getAttachments()];
      if (attachments.length) {
        hint.attachments = attachments;
      }
    }
    result = finalScope.applyToEvent(prepared, hint, clientEventProcessors);
  } else {
    result = notifyEventProcessors([...clientEventProcessors, ...getGlobalEventProcessors()], prepared, hint);
  }
  return result.then((evt) => {
    if (evt) {
      applyDebugMeta(evt);
    }
    if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
      return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
    }
    return evt;
  });
}
function applyClientOptions(event, options) {
  const { environment, release, dist, maxValueLength = 250 } = options;
  if (!("environment" in event)) {
    event.environment = "environment" in options ? environment : DEFAULT_ENVIRONMENT;
  }
  if (event.release === void 0 && release !== void 0) {
    event.release = release;
  }
  if (event.dist === void 0 && dist !== void 0) {
    event.dist = dist;
  }
  if (event.message) {
    event.message = truncate(event.message, maxValueLength);
  }
  const exception = event.exception && event.exception.values && event.exception.values[0];
  if (exception && exception.value) {
    exception.value = truncate(exception.value, maxValueLength);
  }
  const request = event.request;
  if (request && request.url) {
    request.url = truncate(request.url, maxValueLength);
  }
}
var debugIdStackParserCache = /* @__PURE__ */ new WeakMap();
function applyDebugIds(event, stackParser) {
  const debugIdMap = GLOBAL_OBJ._sentryDebugIds;
  if (!debugIdMap) {
    return;
  }
  let debugIdStackFramesCache;
  const cachedDebugIdStackFrameCache = debugIdStackParserCache.get(stackParser);
  if (cachedDebugIdStackFrameCache) {
    debugIdStackFramesCache = cachedDebugIdStackFrameCache;
  } else {
    debugIdStackFramesCache = /* @__PURE__ */ new Map();
    debugIdStackParserCache.set(stackParser, debugIdStackFramesCache);
  }
  const filenameDebugIdMap = Object.keys(debugIdMap).reduce((acc, debugIdStackTrace) => {
    let parsedStack;
    const cachedParsedStack = debugIdStackFramesCache.get(debugIdStackTrace);
    if (cachedParsedStack) {
      parsedStack = cachedParsedStack;
    } else {
      parsedStack = stackParser(debugIdStackTrace);
      debugIdStackFramesCache.set(debugIdStackTrace, parsedStack);
    }
    for (let i = parsedStack.length - 1; i >= 0; i--) {
      const stackFrame = parsedStack[i];
      if (stackFrame.filename) {
        acc[stackFrame.filename] = debugIdMap[debugIdStackTrace];
        break;
      }
    }
    return acc;
  }, {});
  try {
    event.exception.values.forEach((exception) => {
      exception.stacktrace.frames.forEach((frame) => {
        if (frame.filename) {
          frame.debug_id = filenameDebugIdMap[frame.filename];
        }
      });
    });
  } catch (e) {
  }
}
function applyDebugMeta(event) {
  const filenameDebugIdMap = {};
  try {
    event.exception.values.forEach((exception) => {
      exception.stacktrace.frames.forEach((frame) => {
        if (frame.debug_id) {
          if (frame.abs_path) {
            filenameDebugIdMap[frame.abs_path] = frame.debug_id;
          } else if (frame.filename) {
            filenameDebugIdMap[frame.filename] = frame.debug_id;
          }
          delete frame.debug_id;
        }
      });
    });
  } catch (e) {
  }
  if (Object.keys(filenameDebugIdMap).length === 0) {
    return;
  }
  event.debug_meta = event.debug_meta || {};
  event.debug_meta.images = event.debug_meta.images || [];
  const images = event.debug_meta.images;
  Object.keys(filenameDebugIdMap).forEach((filename) => {
    images.push({
      type: "sourcemap",
      code_file: filename,
      debug_id: filenameDebugIdMap[filename]
    });
  });
}
function applyIntegrationsMetadata(event, integrationNames) {
  if (integrationNames.length > 0) {
    event.sdk = event.sdk || {};
    event.sdk.integrations = [...event.sdk.integrations || [], ...integrationNames];
  }
}
function normalizeEvent(event, depth, maxBreadth) {
  if (!event) {
    return null;
  }
  const normalized = {
    ...event,
    ...event.breadcrumbs && {
      breadcrumbs: event.breadcrumbs.map((b) => ({
        ...b,
        ...b.data && {
          data: normalize(b.data, depth, maxBreadth)
        }
      }))
    },
    ...event.user && {
      user: normalize(event.user, depth, maxBreadth)
    },
    ...event.contexts && {
      contexts: normalize(event.contexts, depth, maxBreadth)
    },
    ...event.extra && {
      extra: normalize(event.extra, depth, maxBreadth)
    }
  };
  if (event.contexts && event.contexts.trace && normalized.contexts) {
    normalized.contexts.trace = event.contexts.trace;
    if (event.contexts.trace.data) {
      normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
    }
  }
  if (event.spans) {
    normalized.spans = event.spans.map((span) => {
      if (span.data) {
        span.data = normalize(span.data, depth, maxBreadth);
      }
      return span;
    });
  }
  return normalized;
}

// node_modules/@sentry/core/esm/baseclient.js
var ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
var BaseClient = class {
  /** Options passed to the SDK. */
  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  /** Array of set up integrations. */
  /** Indicates whether this client's integrations have been set up. */
  /** Number of calls being processed */
  /** Holds flushable  */
  // eslint-disable-next-line @typescript-eslint/ban-types
  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */
  constructor(options) {
    this._options = options;
    this._integrations = {};
    this._integrationsInitialized = false;
    this._numProcessing = 0;
    this._outcomes = {};
    this._hooks = {};
    this._eventProcessors = [];
    if (options.dsn) {
      this._dsn = makeDsn(options.dsn);
    } else {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("No DSN provided, client will not send events.");
    }
    if (this._dsn) {
      const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
      this._transport = options.transport({
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...options.transportOptions,
        url
      });
    }
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  captureException(exception, hint, scope) {
    if (checkOrSetAlreadyCaught(exception)) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(ALREADY_SEEN_ERROR);
      return;
    }
    let eventId = hint && hint.event_id;
    this._process(
      this.eventFromException(exception, hint).then((event) => this._captureEvent(event, hint, scope)).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureMessage(message, level, hint, scope) {
    let eventId = hint && hint.event_id;
    const promisedEvent = isPrimitive(message) ? this.eventFromMessage(String(message), level, hint) : this.eventFromException(message, hint);
    this._process(
      promisedEvent.then((event) => this._captureEvent(event, hint, scope)).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint, scope) {
    if (hint && hint.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(ALREADY_SEEN_ERROR);
      return;
    }
    let eventId = hint && hint.event_id;
    this._process(
      this._captureEvent(event, hint, scope).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureSession(session) {
    if (!(typeof session.release === "string")) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Discarded session because of missing or non-string release");
    } else {
      this.sendSession(session);
      updateSession(session, { init: false });
    }
  }
  /**
   * @inheritDoc
   */
  getDsn() {
    return this._dsn;
  }
  /**
   * @inheritDoc
   */
  getOptions() {
    return this._options;
  }
  /**
   * @see SdkMetadata in @sentry/types
   *
   * @return The metadata of the SDK
   */
  getSdkMetadata() {
    return this._options._metadata;
  }
  /**
   * @inheritDoc
   */
  getTransport() {
    return this._transport;
  }
  /**
   * @inheritDoc
   */
  flush(timeout) {
    const transport = this._transport;
    if (transport) {
      return this._isClientDoneProcessing(timeout).then((clientFinished) => {
        return transport.flush(timeout).then((transportFlushed) => clientFinished && transportFlushed);
      });
    } else {
      return resolvedSyncPromise(true);
    }
  }
  /**
   * @inheritDoc
   */
  close(timeout) {
    return this.flush(timeout).then((result) => {
      this.getOptions().enabled = false;
      return result;
    });
  }
  /** Get all installed event processors. */
  getEventProcessors() {
    return this._eventProcessors;
  }
  /** @inheritDoc */
  addEventProcessor(eventProcessor) {
    this._eventProcessors.push(eventProcessor);
  }
  /**
   * Sets up the integrations
   */
  setupIntegrations(forceInitialize) {
    if (forceInitialize && !this._integrationsInitialized || this._isEnabled() && !this._integrationsInitialized) {
      this._integrations = setupIntegrations(this, this._options.integrations);
      this._integrationsInitialized = true;
    }
  }
  /**
   * Gets an installed integration by its `id`.
   *
   * @returns The installed integration or `undefined` if no integration with that `id` was installed.
   */
  getIntegrationById(integrationId) {
    return this._integrations[integrationId];
  }
  /**
   * @inheritDoc
   */
  getIntegration(integration) {
    try {
      return this._integrations[integration.id] || null;
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);
      return null;
    }
  }
  /**
   * @inheritDoc
   */
  addIntegration(integration) {
    setupIntegration(this, integration, this._integrations);
  }
  /**
   * @inheritDoc
   */
  sendEvent(event, hint = {}) {
    this.emit("beforeSendEvent", event, hint);
    let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
    for (const attachment of hint.attachments || []) {
      env = addItemToEnvelope(
        env,
        createAttachmentEnvelopeItem(
          attachment,
          this._options.transportOptions && this._options.transportOptions.textEncoder
        )
      );
    }
    const promise = this._sendEnvelope(env);
    if (promise) {
      promise.then((sendResponse) => this.emit("afterSendEvent", event, sendResponse), null);
    }
  }
  /**
   * @inheritDoc
   */
  sendSession(session) {
    const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
    void this._sendEnvelope(env);
  }
  /**
   * @inheritDoc
   */
  recordDroppedEvent(reason, category, _event) {
    if (this._options.sendClientReports) {
      const key = `${reason}:${category}`;
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.log(`Adding outcome: "${key}"`);
      this._outcomes[key] = this._outcomes[key] + 1 || 1;
    }
  }
  // Keep on() & emit() signatures in sync with types' client.ts interface
  /* eslint-disable @typescript-eslint/unified-signatures */
  /** @inheritdoc */
  /** @inheritdoc */
  on(hook, callback) {
    if (!this._hooks[hook]) {
      this._hooks[hook] = [];
    }
    this._hooks[hook].push(callback);
  }
  /** @inheritdoc */
  /** @inheritdoc */
  emit(hook, ...rest) {
    if (this._hooks[hook]) {
      this._hooks[hook].forEach((callback) => callback(...rest));
    }
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  /** Updates existing session based on the provided event */
  _updateSessionFromEvent(session, event) {
    let crashed = false;
    let errored = false;
    const exceptions = event.exception && event.exception.values;
    if (exceptions) {
      errored = true;
      for (const ex of exceptions) {
        const mechanism = ex.mechanism;
        if (mechanism && mechanism.handled === false) {
          crashed = true;
          break;
        }
      }
    }
    const sessionNonTerminal = session.status === "ok";
    const shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;
    if (shouldUpdateAndSend) {
      updateSession(session, {
        ...crashed && { status: "crashed" },
        errors: session.errors || Number(errored || crashed)
      });
      this.captureSession(session);
    }
  }
  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */
  _isClientDoneProcessing(timeout) {
    return new SyncPromise((resolve2) => {
      let ticked = 0;
      const tick = 1;
      const interval = setInterval(() => {
        if (this._numProcessing == 0) {
          clearInterval(interval);
          resolve2(true);
        } else {
          ticked += tick;
          if (timeout && ticked >= timeout) {
            clearInterval(interval);
            resolve2(false);
          }
        }
      }, tick);
    });
  }
  /** Determines whether this SDK is enabled and a transport is present. */
  _isEnabled() {
    return this.getOptions().enabled !== false && this._transport !== void 0;
  }
  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A new event with more information.
   */
  _prepareEvent(event, hint, scope) {
    const options = this.getOptions();
    const integrations = Object.keys(this._integrations);
    if (!hint.integrations && integrations.length > 0) {
      hint.integrations = integrations;
    }
    this.emit("preprocessEvent", event, hint);
    return prepareEvent(options, event, hint, scope, this).then((evt) => {
      if (evt === null) {
        return evt;
      }
      const { propagationContext } = evt.sdkProcessingMetadata || {};
      const trace = evt.contexts && evt.contexts.trace;
      if (!trace && propagationContext) {
        const { traceId: trace_id, spanId, parentSpanId, dsc } = propagationContext;
        evt.contexts = {
          trace: {
            trace_id,
            span_id: spanId,
            parent_span_id: parentSpanId
          },
          ...evt.contexts
        };
        const dynamicSamplingContext = dsc ? dsc : getDynamicSamplingContextFromClient(trace_id, this, scope);
        evt.sdkProcessingMetadata = {
          dynamicSamplingContext,
          ...evt.sdkProcessingMetadata
        };
      }
      return evt;
    });
  }
  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */
  _captureEvent(event, hint = {}, scope) {
    return this._processEvent(event, hint, scope).then(
      (finalEvent) => {
        return finalEvent.event_id;
      },
      (reason) => {
        if (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) {
          const sentryError = reason;
          if (sentryError.logLevel === "log") {
            logger.log(sentryError.message);
          } else {
            logger.warn(sentryError);
          }
        }
        return void 0;
      }
    );
  }
  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */
  _processEvent(event, hint, scope) {
    const options = this.getOptions();
    const { sampleRate } = options;
    const isTransaction = isTransactionEvent(event);
    const isError2 = isErrorEvent2(event);
    const eventType = event.type || "error";
    const beforeSendLabel = `before send for type \`${eventType}\``;
    if (isError2 && typeof sampleRate === "number" && Math.random() > sampleRate) {
      this.recordDroppedEvent("sample_rate", "error", event);
      return rejectedSyncPromise(
        new SentryError(
          `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,
          "log"
        )
      );
    }
    const dataCategory = eventType === "replay_event" ? "replay" : eventType;
    return this._prepareEvent(event, hint, scope).then((prepared) => {
      if (prepared === null) {
        this.recordDroppedEvent("event_processor", dataCategory, event);
        throw new SentryError("An event processor returned `null`, will not send event.", "log");
      }
      const isInternalException = hint.data && hint.data.__sentry__ === true;
      if (isInternalException) {
        return prepared;
      }
      const result = processBeforeSend(options, prepared, hint);
      return _validateBeforeSendResult(result, beforeSendLabel);
    }).then((processedEvent) => {
      if (processedEvent === null) {
        this.recordDroppedEvent("before_send", dataCategory, event);
        throw new SentryError(`${beforeSendLabel} returned \`null\`, will not send event.`, "log");
      }
      const session = scope && scope.getSession();
      if (!isTransaction && session) {
        this._updateSessionFromEvent(session, processedEvent);
      }
      const transactionInfo = processedEvent.transaction_info;
      if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
        const source = "custom";
        processedEvent.transaction_info = {
          ...transactionInfo,
          source
        };
      }
      this.sendEvent(processedEvent, hint);
      return processedEvent;
    }).then(null, (reason) => {
      if (reason instanceof SentryError) {
        throw reason;
      }
      this.captureException(reason, {
        data: {
          __sentry__: true
        },
        originalException: reason
      });
      throw new SentryError(
        `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`
      );
    });
  }
  /**
   * Occupies the client with processing and event
   */
  _process(promise) {
    this._numProcessing++;
    void promise.then(
      (value) => {
        this._numProcessing--;
        return value;
      },
      (reason) => {
        this._numProcessing--;
        return reason;
      }
    );
  }
  /**
   * @inheritdoc
   */
  _sendEnvelope(envelope) {
    this.emit("beforeEnvelope", envelope);
    if (this._isEnabled() && this._transport) {
      return this._transport.send(envelope).then(null, (reason) => {
        (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error("Error while sending event:", reason);
      });
    } else {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error("Transport disabled");
    }
  }
  /**
   * Clears outcomes on this client and returns them.
   */
  _clearOutcomes() {
    const outcomes = this._outcomes;
    this._outcomes = {};
    return Object.keys(outcomes).map((key) => {
      const [reason, category] = key.split(":");
      return {
        reason,
        category,
        quantity: outcomes[key]
      };
    });
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
};
function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
  const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
  if (isThenable(beforeSendResult)) {
    return beforeSendResult.then(
      (event) => {
        if (!isPlainObject(event) && event !== null) {
          throw new SentryError(invalidValueError);
        }
        return event;
      },
      (e) => {
        throw new SentryError(`${beforeSendLabel} rejected with ${e}`);
      }
    );
  } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
    throw new SentryError(invalidValueError);
  }
  return beforeSendResult;
}
function processBeforeSend(options, event, hint) {
  const { beforeSend, beforeSendTransaction } = options;
  if (isErrorEvent2(event) && beforeSend) {
    return beforeSend(event, hint);
  }
  if (isTransactionEvent(event) && beforeSendTransaction) {
    return beforeSendTransaction(event, hint);
  }
  return event;
}
function isErrorEvent2(event) {
  return event.type === void 0;
}
function isTransactionEvent(event) {
  return event.type === "transaction";
}

// node_modules/@sentry/core/esm/checkin.js
function createCheckInEnvelope(checkIn, dynamicSamplingContext, metadata, tunnel, dsn) {
  const headers = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (metadata && metadata.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version
    };
  }
  if (!!tunnel && !!dsn) {
    headers.dsn = dsnToString(dsn);
  }
  if (dynamicSamplingContext) {
    headers.trace = dropUndefinedKeys(dynamicSamplingContext);
  }
  const item = createCheckInEnvelopeItem(checkIn);
  return createEnvelope(headers, [item]);
}
function createCheckInEnvelopeItem(checkIn) {
  const checkInHeaders = {
    type: "check_in"
  };
  return [checkInHeaders, checkIn];
}

// node_modules/@sentry/core/esm/server-runtime-client.js
var ServerRuntimeClient = class extends BaseClient {
  /**
   * Creates a new Edge SDK instance.
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    addTracingExtensions();
    super(options);
  }
  /**
   * @inheritDoc
   */
  eventFromException(exception, hint) {
    return resolvedSyncPromise(eventFromUnknownInput(getCurrentHub, this._options.stackParser, exception, hint));
  }
  /**
   * @inheritDoc
   */
  eventFromMessage(message, level = "info", hint) {
    return resolvedSyncPromise(
      eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace)
    );
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  captureException(exception, hint, scope) {
    if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
      const requestSession = scope.getRequestSession();
      if (requestSession && requestSession.status === "ok") {
        requestSession.status = "errored";
      }
    }
    return super.captureException(exception, hint, scope);
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint, scope) {
    if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
      const eventType = event.type || "exception";
      const isException = eventType === "exception" && event.exception && event.exception.values && event.exception.values.length > 0;
      if (isException) {
        const requestSession = scope.getRequestSession();
        if (requestSession && requestSession.status === "ok") {
          requestSession.status = "errored";
        }
      }
    }
    return super.captureEvent(event, hint, scope);
  }
  /**
   *
   * @inheritdoc
   */
  close(timeout) {
    if (this._sessionFlusher) {
      this._sessionFlusher.close();
    }
    return super.close(timeout);
  }
  /** Method that initialises an instance of SessionFlusher on Client */
  initSessionFlusher() {
    const { release, environment } = this._options;
    if (!release) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Cannot initialise an instance of SessionFlusher if no release is provided!");
    } else {
      this._sessionFlusher = new SessionFlusher(this, {
        release,
        environment
      });
    }
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */
  captureCheckIn(checkIn, monitorConfig, scope) {
    const id = checkIn.status !== "in_progress" && checkIn.checkInId ? checkIn.checkInId : uuid4();
    if (!this._isEnabled()) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("SDK not enabled, will not capture checkin.");
      return id;
    }
    const options = this.getOptions();
    const { release, environment, tunnel } = options;
    const serializedCheckIn = {
      check_in_id: id,
      monitor_slug: checkIn.monitorSlug,
      status: checkIn.status,
      release,
      environment
    };
    if (checkIn.status !== "in_progress") {
      serializedCheckIn.duration = checkIn.duration;
    }
    if (monitorConfig) {
      serializedCheckIn.monitor_config = {
        schedule: monitorConfig.schedule,
        checkin_margin: monitorConfig.checkinMargin,
        max_runtime: monitorConfig.maxRuntime,
        timezone: monitorConfig.timezone
      };
    }
    const [dynamicSamplingContext, traceContext] = this._getTraceInfoFromScope(scope);
    if (traceContext) {
      serializedCheckIn.contexts = {
        trace: traceContext
      };
    }
    const envelope = createCheckInEnvelope(
      serializedCheckIn,
      dynamicSamplingContext,
      this.getSdkMetadata(),
      tunnel,
      this.getDsn()
    );
    (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.info("Sending checkin:", checkIn.monitorSlug, checkIn.status);
    void this._sendEnvelope(envelope);
    return id;
  }
  /**
   * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
   * appropriate session aggregates bucket
   */
  _captureRequestSession() {
    if (!this._sessionFlusher) {
      (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn("Discarded request mode session because autoSessionTracking option was disabled");
    } else {
      this._sessionFlusher.incrementSessionStatusCount();
    }
  }
  /**
   * @inheritDoc
   */
  _prepareEvent(event, hint, scope) {
    if (this._options.platform) {
      event.platform = event.platform || this._options.platform;
    }
    if (this._options.runtime) {
      event.contexts = {
        ...event.contexts,
        runtime: (event.contexts || {}).runtime || this._options.runtime
      };
    }
    if (this._options.serverName) {
      event.server_name = event.server_name || this._options.serverName;
    }
    return super._prepareEvent(event, hint, scope);
  }
  /** Extract trace information from scope */
  _getTraceInfoFromScope(scope) {
    if (!scope) {
      return [void 0, void 0];
    }
    const span = scope.getSpan();
    if (span) {
      const samplingContext = span.transaction ? span.transaction.getDynamicSamplingContext() : void 0;
      return [samplingContext, span.getTraceContext()];
    }
    const { traceId, spanId, parentSpanId, dsc } = scope.getPropagationContext();
    const traceContext = {
      trace_id: traceId,
      span_id: spanId,
      parent_span_id: parentSpanId
    };
    if (dsc) {
      return [dsc, traceContext];
    }
    return [getDynamicSamplingContextFromClient(traceId, this, scope), traceContext];
  }
};

// node_modules/@sentry/core/esm/transports/base.js
var DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
function createTransport(options, makeRequest, buffer = makePromiseBuffer(
  options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE
)) {
  let rateLimits = {};
  const flush = (timeout) => buffer.drain(timeout);
  function send(envelope) {
    const filteredEnvelopeItems = [];
    forEachEnvelopeItem(envelope, (item, type) => {
      const envelopeItemDataCategory = envelopeItemTypeToDataCategory(type);
      if (isRateLimited(rateLimits, envelopeItemDataCategory)) {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent("ratelimit_backoff", envelopeItemDataCategory, event);
      } else {
        filteredEnvelopeItems.push(item);
      }
    });
    if (filteredEnvelopeItems.length === 0) {
      return resolvedSyncPromise();
    }
    const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
    const recordEnvelopeLoss = (reason) => {
      forEachEnvelopeItem(filteredEnvelope, (item, type) => {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type), event);
      });
    };
    const requestTask = () => makeRequest({ body: serializeEnvelope(filteredEnvelope, options.textEncoder) }).then(
      (response) => {
        if (response.statusCode !== void 0 && (response.statusCode < 200 || response.statusCode >= 300)) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
        }
        rateLimits = updateRateLimits(rateLimits, response);
        return response;
      },
      (error) => {
        recordEnvelopeLoss("network_error");
        throw error;
      }
    );
    return buffer.add(requestTask).then(
      (result) => result,
      (error) => {
        if (error instanceof SentryError) {
          (typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__) && logger.error("Skipped sending event because buffer is full.");
          recordEnvelopeLoss("queue_overflow");
          return resolvedSyncPromise();
        } else {
          throw error;
        }
      }
    );
  }
  send.__sentry__baseTransport__ = true;
  return {
    send,
    flush
  };
}
function getEventForEnvelopeItem(item, type) {
  if (type !== "event" && type !== "transaction") {
    return void 0;
  }
  return Array.isArray(item) ? item[1] : void 0;
}

// node_modules/toucan-js/dist/index.esm.js
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isMechanism(value) {
  return isObject(value) && "handled" in value && typeof value.handled === "boolean" && "type" in value && typeof value.type === "string";
}
function containsMechanism(value) {
  return isObject(value) && "mechanism" in value && isMechanism(value["mechanism"]);
}
function getSentryRelease() {
  if (GLOBAL_OBJ.SENTRY_RELEASE && GLOBAL_OBJ.SENTRY_RELEASE.id) {
    return GLOBAL_OBJ.SENTRY_RELEASE.id;
  }
}
function setOnOptional(target, entry) {
  if (target !== void 0) {
    target[entry[0]] = entry[1];
    return target;
  } else {
    return { [entry[0]]: entry[1] };
  }
}
function parseStackFrames2(stackParser, error) {
  return stackParser(error.stack || "", 1);
}
function extractMessage(ex) {
  const message = ex && ex.message;
  if (!message) {
    return "No error message";
  }
  if (message.error && typeof message.error.message === "string") {
    return message.error.message;
  }
  return message;
}
function exceptionFromError2(stackParser, error) {
  const exception = {
    type: error.name || error.constructor.name,
    value: extractMessage(error)
  };
  const frames = parseStackFrames2(stackParser, error);
  if (frames.length) {
    exception.stacktrace = { frames };
  }
  if (exception.type === void 0 && exception.value === "") {
    exception.value = "Unrecoverable error caught";
  }
  return exception;
}
function eventFromUnknownInput2(sdk, stackParser, exception, hint) {
  let ex;
  const providedMechanism = hint && hint.data && containsMechanism(hint.data) ? hint.data.mechanism : void 0;
  const mechanism = providedMechanism ?? {
    handled: true,
    type: "generic"
  };
  if (!isError(exception)) {
    if (isPlainObject(exception)) {
      const message = `Non-Error exception captured with keys: ${extractExceptionKeysForMessage(exception)}`;
      const client = sdk?.getClient();
      const normalizeDepth = client && client.getOptions().normalizeDepth;
      sdk?.configureScope((scope) => {
        scope.setExtra("__serialized__", normalizeToSize(exception, normalizeDepth));
      });
      ex = hint && hint.syntheticException || new Error(message);
      ex.message = message;
    } else {
      ex = hint && hint.syntheticException || new Error(exception);
      ex.message = exception;
    }
    mechanism.synthetic = true;
  } else {
    ex = exception;
  }
  const event = {
    exception: {
      values: [exceptionFromError2(stackParser, ex)]
    }
  };
  addExceptionTypeValue(event, void 0, void 0);
  addExceptionMechanism(event, mechanism);
  return {
    ...event,
    event_id: hint && hint.event_id
  };
}
function eventFromMessage2(stackParser, message, level = "info", hint, attachStacktrace) {
  const event = {
    event_id: hint && hint.event_id,
    level,
    message
  };
  if (attachStacktrace && hint && hint.syntheticException) {
    const frames = parseStackFrames2(stackParser, hint.syntheticException);
    if (frames.length) {
      event.exception = {
        values: [
          {
            value: message,
            stacktrace: { frames }
          }
        ]
      };
    }
  }
  return event;
}
var DEFAULT_LIMIT = 5;
var LinkedErrors = class _LinkedErrors {
  static id = "LinkedErrors";
  name = _LinkedErrors.id;
  limit;
  constructor(options = {}) {
    this.limit = options.limit || DEFAULT_LIMIT;
  }
  setupOnce(addGlobalEventProcessor2, getCurrentHub2) {
    const client = getCurrentHub2().getClient();
    if (!client) {
      return;
    }
    addGlobalEventProcessor2((event, hint) => {
      const self2 = getCurrentHub2().getIntegration(_LinkedErrors);
      if (!self2) {
        return event;
      }
      return handler(client.getOptions().stackParser, self2.limit, event, hint);
    });
  }
};
function handler(parser, limit, event, hint) {
  if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
    return event;
  }
  const linkedErrors = walkErrorTree(parser, limit, hint.originalException);
  event.exception.values = [...linkedErrors, ...event.exception.values];
  return event;
}
function walkErrorTree(parser, limit, error, stack = []) {
  if (!isInstanceOf(error.cause, Error) || stack.length + 1 >= limit) {
    return stack;
  }
  const exception = exceptionFromError2(parser, error.cause);
  return walkErrorTree(parser, limit, error.cause, [
    exception,
    ...stack
  ]);
}
var defaultRequestDataOptions = {
  allowedHeaders: ["CF-RAY", "CF-Worker"]
};
var RequestData = class _RequestData {
  static id = "RequestData";
  name = _RequestData.id;
  #options;
  constructor(options = {}) {
    this.#options = { ...defaultRequestDataOptions, ...options };
  }
  setupOnce(addGlobalEventProcessor2, getCurrentHub2) {
    const client = getCurrentHub2().getClient();
    if (!client) {
      return;
    }
    addGlobalEventProcessor2((event) => {
      const { sdkProcessingMetadata } = event;
      const self2 = getCurrentHub2().getIntegration(_RequestData);
      if (!self2 || !sdkProcessingMetadata) {
        return event;
      }
      if ("request" in sdkProcessingMetadata && sdkProcessingMetadata.request instanceof Request) {
        event.request = toEventRequest(sdkProcessingMetadata.request, this.#options);
        event.user = toEventUser(event.user ?? {}, sdkProcessingMetadata.request, this.#options);
      }
      if ("requestData" in sdkProcessingMetadata) {
        if (event.request) {
          event.request.data = sdkProcessingMetadata.requestData;
        } else {
          event.request = {
            data: sdkProcessingMetadata.requestData
          };
        }
      }
      return event;
    });
  }
};
function toEventUser(user, request, options) {
  const ip_address = request.headers.get("CF-Connecting-IP");
  const { allowedIps } = options;
  const newUser = { ...user };
  if (!("ip_address" in user) && // If ip_address is already set from explicitly called setUser, we don't want to overwrite it
  ip_address && allowedIps !== void 0 && testAllowlist(ip_address, allowedIps)) {
    newUser.ip_address = ip_address;
  }
  return Object.keys(newUser).length > 0 ? newUser : void 0;
}
function toEventRequest(request, options) {
  const cookieString = request.headers.get("cookie");
  let cookies = void 0;
  if (cookieString) {
    try {
      cookies = parseCookie(cookieString);
    } catch (e) {
    }
  }
  const headers = {};
  for (const [k, v] of request.headers.entries()) {
    if (k !== "cookie") {
      headers[k] = v;
    }
  }
  const eventRequest = {
    method: request.method,
    cookies,
    headers
  };
  try {
    const url = new URL(request.url);
    eventRequest.url = `${url.protocol}//${url.hostname}${url.pathname}`;
    eventRequest.query_string = url.search;
  } catch (e) {
    const qi = request.url.indexOf("?");
    if (qi < 0) {
      eventRequest.url = request.url;
    } else {
      eventRequest.url = request.url.substr(0, qi);
      eventRequest.query_string = request.url.substr(qi + 1);
    }
  }
  const { allowedHeaders, allowedCookies, allowedSearchParams } = options;
  if (allowedHeaders !== void 0 && eventRequest.headers) {
    eventRequest.headers = applyAllowlistToObject(eventRequest.headers, allowedHeaders);
    if (Object.keys(eventRequest.headers).length === 0) {
      delete eventRequest.headers;
    }
  } else {
    delete eventRequest.headers;
  }
  if (allowedCookies !== void 0 && eventRequest.cookies) {
    eventRequest.cookies = applyAllowlistToObject(eventRequest.cookies, allowedCookies);
    if (Object.keys(eventRequest.cookies).length === 0) {
      delete eventRequest.cookies;
    }
  } else {
    delete eventRequest.cookies;
  }
  if (allowedSearchParams !== void 0) {
    const params = Object.fromEntries(new URLSearchParams(eventRequest.query_string));
    const allowedParams = new URLSearchParams();
    Object.keys(applyAllowlistToObject(params, allowedSearchParams)).forEach((allowedKey) => {
      allowedParams.set(allowedKey, params[allowedKey]);
    });
    eventRequest.query_string = allowedParams.toString();
  } else {
    delete eventRequest.query_string;
  }
  return eventRequest;
}
function testAllowlist(target, allowlist) {
  if (typeof allowlist === "boolean") {
    return allowlist;
  } else if (allowlist instanceof RegExp) {
    return allowlist.test(target);
  } else if (Array.isArray(allowlist)) {
    const allowlistLowercased = allowlist.map((item) => item.toLowerCase());
    return allowlistLowercased.includes(target);
  } else {
    return false;
  }
}
function applyAllowlistToObject(target, allowlist) {
  let predicate = () => false;
  if (typeof allowlist === "boolean") {
    return allowlist ? target : {};
  } else if (allowlist instanceof RegExp) {
    predicate = (item) => allowlist.test(item);
  } else if (Array.isArray(allowlist)) {
    const allowlistLowercased = allowlist.map((item) => item.toLowerCase());
    predicate = (item) => allowlistLowercased.includes(item.toLowerCase());
  } else {
    return {};
  }
  return Object.keys(target).filter(predicate).reduce((allowed, key) => {
    allowed[key] = target[key];
    return allowed;
  }, {});
}
function parseCookie(cookieString) {
  if (typeof cookieString !== "string") {
    return {};
  }
  try {
    return cookieString.split(";").map((part) => part.split("=")).reduce((acc, [cookieKey, cookieValue]) => {
      acc[decodeURIComponent(cookieKey.trim())] = decodeURIComponent(cookieValue.trim());
      return acc;
    }, {});
  } catch {
    return {};
  }
}
function setupIntegrations2(integrations, sdk) {
  const integrationIndex = {};
  integrations.forEach((integration) => {
    integrationIndex[integration.name] = integration;
    integration.setupOnce((callback) => {
      sdk.getScope()?.addEventProcessor(callback);
    }, () => sdk);
  });
  return integrationIndex;
}
var ToucanClient = class extends ServerRuntimeClient {
  /**
   * Some functions need to access the Hub (Toucan instance) this client is bound to,
   * but calling 'getCurrentHub()' is unsafe because it uses globals.
   * So we store a reference to the Hub after binding to it and provide it to methods that need it.
   */
  #sdk = null;
  /**
   * Creates a new Toucan SDK instance.
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    options._metadata = options._metadata || {};
    options._metadata.sdk = options._metadata.sdk || {
      name: "toucan-js",
      packages: [
        {
          name: "npm:toucan-js",
          version: "3.3.1"
        }
      ],
      version: "3.3.1"
    };
    super(options);
  }
  /**
   * By default, integrations are stored in a global. We want to store them in a local instance because they may have contextual data, such as event request.
   */
  setupIntegrations() {
    if (this._isEnabled() && !this._integrationsInitialized && this.#sdk) {
      this._integrations = setupIntegrations2(this._options.integrations, this.#sdk);
      this._integrationsInitialized = true;
    }
  }
  eventFromException(exception, hint) {
    return resolvedSyncPromise(eventFromUnknownInput2(this.#sdk, this._options.stackParser, exception, hint));
  }
  eventFromMessage(message, level = "info", hint) {
    return resolvedSyncPromise(eventFromMessage2(this._options.stackParser, message, level, hint, this._options.attachStacktrace));
  }
  _prepareEvent(event, hint, scope) {
    event.platform = event.platform || "javascript";
    if (this.getOptions().request) {
      event.sdkProcessingMetadata = setOnOptional(event.sdkProcessingMetadata, [
        "request",
        this.getOptions().request
      ]);
    }
    if (this.getOptions().requestData) {
      event.sdkProcessingMetadata = setOnOptional(event.sdkProcessingMetadata, [
        "requestData",
        this.getOptions().requestData
      ]);
    }
    return super._prepareEvent(event, hint, scope);
  }
  getSdk() {
    return this.#sdk;
  }
  setSdk(sdk) {
    this.#sdk = sdk;
  }
  /**
   * Sets the request body context on all future events.
   *
   * @param body Request body.
   * @example
   * const body = await request.text();
   * toucan.setRequestBody(body);
   */
  setRequestBody(body) {
    this.getOptions().requestData = body;
  }
  /**
   * Enable/disable the SDK.
   *
   * @param enabled
   */
  setEnabled(enabled) {
    this.getOptions().enabled = enabled;
  }
};
function workersStackLineParser(getModule2) {
  const [arg1, arg2] = nodeStackLineParser(getModule2);
  const fn = (line) => {
    const result = arg2(line);
    if (result) {
      const filename = result.filename;
      result.abs_path = filename !== void 0 && !filename.startsWith("/") ? `/${filename}` : filename;
      result.in_app = filename !== void 0;
    }
    return result;
  };
  return [arg1, fn];
}
function getModule(filename) {
  if (!filename) {
    return;
  }
  return basename(filename, ".js");
}
var defaultStackParser = createStackParser(workersStackLineParser(getModule));
function makeFetchTransport(options) {
  function makeRequest({ body }) {
    try {
      const fetchFn = options.fetcher ?? fetch;
      const request = fetchFn(options.url, {
        method: "POST",
        headers: options.headers,
        body
      }).then((response) => {
        return {
          statusCode: response.status,
          headers: {
            "retry-after": response.headers.get("Retry-After"),
            "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits")
          }
        };
      });
      if (options.context) {
        options.context.waitUntil(request);
      }
      return request;
    } catch (e) {
      return rejectedSyncPromise(e);
    }
  }
  return createTransport(options, makeRequest);
}
var Toucan = class extends Hub {
  constructor(options) {
    options.defaultIntegrations = options.defaultIntegrations === false ? [] : [
      ...Array.isArray(options.defaultIntegrations) ? options.defaultIntegrations : [
        new RequestData(options.requestDataOptions),
        new LinkedErrors()
      ]
    ];
    if (options.release === void 0) {
      const detectedRelease = getSentryRelease();
      if (detectedRelease !== void 0) {
        options.release = detectedRelease;
      }
    }
    const client = new ToucanClient({
      ...options,
      transport: makeFetchTransport,
      integrations: getIntegrationsToSetup(options),
      stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
      transportOptions: {
        ...options.transportOptions,
        context: options.context
      }
    });
    super(client);
    client.setSdk(this);
    client.setupIntegrations();
  }
  /**
   * Sets the request body context on all future events.
   *
   * @param body Request body.
   * @example
   * const body = await request.text();
   * toucan.setRequestBody(body);
   */
  setRequestBody(body) {
    this.getClient()?.setRequestBody(body);
  }
  /**
   * Enable/disable the SDK.
   *
   * @param enabled
   */
  setEnabled(enabled) {
    this.getClient()?.setEnabled(enabled);
  }
  /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */
  captureCheckIn(checkIn, monitorConfig, scope) {
    if (checkIn.status === "in_progress") {
      this.setContext("monitor", { slug: checkIn.monitorSlug });
    }
    const client = this.getClient();
    return client.captureCheckIn(checkIn, monitorConfig, scope);
  }
};

// src/context/logging.ts
var FlexibleLogger = class {
  constructor(environment, options) {
    if (environment === "dev") {
      this.logger = new ConsoleLogger();
    } else {
      this.logger = new SentryLogger(environment, options);
    }
  }
  addBreadcrumb(breadcrumb) {
    this.logger.addBreadcrumb(breadcrumb);
  }
  captureException(e) {
    this.logger.captureException(e);
  }
  setTag(key, value) {
    this.logger.setTag(key, value);
  }
  setSampleRate(sampleRate) {
    this.logger.setSampleRate(sampleRate);
  }
  // any inherited from @sentry/types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(category, message, data) {
    this.logger.info(category, message, data);
  }
};
var SentryLogger = class {
  constructor(environment, options) {
    this.environment = environment;
    this.context = options.context;
    this.request = options.request;
    this.service = options.service;
    this.sentry = new Toucan({
      dsn: options.dsn,
      context: this.context,
      request: this.request,
      integrations: [new RewriteFrames({ root: "/" })],
      environment: this.environment,
      release: options.release,
      transportOptions: {
        headers: {
          "CF-Access-Client-ID": options.accessClientId,
          "CF-Access-Client-Secret": options.accessClientSecret
        }
      }
    });
    this.sentry.setTag("coloName", options.coloName);
    this.sentry.setTag("service", this.service);
    this.sampleRate = 1;
    if (options.sampleRate !== void 0) {
      this.setSampleRate(options.sampleRate);
    }
  }
  setTag(key, value) {
    this.sentry.setTag(key, value);
  }
  setSampleRate(sampleRate) {
    if (typeof sampleRate !== "number" || !Number.isFinite(sampleRate)) {
      return;
    }
    if (sampleRate < 0 || sampleRate > 1) {
      return;
    }
    this.sampleRate = sampleRate;
  }
  addBreadcrumb(breadcrumb) {
    if (!breadcrumb.level) {
      breadcrumb.level = "info";
    }
    this.sentry.addBreadcrumb(breadcrumb);
  }
  captureException(err) {
    if (Math.random() > this.sampleRate) {
      return;
    }
    this.sentry.captureException(err);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(category, message, data) {
    const breadcrumb = {
      level: "info",
      timestamp: Math.floor(Date.now() / 1e3),
      category,
      message
    };
    if (data !== void 0) {
      breadcrumb.data = data;
    }
    this.addBreadcrumb(breadcrumb);
  }
};
var ConsoleLogger = class {
  captureException(err) {
    console.error(err.stack);
  }
  setTag(key, value) {
  }
  setSampleRate(sampleRate) {
  }
  addBreadcrumb(breadcrumb) {
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(category, message, data) {
  }
};
var WshimLogger = class {
  constructor(request, env, sampleRate = 1) {
    this.logs = [];
    this.request = request;
    this.env = env;
    if (typeof sampleRate !== "number" || isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1) {
      throw new Error("Sample rate must be a number between 0 and 1");
    }
    this.serviceToken = env.LOGGING_SHIM_TOKEN;
    this.sampleRate = sampleRate;
    this.fetcher = env.WSHIM_SOCKET?.fetch?.bind(env.WSHIM_SOCKET) ?? fetch;
    this.loggingEndpoint = `${env.WSHIM_ENDPOINT}/log`;
  }
  shouldLog() {
    return Math.random() < this.sampleRate;
  }
  defaultFields() {
    return {
      "environment": this.env.ENVIRONMENT,
      "http.host": this.request.url,
      "http.user_agent": this.request.headers.get("User-Agent"),
      "source_service": this.env.SERVICE
    };
  }
  log(...msg) {
    if (!this.shouldLog()) return;
    const message = msg.map((o) => typeof o === "object" ? JSON.stringify(o) : String(o)).join(" ");
    const logEntry = { message, log_level: "info" };
    this.logs.push(logEntry);
  }
  error(...msg) {
    if (!this.shouldLog()) return;
    let logEntry;
    if (msg.length === 1 && msg[0] instanceof Error) {
      const error = msg[0];
      logEntry = {
        message: error.message,
        log_level: "error",
        error: error.stack
      };
    } else {
      const message = msg.map((o) => typeof o === "object" ? JSON.stringify(o) : String(o)).join(" ");
      logEntry = { message, log_level: "error" };
    }
    this.logs.push(logEntry);
  }
  async flushLogs() {
    if (this.logs.length === 0) return;
    const defaultFields = this.defaultFields();
    const body = JSON.stringify({
      logs: this.logs.map((log) => ({ message: { ...defaultFields, ...log } }))
    });
    try {
      const response = await this.fetcher(this.loggingEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.serviceToken}` },
        body
      });
      if (!response.ok) {
        console.error(`Failed to flush logs: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to flush logs:", error);
    }
    this.logs = [];
  }
};

// src/context/metrics.ts
var import_registry = __toESM(require_registry(), 1);
var KeyError = {
  NOT_FOUND: "not-found",
  INVALID_PRIVATE_KEY: "invalid-private-key",
  MISSING_PRIVATE_KEY: "missing-private-key",
  MISSING_PUBLIC_KEY: "missing-public-key"
};
var HISTOGRAM_MS_BUCKETS = [50, 100, 200, 400, 1e3, 2 * 1e3, 4 * 1e3];
var MetricsRegistry = class {
  constructor(env) {
    this.env = env;
    this.options = {
      bearerToken: env.LOGGING_SHIM_TOKEN,
      endpoint: `${env.WSHIM_ENDPOINT}/prometheus`,
      fetcher: env.WSHIM_SOCKET?.fetch?.bind(env.WSHIM_SOCKET) ?? fetch
    };
    this.registry = new import_registry.Registry();
    this.asyncRetriesTotal = this.create(
      "counter",
      "async_retries_total",
      "Number of async retries performed."
    );
    this.directoryCacheMissTotal = this.create(
      "counter",
      "directory_cache_miss_total",
      "Number of requests for private token issuer directory which are not served by the cache."
    );
    this.erroredRequestsTotal = this.create(
      "counter",
      "errored_requests_total",
      "Errored requests served to eyeball"
    );
    this.issuanceKeyErrorTotal = this.create(
      "counter",
      "issuance_key_error_total",
      "Number of key errors encountered when issuing a private token."
    );
    this.issuanceRequestTotal = this.create(
      "counter",
      "issuance_request_total",
      "Number of requests for private token issuance."
    );
    this.keyRotationTotal = this.create(
      "counter",
      "key_rotation_total",
      "Number of key rotation performed."
    );
    this.keyClearTotal = this.create(
      "counter",
      "key_clear_total",
      "Number of key clear performed."
    );
    this.requestsDurationMs = this.create(
      "histogram",
      "request_duration_ms",
      "Request duration",
      HISTOGRAM_MS_BUCKETS
    );
    this.requestsTotal = this.create("counter", "requests_total", "total requests");
    this.r2RequestsDurationMs = this.create(
      "histogram",
      "r2_requests_duration_ms",
      "R2 requests duration",
      HISTOGRAM_MS_BUCKETS
    );
    this.signedTokenTotal = this.create(
      "counter",
      "signed_token_total",
      "Number of issued signed private tokens."
    );
  }
  defaultLabels() {
    return {
      env: this.env.ENVIRONMENT,
      service: this.env.SERVICE
    };
  }
  createCounter(name, help) {
    const counter = this.registry.create("counter", name, help);
    const defaultLabels = this.defaultLabels();
    return new Proxy(counter, {
      get(target, prop, receiver) {
        if (["collect", "get", "inc", "reset"].includes(prop.toString())) {
          return function(labels) {
            const mergedLabels = { ...defaultLabels, ...labels };
            return Reflect.get(target, prop, receiver)?.call(target, mergedLabels);
          };
        }
        if (["add", "set"].includes(prop.toString())) {
          return function(value, labels) {
            const mergedLabels = { ...defaultLabels, ...labels };
            return Reflect.get(target, prop, receiver)?.call(target, value, mergedLabels);
          };
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
  createHistogram(name, help, histogramBuckets) {
    const histogram = this.registry.create("histogram", name, help, histogramBuckets);
    const defaultLabels = this.defaultLabels();
    return new Proxy(histogram, {
      get(target, prop, receiver) {
        if (["collect", "get", "reset"].includes(prop.toString())) {
          return function(labels) {
            const mergedLabels = { ...defaultLabels, ...labels };
            return Reflect.get(target, prop, receiver)?.call(target, mergedLabels);
          };
        }
        if (["add", "observe", "set"].includes(prop.toString())) {
          return function(value, labels) {
            const mergedLabels = { ...defaultLabels, ...labels };
            return Reflect.get(target, prop, receiver)?.call(target, value, mergedLabels);
          };
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
  create(type, name, help, histogramBuckets) {
    switch (type) {
      case "counter":
        return this.createCounter(name, help);
      case "histogram":
        return this.createHistogram(name, help, histogramBuckets);
      default:
        throw new Error(`Unknown metric type: ${type}`);
    }
  }
  /**
   * Publishes metrics to the workers metrics API
   * This function is a no-op in test and wrangler environements
   */
  async publish() {
    await this.options.fetcher(this.options.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.bearerToken}`
      },
      body: this.registry.metrics()
    });
  }
};

// src/utils/jsonResponse.ts
var JSONResponse = class extends Response {
  constructor(body, init = {}) {
    const headers = new Headers(init.headers);
    headers.append("Content-Type", "application/json;charset=UTF-8");
    init.headers = headers;
    super(JSON.stringify(body), init);
  }
};

// src/errors.ts
function shouldSendToSentry(error) {
  if (error instanceof PageNotFoundError || error instanceof MethodNotAllowedError || error instanceof HeaderNotDefinedError || error instanceof BadTokenKeyRequestedError) {
    return false;
  }
  return true;
}
async function handleError(ctx, error, labels) {
  console.error(error.stack);
  ctx.metrics.erroredRequestsTotal.inc({
    ...labels,
    version: ctx.env.VERSION_METADATA.id ?? "privacy-pass-issuer@v0.1.0.next-dev+8e46885"
  });
  const status = error.status ?? 500;
  const message = error.message || "Server Error";
  ctx.wshimLogger.log(message);
  if (shouldSendToSentry(error)) {
    ctx.logger.captureException(error);
  }
  return new JSONResponse(
    {
      error: { reason: error.name, details: message }
    },
    { status }
  );
}
var HTTPError = class extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "HTTPError";
    this.status = status;
  }
};
var MethodNotAllowedError = class _MethodNotAllowedError extends HTTPError {
  static {
    this.CODE = "ERROR_METHOD_NOT_ALLOWED";
  }
  constructor(message = "Method not allowed") {
    super(message, 405);
    this.name = "MethodNotAllowed";
    this.code = _MethodNotAllowedError.CODE;
  }
};
var PageNotFoundError = class _PageNotFoundError extends HTTPError {
  static {
    this.CODE = "ERROR_PAGE_NOT_FOUND";
  }
  constructor(message = "Page not found") {
    super(message, 404);
    this.name = "PageNotFound";
    this.code = _PageNotFoundError.CODE;
  }
};
var HeaderNotDefinedError = class _HeaderNotDefinedError extends HTTPError {
  static {
    this.CODE = "ERROR_HEADER_NOT_DEFINED";
  }
  constructor(message = "Header not defined") {
    super(message, 406);
    this.name = "HeaderNotDefined";
    this.code = _HeaderNotDefinedError.CODE;
  }
};
var InternalCacheError = class _InternalCacheError extends HTTPError {
  static {
    this.CODE = "ERROR_INTERNAL_CACHE_ERROR";
  }
  constructor(message = "Internal cache error") {
    super(message, 500);
    this.name = "InternalCacheError";
    this.code = _InternalCacheError.CODE;
  }
};
var NotImplementedError = class _NotImplementedError extends HTTPError {
  static {
    this.CODE = "ERROR_NOT_IMPLEMENTED";
  }
  constructor(message = "Not Implemented") {
    super(message, 501);
    this.name = "NotImplemented";
    this.code = _NotImplementedError.CODE;
  }
};
var UnreachableError = class _UnreachableError extends HTTPError {
  static {
    this.CODE = "ERROR_UNREACHABLE";
  }
  constructor(message = "Unreachable") {
    super(message, 500);
    this.name = "Unreachable";
    this.code = _UnreachableError.CODE;
  }
};
var InvalidTokenTypeError = class _InvalidTokenTypeError extends HTTPError {
  static {
    this.CODE = "ERROR_INVALID_TOKEN_TYPE";
  }
  constructor(message = "Invalid token type") {
    super(message, 400);
    this.name = "InvalidTokenTypeError";
    this.code = _InvalidTokenTypeError.CODE;
  }
};
var BadTokenKeyRequestedError = class _BadTokenKeyRequestedError extends HTTPError {
  static {
    this.CODE = "ERROR_BAD_TOKEN_KEY_REQUESTED";
  }
  constructor(message = "Bad token key requested") {
    super(message, 400);
    this.name = "BadTokenKeyRequestedError";
    this.code = _BadTokenKeyRequestedError.CODE;
  }
};

// src/router.ts
var HttpMethod = {
  DELETE: "DELETE",
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT"
};
var Router = class {
  constructor(validPaths) {
    this.handlers = {};
    this.validPaths = validPaths;
  }
  normalisePath(path) {
    const normalised = path.endsWith("/") ? path.slice(0, -1) : path;
    return this.validPaths.has(normalised) ? normalised : "/not-found";
  }
  // Register a handler for a specific path on the router
  registerMethod(method, path, handler2) {
    console.log("registering methods and paths");
    this.handlers[method] ??= {};
    if (path in this.handlers[method]) {
      throw new Error(`path '${path}' already exists`);
    }
    path = this.normalisePath(path);
    this.handlers[method][path] = handler2;
    if (method === HttpMethod.GET) {
      this.handlers[HttpMethod.HEAD] ??= {};
      this.handlers[HttpMethod.HEAD][path] = async (ctx, request) => {
        const response = await handler2(ctx, request);
        if (response.ok) {
          return new Response(null, response);
        }
        return response;
      };
    }
    return this;
  }
  delete(path, handler2) {
    return this.registerMethod(HttpMethod.DELETE, path, handler2);
  }
  get(path, handler2) {
    return this.registerMethod(HttpMethod.GET, path, handler2);
  }
  head(path, handler2) {
    return this.registerMethod(HttpMethod.HEAD, path, handler2);
  }
  post(path, handler2) {
    return this.registerMethod(HttpMethod.POST, path, handler2);
  }
  put(path, handler2) {
    return this.registerMethod(HttpMethod.PUT, path, handler2);
  }
  buildContext(request, env, ectx) {
    const metrics = new MetricsRegistry(env);
    const wshimLogger = new WshimLogger(request, env);
    let logger2;
    if (!env.SENTRY_SAMPLE_RATE || parseFloat(env.SENTRY_SAMPLE_RATE) === 0) {
      logger2 = new ConsoleLogger();
    } else {
      let sentrySampleRate = parseFloat(env.SENTRY_SAMPLE_RATE);
      if (!Number.isFinite(sentrySampleRate)) {
        sentrySampleRate = 1;
      }
      logger2 = new FlexibleLogger(env.ENVIRONMENT, {
        context: ectx,
        request,
        dsn: env.SENTRY_DSN,
        accessClientId: env.SENTRY_ACCESS_CLIENT_ID,
        accessClientSecret: env.SENTRY_ACCESS_CLIENT_SECRET,
        release: "privacy-pass-issuer@v0.1.0.next-dev+8e46885",
        service: env.SERVICE,
        sampleRate: sentrySampleRate,
        coloName: request?.cf?.colo
      });
    }
    return new Context(request, env, ectx.waitUntil.bind(ectx), logger2, metrics, wshimLogger);
  }
  async postProcessing(ctx) {
    await ctx.waitForPromises();
    await ctx.metrics.publish();
    await ctx.wshimLogger.flushLogs();
  }
  // match exact path, and returns a response using the appropriate path handler
  async handle(request, env, ectx) {
    const ctx = this.buildContext(request, env, ectx);
    const rawPath = new URL(request.url).pathname;
    const path = this.normalisePath(rawPath);
    ctx.metrics.requestsTotal.inc({ path });
    let response;
    try {
      const handlers2 = this.handlers[request.method];
      if (!handlers2) {
        throw new MethodNotAllowedError();
      }
      if (!(path in handlers2)) {
        throw new PageNotFoundError();
      }
      const isEmpty = Object.keys(handlers2).every((key) => Object.keys(handlers2[key]).length === 0);
      if (isEmpty) {
        console.log("handlers is fully empty");
      } else {
        console.log("handlers has non-empty items");
      }
      response = await handlers2[path](ctx, request);
      console.log("The type of response is: ", typeof response);
    } catch (e) {
      let status = 500;
      if (e instanceof HTTPError) {
        status = e.status;
      }
      response = await handleError(ctx, e, { path, status });
    }
    ctx.metrics.requestsDurationMs.observe(ctx.performance.now() - ctx.startTime, { path });
    ectx.waitUntil(this.postProcessing(ctx));
    return response;
  }
};

// src/utils/hex.ts
var hexEncode = (u) => Array.from(u).map((b) => b.toString(16).padStart(2, "0")).join("");

// src/utils/keyRotation.ts
var import_cron_parser = __toESM(require_parser(), 1);
function shouldRotateKey(date, env) {
  const utcDate = new Date(date.toISOString());
  return env.ROTATION_CRON_STRING ? matchCronTime(env.ROTATION_CRON_STRING, utcDate).match : false;
}
function shouldClearKey(keyNotBefore, lifespanInMs) {
  const keyExpirationTime = keyNotBefore.getTime() + lifespanInMs;
  return Date.now() > keyExpirationTime;
}
function matchCronTime(cronString, date) {
  date.setUTCSeconds(0, 0);
  const options = {
    currentDate: date.toISOString(),
    tz: "UTC"
  };
  let interval;
  try {
    interval = import_cron_parser.default.parseExpression(cronString, options);
  } catch (error) {
    console.error("Error parsing cron string", error);
    return { match: false };
  }
  const prevDate = interval.prev().toDate();
  const nextDate = interval.next().toDate();
  const result = date.getTime() === prevDate.getTime() || date.getTime() === nextDate.getTime();
  return {
    prevTime: prevDate.getTime(),
    nextTime: nextDate.getTime(),
    match: result
  };
}

// src/index.ts
import { WorkerEntrypoint } from "cloudflare:workers";
var { BlindRSAMode: BlindRSAMode2, Issuer: Issuer2, TokenRequest: TokenRequest2 } = pub_verif_token_exports;
var keyToTokenKeyID = async (key) => {
  const hash = await crypto.subtle.digest("SHA-256", key);
  const u8 = new Uint8Array(hash);
  return u8[u8.length - 1];
};
var SumService = class extends WorkerEntrypoint {
  async fetch(request) {
    console.log("inside fetch of the SumService");
    const router = new Router(VALID_PATHS);
    const issuer = new IssuerHandler(this.ctx, this.env);
    router.get(PRIVATE_TOKEN_ISSUER_DIRECTORY, issuer.handleTokenDirectory).post("/token-request", issuer.handleTokenRequest).post("/admin/rotate", issuer.handleRotateKey).post("/admin/clear", issuer.handleClearKey);
    return router.handle(
      request,
      this.env,
      this.ctx
    );
  }
  async add(a, b) {
    return a + b;
  }
};
var IssuerHandler = class extends WorkerEntrypoint {
  constructor() {
    super(...arguments);
    this.handleTokenRequest = async (ctx, request) => {
      ctx.metrics.issuanceRequestTotal.inc({ version: ctx.env.VERSION_METADATA.id ?? "privacy-pass-issuer@v0.1.0.next-dev+8e46885" });
      const contentType = request.headers.get("content-type");
      if (!contentType || contentType !== MediaType.PRIVATE_TOKEN_REQUEST) {
        throw new HeaderNotDefinedError(`"Content-Type" must be "${MediaType.PRIVATE_TOKEN_REQUEST}"`);
      }
      const buffer = await request.arrayBuffer();
      const tokenRequest = TokenRequest2.deserialize(new Uint8Array(buffer));
      if (tokenRequest.tokenType !== TOKEN_TYPES.BLIND_RSA.value) {
        throw new InvalidTokenTypeError();
      }
      const keyID = tokenRequest.truncatedTokenKeyId.toString();
      const key = await ctx.bucket.ISSUANCE_KEYS.get(keyID);
      if (key === null) {
        ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID, type: KeyError.NOT_FOUND });
        throw new BadTokenKeyRequestedError("No key found for the requested key id");
      }
      const CRYPTO_KEY_EXPIRATION_IN_MS = 3e5;
      const cryptoKeyCache = new InMemoryCryptoKeyCache(ctx);
      const sk = await cryptoKeyCache.read(`sk-${keyID}`, async (keyID2) => {
        const privateKey = key.data;
        if (privateKey === void 0) {
          ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID2, type: KeyError.MISSING_PRIVATE_KEY });
          throw new Error("No private key found for the requested key id");
        }
        let sk2;
        try {
          sk2 = await crypto.subtle.importKey(
            "pkcs8",
            privateKey,
            {
              name: ctx.isTest() ? "RSA-PSS" : "RSA-RAW",
              hash: "SHA-384",
              length: 2048
            },
            true,
            ["sign"]
          );
        } catch (e) {
          ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID2, type: KeyError.INVALID_PRIVATE_KEY });
          throw e;
        }
        return {
          value: sk2,
          expiration: new Date(Date.now() + CRYPTO_KEY_EXPIRATION_IN_MS)
        };
      });
      const pk = await cryptoKeyCache.read(`pk-${keyID}`, async (keyID2) => {
        const pkEnc = key?.customMetadata?.publicKey;
        if (!pkEnc) {
          ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID2, type: KeyError.MISSING_PUBLIC_KEY });
          throw new Error("No public key found for the requested key id");
        }
        const pk2 = await crypto.subtle.importKey(
          "spki",
          util.convertRSASSAPSSToEnc(b64Tou8(b64URLtoB64(pkEnc))),
          { name: "RSA-PSS", hash: "SHA-384" },
          true,
          ["verify"]
        );
        return {
          value: pk2,
          expiration: new Date(Date.now() + CRYPTO_KEY_EXPIRATION_IN_MS)
        };
      });
      const domain = new URL(request.url).host;
      const issuer = new Issuer2(BlindRSAMode2.PSS, domain, sk, pk, { supportsRSARAW: true });
      const signedToken = await issuer.issue(tokenRequest);
      ctx.metrics.signedTokenTotal.inc({ key_id: keyID });
      return new Response(signedToken.serialize(), {
        headers: { "content-type": MediaType.PRIVATE_TOKEN_RESPONSE }
      });
    };
    this.handleHeadTokenDirectory = async (ctx, request) => {
      const getResponse = await this.handleTokenDirectory(ctx, request);
      return new Response(void 0, {
        status: getResponse.status,
        headers: getResponse.headers
      });
    };
    // need to have the isRCP in case the handler is called via RCP, this flag is set to false when the method is registered in the router
    // could this be a problem later as the flag is set to false in the path as well in the proxy code? 
    this.handleTokenDirectory = async (ctx, request, isRCP) => {
      const cache = await getDirectoryCache();
      let cachedResponse;
      try {
        cachedResponse = await cache.match(DIRECTORY_CACHE_REQUEST(ctx.hostname));
      } catch (e) {
        const err = e;
        throw new InternalCacheError(err.message);
      }
      if (cachedResponse) {
        if (request.headers.get("if-none-match") === cachedResponse.headers.get("etag")) {
          return new Response(void 0, {
            status: 304,
            headers: cachedResponse.headers
          });
        }
        return cachedResponse;
      }
      ctx.metrics.directoryCacheMissTotal.inc();
      const keyList = await ctx.bucket.ISSUANCE_KEYS.list({ include: ["customMetadata"] });
      if (keyList.objects.length === 0) {
        throw new Error("Issuer not initialised");
      }
      const freshestKeyCount = Number.parseInt(ctx.env.MINIMUM_FRESHEST_KEYS);
      const keys = keyList.objects.sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime()).slice(0, freshestKeyCount);
      const directory = {
        "issuer-request-uri": "/token-request",
        "token-keys": keys.map((key) => ({
          "token-type": 2 /* BlindRSA */,
          "token-key": key.customMetadata.publicKey,
          // this is how to extract the custom metadata
          "not-before": Number.parseInt(
            key.customMetadata.notBefore ?? (new Date(key.uploaded).getTime() / 1e3).toFixed(0)
          )
        }))
      };
      const body = JSON.stringify(directory);
      const digest = new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body))
      );
      const etag = `"${hexEncode(digest)}"`;
      const headers = {
        "content-type": MediaType.PRIVATE_TOKEN_ISSUER_DIRECTORY,
        "cache-control": `public, max-age=${ctx.env.DIRECTORY_CACHE_MAX_AGE_SECONDS}`,
        "content-length": body.length.toString(),
        "date": (/* @__PURE__ */ new Date()).toUTCString(),
        etag
      };
      const response = new Response(body, {
        headers: {
          "content-type": MediaType.PRIVATE_TOKEN_ISSUER_DIRECTORY,
          "cache-control": `public, max-age=${ctx.env.DIRECTORY_CACHE_MAX_AGE_SECONDS}`,
          "content-length": body.length.toString(),
          "date": (/* @__PURE__ */ new Date()).toUTCString(),
          etag
        }
      });
      const toCacheResponse = response.clone();
      const cacheTime = Math.floor(
        Number.parseInt(ctx.env.DIRECTORY_CACHE_MAX_AGE_SECONDS) * (0.7 + 0.3 * Math.random())
      ).toFixed(0);
      toCacheResponse.headers.set("cache-control", `public, max-age=${cacheTime}`);
      ctx.waitUntil(cache.put(DIRECTORY_CACHE_REQUEST(ctx.hostname), toCacheResponse));
      return response;
    };
    this.handleRotateKey = async (ctx, _request) => {
      ctx.metrics.keyRotationTotal.inc();
      let publicKeyEnc;
      let tokenKeyID;
      let privateKey;
      do {
        const keypair = await crypto.subtle.generateKey(
          {
            name: "RSA-PSS",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: { name: "SHA-384" }
          },
          true,
          ["sign", "verify"]
        );
        const publicKey = new Uint8Array(
          await crypto.subtle.exportKey("spki", keypair.publicKey)
        );
        const rsaSsaPssPublicKey = util.convertEncToRSASSAPSS(publicKey);
        publicKeyEnc = b64ToB64URL(u8ToB64(rsaSsaPssPublicKey));
        tokenKeyID = await keyToTokenKeyID(rsaSsaPssPublicKey);
        privateKey = await crypto.subtle.exportKey("pkcs8", keypair.privateKey);
      } while (await ctx.bucket.ISSUANCE_KEYS.head(tokenKeyID.toString()) !== null);
      const metadata = {
        notBefore: ((Date.now() + Number.parseInt(ctx.env.KEY_NOT_BEFORE_DELAY_IN_MS)) / 1e3).toFixed(
          0
        ),
        // the spec mandates to use seconds
        publicKey: publicKeyEnc,
        tokenKeyID: tokenKeyID.toString()
      };
      await ctx.bucket.ISSUANCE_KEYS.put(tokenKeyID.toString(), privateKey, {
        customMetadata: metadata
      });
      ctx.waitUntil(clearDirectoryCache(ctx));
      ctx.wshimLogger.log(`Key rotated successfully, new key ${tokenKeyID}`);
      return new Response(`New key ${publicKeyEnc}`, { status: 201 });
    };
    this.handleClearKey = async (ctx, _request) => {
      ctx.metrics.keyClearTotal.inc();
      const keys = await ctx.bucket.ISSUANCE_KEYS.list({ shouldUseCache: false });
      if (keys.objects.length === 0) {
        return new Response("No keys to clear", { status: 201 });
      }
      const lifespanInMs = Number.parseInt(ctx.env.KEY_LIFESPAN_IN_MS);
      const freshestKeyCount = Number.parseInt(ctx.env.MINIMUM_FRESHEST_KEYS);
      keys.objects.sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime());
      const toDelete = /* @__PURE__ */ new Set();
      for (let i = 0; i < keys.objects.length; i++) {
        const key = keys.objects[i];
        const notBefore = key.customMetadata?.notBefore;
        let keyNotBefore;
        if (notBefore) {
          keyNotBefore = new Date(Number.parseInt(notBefore) * 1e3);
        } else {
          keyNotBefore = new Date(key.uploaded);
        }
        const isFreshest = i < freshestKeyCount;
        if (isFreshest) {
          continue;
        }
        const shouldDelete = shouldClearKey(keyNotBefore, lifespanInMs);
        if (shouldDelete) {
          toDelete.add(key.key);
        }
      }
      const toDeleteArray = [...toDelete];
      if (toDeleteArray.length > 0) {
        ctx.wshimLogger.log(`
Keys cleared: ${toDeleteArray.join("\n")}`);
      } else {
        ctx.wshimLogger.log("\nNo keys were cleared.");
      }
      await ctx.bucket.ISSUANCE_KEYS.delete(toDeleteArray);
      ctx.waitUntil(clearDirectoryCache(ctx));
      return new Response(`Keys cleared: ${toDeleteArray.join("\n")}`, { status: 201 });
    };
  }
};
var VALID_PATHS = /* @__PURE__ */ new Set([
  "/.well-known/token-issuer-directory",
  "/token-request",
  "/admin/rotate",
  "/admin/clear",
  "/",
  PRIVATE_TOKEN_ISSUER_DIRECTORY
]);
var src_default = {
  async fetch(request, env, ctx) {
    const router = new Router(VALID_PATHS);
    const issuer = new IssuerHandler(ctx, env);
    router.get(PRIVATE_TOKEN_ISSUER_DIRECTORY, issuer.handleTokenDirectory).post("/token-request", issuer.handleTokenRequest).post("/admin/rotate", issuer.handleRotateKey).post("/admin/clear", issuer.handleClearKey);
    return router.handle(
      request,
      env,
      ctx
    );
  },
  async scheduled(event, env, ectx) {
    const sampleRequest = new Request(`https://schedule.example.com`);
    const ctx = new Context(
      sampleRequest,
      env,
      ectx.waitUntil.bind(ectx),
      new ConsoleLogger(),
      new MetricsRegistry(env),
      new WshimLogger(sampleRequest, env)
    );
    const date = new Date(event.scheduledTime);
    const issuer = new IssuerHandler(ectx, env);
    if (shouldRotateKey(date, env)) {
      await issuer.handleRotateKey(ctx);
    } else {
      await issuer.handleClearKey(ctx);
    }
  }
};
export {
  Context,
  IssuerHandler,
  Router,
  SumService,
  src_default as default
};
