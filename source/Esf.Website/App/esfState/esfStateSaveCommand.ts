import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateViewModel } from './esfStateViewModel';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService, EsfStateValidationResult } from './esfStateValidation.service';
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
        let validationMessage = this.stateValidationService.getValidationMessage(state);

        // TODO: show proper popover, better formatting, better message
        if (validationMessage) {
            alert("Cannot save because of errors: " + "\n" + validationMessage);
            return;
        }

        this.commandStateStream.next({
            commandState: CommandStateType.InProgress,
            savedState: state
        });

        this.esfStateService
            .createNewVersion(EsfStateViewModel.toDto(state))
            .subscribe((existingState: ExistingEsfStateDto) => {
                let savedState = EsfStateViewModel.fromDto(existingState.state);
                this.commandStateStream.next({
                    commandState: CommandStateType.Enabled,
                    savedState: savedState
                });
                this.router.navigate(['/state', existingState.stateUrl]);
            }, (error: Error) => {
                console.error(error);
                this.commandStateStream.next({
                    commandState: CommandStateType.Enabled,
                    savedState: state
                });
            });
    }
}

export interface EsfStateSaveCommandState extends EsfCommandState {
    savedState: EsfStateViewModel;
}