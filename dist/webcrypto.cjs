'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var crypto = require('./crypto.cjs');
require('@peculiar/webcrypto');

const subtle = crypto.subtle;
const getRandomValues = crypto.getRandomValues.bind(crypto);

exports.getRandomValues = getRandomValues;
exports.subtle = subtle;
//# sourceMappingURL=webcrypto.cjs.map
