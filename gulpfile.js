'use strict';
const gulp = require('gulp');
const rollup = require('rollup').rollup;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const _uglify = require('uglify-js').uglify;
const minify = require('uglify-js').minify;

gulp.task('default', function() {
    return rollup({
        entry: './src/index.js',
        plugins: [nodeResolve({
                jsnext: true
            }),
            commonjs(),
            babel({
                exclude: ['node_modules/**']
            }),
            uglify({
                compress: {
                    screw_ie8: false
                },
                mangle: {
                    screw_ie8: false
                }
            }, _uglify)
        ]
    }).then(function(bundle) {
        return bundle.write({
            moduleName: "Guppy",
            format: 'umd',
            dest: './dist/bundle.js'
        });
    });
});
