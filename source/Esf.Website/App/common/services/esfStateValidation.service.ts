import { Injectable } from '@angular/core';

@Injectable()
export class EsfStateValidationService {

    static maxJSONLength: number = 10000;

    validateMapping(mapping: string): EsfStateValidationResult {
        return this.validateCommonProperties('Mapping', mapping);
    }

    validateQuery(query: string): EsfStateValidationResult {
        return this.validateCommonProperties('Query', query);
    }

    validateDocuments(documents: string): EsfStateValidationResult {
        let result = this.validateCommonProperties('Documents', documents);
        if (result.isError) {
            return result;
        }

        if (!this.isJSONArray(documents)) {
            return {
                isError: true,
                errorMessage: `Documents field must be an array`
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
                errorMessage: `${fieldName} has to be a valid JSON document`
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