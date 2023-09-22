import { IsNumber } from 'class-validator';

export class DeleteTemplateDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  templateId: number;
}
