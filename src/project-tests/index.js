import path from 'path';

import createTributePageTests from './tribute-page-tests';
import createPortfolioTests from './portfolio-tests';
import createSurveyFormTests from './survey-form-tests';
import createProductLandingPageTests from './product-landing-page-tests';
import createTechnicalDocsPageTests from './technical-docs-tests';
import createRandomQuoteMachineTests from './quote-machine-tests';
import createMarkdownPreviewerTests from './markdown-previewer-tests';
import createDrumMachineTests from './drum-machine-tests';
import create25Plus5ClockTests from './25-5-clock-tests';
import createCalculatorTests from './calculator-tests';
import createBarChartTests from './bar-chart-tests';
import createScatterPlotTests from './scatter-plot-tests';
import createHeatMapTests from './heat-map-tests';
import createChoroplethTests from './choropleth-tests';
import createTreeMapTests from './tree-map-tests';

let projectsPath = `file:///${path
  .resolve('./build/pages/')
  .split(path.sep)
  .join('/')}`;

export default {
  'tribute-page': {
    name: 'Tribute Page',
    URL: projectsPath + '/tribute-page/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/zNqgVx',
    test: createTributePageTests
  },
  portfolio: {
    name: 'Personal Portfolio',
    URL: projectsPath + '/portfolio/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/zNBOYG',
    test: createPortfolioTests
  },
  'survey-form': {
    name: 'Survey Form',
    URL: projectsPath + '/survey-form/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/VPaoNP',
    test: createSurveyFormTests
  },
  'product-landing-page': {
    name: 'Product Landing Page',
    URL: projectsPath + '/product-landing-page/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/RKRbwL',
    test: createProductLandingPageTests
  },
  'technical-docs-page': {
    name: 'Technical Documentation Page',
    URL: projectsPath + '/technical-documentation-page/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/NdrKKL',
    test: createTechnicalDocsPageTests
  },
  'random-quote-machine': {
    name: 'Random Quote Machine',
    URL: projectsPath + '/random-quote-machine/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/qRZeGZ',
    test: createRandomQuoteMachineTests
  },
  'markdown-previewer': {
    name: 'Markdown Previewer',
    URL: projectsPath + '/markdown-previewer/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/GrZVVO',
    test: createMarkdownPreviewerTests
  },
  'drum-machine': {
    name: 'Drum Machine',
    URL: projectsPath + '/drum-machine/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/MJyNMd',
    test: createDrumMachineTests
  },
  '25-5-clock': {
    name: '25 + 5 Clock',
    URL: projectsPath + '/25-5-clock/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/XpKrrW',
    test: create25Plus5ClockTests
  },
  'javascript-calculator': {
    name: 'Javascript Calculator',
    URL: projectsPath + '/javascript-calculator/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/wgGVVX',
    test: createCalculatorTests
  },
  'bar-chart': {
    name: 'D3: Bar Chart',
    URL: projectsPath + '/d3-bar-chart/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/GrZVaM',
    test: createBarChartTests
  },
  'scatter-plot': {
    name: 'D3: Scatter Plot',
    URL: projectsPath + '/d3-scatter-plot/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/bgpXyK',
    test: createScatterPlotTests
  },
  'heat-map': {
    name: 'D3: Heat Map',
    URL: projectsPath + '/d3-heat-map/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/JEXgeY',
    test: createHeatMapTests
  },
  choropleth: {
    name: 'D3: Choropleth',
    URL: projectsPath + '/d3-choropleth/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/EZKqza',
    test: createChoroplethTests
  },
  'tree-map': {
    name: 'D3: Tree Map',
    URL: projectsPath + '/d3-tree-map/index.html',
    codepen: 'https://codepen.io/freeCodeCamp/pen/KaNGNR',
    test: createTreeMapTests
  }
};
