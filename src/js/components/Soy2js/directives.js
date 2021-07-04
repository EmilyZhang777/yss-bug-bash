import { slugify as s } from 'underscore.string';
import { missing, checktype } from './utils.js';
import { rreplace as func_rreplace } from './funcs.js';
import { stateAbbrReverseMap } from './stateAbbrMap.js';

export const other = () =>
  // Implement other
  missing('other');
export const nullSafe = (arg) => {
  return arg == null ? '' : arg;
};

export const encodeBase64 = function (str) {
  checktype(str, 'string');
  const btoa = (str) =>
    window ? window.btoa(str) : Buffer.from(str).toString('base64');
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode('0x' + p1)
    )
  );
};

export const abbr = (abbr, useAbbrev) => {
  if (useAbbrev == null) {
    useAbbrev = false;
  }
  checktype(abbr, 'string');
  if (useAbbrev) {
    return abbr;
  }

  let lookup = stateAbbrReverseMap[abbr];
  if (lookup) {
    return lookup;
  } else {
    return abbr;
  }
};

export const slugify = (string) => {
  checktype(string, 'string');
  return s(string);
};

export const rreplace = (string, search, replace = '') => {
  return func_rreplace(string, search, replace);
};

export const encodeUrl = (string) => {
  checktype(string, 'string');
  return encodeURI(string);
};

export const casing = (string, option) => {
  checktype(string, 'string');
  checktype(option, 'string');

  switch (option) {
    case 'lower':
      return string.toLowerCase();
    case 'upper':
      return string.toUpperCase();
    case 'retain':
      return string;
    default:
      throw new Error(`unsupported case argument: ${option}`);
  }
};

export const spaces = (string, replace) => {
  checktype(string, 'string');
  return string.replace(/\s/g, replace);
};

export const title = (string) => {
  checktype(string, 'string');
  return string.replace(/\b[a-z]/g, (letter) => casing(letter, 'upper'));
};

export const lower = (string) => {
  checktype(string, 'string');
  return casing(string, 'lower');
};

export const stripnum = (address, enable) => {
  checktype(address, 'string');
  if (!enable) {
    return address;
  }
  for (const ch of address) {
    if ('0' <= ch && ch <= '9') {
      continue;
    }
    if (ch == ' ') {
      return address.substring(address.indexOf(ch) + 1);
    }
    break;
  }
  return address;
};

export const fullCountry = (string, enable) => {
  missing('i18n :/');
};

export const fullRegion = (string, enable) => {
  missing('i18n :/');
};

export const latin = (string, enable) => {
  missing('i18n :/');
};

// stateAbbr is an alias of abbr in Go
export const stateAbbr = abbr;
