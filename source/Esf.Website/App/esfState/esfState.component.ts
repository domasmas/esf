import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateService, EsfStateDto } from "./esfState.service";
import { HTTP_PROVIDERS, Response} from '@angular/http';
import { JsonEditorDirective } from '../common/components/jsonEditor.directive';

@
Component({
    selector: 'my-app',
    templateUrl: '/App/esfState/esfState.component.html',
    providers: [EsfStateService, HTTP_PROVIDERS],
    directives: [JsonEditorDirective]
})
export class EsFiddlerComponent implements OnInit {
    state: EsfState;
    queryRunner: EsfQueryRunner;
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
            console.log(id);
            if (id == null) {
                this.esfStateService.getInitialState().subscribe((state: EsfStateDto) => {
                    this.state = {
                        documents: state.documents,
                        mapping: state.mapping,
                        query: state.query,
                        id: state.id
                    };
                }, (error: Error) => {
                    console.log(error);
                });
            } else {
                this.esfStateService.getState(id)
                    .subscribe((state: EsfStateDto) => {
                        this.state = {
                            documents: state.documents,
                            mapping: state.mapping,
                            query: state.query,
                            id: state.id
                        };
                    });
            }
        }); 
    }

    public save(): void {
        this.esfStateService.createNewVersion(this.state).subscribe((state: EsfStateDto) => {
            this.state = {
                documents: state.documents,
                mapping: state.mapping,
                query: state.query,
                id: state.id
            };
            console.log('After update server returned: ', state);
            this.router.navigate(['/state', state.id]);
        }, (error: Error) => {
            console.log(error);
        });
    }
}

export class EsfState {
    mapping: string;
    query: string;
    documents: string[];
    id: string;
}

export class EsfQueryRunner {
    queryResult: string;

    constructor(private esfStateService: EsfStateService) {
        this.queryResult = 'Query Result Value';
    }

    public run(): void {
        this.queryResult = 'Query was run';
    }
} 