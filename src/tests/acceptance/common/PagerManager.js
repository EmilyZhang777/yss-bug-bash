import '@babel/polyfill';
import fetch from 'node-fetch';

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

class PagerManager {
  constructor(defaultPort = 9027) {
    this.defaultPort = defaultPort;
    this.pagerMap = {};
    this.readyPingInterval = null;
  }

  generateFlags(pagesDir, port) {
    return [
      '--pagesdir ' + pagesDir,
      '--port ' + port,
      '--maxentities 1'
    ];
  }

  async startPager(proxyHost, {
    pagesDir = '..',
    port = this.getAvailablePort(),
    locale,
    maxEntities = 1,
    additionalEntities = []
  } = {}) {
    console.log(`starting pager on port ${port}...`);

    if (this.pagerMap[port]) {
      this.pagerMap[port].kill('SIGINT');
    }

    const pager = spawn('pager', this.generateFlags(pagesDir, port), {
      env: {
        'GOMAXPROCS': '2',
        'YEXT_NEW_PAGER': '1',
        ...process.env
      },
      shell: true
    });

    this.pagerMap[port] = pager;

    pager.stdout.addListener('data', data => process.stdout.write(`${proxyHost}@:${port} - ${data}`));
    pager.stderr.addListener('data', data => process.stderr.write(`${proxyHost}@:${port} - ${data}`));
    pager.addListener('close', code => console.log(`${proxyHost}@:${port} - Process exited with code ${code}`));

    await this.awaitReadySignal(port);
    await this.setProxyHost(proxyHost, port, { locale, maxEntities, additionalEntities });

    return pager;
  }

  async setProxyHost(proxyHost, port = this.defaultPort, {
    locale,
    maxEntities = 1,
    additionalEntities = []
  } = {}) {
    const postRequest = () => {
      return fetch(`http://localhost:${port}/setproxyhost?host=${encodeURIComponent(proxyHost)}${locale ? '&locale=' + locale : ''}&maxEntities=${maxEntities}&additionalEntities=${additionalEntities.join(',')}`, {
        method: 'POST'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
          }
          return this.awaitReadySignal(port);
        });
    }

    // If failed, wait 3 seconds and retry once
    await postRequest()
      .catch(() => new Promise((resolve, reject) => {
        setTimeout(() => postRequest().then(resolve).catch(reject), 3000);
      }))
      .catch(err => console.error(`Error setting proxy host to ${proxyHost}:`, err));
  }

  getAvailablePort(requested = this.defaultPort) {
    let port = requested;
    while (port - 1 in this.pagerMap || port in this.pagerMap || port + 1 in this.pagerMap) {
      ++port;
    }
    return port;
  }

  killAll() {
    Object.values(this.pagerMap).forEach(pager => pager.kill('SIGINT'));
    this.pagerMap = {};
  }

  async awaitReadySignal(port = this.defaultPort, timeout = 30000) {
    this.clearReadyPingInterval();

    const pager = this.pagerMap[port];
    const that = this;
    await new Promise((resolve, reject) => {
      pager.stdout.addListener('data', function dataLoadedListener(data) {
        if (data.toString().includes('Handler ready in')) {
          pager.stdout.removeListener('data', dataLoadedListener);

          // Ping index.html until site data finishes preloading
          const interval = 1000;
          let remainingTime = timeout;
          that.readyPingInterval = setInterval(() => {
            remainingTime -= interval;
            if (remainingTime <= 0) {
              that.clearReadyPingInterval();
              reject(new Error('Error waiting for Pager: Time limit exceeded'));
            }

            fetch(`http://localhost:${port}/index.html`)
              .then(response => response.text())
              .then(text => {
                if (!text.includes('Site Data Preloading')) {
                  that.clearReadyPingInterval();
                  resolve();
                }
              })
          }, interval);
        }
      });
    });
  }

  clearReadyPingInterval() {
    if (this.readyPingInterval) {
      clearInterval(this.readyPingInterval);
      this.readyPingInterval = null;
    }
  }
}

export {
  PagerManager
};
