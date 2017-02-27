import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateViewModel } from '../common/models/esfStateViewModel';
import { EsfStateProvider } from '../common/interfaces/esfStateProvider.interface';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService, EsfStateValidationResult } from '../common/services/esfStateValidation.service';
import { ExistingEsfStateDto } from '../common/models/existingEsfStateDto';
import { EsfStateDto } from '../common/models/esfStateDto';

@Injectable()
export class EsfStateSaveCommandService {
    constructor(
        private stateProvider: EsfStateProvider,
        private esfStateService: EsfStateService,
        private stateValidationService: EsfStateValidationService,
        private router: Router
    ) {
    }

    run(): void {
        let esfState = this.stateProvider.getState();
        let validationMessage = this.stateValidationService.getValidationMessage(esfState);

        // TODO: show proper popover, better formatting, better message
        if (validationMessage) {
            alert("Cannot save because of errors: " + "\n" + validationMessage);
            return;
        }

        this.esfStateService
            .createNewVersion(EsfStateViewModel.toDto(esfState))
            .subscribe((existingState: ExistingEsfStateDto) => {
                let savedState = EsfStateViewModel.fromDto(existingState.state);
                this.stateProvider.setState(savedState);
                this.router.navigate(['/state', existingState.stateUrl]);
            }, (error: Error) => {
                console.error(error);
            });
    }

    canRun(): boolean {
        let esfState = this.stateProvider.getState();
        return !!this.stateValidationService.getValidationMessage(esfState);
    }
}