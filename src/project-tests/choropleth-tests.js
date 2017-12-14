import { assert } from 'chai';
import educationData from '../data/choropleth_map/education.json';
import { testToolTip } from '../utils/global-D3-tests';
import { d3ProjectStackNoAxes } from '../utils/shared-test-strings';
import { hasUniqueColorsCount } from '../utils/element-utils';

export default function createChoroplethTests() {

  describe('#ChoroplethTests', function() {

    describe('#Technology Stack', function() {
      it(d3ProjectStackNoAxes, function() {
        return true;
      });
    });

    describe('#Content', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. My Choropleth should have a title with a corresponding
      id="title"`,
      function() {
        assert.isNotNull(
          document.getElementById('title'),
          'Could not find an element with id="title" '
        );
      });

      reqNum++;
      it(`${reqNum}. My Choropleth should have a description element with a
      corresponding id="description"`,
      function() {
        assert.isNotNull(
          document.getElementById('description'),
          'Could not find element with id="description" '
        );
      });

      reqNum++;
      it(`${reqNum}. My Choropleth should have counties with a corresponding
      class="county" that represent the data`,
      function() {
        assert.isAbove(
          document.querySelectorAll('.county').length,
          0,
          'Could not find any elements with class="county" '
        );
      });

      reqNum++;
      it(`${reqNum}. There should be at least 4 different fill colors used for
      the counties`,
      function() {
        const counties = document.querySelectorAll('.county');

        assert.isTrue(
          hasUniqueColorsCount(counties, 4),
          'There should be at least four fill colors used for the counties '
        );
      });

      reqNum++;
      it(`${reqNum}. My counties should each have "data-fips" and
      "data-education" properties containing their corresponding fips and
      education values`,
      function() {
        const counties = document.querySelectorAll('.county');
        assert.isAbove(
          counties.length,
          0,
          'Could not find any elements with a class="counties" '
        );

        for (var i = 0; i < counties.length; i++) {
          var county = counties[i];
          assert.isNotNull(
            county.getAttribute('data-fips'),
            'Could not find property "data-fips" in county '
          );
          assert.isNotNull(
            county.getAttribute('data-education'),
            'Could not find property "data-education" in county '
          );
        }
      });

      reqNum++;
      it(`${reqNum}. My Choropleth should have a county for each provided data
      point`,
      function() {
        const counties = document.querySelectorAll('.county');

        assert.equal(counties.length, educationData.length);
      });

      reqNum++;
      it(`${reqNum}. The counties should have data-fips and data-education
      values that match the sample data`,
      function() {
        const counties = document.querySelectorAll('.county');
        const educationDataFips = educationData.map(item => {
          return item.fips;
        });
        var uniqueFipsFromChoropleth = [];
        // Check for any duplicate fips values.
        for (var i = 0; i < counties.length; i++) {
          var fips = counties[i].getAttribute('data-fips');

          assert.equal(
            uniqueFipsFromChoropleth.indexOf(fips),
            -1,
            'There should be no duplicate fips values '
          );
          uniqueFipsFromChoropleth.push(+fips);
        }

        // Iterate through each data point and make sure all given data appears
        // on the Choropleth, and that the Choropleth doesn't contain extra
        // data.
        for (var j = 0; j < educationData.length; j++) {
          // Test that every value in the sample data is in the Choropleth.
          assert.notEqual(
            uniqueFipsFromChoropleth.indexOf(
              educationDataFips[j]),
              -1,
              'Choropleth does not contain all fips from sample data '
            );

          // Test that every value in the Choropleth is in the sample data.
          assert.notEqual(
            educationDataFips.indexOf(uniqueFipsFromChoropleth[j]),
            -1,
            'Choropleth contains fips data not found in sample data '
          );
        }

        // Index educationData by fips.
        var educationDataByFips = educationData.reduce(function(data, item) {
          data[item.fips] = item;
          return data;
        }, {});

        // Check if the counties on the Choropleth have data-education values
        // that correspond to the correct data-fips value.
        for (var k = 0; k < counties.length; k++) {
          var countyFips = +counties[k].getAttribute('data-fips');
          var countyEducation = counties[k].getAttribute('data-education');
          var sampleEducation =
            educationDataByFips[countyFips].bachelorsOrHigher;

          assert.equal(
            countyEducation,
            sampleEducation,
            'County fips and education data does not match '
          );
        }

      });

      reqNum++;
      it(`${reqNum}. My Choropleth should have a legend with a corresponding
      id="legend"`,
      function() {
        assert.isNotNull(
          document.getElementById('legend'),
          'Could not find element with id="legend" '
        );
      });

      reqNum++;
      it(`${reqNum}. There should be at least 4 different fill colors used for
      the legend`,
      function() {
        const rects = document.querySelectorAll('#legend rect');

        assert.isTrue(
          hasUniqueColorsCount(rects, 4),
          'There should be at least four fill colors used for the legend '
        );
      });
    });

    // Additional tests.
    testToolTip(
      document.querySelectorAll('.county'),
      'data-education',
      'data-education'
    );

  });
}
