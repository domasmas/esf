import { Injectable } from '@angular/core';
import { EsfStateViewModel } from './esfStateViewModel';
import { EsfStateDto } from './esfStateDto';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService } from './esfStateValidation.service';
import { EsfQueryRunnerService } from '../esfQueryRunner/esfQueryRunner.service';
import { CommandStateType } from '../shared/commands/commandStateType';
import { EsfCommandState, EsfCommand } from '../shared/commands/esfCommand';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EsfStateRunQueryCommand extends EsfCommand<EsfStateRunQueryCommandState> {
    constructor(
        private esfStateService: EsfStateService,
        private esfQueryRunnerService: EsfQueryRunnerService,
        private stateValidationService: EsfStateValidationService
    ) {
        super();
    }

    public run(state: EsfStateViewModel): void {
        let validationMessage = this.stateValidationService.getValidationMessage(state);

        if (validationMessage) {
            alert("Cannot run a query because of errors: " + "\n" + validationMessage);
            return;
        }

        let stateDto = EsfStateViewModel.toDto(state);

        this.commandStateStream.next({
            commandState: CommandStateType.InProgress,
            result: 'Elastic Search is running Query. Wait for results...',
            status: ''
        });

        this.esfQueryRunnerService.runSearchQuery(state.mapping, stateDto.documents, state.query)
            .subscribe((queryResult: string) => {
                this.commandStateStream.next({
                    commandState: CommandStateType.Enabled,
                    result: queryResult,
                    status: ''
                });
            }, (error: Error) => {
                this.commandStateStream.next({
                    commandState: CommandStateType.Enabled,
                    result: '',
                    status: JSON.stringify(error)
                });
            });
    }
}

export interface EsfStateRunQueryCommandState extends EsfCommandState {
    result: string;
    status: string;
}