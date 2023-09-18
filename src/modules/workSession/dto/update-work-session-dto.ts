import { IsNumber } from 'class-validator';

export class UpdateWorkSessionDto {
  @IsNumber()
  workSessionId: number
};
