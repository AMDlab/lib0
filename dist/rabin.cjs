'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var encoding = require('./buffer-bc255c75.cjs');
var map = require('./map-9a5915e4.cjs');
require('./string-6d104757.cjs');
require('./array-704ca50e.cjs');
require('./set-0f209abb.cjs');
require('./environment-ad129e4d.cjs');
require('./conditions-f5c0c102.cjs');
require('./storage.cjs');
require('./function-314fdc56.cjs');
require('./object-fecf6a7b.cjs');
require('./math-08e068f9.cjs');
require('./binary-ac8e39e2.cjs');
require('./number-466d8922.cjs');
require('./error-8582d695.cjs');

/**
 * @module rabin
 *
 * Very efficient & versatile fingerprint/hashing algorithm. However, it is not cryptographically
 * secure. Well suited for fingerprinting.
 */

const StandardIrreducible8 = new Uint8Array([1, 221]);
const StandardIrreducible16 = new Uint8Array([1, 244, 157]);
const StandardIrreducible32 = new Uint8Array([1, 149, 183, 205, 191]);
const StandardIrreducible64 = new Uint8Array([1, 133, 250, 114, 193, 250, 28, 193, 231]);
const StandardIrreducible128 = new Uint8Array([1, 94, 109, 166, 228, 6, 222, 102, 239, 27, 128, 184, 13, 50, 112, 169, 199]);

/**
 * Maps from a modulo to the precomputed values.
 *
 * @type {Map<string,Uint8Array>}
 */
const _precomputedFingerprintCache = new Map();

/**
 * @param {Uint8Array} m
 */
const ensureCache = m => map.setIfUndefined(_precomputedFingerprintCache, encoding.toBase64(m), () => {
  const byteLen = m.byteLength;
  const cache = new Uint8Array(256 * byteLen);
  // Use dynamic computing to compute the cached results.
  // Starting values: cache(0) = 0; cache(1) = m
  cache.set(m, byteLen);
  for (let bit = 1; bit < 8; bit++) {
    const mBitShifted = encoding.shiftNBitsLeft(m, bit);
    const bitShifted = 1 << bit;
    for (let j = 0; j < bitShifted; j++) {
      // apply the shifted result (reducing the degree of the polynomial)
      const msb = bitShifted | j;
      const rest = msb ^ mBitShifted[0];
      for (let i = 0; i < byteLen; i++) {
        // rest is already precomputed in the cache
        cache[msb * byteLen + i] = cache[rest * byteLen + i] ^ mBitShifted[i];
      }
      // if (cache[(bitShifted | j) * byteLen] !== (bitShifted | j)) { error.unexpectedCase() }
    }
  }
  return cache
});

class RabinEncoder {
  /**
   * @param {Uint8Array} m assert(m[0] === 1)
   */
  constructor (m) {
    this.m = m;
    this.blen = m.byteLength;
    this.bs = new Uint8Array(this.blen);
    this.cache = ensureCache(m);
    /**
     * This describes the position of the most significant byte (starts with 0 and increases with
     * shift)
     */
    this.bpos = 0;
  }

  /**
   * @param {number} byte
   */
  write (byte) {
    // assert(this.bs[0] === 0)
    // Shift one byte to the left, add b
    this.bs[this.bpos] = byte;
    this.bpos = (this.bpos + 1) % this.blen;
    const msb = this.bs[this.bpos];
    for (let i = 0; i < this.blen; i++) {
      this.bs[(this.bpos + i) % this.blen] ^= this.cache[msb * this.blen + i];
    }
    // assert(this.bs[this.bpos] === 0)
  }

  getFingerprint () {
    const result = new Uint8Array(this.blen - 1);
    for (let i = 0; i < result.byteLength; i++) {
      result[i] = this.bs[(this.bpos + i + 1) % this.blen];
    }
    return result
  }
}

/**
 * @param {Uint8Array} irreducible
 * @param {Uint8Array} data
 */
const fingerprint = (irreducible, data) => {
  const encoder = new RabinEncoder(irreducible);
  for (let i = 0; i < data.length; i++) {
    encoder.write(data[i]);
  }
  return encoder.getFingerprint()
};

exports.RabinEncoder = RabinEncoder;
exports.StandardIrreducible128 = StandardIrreducible128;
exports.StandardIrreducible16 = StandardIrreducible16;
exports.StandardIrreducible32 = StandardIrreducible32;
exports.StandardIrreducible64 = StandardIrreducible64;
exports.StandardIrreducible8 = StandardIrreducible8;
exports.fingerprint = fingerprint;
//# sourceMappingURL=rabin.cjs.map
