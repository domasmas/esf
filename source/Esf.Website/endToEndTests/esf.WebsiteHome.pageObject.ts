import Promise = webdriver.promise.Promise;

export class EsfHome {
    constructor(private browserInstance: protractor.Protractor) {
    }

    navigate(): void {
        this.browserInstance.get('http://localhost:40082');  
    }

    private navigateToUrl(url: string): void {
        this.browserInstance.get(url);
    }

    navigateToCurrentUrlWithNewBrowser(): Promise<EsfHome> {
        var esfHome2 = new EsfHome(browser.forkNewDriverInstance());
        var deferredResult = protractor.promise.defer<EsfHome>();
        this.getCurrentUrl().then((url) => {  
            esfHome2.browserInstance.ignoreSynchronization = false;          
            esfHome2.navigateToUrl(url);  
            esfHome2.browserInstance.ignoreSynchronization = true;

            deferredResult.fulfill(esfHome2);
        });
        return deferredResult.promise;
    }

    quitBrowser(): void {
        this.browserInstance.ignoreSynchronization = false;
        this.browserInstance.quit();
    }

    getPageTitle(): Promise<string> {
        return this.browserInstance.getTitle();
    }

    getCurrentUrl(): Promise<string> {
        return this.browserInstance.getCurrentUrl();
    }

    hasMappingSection(): Promise<boolean> {
        var mappingElement = this.browserInstance.element(by.cssContainingText('label', 'Mapping'));
        return mappingElement.isPresent();
    }

    getMappingSectionContent(): Promise<string> {
        var mappingContentElement = this.browserInstance.element(by.css('.mapping-editor .ace_content'));
        return mappingContentElement.getText();
    }
    
    private setSectionContent(sectionCss: string, content: string): void {
        var mappingInputElement = this.browserInstance.element(by.css(`${sectionCss} .ace_text-input`));
        //delete input
        mappingInputElement.sendKeys(protractor.Key.CONTROL, 'а');
        mappingInputElement.sendKeys(protractor.Key.DELETE);
        //provide new input
        mappingInputElement.sendKeys(content);
    }

    setMappingSectionContent(content: string): void {
        this.setSectionContent('.mapping-editor', content);
    }

    hasQuerySection(): Promise<boolean> {
        var querySection = this.browserInstance.element(by.cssContainingText('label', 'Query'));
        return querySection.isPresent();
    }

    getQuerySectionContent(): Promise<string> {
        var queryContentElement = this.browserInstance.element(by.css('.query-editor .ace_content'));
        return queryContentElement.getText();
    }

    setQuerySectionContent(content: string): void {
        this.setSectionContent('.query-editor', content);
    }

    hasDocumentsSection(): Promise<boolean> {
        var documentsSection = this.browserInstance.element(by.cssContainingText('label', 'Documents'));
        return documentsSection.isPresent();
    }

    getDocumentsSectionContent(): Promise<string> {
        var documentsContentElement = this.browserInstance.element(by.css('.documents-editor .ace_content'));
        return documentsContentElement.getText();
    }

    setDocumentsSectionContent(content: string): void {
        this.setSectionContent('.documents-editor', content);
    }

    hasResultSection(): Promise<boolean> {
        var resultSection = this.browserInstance.element(by.cssContainingText('label', 'Result'));
        return resultSection.isPresent();
    }

    private getSaveCommandElement(): protractor.ElementFinder {
        return this.browserInstance.element(by.css('.save-command'));
    }

    hasSaveCommand(): Promise<boolean> {
        return this.getSaveCommandElement().isPresent();
    }

    executeSaveCommand(): Promise<void> {
        var saveCommandElement = this.getSaveCommandElement();
        return saveCommandElement.click();
    }
    
    hasRunCommand(): Promise<boolean> {
        var runCommand = this.browserInstance.element(by.css('.run-command'));
        return runCommand.isPresent();
    }


    getResultContent(): Promise<string> {
        var resultElement = this.browserInstance.element(by.css('.result-viewer .ace_content'));
        return resultElement.getText();
    }

    isUrlOfExistingState(): Promise<boolean> {
        return this.browserInstance.getCurrentUrl().then((url: string) => {
            return /(https{0,1}:\/{0,2}){0,1}(\w*):*\d*\/state\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(url);
        });
    }
}