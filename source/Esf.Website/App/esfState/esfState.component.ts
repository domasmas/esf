import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateService, EsfStateDto } from "./esfState.service";
import { Http, Response} from '@angular/http';

@
Component({
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [EsfStateService]
})
export class EsFiddlerComponent implements OnInit {
    state: EsfState;
    queryRunner: EsfQueryRunner;
    lastSavedState: EsfState;
    private sub: any;

    constructor(
        private esfStateService: EsfStateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.state = new EsfState();
        this.state = {
            documents: null,
            mapping: null,
            query: null,
            id: null
        };
        this.queryRunner = new EsfQueryRunner(null);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let id = params['id'];
            if (id == null) {
                this.getInitialState();
            } else {
                this.getStateById(id);
            }
        }); 
    }

    setMapping($event: string) {
        this.state.mapping = $event;
    }

    private getInitialState(): void {
        this.esfStateService
            .getInitialState()
            .subscribe((state: EsfStateDto) => {
                this.state = {
                    documents: state.documents,
                    mapping: state.mapping,
                    query: state.query,
                    id: state.id
                };
        }, (error: Error) => {
            console.error(error);
        });        
    }

    private getStateById(id: string): void {
        this.esfStateService.getState(id)
            .subscribe((state: EsfStateDto) => {
                this.state = {
                    documents: state.documents,
                    mapping: state.mapping,
                    query: state.query,
                    id: state.id
                };
                this.lastSavedState = this.copy(this.state);
            });        
    }

    public save(): void {
        if (!this.validateState()) {
            return;
        }
        this.esfStateService
            .createNewVersion(this.state)
            .subscribe((state: EsfStateDto) => {
                this.state = {
                    documents: state.documents,
                    mapping: state.mapping,
                    query: state.query,
                    id: state.id
                };
                this.lastSavedState = this.copy(this.state);
                this.router.navigate(['/state', state.id]);
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

export class EsfState {
    mapping: string;
    query: string;
    documents: string;
    id: string;
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