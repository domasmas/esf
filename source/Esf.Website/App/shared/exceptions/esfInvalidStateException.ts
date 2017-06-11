import { EsfException } from './esfException';

export class EsfInvalidStateException extends EsfException {
    mapping: string[];
    query: string[];
    documents: string[];
}