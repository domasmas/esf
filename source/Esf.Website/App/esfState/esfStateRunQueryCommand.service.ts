import { Injectable } from '@angular/core';
import { EsfStateViewModel } from '../common/models/esfStateViewModel';
import { EsfStateDto } from '../common/models/esfStateDto';
import { EsfStateProvider } from '../common/interfaces/esfStateProvider.interface';
import { EsfStateQueryResultConsumer } from '../common/interfaces/esfStateQueryResultConsumer.interface';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService } from '../common/services/esfStateValidation.service';
import { EsfQueryRunnerService } from '../esfQueryRunner/esfQueryRunner.service';

@Injectable()
export class EsfStateRunQueryCommand {
    constructor(
        private stateProvider: EsfStateProvider,
        private queryResultConsumer: EsfStateQueryResultConsumer,
        private esfStateService: EsfStateService,
        private esfQueryRunnerService: EsfQueryRunnerService,
        private stateValidationService: EsfStateValidationService
    ) {
    }

    run(): void {
        let state = this.stateProvider.getState();
        let validationMessage = this.stateValidationService.getValidationMessage(state);

        if (validationMessage) {
            alert("Cannot run a query because of errors: " + "\n" + validationMessage);
            return;
        }

        let stateDto = EsfStateViewModel.toDto(state);

        this.queryResultConsumer.setQueryResult('Elastic Search is running Query. Wait for results...');
        this.queryResultConsumer.setQueryStatus('');
        this.esfQueryRunnerService.runSearchQuery(state.mapping, stateDto.documents, state.query)
            .subscribe((queryResult: string) => {
                this.queryResultConsumer.setQueryResult(queryResult);
            }, (error: Error) => {
                this.queryResultConsumer.setQueryResult('');
                this.queryResultConsumer.setQueryStatus(JSON.stringify(error));
        });
    }
}