import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

import { EsfStateViewModel } from './esfStateViewModel';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService } from './esfStateValidation.service';
import { ExistingEsfStateDto } from './existingEsfStateDto';
import { EsfStateDto } from './esfStateDto';
import { CommandStateType } from '../shared/commands/commandStateType';
import { EsfCommand, EsfCommandState } from '../shared/commands/esfCommand';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EsfStateSaveCommand extends EsfCommand<EsfStateSaveCommandState> {

    constructor(
        private esfStateService: EsfStateService,
        private stateValidationService: EsfStateValidationService,
        private router: Router
    ) {
        super();
    }

    public run(state: EsfStateViewModel): void {
        try {
            this.stateValidationService.validateEsfState(state);
        }
        catch (error) {
            this.commandStateStream.next({
                commandState: CommandStateType.Disabled,
                savedState: state,
                error: error
            });
            return;
        }

        this.commandStateStream.next({
            commandState: CommandStateType.InProgress,
            savedState: state
        });

        this.esfStateService
            .createNewVersion(state.toDto())
            .subscribe((existingState: ExistingEsfStateDto) => {
                let savedState = state.fromDto(existingState.state);
                this.commandStateStream.next({
                    commandState: CommandStateType.Disabled,
                    savedState: savedState
                });
                this.router.navigate(['/state', existingState.stateUrl]);
            }, (error: Error) => {
                this.commandStateStream.next({
                    commandState: CommandStateType.Disabled,
                    savedState: state,
                    error: ((error instanceof Response) ? (<Response>error).json() : JSON.parse(error.message))
                });
            });
    }
}

export interface EsfStateSaveCommandState extends EsfCommandState {
    savedState: EsfStateViewModel;
}