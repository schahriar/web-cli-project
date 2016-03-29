"use strict";

const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');;
const watchify = require('watchify');
const browserify = require('browserify');
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const connect = require('gulp-connect');

const kTRACE_ERRORS = false;
const directories = {
  less: "./less/", // Less files (directly converted to css with the same name)
  lessIncludes: "./less/includes/", // Less Includes directory
  lessExport: path.resolve('./public/', 'css'), // Less Export directory
  main: path.resolve('./lib/master.js'), // Main Browserify JS files
  bundleName: "./bundle.js", // Filename that Browserify exports to
  export: "./public" // Directory to export Bundle to
};

class Logger {
  constructor() {
    this.console = console.log.bind(console);
    this.trace = console.trace.bind(console);
  }
  log() {
    this.console.apply(null, arguments);
    return this;
  }
  error() {
    this.console.apply(null, arguments);
    return this;
  }
  trace() {
    if (kTRACE_ERRORS) this.trace.apply(null, arguments);
    return this;
  }
  endl() {
    return this.log('\n');
  }
}

let logger = new Logger();

function ERROR_HANDLER(error) {
  if (error && (typeof error === 'object') && error.message) {
    logger.log("\n--- ERROR ---\n")
      .error(error.message)
      .trace(error);
  }
}

// Less to CSS & Prefixer
function GULP_LESS() {
  gulp.src(path.join(directories.less, '*.less'))
    .pipe(plumber(ERROR_HANDLER))
    .pipe(less({
      paths: [path.join(directories.lessIncludes, '*.less')]
    }))
    .pipe(autoprefixer({
      browsers: ['last 5 version'],
      cascade: true
    }))
    .pipe(gulp.dest(directories.lessExport))
    .pipe(connect.reload());
}

// Browserify & Build
var build = function BUILD() {
  const bundle = watchify(browserify(directories.main, watchify.args));

  // Launch Test Server
  connect.server({
    root: [path.join(__dirname, directories.export)],
    livereload: true,
    port: 9080
  });

  // Watch Less folders
  gulp.watch([path.join(directories.less, '*.*'), path.join(directories.lessIncludes, '*.*')], GULP_LESS);
  GULP_LESS();

  // Browserify
  function rebundle() {
    return bundle.bundle(ERROR_HANDLER)
      .pipe(plumber(ERROR_HANDLER))
      .pipe(source(directories.bundleName))
      .pipe(buffer())
      .pipe(gulp.dest(directories.export))
      .pipe(connect.reload());
  }
  bundle.on('log', logger.log.bind(logger));
  bundle.on('update', rebundle);
  bundle.on('time', function(time) {
    logger.log('Browserify', 'render took', time + 'ms');
  });

  return rebundle();
};

gulp.task('default', build);