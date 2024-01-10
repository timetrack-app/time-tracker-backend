import { IsNumber, IsString } from 'class-validator';

export class UpdateTabDto {
  @IsString()
  name: string;
  @IsNumber()
  displayOrder: number;
}
