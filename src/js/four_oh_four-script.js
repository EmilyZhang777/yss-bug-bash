import '@babel/polyfill/noConflict';

import { MonitoringInit } from '@yext/components-monitoring';
import { onReady } from '@yext/components-util';
import { LostAndFound } from '@yext/components-404';
import { secrets__YextSentryEndpointMonitoring } from 'templates/components/Secrets/Secrets.soy';

onReady(() => {
  MonitoringInit(secrets__YextSentryEndpointMonitoring());

  const laf = new LostAndFound(
    window.location.href,
    document.referrer,
    window.yxtLostAndFoundConfig,
  );
  laf.installBasicHooks();
  laf.run();
});
