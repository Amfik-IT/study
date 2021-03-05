"use strict";

const gulp = require("gulp"),
  watch = require("gulp-watch"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  babel = require("gulp-babel"),
  rimraf = require("rimraf"),
  browserSync = require("browser-sync"),
  preprocess = require("gulp-preprocess"),
  svgInject = require("gulp-inject-svg"),
  reload = browserSync.reload;

const path = {
  build: {   // куда складывать готовый проект
    html:  "wwwroot/",  // путь к проекту
    js:    "wwwroot/js/",  // путь к скриптам
    css:   "wwwroot/css/",  // путь к стилям
    img:   "wwwroot/img/", // путь к картинкам
    fonts: "wwwroot/fonts/" // путь к шрифтам
  },
  src: { // где лежит проект
    html:  "src/*.html", // файлы страниц
    js:    "src/js/**/*.*", // скрипты
    css:   "src/css/style.scss", // файл стилей, в котором мы подключаем все наши компоненты
    img:   "src/img/**/*.*", // путь к картинкам
    fonts: "src/fonts/**/*.*" // путь к шрифтам
  },
  watch: { // за какими изменениями будем следить
    html:  "src/**/*.html",
    js:    "src/**/*.js",
    css:   "src/**/*.scss",
    img:   "src/img/**/*.*",
    svg:   "src/img/**/*.svg",
    fonts: "src/fonts/**/*.*"
  },
  clean: "./wwwroot" // очистка папки с проектом
};

const config = {
  server: {
    baseDir: "./wwwroot" // папка c готовым проектом (для запуска локального сервера)
  },
  host: "localhost",
  port: 9000,
  logPrefix: "FD2"
};

/***
  Описание задач и действий
***/

//Задача для HTML
function htmlBuild() {
  return gulp
    .src(path.src.html)
    .pipe(preprocess())  // склейка шаблонов
    .pipe(svgInject({ base: "/src/" })) // инлайним SVG
    .pipe(gulp.dest(path.build.html)) // переписываем в папку build
    .pipe(reload({ stream: true })); // перезагружаем сервер
};
//Задача для CSS
function cssBuild() {
  return gulp
    .src(path.src.css)
    .pipe(sass().on("error", sass.logError)) // перегнали scss -> css
    .pipe(
      postcss([
        autoprefixer(),
        cssnano() // сжатие css
      ])
    )
    .pipe(gulp.dest(path.build.css))  // переписываем в папку build
    .pipe(reload({ stream: true }));  // перезагружаем сервер
};
//Задача для Javascript
function jsBuild() {
  return gulp
    .src(path.src.js)
    .pipe(
      babel({
        presets: ['@babel/preset-env'] // прогоняем через babel
      })
    )
    .pipe(gulp.dest(path.build.js)) // переписываем в папку build
    .pipe(reload({ stream: true })); // перезагружаем сервер
}
//Задача для картинок
function imageBuild() {
  return gulp
    .src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
}
//Задача для шрифтов
function fontsBuild() {
  return gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
}

//Cписок тасков для команды build
var build = gulp.parallel(
  htmlBuild,
  jsBuild,
  cssBuild,
  fontsBuild,
  imageBuild);
//Задача для сборки билда
gulp.task("build", build);

//Cписок тасков для команды watch
function watchTask() {
  gulp.watch([path.watch.html], htmlBuild);
  gulp.watch([path.watch.svg], htmlBuild);
  gulp.watch([path.watch.css], cssBuild);
  gulp.watch([path.watch.js], jsBuild);
  gulp.watch([path.watch.img], imageBuild);
  gulp.watch([path.watch.fonts], fontsBuild);
}

//Задача для запуска локального сервера
function webserver() {
  browserSync(config);
};

//Задача по очистке папки с проектом
gulp.task("cleanTask", function(cb) {
  rimraf(path.clean, cb);
});

//Запуск действий по умолчанию
gulp.task("default", gulp.parallel(build, webserver, watchTask));
