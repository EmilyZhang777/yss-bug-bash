import { MonitoringInit } from '@yext/components-monitoring';
import { Polyfills } from '@yext/components-polyfills';
import { Analytics } from '@yext/components-yext-analytics';
import {
  AccessibilityChecks,
  onReady,
  Debug,
  Instance as WCAGNewTab,
} from '@yext/components-util';
import { ImageObjectFit } from '@yext/components-image';
import { HeaderAce } from 'js/components/Cobalt/Header.js';
import { ObfuscateMailto } from 'js/common/modules/ObfuscateMailto.js';
import { secrets__YextSentryEndpointMonitoring } from 'templates/components/Secrets/Secrets.soy';

import 'script-loader!node_modules/svg4everybody/dist/svg4everybody.min.js';

export class Global {
  static init() {
    Polyfills.init();
    MonitoringInit(secrets__YextSentryEndpointMonitoring());

    onReady(() => {
      const header = new HeaderAce();
      ObfuscateMailto.run();
      ImageObjectFit();
      window.svg4everybody();
      WCAGNewTab.wcagify();

      if (
        window.location.href.includes('yextpages')
        || window.location.href.includes('localhost')
      ) {
        AccessibilityChecks.checkAltTags();
      }

      // Provide a global callback so the client's scripts can choose when to enable Yext Analytics
      window.enableYextAnalytics = () => {
        window.yextAnalyticsEnabled = true;
        window.enableYextAnalytics = () => {};

        const yaInstance = new Analytics();

        if (Debug.isEnabled()) {
          import('@yext/components-analytics-debugger').then(
            ({ AnalyticsDebugger }) => {
              window.Debugger = new AnalyticsDebugger(yaInstance);
            },
          );
        }
      };

      if (window.yextAnalyticsEnabled || Debug.isEnabled()) {
        window.enableYextAnalytics();
      }

      // Uncomment and add imports to the top of file if using internet_explorer redirect page feature
      //
      // import { url__page_ieRedirect } from 'templates/url/url.soy';
      // import { UserAgent } from '@yext/components-util';
      // let userAgent = new UserAgent(window.navigator.userAgent);
      // if (userAgent.isOnIE()) {
      //   window.location.href = Yext.baseUrl + url__page_ieRedirect({ locale: Yext.locale });
      // }
    });
  }
}
