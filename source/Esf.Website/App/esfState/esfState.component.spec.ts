import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EsFiddlerComponent } from './esfState.component';
import { EsfStateService } from './esfState.service';
import { EsfStateDto } from './esfStateDto';
import { ExistingEsfStateDto } from './existingEsfStateDto';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EsfQueryRunnerServiceContract, EsfQueryRunnerService, IEsfRunQueryResponse } from '../esfQueryRunner/esfQueryRunner.service'
import { EsfStateSaveCommand } from './esfStateSaveCommand';
import { EsfStateRunQueryCommand } from './esfStateRunQueryCommand';
import { EsfStateValidationService } from './esfStateValidation.service';
import { By } from '@angular/platform-browser';
import { Directive, EventEmitter, ElementRef, Input, Output, DebugElement } from '@angular/core';

class EsfStateServiceStub {
    initialState = this.getStubbedState('00000000-0000-0000-0000-000000000000');

    getInitialStateSpy: jasmine.Spy = jasmine.createSpy('getInitialState');

    getInitialState(): Observable<ExistingEsfStateDto> {
        this.getInitialStateSpy();
        return new BehaviorSubject<ExistingEsfStateDto>(this.initialState).asObservable();
    }

    createNewVersionSpy: jasmine.Spy = jasmine.createSpy('createNewVersionSpy');
    createNewVersionReturnValueUrlState: string = '12345678-0000-0000-0000-000000000000';

    createNewVersion(state: EsfStateDto): Observable<ExistingEsfStateDto> {
        try {
            this.createNewVersionSpy(state);   
            var existingStubState = this.getExistingStubbedState(this.createNewVersionReturnValueUrlState, state);         
            return new BehaviorSubject<ExistingEsfStateDto>(existingStubState).asObservable();
        }
        catch (e) {
            var subject = new Subject<ExistingEsfStateDto>();
            subject.error(e);
            return subject.asObservable();
        }
    }

    getStateSpy: jasmine.Spy = jasmine.createSpy('getState');

    getExistingStubbedState(stateUrl: string, state: EsfStateDto): ExistingEsfStateDto {
        var savedState = {
            stateUrl: stateUrl,
            state: state
        };
        return savedState;
    }

    getStubbedState(stateUrl: string): ExistingEsfStateDto {
        return this.getExistingStubbedState(stateUrl, {
            documents: ['{ "savedDocument": 44 }'],
            mapping: '{ "savedMapping": "value" }',
            query: '{ "savedQuery": "some saved query" }'
        });
    }
    getState(stateUrl: string): Observable<ExistingEsfStateDto> {
        this.getStateSpy(stateUrl);
        return new BehaviorSubject<ExistingEsfStateDto>(this.getStubbedState(stateUrl)).asObservable();
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
    private createStateParams(stateUrl: string) {
        return {
            'stateUrl': stateUrl
        };
    } 

    private createNewStateParams() {
        return this.createStateParams(null);
    }

    private paramsObserver = new BehaviorSubject<Params>(this.createNewStateParams());

    nextExistingStateParams(stateUrl: string) {
        this.paramsObserver.next(this.createStateParams(stateUrl));
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
        JsonEditorDirectiveStub.instances.push(this);
    }

    ngOnInit() {
    }

    textSpy: jasmine.Spy;
    isReadonly: boolean;

    @Input() set readOnly(readOnly: boolean) {
        this.isReadonly = readOnly;
    }

    @Input() set text(text: string) {
        this.textSpy(text);
    }
}

class EsfQueryRunnerServiceStub extends EsfQueryRunnerServiceContract {
    static StubbedRunResult: IEsfRunQueryResponse = {
        createDocumentsResponse: null,
        createMappingResponse: null,
        queryResponse: {
            isSuccess: true,
            successJsonResult: JSON.stringify({
                "hits": {
                    "total": 1,
                    "hits": [{
                        "_source": { "message": "doc1" }
                    }]
                }
            }),
            elasticsearchError: null,
            jsonValidationError: null
        }
    };
    runQuery(mapping: string, documents: string[], query: string): Observable<IEsfRunQueryResponse> {
        return new BehaviorSubject<IEsfRunQueryResponse>(EsfQueryRunnerServiceStub.StubbedRunResult);
    }
}

class EsFiddlerComponentFixture {
    public stateService: EsfStateServiceStub;
    public activatedRoute: ActivatedRouteStub;
    public routerStub: RouterStub;
    private queryRunnerService: EsfQueryRunnerServiceStub;

