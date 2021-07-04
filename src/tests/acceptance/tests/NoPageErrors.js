import { expect } from 'chai';

import { BasePage } from '../PageObjects/BasePage.js';

const breakpoints = [320, 768, 992, 1200];

export default function ({ path }) {
  return function (context) {
    describe('No page errors on ' + path, function () {
      this.timeout(30000);

      let page;

      before(() => page = new BasePage(context.browser));

      // Check for errors on all breakpoints
      for (const bp of breakpoints) {
        it(`should have no page errors at screen width ${bp}px`, async function () {
          await page.resize(bp, 1000);
          await page.at(`${context.host}/${path}`);
          await page.waitFor(1000); // wait for 1 second after the page loads

          expect(page.hasNoPageErrors()).to.be.true;
        });
      }
    });
  };
};
