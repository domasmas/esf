exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['wwwroot/app/endToEndTests/todo.spec.js'],
    useAllAngular2AppRoots: true
};