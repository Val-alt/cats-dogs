var gulp = require("gulp"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    prefixer = require("gulp-autoprefixer"),
    newer = require("gulp-newer"),
    cssmin = require("gulp-cssnano"),
    imagemin = require("gulp-imagemin"),
    // uglify = require("gulp-uglify"),
    uglifyes = require("uglify-es"),
    composer = require("gulp-uglify/composer"),
    uglify = composer(uglifyes, console),
    browserSync = require("browser-sync"),
    del = require("del");

var paths = { src: "app/", dist: "dist/assets/template/" },
    src = {
        sass: paths.src + "sass/**/**/*.+(scss|sass|less|css)",
        js: paths.src + "scripts/**/*.js",
        img: paths.src + "img/**/*",
        fonts: paths.src + "fonts/**/*"
    },
    dist = {
        sass: paths.dist + "styles",
        js: paths.dist + "scripts",
        img: paths.dist + "img",
        fonts: paths.dist + "fonts"
    };

gulp.task("sass", function() {
    return (
        gulp
        // .src(["app/libs/**/*.css", "app/sass/app.scss"])
        .src([
            "app/libs/fontawesome-v5.11.2.css",
            "app/libs/bootstrap-4.3.1-dist/css/bootstrap.css",
            "app/sass/style.css",

            // "app/sass/app.scss",
        ])
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("catsdogs.min.css"))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(dist.sass))
    );
});

gulp.task("js", function() {
    return (
        gulp
        // .src(["app/libs/**/*.js", src.js])
        .src([
            "app/libs/jquery-3.3.1.min.js",
            "app/libs/popper.js",

            "app/libs/bootstrap-4.3.1-dist/js/bootstrap.min.js",
            "app/libs/bootstrap-4.3.1-dist/js/bootstrap.bundle.min.js",
            "app/scripts/exam.js",
            // "app/scripts/app.js"

        ])
        .pipe(uglify())
        .pipe(concat("catsdogs.min.js"))
        .pipe(gulp.dest(dist.js))
    );
});

gulp.task("img", function() {
    return gulp
        .src(src.img)
        .pipe(newer(dist.img))
        .pipe(imagemin())
        .pipe(gulp.dest(dist.img));
});

gulp.task("fonts", function() {
    return gulp
        .src(src.fonts)
        .pipe(newer(dist.fonts))
        .pipe(gulp.dest(dist.sass));
});

gulp.task("html", function() {
    return gulp
        .src("app/*.html")
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("ico", function() {
    return gulp
        .src("app/*.png")
        .pipe(gulp.dest("dist"));
});

gulp.task("file", function() {
    return gulp
        .src("app/file/*")
        .pipe(gulp.dest("dist/assets/template/file"));
});

// очистка папки с готовым проектом
gulp.task("clean", function() {
    return del.sync("dist");
});

gulp.task(
    "build",
    gulp.parallel("clean", "html", "ico", "sass", "js", "img", "fonts", "file")
);

gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task(
    "default",
    gulp.parallel("browser-sync", function() {
        gulp
            .watch("app/*.html", gulp.parallel("html"))
            .on("change", browserSync.reload);
        gulp
            .watch(src.sass, gulp.parallel("sass"))
            .on("change", browserSync.reload);
        gulp.watch(src.js, gulp.parallel("js")).on("change", browserSync.reload);
        gulp
            .watch(src.img, gulp.parallel("img"))
            .on("change", browserSync.reload);
        gulp
            .watch(src.fonts, gulp.parallel("fonts"))
            .on("change", browserSync.reload);
    })
);