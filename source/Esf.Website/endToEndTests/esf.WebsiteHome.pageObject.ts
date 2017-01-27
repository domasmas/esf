/// <reference types="selenium-webdriver" />
import { protractor, Ptor, browser, ProtractorBrowser, by, ElementFinder, element } from 'protractor';
import { promise as webDriverPromise }  from 'selenium-webdriver';

export class EsfHome {
    constructor(private browserInstance: ProtractorBrowser) {
    }

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
        return this.browserInstance.getTitle();
    }

    getCurrentUrl(): webDriverPromise.Promise<string> {
        return this.browserInstance.getCurrentUrl();
    }

    hasMappingSection(): webDriverPromise.Promise<boolean> {
        var mappingElement = this.browserInstance.element(by.cssContainingText('label', 'Mapping'));
        return mappingElement.isPresent();
    }

    getMappingSectionContent(): webDriverPromise.Promise<string> {
        return this.getSectionText('.mapping-editor');
    }

    private removeClosingBrase(content: string): string {
        if (!content && content.length === 0) {
            return '';
        }
        let contentLastChar = content[content.length - 1];
        if (contentLastChar === '}' || contentLastChar === ']') {
            return content.substring(0, content.length - 1);
        }
    }

    private setSectionContent(sectionCss: string, content: string): webDriverPromise.Promise<void> {
        var inputElement = this.browserInstance.element(by.css(`${sectionCss} .ace_text-input`));
        //delete input       
        inputElement.clear();
        content = this.removeClosingBrase(content);
        return inputElement.sendKeys(content);
    }

    setMappingSectionContent(content: string): webDriverPromise.Promise<void> {
        return this.setSectionContent('.mapping-editor', content);
    }

    hasQuerySection(): webDriverPromise.Promise<boolean> {
        var querySection = this.browserInstance.element(by.cssContainingText('label', 'Query'));
        return querySection.isPresent();
    }

    getQuerySectionContent(): webDriverPromise.Promise<string> {
        return this.getSectionText('.query-editor');
    }

    setQuerySectionContent(content: string): webDriverPromise.Promise<void> {
        return this.setSectionContent('.query-editor', content);
    }

    hasDocumentsSection(): webDriverPromise.Promise<boolean> {
        var documentsSection = this.browserInstance.element(by.cssContainingText('label', 'Documents'));
        return documentsSection.isPresent();
    }

    getDocumentsSectionContent(): webDriverPromise.Promise<string> {
        return this.getSectionText('.documents-editor');
    }

    setDocumentsSectionContent(content: string): webDriverPromise.Promise<void> {
        return this.setSectionContent('.documents-editor', content);
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
    
    hasRunCommand(): webDriverPromise.Promise<boolean> {
        var runCommand = this.browserInstance.element(by.css('.run-command'));
        return runCommand.isPresent();
    }

    getResultContent(): webDriverPromise.Promise<string> {
        return this.getSectionText('.result-viewer');
    }

    private getSectionText(sectionClass: string): webDriverPromise.Promise<string> {        
        let sectionText: webDriverPromise.Promise<string> = this.browserInstance.element(by.css(`${sectionClass} .ace_content`)).getAttribute('innerText');
        let trimUnnecessaryWhitespace = (content: string) => content.trim();
        return sectionText.then(trimUnnecessaryWhitespace);
    }

    isUrlOfExistingState(): webDriverPromise.Promise<boolean> {
        return this.browserInstance.getCurrentUrl().then((url: string) => 
            /(https{0,1}:\/{0,2}){0,1}(\w*):*\d*\/state\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(url)
        );
    }
}