import { IsNumber, IsString } from 'class-validator';

export class UpdateListDto {
  @IsString()
  name: string;
  @IsNumber()
  displayOrder: number;
}
