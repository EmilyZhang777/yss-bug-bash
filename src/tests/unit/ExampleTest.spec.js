const { UnitTest } = require('./Util/UnitTest');
const assert = require('assert');

const ExampleTest = new UnitTest
  .Builder('exampleTest')
  .withDescription('an example test')
  .withTemplate('common.helpers.keywords')
  .withTestData({
    'foo': 'bar',
  })
  .withAssertions((document) => {
    assert(document.querySelector('body'));
  })
  .build();

module.exports = {
  ExampleTest
};

