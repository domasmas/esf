import { TestBed, inject } from '@angular/core/testing';
import { Headers } from '@angular/http';
import { ResponseOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EsfQueryRunnerServiceContract, EsfQueryRunnerService, EsfQueryRunResult } from './esfQueryRunner.service';
import { MockHttpFixture, RequestResponsePair } from '../shared/unitTests/mockHttpFixture';
import '../testsFramework/jasmineExtraMatchers';

class EsfQueryRunnerServiceFixture {
    private mockHttp: MockHttpFixture;
	private queryRunnerService: EsfQueryRunnerServiceContract;

	constructor() {
        TestBed.configureTestingModule({
			providers: [{ provide: EsfQueryRunnerServiceContract, useClass: EsfQueryRunnerService }].concat(MockHttpFixture.getModuleProviders())
        });
        this.mockHttp = new MockHttpFixture('http://localhost:40081');
		this.queryRunnerService = TestBed.get(EsfQueryRunnerServiceContract);
    }

    private serializeResponseBody(response: ResponseOptionsArgs) {
        response.body = JSON.stringify(response.body);
    }

    configureResponse(requestResponsePair: RequestResponsePair) {
        this.serializeResponseBody(requestResponsePair.response);
        return this.mockHttp.configureResponses(requestResponsePair);
    }

    runSearchQuery(mapping: Object, documents: Object[], query: Object): Observable<EsfQueryRunResult> {
        return this.queryRunnerService.runQuery(JSON.stringify(mapping), documents.map(doc => JSON.stringify(doc)), JSON.stringify(query));
    }
}

describe('esfQueryRunner.service', function () {
    var serviceFixture: EsfQueryRunnerServiceFixture;
    beforeEach(() => {
        serviceFixture = new EsfQueryRunnerServiceFixture();
    });

    it('should be able run query for provided query, mapping and documents', function () {
        var mapping = {
            "properties": {
                "message": { "type": "string" }
            }
        };
        var documents = [{ "long desc doc1": 1 }, { "doc2": 2 }];

        var query = {
            "query": {
                "match": { "message": "doc1" }
            }
        };

        var expectedResult = JSON.stringify({
            createMappingResponse: {
                isSuccess: true
            },
            CreateDocumentsResponse: {
                isSuccess: true
            },
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
                jsonValidationError: null,
                elasticsearchError: null
            }
        });
        serviceFixture.configureResponse({
            expectedRequest: {
                url: '/query-runner'
            },
            response: { status: 200, body: expectedResult }
        });

        serviceFixture.runSearchQuery(mapping, documents, query).subscribe((actualQueryResult: EsfQueryRunResult) => {
            expect(actualQueryResult).toEqual(expectedResult);
        });
    });
});