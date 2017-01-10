import $ from 'jquery';
import educationData from '../data/education.json';
export default function createChoroplethTests() {

  // returns a random index number
  function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
  }

  describe('#ChoroplethTests', function() {

    describe('#Content', function() {

      it('1. My Choropleth should have a title with a corresponding id=\"title\"', function() {
        FCC_Global.assert.isNotNull(document.getElementById('title'), 'Could not find an element with id=\"title\"');
      })

      it('2. My Choropleth should have a description with a corresponding id=\"description\"', function() {
        FCC_Global.assert.isNotNull(document.getElementById('description'), 'Could not find element with id=\"description\"');
      })

      it('3. My Choropleth should have counties with a corresponding class=\"county\" that represent the data', function() {
         FCC_Global.assert.isAbove(document.querySelectorAll('.county').length, 0, "Could not find any elements with class=\"county\"");
      })

      it('4. There should be at least 4 different fill colors used for the counties', function(){
        const counties = document.querySelectorAll('.county');
        var uniqueColors = [];

        for(var i = 0; i < counties.length; i++) {
          var countyColor = counties[i].style.fill || counties[i].getAttribute('fill');

          // if the current color isn't in the uniqueColors arr, push it
          if(uniqueColors.indexOf(countyColor) === -1) {
             uniqueColors.push(countyColor);
          }
        }

        FCC_Global.assert.isAtLeast(uniqueColors.length, 4, 'There should be at least four fill colors used for the counties');
      })

      it('5. My counties should each have \"data-fips\" and \"data-education\" properties containing their corresponding fips and education values', function(){
        const counties = document.querySelectorAll('.county');
        FCC_Global.assert.isAbove(counties.length, 0, "Could not find any elements with a class=\"counties\"");

        for(var i=0; i<counties.length; i++){
          var county = counties[i];
          FCC_Global.assert.isNotNull(county.getAttribute("data-fips"), "Could not find property \"data-fips\" in county")
          FCC_Global.assert.isNotNull(county.getAttribute("data-education"), "Could not find property \"data-education\" in county")
        }
      })

      it('6. My Choropleth should have a county for each provided data point', function(){
        const counties = document.querySelectorAll('.county');

        FCC_Global.assert.equal(counties.length, educationData.length)
      })

      it('7. The counties should have data-fips and data-education values that match the sample data', function(){
        const counties = document.querySelectorAll('.county');
        const educationDataFips = educationData.map(item => {
          return item.fips
        });
        var uniqueFipsFromChoropleth = [];

        // check for any duplicate fips values
        for(var i = 0; i < counties.length; i++) {
          var fips = counties[i].getAttribute('data-fips');

          FCC_Global.assert.equal(uniqueFipsFromChoropleth.indexOf(fips), -1, "There should be no duplicate fips values");
          uniqueFipsFromChoropleth.push(+fips); 
        }    

        // iterate through each data point and make sure all given data appears on the Choropleth, and that the Choropleth doesn't contain extra data                      
        for(var j = 0; j < educationData.length; j++) {
          // test that every value in the sample data is in the Choropleth
          FCC_Global.assert.notEqual(uniqueFipsFromChoropleth.indexOf(educationDataFips[j]), -1, "Choropleth does not contain all fips from sample data")
          
          // test that every value in the Choropleth is in the sample data
          FCC_Global.assert.notEqual(educationDataFips.indexOf(uniqueFipsFromChoropleth[j]), -1, "Choropleth contains fips data not found in sample data")
        }

        // check if the counties on the Choropleth have data-education values that correspond to the correct data-fips value
        for(var k = 0; k < counties.length; k++) {
          var countyFips = +counties[k].getAttribute('data-fips');
          var countyEducation = counties[k].getAttribute('data-education');

          // get the index of the object in the sample data with a fips that matches the current county
          var sampleIndex = educationData.findIndex(item => {
            return item.fips === countyFips
          })
          var sampleEducation = educationData[sampleIndex].bachelorsOrHigher;

          FCC_Global.assert.equal(countyEducation, sampleEducation, "County fips and education data does not match")
        }
      })

      it('8. My Choropleth should have a legend with a corresponding id=\"legend\"', function(){
        FCC_Global.assert.isNotNull(document.getElementById('legend'), 'Could not find element with id=\"legend\"');
      })

      it('9. There should be at least 4 different fill colors used for the legend', function(){
        const rects = document.querySelectorAll('#legend rect');
        var uniqueColors = [];
      
        for(var i = 0; i < rects.length; i++) {
          var rectColor = rects[i].style.fill || rects[i].getAttribute('fill');
          
          // if the current color isn't in the uniqueColors arr, push it 
          if(uniqueColors.indexOf(rectColor) === -1){
             uniqueColors.push(rectColor);
          }
        }
        FCC_Global.assert.isAtLeast(uniqueColors.length, 4, 'There should be at least four fill colors used for the legend');
      })
      

      it('10. When I mouse over a county, a \"div\" element with a corresponding id=\"tooltip\" should become visible', function(){

        const firstRequestTimeout = 100;
        const secondRequestTimeout = 2000;
        this.timeout(firstRequestTimeout + secondRequestTimeout + 1000);
        FCC_Global.assert.isNotNull(document.getElementById('tooltip'), 'There should be an element with id=\"tooltip\"');

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

        const counties = document.querySelectorAll('.county');

        // place mouse on random bar and check if tooltip is visible
        const randomIndex = getRandomIndex(counties.length);
        var randomCounty = counties[randomIndex];
        randomCounty.dispatchEvent(new MouseEvent('mouseover'));

        // promise is used to prevent test from ending prematurely
        return new Promise((resolve, reject) => {
          // timeout is used to accomodate tooltip transitions
          setTimeout( _ => {
            if(getToolTipStatus(tooltip) !== 'visible') {
              reject(new Error('Tooltip should be visible when mouse is on an area'))
            }

            // remove mouse from cell and check if tooltip is hidden again
            randomCounty.dispatchEvent(new MouseEvent('mouseout'));
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
      it('11. My tooltip should have a \"data-education\" property that corresponds to the given education of the active county', function() {
        const tooltip = document.getElementById('tooltip');            
        FCC_Global.assert.isNotNull(tooltip.getAttribute("data-education"), 'Could not find property \"data-education\" in tooltip');

        const counties = document.querySelectorAll('.county');

        const randomIndex = getRandomIndex(counties.length);

        var randomCounty = counties[randomIndex];        

        randomCounty.dispatchEvent(new MouseEvent('mouseover'));

        FCC_Global.assert.equal(tooltip.getAttribute('data-education'), randomCounty.getAttribute('data-education'), 'Tooltip\'s \"data-education\" property should be equal to the active county\'s \"data-education\" property');
        
        //clear out tooltip
        randomCounty.dispatchEvent(new MouseEvent('mouseoff'));       
      })
    });

  });
}