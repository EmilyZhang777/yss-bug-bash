// Copyright 2012 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Plural rules.
 *
 *
 * File generated from CLDR ver. 34
 *
 * Before check in, this file could have been manually edited. This is to
 * incorporate changes before we could fix CLDR. All manual modification must be
 * documented in this section, and should be removed after those changes land to
 * CLDR.
 */

// clang-format off

// COPIED FROM https://github.com/google/closure-library/blob/master/closure/goog/i18n/pluralrules.js

// Create closure namespaces.
var goog = goog || {};
goog.i18n = goog.i18n || {};
goog.i18n.pluralRules = goog.i18n.pluralRules || {};
/**
 * Plural pattern keyword
 * @enum {string}
 */
goog.i18n.pluralRules.Keyword = {
  ZERO: 'zero',
  ONE: 'one',
  TWO: 'two',
  FEW: 'few',
  MANY: 'many',
  OTHER: 'other'
};

/**
 * Plural selection function.
 *
 * The actual implementation is locale-dependent.
 *
 * @param {string} locale The locale to select for.
 * @param {number} n The count of items.
 * @param {number=} opt_precision optional, precision.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}}
 */
goog.i18n.pluralRules.select;

/**
 * Default Plural select rule.
 * @param {number} n The count of items.
 * @param {number=} opt_precision optional, precision.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Default value.
 * @private
 */
goog.i18n.pluralRules.defaultSelect_ = function (n, opt_precision) {
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 0 };
};

/**
 * Returns the fractional part of a number (3.1416 => 1416)
 * @param {number} n The count of items.
 * @return {number} The fractional part.
 * @private
 */
goog.i18n.pluralRules.decimals_ = function (n) {
  var str = n + '';
  var result = str.indexOf('.');
  return result == -1 ? 0 : str.length - result - 1;
};

/**
 * Calculates v and f as per CLDR plural rules.
 * The short names for parameters / return match the CLDR syntax and UTS #35
 *     (https://unicode.org/reports/tr35/tr35-numbers.html#Plural_rules_syntax)
 * @param {number} n The count of items.
 * @param {number=} opt_precision optional, precision.
 * @return {{v:number, f:number}} The v and f.
 * @private
 */
