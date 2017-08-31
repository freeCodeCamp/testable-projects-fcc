import { assert } from 'chai';
import { testToolTip } from '../assets/global-D3-tests';

export default function createTreeMapTests() {

  describe('#TreeMapTests', function() {
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
          document.querySelectorAll('.tile').length,
          0,
          'Could not find elements with class="tile" '
        );
      });

      reqNum++;
      it(`${reqNum}. There should be at least 2 different fill colors used for
      the tiles`,
      function() {
        const tiles = document.querySelectorAll('.tile');
        var uniqueColors = [];

        for (var i = 0; i < tiles.length; i++) {
          var tileColor = tiles[i].style.fill || tiles[i].getAttribute('fill');

          // If the current color isn't in the uniqueColors arr, push it.
          // TODO: Isn't this logic in another D3 test too? Maybe Choropleth?
          // We should put it in an external module if so.
          if (uniqueColors.indexOf(tileColor) === -1) {
            uniqueColors.push(tileColor);
          }
        }
        assert.isAtLeast(
          uniqueColors.length,
          2,
          'There should be more than two fill colors used for the tiles'
        );
      });

      reqNum++;
      it(`${reqNum}. Each tile should have the properties "data-name",
      "data-category",  and "data-value" containing their corresponding name,
      category, and value`,
      function() {
        const tiles = document.querySelectorAll('.tile');
        assert.isAbove(
          tiles.length,
          0,
          'Could not find any elements with a class="tile"'
        );

        for (var i = 0; i < tiles.length; i++) {
          var tile = tiles[i];
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
        }
      });

      reqNum++;
      it(`${reqNum}.  The area of each tile should correspond to the data-value
      amount`,
      function() {
        const tilesCollection = document.querySelectorAll('.tile');
        let category;

        assert.isAbove(tilesCollection.length,
          0,
          'Could not find any elements with a class="tile"'
        );

        const tiles = [].slice.call(tilesCollection);

        // Group tiles by category.
        var tilesByCategory = {};
        for (var j = 1; j < tiles.length; j++) {
          category = tiles[j].getAttribute('data-category');
          if (!tilesByCategory[category]) {
            tilesByCategory[category] = [];
          }
          tilesByCategory[category].push(tiles[j]);
        }

        // Sort tile values in each category.
        for (var i = 0; i < tilesByCategory.length; i++) {
          category = tilesByCategory[i];
          category.sort(function(tile1, tile2) {
            var tile1Value = tile1.getAttribute('data-value');
            var tile2Value = tile2.getAttribute('data-value');
            return tile1Value - tile2Value;
          });
        }

        // Outer loop loops through array category arrays.
        for (var k = 0; k < tilesByCategory.length; k++) {
          if (tilesByCategory[k].length > 1) {
            // Loops through each item in playfrom array.
            for (var m = 0; m < tilesByCategory[k].length - 1; m++) {
              var firstTile = +tilesByCategory[k][m].getAttribute('data-value');
              var secondTile =
                +tilesByCategory[k][m + 1].getAttribute('data-value');

              assert.isAtMost(
                firstTile,
                secondTile,
                'data-value property does not match tile area'
              );
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
      it(`${reqNum}. The legend should have items which use at least 2 different
      fill colors`,
      function() {
        assert.isNotNull(
          document.getElementById('legend'),
          'Could not find element with id="legend" '
        );

        // TODO: Isn't this logic in another D3 test too? Maybe Choropleth?
        // We should put it in an external module if so.
        // Get all children of the legend to gather their color data.
        const legendItems =
          document.querySelector('#legend').querySelectorAll('*');
        var uniqueColors = [];

        for (var i = 0; i < legendItems.length; i++) {
          var legendItemColors =
            legendItems[i].style.fill || legendItems[i].getAttribute('fill');

          // If the current color isn't in the uniqueColors arr, push it.
          if (uniqueColors.indexOf(legendItemColors) === -1) {
            uniqueColors.push(legendItemColors);
          }
        }

        assert.isAtLeast(
          uniqueColors.length,
          2,
          'There should be at least two fill colors used for the legend '
        );
      });
    });

    // Additional tests.
    testToolTip(document.querySelectorAll('.tile'), 'data-value', 'data-value');

  });
}
