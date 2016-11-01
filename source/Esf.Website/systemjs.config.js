/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {

    var map = {
        'app': 'wwwroot/app',
        'rxjs': 'node_modules/rxjs',
        'zonejs': 'node_modules/zone.js/dist',
        'reflect-metadata': 'node_modules/reflect-metadata',
        'angular-in-memory-web-api': 'node_modules/angular-in-memory-web-api',
        '@angular': 'node_modules/@angular',
        'w3c-blob': 'node_modules/w3c-blob',
        'buffer': 'node_modules/buffer-shims',
        'brace': 'node_modules/brace',
        'jquery': 'node_modules/jquery/dist/jquery.min.js'
    };

    var packages = {
        'app': { main: 'main', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'zonejs': { main: 'zone', defaultExtension: 'js' },
        'reflect-metadata': { main: 'Reflect', defaultExtension: 'js' },
        'angular-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
        'w3c-blob': { format: 'cjs', defaultExtension: 'js', main: 'index.js' },
        'buffer': { format: 'cjs', defaultExtension: 'js', main: 'index.js' },
        'brace': {
            format: 'cjs', defaultExtension: 'js', main: 'index.js'
        }
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
            'brace/theme/*': './node_modules/brace/theme/*.js',
            'brace/mode/*': './node_modules/brace/mode/*.js'
        }
    });
})(this);