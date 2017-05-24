import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

export abstract class EsfQueryRunnerServiceContract {
    abstract runQuery(mapping: string, documents: string[], query: string): Observable<EsfQueryRunResult>;
}

export interface EsfQueryRunResult {
    result: string;
}

@Injectable()
export class EsfQueryRunnerService extends EsfQueryRunnerServiceContract {
    private static webApiServiceUrl: string = 'http://localhost:40081';

	constructor(private http: Http) {
		super();
    }

    public runQuery(mapping: string, documents: string[], query: string): Observable<EsfQueryRunResult> {
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