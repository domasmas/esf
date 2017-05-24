import { EsfException, EsfExceptionDetails } from './esfException';

export class EsfInvalidStateException extends EsfException {
    details: EsfStateErrorDetails;
}

export class EsfStateErrorDetails extends EsfExceptionDetails {
    mapping: string;
    query: string;
    documents: string;
}