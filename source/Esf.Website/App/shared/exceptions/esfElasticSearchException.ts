import { EsfException } from './esfException';

export class EsfElasticSearchException extends EsfException {
    statusCode: string;
    errorMessage: string;
}
