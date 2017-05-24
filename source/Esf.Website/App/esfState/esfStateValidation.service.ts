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

        if ([mappingErrors, documentErrors, queryErrors].some(r => r.isError)) {
            let exception = new EsfInvalidStateException();
            exception.type = EsfInvalidStateException.name;
            exception.details = {
                mapping: mappingErrors.errorMessage,
                query: queryErrors.errorMessage,
                documents: documentErrors.errorMessage
            };
            throw exception;
        }
    }

    private validateMapping(mapping: string): EsfStateValidationResult {
        return this.validateCommonProperties('Mapping', mapping);
    }

    private validateQuery(query: string): EsfStateValidationResult {
        return this.validateCommonProperties('Query', query);
    }

    private validateDocuments(documents: string): EsfStateValidationResult {
        let result = this.validateCommonProperties('Documents', documents);
        if (result.isError) {
            return result;
        }

        if (!this.isJSONArray(documents)) {
            return {
                isError: true,
                errorMessage: `Documents field must be an array, but was ${documents}`
            };
        }

        return {
            isError: false,
            errorMessage: null
        };
    }

    private validateCommonProperties(fieldName: string, fieldValue: string): EsfStateValidationResult {
        if (!this.isWithinLenghtLimit(fieldValue, EsfStateValidationService.maxJSONLength)) {
            return {
                isError: true,
                errorMessage: `${fieldName} length cannot be longer than ${EsfStateValidationService.maxJSONLength} characters`
            };
        }

        if (!this.isJSON(fieldValue)) {
            return {
                isError: true,
                errorMessage: `${fieldName} has to be a valid JSON document ${fieldValue}`
            };
        }

        return {
            isError: false,
            errorMessage: null
        };
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
        return JSON.parse(document) instanceof Array;
    }

    private isWithinLenghtLimit(document: string, maxLength: number): boolean {
        return document === undefined || document === null || document.length <= maxLength;
    }
}

export class EsfStateValidationResult {
    isError: boolean;
    errorMessage: string;
}