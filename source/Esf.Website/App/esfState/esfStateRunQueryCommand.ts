import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { EsfStateViewModel } from './esfStateViewModel';
import { EsfStateDto } from './esfStateDto';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService } from './esfStateValidation.service';
import { EsfQueryRunnerServiceContract, EsfQueryRunResult } from '../esfQueryRunner/esfQueryRunner.service';
import { CommandStateType } from '../shared/commands/commandStateType';
import { EsfCommandState, EsfCommand } from '../shared/commands/esfCommand';
import { EsfException } from '../shared/exceptions/esfException';

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

        this.commandStateStream.next({
            commandState: CommandStateType.InProgress,
            result: ''
        });

        try {
            this.stateValidationService.validateEsfState(state);
        }
        catch (error) {
            this.commandStateStream.next({
                commandState: CommandStateType.Enabled,
                result: '',
                error: error
            });
            return;
        }

        let stateDto = state.toDto();

        this.esfQueryRunnerService.runQuery(stateDto.mapping, stateDto.documents, stateDto.query)
            .subscribe((queryResult: EsfQueryRunResult) => {
                this.commandStateStream.next({
                    commandState: CommandStateType.Enabled,
                    result: queryResult.result
                });
            }, (error: Error) => {
                this.commandStateStream.next({
                    commandState: CommandStateType.Enabled,
                    result: '',
                    error: ((error instanceof Response) ? (<Response>error).json() : JSON.parse(error.message))
                });
            });
    }
}

export interface EsfStateRunQueryCommandState extends EsfCommandState {
    result: string;
}