import { EsfStateDto } from './esfStateDto';
import { Observable, Subject } from 'rxjs/Rx';
import { EventEmitter, Input, Output } from '@angular/core';

class NotifyOnChangeProperty<T> {
	private _value: T;
	private _onChangedValue: EventEmitter<boolean>;

	constructor(initialValue: T = undefined) {
		this._value = initialValue;
		this._onChangedValue = new EventEmitter<boolean>();
	}
	
	get value(): T {
		return this._value;
	}

	set value(newValue: T) {
		let hasValueChanged: boolean = newValue !== this._value;
		this._value = newValue;
		this._onChangedValue.next(hasValueChanged);
	}

	get onChangedValue(): Observable<boolean> {
		return this._onChangedValue.asObservable();
	}
}

export class EsfStateViewModel {
	private _mapping: NotifyOnChangeProperty<string>;

	@Input()
	get mapping(): string {
		return this._mapping.value;
	}
	
	set mapping(value: string) {
		this._mapping.value = value;
	}

	private _documents: NotifyOnChangeProperty<string>;

	@Input()
	get documents(): string {
		return this._documents.value;
	}
	
	set documents(value: string) {
		this._documents.value = value;
	}

	private _query: NotifyOnChangeProperty<string>;
	
	@Input()
	get query(): string {
		return this._query.value;
	}
	
	set query(value: string) {
		this._query.value = value;
	}

	constructor(private changedMappingListener: (isChanged: boolean) => void, private changedQueryListener: (isChanged: boolean) => void,
		private changedDocumentsListener: (isChanged: boolean) => void, mappingInitialValue: string = undefined, queryInitialValue: string = undefined,
		documentsInitialValue: string = undefined) {

		this._mapping = new NotifyOnChangeProperty<string>(mappingInitialValue);
		this._mapping.onChangedValue.subscribe(changedMappingListener);

		this._documents = new NotifyOnChangeProperty<string>(documentsInitialValue);
		this._documents.onChangedValue.subscribe(changedDocumentsListener);

		this._query = new NotifyOnChangeProperty<string>(queryInitialValue);
		this._query.onChangedValue.subscribe(changedQueryListener);
	}

    toDto(): EsfStateDto {
        let documents: Object[] = JSON.parse(this.documents);
        let documentArray: string[] = documents.map((doc: any): string => JSON.stringify(doc));

        return {
			documents: documentArray,
			mapping: this.mapping,
			query: this.query
        };
    }

	fromDto(dto: EsfStateDto): EsfStateViewModel {
        let documents: Object[] = dto.documents.map((doc: string): Object => JSON.parse(doc));
        let serializedDocuments: string = JSON.stringify(documents);

		return new EsfStateViewModel(this.changedMappingListener, this.changedQueryListener, this.changedDocumentsListener,
			dto.mapping, dto.query, serializedDocuments);
    }
}