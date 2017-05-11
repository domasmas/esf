import { ExistingEsfStateDto } from './existingEsfStateDto';

export class EsfStateResponseDto {
    esfState: ExistingEsfStateDto;
    error: string;
    success: boolean;
}