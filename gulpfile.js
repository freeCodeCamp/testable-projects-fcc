const path = require('path');
const { pipeline } = require('stream');

const gulp = require('gulp');
const through2 = require('through2');
const Vinyl = require('vinyl');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

const pug = require('pug');

sass.compiler = require('node-sass');

const compileHtml = pug.compileFile('./src/projects/index.pug');
const bundle =
  process.env.BUNDLE_URL || '../../testable-projects-fcc/v1/bundle.js';
const babelOptions = {
  babelrc: false,
  presets: ['@babel/preset-env', '@babel/preset-react']
};

function js(projectPath) {
  return pipeline(
    gulp.src(projectPath + '/*.{js,jsx}'),
    babel(babelOptions).on('error', err => {
      const message = err.toString();
      process.stderr.write(`${message}\n`);
      this.emit('end');
    }),
    concat('index.js')
  );
}

function css(projectPath) {
  return pipeline(
    gulp.src(projectPath + '/*.{css,scss,sass}'),
    sass().on('error', sass.logError),
    concat('index.css')
  );
}

function html(projectPath) {
  return pipeline(gulp.src(projectPath + '/*.html'), concat('index.html'));
}

function getData(stream) {
  return new Promise((resolve, reject) => {
    let result;
    stream
      .on('data', data => {
        result = data;
      })
      .on('error', err => reject(err))
      .on('end', () => resolve(result));
  }).then(data => (data ? data.contents.toString() : ''));
}

async function buildProjectFromDirectory(projectPath, cb) {
  try {
    const title = `FCC: ${projectPath
      .split(path.sep)
      .reverse()[0]
      .split('-')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')}`;

    const _js = getData(js(projectPath));
    const _css = getData(css(projectPath));
    const _html = getData(html(projectPath));

    const [script, style, contents] = await Promise.all([_js, _css, _html]);
    const vinyl = new Vinyl({
      cwd: '/',
      base: projectPath + '/build/',
      path: projectPath + '/build/index.html'
    });
    if (!script && !style && !contents) {
      cb();
    } else {
      vinyl.contents = Buffer.from(
        compileHtml({
          contents,
          style,
          script,
          bundle,
          title
        })
      );
      cb(null, vinyl);
    }
  } catch (err) {
    cb(err);
  }
}

function buildProjects() {
  const _buildFromDirectory = (vinyl, _, cb) => {
    if (vinyl.isDirectory()) {
      buildProjectFromDirectory(vinyl.path, cb);
    } else {
      cb();
    }
  };

  return through2.obj(_buildFromDirectory);
}

function build() {
  return pipeline(
    gulp.src('./src/projects/*'),
    buildProjects(),
    gulp.dest(file => `./build/pages/${file.base.split(path.sep).reverse()[1]}`)
  );
}

function watchProjects() {
  return pipeline(
    watch(
      [
        './src/projects/**/*.{js,jsx}',
        './src/projects/**/*.{css,scss,sass}',
        './src/projects/**/*.html'
      ],
      { read: false }
    ),
    through2.obj((file, _, cb) => buildProjectFromDirectory(file.dirname, cb)),
    gulp.dest(file => `./build/pages/${file.base.split(path.sep).reverse()[1]}`)
  );
}

exports.build = build;
exports.watch = watchProjects;
exports.default = gulp.series(build, watchProjects);
