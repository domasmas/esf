import {Observable } from 'rxjs/Rx';
import {Http, Response} from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EsfStateService {
    private static serviceUrl: string = 'http://localhost:54328';

    constructor(private http: Http) {
        
    }
    getInitialState(): Observable<EsfStateDto> {
        return this.http.get(`${EsfStateService.serviceUrl}/state/new/`).map((response: Response) => <EsfStateDto>response.json());
    }
}

export class EsfStateDto {
    Mapping: string;
    Documents: string;
    Query: string;
}