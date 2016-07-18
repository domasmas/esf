import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {Http, Response} from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EsfStateService {
    private static serviceUrl: string = 'http://localhost:11116';

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
}

export class EsfStateDto {
    mapping: string;
    documents: string;
    query: string;
}