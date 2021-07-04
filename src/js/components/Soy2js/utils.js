export const checktype = (thing, type = 'string') => {
  type = type.toLowerCase();
  let failed = false;
  switch (type) {
    case 'array': {
      failed = !Array.isArray(thing);
      break;
    }
    default: {
      failed = typeof thing !== type || thing == null;
    }
  }
  if (failed) {
    throw new Error(`Object of type ${type} expected. Got ${typeof obj}.`);
  }
};

export const missing = (name) => {
  throw new Error(`${name} is not yet implemented`);
};

export const checkmap = (obj) => {
  if (
    obj == null ||
    !(Object.prototype.toString.call(obj).indexOf('Object') > 0)
  ) {
    throw new Error('Expected parameter of type Map');
  }
};

export const privatem = (name) => {
  throw new Error(
    `${name} has a private implementation and will not be implemented`
  );
};

export const objDrilldown = (obj, field) => {
  let path = field.split('.');
  while (path.length > 0) {
    obj = obj[path.shift()];
  }
  return obj;
};
