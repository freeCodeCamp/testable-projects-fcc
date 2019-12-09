const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const browserPath = process.env.BROWSER_PATH || '';
const screenshotDir = process.env.SCREENSHOT_DIR || 'test/screenshots';
const browserMaxWidth = Number(process.env.BROWSER_MAX_WIDTH) || 1600;
const browserMaxHeight = Number(process.env.BROWSER_MAX_HEIGHT) || 900;

// headless mode is enabled by default
const headless = process.env.HEADLESS !== '0';
const verbose = process.env.VERBOSE === '1';

module.exports = {
  browserPath,
  browserMaxWidth,
  browserMaxHeight,
  headless,
  screenshotDir,
  verbose
};
