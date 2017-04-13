/// <reference types="selenium-webdriver" />
import { protractor, Ptor, browser, ProtractorBrowser, by, ElementFinder, element, WebElementPromise, WebElement } from 'protractor';
import { promise as webDriverPromise }  from 'selenium-webdriver';
import { AceEditorFixture, IJsonEditor } from './esf.pageObject.AceEditorFixture';

export class EsfHome {
	constructor(private browserInstance: ProtractorBrowser) {
		this.queryEditor = new AceEditorFixture(browserInstance, '.query-editor', EsfHome.emptySectionContent);
		this.mappingEditor = new AceEditorFixture(browserInstance, '.mapping-editor', EsfHome.emptySectionContent);
		this.documentsEditor = new AceEditorFixture(browserInstance, '.documents-editor', EsfHome.emptySectionContent);
		this.resultViewer = new AceEditorFixture(browserInstance, '.result-viewer', EsfHome.emptySectionContent);
    }

	private queryEditor: IJsonEditor;
	private mappingEditor: IJsonEditor;
	private documentsEditor: IJsonEditor;
	private resultViewer: IJsonEditor;

    navigate(): void {
        this.browserInstance.get('http://localhost:40082');  
    }

    private navigateToUrl(url: string): void {
        this.browserInstance.get(url);
    }

    navigateToCurrentUrlWithNewBrowser(): webDriverPromise.Promise<EsfHome> {
        var esfHome2 = new EsfHome(browser.forkNewDriverInstance());
        var deferredResult = webDriverPromise.defer<EsfHome>();
        this.getCurrentUrl().then((url) => {         
            esfHome2.navigateToUrl(url);  

            deferredResult.fulfill(esfHome2);
        });
        return deferredResult.promise;
    }

    quitBrowser(): void {
        this.browserInstance.quit();
    }

	getPageTitle(): webDriverPromise.Promise<string> {
		this.waitUntilAngularPageIsLoaded();
        return this.browserInstance.getTitle();
    }

	private waitUntilAngularPageIsLoaded(): webDriverPromise.Promise<void> {
		return this.browserInstance.wait(() => this.browserInstance.element(by.css('esf-app router-outlet')).isPresent());
	}

    getCurrentUrl(): webDriverPromise.Promise<string> {
        return this.browserInstance.getCurrentUrl();
    }

    hasMappingSection(): webDriverPromise.Promise<boolean> {
        var mappingElement = this.browserInstance.element(by.cssContainingText('label', 'Mapping'));
        return mappingElement.isPresent();
    }

    getMappingSectionContent(): webDriverPromise.Promise<Object> {
        return this.mappingEditor.getContent();
    }

    setMappingSectionContent(content: Object): webDriverPromise.Promise<void> {
        return this.mappingEditor.setContent(content);
    }

    hasQuerySection(): webDriverPromise.Promise<boolean> {
        var querySection = this.browserInstance.element(by.cssContainingText('label', 'Query'));
        return querySection.isPresent();
    }

    getQuerySectionContent(): webDriverPromise.Promise<Object> {
        return this.queryEditor.getContent();
    }

    setQuerySectionContent(content: Object): webDriverPromise.Promise<void> {
        return this.queryEditor.setContent(content);
    }

    hasDocumentsSection(): webDriverPromise.Promise<boolean> {
        var documentsSection = this.browserInstance.element(by.cssContainingText('label', 'Documents'));
        return documentsSection.isPresent();
    }

    getDocumentsSectionContent(): webDriverPromise.Promise<Object> {
        return this.documentsEditor.getContent();
    }

    setDocumentsSectionContent(content: Object[]): webDriverPromise.Promise<void> {
        return this.documentsEditor.setContent(content);
    }

    hasResultSection(): webDriverPromise.Promise<boolean> {
        var resultSection = this.browserInstance.element(by.cssContainingText('label', 'Result'));
        return resultSection.isPresent();
    }

    private getSaveCommandElement(): ElementFinder {
        return this.browserInstance.element(by.css('.save-command'));
    }

    hasSaveCommand(): webDriverPromise.Promise<boolean> {
        return this.getSaveCommandElement().isPresent();
    }

    executeSaveCommand(): webDriverPromise.Promise<void> {
        var saveCommandElement = this.getSaveCommandElement();
        return saveCommandElement.click().then(() => {
            this.browserInstance.sleep(500); //workaround for "Error while waiting for Protractor to sync"
        });
    }
    
    executeRunCommand(): webDriverPromise.Promise<void> {
        var runCommandElement = this.getRunCommandElement();
        return runCommandElement.click().then(() => {
            this.browserInstance.sleep(2000); //workaround for "Error while waiting for Protractor to sync"
        });
    }

    private getRunCommandElement(): ElementFinder {
        return this.browserInstance.element(by.css('.run-command'));
    }

    hasRunCommand(): webDriverPromise.Promise<boolean> {
        return this.getRunCommandElement().isPresent();
    }

    getResultContent(): webDriverPromise.Promise<any> {
		return this.resultViewer.getContent();
    }

	static readonly emptySectionContent: undefined; 

    isUrlOfExistingState(): webDriverPromise.Promise<boolean> {
        return this.browserInstance.getCurrentUrl().then((url: string) => 
            /(https{0,1}:\/{0,2}){0,1}(\w*):*\d*\/state\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(url)
        );
    }
}