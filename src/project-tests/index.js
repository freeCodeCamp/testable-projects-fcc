import createTributePageTests from './tribute-page-tests';
import createPortfolioTests from './portfolio-tests';
import createSurveyFormTests from './survey-form-tests';
import createProductLandingPageTests from './product-landing-page-tests';
import createTechnicalDocsPageTests from './technical-docs-tests';
import createRandomQuoteMachineTests from './quote-machine-tests';
import createMarkdownPreviewerTests from './markdown-previewer-tests';
import createDrumMachineTests from './drum-machine-tests';
import createPomodoroClockTests from './pomodoro-clock-tests';
import createCalculatorTests from './calculator-tests';
import createBarChartTests from './bar-chart-tests';
import createScatterPlotTests from './scatter-plot-tests';
import createHeatMapTests from './heat-map-tests';
import createChoroplethTests from './choropleth-tests';
import createTreeMapTests from './tree-map-tests';

export default {
  'tribute-page': {
    name: 'Tribute Page',
    URL: 'https://codepen.io/freeCodeCamp/pen/zNqgVx',
    test: createTributePageTests
  },
  portfolio: {
    name: 'Personal Portfolio',
    URL: 'https://codepen.io/freeCodeCamp/pen/zNBOYG',
    test: createPortfolioTests
  },
  'survey-form': {
    name: 'Survey Form',
    URL: 'https://codepen.io/freeCodeCamp/pen/VPaoNP',
    test: createSurveyFormTests
  },
  'product-landing-page': {
    name: 'Product Landing Page',
    URL: 'https://codepen.io/freeCodeCamp/pen/RKRbwL',
    test: createProductLandingPageTests
  },
  'technical-docs-page': {
    name: 'Technical Documentation Page',
    URL: 'https://codepen.io/freeCodeCamp/pen/NdrKKL',
    test: createTechnicalDocsPageTests
  },
  'random-quote-machine': {
    name: 'Random Quote Machine',
    URL: 'https://codepen.io/freeCodeCamp/pen/qRZeGZ',
    test: createRandomQuoteMachineTests
  },
  'markdown-previewer': {
    name: 'Markdown Previewer',
    URL: 'https://codepen.io/freeCodeCamp/pen/GrZVVO',
    test: createMarkdownPreviewerTests
  },
  'drum-machine': {
    name: 'Drum Machine',
    URL: 'https://codepen.io/freeCodeCamp/pen/MJyNMd',
    test: createDrumMachineTests
  },
  'pomodoro-clock': {
    name: 'Pomodoro Clock',
    URL: 'https://codepen.io/freeCodeCamp/pen/XpKrrW',
    test: createPomodoroClockTests
  },
  'javascript-calculator': {
    name: 'Javascript Calculator',
    URL: 'https://codepen.io/freeCodeCamp/pen/wgGVVX',
    test: createCalculatorTests
  },
  'bar-chart': {
    name: 'D3: Bar Chart',
    URL: 'https://codepen.io/freeCodeCamp/pen/GrZVaM',
    test: createBarChartTests
  },
  'scatter-plot': {
    name: 'D3: Scatter Plot',
    URL: 'https://codepen.io/freeCodeCamp/pen/bgpXyK',
    test: createScatterPlotTests
  },
  'heat-map': {
    name: 'D3: Heat Map',
    URL: 'https://codepen.io/freeCodeCamp/pen/JEXgeY',
    test: createHeatMapTests
  },
  choropleth: {
    name: 'D3: Choropleth',
    URL: 'https://codepen.io/freeCodeCamp/pen/EZKqza',
    test: createChoroplethTests
  },
  'tree-map': {
    name: 'D3: Tree Map',
    URL: 'https://codepen.io/freeCodeCamp/pen/KaNGNR',
    test: createTreeMapTests
  }
};
