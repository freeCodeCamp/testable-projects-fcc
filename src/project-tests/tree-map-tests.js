import $ from 'jquery';
import { getToolTipStatus, getRandomIndex } from '../assets/globalD3Tests';

export default function createTreeMapTests() {

    describe('#TreeMapTests', function() {

        describe('#Content', function() {
            it('1. My tree map should have a title with a corresponding id="title"', function() {
                FCC_Global.assert.isNotNull(document.getElementById('title'), 'Could not find element with id="title" ');
            });
            it('2. My tree map should have a description with a corresponding id="description"', function() {
                FCC_Global.assert.isNotNull(document.getElementById('description'), 'Could not find element with id="description" ');
            });
            it('3. My tree map should have <rect> elements with a corresponding class="tile" that represent the data', function() {
                FCC_Global.assert.isAbove(document.querySelectorAll('.tile').length, 0, 'Could not find elements with class="tile" ');
            });
            it('4. There should be at least 2 different fill colors used for the tiles', function(){
              const tiles = document.querySelectorAll('.tile');
              var uniqueColors = [];
            
              for(var i = 0; i < tiles.length; i++) {
                var tileColor = tiles[i].style.fill || tiles[i].getAttribute('fill');
                
                // if the current color isn't in the uniqueColors arr, push it 
                if(uniqueColors.indexOf(tileColor) === -1){
                   uniqueColors.push(tileColor);
                }
              } 
              FCC_Global.assert.isAtLeast(uniqueColors.length, 2, 'There should be more than two fill colors used for the tiles');
            })
            it('5. Each tile should have the properties "data-name", "data-category",  and "data-value" containing their corresponding name, category, and value', function(){
              const tiles = document.querySelectorAll('.tile');
              FCC_Global.assert.isAbove(tiles.length, 0, "Could not find any elements with a class=\"tile\"");

              for(var i=0; i<tiles.length; i++){
                var tile = tiles[i];
                FCC_Global.assert.isNotNull(tile.getAttribute("data-name"), "Could not find property 'data-name' in tile")
                FCC_Global.assert.isNotNull(tile.getAttribute("data-category"), "Could not find property 'data-category' in tile")
                FCC_Global.assert.isNotNull(tile.getAttribute("data-value"), "Could not find property 'data-value' in tile")
              }
            })
            it('6.  The area of each tile should correspond to the data-value amount', function(){
              const tilesCollection = document.querySelectorAll('.tile');
              FCC_Global.assert.isAbove(tilesCollection.length, 0, "Could not find any elements with a class=\"tile\"");
              
              const tiles = [].slice.call(tilesCollection);
              
              // group tiles by category
              var tilesByCategory = {};
              for(var j = 1; j < tiles.length; j++) {    
                var category = tiles[j].getAttribute('data-category');
                if(!tilesByCategory[category]){
                  tilesByCategory[category] = [];
                }
                tilesByCategory[category].push(tiles[j]);  
              }
              
              tilesByCategory = Object.values(tilesByCategory);
                            
              // sort each category array by value
              tilesByCategory.forEach(category => {
                category.sort(function(tile1,tile2){
                  var tile1Value = tile1.getAttribute('data-value');
                  var tile2Value = tile2.getAttribute('data-value');
                  return tile1Value - tile2Value
                })
              })
              
              // outer loop loops through array category arrays
              for(var k = 0; k < tilesByCategory.length; k++) {
                if(tilesByCategory[k].length > 1) {
                  // loops through each item in playfrom array
                  for(var i=0; i<tilesByCategory[k].length - 1; i++){
                    var firstTile = +tilesByCategory[k][i].getAttribute("data-value");
                    var secondTile = +tilesByCategory[k][i + 1].getAttribute("data-value");

                    FCC_Global.assert.isAtMost(firstTile, secondTile, "data-value property does not match tile area")
                  }
                }
              }
            })
            it('7. My tree map should have a legend with corresponding id="legend"', function() {
              FCC_Global.assert.isNotNull(document.getElementById('legend'), 'Could not find element with id="legend" ');
            });
            it('8. The legend should have items which use at least 2 different fill colors', function() {
                FCC_Global.assert.isNotNull(document.getElementById('legend'), 'Could not find element with id="legend" ');

                // get all children of the legend to gather their color data
                const legendItems = document.querySelector('#legend').querySelectorAll('*');
                var uniqueColors = [];

                for (var i = 0; i < legendItems.length; i++) {
                    var legendItemColors = legendItems[i].style.fill || legendItems[i].getAttribute('fill');

                    // if the current color isn't in the uniqueColors arr, push it 
                    if (uniqueColors.indexOf(legendItemColors) === -1) {
                        uniqueColors.push(legendItemColors);
                    }
                }

                FCC_Global.assert.isAtLeast(uniqueColors.length, 2, 'There should be at least two fill colors used for the legend ');
            })
            it('9. I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area ', function(){

              const firstRequestTimeout = 100;
              const secondRequestTimeout = 2000;
              this.timeout(firstRequestTimeout + secondRequestTimeout + 1000);
              FCC_Global.assert.isNotNull(document.getElementById('tooltip'), 'There should be an element with id="tooltip"');

              const tooltip = document.getElementById('tooltip');

              const tiles = document.querySelectorAll('.tile');

              // place mouse on random bar and check if tooltip is visible
              const randomIndex = getRandomIndex(tiles.length);
              var randomTile = tiles[randomIndex];
              randomTile.dispatchEvent(new MouseEvent('mouseover'));
              randomTile.dispatchEvent(new MouseEvent('mousemove'));
              randomTile.dispatchEvent(new MouseEvent('mouseenter'));

              // promise is used to prevent test from ending prematurely
              return new Promise((resolve, reject) => {
                // timeout is used to accomodate tooltip transitions
                setTimeout( _ => {
                  if(getToolTipStatus(tooltip) !== 'visible') {
                    reject(new Error('Tooltip should be visible when mouse is on an area'))
                  }

                  // remove mouse from cell and check if tooltip is hidden again
                  randomTile.dispatchEvent(new MouseEvent('mouseout'));
                  setTimeout( _ => {
                    if(getToolTipStatus(tooltip) !== 'hidden') {
                      reject(new Error('Tooltip should be hidden when mouse is not on an area'))
                    } else {
                      resolve()
                    }
                  }, secondRequestTimeout)
                }, firstRequestTimeout)
              })
            })
            it('10. My tooltip should have a "data-value" property that corresponds to the given value of the active tile.', function() {
                const tooltip = document.getElementById('tooltip');
                FCC_Global.assert.isNotNull(tooltip.getAttribute("data-value"), 'Could not find property "data-value" in tooltip ');
                const tiles = document.querySelectorAll('.tile');
                const randomIndex = getRandomIndex(tiles.length);

                var randomTile = tiles[randomIndex];

                randomTile.dispatchEvent(new MouseEvent('mouseover'));
                randomTile.dispatchEvent(new MouseEvent('mousemove'));
                randomTile.dispatchEvent(new MouseEvent('mouseenter'));
                FCC_Global.assert.equal(tooltip.getAttribute('data-value'), randomTile.getAttribute('data-value'), 'Tooltip\'s \"data-value\" property should be equal to the active tiles\'s \"data-value\" property');
                
                //clear out tooltip
                randomTile.dispatchEvent(new MouseEvent('mouseout'));
            })
        });
    });
}
