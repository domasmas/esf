exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['wwwroot/endToEndTests/**/*.spec.js'],
    useAllAngular2AppRoots: true
};