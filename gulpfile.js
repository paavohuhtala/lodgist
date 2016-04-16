"use strict";

var gulp = require("gulp");
var ts = require("gulp-typescript");
var concat = require("gulp-concat");
var stylus = require("gulp-stylus");
var order = require("gulp-order");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var tsconfigGlob = require("tsconfig-glob")
var rimraf = require("rimraf")

var serverProject = ts.createProject("./server/tsconfig.json");
var clientProject = ts.createProject("./client/js/tsconfig.json", {
    sortOutput: true
});

var clientJsDeps = [
    "angular/angular.js",
    "angular-i18n/angular-locale_fi-fi.js",
    "angular-strap/dist/angular-strap.js",
    "angular-strap/dist/angular-strap.tpl.js"
].map((x) => "bower_components/" + x);

var clientCssDeps = [
    "bootswatch-dist/css/bootstrap.min.css"
].map((x) => "bower_components/" + x);

var clientCss = [
    "client/css/**/*.stylus"
];

var fonts = [
    "bootswatch-dist/fonts/**.*"
].map((x) => "bower_components/" + x);

gulp.task("ts-globs-client", cb => {
    tsconfigGlob({configPath: "./client/js"}, err =>  cb(err));
});

gulp.task("ts-globs-server", cb => {
    tsconfigGlob({configPath: "./server"}, err => cb(err));
});

gulp.task("server", ["ts-globs-server"], () => {
    serverProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(serverProject))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./app/"));
});


gulp.task("client.js", ["ts-globs-client"], () => {
    clientProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(clientProject))
        .pipe(concat("client.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./app/static/js/"));
});

gulp.task("client.ext.js", () => {
    gulp.src(clientJsDeps)
        .pipe(concat("ext.js"))
        .pipe(gulp.dest("./app/static/js/"));
});

gulp.task("client.ext.css", () => {
    gulp.src(clientCssDeps)
        .pipe(concat("ext.css"))
        .pipe(gulp.dest("./app/static/css/"));
});

gulp.task("client.css", () => {
    gulp.src(clientCss)
        .pipe(stylus())
        .pipe(concat("client.css"))
        .pipe(gulp.dest("./app/static/css/"));
});

gulp.task("fonts", () => {
    gulp.src(fonts)
        .pipe(gulp.dest("./app/static/fonts"));
});

gulp.task("client", [
    "client.ext.js", "client.js",
    "client.ext.css", "client.css",
    "fonts"]);

gulp.task("watch-server", () => {
    gulp.watch("./server/**/*.ts", ["server"]);
});

gulp.task("watch-client", () => {
    gulp.watch(clientCss, ["client.css"]);
    gulp.watch("./client/js/**/*.ts", ["client.js"]);
});

gulp.task("clean", cb => {
    rimraf("./app", cb)
});

gulp.task("default", ["server", "client"]);
