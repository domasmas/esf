import { TestBed } from '@angular/core/testing';
import { EsfStateService, EsfStateDto } from './esfState.service';
import { Observable, Subject } from 'rxjs/Rx';
import { Http, HttpModule, BaseRequestOptions, ConnectionBackend, RequestOptions } from '@angular/http';

describe('esfState.service', function () {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [EsfStateService, Http, ConnectionBackend, BaseRequestOptions]
        });
    });
    it('should work with real http service with spies', function () {
        var response: any = {};
        response.json = function () {
            return {
                id: 1,
                prop1: "value",
                prop2: 55
            }
        };
        var subject = new Subject();
        var http: Http = TestBed.get(Http);
        spyOn(http, 'get').and.returnValue(subject.asObservable());
        var esfStateService: EsfStateService = TestBed.get(EsfStateService);
        var response2: any = {};
        response2.json = function () {
            return {
                id: 2,
                prop65656: "something",
                fddff: 55
            }
        };

        esfStateService.getInitialState().subscribe(state => {
            console.log(state);
            if (state.id === 1) {
                expect(state).toEqual(response.json());
            }
            else {
                expect(state).toEqual(response2.json());
            }
        });

        subject.next(response);
        subject.next(response2);
    });
});