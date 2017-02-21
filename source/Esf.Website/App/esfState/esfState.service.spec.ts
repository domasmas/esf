import { TestBed, inject } from '@angular/core/testing';
import { Headers } from '@angular/http';
import { EsfStateService, EsfStateDto, ExistingEsfStateDto } from './esfState.service';
import { MockHttpFixture, RequestResponsePair } from '../common/unitTests/mockHttpFixture';

class EsfStateServiceFixture {
    private mockHttp: MockHttpFixture;
    esfStateService: EsfStateService;

    constructor() {
        TestBed.configureTestingModule({
            providers: [EsfStateService].concat(MockHttpFixture.getModuleProviders())
        });
        this.mockHttp = new MockHttpFixture('http://localhost:40081');
        this.esfStateService = TestBed.get(EsfStateService);
    }
    
    configureResponse(requestResponsePair: RequestResponsePair) {
        return this.mockHttp.configureResponses(requestResponsePair);
    }
}

describe('esfState.service', function () {
    var serviceFixture: EsfStateServiceFixture;
    beforeEach(() => {
        serviceFixture = new EsfStateServiceFixture();
    });

    it('should be able to the initial state', function () {
        var expectedState: ExistingEsfStateDto = {
            state: <EsfStateDto> {
                mapping: "{ \"mappingKey\": \"value\" }",
                query: "{ \"queryKey\": \"value\" }",
                documents: ['{ \"doc1\": 1 }', '{ \"doc2\": 2 }']
            },
            stateUrl: '00000000-0000-0000-0000-000000000000'
        };
        serviceFixture.configureResponse({
            expectedRequest: {
                url: '/states/new'
            },
            response: { status: 200, body: expectedState }
        });
        serviceFixture.esfStateService.getInitialState().subscribe((actualState: ExistingEsfStateDto) => {
            expect(actualState).toEqual(expectedState);
        });
    });

    it('should be able to create new version state', function () {
        var httpResponseState: ExistingEsfStateDto = {
            state: <EsfStateDto>{
                mapping: "{ \"mappingKeyModified\": \"value\" }",
                query: "{ \"queryKey\": \"value\" }",
                documents: ['{ \"doc1\": 1 }']
            },
            stateUrl: '12345678-0000-0000-0000-000000000000'
        };

        serviceFixture.configureResponse({
            expectedRequest: {
                url: '/states',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(newEsfState)
            },
            response: { status: 200, body: httpResponseState }
        });

        var newEsfState: EsfStateDto = {
            mapping: "{ \"mappingKeyModified\": \"value modified\" }",
            query: "{ \"queryKey\": \"value\" }",
            documents: ['{ \"doc1\": 55 }']
        };
        serviceFixture.esfStateService.createNewVersion(newEsfState).subscribe((actualState: ExistingEsfStateDto) => {
            expect(actualState).toEqual(httpResponseState);
        });
    });

    it('should be able to get existing state by id GUID', function () {
        var existingStateGuid: string = 'DDC4133A-6706-4267-A32A-89F844AB27C4';        
        var httpResponseState: ExistingEsfStateDto = {
            state: <EsfStateDto>{
                mapping: "{ \"mappingKeyModified\": \"value\" }",
                query: "{ \"queryKey\": \"value\" }",
                documents: ['{ \"doc1\": 1 }']
            },
            stateUrl: existingStateGuid
        };
        serviceFixture.configureResponse({
            expectedRequest: {
                url: `/states/?stateUrl=${existingStateGuid}`
            },
            response: { status: 200, body: httpResponseState }
        });

        serviceFixture.esfStateService.getState(existingStateGuid).subscribe((actualState: ExistingEsfStateDto) => {
            expect(actualState).toEqual(httpResponseState);
        });
    });
});