import { IsNumber } from 'class-validator';

export class getWorkSessionsByUserIdDto {
  @IsNumber()
  userId: number;
}
