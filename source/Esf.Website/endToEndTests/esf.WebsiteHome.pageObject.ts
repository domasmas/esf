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

    hasQuerySection(): Promise<boolean> {
        var querySection = element(by.cssContainingText('label', 'Query'));
        return querySection.isPresent();
    }

    hasDocumentsSection(): Promise<boolean> {
        var documentsSection = element(by.cssContainingText('label', 'Documents'));
        return documentsSection.isPresent();
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
}


export var esfHome = new EsfHome();