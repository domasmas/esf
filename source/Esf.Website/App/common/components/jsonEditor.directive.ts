/// <reference path="../../../typings/globals/ace/index.d.ts" />

// Based on https://github.com/fxmontigny/ng2-ace-editor/blob/master/src/index.ts
// Migrate to NPM package instead, once they have fixed their type definitions

import { Directive, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import 'brace';
import 'brace/theme/monokai';
import 'brace/mode/html';
import 'brace/theme/chrome';
import 'brace/mode/json';
 
declare var ace: AceAjax.Ace;
 
@Directive({
    selector: '[ace-editor]',
    inputs: ['text', 'mode', 'theme', 'readOnly', 'options'],
    outputs: ['textChanged']
}) 
export class JsonEditorDirective {
    @Output('textChanged') textChanged = new EventEmitter();

    _readOnly: boolean = false; 
    editor: AceAjax.Editor;
    oldText: string;

    constructor(elementRef: ElementRef) {
        let el = elementRef.nativeElement;
        this.editor = ace["edit"](el);

        this.init();
        this.initEvents();
        console.log(this.editor);
    }

    init() {
        this.editor.setOptions({ maxLines: 1000, printMargin: false });
        this.editor.setTheme('ace/theme/chrome');
        this.editor.getSession().setMode('ace/mode/json');
        this.editor.setReadOnly(this._readOnly);
    }

    initEvents() {
        this.editor.on('change', () => {
            let newVal = this.editor.getValue();
            if (newVal === this.oldText) return;
            if (typeof this.oldText !== 'undefined')
                this.textChanged.emit(newVal);
            this.oldText = newVal;
        });
    }

    @Input() set readOnly(readOnly: boolean) {
        this._readOnly = readOnly;
        this.editor.setReadOnly(readOnly);
    }

    @Input() set text(text: string) {
        if (text == null)
            text = "";

        if (typeof text != 'string')
            text = JSON.stringify(text);

        this.editor.setValue(text);
        this.editor.clearSelection();
        this.editor.focus();
    }
}