
"use strict";

import * as gulp from "gulp";
import * as ts from "gulp-typescript";
import * as debug from "gulp-debug";
import * as concat from "gulp-concat";

let stylus = require("gulp-stylus");
let order = require("gulp-order");

let serverProject = ts.createProject("./server/tsconfig.json");

let clientProject = ts.createProject("./client/js/tsconfig.json", {
    sortOutput: true
});

let clientJsDeps = [
    "angular/angular.js",
    "angular-i18n/angular-locale_fi-fi.js",
    "angular-strap/dist/angular-strap.js",
    "angular-strap/dist/angular-strap.tpl.js"
].map(x => "bower_components/" + x)

let clientCssDeps = [
    "bootswatch-dist/css/bootstrap.min.css"
].map(x => "bower_components/" + x)

let clientCss = [
    "client/css/**/*.stylus"
]

let fonts = [
    "bootswatch-dist/fonts/**.*"
].map(x => "bower_components/" + x)

gulp.task("server", () => {
    serverProject.src()
    .pipe(ts(serverProject))
    .pipe(gulp.dest("./app/"))
});

gulp.task("client.js", () => {
   clientProject.src()
   .pipe(ts(clientProject))
   .pipe(concat("client.js"))
   .pipe(gulp.dest("./app/static/js/"))
});

gulp.task("client.ext.js", () => {
    gulp.src(clientJsDeps)
    .pipe(concat("ext.js"))
    .pipe(gulp.dest("./app/static/js/"))
});

gulp.task("client.ext.css", () => {
    gulp.src(clientCssDeps)
    .pipe(concat("ext.css"))
    .pipe(gulp.dest("./app/static/css/"))
});

gulp.task("client.css", () => {
    gulp.src(clientCss)
    .pipe(stylus())
    .pipe(concat("client.css"))
    .pipe(gulp.dest("./app/static/css/"))
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

gulp.task("default", ["server", "client"])