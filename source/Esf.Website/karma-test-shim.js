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

function getBaseUrl(url = '') {
    return '/base/' + url;
}

System.import(getBaseUrl('systemjs.config.js')).then(function (systemjsConfig) {
    systemjsConfig.baseURL = getBaseUrl();
    var map = systemjsConfig.map;
    map['app'] = 'wwwroot/app';
    map['@angular/core/testing'] = 'npm:@angular/core/bundles/core-testing.umd.js';
    map['@angular/common/testing'] = 'npm:@angular/common/bundles/common-testing.umd.js';
    map['@angular/compiler/testing'] = 'npm:@angular/compiler/bundles/compiler-testing.umd.js';
    map['@angular/platform-browser/testing'] = 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js';
    map['@angular/platform-browser-dynamic/testing'] = 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js';
    map['@angular/http/testing'] = 'npm:@angular/http/bundles/http-testing.umd.js';
    map['@angular/router/testing'] = 'npm:@angular/router/bundles/router-testing.umd.js';
    map['@angular/forms/testing'] = 'npm:@angular/forms/bundles/forms-testing.umd.js';

    System.config(systemjsConfig);
    initTestBed().then(initTesting);
});

function initTestBed() {

    return Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ])

        .then(function (providers) {
            var coreTesting = providers[0];
            var browserTesting = providers[1];

            coreTesting.TestBed.initTestEnvironment(
                browserTesting.BrowserDynamicTestingModule,
                browserTesting.platformBrowserDynamicTesting());
        });
}

// Import all spec files and start karma
function initTesting() {    
    function getAppDestPath() {
        return getBaseUrl('wwwroot/app/');
    }

    var getAllAppSpecFiles = function () {
        var appDestPath = getAppDestPath();
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

    var importSystemJsModule = function (moduleName) {
        return System.import(moduleName);
    };
    return Promise.all(getAllAppSpecFiles().map(importSystemJsModule))
    .then(__karma__.start, __karma__.error);
}