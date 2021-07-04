import Stickyfill from 'stickyfilljs';
import { assertType, assertInstance } from '@yext/components-util';
import { AutocompleteOptions } from '@yext/components-autocomplete';
import { Coordinate } from '@yext/components-geo';
import { GeoBounds } from '@yext/components-geo';
import { Hours } from '@yext/components-hours';
import { MaestroOptions } from '@yext/components-locator';
import { Oracle } from '@yext/components-locator';
import { MapOptions } from '@yext/components-maps';
import { PinProperties } from '@yext/components-maps';
import { ElementRenderTargetOptions } from '@yext/components-renderer';
import { MapRenderTargetOptions } from '@yext/components-renderer';
import { RendererOptions } from '@yext/components-renderer';
import { SearchFormOptions } from '@yext/components-search-form';
import { SpinnerModal } from '@yext/components-spinner-modal';
import { FilterModal } from './FilterModal.js';

// GENERATOR TODO: Split Ace, Chaz, and Dill composers into their own files to reduce unused imports
import * as Ace from './Ace.js';
import * as Chaz from './Chaz.js';
import * as Dill from './Dill.js';

import {
  PinClickEvent,
  PinFocusEvent,
  PinHoverEvent,
  CardClickEvent,
  CardFocusEvent,
  CardHoverEvent,
  MapMoveEvent
} from './Events.js';

import { cobalt__locator__cobalt_results } from 'templates/components/Cobalt/Locator/Locator.soy';
import { cobalt__locator__dill_results } from 'templates/components/Cobalt/Locator/Dill.soy';
import {
  strings__geolocateErrorMsg,
  strings__geolocateQueryText
} from 'templates/common/strings.soy';
import {
  common__modules__Pin_default,
  common__modules__Pin_hovered,
  common__modules__Pin_selected
} from 'templates/common/modules/MapPin.soy';
import { geolocate, defaultAutocompleteServiceOptions } from './common.js';

