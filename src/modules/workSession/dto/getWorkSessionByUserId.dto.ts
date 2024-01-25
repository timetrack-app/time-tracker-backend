import { IsNumber } from 'class-validator';

export class GetWorkSessionByUserIdDto {
  @IsNumber()
  userId: number;
}
