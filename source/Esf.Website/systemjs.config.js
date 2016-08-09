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
        '@angular': 'wwwroot/lib',
        'ng2-ace-editor': 'node_modules/ng2-ace-editor',
        'brace': 'node_modules/brace',
        'w3c-blob': 'node_modules/w3c-blob',
        'buffer': 'node_modules/buffer-shims'
    };

    var packages = {
        'app': { main: 'main', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'zonejs': { main: 'zone', defaultExtension: 'js' },
        'reflect-metadata': { main: 'Reflect', defaultExtension: 'js' },
        'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
        'ng2-ace-editor': { format: 'cjs', main: 'index.js', defaultExtension: 'js' },
        'w3c-blob': { format: 'cjs', defaultExtension: 'js', main: 'index.js' },
        'brace': { format: 'cjs', defaultExtension: 'js', main: 'index.js' },
        'buffer': { format: 'cjs', defaultExtension: 'js', main: 'index.js' }
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
        map: map,
        packages: packages,
        paths: {
            underscore: './node_modules/brace/index.js'
        }
    });
})(this);