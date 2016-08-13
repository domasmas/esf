import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EsfStateService {
    private static serviceUrl: string = 'http://localhost:40081';

    constructor(private http: Http) {
        
    }
    getInitialState(): Observable<EsfStateDto> {
        var url = `${EsfStateService.serviceUrl}/states/new`;
        return this.http.get(url).map((res: Response) => {
            var result = res.json();
            return <EsfStateDto>result;
        }, (error: Error) => {
            return error;
        });
    }

    createNewVersion(state: EsfStateDto): Observable<EsfStateDto> {
        let url = `${EsfStateService.serviceUrl}/states`;
        let body = JSON.stringify(state);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(url, body, options).map((res: Response) => {
            var result = res.json();
            return <EsfStateDto>result;
        }, (error: Error) => {
            return error;
        });
    }

    getState(id: string): Observable<EsfStateDto> {
        let url = `${EsfStateService.serviceUrl}/states/?id=${id}`;

        return this.http.get(url).map((res: Response) => {
            var result = res.json();
            return <EsfStateDto>result;
        }, (error: Error) => {
            return error;
        });        
    }
}

export class EsfStateDto {
    mapping: string;
    documents: string;
    query: string;
    id: string;
}