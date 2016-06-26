var map = {
    'app': 'wwwroot/app',
    'rxjs': 'wwwroot/lib',
    'zonejs': 'wwwroot/lib/zone.js',
    'reflect-metadata': 'wwwroot/lib/reflect-metadata',
    '@angular': 'wwwroot/lib'
};

var packages = {
    'app': { main: 'main', defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' },
    'zonejs': { main: 'zone', defaultExtension: 'js' },
    'reflect-metadata': { main: 'Reflect', defaultExtension: 'js' }
};

var packageNames = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/http',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
  '@angular/router-deprecated',
  '@angular/testing',
  '@angular/upgrade'
];

packageNames.forEach(function (pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});

System.config({
    baseURL: '/',
    map: map,
    packages: packages
});