import { IsNumber } from 'class-validator';

export class FindLatestWorkSessionDto {
  @IsNumber()
  userId: number;
};