goog.i18n.pluralRules.get_vf_ = function (n, opt_precision) {
  var DEFAULT_DIGITS = 3;

  if (undefined === opt_precision) {
    var v = Math.min(goog.i18n.pluralRules.decimals_(n), DEFAULT_DIGITS);
  } else {
    var v = opt_precision;
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;

  return { v: v, f: f };
};

/**
 * Calculates w and t as per CLDR plural rules.
 * The short names for parameters / return match the CLDR syntax and UTS #35
 *     (https://unicode.org/reports/tr35/tr35-numbers.html#Plural_rules_syntax)
 * @param {number} v Calculated previously.
 * @param {number} f Calculated previously.
 * @return {{w:number, t:number}} The w and t.
 * @private
 */
goog.i18n.pluralRules.get_wt_ = function (v, f) {
  if (f === 0) {
    return { w: 0, t: 0 };
  }

  while (f % 10 === 0) {
    f /= 10;
    v--;
  }

  return { w: v, t: f };
};

/**
 * Plural select rules for fil locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.filSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (
    (vf.v == 0 && (i == 1 || i == 2 || i == 3)) ||
    (vf.v == 0 && i % 10 != 4 && i % 10 != 6 && i % 10 != 9) ||
    (vf.v != 0 && vf.f % 10 != 4 && vf.f % 10 != 6 && vf.f % 10 != 9)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for br locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.brSelect_ = function (n, opt_precision) {
  if (n % 10 == 1 && n % 100 != 11 && n % 100 != 71 && n % 100 != 91) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n % 10 == 2 && n % 100 != 12 && n % 100 != 72 && n % 100 != 92) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  if (
    ((n % 10 >= 3 && n % 10 <= 4) || n % 10 == 9) &&
    (n % 100 < 10 || n % 100 > 19) &&
    (n % 100 < 70 || n % 100 > 79) &&
    (n % 100 < 90 || n % 100 > 99)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 2 };
  }
  if (n != 0 && n % 1000000 == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 3 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 4 };
};

/**
 * Plural select rules for sr locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.srSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (
    (vf.v == 0 && i % 10 == 1 && i % 100 != 11) ||
    (vf.f % 10 == 1 && vf.f % 100 != 11)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (
    (vf.v == 0 &&
      i % 10 >= 2 &&
      i % 10 <= 4 &&
      (i % 100 < 12 || i % 100 > 14)) ||
    (vf.f % 10 >= 2 && vf.f % 10 <= 4 && (vf.f % 100 < 12 || vf.f % 100 > 14))
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 2 };
};

/**
 * Plural select rules for ro locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.roSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (i == 1 && vf.v == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (vf.v != 0 || n == 0 || (n != 1 && n % 100 >= 1 && n % 100 <= 19)) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 2 };
};

/**
 * Plural select rules for hi locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.hiSelect_ = function (n, opt_precision) {
  var i = n | 0;
  if (i == 0 || n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for fr locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.frSelect_ = function (n, opt_precision) {
  var i = n | 0;
  if (i == 0 || i == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for pt locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.ptSelect_ = function (n, opt_precision) {
  var i = n | 0;
  if (i >= 0 && i <= 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for cs locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.csSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (i == 1 && vf.v == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (i >= 2 && i <= 4 && vf.v == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  if (vf.v != 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for pl locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.plSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (i == 1 && vf.v == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (
    vf.v == 0 &&
    i % 10 >= 2 &&
    i % 10 <= 4 &&
    (i % 100 < 12 || i % 100 > 14)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  if (
    (vf.v == 0 && i != 1 && i % 10 >= 0 && i % 10 <= 1) ||
    (vf.v == 0 && i % 10 >= 5 && i % 10 <= 9) ||
    (vf.v == 0 && i % 100 >= 12 && i % 100 <= 14)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for shi locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.shiSelect_ = function (n, opt_precision) {
  var i = n | 0;
  if (i == 0 || n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n >= 2 && n <= 10) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 2 };
};

/**
 * Plural select rules for lv locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.lvSelect_ = function (n, opt_precision) {
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (
    n % 10 == 0 ||
    (n % 100 >= 11 && n % 100 <= 19) ||
    (vf.v == 2 && vf.f % 100 >= 11 && vf.f % 100 <= 19)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.ZERO, index: 0 };
  }
  if (
    (n % 10 == 1 && n % 100 != 11) ||
    (vf.v == 2 && vf.f % 10 == 1 && vf.f % 100 != 11) ||
    (vf.v != 2 && vf.f % 10 == 1)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 1 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 2 };
};

/**
 * Plural select rules for iu locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.iuSelect_ = function (n, opt_precision) {
  if (n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n == 2) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 2 };
};

/**
 * Plural select rules for he locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.heSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (i == 1 && vf.v == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (i == 2 && vf.v == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  if (vf.v == 0 && (n < 0 || n > 10) && n % 10 == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for mt locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.mtSelect_ = function (n, opt_precision) {
  if (n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n == 0 || (n % 100 >= 2 && n % 100 <= 10)) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  if (n % 100 >= 11 && n % 100 <= 19) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for si locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.siSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (n == 0 || n == 1 || (i == 0 && vf.f == 1)) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for cy locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.cySelect_ = function (n, opt_precision) {
  if (n == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ZERO, index: 0 };
  }
  if (n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 1 };
  }
  if (n == 2) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 2 };
  }
  if (n == 3) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 3 };
  }
  if (n == 6) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 4 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 5 };
};

/**
 * Plural select rules for da locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.daSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  var wt = goog.i18n.pluralRules.get_wt_(vf.v, vf.f);
  if (n == 1 || (wt.t != 0 && (i == 0 || i == 1))) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for ru locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.ruSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (vf.v == 0 && i % 10 == 1 && i % 100 != 11) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (
    vf.v == 0 &&
    i % 10 >= 2 &&
    i % 10 <= 4 &&
    (i % 100 < 12 || i % 100 > 14)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  if (
    (vf.v == 0 && i % 10 == 0) ||
    (vf.v == 0 && i % 10 >= 5 && i % 10 <= 9) ||
    (vf.v == 0 && i % 100 >= 11 && i % 100 <= 14)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for gv locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.gvSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (vf.v == 0 && i % 10 == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (vf.v == 0 && i % 10 == 2) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  if (
    vf.v == 0 &&
    (i % 100 == 0 ||
      i % 100 == 20 ||
      i % 100 == 40 ||
      i % 100 == 60 ||
      i % 100 == 80)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 2 };
  }
  if (vf.v != 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 3 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 4 };
};

/**
 * Plural select rules for be locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.beSelect_ = function (n, opt_precision) {
  if (n % 10 == 1 && n % 100 != 11) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  if (
    n % 10 == 0 ||
    (n % 10 >= 5 && n % 10 <= 9) ||
    (n % 100 >= 11 && n % 100 <= 14)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for ga locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.gaSelect_ = function (n, opt_precision) {
  if (n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n == 2) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  if (n >= 3 && n <= 6) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 2 };
  }
  if (n >= 7 && n <= 10) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 3 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 4 };
};

/**
 * Plural select rules for es locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.esSelect_ = function (n, opt_precision) {
  if (n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for dsb locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.dsbSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if ((vf.v == 0 && i % 100 == 1) || vf.f % 100 == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if ((vf.v == 0 && i % 100 == 2) || vf.f % 100 == 2) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  if (
    (vf.v == 0 && i % 100 >= 3 && i % 100 <= 4) ||
    (vf.f % 100 >= 3 && vf.f % 100 <= 4)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for lag locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.lagSelect_ = function (n, opt_precision) {
  var i = n | 0;
  if (n == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ZERO, index: 0 };
  }
  if ((i == 0 || i == 1) && n != 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 1 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 2 };
};

/**
 * Plural select rules for mk locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.mkSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (
    (vf.v == 0 && i % 10 == 1 && i % 100 != 11) ||
    (vf.f % 10 == 1 && vf.f % 100 != 11)
  ) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for is locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.isSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  var wt = goog.i18n.pluralRules.get_wt_(vf.v, vf.f);
  if ((wt.t == 0 && i % 10 == 1 && i % 100 != 11) || wt.t != 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for ksh locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.kshSelect_ = function (n, opt_precision) {
  if (n == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ZERO, index: 0 };
  }
  if (n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 1 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 2 };
};

/**
 * Plural select rules for ar locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.arSelect_ = function (n, opt_precision) {
  if (n == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ZERO, index: 0 };
  }
  if (n == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 1 };
  }
  if (n == 2) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 2 };
  }
  if (n % 100 >= 3 && n % 100 <= 10) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 3 };
  }
  if (n % 100 >= 11 && n % 100 <= 99) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 4 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 5 };
};

/**
 * Plural select rules for gd locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.gdSelect_ = function (n, opt_precision) {
  if (n == 1 || n == 11) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n == 2 || n == 12) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  if ((n >= 3 && n <= 10) || (n >= 13 && n <= 19)) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for sl locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.slSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (vf.v == 0 && i % 100 == 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (vf.v == 0 && i % 100 == 2) {
    return { keyword: goog.i18n.pluralRules.Keyword.TWO, index: 1 };
  }
  if ((vf.v == 0 && i % 100 >= 3 && i % 100 <= 4) || vf.v != 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for lt locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.ltSelect_ = function (n, opt_precision) {
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (n % 10 == 1 && (n % 100 < 11 || n % 100 > 19)) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  if (n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 11 || n % 100 > 19)) {
    return { keyword: goog.i18n.pluralRules.Keyword.FEW, index: 1 };
  }
  if (vf.f != 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.MANY, index: 2 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 3 };
};

/**
 * Plural select rules for tzm locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.tzmSelect_ = function (n, opt_precision) {
  if ((n >= 0 && n <= 1) || (n >= 11 && n <= 99)) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for en locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.enSelect_ = function (n, opt_precision) {
  var i = n | 0;
  var vf = goog.i18n.pluralRules.get_vf_(n, opt_precision);
  if (i == 1 && vf.v == 0) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Plural select rules for ak locale
 *
 * @param {number} n  The count of items.
 * @param {number=} opt_precision Precision for number formatting, if not default.
 * @return {{keyword: goog.i18n.pluralRules.Keyword, index: number}} Locale-specific plural value and translation index.
 * @private
 */
goog.i18n.pluralRules.akSelect_ = function (n, opt_precision) {
  if (n >= 0 && n <= 1) {
    return { keyword: goog.i18n.pluralRules.Keyword.ONE, index: 0 };
  }
  return { keyword: goog.i18n.pluralRules.Keyword.OTHER, index: 1 };
};

/**
 * Selected Plural rules by locale.
 */
goog.i18n.pluralRules.select = function (locale, n, opt_precision) {
  if (locale == 'af') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'am') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }
  if (locale == 'ar') {
    return goog.i18n.pluralRules.arSelect_(n, opt_precision);
  }
  if (locale == 'ar_DZ' || locale == 'ar-DZ') {
    return goog.i18n.pluralRules.arSelect_(n, opt_precision);
  }
  if (locale == 'ar_EG' || locale == 'ar-EG') {
    return goog.i18n.pluralRules.arSelect_(n, opt_precision);
  }
  if (locale == 'az') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'be') {
    return goog.i18n.pluralRules.beSelect_(n, opt_precision);
  }
  if (locale == 'bg') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'bn') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }
  if (locale == 'br') {
    return goog.i18n.pluralRules.brSelect_(n, opt_precision);
  }
  if (locale == 'bs') {
    return goog.i18n.pluralRules.srSelect_(n, opt_precision);
  }
  if (locale == 'ca') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'chr') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'cs') {
    return goog.i18n.pluralRules.csSelect_(n, opt_precision);
  }
  if (locale == 'cy') {
    return goog.i18n.pluralRules.cySelect_(n, opt_precision);
  }
  if (locale == 'da') {
    return goog.i18n.pluralRules.daSelect_(n, opt_precision);
  }
  if (locale == 'de') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'de_AT' || locale == 'de-AT') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'de_CH' || locale == 'de-CH') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'el') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'en') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_AU' || locale == 'en-AU') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_CA' || locale == 'en-CA') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_GB' || locale == 'en-GB') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_IE' || locale == 'en-IE') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_IN' || locale == 'en-IN') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_SG' || locale == 'en-SG') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_US' || locale == 'en-US') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'en_ZA' || locale == 'en-ZA') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'es') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'es_419' || locale == 'es-419') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'es_ES' || locale == 'es-ES') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'es_MX' || locale == 'es-MX') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'es_US' || locale == 'es-US') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'et') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'eu') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'fa') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }
  if (locale == 'fi') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'fil') {
    return goog.i18n.pluralRules.filSelect_(n, opt_precision);
  }
  if (locale == 'fr') {
    return goog.i18n.pluralRules.frSelect_(n, opt_precision);
  }
  if (locale == 'fr_CA' || locale == 'fr-CA') {
    return goog.i18n.pluralRules.frSelect_(n, opt_precision);
  }
  if (locale == 'ga') {
    return goog.i18n.pluralRules.gaSelect_(n, opt_precision);
  }
  if (locale == 'gl') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'gsw') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'gu') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }
  if (locale == 'haw') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'he') {
    return goog.i18n.pluralRules.heSelect_(n, opt_precision);
  }
  if (locale == 'hi') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }
  if (locale == 'hr') {
    return goog.i18n.pluralRules.srSelect_(n, opt_precision);
  }
  if (locale == 'hu') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'hy') {
    return goog.i18n.pluralRules.frSelect_(n, opt_precision);
  }
  if (locale == 'id') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'in') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'is') {
    return goog.i18n.pluralRules.isSelect_(n, opt_precision);
  }
  if (locale == 'it' || locale == 'it_IT') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'iw') {
    return goog.i18n.pluralRules.heSelect_(n, opt_precision);
  }
  if (locale == 'ja') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'ka') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'kk') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'km') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'kn') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }
  if (locale == 'ko') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'ky') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'ln') {
    return goog.i18n.pluralRules.akSelect_(n, opt_precision);
  }
  if (locale == 'lo') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'lt') {
    return goog.i18n.pluralRules.ltSelect_(n, opt_precision);
  }
  if (locale == 'lv') {
    return goog.i18n.pluralRules.lvSelect_(n, opt_precision);
  }
  if (locale == 'mk') {
    return goog.i18n.pluralRules.mkSelect_(n, opt_precision);
  }
  if (locale == 'ml') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'mn') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'mo') {
    return goog.i18n.pluralRules.roSelect_(n, opt_precision);
  }
  if (locale == 'mr') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }
  if (locale == 'ms') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'mt') {
    return goog.i18n.pluralRules.mtSelect_(n, opt_precision);
  }
  if (locale == 'my') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'nb') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'ne') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'nl' || locale == 'nl_NL') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'no') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'no_NO' || locale == 'no-NO') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'or') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'pa') {
    return goog.i18n.pluralRules.akSelect_(n, opt_precision);
  }
  if (locale == 'pl') {
    return goog.i18n.pluralRules.plSelect_(n, opt_precision);
  }
  if (locale == 'pt') {
    return goog.i18n.pluralRules.ptSelect_(n, opt_precision);
  }
  if (locale == 'pt_BR' || locale == 'pt-BR') {
    return goog.i18n.pluralRules.ptSelect_(n, opt_precision);
  }
  if (locale == 'pt_PT' || locale == 'pt-PT') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'ro') {
    return goog.i18n.pluralRules.roSelect_(n, opt_precision);
  }
  if (locale == 'ru') {
    return goog.i18n.pluralRules.ruSelect_(n, opt_precision);
  }
  if (locale == 'sh') {
    return goog.i18n.pluralRules.srSelect_(n, opt_precision);
  }
  if (locale == 'si') {
    return goog.i18n.pluralRules.siSelect_(n, opt_precision);
  }
  if (locale == 'sk') {
    return goog.i18n.pluralRules.csSelect_(n, opt_precision);
  }
  if (locale == 'sl') {
    return goog.i18n.pluralRules.slSelect_(n, opt_precision);
  }
  if (locale == 'sq') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'sr') {
    return goog.i18n.pluralRules.srSelect_(n, opt_precision);
  }
  if (locale == 'sr_Latn' || locale == 'sr-Latn') {
    return goog.i18n.pluralRules.srSelect_(n, opt_precision);
  }
  if (locale == 'sv') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'sw') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'ta') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'te') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'th') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'tl') {
    return goog.i18n.pluralRules.filSelect_(n, opt_precision);
  }
  if (locale == 'tr') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'uk') {
    return goog.i18n.pluralRules.ruSelect_(n, opt_precision);
  }
  if (locale == 'ur') {
    return goog.i18n.pluralRules.enSelect_(n, opt_precision);
  }
  if (locale == 'uz') {
    return goog.i18n.pluralRules.esSelect_(n, opt_precision);
  }
  if (locale == 'vi') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'zh') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'zh_CN' || locale == 'zh-CN') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'zh_HK' || locale == 'zh-HK') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'zh_TW' || locale == 'zh-TW') {
    return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
  }
  if (locale == 'zu') {
    return goog.i18n.pluralRules.hiSelect_(n, opt_precision);
  }

  return goog.i18n.pluralRules.defaultSelect_(n, opt_precision);
};

export { goog };