    configureComponent(): void {
        this.stateService = new EsfStateServiceStub();
        this.activatedRoute = new ActivatedRouteStub();
        this.routerStub = new RouterStub();
        this.queryRunnerService = new EsfQueryRunnerServiceStub();

        JsonEditorDirectiveStub.resetInstances();
        TestBed.configureTestingModule({
            declarations: [EsFiddlerComponent, JsonEditorDirectiveStub],
            providers: [{ provide: EsfStateService, useValue: this.stateService },
            { provide: ActivatedRoute, useValue: this.activatedRoute },
            { provide: Router, useValue: this.routerStub },
            { provide: EsfQueryRunnerServiceContract, useValue: this.queryRunnerService },
                EsfStateSaveCommand,
                EsfStateRunQueryCommand,
                EsfStateValidationService
            ]
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

    public getStubbedQueryRunResult(): IEsfRunQueryResponse {
        return EsfQueryRunnerServiceStub.StubbedRunResult;
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
        console.log('checking initial state');
        //then
        var newInitialState = esfComponent.stateService.initialState.state;
        var documents = newInitialState.documents.map(x => JSON.parse(x));
        var serializedDocuments = JSON.stringify(documents);

        var mappingEditor = esfComponent.getMappingJsonEditor();
        expect(mappingEditor.textSpy).toHaveBeenCalledWith(newInitialState.mapping);
        expect(mappingEditor.isReadonly).toEqual(false);

        var documentEditor = esfComponent.getDocumentsJsonEditor();
        expect(documentEditor.textSpy).toHaveBeenCalledWith(serializedDocuments);
        expect(documentEditor.isReadonly).toEqual(false);

        var queryEditor = esfComponent.getQueryJsonEditor();
        expect(queryEditor.textSpy).toHaveBeenCalledWith(newInitialState.query);
        expect(queryEditor.isReadonly).toEqual(false);

        var queryResult = esfComponent.getQueryResult();
        expect(queryResult.textSpy).toHaveBeenCalledWith(esfComponent.getInitialQueryResult());
        expect(queryResult.isReadonly).toEqual(true);
    });

    it('should display saved state when navigated to existing stateUrl c1a5b76f-f08a-45cc-996b-c3f22ff00241', function () {
        //given
        const existingStateUrl = 'c1a5b76f-f08a-45cc-996b-c3f22ff00241';
        esfComponent.activatedRoute.nextExistingStateParams(existingStateUrl);
        esfComponent.createComponent();
        //then
        expect(esfComponent.stateService.getStateSpy).toHaveBeenCalledWith(existingStateUrl);
        var expectedSavedState = esfComponent.stateService.getStubbedState(existingStateUrl).state;

        var documents = expectedSavedState.documents.map(x => JSON.parse(x));
        var serializedDocuments = JSON.stringify(documents);

        var mappingEditor = esfComponent.getMappingJsonEditor();
        expect(mappingEditor.textSpy).toHaveBeenCalledWith(expectedSavedState.mapping);
        expect(mappingEditor.isReadonly).toEqual(false);

        var documentEditor = esfComponent.getDocumentsJsonEditor();
        expect(documentEditor.textSpy).toHaveBeenCalledWith(serializedDocuments);
        expect(documentEditor.isReadonly).toEqual(false);

        var queryEditor = esfComponent.getQueryJsonEditor();
        expect(queryEditor.textSpy).toHaveBeenCalledWith(expectedSavedState.query);
        expect(queryEditor.isReadonly).toEqual(false);

        var queryResult = esfComponent.getQueryResult();
        expect(queryResult.textSpy).toHaveBeenCalledWith(esfComponent.getInitialQueryResult());
        expect(queryResult.isReadonly).toEqual(true);
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
            esfComponent.fixture.detectChanges();
            esfComponent.saveCommand();
            let expectedDto = JSON.parse(JSON.stringify(esfComponent.instance.state));
            expectedDto.documents = JSON.parse(changedDocument).map((x: Object) => JSON.stringify(x))
            //then
            expect(esfComponent.stateService.createNewVersionSpy).toHaveBeenCalledWith(expectedDto);
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
            esfComponent.fixture.detectChanges();
            esfComponent.saveCommand();
            //then
            var expectedStateUrl = esfComponent.stateService.createNewVersionReturnValueUrlState;
            expect(esfComponent.routerStub.navigateSpy).toHaveBeenCalledWith(esfComponent.routerStub.getExistingStateNavigationCommand(expectedStateUrl));
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
        expect(queryResultEditor.textSpy.calls.mostRecent().args).toEqual([esfComponent.getStubbedQueryRunResult().queryResponse.successJsonResult]);
    });

});