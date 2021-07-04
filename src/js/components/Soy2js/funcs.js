import URI from 'urijs';
import { checktype, checkmap, missing, objDrilldown } from './utils.js';
// import { localePhoneNumber } from './phone.js'; /* Add Back if you need to use lphoneNumber */
import { stateAbbrReverseMap } from './stateAbbrMap.js';
import {
  sameDay as dtSameDay,
  sameMonth as dtSameMonth,
  sameYear as dtSameYear,
  currentYear as dtCurrentYear,
  ltimef as dtLtimef,
  ltimestampf as dtLtimestampf,
  timef as dtTimef,
  timestampf as dtTimestampf,
  dateToTimestamp as dtDateToTimestamp
} from './datetime.js';

export const imageNoop = (string) => {
  return string;
};

export const imageCloudinary = imageNoop;

export const ldatetimef = () => {
  // GENERATOR TODO: Implement lnumberf
  missing('missing ldatetimef');
};

export const parseInt = (value) => {
  checktype(value, 'string');
  return (window || Number).parseInt(value);
};

// GENERATOR TODO: figure out how to pass funcs to window.
export const parseFloat = (value) => {
  checktype(value, 'string');
  return (window || Number).parseFloat(value);
};

export const contains = (list, value) => {
  checktype(list, 'array');
  return list.filter((item) => item === value).length > 0;
};

export const indexOf = (haystack, needle) => {
  checktype(haystack, 'string');
  checktype(needle, 'string');
  return haystack.indexOf(needle);
};

export const augmentList = (list1, list2) => {
  checktype(list1, 'array');
  checktype(list2, 'array');
  return list1.concat(list2);
};

export const collapseDays = (hours) => {
  checktype(hours, 'array');

  if (hours.length === 0) {
    return hours;
  }

  let output = [hours[0]];
  for (
    let i = 1, end = hours.length, asc = 1 <= end;
    asc ? i < end : i > end;
    asc ? i++ : i--
  ) {
    let cur = hours[i];
    let prev = output[output.length - 1];
    if (
      dayHoursEquals(prev, cur) &&
      cur['holiday'] === undefined &&
      prev['holiday'] === undefined
    ) {
      prev['through'] = cur['day'];
    } else {
      output.push(cur);
    }
  }

  return output;
};

export let dayHoursEquals = function (i1, i2) {
  checkmap(i1);
  checkmap(i2);

  let l1 = i1['intervals'];

  // If not intervals, assume it's a daily time
  if (l1 === undefined) {
    return i1['time'] === i2['time'];
  }

  let l2 = i2['intervals'];

  if (l1.length !== l2.length) {
    return false;
  }

  for (
    let i = 0, end = l1.length, asc = 0 <= end;
    asc ? i < end : i > end;
    asc ? i++ : i--
  ) {
    if (l1[i]['start'] !== l2[i]['start'] || l1[i]['end'] !== l2[i]['end']) {
      return false;
    }
  }

  return true;
};

export const gmap = (path, params) => privatem('gmap');

export const dynamicImageBySize = (sizes, width, height, atLeastAsLarge) => {
  if (atLeastAsLarge == null) {
    atLeastAsLarge = true;
  }
  checktype(sizes, 'array');
  checktype(width, 'number');
  checktype(height, 'number');
  checktype(atLeastAsLarge, 'boolean');
  if (sizes.length === 0) {
    throw new Error('non-zero length sizes array required');
  }
  if (sizes.length > 1) {
    let w = width > 0 ? width : '';
    let h = height > 0 ? height : '';
    let desiredSize = `${w}x${h}`;
    return imageBySize(sizes, desiredSize, atLeastAsLarge);
  }

  let getLocation = function (href) {
    // source : http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
    // native url parsing browser support is quite poor
    let match = href.match(
      /^(https?:)?\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    );
    return (
      match && {
        protocol: match[1] || '',
        host: match[2] || '',
        hostname: match[3] || '',
        port: match[4] || '',
        pathname: match[5] || '',
        search: match[6] || '',
        hash: match[7] || ''
      }
    );
  };

  let parsed = getLocation(sizes[0].url);

  if (atLeastAsLarge) {
    parsed.hostname = 'dynl.mktgcdn.com';
  } else {
    parsed.hostname = 'dynm.mktgcdn.com';
  }

  let pathParts = parsed.pathname.split('/');
  let filename = pathParts.pop();
  let ext = filename.split('.').pop();
  let newfilename = `${width}x${height}.${ext}`;
  pathParts.push(newfilename);
  parsed.pathname = pathParts.join('/');

  return `${parsed.protocol}//${parsed.hostname}${parsed.port}${parsed.pathname}${parsed.search}${parsed.hash}`;
};

