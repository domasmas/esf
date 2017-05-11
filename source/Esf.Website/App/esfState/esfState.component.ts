import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateViewModel } from './esfStateViewModel';
import { EsfStateService } from './esfState.service';
import { ExistingEsfStateDto } from './existingEsfStateDto';
import { EsfStateDto } from './esfStateDto';
import { EsfQueryRunnerService, EsfQueryRunnerServiceContract } from '../esfQueryRunner/esfQueryRunner.service';
import { EsfStateValidationService, EsfStateValidationResult } from './esfStateValidation.service';
import { EsfStateSaveCommand, EsfStateSaveCommandState } from './esfStateSaveCommand';
import { EsfStateRunQueryCommand, EsfStateRunQueryCommandState } from './esfStateRunQueryCommand';
import { EsfCommandState } from '../shared/commands/esfCommand';
import { CommandStateType } from '../shared/commands/commandStateType';

@Component({
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [
        EsfStateService,
        { provide: EsfQueryRunnerServiceContract, useClass: EsfQueryRunnerService },
        EsfStateValidationService,
        EsfStateSaveCommand,
        EsfStateRunQueryCommand
    ]
})
export class EsFiddlerComponent implements OnInit {
    public state: EsfStateViewModel;
    private sub: any;

    private queryResult: string;
    private queryError: string;
    private runCommandEnabled: boolean;
    private runCommandInProgress: boolean;

    private saveCommandEnabled: boolean;
    private saveCommandInProgress: boolean;

    private editorsEnabled: boolean;

    constructor(
        private route: ActivatedRoute,
        private esfStateService: EsfStateService,
        private saveCommand: EsfStateSaveCommand,
        private runQueryCommand: EsfStateRunQueryCommand
    ) {
		var onStateChange = this.onStateChange.bind(this);
		this.state = new EsfStateViewModel(onStateChange, onStateChange, onStateChange);

        this.queryResult = '';

        this.runCommandEnabled = true;
        this.saveCommandEnabled = true;
        this.editorsEnabled = true;
        this.refreshStateFlags();
        
        this.setupCommands();
    }

    public ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let stateUrl = params['stateUrl'];
            if (stateUrl == null) {
                this.getInitialState();
            } else {
                this.getStateByUrl(stateUrl);
            }
        }); 
    }

    private setupCommands() {

        // Save State Command

        this.saveCommand.getCommandState().subscribe((commandState: EsfStateSaveCommandState) => {
			this.saveCommandEnabled = commandState.commandState == CommandStateType.Enabled;
			this.state = commandState.savedState;
			this.saveCommandInProgress = commandState.commandState == CommandStateType.InProgress;
            this.refreshStateFlags();
        });

        // Run Query Command

        this.runQueryCommand.getCommandState().subscribe((commandState: EsfStateRunQueryCommandState) => {
            this.queryResult = commandState.result;
            this.queryError = commandState.status;
            this.runCommandEnabled = commandState.commandState === CommandStateType.Enabled;
            this.runCommandInProgress = commandState.commandState === CommandStateType.InProgress;
            this.refreshStateFlags();
        });
    }

    private refreshStateFlags(): void {
        this.editorsEnabled = !this.runCommandInProgress && !this.saveCommandInProgress;
    }

	private getInitialState(): void {
        this.esfStateService
            .getInitialState()
            .subscribe((state: ExistingEsfStateDto) => {
				this.state = this.state.fromDto(state.state);
				this.saveCommandEnabled = false;
        }, (error: Error) => {
            console.error(error);
        });
    }

	private onStateChange(): void {
		this.saveCommandEnabled = true;
	}

	private getStateByUrl(stateUrl: string): void {
        this.esfStateService.getState(stateUrl)
            .subscribe((state: ExistingEsfStateDto) => {
				this.state = this.state.fromDto(state.state);
				this.saveCommandEnabled = false;
            });        
    }
}