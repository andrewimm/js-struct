'use strict';

const expect = require('chai').expect;
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

suite('Type', () => {
  test('uint8', () => {
    let t = Type.uint8('age');
    expect(t.field).to.equal('age');
    expect(t.size).to.equal(1);
    expect(t.read(arr, 0)).to.equal(3);
    expect(t.read(arr, 1)).to.equal(255);
    expect(t.read(arr, 2)).to.equal(128);
    expect(t.read(arr, 3)).to.equal(0);
  });

  test('int8', () => {
    let t = Type.int8('offset');
    expect(t.field).to.equal('offset');
    expect(t.size).to.equal(1);
    expect(t.read(arr, 0)).to.equal(3);
    expect(t.read(arr, 1)).to.equal(-1);
    expect(t.read(arr, 2)).to.equal(-128);
    expect(t.read(arr, 3)).to.equal(0);
  });

  test('uint16', () => {
    let t = Type.uint16('score');
    expect(t.field).to.equal('score');
    expect(t.size).to.equal(2);
    expect(t.read(arr, 0)).to.equal(1023);
    expect(t.read(arr, 1)).to.equal(65408);
    expect(t.read(arr, 2)).to.equal(32768);
  });

  test('int16', () => {
    let t = Type.int16('score');
    expect(t.field).to.equal('score');
    expect(t.size).to.equal(2);
    expect(t.read(arr, 0)).to.equal(1023);
    expect(t.read(arr, 1)).to.equal(-128);
    expect(t.read(arr, 2)).to.equal(-32768);
  });

  test('uint32', () => {
    let t = Type.uint32('time');
    expect(t.field).to.equal('time');
    expect(t.size).to.equal(4);
    expect(t.read(arr, 0)).to.equal(67076096);
    expect(t.read(arr, 1)).to.equal(4286578689);
  });

  test('int32', () => {
    let t = Type.int32('delta');
    expect(t.field).to.equal('delta');
    expect(t.size).to.equal(4);
    expect(t.read(arr, 0)).to.equal(67076096);
    expect(t.read(arr, 1)).to.equal(-8388607);
  });

  test('char', () => {
    let t = Type.char('ch');
    expect(t.field).to.equal('ch');
    expect(t.size).to.equal(4);
    expect(t.read(arr, 5)).to.equal('N');
    expect(t.read(arr, 6)).to.equal('0');
  });

  test('arrays', () => {
    let t = Type.array(Type.uint8, 4)('bytes');
    expect(t.size).to.equal(4);
    expect(t.field).to.equal('bytes');
    expect(t.read(arr, 0)).to.deep.equal(
      [0x03, 0xff, 0x80, 0x00]
    );
    expect(t.read(arr, 0, 2)).to.deep.equal(
      [0x03, 0xff]
    );
    expect(t.read(arr, 1)).to.deep.equal(
      [0xff, 0x80, 0x00, 0x01]
    );
    expect(t.read(arr, 2)).to.deep.equal(
      [0x80, 0x00, 0x01, 0x4e]
    );

    t = Type.array(Type.int8, 4)('offsets');
    expect(t.size).to.equal(4);
    expect(t.field).to.equal('offsets');
    expect(t.read(arr, 0)).to.deep.equal(
      [3, -1, -128, 0]
    );

    t = Type.array(Type.uint16, 3)('ushorts');
    expect(t.size).to.equal(6);
    expect(t.field).to.equal('ushorts');
    expect(t.read(arr, 0)).to.deep.equal(
      [0x03ff, 0x8000, 0x014e]
    );

    t = Type.array(Type.int16, 3)('shorts');
    expect(t.size).to.equal(6);
    expect(t.field).to.equal('shorts');
    expect(t.read(arr, 0)).to.deep.equal(
      [1023, -32768, 334]
    );

    t = Type.array(Type.uint32, 2)('uints');
    expect(t.size).to.equal(8);
    expect(t.field).to.equal('uints');
    expect(t.read(arr, 0)).to.deep.equal(
      [67076096, 21901326]
    );

    t = Type.array(Type.int32, 2)('ints');
    expect(t.size).to.equal(8);
    expect(t.field).to.equal('ints');
    expect(t.read(arr, 0)).to.deep.equal(
      [67076096, 21901326]
    );
  });
});
