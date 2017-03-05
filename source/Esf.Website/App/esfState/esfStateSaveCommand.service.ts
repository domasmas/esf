import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateViewModel } from '../common/models/esfStateViewModel';
import { EsfStateProvider } from '../common/interfaces/esfStateProvider.interface';
import { EsfStateService } from './esfState.service';
import { EsfStateValidationService, EsfStateValidationResult } from '../common/services/esfStateValidation.service';
import { ExistingEsfStateDto } from '../common/models/existingEsfStateDto';
import { EsfStateDto } from '../common/models/esfStateDto';
import { CommandState } from '../common/models/commandState';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EsfStateSaveCommandService {
    private stateProvider: EsfStateProvider;
    private commandStateStream: Subject<CommandState>;

    constructor(
        private esfStateService: EsfStateService,
        private stateValidationService: EsfStateValidationService,
        private router: Router
    ) {
        this.commandStateStream = new Subject<CommandState>();
    }

    public attachStateProvider(stateProvider: EsfStateProvider): void {
        this.stateProvider = stateProvider;
    }

    public getCommandState(): Observable<CommandState> {
        return this.commandStateStream.asObservable();
    }

    public run(): void {
        let esfState = this.stateProvider.getState();
        let validationMessage = this.stateValidationService.getValidationMessage(esfState);

        // TODO: show proper popover, better formatting, better message
        if (validationMessage) {
            alert("Cannot save because of errors: " + "\n" + validationMessage);
            return;
        }

        this.commandStateStream.next(CommandState.InProgress);

        this.esfStateService
            .createNewVersion(EsfStateViewModel.toDto(esfState))
            .subscribe((existingState: ExistingEsfStateDto) => {
                let savedState = EsfStateViewModel.fromDto(existingState.state);
                this.router.navigate(['/state', existingState.stateUrl]);
            }, (error: Error) => {
                console.error(error);
            }, () => {
                this.commandStateStream.next(CommandState.Enabled);
            });
    }
}