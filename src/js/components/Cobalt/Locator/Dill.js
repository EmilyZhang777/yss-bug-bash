import { Coordinate } from '@yext/components-geo';

/** @namespace CobaltDill */

/**
 * Handler for map move events that changes what entities are displayed based on the current map bounds
 * @memberof CobaltDill
 * @param {GeoBounds} previousBounds The map bounds before the move
 * @param {GeoBounds} currentBounds The map bounds after the move
 * @param {Object} data A Yext search response object
 * @param {ElementRenderTarget} elementRenderTarget
 * @param {number} [breakPoint=992] The minimum screen width for the desktop breakpoint
 * @param {number} [distanceThreshold=0] The distance in miles the map has to move for this function to do anything
 */
function panHandler(
  previousBounds,
  currentBounds,
  data,
  elementRenderTarget,
  breakPoint = 992,
  distanceThreshold = 0
) {
  if (window.innerWidth >= breakPoint && data.response && previousBounds) {
    const previousCenter = previousBounds.getCenter();
    const currentCenter = currentBounds.getCenter();

    if (previousCenter.distanceTo(currentCenter) >= distanceThreshold) {
      data.originalEntities =
        data.originalEntities || data.response.entities || [];
      data.response.entities = data.originalEntities.filter(
        (entity) =>
          entity.profile.yextDisplayCoordinate &&
          currentBounds.contains(
            new Coordinate(entity.profile.yextDisplayCoordinate)
          )
      );

      elementRenderTarget.render(data);
    }
  }
}

export { panHandler };
