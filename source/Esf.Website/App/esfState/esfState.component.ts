import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsfStateService, ExistingEsfStateDto, EsfStateDto } from "./esfState.service";
import { EsfQueryRunnerServiceContract, EsfQueryRunnerService, IEsfRunQueryResponse } from '../esfQueryRunner/esfQueryRunner.service';

@Component({
    templateUrl: '/App/esfState/esfState.component.html',
	providers: [EsfStateService, { provide: EsfQueryRunnerServiceContract, useClass: EsfQueryRunnerService }]
})
export class EsFiddlerComponent implements OnInit {
    state: EsfStateViewModel;
    queryRunner: EsfQueryRunner;
    lastSavedState: EsfStateDto;
    private sub: any;

    constructor(
        private esfStateService: EsfStateService,
        private route: ActivatedRoute,
        private router: Router,
		private queryRunnerService: EsfQueryRunnerServiceContract
    ) {
        this.state = new EsfStateViewModel();
        this.state = {
            documents: null,
            mapping: null,
            query: null,
        };
        this.queryRunner = new EsfQueryRunner(queryRunnerService);
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
                this.state = this.dtoToViewModel(state.state);
        }, (error: Error) => {
            console.error(error);
        });
    }

    private getStateByUrl(stateUrl: string): void {
        this.esfStateService.getState(stateUrl)
            .subscribe((state: ExistingEsfStateDto) => {
                this.state = this.dtoToViewModel(state.state);
                this.lastSavedState = this.copy(this.state);
            });        
    }

    public save(): void {
        if (!this.validateState()) {
            return;
        }
        this.esfStateService
            .createNewVersion(this.viewModelToDto(this.state))
            .subscribe((state: ExistingEsfStateDto) => {
                this.state = this.dtoToViewModel(state.state);
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

    private dtoToViewModel(dto: EsfStateDto): EsfStateViewModel {
        let documents: Object[] = dto.documents.map((doc: string): Object => JSON.parse(doc));
        let serializedDocuments: string = JSON.stringify(documents);

        return {
            query: dto.query,
            mapping: dto.mapping,
            documents: serializedDocuments
        };
    }

    private viewModelToDto(viewModel: EsfStateViewModel): EsfStateDto {
        let documents: Object[] = JSON.parse(viewModel.documents);
        let documentArray: string[] = documents.map((doc: any): string => JSON.stringify(doc));

        return {
            documents: documentArray,
            mapping: viewModel.mapping,
            query: viewModel.query
        };
    }
}

class EsfStateViewModel {
    mapping: string;
    documents: string;
    query: string;
}

export class EsfQueryRunner {
    queryResult: string;
    queryError: string; 

    constructor(private queryRunnerService: EsfQueryRunnerServiceContract) {
        this.queryResult = '';
        this.queryError = '';
    }

    public run(state: EsfStateViewModel): void {   
        var serializedDocs: string[];
        try {
            var documents: Object[] = JSON.parse(state.documents);
            serializedDocs = documents.map((doc: any): string => JSON.stringify(doc));
            if (!(serializedDocs instanceof Array)) {
                this.queryResult = '';
                this.queryError = 'The documents are not an array.';
                return;
            }
        }
        catch (error) {
            this.queryResult = '';
            this.queryError = 'The documents are not an array with JSON objects.' + JSON.stringify(error);
            return;
        }
        
        this.queryResult = 'Elastic Search is running Query. Wait for results...';
        this.queryError = '';
        this.queryRunnerService.runQuery(state.mapping, serializedDocs, state.query).subscribe((queryResponse: IEsfRunQueryResponse) => {
            this.queryResult = queryResponse.queryResponse.successJsonResult;
        }, (error: Error) => {
            this.queryResult = '';
            this.queryError = JSON.stringify(error);
        });
    }
}