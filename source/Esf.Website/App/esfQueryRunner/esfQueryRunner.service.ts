import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

export interface IEsfQueryRunnerService {
    runQuery(mapping: string, documents: string[], query: string): Observable<IEsfRunQueryResponse>;
}

export interface IEsfRunQueryResponse {
    createMappingResponse: IEsfRunResponse;
    createDocumentsResponse: IEsfRunResponse;
    queryResponse: IEsfRunResponse
}
export interface IEsfRunResponse {
    isSuccess: boolean;
    successJsonResult: string;
    jsonValidationError: IEsfJsonError;
    elasticsearchError: IEsfError;
}

export interface IEsfJsonError {
    sourceJson: string;
    error: string;
}
export interface IEsfError {
    httpStatusCode: number;
    error: string;
}

@Injectable()
export class EsfQueryRunnerService implements IEsfQueryRunnerService {
    private static webApiServiceUrl: string = 'http://localhost:40081';

    constructor(private http: Http) {
    }

    public runQuery(mapping: string, documents: string[], query: string): Observable<IEsfRunQueryResponse> {
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