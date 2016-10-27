// #docregion
// /*global jasmine, __karma__, window*/
Error.stackTraceLimit = 0; // "No stacktrace"" is usually best for app testing.

// Uncomment to get full stacktrace output. Sometimes helpful, usually not.
// Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

var removeKarmaLoaded = function() {
    __karma__.loaded = function () { };
};
removeKarmaLoaded();

var baseUrl = '/base';
System.config({
    baseURL: baseUrl,
    // Extend usual application package list with test folder
    //packages: { 'testing': { main: 'index.js', defaultExtension: 'js' } },

    // Assume npm: is set in `paths` in systemjs.config
    // Map the angular testing umd bundles
    map: {
        '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
        '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',
    },
});

System.import('systemjs.config.js')
  .then(initTestBed)
  .then(initTesting);

function initTestBed(){
    return Promise.all([
      System.import('@angular/core/testing'),
      System.import('@angular/platform-browser-dynamic/testing')
    ])

    .then(function (providers) {
        var coreTesting    = providers[0];
        var browserTesting = providers[1];

        coreTesting.TestBed.initTestEnvironment(
          browserTesting.BrowserDynamicTestingModule,
          browserTesting.platformBrowserDynamicTesting());
    })
}

// Import all spec files and start karma
function initTesting() {    
    var getAllAppSpecFiles = function (baseUrl) {
        var appDestPath = baseUrl + '/wwwroot/app/';
        var isAppDestFile = function (path) {
            return new RegExp('^' + appDestPath).test(path);
        }
        var isAppFile = function (path) {
            return isSpecFile(path) && isAppDestFile(path);
        }

        var isSpecFile = function (path) {
            return /\.spec\.(.*\.)?js$/.test(path);
        }

        return Object.keys(window.__karma__.files)
               .filter(isAppFile);
    };

    //var getAllAppHtmlFiles = function (baseUrl) {
    //    var appSrcPath = baseUrl + '/App/';
    //    var isAppSourceFile = function (path) {
    //        return new RegExp('^' + appSrcPath).test(path);
    //    }
    //    var isHtmlFile = function (path) {
    //        //return /\.html/.test(path);
    //        return false;
    //    }

    //    return Object.keys(window.__karma__.files)
    //           .filter(isHtmlFile);
    //           //.filter(isAppSourceFile);
    //};

    var importSystemJsModule = function (moduleName) {
        return System.import(moduleName);
    };
    return Promise.all(getAllAppSpecFiles(baseUrl).map(importSystemJsModule))
    //return Promise.all([, 
    //    Promise.all(getAllAppHtmlFiles(baseUrl).map(importSystemJsModule))
    //])
    .then(__karma__.start, __karma__.error);
}
