describe('Esf.Website home page', function () {
    it('should be able to navigate to it', function () {
        browser.get('http://localhost:40082');           

        browser.ignoreSynchronization = true;//workaround need to fix this

        expect(browser.getTitle()).toEqual('Elasticsearch Fiddler');

        var mappingSection: protractor.ElementFinder = element(by.cssContainingText('label', 'Mapping'));
        expect(mappingSection.isPresent()).toBe(true, 'mappingSection');        

        var querySection: protractor.ElementFinder = element(by.cssContainingText('label', 'Query'));
        expect(querySection.isPresent()).toBe(true, 'querySection');    

        var documentsSection: protractor.ElementFinder = element(by.cssContainingText('label', 'Documents'));
        expect(documentsSection.isPresent()).toBe(true, 'documentsSection');  

        var resultSection: protractor.ElementFinder = element(by.cssContainingText('label', 'Result'));
        expect(resultSection.isPresent()).toBe(true, 'resultSection');     

        var runCommand: protractor.ElementFinder = element(by.cssContainingText('.btn', 'Run'));
        expect(runCommand.isPresent()).toBe(true, 'runCommand');  

        var saveCommand: protractor.ElementFinder = element(by.cssContainingText('.btn', 'Save'));
        expect(saveCommand.isPresent()).toBe(true, 'saveCommand');  

        browser.ignoreSynchronization = false;
    });
});

