import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkSessionServiceDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  templateId: number;
};
