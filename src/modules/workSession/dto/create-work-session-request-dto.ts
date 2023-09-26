import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkSessionRequestDto {
  @IsOptional()
  @IsNumber()
  templateId: number
};
