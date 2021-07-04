import { smoothScroll } from '@yext/components-util';

/** @namespace CobaltChaz */

/**
 * @memberof CobaltChaz
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

  e.detail.pin.setStatus({ selected: true });
  selections.pin = e.detail.pin;

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
 * Scroll the result list to show the given element
 * @memberof CobaltChaz
 * @inner
 * @param {HTMLElement} targetEl The result card to scroll to
 */
function scrollToResult(targetEl) {
  const isIE11 = !!(window.MSInputMethodContext && document.documentMode);
  const stickyHeight = isIE11
    ? 0
    : document.querySelector('.Locator-searchWrapper').offsetHeight;

  const isOffTop = targetEl.getBoundingClientRect().top < stickyHeight;
  const isOffBottom =
    targetEl.getBoundingClientRect().bottom > window.innerHeight;

  if (isOffTop || isOffBottom) {
    smoothScroll(
      document.documentElement,
      targetEl.getBoundingClientRect().top - stickyHeight,
      400
    );
  }
}

export { pinClickHandler };
