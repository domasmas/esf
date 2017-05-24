import { EsfException, EsfExceptionDetails } from './esfException';

export class EsfElasticSearchException extends EsfException {
    details: ElasticSearchExceptionDetails;
}

export class ElasticSearchExceptionDetails extends EsfExceptionDetails {
    statusCode: string;
    errorMessage: string;
}
