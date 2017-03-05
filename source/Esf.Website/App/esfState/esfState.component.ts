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
import { EsfStateRunQueryCommand, QueryResult } from './esfStateRunQueryCommand.service';
import { CommandState } from '../common/models/commandState';

@Component({
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [EsfStateService, EsfQueryRunnerService, EsfStateValidationService, EsfStateSaveCommandService, EsfStateRunQueryCommand]
})
export class EsFiddlerComponent implements OnInit, EsfStateProvider {
    private state: EsfStateViewModel;
    private lastSavedState: EsfStateDto;
    private sub: any;

    private queryResult: string;
    private queryError: string; 
    private runQueryCommandState: CommandState;

    private saveCommandState: CommandState;

    constructor(
        private route: ActivatedRoute,
        private esfStateService: EsfStateService,
        private saveCommand: EsfStateSaveCommandService,
        private runQueryCommand: EsfStateRunQueryCommand
    ) {
        this.state = new EsfStateViewModel();
        this.state = {
            documents: null,
            mapping: null,
            query: null,
        };
        
        this.setupCommands();
    }

    public ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let stateUrl = params['stateUrl'];
            if (stateUrl == null) {
                this.getInitialState();
            } else {
                this.getStateByUrl(stateUrl);
            }
        }); 
    }

    public getState(): EsfStateViewModel {
        return this.state;
    }

    private setupCommands() {

        // Save State Command

        this.saveCommand.attachStateProvider(this);
        this.saveCommand.getCommandState().subscribe((commandState: CommandState) => {
            this.saveCommandState = commandState;
        });

        // Run Query Command

        this.runQueryCommand.attachStateProvider(this);
        this.runQueryCommand.getQueryResults().subscribe((queryResult: QueryResult) => {
            this.queryResult = queryResult.result;
            this.queryError = queryResult.status;
        });
        this.runQueryCommand.getCommandState().subscribe((commandState: CommandState) => {
            this.runQueryCommandState = commandState;
        });
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