import '@babel/polyfill';

const { spawn, exec } = require('child_process');
const path = require('path');
const http = require ('http');
const fetch = require('node-fetch');
const request = require('requestretry');
const rootDir = process.env.WORKSPACE || path.resolve(__dirname, "../../../");
const testPort = 5957;
const killer = require('tree-kill');
const fs = require('fs');

const { ExampleTest } = require('./ExampleTest.spec');
const { HoursTests } = require('./HoursTest.spec');

const soyDirectoriesData = fs.readFileSync(path.join(rootDir, 'src/soydirectories.json'));
const soyDirectories = JSON.parse(soyDirectoriesData);

const serverFlags = [
  `--port ${testPort}`,
  '--pagesdir \"$(dirname \"$(pwd)\")\"',
  `--templatedir ${soyDirectories.map(dir => `src/${dir}`).join(":")}`,
  "--staticdirs 'src/.tmp'",
  "--nosecure"
];

let pager;

async function startSitesPager() {
  pager = spawn('YEXT_NEW_PAGER=1 pager', serverFlags, {
    env: Object.assign({
      GOMAXPROCS: 2,
    }, process.env),
    stdio: ['ignore', 'ignore', 'ignore'],
    shell: true
  });
};

function pagerRetryStrategy(err, response, body, options) {
  return !!err;
}

function waitForPager() {
  // This will ping localhost every second until a successful response is received
  return new Promise((resolve, reject) => {
    console.log('Waiting for Pager...');
    request({
      url: `http://localhost:${testPort}`,
      retryDelay: 1000,
      maxAttempts: 10,
      fullResponse: true,
      retryStrategy: pagerRetryStrategy
    }, function(err, response, body) {
      if (!err && body) {
        exec(`curl http://localhost:${testPort}/toggleproxy -X POST`);
        console.log('Pager is ready!');
        resolve();
      }
    });
  });
}

describe('soy unit tests', () => {

  before('start pager', async function() {
    this.timeout(20000);
    startSitesPager();
    return waitForPager();
  });

  // this is an example test run
  describe('an example unit test', function(){
    ExampleTest.run();
  });

  describe('Hours unit tests', function(){
    for (let test of HoursTests)
    {
      test.run();
    }
  });

  after('results and kill pager', function() {
    let failedTests = [];
    this.test.parent.suites.forEach(function(suite){
      failedTests = failedTests.concat(suite.tests.filter(test => test.state === 'failed'));
    });
    failedTests.forEach((failed) => {
      console.log(`open -a "Google Chrome "${failed.renderedURL}"`);
      spawn("open",[
        `-a "Google Chrome"`,
        `"${failed.renderedURL}"`
      ], {
        detached: true,
        stdio: 'inherit',
        shell: true,
      });
    });

    console.log('killing pager');
    killer(pager.pid);
  })
});
