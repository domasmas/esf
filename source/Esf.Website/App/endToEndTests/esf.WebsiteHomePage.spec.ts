describe('Esf.Website home page', function () {
    it('should be able to navigate to it', function () {
        browser.get('http://localhost:40082');   
        browser.ignoreSynchronization = true;

        expect(browser.getTitle()).toEqual('Elasticsearch Fiddler');

        var mappingSection: protractor.ElementFinder = element(by.cssContainingText('label', 'Mapping'));
        expect(mappingSection.isPresent()).toBe(true);        

        var querySection: protractor.ElementFinder = element(by.cssContainingText('label', 'Query'));
        expect(querySection.isPresent()).toBe(true);    

        var documentsSection: protractor.ElementFinder = element(by.cssContainingText('label', 'Documents'));
        expect(querySection.isPresent()).toBe(true);  

        var documentsSection: protractor.ElementFinder = element(by.cssContainingText('label', 'Result'));
        expect(querySection.isPresent()).toBe(true);     

        var runCommand: protractor.ElementFinder = element(by.cssContainingText('.btn', 'Run'));
        expect(runCommand.isPresent()).toBe(true);  

        var saveCommand: protractor.ElementFinder = element(by.cssContainingText('.btn', 'Save'));
        expect(saveCommand.isPresent()).toBe(true);  
    });
});

