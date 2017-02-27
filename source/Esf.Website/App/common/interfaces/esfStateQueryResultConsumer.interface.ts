export interface EsfStateQueryResultConsumer {
    setQueryResult(result: string): void;
    setQueryStatus(status: string): void;
}