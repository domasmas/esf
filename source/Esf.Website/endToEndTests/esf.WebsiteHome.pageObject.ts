import Promise = webdriver.promise.Promise;

export class EsfHome {
    navigate(): void {
        browser.get('http://localhost:40082');  
    }
    getPageTitle(): Promise<string> {
        return browser.getTitle();
    }

    hasMappingSection(): Promise<boolean> {
        var mappingElement = element(by.cssContainingText('label', 'Mapping'));
        return mappingElement.isPresent();
    }

    getMappingSectionContent(): Promise<string> {
        var mappingContentElement = element(by.css('.mapping-editor .ace_content'));
        return mappingContentElement.getText();
    }
    
    hasQuerySection(): Promise<boolean> {
        var querySection = element(by.cssContainingText('label', 'Query'));
        return querySection.isPresent();
    }

    getQuerySectionContent(): Promise<string> {
        var queryContentElement = element(by.css('.query-editor .ace_content'));
        return queryContentElement.getText();
    }

    hasDocumentsSection(): Promise<boolean> {
        var documentsSection = element(by.cssContainingText('label', 'Documents'));
        return documentsSection.isPresent();
    }

    getDocumentsSectionContent(): Promise<string> {
        var documentsContentElement = element(by.css('.documents-editor .ace_content'));
        return documentsContentElement.getText();
    }

    hasResultSection(): Promise<boolean> {
        var resultSection = element(by.cssContainingText('label', 'Result'));
        return resultSection.isPresent();
    }

    hasSaveCommand(): Promise<boolean> {
        var saveCommand = element(by.cssContainingText('.btn', 'Save'));
        return saveCommand.isPresent();
    }

    hasRunCommand(): Promise<boolean> {
        var runCommand = element(by.cssContainingText('.btn', 'Run'));
        return runCommand.isPresent();
    }

    getResultContent(): Promise<string> {
        var resultElement = element(by.css('.result-viewer .ace_content'));
        return resultElement.getText();
    }
}


export var esfHome = new EsfHome();