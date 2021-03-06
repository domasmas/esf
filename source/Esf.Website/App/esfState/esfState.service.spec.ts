﻿import { TestBed, inject } from '@angular/core/testing';
import { Headers } from '@angular/http';
import { EsfStateDto } from './esfStateDto';
import { EsfStateService } from './esfState.service';
import { ExistingEsfStateDto } from './existingEsfStateDto';
import { MockHttpFixture, RequestResponsePair } from '../shared/unitTests/mockHttpFixture';

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
        var esfStateDto: ExistingEsfStateDto = {
            state: <EsfStateDto> {
                mapping: "{ \"mappingKey\": \"value\" }",
                query: "{ \"queryKey\": \"value\" }",
                documents: ['{ \"doc1\": 1 }', '{ \"doc2\": 2 }']
            },
            stateUrl: '00000000-0000-0000-0000-000000000000'
        };

        var httpResponseState = {
            esfState: esfStateDto,
            success: true
        };

        serviceFixture.configureResponse({
            expectedRequest: {
                url: '/states/new'
            },
            response: { status: 200, body: httpResponseState }
        });

        serviceFixture.esfStateService.getInitialState().subscribe((actualState: ExistingEsfStateDto) => {
            expect(actualState).toEqual(esfStateDto);
        });
    });

    it('should be able to create new version state', function () {
        var esfStateDto: ExistingEsfStateDto = {
            state: <EsfStateDto>{
                mapping: "{ \"mappingKeyModified\": \"value\" }",
                query: "{ \"queryKey\": \"value\" }",
                documents: ['{ \"doc1\": 1 }']
            },
            stateUrl: '12345678-0000-0000-0000-000000000000'
        };

        var httpResponseState = {
            esfState: esfStateDto,
            success: true
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
            expect(actualState).toEqual(esfStateDto);
        });
    });

    it('should be able to get existing state by id GUID', function () {
        var existingStateGuid: string = 'DDC4133A-6706-4267-A32A-89F844AB27C4'; 
               
        var esfStateDto: ExistingEsfStateDto = {
            state: <EsfStateDto>{
                mapping: "{ \"mappingKeyModified\": \"value\" }",
                query: "{ \"queryKey\": \"value\" }",
                documents: ['{ \"doc1\": 1 }']
            },
            stateUrl: existingStateGuid
        };

        var httpResponseState = {
            esfState: esfStateDto,
            success: true
        };

        serviceFixture.configureResponse({
            expectedRequest: {
                url: `/states/?stateUrl=${existingStateGuid}`
            },
            response: { status: 200, body: httpResponseState }
        });

        serviceFixture.esfStateService.getState(existingStateGuid).subscribe((actualState: ExistingEsfStateDto) => {
            expect(actualState).toEqual(esfStateDto);
        });
    });
});