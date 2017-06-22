import { Injectable } from '@angular/core';
import { EsfStateViewModel } from './esfStateViewModel';
import { EsfInvalidStateException } from '../shared/exceptions/esfInvalidStateException';

@Injectable()
export class EsfStateValidationService {

    static maxJSONLength: number = 10000;

    validateEsfState(esfState: EsfStateViewModel): void {
        let mappingErrors = this.validateMapping(esfState.mapping);
        let documentErrors = this.validateDocuments(esfState.documents);
        let queryErrors = this.validateQuery(esfState.query);

        if ([mappingErrors, documentErrors, queryErrors].some(x => x.some(y => !!y))) {
            let exception = {
                type: EsfInvalidStateException.name,
                mapping: mappingErrors,
                query: queryErrors,
                documents: documentErrors
            };
            throw exception;
        }
    }

    private validateMapping(mapping: string): string[] {
        return this.validateCommonProperties('Mapping', mapping);
    }

    private validateQuery(query: string): string[] {
        return this.validateCommonProperties('Query', query);
    }

    private validateDocuments(documents: string): string[] {
        let errors: string[] = [];

        let result = this.validateCommonProperties('Documents', documents);
        errors.push(...result);

        if (!this.isJSONArray(documents)) {
            errors.push(`Documents field must be an array, but was ${documents}`);
        }

        return errors;
    }

    private validateCommonProperties(fieldName: string, fieldValue: string): string[] {
        var errors: string[] = [];

        if (!this.isWithinLenghtLimit(fieldValue, EsfStateValidationService.maxJSONLength)) {
            errors.push( `${fieldName} length cannot be longer than ${EsfStateValidationService.maxJSONLength} characters`);
        }

        if (!this.isJSON(fieldValue)) {
            errors.push(`${fieldName} has to be a valid JSON document ${fieldValue}`);
        }

        return errors;
    }

    private isJSON(document: string): boolean {
        try {
            JSON.parse(document);
        } catch (e) {
            console.log('JSON parse error: ', e);
            return false;
        }

        return true;
    }

    private isJSONArray(document: string): boolean {
        try {
            return JSON.parse(document) instanceof Array;
        }
        catch (e) {
            console.log('JSON parse error: ', e);
            return false;
        }
    }

    private isWithinLenghtLimit(document: string, maxLength: number): boolean {
        return document === undefined || document === null || document.length <= maxLength;
    }
}