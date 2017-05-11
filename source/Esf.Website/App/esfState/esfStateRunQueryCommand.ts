import { Injectable } from '@angular/core';
import { EsfStateViewModel } from './esfStateViewModel';
import { EsfStateDto } from './esfStateDto';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService } from './esfStateValidation.service';
import { EsfQueryRunnerServiceContract, IEsfRunQueryResponse } from '../esfQueryRunner/esfQueryRunner.service';
import { CommandStateType } from '../shared/commands/commandStateType';
import { EsfCommandState, EsfCommand } from '../shared/commands/esfCommand';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EsfStateRunQueryCommand extends EsfCommand<EsfStateRunQueryCommandState> {
    constructor(
        private esfStateService: EsfStateService,
        private esfQueryRunnerService: EsfQueryRunnerServiceContract,
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

        let stateDto = state.toDto();

        this.commandStateStream.next({
            commandState: CommandStateType.InProgress,
            result: '',
            status: ''
        });

        this.esfQueryRunnerService.runQuery(stateDto.mapping, stateDto.documents, stateDto.query)
            .subscribe((queryResult: IEsfRunQueryResponse) => {
                if (queryResult.queryResponse.isSuccess) {
                    this.commandStateStream.next({
                        commandState: CommandStateType.Enabled,
                        result: queryResult.queryResponse.successJsonResult,
                        status: ''
                    });
                } else {
                    this.commandStateStream.next({
                        commandState: CommandStateType.Enabled,
                        result: '',
                        status: queryResult.queryResponse.jsonValidationError.error ||
                            queryResult.queryResponse.elasticsearchError.error
                    });
                }
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