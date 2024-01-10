import { IsNumber } from 'class-validator';

export class EndWorkSessionDto {
  @IsNumber()
  workSessionId: number
};
