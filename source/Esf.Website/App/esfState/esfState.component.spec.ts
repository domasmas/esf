import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EsFiddlerComponent } from './esfState.component';
import { EsfStateService, EsfStateDto } from './esfState.service';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Directive, EventEmitter, ElementRef, Input, Output } from '@angular/core';

class EsfStateServiceStub {
    private stateObserver: BehaviorSubject<EsfStateDto>;

    initialState = {
        id: '000',
        documents: '[ "document1" : 44 ]',
        mapping: '{ "mapping": "value" }',
        query: '{ "query": "some query" }'
    };

    constructor() {
        this.stateObserver = new BehaviorSubject<EsfStateDto>(this.initialState);
    }

    getInitialState(): Observable<EsfStateDto> {
        return this.stateObserver.asObservable();
    }

    createNewVersion(state: EsfStateDto): Observable<EsfStateDto> {
        return this.stateObserver.asObservable();
    }

    getState(id: string): Observable<EsfStateDto> {
        return this.stateObserver.asObservable();
    }
}

class RouterStub {
    navigate(commands: any[]): void {

    }
}

class ActivatedRouteStub {
    private paramsObserver = new BehaviorSubject<Params>({
        'id': null
    });

    params = this.paramsObserver.asObservable();
}

@Directive({
    selector: '[json-editor]'
})
export class JsonEditorDirectiveStub {
    @Output() textChange = new EventEmitter();
    
    constructor() {
    }    

    @Input() set readOnly(readOnly: boolean) {
        console.log('@input readOnly ' + readOnly);
    }

    @Input() set text(text: string) {
        console.log('@input text ' + text);
    }
}

describe('esfState.component', function () {
    var stateService: EsfStateServiceStub;
    var activatedRoute: ActivatedRouteStub;
    var routerStub: RouterStub;

    beforeEach(
        async(() => {
            stateService = new EsfStateServiceStub();
            activatedRoute = new ActivatedRouteStub();
            routerStub = new RouterStub();
            TestBed.configureTestingModule({
                declarations: [EsFiddlerComponent, JsonEditorDirectiveStub],
                providers: [{ provide: EsfStateService, useValue: stateService },
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: Router, useValue: routerStub }]
            }).overrideComponent(EsFiddlerComponent, {
                set: {
                    providers: [{ provide: EsfStateService, useValue: stateService }]
                }
            })
            .compileComponents();
        }));

    it('should compile Esf State component with stubbed out dependencies', function () {
        var fixture = TestBed.createComponent(EsFiddlerComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance.state).toEqual(stateService.initialState);
        var test = fixture.debugElement.query(By.css('.mapping-editor'));
        var test2 = fixture.debugElement.query(By.css('.run-command'));
        fixture.componentInstance.state.mapping = 'some query';
        fixture.detectChanges();
    });
});