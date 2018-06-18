const gulp = require('gulp');
const rename = require('gulp-rename');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package');

gulp.task('less', async () => {
    await new Promise(resolve => {
        gulp.src('./src/less/marvina-slider.less')
        .pipe(less())
        .on('error', e => {
            console.log(e);
            resolve();
        })
        .pipe(gulp.dest('./dist/css'))
        .on('error', resolve)
        .on('end', resolve);
    });

    await new Promise(resolve => {
        gulp.src('./dist/css/marvina-slider.css')
        .pipe(cssmin())
        .pipe(rename('marvina-slider.min.css'))
        .pipe(gulp.dest('./dist/css'))
        .on('end', resolve);
    });
});

const banner = `/*!
 *   Marvina image slider
 *   version: ${pkg.version}
 *    author: ${pkg.author.name} <${pkg.author.email}>
 *   website: ${pkg.author.url}
 *    github: ${pkg.repository.url}
 *   license: ${pkg.license}
 */
`;
gulp.task('rollup', async () => {
    const bundle = await rollup.rollup({
        input: './src/ts/index.ts',
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript()
        ]
    });

    await bundle.write({
        banner,
        file: 'dist/js/marvina-slider.js',
        format: 'umd',
        name: 'MarvinaSlider'
    });

    await bundle.write({
        banner,
        file: 'dist/js/marvina-slider.common.js',
        format: 'cjs'
    });

    await bundle.write({
        banner,
        file: 'dist/js/marvina-slider.esm.js',
        format: 'es',
    });

    gulp.src('dist/js/marvina-slider.js')
    .pipe(uglify({
        output: {
            comments: /marvina-slider/
        }
    }))
    .pipe(rename('marvina-slider.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', () => {
    gulp.watch('./src/less/**', ['less']);
    gulp.watch('./src/ts/**', ['rollup']);
    gulp.start(['less', 'rollup']);
});