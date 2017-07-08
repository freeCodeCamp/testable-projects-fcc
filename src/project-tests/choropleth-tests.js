import $ from 'jquery';
import educationData from '../data/choropleth_map/education.json';
import {testToolTip} from '../assets/globalD3Tests';

export default function createChoroplethTests() {

  describe('#ChoroplethTests', function() {

    describe('#Content', function() {

      it('1. My Choropleth should have a title with a corresponding id=\"title\"', function() {
        FCC_Global.assert.isNotNull(document.getElementById('title'), 'Could not find an element with id=\"title\" ');
      })

      it('2. My Choropleth should have a description with a corresponding id=\"description\"', function() {
        FCC_Global.assert.isNotNull(document.getElementById('description'), 'Could not find element with id=\"description\" ');
      })

      it('3. My Choropleth should have counties with a corresponding class=\"county\" that represent the data', function() {
        FCC_Global.assert.isAbove(document.querySelectorAll('.county').length, 0, "Could not find any elements with class=\"county\" ");
      })

      it('4. There should be at least 4 different fill colors used for the counties', function() {
        const counties = document.querySelectorAll('.county');
        var uniqueColors = [];

        for (var i = 0; i < counties.length; i++) {
          var countyColor = counties[i].style.fill || counties[i].getAttribute('fill');

          // if the current color isn't in the uniqueColors arr, push it
          if (uniqueColors.indexOf(countyColor) === -1) {
            uniqueColors.push(countyColor);
          }
        }

        FCC_Global.assert.isAtLeast(uniqueColors.length, 4, 'There should be at least four fill colors used for the counties ');
      })

      it('5. My counties should each have \"data-fips\" and \"data-education\" properties containing their corresponding fips and education values', function() {
        const counties = document.querySelectorAll('.county');
        FCC_Global.assert.isAbove(counties.length, 0, "Could not find any elements with a class=\"counties\" ");

        for (var i = 0; i < counties.length; i++) {
          var county = counties[i];
          FCC_Global.assert.isNotNull(county.getAttribute("data-fips"), "Could not find property \"data-fips\" in county ")
          FCC_Global.assert.isNotNull(county.getAttribute("data-education"), "Could not find property \"data-education\" in county ")
        }
      })

      it('6. My Choropleth should have a county for each provided data point', function() {
        const counties = document.querySelectorAll('.county');

        FCC_Global.assert.equal(counties.length, educationData.length)
      })

      it('7. The counties should have data-fips and data-education values that match the sample data', function() {
        const counties = document.querySelectorAll('.county');
        const educationDataFips = educationData.map(item => {
          return item.fips
        });
        var uniqueFipsFromChoropleth = [];
        // check for any duplicate fips values
        for (var i = 0; i < counties.length; i++) {
          var fips = counties[i].getAttribute('data-fips');

          FCC_Global.assert.equal(uniqueFipsFromChoropleth.indexOf(fips), -1, "There should be no duplicate fips values ");
          uniqueFipsFromChoropleth.push(+ fips);
        }

        // iterate through each data point and make sure all given data appears on the Choropleth, and that the Choropleth doesn't contain extra data
        for (var j = 0; j < educationData.length; j++) {
          // test that every value in the sample data is in the Choropleth
          FCC_Global.assert.notEqual(uniqueFipsFromChoropleth.indexOf(educationDataFips[j]), -1, "Choropleth does not contain all fips from sample data ")

          // test that every value in the Choropleth is in the sample data
          FCC_Global.assert.notEqual(educationDataFips.indexOf(uniqueFipsFromChoropleth[j]), -1, "Choropleth contains fips data not found in sample data ")
        }

        // index educationData by fips
        var educationDataByFips = educationData.reduce(function(data, item) {
          data[item.fips] = item;
          return data;
        }, {})

        // check if the counties on the Choropleth have data-education values that correspond to the correct data-fips value
        for (var k = 0; k < counties.length; k++) {
          var countyFips = +counties[k].getAttribute('data-fips');
          var countyEducation = counties[k].getAttribute('data-education');
          var sampleEducation = educationDataByFips[countyFips].bachelorsOrHigher;

          FCC_Global.assert.equal(countyEducation, sampleEducation, "County fips and education data does not match ")
        }

      })

      it('8. My Choropleth should have a legend with a corresponding id=\"legend\"', function() {
        FCC_Global.assert.isNotNull(document.getElementById('legend'), 'Could not find element with id=\"legend\" ');
      })

      it('9. There should be at least 4 different fill colors used for the legend', function() {
        const rects = document.querySelectorAll('#legend rect');
        var uniqueColors = [];

        for (var i = 0; i < rects.length; i++) {
          var rectColor = rects[i].style.fill || rects[i].getAttribute('fill');

          // if the current color isn't in the uniqueColors arr, push it
          if (uniqueColors.indexOf(rectColor) === -1) {
            uniqueColors.push(rectColor);
          }
        }
        FCC_Global.assert.isAtLeast(uniqueColors.length, 4, 'There should be at least four fill colors used for the legend ');
      })
    });

    testToolTip(document.querySelectorAll('.county'), "data-education", "data-education")

  });
}
