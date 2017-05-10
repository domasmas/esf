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

        let stateDto = EsfStateViewModel.toDto(state);

        this.commandStateStream.next({
            commandState: CommandStateType.InProgress,
            result: '',
            status: ''
        });

        this.esfQueryRunnerService.runQuery(state.mapping, stateDto.documents, state.query)
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
                        status: (() => {
                            if (queryResult.createMappingResponse && queryResult.createMappingResponse.jsonValidationError) {
                                return queryResult.createMappingResponse.jsonValidationError.error;
                            }
                            if (queryResult.createDocumentsResponse && queryResult.createDocumentsResponse.jsonValidationError) {
                                return queryResult.createDocumentsResponse.jsonValidationError.error;
                            }
                            if (queryResult.queryResponse && queryResult.queryResponse.jsonValidationError) {
                                return queryResult.queryResponse.jsonValidationError.error;
                            }
                            return null;
                        })()
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