class Composer {
  static CobaltBase({
    scope = document,
    formEl = document.getElementById('search-form'),
    inputEl = scope.querySelector('.js-locator-input'),
    spinner = new SpinnerModal(),
    geolocateButton = formEl.querySelector('.js-locator-geolocateTrigger'),
    geolocateQueryText = strings__geolocateQueryText(),
    geolocateErrorMsg = strings__geolocateErrorMsg(),
    filtersEl = document.getElementById('filters'),
    externalInputs = filtersEl
      ? filtersEl.querySelectorAll('input, select')
      : [],
    filterModalOpenEl = document.getElementById('js-filters-open'),
    templateDataEl = scope.querySelector('.js-locator-params'),
    searchForm = new SearchFormOptions(formEl, inputEl)
      .withExternalInputs(externalInputs)
      .build(),
    elementRenderTargets = [],
    getAllResults = false,
    breakPoint = 992,
    mapProvider,
    mapWrapper = document.getElementById('dir-map'),
    map = new MapOptions()
      .withProvider(mapProvider)
      .withWrapper(mapWrapper)
      .build(),
    animateMap = false,
    panHandler = (previousBounds, currentBounds) => {},
    iconsForEntity = (entity, index) => ({
      default: common__modules__Pin_default({ ...entity, index }),
      hovered: common__modules__Pin_hovered({ ...entity, index }),
      selected: common__modules__Pin_selected({ ...entity, index })
    }),
    hideOffscreenPins = false,
    pinBuilder = (pinOptions, entity, index) => {
      Object.entries(iconsForEntity(entity, index)).forEach(([name, icon]) =>
        pinOptions.withIcon(name, icon)
      );
      pinOptions.withHideOffscreen(hideOffscreenPins);
      return Ace.buildPin(pinOptions, entity, index, scope);
    },
    pinClusterer = null, // instance of PinClusterer component
    pinClickHandler = (e) => {},
    pinFocusHandler = (e) => {},
    pinHoverHandler = (e) => {},
    cardClickHandler = pinClickHandler,
    cardFocusHandler = pinFocusHandler,
    cardHoverHandler = pinHoverHandler,
    mapRenderCallback = (data, map, pins) => {},
    renderer = new RendererOptions().build(),
    disableAutocomplete = false,
    autocompleteServiceOptions = disableAutocomplete
      ? null
      : defaultAutocompleteServiceOptions(mapProvider),
    beforeSubmit = async () => {},
    responseDataPreprocessor = async (data) => data,
    submitCallback = (data) => {},
    blurInputOnSubmit = true,
    finalHandler = () => {}
  } = {}) {
    // Set up spinner
    formEl.addEventListener('submit', spinner.showSpinner.bind(spinner));

    // Set up geolocate button
    if (geolocateButton) {
      geolocateButton.addEventListener('click', () => {
        geolocate(searchForm, geolocateQueryText, geolocateErrorMsg, spinner);
      });
    }

    // Set up filters modal
    if (filtersEl && filterModalOpenEl) {
      const filterModal = new FilterModal(
        filtersEl,
        filterModalOpenEl,
        searchForm
      );
      formEl.addEventListener(
        'submit',
        filterModal.updateFilterCount.bind(filterModal)
      );
    }

    // Set up pan handler and map move event
    map.setPanHandler((previousBounds, currentBounds) => {
      scope.dispatchEvent(
        new MapMoveEvent(mapWrapper.id, previousBounds, currentBounds)
      );
      panHandler(previousBounds, currentBounds);
    });

    // Register render targets
    const mapRenderTargetOptions = new MapRenderTargetOptions()
      .withAnimateMap(animateMap)
      .withMap(map)
      .withOnPostRender((data, map) =>
        mapRenderCallback(data, map, mapRenderTarget.getPins())
      )
      .withPinBuilder(pinBuilder);

    if (pinClusterer) {
      mapRenderTargetOptions.withPinClusterer(pinClusterer);
    }

    const mapRenderTarget = mapRenderTargetOptions.build();

    elementRenderTargets.forEach((target) => renderer.register(target));
    renderer.register(mapRenderTarget);

    // Add pin and result card event listeners
    const selections = { card: null, pin: null };
    const eventHandlers = {
      [PinClickEvent.eventTypeName]: pinClickHandler,
      [PinFocusEvent.eventTypeName]: pinFocusHandler,
      [PinHoverEvent.eventTypeName]: pinHoverHandler,
      [CardClickEvent.eventTypeName]: cardClickHandler,
      [CardFocusEvent.eventTypeName]: cardFocusHandler,
      [CardHoverEvent.eventTypeName]: cardHoverHandler
    };

    for (const eventName in eventHandlers) {
      scope.addEventListener(eventName, (e) => {
        e.detail.pin = mapRenderTarget.getPins()[e.detail.id];
        e.detail.selections = selections;
        eventHandlers[eventName](e);
      });
    }

    // Build locator
    const locatorOptions = new MaestroOptions(searchForm)
      .withRenderer(renderer)
      .withTemplateData(
        templateDataEl ? JSON.parse(templateDataEl.innerHTML) : {}
      )
      .withBeforeSubmit(beforeSubmit)
      .withDataPreprocessor(responseDataPreprocessor)
      .withSubmitCallback((data) => {
        // Closes keyboard on mobile devices
        if (blurInputOnSubmit) {
          inputEl.blur();
        }
        submitCallback(data);
      })
      .withFinalHandler(() => {
        spinner.hideSpinner();
        finalHandler();
      });

    // Set up Autocomplete
    if (!disableAutocomplete && autocompleteServiceOptions) {
      const autocomplete = new AutocompleteOptions(searchForm)
        .withAutocompleteServiceOptions(autocompleteServiceOptions)
        .build();

      locatorOptions.withBeforeSubmit(async () =>
        autocomplete.updateQueryType().then(beforeSubmit)
      );
    }

    let maestro = locatorOptions.build();

    if (getAllResults) {
      const searchURL = `${formEl.action}?${searchForm.buildQuery(true, [
        { name: 'per', value: '50' }
      ])}`;
      Oracle.search(searchURL)
        .then((data) =>
          Oracle.getAllResults(Object.assign(data, { searchURL }))
        )
        .then((data) => renderer.render(data));
    }

    return maestro;
  }

