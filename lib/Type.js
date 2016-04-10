'use strict';

const sign = require('./sign');

const Type = {};

const readUint8 = function(bytes, index) {
  return bytes[index];
};
Type.uint8 = function(field) {
  return {
    size: 1,
    field: field,
    read: readUint8,
  };
};
Type.uint8.size = 1;
Type.uint8.read = readUint8;
Type.byte = Type.uint8;

const readInt8 = function(bytes, index) {
  return sign(bytes[index], 7);
};
Type.int8 = function(field) {
  return {
    size: 1,
    field: field,
    read: readInt8,
  };
};
Type.int8.size = 1;
Type.int8.read = readInt8;

const readUint16 = function(bytes, index) {
  return (bytes[index] << 8) + bytes[index + 1];
};
Type.uint16 = function(field) {
  return {
    size: 2,
    field: field,
    read: readUint16,
  };
};
Type.uint16.size = 2;
Type.uint16.read = readUint16;
Type.ushort = Type.uint16;

const readInt16 = function(bytes, index) {
  return sign((bytes[index] << 8) + bytes[index + 1], 15);
};
Type.int16 = function(field) {
  return {
    size: 2,
    field: field,
    read: readInt16,
  };
};
Type.int16.size = 2;
Type.int16.read = readInt16;
Type.short = Type.int16;

const readUint32 = function(bytes, index) {
  let total = (bytes[index] & 0x80) ?
    Math.pow(2, 31) + ((bytes[index] & 0x7f) << 24) :
    (bytes[index] << 24);
  return (
    total +
    (bytes[index + 1] << 16) +
    (bytes[index + 2] << 8) +
    (bytes[index + 3])
  );
};
Type.uint32 = function(field) {
  return {
    size: 4,
    field: field,
    read: readUint32,
  };
};
Type.uint32.size = 4;
Type.uint32.read = readUint32;
Type.ulong = Type.uint32;

const readInt32 = function(bytes, index) {
  return (
    (bytes[index] << 24) +
    (bytes[index + 1] << 16) +
    (bytes[index + 2] << 8) +
    (bytes[index + 3])
  );
};
Type.int32 = function(field) {
  return {
    size: 4,
    field: field,
    read: readInt32,
  };
};
Type.int32.size = 4;
Type.int32.read = readInt32;
Type.long = Type.int32;

const readChar = function(bytes, index) {
  return String.fromCharCode(bytes[index]);
};
Type.char = function(field) {
  return {
    size: 1,
    field: field,
    read: readChar,
  };
};

Type.array = function(type, size) {
  if (typeof size !== 'number' || size <= 0) {
    throw new Error('Second argument of array() must be a positive integer');
  }
  const readArray = function(bytes, index, length) {
    let max = (length === undefined) ? size : length;
    let arr = new Array(max);
    for (let i = 0; i < max; i++) {
      arr[i] = type.read(bytes, index + i * type.size);
    }
    return arr;
  };
  let t = function(field) {
    return {
      size: type.size * size,
      field: field,
      elementType: type,
      elementCount: size,
      read: readArray,
    };
  };
  t.size = type.size * size;
  t.elementType = type;
  t.elementCount = size;
  t.read = readArray;
  return t;
};

module.exports = Type;
