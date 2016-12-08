import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateService, ExistingEsfStateDto, EsfStateDto } from "./esfState.service";

@
Component({
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [EsfStateService]
})
export class EsFiddlerComponent implements OnInit {
    state: EsfStateDto;
    queryRunner: EsfQueryRunner;
    lastSavedState: EsfStateDto;
    private sub: any;

    constructor(
        private esfStateService: EsfStateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.state = new EsfStateDto();
        this.state = {
            documents: null,
            mapping: null,
            query: null,
        };
        this.queryRunner = new EsfQueryRunner(null);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let stateUrl = params['stateUrl'];
            if (stateUrl == null) {
                this.getInitialState();
            } else {
                this.getStateByUrl(stateUrl);
            }
        }); 
    }

    setMapping($event: string) {
        this.state.mapping = $event;
    }

    private getInitialState(): void {
        this.esfStateService
            .getInitialState()
            .subscribe((state: ExistingEsfStateDto) => {
                this.state = state.state;
        }, (error: Error) => {
            console.error(error);
        });        
    }

    private getStateByUrl(stateUrl: string): void {
        this.esfStateService.getState(stateUrl)
            .subscribe((state: ExistingEsfStateDto) => {
                this.state = state.state;
                this.lastSavedState = this.copy(this.state);
            });        
    }

    public save(): void {
        if (!this.validateState()) {
            return;
        }
        this.esfStateService
            .createNewVersion(this.state)
            .subscribe((state: ExistingEsfStateDto) => {
                this.state = state.state;
                this.lastSavedState = this.copy(this.state);
                this.router.navigate(['/state', state.stateUrl]);
        }, (error: Error) => {
            console.error(error);
        });
    }

    private validateState(): boolean {
        if (JSON.stringify(this.state) ===
            JSON.stringify(this.lastSavedState)) {
            return false;
        }

        if (!(JSON.parse(this.state.documents) instanceof Array)) {
            alert("Documents field must be an array");
            return false;
        }

        return true;
    }

    private copy(source: any): any {
        return JSON.parse(JSON.stringify(source));
    }
}

export class EsfQueryRunner {
    queryResult: string;

    constructor(private esfStateService: EsfStateService) {
        this.queryResult = '';
    }

    public run(): void {
        this.queryResult = 'Query was run';
    }
} 