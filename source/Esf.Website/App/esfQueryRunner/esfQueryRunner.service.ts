import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

export interface IEsfQueryRunnerService {
    runSearchQuery(mapping: string, documents: string[], query: string): Observable<string>;
}

@Injectable()
export class EsfQueryRunnerService implements IEsfQueryRunnerService {
    private static webApiServiceUrl: string = 'http://localhost:40081';

    constructor(private http: Http) {
    }

    public runSearchQuery(mapping: string, documents: string[], query: string): Observable<string> {
        var endpointUrl: string = `${EsfQueryRunnerService.webApiServiceUrl}/query-runner`;

        let body = JSON.stringify({
            mapping: mapping,
            documents: documents,
            query: query
        });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(endpointUrl, body, options).map((response: Response) => {
            return response.json();
        }, (error: Error) => {
            return error;
        });
    }
}