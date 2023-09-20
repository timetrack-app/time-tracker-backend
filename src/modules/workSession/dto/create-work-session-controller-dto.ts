import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkSessionControllerDto {
  @IsOptional()
  @IsNumber()
  templateId: number
};
