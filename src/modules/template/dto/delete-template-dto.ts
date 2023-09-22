import { IsInt } from 'class-validator';

export class DeleteTemplateDto {
  @IsInt()
  userId: number;

  @IsInt()
  templateId: number;
}
