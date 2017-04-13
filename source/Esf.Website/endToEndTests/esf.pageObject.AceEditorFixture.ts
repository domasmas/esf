import { ProtractorBrowser } from 'protractor';
import { promise as webDriverPromise } from 'selenium-webdriver';

export interface IJsonEditor extends AceEditorFixture {
}

export class AceEditorFixture {
	constructor(private browserInstance: ProtractorBrowser, private cssSelector: string, private emptyContent: any) {
	}

	private getSerializedContent(): webDriverPromise.Promise<string> {
		return this.browserInstance.executeScript(function () {
			var sectionCss: string = arguments[0];
			var getAceEditor = (sectionCss: string): AceAjax.Editor => {
				var aceEditorElement: any = document.querySelector(sectionCss);
				var aceEditor: AceAjax.Editor = aceEditorElement.env.editor;
				return aceEditor;
			};

			var aceEditor = getAceEditor(sectionCss);
			return aceEditor.getValue();
		}, this.cssSelector);
	}

	getContent(): webDriverPromise.Promise<Object> {
		return this.getSerializedContent().then((serializedContent: string) => {
			try {
				if (serializedContent) {
					return JSON.parse(serializedContent);
				}
				else {
					return this.emptyContent;
				}
			}
			catch (e) {
				throw new Error('cannot deserialize: ' + serializedContent);
			}
		});
	}

	private setSerializedContent(serializedJson: string): webDriverPromise.Promise<void> {
		return this.browserInstance.executeScript(function setAceEditorContentContent() {
			var sectionCss: string = arguments[0];
			var serializedContent: string = arguments[1];
			var getAceEditor = (sectionCss: string): AceAjax.Editor => {
				var aceEditorElement: any = document.querySelector(sectionCss);
				var aceEditor: AceAjax.Editor = aceEditorElement.env.editor;
				return aceEditor;
			};
			var aceEditor = getAceEditor(sectionCss);
			aceEditor.setValue(serializedContent);
			aceEditor.clearSelection();
		}, this.cssSelector, serializedJson);
	}

	setContent(content: Object | Object[]): webDriverPromise.Promise<void> {
		var serializedContent = JSON.stringify(content);
		return this.setSerializedContent(serializedContent);
	}
}