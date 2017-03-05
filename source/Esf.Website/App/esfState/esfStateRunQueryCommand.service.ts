import { Injectable } from '@angular/core';
import { EsfStateViewModel } from '../common/models/esfStateViewModel';
import { EsfStateDto } from '../common/models/esfStateDto';
import { EsfStateProvider } from '../common/interfaces/esfStateProvider.interface';
import { EsfStateQueryResultConsumer } from '../common/interfaces/esfStateQueryResultConsumer.interface';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService } from '../common/services/esfStateValidation.service';
import { EsfQueryRunnerService } from '../esfQueryRunner/esfQueryRunner.service';
import { CommandState } from '../common/models/commandState';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EsfStateRunQueryCommand {
    private stateProvider: EsfStateProvider;
    private queryResultStream: Subject<QueryResult>;
    private commandStateStream: Subject<CommandState>;

    constructor(
        private esfStateService: EsfStateService,
        private esfQueryRunnerService: EsfQueryRunnerService,
        private stateValidationService: EsfStateValidationService
    ) {
        this.queryResultStream = new Subject<QueryResult>();
        this.commandStateStream = new Subject<CommandState>();
    }
     
    public attachStateProvider(stateProvider: EsfStateProvider): void {
        this.stateProvider = stateProvider;
    }

    public getQueryResults(): Observable<QueryResult> {
        return this.queryResultStream.asObservable();
    }

    public getCommandState(): Observable<CommandState> {
        return this.commandStateStream.asObservable();
    }

    public run(): void {
        let state = this.stateProvider.getState();
        let validationMessage = this.stateValidationService.getValidationMessage(state);

        if (validationMessage) {
            alert("Cannot run a query because of errors: " + "\n" + validationMessage);
            return;
        }

        this.commandStateStream.next(CommandState.InProgress);

        let stateDto = EsfStateViewModel.toDto(state);

        this.queryResultStream.next({
            result: 'Elastic Search is running Query. Wait for results...',
            status: ''
        });

        this.esfQueryRunnerService.runSearchQuery(state.mapping, stateDto.documents, state.query)
            .subscribe((queryResult: string) => {
                this.queryResultStream.next({
                    result: queryResult,
                    status: ''
                });
            }, (error: Error) => {
                this.queryResultStream.next({
                    result: '',
                    status: JSON.stringify(error)
                });
            }, () => {
                this.commandStateStream.next(CommandState.Enabled);
            });
    }
}

export class QueryResult {
    public result: string;
    public status: string;
}