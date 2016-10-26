exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['wwwroot/endToEndTests/**/*.spec.js'],
    rootElement: 'esf-app',
    capabilities: {
        'browserName': 'chrome'
    },
    framework: 'jasmine'
};