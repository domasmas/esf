import { EsfHome } from './esf.WebsiteHome.pageObject';
import { protractor, browser } from 'protractor';

describe('Given Esf.Website home page', function () {
    describe('when navigating to it', function () {
        var esfHome: EsfHome;
        beforeAll(() => {
            esfHome = new EsfHome(browser);
            esfHome.navigate();
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

        it('should have initial mapping state', () => {
            var mappingContent = esfHome.getMappingSectionContent();
            expect(mappingContent).toEqual('{"properties": {"message": {"type": "string", "store": true}}}');
        });

        it('should have initial query state', () => {
            var queryContent = esfHome.getQuerySectionContent();
            expect(queryContent).toEqual('{"match": {"message": "fox"}}');
        });

        it('should have initial documents state', () => {
            var documentsContent = esfHome.getDocumentsSectionContent();
            expect(documentsContent).toEqual('[{ "message": "very good message" }, { "message": "message with fox" }]');
        });

        it('should have empty result state', () => {
            var resultContent = esfHome.getResultContent();
            expect(resultContent).toEqual('');
        });
    });

    describe('persist state', () => {
        var esfHome: EsfHome;
        beforeEach(() => {
            esfHome = new EsfHome(browser);
            esfHome.navigate();
        });
        describe('when the initial state is changed', () => {
            beforeEach(() => {
                var mapping: string = '{"properties": {"comment": {"type": "string"}}}';
                esfHome.setMappingSectionContent(mapping);

                var documents: string = '[ {"comment": "good"}, {"comment": "bad"} ]';
                esfHome.setDocumentsSectionContent(documents);

                var query: string = '{ "match": { "comment": "bad" } }';
                esfHome.setQuerySectionContent(query);

                expect(esfHome.getMappingSectionContent()).toEqual(mapping);
                expect(esfHome.getDocumentsSectionContent()).toEqual(documents);
                expect(esfHome.getQuerySectionContent()).toEqual(query);
                expect(esfHome.isUrlOfExistingState()).toBe(false);
            });

            it('should be able to save it', () => {
                esfHome.executeSaveCommand();
                expect(esfHome.isUrlOfExistingState()).toBe(true);
            });

            it('should not change URL if parameters havent changed', () => {
                esfHome.executeSaveCommand();

                browser.getCurrentUrl().then((url1: string) => {
                    esfHome.executeSaveCommand();

                    expect(browser.getCurrentUrl()).toEqual(url1);
                });
            });

            it('should change URL if parameters have changed', () => {
                browser.getCurrentUrl().then((url1: string) => {
                    var query: string = '{ "p2": "v2"}';
                    esfHome.setQuerySectionContent(query);
                    esfHome.executeSaveCommand();

                    expect(browser.getCurrentUrl()).not.toEqual(url1);
                });
            });
        });

        it('should be able to view a saved state in new browser', () => {
            var documents: string = '[ {"comment": "good"}, {"comment": "bad"} ]';
            esfHome.setDocumentsSectionContent(documents);
            esfHome.executeSaveCommand();
            esfHome.navigateToCurrentUrlWithNewBrowser().then((esfHome2: EsfHome) => {
                expect(esfHome2.getDocumentsSectionContent()).toEqual(documents);
                expect(esfHome.isUrlOfExistingState()).toBe(true);
                esfHome2.quitBrowser();
            });
        });

        it('should be able to change a saved state and save it', () => {
            var documents: string = '[ {"comment": "good"}, {"comment": "bad"} ]';
            esfHome.setDocumentsSectionContent(documents);
            esfHome.executeSaveCommand();
            esfHome.navigateToCurrentUrlWithNewBrowser().then((esfHome2: EsfHome) => {
                var furtherChangedDocuments: string = '[ {"comment": "changed"}, { "comment": "new" }, {"comment" : "more"}]';
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

