'use strict';

const expect = require('chai').expect;
const sign = require('../lib/sign');

suite('sign', () => {
  test('negates numbers with the msb set', () => {
    expect(sign(parseInt('10000000', 2), 7)).to.equal(-128);
    expect(sign(parseInt('10000001', 2), 7)).to.equal(-127);
    expect(sign(parseInt('11111100', 2), 7)).to.equal(-4);
    expect(sign(parseInt('11111111', 2), 7)).to.equal(-1);
    expect(sign(parseInt('1000', 2), 3)).to.equal(-8);
    expect(sign(parseInt('1001', 2), 3)).to.equal(-7);
    expect(sign(parseInt('1100', 2), 3)).to.equal(-4);
    expect(sign(parseInt('1111', 2), 3)).to.equal(-1);
    expect(sign(parseInt('10', 2), 1)).to.equal(-2);
    expect(sign(parseInt('11', 2), 1)).to.equal(-1);
  });

  test('does not negate numbers with the msb unset', () => {
    expect(sign(parseInt('00000000', 2), 7)).to.equal(0);
    expect(sign(parseInt('00000001', 2), 7)).to.equal(1);
    expect(sign(parseInt('00000100', 2), 7)).to.equal(4);
    expect(sign(parseInt('01111111', 2), 7)).to.equal(127);
    expect(sign(parseInt('0000', 2), 3)).to.equal(0);
    expect(sign(parseInt('0001', 2), 3)).to.equal(1);
    expect(sign(parseInt('0100', 2), 3)).to.equal(4);
    expect(sign(parseInt('0111', 2), 3)).to.equal(7);
    expect(sign(parseInt('00', 2), 1)).to.equal(0);
    expect(sign(parseInt('01', 2), 1)).to.equal(1);
  });
});