  static CobaltAce({
    scope = document,
    resultsContainer = scope.querySelector('.js-locator-resultsContainer'),
    elementRenderCallback = (data, element) => {},
    mapRenderCallback = (data, map) => {},
    useReSearchButton = false,
    reSearchButton = scope.querySelector('.js-pan-button'),
    reSearchDistanceThreshold = 5,
    cobaltBaseOpts = {}
  } = {}) {
    if (useReSearchButton && reSearchButton) {
      const mapRenderCallbackArg = mapRenderCallback;
      mapRenderCallback = (data, map) => {
        reSearchButton.classList.add('is-hidden');
        reSearchButton.origin = map.getCenter();
        mapRenderCallbackArg(data, map);
      };
    }

    const locator = Composer.CobaltBase({
      scope,
      elementRenderTargets: [
        new ElementRenderTargetOptions()
          .withElement(resultsContainer)
          .withTemplateFunction(cobalt__locator__cobalt_results)
          .withOnPostRender((data, element) => {
            Hours.loadAndRun({ scope: element });

            for (const resultCard of element.querySelectorAll(
              '.js-location-result'
            )) {
              const id = resultCard.id;

              resultCard.addEventListener('click', () =>
                scope.dispatchEvent(new CardClickEvent(id))
              );
              resultCard.addEventListener('focusin', () =>
                scope.dispatchEvent(new CardFocusEvent(id, true))
              );
              resultCard.addEventListener('focusout', () =>
                scope.dispatchEvent(new CardFocusEvent(id, false))
              );
              resultCard.addEventListener('mouseover', () =>
                scope.dispatchEvent(new CardHoverEvent(id, true))
              );
              resultCard.addEventListener('mouseout', () =>
                scope.dispatchEvent(new CardHoverEvent(id, false))
              );
            }

            elementRenderCallback(data, element);
          })
          .build()
      ],
      pinClickHandler: Ace.pinClickHandler,
      pinFocusHandler: Ace.pinFocusHandler,
      pinHoverHandler: Ace.pinHoverHandler,
      cardClickHandler: Ace.cardClickHandler,
      mapRenderCallback,
      ...cobaltBaseOpts
    });

    if (useReSearchButton && reSearchButton) {
      let currentBounds;

      scope.addEventListener(MapMoveEvent.eventTypeName, (e) => {
        Ace.reSearchController(e, reSearchButton, reSearchDistanceThreshold);
        currentBounds = e.detail.currentBounds;
      });

      reSearchButton.addEventListener('click', () => {
        locator
          .getSearchForm()
          .searchByGeocode('', currentBounds.getCenter().searchQueryString());
        locator.submit();
      });
    }

    return locator;
  }

  static CobaltChaz({ cobaltBaseOpts = {}, ...aceOpts } = {}) {
    // Polyfill for sticky positioning in IE11
    Stickyfill.add(document.querySelectorAll('.js-sticky'));

    return this.CobaltAce({
      cobaltBaseOpts: {
        pinClickHandler: Chaz.pinClickHandler,
        ...cobaltBaseOpts
      },
      ...aceOpts
    });
  }

