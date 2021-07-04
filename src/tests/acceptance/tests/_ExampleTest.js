import { expect } from 'chai';

// The export should be a function that returns the test function.
// Options can be provided to configure the test, such as the URL path to test on.
export default function (options) {
  // The test function is called with the context of the test
  return function (context) {
    describe('Test Name', function () {
      this.timeout(30000); // 30 seconds

      it('expected test condition', async function () {
        const condition = true;
        expect(condition).to.be.true;
      });
    });
  };
};
