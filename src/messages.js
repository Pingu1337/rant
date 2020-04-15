// This file is auto generated by the protocol-buffers compiler

/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-redeclare */
/* eslint-disable camelcase */

// Remember to `npm install --save protocol-buffers-encodings`
var encodings = require('protocol-buffers-encodings')
var varint = encodings.varint
var skip = encodings.skip

var Postcard = exports.Postcard = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var RantMessage = exports.RantMessage = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

definePostcard()
defineRantMessage()

function definePostcard () {
  Postcard.encodingLength = encodingLength
  Postcard.encode = encode
  Postcard.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (defined(obj.date)) {
      var len = encodings.varint.encodingLength(obj.date)
      length += 1 + len
    }
    if (defined(obj.theme)) {
      var len = encodings.int32.encodingLength(obj.theme)
      length += 1 + len
    }
    if (defined(obj.text)) {
      var len = encodings.bytes.encodingLength(obj.text)
      length += 1 + len
    }
    if (defined(obj.compression)) {
      var len = encodings.varint.encodingLength(obj.compression)
      length += 1 + len
    }
    if (defined(obj.encryption)) {
      var len = encodings.varint.encodingLength(obj.encryption)
      length += 1 + len
    }
    if (defined(obj.nonce)) {
      var len = encodings.bytes.encodingLength(obj.nonce)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (defined(obj.date)) {
      buf[offset++] = 8
      encodings.varint.encode(obj.date, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.theme)) {
      buf[offset++] = 16
      encodings.int32.encode(obj.theme, buf, offset)
      offset += encodings.int32.encode.bytes
    }
    if (defined(obj.text)) {
      buf[offset++] = 26
      encodings.bytes.encode(obj.text, buf, offset)
      offset += encodings.bytes.encode.bytes
    }
    if (defined(obj.compression)) {
      buf[offset++] = 32
      encodings.varint.encode(obj.compression, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.encryption)) {
      buf[offset++] = 40
      encodings.varint.encode(obj.encryption, buf, offset)
      offset += encodings.varint.encode.bytes
    }
    if (defined(obj.nonce)) {
      buf[offset++] = 50
      encodings.bytes.encode(obj.nonce, buf, offset)
      offset += encodings.bytes.encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      date: 0,
      theme: 0,
      text: null,
      compression: 0,
      encryption: 0,
      nonce: null
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.date = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 2:
        obj.theme = encodings.int32.decode(buf, offset)
        offset += encodings.int32.decode.bytes
        break
        case 3:
        obj.text = encodings.bytes.decode(buf, offset)
        offset += encodings.bytes.decode.bytes
        break
        case 4:
        obj.compression = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 5:
        obj.encryption = encodings.varint.decode(buf, offset)
        offset += encodings.varint.decode.bytes
        break
        case 6:
        obj.nonce = encodings.bytes.decode(buf, offset)
        offset += encodings.bytes.decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineRantMessage () {
  RantMessage.encodingLength = encodingLength
  RantMessage.encode = encode
  RantMessage.decode = decode

  function encodingLength (obj) {
    var length = 0
    if ((+defined(obj.card)) > 1) throw new Error("only one of the properties defined in oneof msg can be set")
    if (defined(obj.card)) {
      var len = Postcard.encodingLength(obj.card)
      length += varint.encodingLength(len)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if ((+defined(obj.card)) > 1) throw new Error("only one of the properties defined in oneof msg can be set")
    if (defined(obj.card)) {
      buf[offset++] = 10
      varint.encode(Postcard.encodingLength(obj.card), buf, offset)
      offset += varint.encode.bytes
      Postcard.encode(obj.card, buf, offset)
      offset += Postcard.encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      card: null
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.card = Postcard.decode(buf, offset, offset + len)
        offset += Postcard.decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defined (val) {
  return val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val))
}
