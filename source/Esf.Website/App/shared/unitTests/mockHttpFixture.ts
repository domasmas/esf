import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptionsArgs, Http, Response, Request, ResponseOptions, ResponseType, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export class RequestResponsePair {
    expectedRequest: {
        url: string;
        headers?: Headers;
        body?: Object;
    }
    response: ResponseOptionsArgs;
}

export class MockHttpFixture {
    private http: Http;
    private mockBackend: MockBackend;

    constructor(hostUrl: string) {
        this.mockBackend = TestBed.get(MockBackend);
        this.http = TestBed.get(Http);
        this.hostUrl = hostUrl;
    }

    public static getModuleProviders(): any[] {
        return [
            {
                provide: Http, useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
                    return new Http(backend, options);
                }, deps: [MockBackend, BaseRequestOptions]
            },
            MockBackend, BaseRequestOptions];
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