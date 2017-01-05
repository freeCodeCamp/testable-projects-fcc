import $ from 'jquery';
import householdIncomeData from '../data/household_income.json';
export default function createChoroplethTests() {

  // returns a random index number
  function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
  }

  describe('#ChoroplethTests', function() {

    describe('#Content', function() {

      it('1. My choropleth should have a title with a corresponding id="title"', function() {
        FCC_Global.assert.isNotNull(document.getElementById('title'), 'Could not find element with id="title"');
      })

      it('2. My choropleth should have a description with a corresponding id="description"', function() {
        FCC_Global.assert.isNotNull(document.getElementById('description'), 'Could not find element with id="description"');
      })
      it('3. My choropleth should have areas with a corresponding class="area" that represent the data', function() {
         FCC_Global.assert.isAbove(document.querySelectorAll('.area').length, 0, "Could not find any elements with class=\"area\"");
      })
      it('4. There should be at least 4 different fill colors used for the areas', function(){
        const areas = document.querySelectorAll('.area');
        var uniqueColors = [];

        for(var i = 0; i < areas.length; i++) {
          var areaColor = areas[i].style.fill || areas[i].getAttribute('fill');

          // if the current color isn't in the uniqueColors arr, push it
          if(uniqueColors.indexOf(areaColor) === -1){
             uniqueColors.push(areaColor);
          }
        }
        FCC_Global.assert.isAtLeast(uniqueColors.length, 4, 'There should be more than four fill colors used for the areas');
      })

      it('5. Each area will have the properties "data-fips" and "data-income" containing their corresponding fips and income values', function(){
        const areas = document.querySelectorAll('.area');
        FCC_Global.assert.isAbove(areas.length, 0, "Could not find any elements with a class=\"area\"");

        for(var i=0; i<areas.length; i++){
          var area = areas[i];
          FCC_Global.assert.isNotNull(area.getAttribute("data-fips"), "Could not find property 'data-fips' in area")
          FCC_Global.assert.isNotNull(area.getAttribute("data-income"), "Could not find property 'data-income' in area")
        }
      })

      it('6. My choropleth should have an area for each provided data point', function(){
        const areas = document.querySelectorAll('.area');

        // fix to match final data set
        FCC_Global.assert.equal(areas.length, 3142)
      })
      it('7.  The cells should have data-??? values that match the sample data', function(){
        const areas = document.querySelectorAll('.area');
        var uniqueFipsFromChoropleth = [];
        var incomesFromChoropleth = [];
        for(var i=0; i< areas.length; i++){
          var fips = areas[i].getAttribute('data-fips');  
          // if the current color isn't in the uniqueColors arr, push it 
          if(uniqueFipsFromChoropleth.indexOf(fips) === -1){
             uniqueFipsFromChoropleth.push(+fips);
             incomesFromChoropleth.push(areas[i].getAttribute('data-income'));
          }  
        }
        FCC_Global.assert.equal(uniqueFipsFromChoropleth.length, 3142, "Fips values should be unique")
    
        
        const householdIncomeDataFips = householdIncomeData.map((ele) => {
          return +ele['fips']
        })
              
        //check if the fips in the sample data exist on the choropleth
        for(var j = 0; j < householdIncomeDataFips.length; j++) {
          
          FCC_Global.assert.notEqual(uniqueFipsFromChoropleth.indexOf(+householdIncomeDataFips[j]), -1, "Choropleth does not contain all sample data fips")
        }
        
        //check if the fips from choropleth matches the right income
        for(var j = 0; j < uniqueFipsFromChoropleth.length; j++) {
          var fips = uniqueFipsFromChoropleth[j];
          var income = incomesFromChoropleth[j];
          var result = householdIncomeData.filter(function( data ) {
            return data.fips == fips;
          });
          
          if(result[0]){
            FCC_Global.assert.equal(result[0].household_income, income, "Income from choropleth does not match income from sample data")
          }
          else{
            console.log("fips from choropleth not found in sample data");
          }
        }
        
        // fix to match final data set
        //FCC_Global.assert.equal(areas.length, 3142)
      })
      it('9. My choropleth should have a legend with corresponding id="legend"', function(){
        FCC_Global.assert.isNotNull(document.getElementById('legend'), 'Could not find element with id="legend"');
      })
      it('9. There should be at least 4 different fill colors used for the legend', function(){
        const rects = document.querySelectorAll('#legend rect');
        var uniqueColors = [];
      
        for(var i = 0; i < rects.length; i++) {
          var areaColor = rects[i].style.fill || rects[i].getAttribute('fill');
          
          // if the current color isn't in the uniqueColors arr, push it 
          if(uniqueColors.indexOf(areaColor) === -1){
             uniqueColors.push(areaColor);
          }
        }
        FCC_Global.assert.isAtLeast(uniqueColors.length, 4, 'There should be at least four fill colors used for the legend');
      })
      

      it('10.  I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area ', function(){

        const firstRequestTimeout = 100;
        const secondRequestTimeout = 2000;
        this.timeout(firstRequestTimeout + secondRequestTimeout + 1000);
        FCC_Global.assert.isNotNull(document.getElementById('tooltip'), 'There should be an element with id="tooltip"');

        function getToolTipStatus(tooltip) {
          // jQuery's :hidden selector checks if the element or its parents have a display of none, a type of hidden, or height/width set to 0
          // if the element is hidden with opacity=0 or visibility=hidden, jQuery's :hidden will return false because it takes up space in the DOM
          // this test combines jQuery's :hidden with tests for opacity and visbility to cover most use cases (z-index and potentially others are not tested)
          if($(tooltip).is(':hidden') || tooltip.style.opacity === '0' || tooltip.style.visibility === 'hidden'){
            return 'hidden'
          } else {
            return 'visible'
          }
        }

        const tooltip = document.getElementById('tooltip');

        const areas = document.querySelectorAll('.area');

        // place mouse on random bar and check if tooltip is visible
        const randomIndex = getRandomIndex(areas.length);
        var randomArea = areas[randomIndex];
        randomArea.dispatchEvent(new MouseEvent('mouseover'));

        // promise is used to prevent test from ending prematurely
        return new Promise((resolve, reject) => {
          // timeout is used to accomodate tooltip transitions
          setTimeout( _ => {
            if(getToolTipStatus(tooltip) !== 'visible') {
              reject(new Error('Tooltip should be visible when mouse is on an area'))
            }

            // remove mouse from cell and check if tooltip is hidden again
            randomArea.dispatchEvent(new MouseEvent('mouseout'));
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
      it('11. My tooltip should have a \"data-income\" property that corresponds to the given income of the active area', function() {
        const tooltip = document.getElementById('tooltip');            
        FCC_Global.assert.isNotNull(tooltip.getAttribute("data-income"), 'Could not find property \"data-income\" in tooltip');

        const areas = document.querySelectorAll('.area');

        const randomIndex = getRandomIndex(areas.length);

        var randomArea = areas[randomIndex];        

        randomArea.dispatchEvent(new MouseEvent('mouseover'));

        FCC_Global.assert.equal(tooltip.getAttribute('data-income'), randomArea.getAttribute('data-income'), 'Tooltip\'s \"data-income\" property should be equal to the active areas\'s \"data-income\" property');
        
        //clear out tooltip
        randomArea.dispatchEvent(new MouseEvent('mouseoff'));
                
      })
//       1. My choropleth should have a title with a corresponding id="title"
//       2. My choropleth should have a description with a corresponding id="description"
//       3. My choropleth should have cells with a corresponding class="cell" that represent the data
//       4. There should be at least 4 different fill colors used for the cells
//       5. Each cell will have the properties "data-county", "data-state", "data-????" containing their corresponding county, state, and ??? values
//       6. My choropleth should have an area for each provided data point
//       6. The data-income" of each cell should be within the range of the data
//       7. My choropleth should have cells that align with the corresponding ??? - don’t know how to word this.  Need more tests to test accuracy of choropleth

//       7a. The cells should have data-??? values that match the sample data
//       7a. The cells should have data-??? values that match the sample data of that cell’s data-county and data-state. Something like that

//       8. My choropleth should have a legend with corresponding id="legend"
//       9. I can mouse over a cell and see a tooltip with a corresponding id="tooltip" which displays more information about the cell
//       10. My tooltip should have a "data-???" property that corresponds to the given year of the active cell

    });

  });
}