export function imageBySize(sizes, desiredSize, atLeastAsLarge) {
  let height, index;
  if (atLeastAsLarge == null) {
    atLeastAsLarge = true;
  }
  checktype(sizes, 'array');
  checktype(desiredSize, 'string');
  if (desiredSize.indexOf('x') === -1) {
    throw new Error('Invalid desired size');
  }
  checktype(atLeastAsLarge, 'boolean');

  let width = (height = -1);

  let desiredDims = desiredSize.split('x');

  if (desiredDims[0] !== '') {
    width = (window || Number).parseInt(desiredDims[0]);
    if ((window || Number).isNaN(width)) {
      throw new Error('Invalid width specified');
    }
  }

  if (desiredDims[1] !== '') {
    height = (window || Number).parseInt(desiredDims[1]);
    if ((window || Number).isNaN(height)) {
      throw new Error('Invalid height specified');
    }
  }

  let widthOk = width === -1;
  let heightOk = height === -1;

  if (atLeastAsLarge) {
    index = sizes.length - 1;

    while (index >= 0) {
      if (!(sizes[index].width && sizes[index].height)) {
        return sizes[index].url;
      }

      if (width > 0) {
        widthOk = sizes[index].width >= width;
      }

      if (height > 0) {
        heightOk = sizes[index].height >= height;
      }

      if (heightOk && widthOk) {
        break;
      }

      index--;
    }

    // if we exhausted the list
    if (index <= 0) {
      index = 0;
    }
  } else {
    index = 0;

    while (index < sizes.length) {
      if (!(sizes[index].width && sizes[index].height)) {
        return sizes[index].url;
      }

      if (width > 0) {
        widthOk = sizes[index].width <= width;
      }

      if (height > 0) {
        heightOk = sizes[index].height <= height;
      }

      if (heightOk && widthOk) {
        break;
      }

      index++;
    }

    // if we exhausted the list
    if (index >= sizes.length) {
      index = sizes.length - 1;
    }
  }

  return sizes[index].url;
}

export function imageBySizeEntity(image, desiredSize, atLeastAsLarge = true) {
  checkmap(image);
  checktype(desiredSize, 'string');
  if (desiredSize.indexOf('x') === -1) {
    throw new Error('Invalid desired size');
  }
  checktype(atLeastAsLarge, 'boolean');

  if (!image.thumbnails) {
    image.thumbnails = [];
  }
  checktype(image.thumbnails, 'array');

  if (
    image.width != undefined &&
    image.height != undefined &&
    image.url != undefined
  ) {
    image.thumbnails.push({
      width: image.width,
      height: image.height,
      url: image.url
    });
  }

  return imageBySize(image.thumbnails, desiredSize, atLeastAsLarge);
}

export const prettyPrintPhone = (rawPhoneNumber) => {
  checktype(rawPhoneNumber, 'string');
  if (rawPhoneNumber.length !== 10) {
    return rawPhoneNumber;
  } else {
    return `(${rawPhoneNumber.substring(0, 3)}) ${rawPhoneNumber.substring(
      3,
      6
    )}-${rawPhoneNumber.substring(6, 10)}`;
  }
};

// FuncLPhoneNumber returns the formatted phone number in a given locale.
//
// Format parameter is optional. If not provided, default to NATIONAL format.
//
// Example Soy Usage:
// lphoneNumber('US', '4437990238') => '(443) 799-0238'
// lphoneNumber('US', '4437990238', 'E164') => '+14437990238'
// lphoneNumber('US', '4437990238', 'INTERNATIONAL') => '+1 443-799-0238'
// lphoneNumber('US', '4437990238', 'NATIONAL') => '(443) 799-0238'
// lphoneNumber('US', '4437990238', 'RFC3966') => 'tel:+1-443-799-0238'
export function lphoneNumber(countryCode, phoneNumber, format) {
  console.log('lphoneNumber is disabled by default.');
  console.log("Import 'phone.js' and uncomment the function in 'funcs.js'");
  throw new Error(`lphoneNumber is disabled`);

  // return localePhoneNumber(countryCode, phoneNumber, format);
}

