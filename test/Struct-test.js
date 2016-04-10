'use strict';

const expect = require('chai').expect;
const Struct = require('../lib/Struct');
const Type = require('../lib/Type');

const buf = new Buffer(8);
const arr = new Uint8Array(buf);
arr[0] = 0x03;
arr[1] = 0xff;
arr[2] = 0x80;
arr[3] = 0x00;
arr[4] = 0x01;
arr[5] = 0x4e;
arr[6] = 0x30;
arr[7] = 0x0e;

suite('Struct', () => {
  test('Basic struct', () => {
    let s = Struct([
      Type.uint8('first'),
      Type.uint16('second'),
      Type.uint8('third'),
    ]);
    expect(s.size).to.equal(4);
    expect(s.read(arr, 0)).to.deep.equal({
      first: 3,
      second: 65408,
      third: 0,
    });
    expect(s.read(arr, 4)).to.deep.equal({
      first: 1,
      second: 20016,
      third: 14,
    });
  });

  test('Struct with array', () => {
    let s = Struct([
      Type.uint8('first'),
      Type.array(Type.uint16, 3)('second'),
      Type.uint8('third'),
    ]);
    expect(s.size).to.equal(8);
    expect(s.read(arr, 0)).to.deep.equal({
      first: 3,
      second: [65408, 1, 20016],
      third: 14,
    });
  });

  test('Struct within struct', () => {
    let S = Struct([
      Type.uint8('a'),
      Type.uint8('b'),
    ]);
    let outer = Struct([
      S('inner'),
      Type.uint8('c'),
    ]);
    expect(S.size).to.equal(2);
    expect(outer.size).to.equal(3);
    expect(outer.read(arr, 0)).to.deep.equal({
      inner: {
        a: 3,
        b: 255,
      },
      c: 128
    });
  });
});
