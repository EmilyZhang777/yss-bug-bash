import { SpinnerModal } from '@yext/components-spinner-modal';

import Raven from 'raven-js/dist/raven.js';
import URI from 'urijs';

import { HTML5Geolocation } from '@yext/components-util';
HTML5Geolocation.initClass();
import {
  strings__geolocateErrorMsg,
  strings__geolocateQueryText
} from 'templates/common/strings.soy';
import { AutocompleteOptions } from '@yext/components-autocomplete';
import { SearchFormOptions } from '@yext/components-search-form';
import { MapboxMaps } from '@yext/components-maps';
import {
  geolocate,
  defaultAutocompleteServiceOptions
} from 'js/components/Cobalt/Locator/common.js';
import { secrets__YextMapsKeyMapbox, secrets__YextSentryEndpointSearch } from 'templates/components/Secrets/Secrets.soy';

Raven.config(secrets__YextSentryEndpointSearch()).install();

export class Hero {
  static default() {
    MapboxMaps.load(secrets__YextMapsKeyMapbox(), { autocomplete: true }).then(() => {
      return new this(MapboxMaps);
    });
  }

  constructor(mapProvider, customAutocompleteServiceOptions = null) {
    this.inputEl = document.querySelector('.Hero-input');
    this.formEl = document.querySelector('.Hero-form');
    this.spinner = new SpinnerModal();

    this.geolocateQueryText = strings__geolocateQueryText();
    this.geolocateErrorMsg = strings__geolocateErrorMsg();

    const searchForm = new SearchFormOptions(this.formEl, this.inputEl).build();

    const geolocateButton = this.formEl.querySelector(
      '.js-hero-geolocateTrigger'
    );
    if (geolocateButton) {
      geolocateButton.addEventListener('click', () => {
        geolocate(
          searchForm,
          this.geolocateQueryText,
          this.geolocateErrorMsg,
          this.spinner
        );
      });
    }

    if (mapProvider) {
      if (!mapProvider.loaded) {
        throw new Error(
          `'${mapProvider.constructor.name}' is not loaded. The MapProvider must be loaded before calling Hero constructor.`
        );
      }

      const autocompleteServiceOptions =
        customAutocompleteServiceOptions ||
        defaultAutocompleteServiceOptions(mapProvider);
      const autocomplete = new AutocompleteOptions(searchForm)
        .withAutocompleteServiceOptions(autocompleteServiceOptions)
        .build();

      this.formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update query type from autocomplete to do country/region search if selected
        autocomplete
          .updateQueryType()
          // Redirect the search to the locator
          .then(
            () =>
              (window.location.href = `${
                this.formEl.action
              }?${searchForm.buildQuery()}`)
          );
      });
    } else {
      this.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = `${
          this.formEl.action
        }?${searchForm.buildQuery()}`;
      });
    }
  }
}
