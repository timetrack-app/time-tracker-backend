import { IsNumber } from 'class-validator';

export class FindLatestUnfinishedWorkSessionDto {
  @IsNumber()
  userId: number;
};
