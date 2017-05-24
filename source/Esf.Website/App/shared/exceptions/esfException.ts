export class EsfException {
    type: string;
    details: EsfExceptionDetails;
}

export class EsfExceptionDetails {
    errorMessage?: string;
}