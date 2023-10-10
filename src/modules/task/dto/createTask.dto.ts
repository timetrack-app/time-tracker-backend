import { IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  displayOrder: number;
}
