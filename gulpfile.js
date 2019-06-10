const 
    //dev mode
    devBuild= true,

    //modules
    gulp=require('gulp'),
    newer=require('gulp-newer'),
    noop=require('gulp-noop'),
    htmlclean=require('gulp-htmlclean'),
    sync= require('browser-sync').create(),
    sass =require('gulp-sass'),
    concat = require('gulp-concat'),
    terser = require('gulp-terser'),
    //paths
    src='/src',
    build='/build';

    // HTML processing
    function html(){
        return gulp.src(src+ 'html/**/*')
            .pipe(newer(build))
            .pipe(devBuild? noop() :htmlclean())
            .pipe(gulp.dest(build))
            .pipe(sync.stream());
    }

    
    // CSS processing
    function css(){
        const out= build + '/assets/css'

        return gulp.src(src+'scss/main.scss')
            .pipe(sass({
                errorLogToConsole: devBuild,
                outputStyle:devBuild ? 'expanded' :'compressed'
            })).on('error', sass.logError)
            .pipe(gulp.dest(out))
            .pipe(sync.stream());
    }

    
    // JavaScript processing
    function js(){
        const out= build + '/assets/js'

        return gulp.src([
            src + '/js/**/*'

        ])
        .pipe(newer(out))
        .pipe(concat('bundle.min.js'))
        .pipe(devBuild? noop() :terser())//minimizira
        .pipe(gulp.dest(out))
        .pipe(sync.stream());
    }

    //watch for file changes
/**
 * Watch for file changes
 * @param {*} done 
 * @return void  //ako nemamo neki return funkcija vraca void
 */
    function watch(done){
        sync.init({
            server:{
                baseDir: '.'+build
            }
        });

        //html changes
        gulp.watch(src + '/html/**/*', html);

        //CSS changes
        gulp.watch(src + '/scss/**/*', scss);

        //JS changes
        gulp.watch(src + '/js/**/*', js);
        
        sync.reload();

        done();

    }

    // create gulp single tasks
exports.html = html;
exports.js = js;
exports.css = css;
exports.watch = watch;

// run all tasks
exports.build = gulp.parallel(exports.html, exports.js);
// default task
exports.default = gulp.series(exports.build, exports.watch);