export const rreplace = (string, search, replace = '') => {
  checktype(string, 'string');
  checktype(search, 'string');
  checktype(replace, 'string');

  return string.replace(new RegExp(search, 'g'), replace);
};

export const replace = (string, old, snew, max = -1) => {
  checktype(string, 'string');
  checktype(old, 'string');
  checktype(snew, 'string');
  checktype(max, 'number');

  if (max === -1) {
    // Escaping a string for RegExp:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
    return string.replace(
      new RegExp(old.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'),
      snew
    );
  }

  if (max === 0 || old === snew) {
    return string;
  }

  const splitstr = string.split(old);
  return (
    splitstr.slice(0, max + 1).join(snew) +
    [''].concat(splitstr.slice(max + 1)).join(old)
  );
};

export const listItems = (list) => {
  checktype(list, 'array');
  const reduceByKey = (list, key) =>
    list.reduce((a, b) => a.concat(b[key]), []);
  return reduceByKey(reduceByKey(list, 'sections'), 'items');
};

export const groupListByKey = (list, key, fallback) => {
  checktype(list, 'array');
  checktype(key, 'string');

  let groups = [];
  let temp = new Map();

  for (let obj of Array.from(list)) {
    var currentgroup, currentkey;

    if (fallback) {
      currentkey = objDrilldown(obj, key) ? objDrilldown(obj, key) : fallback;
    } else {
      currentkey = objDrilldown(obj, key);
    }

    if (temp.get(currentkey)) {
      currentgroup = temp.get(currentkey);
    } else {
      currentgroup = [];
    }

    currentgroup.push(obj);
    temp.set(currentkey, currentgroup);
  }

  for (let k of temp.keys()) {
    groups.push({ key: k, vals: temp.get(k) });
  }

  return sortListByKeys(groups, ['key']);
};

export const groupListByKeyMap = (list, key, fallback) => {
  checktype(list, 'array');
  checktype(key, 'string');

  if (fallback) {
    checktype(fallback, 'string');
  }

  let groups = {};

  for (let obj of Array.from(list)) {
    var currentgroup, currentkey, stringKey;

    if (fallback) {
      currentkey = objDrilldown(obj, key) ? objDrilldown(obj, key) : fallback;
    } else {
      currentkey = objDrilldown(obj, key);
    }

    // Soy func convert all keys to string
    stringKey = currentkey.toString();

    if (groups[stringKey]) {
      currentgroup = groups[stringKey];
    } else {
      currentgroup = [];
    }
    currentgroup.push(obj);
    groups[stringKey] = currentgroup;
  }

  return groups;
};

/**
 * The tag param is the 'IETF BCP 47 language tag', this is
 * not necessarily the same as the locales used in pages.
 *
 * For more information see here:
 * https://tools.ietf.org/html/bcp47
 */
export const sortListByKeys = (list, sorts, tag) => {
  checktype(list, 'array');
  if (list.length === 0) {
    return [];
  }
  checktype(sorts, 'array');
  if (sorts.length === 0) {
    return list;
  }

  let compare = function (fields) {
    let nfields = fields.length;

    return function (loc1, loc2) {
      let result;
      let i = 0;
      while (i < nfields) {
        result = 0;
        let field = fields[i];
        let descending = field.charAt(0) === '-';
        if (descending) {
          field = field.substring(1);
        }
        let reverse = descending ? -1 : 1;
        let a = objDrilldown(loc1, field);
        let b = objDrilldown(loc2, field);
        // when comparing string to non-string, separate string && non-string and sort them separately with string last
        if (
          (typeof a == 'string' && typeof b != 'string') ||
          (typeof b == 'string' && typeof a != 'string')
        ) {
          if (typeof a == 'string') {
            result = reverse * 1;
          } else {
            result = reverse * -1;
          }
        } else if (typeof a == 'string' && typeof b == 'string') {
          if (a.localeCompare(b, tag) < 0) {
            result = reverse * -1;
          }
          if (a.localeCompare(b, tag) > 0) {
            result = reverse * 1;
          }
        } else {
          if (a < b) {
            result = reverse * -1;
          }
          if (a > b) {
            result = reverse * 1;
          }
        }

        if (result !== 0) {
          break;
        }
        i++;
      }
      return result;
    };
  };

  let sorted = list.sort(compare(sorts));
  return sorted;
};

export const sortList = (list, ascending) => {
  if (ascending == null) {
    ascending = true;
  }
  checktype(list, 'array');
  if (list.length === 0) {
    return [];
  }

  let sentinelType = typeof list[0];

  if (!['number', 'boolean', 'string'].includes(sentinelType)) {
    throw new Error('Expected a list of primitive types');
  }

  if (list.length === 1) {
    return [list[0]];
  }
  ascending = ascending ? 1 : -1;

  for (let item of list) {
    checktype(item, sentinelType);
  }

  let compare = function (a, b) {
    let result = 0;
    switch (typeof a) {
      case 'string': {
        if (a.localeCompare(b) < 0) {
          result = -1 * ascending;
        }
        if (a.localeCompare(b) > 0) {
          result = 1 * ascending;
        }
        break;
      }
      default: {
        if (a < b) {
          result = -1 * ascending;
        }
        if (a > b) {
          result = 1 * ascending;
        }
      }
    }
    return result;
  };

  return list.sort(compare);
};

export const lnumberf = (locale, number) =>
  // GENERATOR TODO: Implement lnumberf
  missing('lnumberf');
export const lpercentf = (locale, number) =>
  // GENERATOR TODO: Implement lpercentf
  missing('lpercentf');
export const lcurrencyf = (locale, currency, number) =>
  // GENERATOR TODO: Implement lcurrencyf
  missing('lcurrencyf');
export const llanguageName = (locale, language) =>
  // GENERATOR TODO: Implement llanguageName
  missing('llanguageName');
export const lcountryName = (locale, country) =>
  // GENERATOR TODO: Implement lcountryName
  missing('lcountryName');
export const llocaleName = (locale, targetlocale) =>
  // GENERATOR TODO: Implement llocaleName
  missing('llocaleName');
export const lregionName = (locale, country, region) =>
  // GENERATOR TODO: Implement lregionName
  missing('lregionName');
export const ltimezone = () =>
  // GENERATOR TODO: Implement ltimezone
  missing('ltimezone');
export const imageBySizeCloudinary = imageBySize;

export const imageBySizeDynamic = () =>
  // GENERATOR TODO: Implement imageBySizeDynamic
  missing('imageBySizeDynamic');
export const imageDynamic = () =>
  // GENERATOR TODO: Implement imageDynamic
  missing('imageDynamic');
// Takes in a string and strips out all the pretty parts of it. If the first character is a +,
// it will keep it. Apart from that, it strips out all non-numeric characters.
export const stripOutPhoneDigits = (phone) => {
  checktype(phone, 'string');
  return phone.replace(/(?!\+)\D/g, '');
};

export const strlen = (string) => {
  checktype(string, 'string');
  return string.length;
};

export const substring = (string, start, end) => {
  if (end == null) {
    end = -1;
  }
  checktype(string, 'string');
  return string.substring(start, end === -1 ? string.length : end);
};

export const sameDay = dtSameDay;
export const sameMonth = dtSameMonth;
export const sameYear = dtSameYear;
export const currentYear = dtCurrentYear;
export const ltimef = dtLtimef;
export const ltimestampf = dtLtimestampf;
export const timef = dtTimef;
export const timestampf = dtTimestampf;
export const dateToTimestamp = dtDateToTimestamp;

export const slice = (elems, start, end) => {
  if (end == null) {
    end = elems.length - 1;
  }
  return elems.slice(start, end);
};

export const fullState = (abbr) => {
  checktype(abbr, 'string');
  let lookup = stateAbbrReverseMap[abbr];
  if (lookup) {
    return lookup;
  } else {
    return abbr;
  }
};

export const parseURL = (url) => {
  checktype(url, 'string');
  let parsedURL = new URI(url);
  return {
    scheme: parsedURL.scheme(),
    host: parsedURL.host(),
    hostname: parsedURL.hostname(),
    port: parsedURL.port(),
    path: parsedURL.path(),
    query: parsedURL.query(),
    fragment: parsedURL.fragment()
  };
};
