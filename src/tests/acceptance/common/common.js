const config = require('../testConfig.json');

export const LOCAL_ENV = 'local';
export const STAGING_ENV = 'staging';
export const PROD_ENV = 'prod';

export const hostnames = Object.keys(config);

export const hosts = Object.assign(
  ...Object.entries(config)
    .map(([hostname, entry]) => ({
      [hostname]: {
        [LOCAL_ENV]: entry.hosts.local,
        [STAGING_ENV]: entry.hosts.staging,
        [PROD_ENV]: entry.hosts.prod
      }
    }))
);

export const proxyHosts = Object.assign(
  ...Object.entries(config)
    .map(([hostname, entry]) => ({
      [hostname]: entry.hosts.proxy
    }))
);

export const testEntities = Object.assign(
  ...Object.entries(config)
    .map(([hostname, entry]) => ({ [hostname]: entry.entities }))
);

// Command args
export const env = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : LOCAL_ENV;
export const headless = !process.argv.includes('--head');
export const ignoreHTTPSErrors = process.argv.includes('--ignoreHTTPSErrors');
