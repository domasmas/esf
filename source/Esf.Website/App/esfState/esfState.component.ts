import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateViewModel } from '../common/models/esfStateViewModel';
import { EsfStateService } from './esfState.service';
import { ExistingEsfStateDto } from '../common/models/existingEsfStateDto';
import { EsfStateDto } from '../common/models/esfStateDto';
import { EsfQueryRunnerService, IEsfQueryRunnerService } from '../esfQueryRunner/esfQueryRunner.service';
import { EsfStateValidationService, EsfStateValidationResult } from '../common/services/esfStateValidation.service';
import { EsfStateProvider } from '../common/interfaces/esfStateProvider.interface';
import { EsfStateQueryResultConsumer } from '../common/interfaces/esfStateQueryResultConsumer.interface';
import { EsfStateSaveCommandService } from './esfStateSaveCommand.service';
import { EsfStateRunQueryCommand } from './esfStateRunQueryCommand.service';

@Component({
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [EsfStateService, EsfQueryRunnerService, EsfStateValidationService]
})
export class EsFiddlerComponent implements OnInit, EsfStateProvider, EsfStateQueryResultConsumer {
    private state: EsfStateViewModel;
    private lastSavedState: EsfStateDto;
    private sub: any;
    private saveCommand: EsfStateSaveCommandService;
    private runQueryCommand: EsfStateRunQueryCommand;
    private queryResult: string;
    private queryError: string; 

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
        this.saveCommand = new EsfStateSaveCommandService(this, this.esfStateService, this.stateValidationService, this.router);
        this.runQueryCommand = new EsfStateRunQueryCommand(this, this, this.esfStateService, this.queryRunnerService, this.stateValidationService);
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

    setQueryResult(result: string): void {
        this.queryResult = result;
    }

    setQueryStatus(status: string): void {
        this.queryError = status;
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