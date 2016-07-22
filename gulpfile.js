// Node.js modules
var del = require("del");
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

// TASK: Install required type definitions if not already installed
gulp.task("typings", function(cb) {
  try {
    fs.accessSync("src/typings/index.d.ts", fs.F_OK);
    cb();
  } catch (e) {
    return gulp.src("src/typings.json")
      .pipe(typings());
  }
});

// TASK: Transpile TypeScript into JavaScript
gulp.task("tsc", ["typings", "clean"], function(cb) {
  exec("node_modules/typescript/bin/tsc --project src", function (err, stdout, stderr) {
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    cb(err);
  });
});

// TASK: Convert the transpiled JavaScript into an UMD module
var pluginName = "FCRemoteIcal";
var getPluginName = function(file) { return pluginName; };
gulp.task("umd", ["tsc"], function() {
  return gulp.src("dist/*.js")
    .pipe(replace(sprintf("exports.%1$s = %1$s;\n", pluginName), ""))
    .pipe(replace(/\/\/# sourceMappingURL=.*/g, "\n"))
    .pipe(umd({
      exports: getPluginName,
      namespace: getPluginName
    }))
    .pipe(rename({suffix: ".umd"}))
    .pipe(gulp.dest("dist"));
});

// TASK: Minify UMD file
gulp.task("minify", ["umd"], function(cb) {
  return gulp.src("dist/*.js")
    .pipe(uglify({
        mangle: true,
        preserveComments: "license"
      }))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("dist"));
});

// TASK: Clean output folders
gulp.task('clean', function () {
  return del(["dist/**/*"]);
});
gulp.task("clean:all", ["clean"], function () {
  return del([
    "src/typings/**/*",
    "!src/typings/fc-remote-ical.d.ts",
    "!src/typings/ical.d.ts",
  ]);
});

// Default task
gulp.task("default", ["clean", "typings", "tsc", "umd", "minify"]);
