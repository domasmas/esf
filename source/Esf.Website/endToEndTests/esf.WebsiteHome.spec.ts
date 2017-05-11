import { EsfHome } from './esf.WebsiteHome.pageObject';
import { protractor, browser } from 'protractor';
import '../App/testsFramework/jasmineExtraMatchers';

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
            expect(mappingContent).toEqualAsJson({ "properties": { "message": { "type": "string", "store": true } } });
        });

        it('should have initial query state', () => {
            var queryContent = esfHome.getQuerySectionContent();
            expect(queryContent).toEqualAsJson({ "query": { "match": { "message": "fox" } } });
        });

        it('should have initial documents state', () => {
            var documentsContent = esfHome.getDocumentsSectionContent();
            expect(documentsContent).toEqualAsJson([{ "message": "very good message" }, { "message": "message with fox" }]);
        });

        it('should have empty result state', () => {
            var resultContent = esfHome.getResultContent();
            expect(resultContent).toEqualAsJson(EsfHome.emptySectionContent);
        });

		it('should disable the save command before making changes', () => {
			expect(esfHome.isSaveCommandDisabled()).toBe(true);
		});

        it('should be able to run query', (done: () => void) => {
            esfHome.executeRunCommand();
            var resultContent = esfHome.getResultContent();
            var expected_source = { "message": "message with fox" };
            resultContent.then((content: any) => {
                expect(content.hits.total).toEqual(1);
                expect(content.hits.hits[0]._source).toEqualAsJson(expected_source);
                done();
            });

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
                var mapping = { "properties": { "comment": { "type": "string" } } };
                esfHome.setMappingSectionContent(mapping);

                var documents = [ { "comment": "good" }, { "comment": "bad" } ];
                esfHome.setDocumentsSectionContent(documents);

                var query = { "query": { "match": { "comment": "bad" } } };
                esfHome.setQuerySectionContent(query);

                expect(esfHome.getMappingSectionContent()).toEqualAsJson(mapping);
                expect(esfHome.getDocumentsSectionContent()).toEqualAsJson(documents);
                expect(esfHome.getQuerySectionContent()).toEqualAsJson(query);
                expect(esfHome.isUrlOfExistingState()).toBe(false);
            });

            it('should be able to save it', () => {
                esfHome.executeSaveCommand();
                expect(esfHome.isUrlOfExistingState()).toBe(true);
            });

            it('should be able to run query', (done: () => void) => {
                esfHome.executeRunCommand();
                var resultContent = esfHome.getResultContent();
                var expected_source = { "comment": "bad" };
                resultContent.then((content: any) => {
                    expect(content.hits.total).toEqual(1);
                    expect(content.hits.hits[0]._source).toEqualAsJson(expected_source);
                    done();
                });
            });

            it('should not change URL if parameters havent changed', () => {
                esfHome.executeSaveCommand();

				browser.getCurrentUrl().then((url1: string) => {
					expect(esfHome.isSaveCommandDisabled()).toBe(true, 'Save command must be disabled');
					esfHome.executeSaveCommand();
					expect(browser.getCurrentUrl()).toEqual(url1, 'URL must not change');
                });
            });

            it('should change URL if parameters have changed', () => {
                browser.getCurrentUrl().then((url1: string) => {
                    var query = { "filter": { "term": { "nothing": "no" } } };
                    esfHome.setQuerySectionContent(query);
                    esfHome.executeSaveCommand();

                    expect(browser.getCurrentUrl()).not.toEqual(url1);
                });
            });
        });

        it('should be able to view a saved state in new browser', () => {
            var documents = [{ "comment": "good" }, { "comment": "bad" }];
            esfHome.setDocumentsSectionContent(documents);
            esfHome.executeSaveCommand();
            esfHome.navigateToCurrentUrlWithNewBrowser().then((esfHome2: EsfHome) => {
                expect(esfHome2.getDocumentsSectionContent()).toEqualAsJson(documents);
                expect(esfHome.isUrlOfExistingState()).toBe(true);
                esfHome2.quitBrowser();
            });
        });

        it('should be able to change a saved state and save it', () => {
            var documents = [{ "comment": "good" }, { "comment": "bad" }];
            esfHome.setDocumentsSectionContent(documents);
            esfHome.executeSaveCommand();
            esfHome.navigateToCurrentUrlWithNewBrowser().then((esfHome2: EsfHome) => {
                var furtherChangedDocuments = [{ "comment": "changed" }, { "comment": "new" }, { "comment": "more" }];
                esfHome2.setDocumentsSectionContent(furtherChangedDocuments);
                esfHome2.executeSaveCommand();
                esfHome2.navigateToCurrentUrlWithNewBrowser().then((esfHome3: EsfHome) => {
                    expect(esfHome2.getDocumentsSectionContent()).toEqualAsJson(furtherChangedDocuments);
                    expect(esfHome3.getDocumentsSectionContent()).toEqualAsJson(furtherChangedDocuments);

                    esfHome2.quitBrowser();
                    esfHome3.quitBrowser();
                });
            });
        });
    });
});

