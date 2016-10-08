import { esfHome } from './esf.WebsiteHome.pageObject';

describe('Given Esf.Website home page', function () {
    describe('when navigating to it', function () {
        beforeAll(() => {
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
        beforeAll(() => {
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

    describe('save state', () => {
        beforeAll(() => {
            esfHome.navigate();
        });
        beforeEach(() => {
            browser.ignoreSynchronization = true;//workaround need to fix this
        });
        afterEach(() => {
            browser.ignoreSynchronization = false;//workaround need to fix this
        });


    });
});

