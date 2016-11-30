import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EsFiddlerComponent } from './esfState.component';
import { EsfStateService, EsfStateDto } from './esfState.service';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Directive, EventEmitter, ElementRef, Input, Output, DebugElement } from '@angular/core';
import 'jquery';

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
    static instances: JsonEditorDirectiveStub[] = [];
    static resetInstances(): void {
        JsonEditorDirectiveStub.instances = [];
    }
    constructor() {
        this.textSpy = jasmine.createSpy('text');
        this.readOnlySpy = jasmine.createSpy('readOnly');
        JsonEditorDirectiveStub.instances.push(this);
    }

    ngOnInit() {
    }

    textSpy: jasmine.Spy;
    readOnlySpy: jasmine.Spy;

    @Input() set readOnly(readOnly: boolean) {
        this.readOnlySpy(readOnly);
    }

    @Input() set text(text: string) {
        this.textSpy(text);
    }
}
class EsFiddlerComponentFixture {
    public stateService: EsfStateServiceStub;
    public activatedRoute: ActivatedRouteStub;
    public routerStub: RouterStub;

    configureComponent(): void {
        this.stateService = new EsfStateServiceStub();
        this.activatedRoute = new ActivatedRouteStub();
        this.routerStub = new RouterStub();
        JsonEditorDirectiveStub.resetInstances();
        TestBed.configureTestingModule({
            declarations: [EsFiddlerComponent, JsonEditorDirectiveStub],
            providers: [{ provide: EsfStateService, useValue: this.stateService },
            { provide: ActivatedRoute, useValue: this.activatedRoute },
            { provide: Router, useValue: this.routerStub }]
        }).overrideComponent(EsFiddlerComponent, {
            set: {
                providers: [{ provide: EsfStateService, useValue: this.stateService }]
            }
        })
            .compileComponents();
    }

    createComponent(): void {
        this._fixture = TestBed.createComponent(EsFiddlerComponent);
    }

    public get fixture(): ComponentFixture<EsFiddlerComponent> {
        return this._fixture;
    }

    private _fixture: ComponentFixture<EsFiddlerComponent>;

    public get instance(): EsFiddlerComponent {
        if (this.fixture) {
            return this.fixture.componentInstance;
        }
        else {
            throw Error('EsFiddlerComponent fixture does not exist'); 
        }
    }

    public getMappingEditorElement(): DebugElement {
        return this.fixture.debugElement.query(By.css('.mapping-editor'));
    }

    public getRunCommandElement(): DebugElement {
        return  this.fixture.debugElement.query(By.css('.run-command'));
    }

    public getMappingJsonEditor(): JsonEditorDirectiveStub {
        return JsonEditorDirectiveStub.instances[0];
    }

    public getDocumentsJsonEditor(): JsonEditorDirectiveStub {
        return JsonEditorDirectiveStub.instances[1];
    }

    public getQueryJsonEditor(): JsonEditorDirectiveStub {
        return JsonEditorDirectiveStub.instances[2]
    }

    public getQueryResult(): JsonEditorDirectiveStub {
        return JsonEditorDirectiveStub.instances[3];
    }

    public getInitialQueryResult(): string {
        return '';
    }
}
describe('esfState.component', function () {
    var esfComponent = new EsFiddlerComponentFixture();

    beforeEach(async(() => {
        esfComponent.configureComponent();
    }));

    it('should display the initial state when navigated to states/new', function () {
        //given
        esfComponent.createComponent();
        esfComponent.fixture.detectChanges();
        //then
        var newInitialState = esfComponent.stateService.initialState;

        var mappingEditor = esfComponent.getMappingJsonEditor()
        expect(mappingEditor.textSpy).toHaveBeenCalledWith(newInitialState.mapping);
        expect(mappingEditor.readOnlySpy).not.toHaveBeenCalled();

        var documentEditor = esfComponent.getDocumentsJsonEditor();
        expect(documentEditor.textSpy).toHaveBeenCalledWith(newInitialState.documents);
        expect(documentEditor.readOnlySpy).not.toHaveBeenCalled();

        var queryEditor = esfComponent.getQueryJsonEditor();
        expect(queryEditor.textSpy).toHaveBeenCalledWith(newInitialState.query);
        expect(queryEditor.readOnlySpy).not.toHaveBeenCalled();

        var queryResult = esfComponent.getQueryResult();
        expect(queryResult.textSpy).toHaveBeenCalledWith(esfComponent.getInitialQueryResult());
        expect(queryResult.readOnlySpy).toHaveBeenCalledWith(true);
    });

    //it('should display saved state when navigated to states/GUID');

    //it('should allow changing Mapping as json formatted text');

    //it('should allow changing Documents as json formatted text');

    //it('should allow changing Query as json formatted text');

    //describe('save state', function () {
    //    it('should allow valid state to be saved');

    //    it('should prevent saving invalid state');

    //    it('should valid save state to backend');

    //    it('should redirect to saved state route on successfully saving to backend');

    //    it('should error if not successfully saved to backend');
    //});

    //it('should run query and display stubbed result');

});