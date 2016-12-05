import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EsFiddlerComponent , EsfState} from './esfState.component';
import { EsfStateService, EsfStateDto } from './esfState.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Directive, EventEmitter, ElementRef, Input, Output, DebugElement } from '@angular/core';
import 'jquery';

class EsfStateServiceStub {
    initialState = this.getStubbedState('00000000-0000-0000-0000-000000000000');

    getInitialStateSpy: jasmine.Spy = jasmine.createSpy('getInitialState');

    getInitialState(): Observable<EsfStateDto> {
        this.getInitialStateSpy();
        return new BehaviorSubject<EsfStateDto>(this.initialState).asObservable();
    }

    createNewVersionSpy: jasmine.Spy = jasmine.createSpy('createNewVersionSpy');

    createNewVersion(state: EsfStateDto): Observable<EsfStateDto> {
        try {
            this.createNewVersionSpy(state);
            return new BehaviorSubject<EsfStateDto>(state).asObservable();
        }
        catch (e) {
            var subject = new Subject<EsfStateDto>();
            subject.error(e);
            return subject.asObservable();
        }
    }

    getStateSpy: jasmine.Spy = jasmine.createSpy('getState');

    getStubbedState(id: string): EsfState {
        var savedState = {
            id: id,
            documents: '[ { "savedDocument" : 44 } ]',
            mapping: '{ "savedMapping": "value" }',
            query: '{ "savedQuery": "some saved query" }'
        };
        return savedState;
    }
    getState(id: string): Observable<EsfStateDto> {
        this.getStateSpy(id);
        return new BehaviorSubject<EsfStateDto>(this.getStubbedState(id)).asObservable();
    }
}

class RouterStub {
    navigateSpy: jasmine.Spy = jasmine.createSpy('navigate');

    navigate(commands: any[]): void {
        this.navigateSpy(commands);
    }

    getExistingStateNavigationCommand(stateId: string): string[] {
        return ['/state', stateId];
    }
}

class ActivatedRouteStub {
    private createStateParams(id: string) {
        return {
            'id': id
        };
    } 

    private createNewStateParams() {
        return this.createStateParams(null);
    }

    private paramsObserver = new BehaviorSubject<Params>(this.createNewStateParams());

    nextExistingStateParams(id: string) {
        this.paramsObserver.next(this.createStateParams(id));
    }

    nextNewStateParams() {
        this.paramsObserver.next(this.createNewStateParams());
    }
        
    params = this.paramsObserver.asObservable();
}

@Directive({
    selector: '[json-editor]'
})
export class JsonEditorDirectiveStub {
    @Output() textChange = new EventEmitter<string>();
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
        this.fixture.detectChanges();
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

    private getRunCommandElement(): DebugElement {
        return this.fixture.debugElement.query(By.css('.run-command'));
    }

