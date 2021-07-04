// Window frame - probably OS and WM dependent
const windowFrameWidth = 0;
const windowFrameHeight = 85;

class BasePage {
  constructor(browser) {
    this.browser = browser;
    this.pageErrors = [];

    this.pagePromise = this.browser.newPage();
    this.pagePromise.then(page => {
      const viewport = page.viewport();
      this.width = viewport.width;
      this.height = viewport.height;

      page.on('pageerror', e => {
        console.log('Page Error:', e);
        this.pageErrors.push(e);
      });
    });
  }

  async at(pageURL) {
    const page = await this.getPage();
    await page.goto(pageURL, { waitUntil: 'networkidle2' });
    return this;
  }

  async close() {
    const page = await this.getPage();
    await page.close();
  }

  async getActiveElement() {
    const page = await this.getPage();
    return page.evaluateHandle(() => document.activeElement);
  }

  async getPage() {
    // puppeteer page - https://github.com/GoogleChrome/puppeteer/blob/v1.20.0/docs/api.md#class-page
    return await this.pagePromise;
  }

  async getScrollY() {
    const page = await this.getPage();
    return page.evaluate(() => window.pageYOffset);
  }

  hasNoPageErrors() {
    return this.pageErrors.length == 0;
  }

  async resize(width, height) {
    const page = await this.getPage();

    if (this.width == width && this.height == height) {
      return;
    }

    await page.setViewport({ height, width });

    this.width = width;
    this.height = height;

    return;
  }

  async waitFor(selectorOrFunctionOrTimeout, options = {}, args = {}) {
    const page = await this.getPage();
    return await page.waitFor(selectorOrFunctionOrTimeout, options, args);
  }
}

export {
  BasePage
};
