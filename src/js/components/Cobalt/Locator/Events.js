class LocatorEvent {
  /**
   * @param {string} id
   * @param {Object} [opts={}] Additional options to be assigned to e.detail
   */
  constructor(id, opts = {}) {
    const detail = { id, ...opts };
    return new CustomEvent(this.constructor.eventTypeName, { detail });
  }
}

/**
 * @augments LocatorEvent
 */
class PinClickEvent extends LocatorEvent {
  /**
   * @constant {string}
   * @default 'pin-click'
   */
  static get eventTypeName() {
    return 'pin-click';
  }

  /**
   * @param {string} id The locator ID of the pin, typically 'js-yl-' + entity.profile.id
   */
  constructor(id) {
    super(id);
  }
}

/**
 * @augments LocatorEvent
 */
class PinFocusEvent extends LocatorEvent {
  /**
   * @constant {string}
   * @default 'pin-focus'
   */
  static get eventTypeName() {
    return 'pin-focus';
  }

  /**
   * @param {string} id The locator ID of the pin, typically 'js-yl-' + entity.profile.id
   * @param {boolean} [focused=false] true if the pin is gaining focus, false if losing focus
   */
  constructor(id, focused = false) {
    super(id, { focused });
  }
}

/**
 * @augments LocatorEvent
 */
class PinHoverEvent extends LocatorEvent {
  /**
   * @constant {string}
   * @default 'pin-hover'
   */
  static get eventTypeName() {
    return 'pin-hover';
  }

  /**
   * @param {string} id The locator ID of the pin, typically 'js-yl-' + entity.profile.id
   * @param {boolean} [hovered=false] true if the pin has become hovered, false if it has become unhovered
   */
  constructor(id, hovered = false) {
    super(id, { hovered });
  }
}

/**
 * @augments LocatorEvent
 */
class CardClickEvent extends LocatorEvent {
  /**
   * @constant {string}
   * @default 'card-click'
   */
  static get eventTypeName() {
    return 'card-click';
  }

  /**
   * @param {string} id The locator ID of the result card, typically 'js-yl-' + entity.profile.id
   */
  constructor(id) {
    super(id);
  }
}

/**
 * @augments LocatorEvent
 */
class CardFocusEvent extends LocatorEvent {
  /**
   * @constant {string}
   * @default 'card-focus'
   */
  static get eventTypeName() {
    return 'card-focus';
  }

  /**
   * @param {string} id The locator ID of the result card, typically 'js-yl-' + entity.profile.id
   * @param {boolean} [focused=false] true if the card is gaining focus, false if losing focus
   */
  constructor(id, focused = false) {
    super(id, { focused });
  }
}

/**
 * @augments LocatorEvent
 */
class CardHoverEvent extends LocatorEvent {
  /**
   * @constant {string}
   * @default 'card-hover'
   */
  static get eventTypeName() {
    return 'card-hover';
  }

  /**
   * @param {string} id The locator ID of the result card, typically 'js-yl-' + entity.profile.id
   * @param {boolean} [hovered=false] true if the card has become hovered, false if it has become unhovered
   */
  constructor(id, hovered = false) {
    super(id, { hovered });
  }
}

/**
 * @augments LocatorEvent
 */
class MapMoveEvent extends LocatorEvent {
  /**
   * @constant {string}
   * @default 'map-move'
   */
  static get eventTypeName() {
    return 'map-move';
  }

  /**
   * @param {string} id The ID of the map that moved
   * @param {?GeoBounds} previousBounds The map bounds before the move
   * @param {?GeoBounds} currentBounds The map bounds after the move
   */
  constructor(id, previousBounds, currentBounds) {
    super(id, { previousBounds, currentBounds });
  }
}

export {
  LocatorEvent,
  PinClickEvent,
  PinFocusEvent,
  PinHoverEvent,
  CardClickEvent,
  CardFocusEvent,
  CardHoverEvent,
  MapMoveEvent
};
