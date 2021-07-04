// Import tests here:
import noPageErrors from './tests/NoPageErrors.js';

// Put pages with good data to test here:
const testPages = {
  'emily-demo': {
    directory: 'index.html',
    // location: 'TODO',
    locator: 'search'
  }
}

export default {
  // TODO: Add more tests!
  'emily-demo': [
    noPageErrors({ path: testPages['emily-demo'].directory }),
    // noPageErrors({ path: testPages['emily-demo'].location }),
    noPageErrors({ path: testPages['emily-demo'].locator })
  ]
};
