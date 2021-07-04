import { BasePage } from './BasePage.js';

class LocatorPage extends BasePage {
  constructor(browser, {
    searchInputSelector = '.js-locator-input',
    searchButtonSelector = '.search-button',
    spinnerModalSelector = '.SpinnerModal'
  } = {}) {
    super(browser);

    this.searchInputSelector = searchInputSelector;
    this.searchButtonSelector = searchButtonSelector;
    this.spinnerModalSelector = spinnerModalSelector;
  }

  async search(query, waitForResults = false) {
    const page = await this.getPage();

    await page.type(this.searchInputSelector, query);
    await page.click(this.searchButtonSelector);

    if (waitForResults) {
      await page.waitFor(this.spinnerModalSelector, { visible: true });
      await page.waitFor(this.spinnerModalSelector, { hidden: true });
    }
  }
}

export {
  LocatorPage
};
