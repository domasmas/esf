/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
({
    define: typeof define === "function"
        ? define  // browser
        : function (F) { module.exports = F(); } // Node.js
}).  
define(function () {

    var map = {
        'app': 'app',
        'rxjs': 'npm:rxjs',
        'reflect-metadata': 'npm:reflect-metadata',
        'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',
        '@angular': 'npm:@angular',
        'w3c-blob': 'npm:w3c-blob',
        'buffer': 'npm:buffer-shims',
        'brace': 'npm:brace',
        'js-beautify': 'npm:js-beautify',
        'core-js': 'npm:core-js/client/shim.min.js',
        'zone.js': 'npm:zone.js/dist',
        '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
        '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js'
    };

    var packages = {
        'app': { main: 'main', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'zone.js': { main: 'zone', defaultExtension: 'js' },
        'reflect-metadata': { main: 'Reflect', defaultExtension: 'js' },
        'angular-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
        'w3c-blob': { format: 'cjs', defaultExtension: 'js', main: 'index.js' },
        'buffer': { format: 'cjs', defaultExtension: 'js', main: 'index.js' },
        'brace': {
            format: 'cjs', defaultExtension: 'js', main: 'index.js'
        },
        'js-beautify': { format: 'cjs', defaultExtension: 'js', main: '/js/index.js' }
    };

    var ngPackageNames = [
        'animations',
        'common',
        'compiler',
        'core',
        'flex-layout',
        'forms',
        'http',
        'material',
        'cdk',
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
        packages['@angular/' + pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);

    return {
        map: map,
        packages: packages,
        paths: {
            'npm:': 'node_modules/',
            'brace/theme/*': 'npm:brace/theme/*.js',
            'brace/mode/*': 'npm:brace/mode/*.js'
        }
    };
});