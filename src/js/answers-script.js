import '@babel/polyfill/noConflict';

// uncomment if you need to use jQuery
// import 'script-loader!node_modules/jquery/dist/jquery.min.js';

// uncomment if you need to do expand/collapse:
// import 'node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js';
// import 'node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js';

// uncomment if you need these components
// import { IDENTIFIER } from '@yext/components-404';
// import { IDENTIFIER } from '@yext/components-address';
// import { IDENTIFIER } from '@yext/components-analytics-debugger';
// import { IDENTIFIER } from '@yext/components-associated-apps';
// import { IDENTIFIER } from '@yext/components-autocomplete';
// import { IDENTIFIER } from '@yext/components-bios';
// import { IDENTIFIER } from '@yext/components-brands';
// import { IDENTIFIER } from '@yext/components-breadcrumbs';
// import { IDENTIFIER } from '@yext/components-cookies';
// import { IDENTIFIER } from '@yext/components-corsair';
// import { IDENTIFIER } from '@yext/components-description';
// import { IDENTIFIER } from '@yext/components-enhanced-gallery-list';
// import { IDENTIFIER } from '@yext/components-events';
// import { IDENTIFIER } from '@yext/components-facebook-plugin';
// import { IDENTIFIER } from '@yext/components-faq';
// import { IDENTIFIER } from '@yext/components-form';
// import { IDENTIFIER } from '@yext/components-geo';
// import { IDENTIFIER } from '@yext/components-google-adwords';
// import { IDENTIFIER } from '@yext/components-google-analytics';
// import { IDENTIFIER } from '@yext/components-google-recaptcha';
// import { IDENTIFIER } from '@yext/components-google-tag-manager';
// import { IDENTIFIER } from '@yext/components-historian';
// import { IDENTIFIER } from '@yext/components-hours';
// import { IDENTIFIER } from '@yext/components-image';
// import { IDENTIFIER } from '@yext/components-info-window';
// import { IDENTIFIER } from '@yext/components-instagram';
// import { IDENTIFIER } from '@yext/components-layout';
// import { IDENTIFIER } from '@yext/components-location-map';
// import { IDENTIFIER } from '@yext/components-location-title';
// import { IDENTIFIER } from '@yext/components-locator';
// import { IDENTIFIER } from '@yext/components-maps';
// import { IDENTIFIER } from '@yext/components-modal';
// import { IDENTIFIER } from '@yext/components-monitoring';
// import { IDENTIFIER } from '@yext/components-notification';
// import { IDENTIFIER } from '@yext/components-performance';
// import { IDENTIFIER } from '@yext/components-phone';
// import { IDENTIFIER } from '@yext/components-pin-clusterer';
// import { IDENTIFIER } from '@yext/components-pinterest';
// import { IDENTIFIER } from '@yext/components-polyfills';
// import { IDENTIFIER } from '@yext/components-recent-tweets';
// import { IDENTIFIER } from '@yext/components-renderer';
// import { IDENTIFIER } from '@yext/components-reviews';
// import { IDENTIFIER } from '@yext/components-run-if-visible';
// import { IDENTIFIER } from '@yext/components-schema';
// import { IDENTIFIER } from '@yext/components-search';
// import { IDENTIFIER } from '@yext/components-search-form';
// import { IDENTIFIER } from '@yext/components-sniffer';
// import { IDENTIFIER } from '@yext/components-social';
// import { IDENTIFIER } from '@yext/components-special-offer';
// import { IDENTIFIER } from '@yext/components-spinner-modal';
// import { IDENTIFIER } from '@yext/components-svg';
// import { IDENTIFIER } from '@yext/components-tealium-analytics';
// import { IDENTIFIER } from '@yext/components-uber';
// import { IDENTIFIER } from '@yext/components-user-location-info';
// import { IDENTIFIER } from '@yext/components-util';
// import { IDENTIFIER } from '@yext/components-web-speech';
// import { IDENTIFIER } from '@yext/components-yext-analytics';
// import { IDENTIFIER } from '@yext/components-youtube-embed';

import { GoogleAdwords } from '@yext/components-google-adwords';
import { GoogleAnalytics } from '@yext/components-google-analytics';
import { Hours } from '@yext/components-hours';
import { onReady } from '@yext/components-util';
import { Global } from 'js/common/global';

Global.init();
GoogleAdwords.init();
GoogleAnalytics.enableAutotracking('yext');

onReady(() => {
  Hours.loadAndRun();
});
