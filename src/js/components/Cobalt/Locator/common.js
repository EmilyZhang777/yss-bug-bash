import {
  UserLocationInfoType,
  DefaultUserLocationInfo
} from '@yext/components-user-location-info';
import { GoogleAutocompleteServiceOptions } from '@yext/components-autocomplete';
import { MapboxAutocompleteServiceOptions } from '@yext/components-autocomplete';

export function geolocate(
  searchForm,
  geolocateQueryText,
  geolocateErrorMsg,
  spinner
) {
  spinner.showSpinner();
  DefaultUserLocationInfo.getUserLocation(UserLocationInfoType.HTML5Only)
    .then((coordinate) => {
      if (!coordinate.latitude && !coordinate.longitude) {
        return Promise.reject('Geolocation failed: invalid coordinate');
      }
      searchForm.searchByGeocode(
        geolocateQueryText,
        coordinate.searchQueryString()
      );
      searchForm.submit();
    })
    .catch((err) => {
      spinner.hideSpinner();
      console.error(err);
      if (geolocateErrorMsg) {
        alert(geolocateErrorMsg);
      }
    });
}

export function defaultAutocompleteServiceOptions(mapProvider) {
  const providerName = mapProvider.getProviderName();

  switch (providerName) {
    case 'Google':
      return new GoogleAutocompleteServiceOptions().withUserLocationInfo(
        DefaultUserLocationInfo
      );

    case 'Mapbox':
      return new MapboxAutocompleteServiceOptions().withUserLocationInfo(
        DefaultUserLocationInfo
      );

    default:
      console.warn(`Autocomplete for ${providerName} is not supported.`);
      return null;
  }
}