    private getSaveCommandElement(): DebugElement {
        return this.fixture.debugElement.query(By.css('.save-command'));
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

    public getStubbedQueryRunResult(): string {
        return 'Query was run';
    }

    public runQueryCommand(): void {
        this.getRunCommandElement().triggerEventHandler('click', null);
        this.fixture.detectChanges();
    }

    public saveCommand(): void {
        this.getSaveCommandElement().triggerEventHandler('click', null);
        this.fixture.detectChanges();
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
        //then
        var newInitialState = esfComponent.stateService.initialState;

        var mappingEditor = esfComponent.getMappingJsonEditor();
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

    it('should display saved state when navigated to states/c1a5b76f-f08a-45cc-996b-c3f22ff00241', function () {
        //given
        const existingStateId = 'c1a5b76f-f08a-45cc-996b-c3f22ff00241';
        esfComponent.activatedRoute.nextExistingStateParams(existingStateId);
        esfComponent.createComponent();
        //then
        expect(esfComponent.stateService.getStateSpy).toHaveBeenCalledWith(existingStateId);
        var expectedSavedState = esfComponent.stateService.getStubbedState(existingStateId);

        var mappingEditor = esfComponent.getMappingJsonEditor();
        expect(mappingEditor.textSpy).toHaveBeenCalledWith(expectedSavedState.mapping);
        expect(mappingEditor.readOnlySpy).not.toHaveBeenCalled();

        var documentEditor = esfComponent.getDocumentsJsonEditor();
        expect(documentEditor.textSpy).toHaveBeenCalledWith(expectedSavedState.documents);
        expect(documentEditor.readOnlySpy).not.toHaveBeenCalled();

        var queryEditor = esfComponent.getQueryJsonEditor();
        expect(queryEditor.textSpy).toHaveBeenCalledWith(expectedSavedState.query);
        expect(queryEditor.readOnlySpy).not.toHaveBeenCalled();

        var queryResult = esfComponent.getQueryResult();
        expect(queryResult.textSpy).toHaveBeenCalledWith(esfComponent.getInitialQueryResult());
        expect(queryResult.readOnlySpy).toHaveBeenCalledWith(true);
    });

    it('should allow changing Mapping as json formatted text', function () {
        //given
        esfComponent.createComponent();
        //when
        var mappingEditor = esfComponent.getMappingJsonEditor();
        var newMapping = '{"mappingProp1":"value1", "something": { "more": "complex" } }';
        mappingEditor.textChange.emit(newMapping);
        esfComponent.fixture.detectChanges();
        //then
        expect(esfComponent.instance.state.mapping).toEqual(newMapping);
    });

    it('should allow changing Documents as json formatted text', function () {
        //given
        esfComponent.createComponent();
        //when
        var documentsEditor = esfComponent.getDocumentsJsonEditor();
        var newDocuments = '[{"document1":"value1"}, {"document2": { "more": "complex" } }]';
        documentsEditor.textChange.emit(newDocuments);
        esfComponent.fixture.detectChanges();
        //then
        expect(esfComponent.instance.state.documents).toEqual(newDocuments);
    });

    it('should allow changing Query as json formatted text', function () {
        //given
        esfComponent.createComponent();
        //when
        var queryEditor = esfComponent.getQueryJsonEditor();
        var newQuery = '{"queryProp1":"value1", "something": { "more": "complex" } }';
        queryEditor.textChange.emit(newQuery);
        esfComponent.fixture.detectChanges();
        //then
        expect(esfComponent.instance.state.query).toEqual(newQuery);
    });

    describe('save state', function () {
        it('should allow valid state to be saved', function () {
            //given
            esfComponent.createComponent();
            //when
            var changedDocument = '[ {"savedDocument" : 66}, {"anotherDoc": "value"} ]';
            esfComponent.getDocumentsJsonEditor().textChange.emit(changedDocument);
            esfComponent.instance.state.id = '16DC5986-5877-4695-AA16-E1A7DC076D8C';;
            esfComponent.fixture.detectChanges();
            esfComponent.saveCommand();
            //then
            expect(esfComponent.stateService.createNewVersionSpy).toHaveBeenCalledWith(esfComponent.instance.state);
        });

        it('should prevent saving non-array documents state', function () {
            //given
            esfComponent.createComponent();
            //when
            var changedDocument = '{"SingleDoc" : 1}';
            esfComponent.getDocumentsJsonEditor().textChange.emit(changedDocument);
            esfComponent.fixture.detectChanges();
            esfComponent.saveCommand();
            //then
            expect(esfComponent.stateService.createNewVersionSpy).not.toHaveBeenCalled();
        });

        it('should redirect to saved state route on successfully saving to backend', function () {
            //given
            esfComponent.createComponent();
            //when
            var changedDocument = '[ {"savedDocument" : 66}, {"anotherDoc": "value"} ]';
            esfComponent.getDocumentsJsonEditor().textChange.emit(changedDocument);
            var expectedStateId = '16DC5986-5877-4695-AA16-E1A7DC076D8C';
            esfComponent.instance.state.id = expectedStateId;
            esfComponent.fixture.detectChanges();
            esfComponent.saveCommand();
            //then
            expect(esfComponent.routerStub.navigateSpy).toHaveBeenCalledWith(esfComponent.routerStub.getExistingStateNavigationCommand(expectedStateId));
        });

        it('should log error to console when state service throws error on saving state', function () {
            //given
            spyOn(console, 'error');
            esfComponent.createComponent();
            //when
            var expectedErrorText = 'error creating new version state';
            esfComponent.stateService.createNewVersionSpy.and.throwError(expectedErrorText);
            esfComponent.saveCommand();
            //then
            expect(console.error).toHaveBeenCalledWith(new Error(expectedErrorText));
        });
        
    });

    it('should run query and display stubbed result', function () {
        //given
        esfComponent.createComponent();
        //when
        esfComponent.runQueryCommand();
        //then
        var queryResultEditor = esfComponent.getQueryResult();
        expect(queryResultEditor.textSpy.calls.mostRecent().args).toEqual([esfComponent.getStubbedQueryRunResult()]);
    });

});