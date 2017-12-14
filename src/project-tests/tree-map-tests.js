import { assert } from 'chai';
import { testToolTip } from '../utils/global-D3-tests';

import { d3ProjectStack } from '../utils/shared-test-strings';
import { hasUniqueColorsCount } from '../utils/element-utils';

export default function createTreeMapTests() {

  describe('#TreeMapTests', function() {

    describe('#Technology Stack', function() {
      it(d3ProjectStack, function() {
        return true;
      });
    });

    describe('#Content', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. My tree map should have a title with a corresponding
      id="title"`,
      function() {
        assert.isNotNull(
          document.getElementById('title'),
          'Could not find element with id="title" '
        );
      });

      reqNum++;
      it(`${reqNum}. My tree map should have a description with a corresponding
      id="description"`,
      function() {
        assert.isNotNull(
          document.getElementById('description'),
          'Could not find element with id="description" '
        );
      });

      reqNum++;
      it(`${reqNum}. My tree map should have <rect> elements with a
      corresponding class="tile" that represent the data`,
      function() {
        assert.isAbove(
          document.querySelectorAll('rect.tile').length,
          0,
          'Could not find <rect> elements with class="tile" '
        );
      });

      reqNum++;
      it(`${reqNum}. There should be at least 2 different fill colors used for
      the tiles`,
      function() {
        const tiles = document.querySelectorAll('rect.tile');

        assert.isTrue(
          hasUniqueColorsCount(tiles, 2),
          'There should be two or more fill colors used for the tiles'
        );
      });

      reqNum++;
      it(`${reqNum}. Each tile should have the properties "data-name",
      "data-category",  and "data-value" containing their corresponding name,
      category, and value`,
      function() {
        const tiles = document.querySelectorAll('rect.tile');
        assert.isAbove(
          tiles.length,
          0,
          'Could not find any elements with a class="tile"'
        );

        tiles.forEach(tile => {
          assert.isNotNull(
            tile.getAttribute('data-name'),
            'Could not find property \'data-name\' in tile'
          );
          assert.isNotNull(
            tile.getAttribute('data-category'),
            'Could not find property \'data-category\' in tile'
          );
          assert.isNotNull(
            tile.getAttribute('data-value'),
            'Could not find property \'data-value\' in tile'
          );
        });

      });

      reqNum++;
      it(`${reqNum}.  The area of each tile should correspond to the data-value
      amount: tiles with a larger data-value should have a bigger area.`,
      function() {
        const tilesCollection = document.querySelectorAll('rect.tile');
        let category;
        let tilesByCategory = {};

        // Early error to prevent trying to iterate an empty list of tiles.
        assert.isAbove(tilesCollection.length,
          0,
          'Could not find any <rect> elements with a class="tile"'
        );

        // Convert to an array.
        const tiles = [].slice.call(tilesCollection);

        // Group tiles by category.
        tiles.forEach(tile => {
          category = tile.getAttribute('data-category');
          if (!tilesByCategory[category]) {
            tilesByCategory[category] = [];
          }
          tilesByCategory[category].push(tile);
        });

        // Sort the tiles within each category by data-value. Smaller values
        // will be first.
        for (let key in tilesByCategory) {
          // Skip inherited properties.
          if (Object.prototype.hasOwnProperty.call(tilesByCategory, key)) {
            category = tilesByCategory[key];

            category.sort(function(tile1, tile2) {
              var tile1Value = tile1.getAttribute('data-value');
              var tile2Value = tile2.getAttribute('data-value');
              return tile1Value - tile2Value;
            });
          }
        }

        // Now that tiles are sorted by value, make sure that every tile is
        // smaller in area than the one after it.
        for (let key in tilesByCategory) {
          if (Object.prototype.hasOwnProperty.call(tilesByCategory, key)) {
            // Cannot compare if there is only one tile.
            if (tilesByCategory[key].length > 1) {
              for (var m = 0; m < tilesByCategory[key].length - 1; m++) {
                let firstArea =
                  +tilesByCategory[key][m].getAttribute('width') *
                  +tilesByCategory[key][m].getAttribute('height');

                let secondArea =
                  +tilesByCategory[key][m + 1].getAttribute('width') *
                  +tilesByCategory[key][m + 1].getAttribute('height');

                assert.isAtMost(
                  firstArea,
                  secondArea,
                  'the relative data-value property does not match tile area'
                );
              }
            }
          }
        }
      });

      reqNum++;
      it(`${reqNum}. My tree map should have a legend with corresponding
      id="legend"`,
      function() {
        assert.isNotNull(
          document.getElementById('legend'),
          'Could not find element with id="legend" '
        );
      });

      reqNum++;
      it(`${reqNum}. My legend should have <rect> elements with a
      corresponding class="legend-item"`,
      function() {
        assert.isAbove(
          document.querySelectorAll('#legend rect.legend-item').length,
          0,
          'Could not find <rect> elements with class="legend-item" '
        );
      });

      reqNum++;
      it(`${reqNum}. The <rect> elements in the legend should use at least 2 
      different fill colors`,
      function() {
        const legendItems =
          document.querySelectorAll('#legend rect.legend-item');

        assert.isTrue(
          hasUniqueColorsCount(legendItems, 2),
          'There should be two or more fill colors used for the legend '
        );
      });
    });

    // Tooltip tests.
    testToolTip(document.querySelectorAll('.tile'), 'data-value', 'data-value');

  });
}
