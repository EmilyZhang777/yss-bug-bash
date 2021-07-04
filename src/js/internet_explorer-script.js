import '@babel/polyfill/noConflict';

import { MonitoringInit } from '@yext/components-monitoring';
import { onReady } from '@yext/components-util';
import { secrets__YextSentryEndpointMonitoring } from 'templates/components/Secrets/Secrets.soy';

onReady(() => {
  MonitoringInit(secrets__YextSentryEndpointMonitoring());
});