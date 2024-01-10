import { IsInt } from 'class-validator';

export class GetTemplateDto {
  @IsInt()
  userId: number;

  @IsInt()
  templateId: number;
};
