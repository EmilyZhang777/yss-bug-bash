import { Coordinate } from '@yext/components-geo';
import { PinProperties } from '@yext/components-maps';
import { smoothScroll } from '@yext/components-util';
import { PinClickEvent, PinFocusEvent, PinHoverEvent } from './Events.js';

/** @namespace CobaltAce */

/**
 * @memberof CobaltAce
 * @param {Object} status A generic object whose properties define the state of the pin, from {@link MapPin#setStatus}
 * @param {Object} entity The Yext entity associated with this pin
 * @param {number} index The position of the entity in the results list, starting at 1
 * @returns {PinProperties}
 * @see MapPin~propertiesForStatus
 */
function pinPropertiesForStatus(status, entity, index) {
  return new PinProperties()
    .setIcon(
      status.selected
        ? 'selected'
        : status.hovered || status.focused
        ? 'hovered'
        : 'default'
    )
    .setSRText(index)
    .setZIndex(status.selected ? 1 : status.hovered || status.focused ? 2 : 0);
}

/**
 * Build a {@link MapPin} for the given entity to be added to a locator map
 * @memberof CobaltAce
 * @param {MapPinOptions} pinOptions A MapPinOptions instance with its provider set to the same as the {@link Map} it's being built for.
 * @param {Object} entity The Yext entity associated with this pin
 * @param {number} index The position of the entity in the results list, starting at 1
 * @param {HTMLElement} [scope=document] The element to dispatch events to
 * @param {MapPin~propertiesForStatus} [propertiesForStatus=pinPropertiesForStatus] The pin's propertiesForStatus function
 * @returns {MapPin}
 */
function buildPin(
  pinOptions,
  entity,
  index,
  scope = document,
  propertiesForStatus = pinPropertiesForStatus
) {
  const pin = pinOptions
    .withCoordinate(new Coordinate(entity.profile.yextDisplayCoordinate))
    .withPropertiesForStatus((status) =>
      propertiesForStatus(status, entity, index)
    )
    .build();

  const id = 'js-yl-' + entity.profile.meta.id;

  pin.setClickHandler(() => scope.dispatchEvent(new PinClickEvent(id)));
  pin.setFocusHandler((focused) =>
    scope.dispatchEvent(new PinFocusEvent(id, focused))
  );
  pin.setHoverHandler((hovered) =>
    scope.dispatchEvent(new PinHoverEvent(id, hovered))
  );

  return pin;
}

/**
 * @memberof CobaltAce
 * @param {PinClickEvent} e
 * @param {Object} e.detail
 * @param {?string} e.detail.id The id for the result card element associated with the clicked pin
 * @param {?MapPin} e.detail.pin The clicked pin
 * @param {?Object} e.detail.selections
 * @param {?HTMLElement} e.detail.selections.card The currently selected result card
 * @param {?MapPin} e.detail.selections.pin The currently selected pin
 */
function pinClickHandler(e) {
  const selections = e.detail.selections || {};

  if (selections.pin && selections.pin != e.detail.pin) {
    selections.pin.setStatus({ selected: false });
  }

  if (e.detail.pin) {
    e.detail.pin.setStatus({ selected: true });
    selections.pin = e.detail.pin;
  }

  const resultCard = document.getElementById(e.detail.id);

  if (selections.card && selections.card != resultCard) {
    selections.card.classList.remove('is-selected');
  }

  if (resultCard) {
    resultCard.classList.add('is-selected');
    scrollToResult(resultCard);
  }

  selections.card = resultCard;
}

/**
 * @memberof CobaltAce
 * @param {PinClickEvent} e
 * @param {Object} e.detail
 * @param {?string} e.detail.id The id for the result card element associated with the clicked pin
 * @param {?MapPin} e.detail.pin The clicked pin
 * @param {?Object} e.detail.selections
 * @param {?HTMLElement} e.detail.selections.card The currently selected result card
 * @param {?MapPin} e.detail.selections.pin The currently selected pin
 */
function cardClickHandler(e) {
  const pin = e.detail.pin;
  if (pin) {
    const map = pin.getMap();
    const pinCoord = pin.getCoordinate();

    // only pan if the pin isn't already visible on the map
    if (map && pinCoord && !map.getBounds().contains(pinCoord)) {
      map.setCenter(pinCoord, true);
    }
  }

  pinClickHandler(e);
}

/**
 * @memberof CobaltAce
 * @param {PinFocusEvent} e
 * @param {Object} e.detail
 * @param {boolean} e.detail.focused true if the pin is gaining focus, false if losing focus
 * @param {?string} e.detail.id The id for the result card element associated with the focused pin
 * @param {?MapPin} e.detail.pin The focused pin
 */
function pinFocusHandler(e) {
  if (e.detail.pin) {
    e.detail.pin.setStatus({ focused: e.detail.focused });
  }

  const resultCard = document.getElementById(e.detail.id);

  if (resultCard) {
    resultCard.classList[e.detail.focused ? 'add' : 'remove']('is-focused');
  }
}

/**
 * @memberof CobaltAce
 * @param {PinHoverEvent} e
 * @param {Object} e.detail
 * @param {boolean} e.detail.hovered true if the pin has become hovered, false if it has become unhovered
 * @param {?string} e.detail.id The id for the result card element associated with the hovered pin
 * @param {?MapPin} e.detail.pin The hovered pin
 */
function pinHoverHandler(e) {
  if (e.detail.pin) {
    e.detail.pin.setStatus({ hovered: e.detail.hovered });
  }

  const resultCard = document.getElementById(e.detail.id);

  if (resultCard) {
    resultCard.classList[e.detail.hovered ? 'add' : 'remove']('is-hovered');
  }
}

/**
 * Handler for map move events that determines whether to show the re-search button
 * @memberof CobaltAce
 * @param {MapMoveEvent} e
 * @param {Object} e.detail
 * @param {?GeoBounds} e.detail.previousBounds
 * @param {?GeoBounds} e.detail.currentBounds
 * @param {HTMLElement} reSearchButton The re-search button
 * @param {number} [distanceThreshold=5] The distance in miles the map has to move before the button is shown
 */
function reSearchController(e, reSearchButton, distanceThreshold = 5) {
  if (
    (reSearchButton.origin || e.detail.previousBounds) &&
    e.detail.currentBounds
  ) {
    reSearchButton.origin =
      reSearchButton.origin || e.detail.previousBounds.getCenter();
    const currentCenter = e.detail.currentBounds.getCenter();

    if (reSearchButton.origin.distanceTo(currentCenter) >= distanceThreshold) {
      reSearchButton.classList.remove('is-hidden');
    }
  }
}

/**
 * Scroll the result list to show the given element
 * @memberof CobaltAce
 * @inner
 * @param {HTMLElement} targetEl The result card to scroll to
 */
function scrollToResult(targetEl) {
  const isIE11 = !!(window.MSInputMethodContext && document.documentMode);
  const stickyHeight = isIE11
    ? 0
    : document.querySelector('.Locator-searchWrapper').offsetHeight;

  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;

  const container = document.querySelector('.Locator-content');
  const elTop = targetEl.offsetTop - container.scrollTop;
  const elBottom = elTop + targetEl.offsetHeight;
  const isScrolledIntoView =
    elTop >= stickyHeight && elBottom <= container.offsetHeight - headerHeight;

  if (!isScrolledIntoView) {
    smoothScroll(container, elTop - stickyHeight, 400);
  }
}

export {
  pinPropertiesForStatus,
  buildPin,
  pinClickHandler,
  pinFocusHandler,
  pinHoverHandler,
  cardClickHandler,
  reSearchController
};
