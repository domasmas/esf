import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { EsfStateDto } from './esfStateDto';
import { ExistingEsfStateDto } from './existingEsfStateDto';
import { EsfStateResponseDto } from './esfStateResponseDto';

@Injectable()
export class EsfStateService {
    private static serviceUrl: string = 'http://localhost:40081';

    constructor(private http: Http) {
    }

    getInitialState(): Observable<ExistingEsfStateDto> {
        var url = `${EsfStateService.serviceUrl}/states/new`;
        return this.http.get(url).map((res: Response) => {
            var result = <EsfStateResponseDto>res.json();
            if (result.success) {
                return <ExistingEsfStateDto>result.esfState;
            }
            return Observable.throw(result.error);
        }, (error: Error) => {
            return error;
        });
    }

    createNewVersion(state: EsfStateDto): Observable<ExistingEsfStateDto> {
        let url = `${EsfStateService.serviceUrl}/states`;
        let body = JSON.stringify(state);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options).map((res: Response) => {
            let result = <EsfStateResponseDto>res.json();
            if (result.success) {
                return <ExistingEsfStateDto>result.esfState;
            }
            return Observable.throw(result.error);
        }, (error: Error) => {
            return error;
        }); 
    }

    getState(stateUrl: string): Observable<ExistingEsfStateDto> {
        let url = `${EsfStateService.serviceUrl}/states/?stateUrl=${stateUrl}`;

        return this.http.get(url).map((res: Response) => {
            var result = <EsfStateResponseDto>res.json();
            if (result.success) {
                return <ExistingEsfStateDto>result.esfState;
            }
            return Observable.throw(result.error);
        }, (error: Error) => {
            return error;
        });        
    }
}