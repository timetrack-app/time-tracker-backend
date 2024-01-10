import { IsNumber, IsString } from 'class-validator';

export class CreateTabDto {
  @IsString()
  name: string;
  @IsNumber()
  displayOrder: number;
}
