// Karma configuration
// Generated on Wed Sep 14 2016 23:09:31 GMT+0100 (GMT Summer Time)

module.exports = function (config) {
    var appSrcBase = 'App/';
    var dest = 'wwwroot/';
    var appDestBase = dest + 'app/';
    var thirdPartyLibs = 'node_modules/';

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        //plugins: [
        //    require('karma-jasmine'),
        //    require('karma-chrome-launcher'),
        //    require('karma-jasmine-html-reporter')
        //],
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            //Third party libraries
            thirdPartyLibs + 'systemjs/dist/system.src.js',
            // Polyfills
            thirdPartyLibs + 'core-js/client/shim.js',
            thirdPartyLibs + 'reflect-metadata/Reflect.js',
            { pattern: thirdPartyLibs + 'reflect-metadata/Reflect.js.map', included: false, watched: false },

            // zone.js
            thirdPartyLibs + 'zone.js/dist/zone.js',
            thirdPartyLibs + 'zone.js/dist/long-stack-trace-zone.js',
            thirdPartyLibs + 'zone.js/dist/proxy.js',
            thirdPartyLibs + 'zone.js/dist/sync-test.js',
            thirdPartyLibs + 'zone.js/dist/jasmine-patch.js',
            thirdPartyLibs + 'zone.js/dist/async-test.js',
            thirdPartyLibs + 'zone.js/dist/fake-async-test.js',
            
            // RxJs
            { pattern: thirdPartyLibs + 'rxjs/**/*.js', included: false, watched: false },
            { pattern: thirdPartyLibs + 'rxjs/**/*.js.map', included: false, watched: false },
            
            { pattern: thirdPartyLibs + 'w3c-blob/*.js', included: false, watched: false },
            { pattern: thirdPartyLibs + 'buffer-shims/*.js', included: false, watched: false },
            { pattern: thirdPartyLibs + 'brace/**/*.js', included: false, watched: false },

            // Paths loaded via module imports:
            // Angular itself
            { pattern: thirdPartyLibs + '@angular/**/*.js', included: false, watched: false },
            { pattern: thirdPartyLibs + '@angular/**/*.js.map', included: false, watched: false },
			
            { pattern: 'systemjs.config.js', included: false, watched: false },
            'karma-test-shim.js',

            // transpiled application & spec code paths loaded via module imports
            { pattern: appDestBase + '**/*.js', included: false, watched: true },
            // Paths for debugging with source maps in dev tools
            { pattern: appSrcBase + '**/*.ts', included: false, watched: false },
            { pattern: appDestBase + '**/*.js.map', included: false, watched: true },
            // Asset (HTML & CSS) paths loaded via Angular's component compiler
            { pattern: appSrcBase + '**/*.html', included: true, watched: true },
            { pattern: dest + 'content/*.css', included: false, watched: true }            
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.html': ['redirect']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'kjhtml'],

        htmlReporter: {
            // Open this file to see results in browser
            outputFile: '_test-output/tests.html',

            // Optional
            pageTitle: 'Unit Tests',
            subPageTitle: __dirname
        },
        // web server port
        port: 8888,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
