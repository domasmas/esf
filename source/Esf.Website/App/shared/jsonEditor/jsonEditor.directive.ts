/// <reference path="../../../node_modules/@types/ace/index.d.ts" />

// Based on https://github.com/fxmontigny/ng2-ace-editor
// Migrate to NPM package instead, once they have fixed their type definitions
import { Directive, EventEmitter, ElementRef, Input, Output, NgZone } from '@angular/core';
import 'brace';
import 'brace/theme/monokai';
import 'brace/mode/json';
import 'brace/theme/chrome';
import * as js_beautify from 'js-beautify';

@Directive({
    selector: '[json-editor]'
})
export class JsonEditorDirective {
    @Output() textChange = new EventEmitter();

    _readOnly: boolean = false;
    editor: any;
    oldText: string;	

    constructor(elementRef: ElementRef, private zone: NgZone) {
        let el = elementRef.nativeElement;
        zone.runOutsideAngular(() => {
            this.editor = ace["edit"](el);
            this.init();
        });
        this.initEvents();
    }

    init() {
        this.editor.setTheme('ace/theme/chrome');
        this.editor.getSession().setMode('ace/mode/json');
        this.editor.setReadOnly(this._readOnly);
        this.editor.$blockScrolling = Infinity;
    }

    initEvents() {
        this.zone.runOutsideAngular(() => {
            this.editor.on('change', () => {
                if (this._readOnly)
                    return;

                let newVal = this.editor.getValue();

                this.zone.run(() => {
                    if (newVal === this.oldText) return;

                    if (typeof this.oldText !== 'undefined') {
                        this.textChange.emit(newVal);
                    }

                    this.oldText = newVal;
                    this.text = newVal;
                });
            });
        });
    }

    @Input() set readOnly(readOnly: boolean) {
        this._readOnly = readOnly;
        this.zone.runOutsideAngular(() => {
            this.editor.setReadOnly(readOnly);
            if (readOnly) {
                this.editor.setOptions({
                    highlightActiveLine: false,
                    highlightGutterLine: false
                });
                this.editor.renderer.hideCursor();
            }
        });
    }

    @Input() set text(text: string) {
        if (text == null)
            text = "";

        if (typeof text != 'string')
            text = String(text);

        if (text == this.oldText)
            return;
		this.zone.runOutsideAngular(() => {
			text = js_beautify(text, { indent_size: 2 });
			this.editor.setValue(text);
            this.editor.clearSelection();
        });
    }

    @Input() set resizeTrigger(event: EventEmitter<any>) {
        if (event) {
            event.subscribe(() => {
                this.editor.resize();                
            });
        }
    }
}