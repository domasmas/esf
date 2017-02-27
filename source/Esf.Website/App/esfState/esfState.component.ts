import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateViewModel } from '../common/models/esfStateViewModel';
import { EsfStateService } from './esfState.service';
import { ExistingEsfStateDto } from '../common/models/existingEsfStateDto';
import { EsfStateDto } from '../common/models/esfStateDto';
import { EsfQueryRunnerService, IEsfQueryRunnerService } from '../esfQueryRunner/esfQueryRunner.service';
import { EsfStateValidationService, EsfStateValidationResult } from '../common/services/esfStateValidation.service';
import { EsfStateProvider } from '../common/interfaces/esfStateProvider.interface';
import { EsfStateSaveCommandService } from './esfStateSaveCommand.service';

@Component({
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [EsfStateService, EsfQueryRunnerService, EsfStateValidationService]
})
export class EsFiddlerComponent implements OnInit, EsfStateProvider {
    state: EsfStateViewModel;
    queryRunner: EsfQueryRunner;
    lastSavedState: EsfStateDto;
    private sub: any;
    private saveCommand: EsfStateSaveCommandService;

    constructor(
        private esfStateService: EsfStateService,
        private route: ActivatedRoute,
        private router: Router,
        private queryRunnerService: EsfQueryRunnerService,
        private stateValidationService: EsfStateValidationService
    ) {
        this.state = new EsfStateViewModel();
        this.state = {
            documents: null,
            mapping: null,
            query: null,
        };
        this.queryRunner = new EsfQueryRunner(queryRunnerService);
        this.saveCommand = new EsfStateSaveCommandService(this, this.esfStateService, this.stateValidationService, this.router);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let stateUrl = params['stateUrl'];
            if (stateUrl == null) {
                this.getInitialState();
            } else {
                this.getStateByUrl(stateUrl);
            }
        }); 
    }

    getState(): EsfStateViewModel {
        return this.state;
    }

    setState(state: EsfStateViewModel): void {
        this.state = state;
    }

    setMapping($event: string) {
        this.state.mapping = $event;
    }

    private getInitialState(): void {
        this.esfStateService
            .getInitialState()
            .subscribe((state: ExistingEsfStateDto) => {
                this.state = EsfStateViewModel.fromDto(state.state);
        }, (error: Error) => {
            console.error(error);
        });
    }

    private getStateByUrl(stateUrl: string): void {
        this.esfStateService.getState(stateUrl)
            .subscribe((state: ExistingEsfStateDto) => {
                this.state = EsfStateViewModel.fromDto(state.state);
                this.lastSavedState = this.copy(this.state);
            });        
    }

    private copy(source: any): any {
        return JSON.parse(JSON.stringify(source));
    }
}

export class EsfQueryRunner {
    queryResult: string;
    queryError: string; 

    constructor(private queryRunnerService: IEsfQueryRunnerService) {
        this.queryResult = '';
        this.queryError = '';
    }

    public run(state: EsfStateViewModel): void {   
        var serializedDocs: string[];
        try {
            var documents: Object[] = JSON.parse(state.documents);
            serializedDocs = documents.map((doc: any): string => JSON.stringify(doc));
            if (!(serializedDocs instanceof Array)) {
                this.queryResult = '';
                this.queryError = 'The documents are not an array.';
                return;
            }
        }
        catch (error) {
            this.queryResult = '';
            this.queryError = 'The documents are not an array with JSON objects.' + JSON.stringify(error);
            return;
        }
        
        this.queryResult = 'Elastic Search is running Query. Wait for results...';
        this.queryError = '';
        this.queryRunnerService.runSearchQuery(state.mapping, serializedDocs, state.query).subscribe((queryResult: string) => {
            this.queryResult = queryResult;
        }, (error: Error) => {
            this.queryResult = '';
            this.queryError = JSON.stringify(error);
        });
    }
}