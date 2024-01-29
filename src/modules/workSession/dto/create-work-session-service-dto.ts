import { IsNumber } from 'class-validator';

export class CreateWorkSessionServiceDto {
  @IsNumber()
  userId: number;
}