  static CobaltDill({
    scope = document,
    resultsContainer = scope.querySelector('.js-locator-resultsContainer'),
    breakPoint = 992,
    mobileMapHeight = '33.333%',
    mapProvider,
    mapWrapper = document.getElementById('dir-map'),
    mapOptions = new MapOptions()
      .withProvider(mapProvider)
      .withWrapper(mapWrapper)
      .withPadding({
        bottom: 50,
        left: () =>
          50 +
          (window.innerWidth < breakPoint
            ? 0
            : scope.querySelector('.js-locator-contentWrap').offsetWidth),
        right: 50,
        top: 50
      }),
    mapControlsResults = false,
    panHandler = mapControlsResults
      ? Dill.panHandler
      : (previousBounds, currentBounds) => {},
    pinClickHandler = Ace.pinClickHandler,
    pinFocusHandler = Ace.pinFocusHandler,
    pinHoverHandler = Ace.pinHoverHandler,
    cobaltBaseOpts = {}
  } = {}) {
    const locatorEl = document.getElementById('js-locator');
    const mobileToggles = locatorEl.querySelector('.js-locator-mobiletoggles');
    const listToggle = mobileToggles.querySelector('.js-locator-listToggle');

    let currentData = {};
    let elementRenderTarget;

    const map = mapOptions
      .withPanHandler((previousBounds, currentBounds) =>
        panHandler(
          previousBounds,
          currentBounds,
          currentData,
          elementRenderTarget,
          breakPoint
        )
      )
      .build();

    elementRenderTarget = new ElementRenderTargetOptions()
      .withElement(resultsContainer)
      .withTemplateFunction(cobalt__locator__dill_results)
      .withOnPostRender((data, element) => {
        let showToggles = false;

        if (!data.detailEntity) {
          scope.dispatchEvent(new PinClickEvent()); // Unhighlight any currently highlighted pin

          if (window.innerWidth < breakPoint) {
            // Reshow all pins on mobile
            map.fitCoordinates(
              ((data.response || {}).entities || []).map(
                (entity) => new Coordinate(entity.profile.yextDisplayCoordinate)
              )
            );
          }
          if (
            data.response &&
            data.response.entities &&
            data.response.entities.length
          ) {
            showToggles = true;
            for (const entity of data.response.entities) {
              const id = 'js-yl-' + entity.profile.meta.id;
              const resultCard = document.getElementById(id);
              if (resultCard) {
                resultCard.addEventListener('click', () =>
                  scope.dispatchEvent(new CardClickEvent(id))
                );
                resultCard.addEventListener('focusin', () =>
                  scope.dispatchEvent(new CardFocusEvent(id, true))
                );
                resultCard.addEventListener('focusout', () =>
                  scope.dispatchEvent(new CardFocusEvent(id, false))
                );
                resultCard.addEventListener('mouseover', () =>
                  scope.dispatchEvent(new CardHoverEvent(id, true))
                );
                resultCard.addEventListener('mouseout', () =>
                  scope.dispatchEvent(new CardHoverEvent(id, false))
                );
              }
            }
          }
          locatorEl.classList.remove('Locator--detailShown');
          locatorEl.classList.add('Locator--listShown');
        } else {
          locatorEl.classList.add('Locator--detailShown');
          locatorEl.classList.remove('Locator--listShown');

          const closeButton = locatorEl.querySelector(
            '.js-locator-detailClose'
          );
          closeButton.addEventListener('click', async () => {
            currentData.detailEntity = null;
            await elementRenderTarget.render(currentData);
          });
        }

        if (showToggles) {
          mobileToggles.classList.add('Locator-mobileToggles--shown');
          if (!listToggle.dataset.listened) {
            listToggle.dataset.listened = 'true';
            listToggle.addEventListener('click', () => {
              locatorEl.classList.toggle('Locator--listShown');
              locatorEl.classList.remove('Locator--detailShown');
            });
          }
        } else {
          mobileToggles.classList.remove('Locator-mobileToggles--shown');
        }

        Hours.loadAndRun({ scope: element });
      })
      .build();

    async function openDetail(e) {
      if (
        e.detail.id &&
        currentData.response &&
        currentData.response.entities
      ) {
        for (const entity of currentData.response.entities) {
          if ('js-yl-' + entity.profile.meta.id === e.detail.id) {
            currentData.detailEntity = entity;
            scope.dispatchEvent(
              new CardHoverEvent(e.detail.id, { hovered: false })
            );
            await elementRenderTarget.render(currentData);

            if (window.innerWidth < breakPoint) {
              map.fitCoordinates([
                new Coordinate(entity.profile.yextDisplayCoordinate)
              ]);
            }

            break;
          }
        }
      }
    }

    document.addEventListener(PinClickEvent.eventTypeName, openDetail);
    document.addEventListener(CardClickEvent.eventTypeName, openDetail);

    const resultsWrapper = locatorEl.querySelector(
      '.js-locator-resultsWrapper'
    );
    if (resultsWrapper && window.innerWidth < breakPoint) {
      let touchStart;
      let dist = 0;
      resultsWrapper.addEventListener('touchstart', (e) => {
        if (locatorEl.classList.contains('Locator--detailShown')) {
          resultsWrapper.classList.add('Locator-resultsWrapper--moving');
          dist = 0;
          touchStart = e.touches[0];
        }
      });

      resultsWrapper.addEventListener('touchmove', (e) => {
        if (
          locatorEl.classList.contains('Locator--detailShown') &&
          e.touches[0] &&
          touchStart
        ) {
          dist = touchStart.pageY - e.touches[0].pageY;
          if (dist > 0 && resultsWrapper.style.top !== '0px') {
            resultsWrapper.style.top = `calc(${mobileMapHeight} - ${dist}px)`;
          }
        } else {
          dist = 0;
          touchStart = null;
        }
      });

      resultsWrapper.addEventListener('touchend', (e) => {
        if (locatorEl.classList.contains('Locator--detailShown')) {
          resultsWrapper.classList.remove('Locator-resultsWrapper--moving');
          if (dist > resultsWrapper.clientHeight / 10) {
            resultsWrapper.style.top = '0';
          } else if (dist > 0 && resultsWrapper.style.top !== '0px') {
            resultsWrapper.style.top = '';
          } else if (dist <= 0 && resultsWrapper.scrollTop === 0) {
            resultsWrapper.style.top = '';
          }
          touchStart = null;

          if (Math.abs(dist) > 5) {
            // if it isn't just a tap
            e.preventDefault();
          }
        }
      });
    }

    return Composer.CobaltBase({
      elementRenderTargets: [elementRenderTarget],
      getAllResults: true,
      breakPoint,
      mapProvider,
      mapWrapper,
      map,
      mapRenderCallback: (data) => (currentData = data),
      pinClickHandler,
      pinFocusHandler,
      pinHoverHandler,
      ...cobaltBaseOpts
    });
  }
}

export { Composer };
