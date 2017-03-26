import { TestBed, inject } from '@angular/core/testing';
import { Headers } from '@angular/http';
import { IEsfQueryRunnerService, EsfQueryRunnerService } from './esfQueryRunner.service';
import { MockHttpFixture, RequestResponsePair } from '../shared/unitTests/mockHttpFixture';

class EsfQueryRunnerServiceFixture {
    private mockHttp: MockHttpFixture;
    queryRunnerService: IEsfQueryRunnerService;

    constructor() {
        TestBed.configureTestingModule({
            providers: [EsfQueryRunnerService].concat(MockHttpFixture.getModuleProviders())
        });
        this.mockHttp = new MockHttpFixture('http://localhost:40081');
        this.queryRunnerService = TestBed.get(EsfQueryRunnerService);
    }
    
    configureResponse(requestResponsePair: RequestResponsePair) {
        return this.mockHttp.configureResponses(requestResponsePair);
    }
}

describe('esfQueryRunner.service', function () {
    var serviceFixture: EsfQueryRunnerServiceFixture;
    beforeEach(() => {
        serviceFixture = new EsfQueryRunnerServiceFixture();
    });

    it('should be able run query for provided query, mapping and documents', function () {
        var query: string = '{ \"queryKey\": \"value\" }';
        var mapping: string = '{ \"mappingKey\": \"value\" }';
        var documents: string[] = ['{ \"doc1\": 1 }', '{ \"doc2\": 2 }'];

        var expectedResult: string = '{ \"doc2\": 2 }';
        serviceFixture.configureResponse({
            expectedRequest: {
                url: '/query-runner'
            },
            response: { status: 200, body: JSON.stringify(expectedResult) }
        });

        serviceFixture.queryRunnerService.runSearchQuery(mapping, documents, query).subscribe((actualQueryResult: string) => {
            
            expect(actualQueryResult).toEqual(expectedResult);
        });
    });
});