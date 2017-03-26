import { EsfStateDto } from './esfStateDto';

export class EsfStateViewModel {
    mapping: string;
    documents: string;
    query: string;

    static toDto(state: EsfStateViewModel): EsfStateDto {
        let documents: Object[] = JSON.parse(state.documents);
        let documentArray: string[] = documents.map((doc: any): string => JSON.stringify(doc));

        return {
            documents: documentArray,
            mapping: state.mapping,
            query: state.query
        };
    }

    static fromDto(dto: EsfStateDto): EsfStateViewModel {
        let documents: Object[] = dto.documents.map((doc: string): Object => JSON.parse(doc));
        let serializedDocuments: string = JSON.stringify(documents);

        return {
            query: dto.query,
            mapping: dto.mapping,
            documents: serializedDocuments
        };
    }
}