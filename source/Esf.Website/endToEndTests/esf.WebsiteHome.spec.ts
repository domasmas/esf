import { EsfHome } from './esf.WebsiteHome.pageObject';

describe('Given Esf.Website home page', function () {
    describe('when navigating to it', function () {
        var esfHome: EsfHome;
        beforeAll(() => {
            esfHome = new EsfHome(browser);
            esfHome.navigate();
        });
        beforeEach(() => {
            browser.ignoreSynchronization = true;//workaround need to fix this
        });
        afterEach(() => {
            browser.ignoreSynchronization = false;//workaround need to fix this            
        });

        it('should have title Elasticsearch Fiddler', () => {
            expect(esfHome.getPageTitle()).toEqual('Elasticsearch Fiddler');
        });

        it('should have Mapping section', () => {
            expect(esfHome.hasMappingSection()).toBe(true);
        });

        it('should have Documents section', () => {
            expect(esfHome.hasDocumentsSection()).toBe(true);
        });

        it('should have Query section', () => {
            expect(esfHome.hasQuerySection()).toBe(true);
        });

        it('should have Result section', () => {
            expect(esfHome.hasResultSection()).toBe(true);
        });

        it('should have Run command', () => {
            expect(esfHome.hasRunCommand()).toBe(true);
        });

        it('should have Save command', () => {
            expect(esfHome.hasSaveCommand()).toBe(true);
        });
    });

    describe('initial state', () => {
        var esfHome: EsfHome;
        beforeAll(() => {
            esfHome = new EsfHome(browser);
            esfHome.navigate();
        });
        beforeEach(() => {
            browser.ignoreSynchronization = true;//workaround need to fix this
        });
        afterEach(() => {
            browser.ignoreSynchronization = false;//workaround need to fix this
        });

        it('should have initial mapping state', () => {
            var mappingContent = esfHome.getMappingSectionContent();
            expect(mappingContent).toEqual('{"prop1":"value1"}');
        });

        it('should have initial query state', () => {
            var queryContent = esfHome.getQuerySectionContent();
            expect(queryContent).toEqual('{"prop1":"value1"}');
        });

        it('should have initial documents state', () => {
            var documentsContent = esfHome.getDocumentsSectionContent();
            expect(documentsContent).toEqual('[{"prop1":"value1"}, {"prop1":"value1"}]');
        });

        it('should have empty result state', () => {
            var resultContent = esfHome.getResultContent();
            expect(resultContent).toEqual('');
        });
    });

    describe('persist state', () => {
        var esfHome: EsfHome;        
        beforeAll(() => {
            esfHome = new EsfHome(browser);
            esfHome.navigate();
        });
        beforeEach(() => {
            browser.ignoreSynchronization = true;//workaround need to fix this
        });
        afterEach(() => {
            browser.ignoreSynchronization = false;//workaround need to fix this
        });

        it('should be able to change the initial state and save it', () => {        
            var mapping: string = '{"item2", "value of item1", "extraProp" : 55}';   
            esfHome.setMappingSectionContent(mapping);

            var documents: string = '[ {"prop1":"value1"}, {"something else": "my value"}]';
            esfHome.setDocumentsSectionContent(documents);

            var query: string = '{ somethingMoreSpecial: "Tadaa!"}';
            esfHome.setQuerySectionContent(query);

            expect(esfHome.getMappingSectionContent()).toEqual(mapping); 
            expect(esfHome.getDocumentsSectionContent()).toEqual(documents);
            expect(esfHome.getQuerySectionContent()).toEqual(query);
            expect(esfHome.isUrlOfExistingState()).toBe(false);

            esfHome.executeSaveCommand();
            expect(esfHome.isUrlOfExistingState()).toBe(true);
        });

        it('should be able to view a saved state in new browser', () => {
           var documents: string = '[ {"prop1":"value1"}, {"something else": "my value"}]';
            esfHome.setDocumentsSectionContent(documents);
            esfHome.executeSaveCommand();
            esfHome.navigateToCurrentUrlWithNewBrowser().then((esfHome2: EsfHome) => {
                expect(esfHome2.getDocumentsSectionContent()).toEqual(documents);
                expect(esfHome.isUrlOfExistingState()).toBe(true);
                esfHome2.quitBrowser();
            });             
        });

        it('should be able to change a saved state and save it', () => {
            var documents: string = '[ {"prop1":"value1"}, {"something else": "my value"}]';
            esfHome.setDocumentsSectionContent(documents);
            esfHome.executeSaveCommand();
            esfHome.navigateToCurrentUrlWithNewBrowser().then((esfHome2: EsfHome) => {
                var furtherChangedDocuments: string = '[ {"prop1":"value44 changed"}, {"something": "val"}]';
                esfHome2.setDocumentsSectionContent(furtherChangedDocuments);                
                esfHome2.executeSaveCommand();
                esfHome2.navigateToCurrentUrlWithNewBrowser().then((esfHome3: EsfHome) => {
                    expect(esfHome2.getDocumentsSectionContent()).toEqual(furtherChangedDocuments);
                    expect(esfHome3.getDocumentsSectionContent()).toEqual(furtherChangedDocuments);
                                        
                    esfHome2.quitBrowser();
                    esfHome3.quitBrowser();
                });  
            });  
        }); 
    });
});

