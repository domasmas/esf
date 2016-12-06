import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptionsArgs, Http, Response, Request, ResponseOptions, ResponseType, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { EsfStateService, EsfStateDto } from './esfState.service';

class RequestResponsePair {
    expectedRequest: {
        url: string;
        headers?: Headers;
        body?: Object;
    }
    response: ResponseOptionsArgs;
}

class EsfStateServiceFixture {
    private http: Http;
    private mockBackend: MockBackend;
    esfStateService: EsfStateService;

    constructor() {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Http, useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
                        return new Http(backend, options);
                    }, deps: [MockBackend, BaseRequestOptions]
                },
                EsfStateService, MockBackend, BaseRequestOptions]
        });
        this.esfStateService = TestBed.get(EsfStateService);
        this.mockBackend = TestBed.get(MockBackend);
        this.http = TestBed.get(Http);
        this.hostUrl = 'http://localhost:40081';
    }

    private hostUrl: string;

    private getFullUrl(relativeUrl: string): string {
        return this.hostUrl.concat(relativeUrl);
    }

    configureResponses(...requestResponsePairs: RequestResponsePair[]) {
        var index = 0;
        this.mockBackend.connections.subscribe((connection: MockConnection) => {
            var pair: RequestResponsePair = requestResponsePairs[index];
            index++;
            expect(connection.request.url).toEqual(this.getFullUrl(pair.expectedRequest.url));
            connection.mockRespond(new Response(new ResponseOptions(pair.response)));                        
        });
    }
}

describe('esfState.service', function () {
    var serviceFixture: EsfStateServiceFixture;
    beforeEach(() => {
        serviceFixture = new EsfStateServiceFixture();
    });

    it('should be able to the initial state', function () {
        var expectedState = {
            "mapping": { "mappingKey": "value" },
            "query": { "queryKey": "value" },
            "documents": [{ "doc1": 1 }, { "doc2": 2 }],
            "id": "0"
        };
        serviceFixture.configureResponses({
            expectedRequest: {
                url: '/states/new'
            },
            response: { status: 200, body: expectedState }
        });
        serviceFixture.esfStateService.getInitialState().subscribe((actualState: EsfStateDto) => {
            expect(actualState).toEqual(expectedState);
        });
    });

    it('should be able to creat new version state', function () {
        var httpResponseState = {
            mapping: { "mappingKeyModified": "value modified" },
            query: { "queryKey": "value" },
            documents: [{ "doc1": 55 }],
            "id": "1"
        };
        serviceFixture.configureResponses({
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
            documents: "[{ \"doc1\": 55 }]",
            id: null
        };
        serviceFixture.esfStateService.createNewVersion(newEsfState).subscribe((actualState: EsfStateDto) => {
            expect(actualState).toEqual(httpResponseState);
        });
    });

    it('should be able to get existing state by id GUID', function () {
        var existingStateGuid: string = 'DDC4133A-6706-4267-A32A-89F844AB27C4';        
        var httpResponseState = {
            mapping: { "mappingKeyModified": "value modified" },
            query: { "queryKey": "value" },
            documents: [{ "doc1": 55 }],
            id: existingStateGuid
        };
        serviceFixture.configureResponses({
            expectedRequest: {
                url: `/states/${existingStateGuid}`
            },
            response: { status: 200, body: httpResponseState }
        });

        serviceFixture.esfStateService.getState(existingStateGuid).subscribe((actualState: EsfStateDto) => {
            expect(actualState).toEqual(httpResponseState);
        });
    });
});