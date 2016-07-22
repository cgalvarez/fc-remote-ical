// Node.js modules
var exec = require("child_process").exec;
var fs = require("fs");
var sprintf = require("sprintf");

// Gulp
var gulp = require("gulp");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var typings = require("gulp-typings");
var uglify = require("gulp-uglify");
var umd = require("gulp-umd");

// Project variables
var namespace = "FCRemoteIcal";
var mainFile = "fc-remote-ical.js";

// TASK: Install required type definitions if not already installed
gulp.task("typings",function(cb) {
  try {
    fs.accessSync("src/typings/index.d.ts", fs.F_OK);
    cb();
  } catch (e) {
    return gulp.src("src/typings.json")
      .pipe(typings());
  }
});

// TASK: Transpile TypeScript into JavaScript
gulp.task("tsc", ["typings"], function(cb) {
  exec("node_modules/typescript/bin/tsc --project src", function (err, stdout, stderr) {
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    cb(err);
  });
});

// TASK: Convert the transpiled JavaScript into an UMD module
gulp.task("umd", ["tsc"], function() {
  return gulp.src("dist/" + mainFile)
    .pipe(replace(sprintf("exports.%1$s = %1$s;\n", namespace), ""))
    .pipe(replace(/\/\/# sourceMappingURL=.*/g, "\n"))
    .pipe(umd({
      exports: function(file) { return namespace; },
      namespace: function(file) { return namespace; }
    }))
    .pipe(rename({suffix: ".umd"}))
    .pipe(gulp.dest("dist"));
});

// TASK: Minify UMD file
gulp.task("minify", ["umd"], function(cb) {
  return gulp.src("dist/*.umd.js")
    .pipe(uglify({
        mangle: true,
        preserveComments: "license"
      }))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("dist"));
});

// Default task
gulp.task("default", ["typings", "tsc", "umd", "minify"]);
