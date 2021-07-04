# How to Write Acceptance Tests

1. Make sure all the hosts for this repo are in `src/tests/acceptance/testConfig.json` and are correct.
2. Add the IDs of entities for Pager to load for tests in `src/tests/acceptance/testConfig.json` for each host. Use the entity's internal ID, same as with the "Additional Entities" field in Pager.
3. For page-specific tests, create a new class file in the `src/tests/acceptance/PageObjects` folder that extends BasePage to add the page-specific functions for that page, such as performing a search in the locator. The page class should not contain logic for your test, only functions to interact with the content on the page.
4. Create a new file in the `src/tests/acceptance/tests` folder. You can copy the ExampleTest file to get started. Your file should export a function that returns the test function rather than running the test inside the file. More info on test functions below.
5. Import the PageObject(s) into your test file and write your tests with it. Visit https://mochajs.org/ for a reference on writing mocha tests.
6. Import your tests in `src/tests/acceptance/tests.js` and add them to the hostnames that they should be run on.

## Test Functions
Test functions are called with one argument `context`, an object with the test configuration and variables:
- browser: a puppeteer browser -- https://github.com/GoogleChrome/puppeteer/blob/v1.20.0/docs/api.md#class-browser
- browserConfig: the parameters used to initialize browser
- env: the testing environment
- host: the test host domain, which varies by environment
- hostname: the hostname of the site being tested, same as siteInternalHostName in soy
