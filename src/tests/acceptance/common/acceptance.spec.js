import '@babel/polyfill';
import puppeteer from 'puppeteer';

import * as common from './common.js';
import { PagerManager } from './PagerManager.js';
import testsByHostname from '../tests.js';

const testServer = new PagerManager();
let browser;
let initialHostName;
const browserConfig = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ],
  headless: common.headless,
  ignoreHTTPSErrors: common.ignoreHTTPSErrors
}

describe('Acceptance Tests', function () {
  before(async function () {
    this.timeout(120000); // ample time for pager to start
    browser = await puppeteer.launch(browserConfig);

    initialHostName = common.hostnames.filter(hostname => (testsByHostname[hostname] || []).length)[0]

    if (common.env == common.LOCAL_ENV) {
      await testServer.startPager(common.proxyHosts[initialHostName], {
        additionalEntities: common.testEntities[initialHostName]
      });
    }
  });

  for (const hostname of common.hostnames.filter(hostname => (testsByHostname[hostname] || []).length)) {
    describe(hostname + ' Acceptance Tests', function () {
      before(async function setup() {
        this.timeout(120000);

        if (common.env == common.LOCAL_ENV && hostname != initialHostName) {
          await testServer.setProxyHost(common.proxyHosts[hostname], testServer.defaultPort, {
            additionalEntities: common.testEntities[hostname]
          });
        }
      });

      testsByHostname[hostname].forEach(test => test({
        get browser() { return browser; }, // browser is undefined until tests start
        browserConfig,
        env: common.env,
        host: common.hosts[hostname][common.env],
        hostname
      }));

      after(async function cleanup() {
        this.timeout(5000);

        await browser.pages().then(pages => Promise.all(pages.map(page => page.close())));
      });
    });
  }

  after(async function() {
    this.timeout(5000);

    await Promise.all([
      browser.close(),
      new Promise(resolve => {
        if (common.env == common.LOCAL_ENV) {
          testServer.killAll();
          setTimeout(resolve, 2000); //wait for port to be freed
        } else {
          resolve();
        }
      })
    ]);
  });
});
