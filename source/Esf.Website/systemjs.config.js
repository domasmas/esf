/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {

    var map = {
        'app': 'wwwroot/app',
        'rxjs': 'wwwroot/lib',
        'zonejs': 'wwwroot/lib/zone.js',
        'reflect-metadata': 'wwwroot/lib/reflect-metadata',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        '@angular': 'wwwroot/lib'
    };

    var packages = {
        'app': { main: 'main', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'zonejs': { main: 'zone', defaultExtension: 'js' },
        'reflect-metadata': { main: 'Reflect', defaultExtension: 'js' },
        'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' }
    };

    var ngPackageNames = [
       'common',
       'compiler',
       'core',
       'forms',
       'http',
       'platform-browser',
       'platform-browser-dynamic',
       'router',
       'router-deprecated',
       'upgrade'
    ];
    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);

    System.config({
        baseURL: '/',
        map: map,
        packages: packages
    });
})(this);