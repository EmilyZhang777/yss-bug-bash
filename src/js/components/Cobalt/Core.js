import { LocationMap } from '@yext/components-location-map';

class Core {
  static init(
    locationMapOptions = {},
    scope = document,
    selector = '.js-core'
  ) {
    for (const coreEl of scope.querySelectorAll(selector)) {
      new Core(coreEl, locationMapOptions);
    }
  }

  constructor(coreEl, locationMapOptions = {}) {
    const locationMapWrapper = coreEl.querySelector('.js-location-map-wrapper');
    if (locationMapWrapper) {
      this.locationMap = new LocationMap(
        locationMapWrapper,
        locationMapOptions
      );
    }
  }
}

export { Core };
