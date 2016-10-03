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
});

