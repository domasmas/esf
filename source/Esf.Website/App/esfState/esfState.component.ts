import { Component } from '@angular/core';
import { EsfStateService, EsfStateDto } from "./esfState.service";
import { HTTP_PROVIDERS, Response} from '@angular/http';

@
Component({
    selector: 'my-app',
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [ EsfStateService, HTTP_PROVIDERS ]
})
export class EsFiddlerComponent {
    state: EsfState;
    queryRunner: EsfQueryRunner;

    constructor(private esfStateService: EsfStateService) {
        this.state = new EsfState();
        this.esfStateService.getInitialState().subscribe((state: EsfStateDto) => {
            this.state = {
                documents: state.documents,
                mapping: state.mapping,
                query: state.query   
            };
        },(error: Error) => {
            console.log(error);
        });
        this.queryRunner = new EsfQueryRunner(esfStateService);
    }
}

export class EsfState {
    mapping: string;
    query: string;
    documents: string;
}

export class EsfQueryRunner {
    queryResult: string;

    constructor(private esfStateService: EsfStateService) {
        this.queryResult = 'Query Result Value';
    }

    public run(): void {


        this.queryResult = 'Query was run';
    }
}