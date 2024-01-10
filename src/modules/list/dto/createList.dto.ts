import { IsNumber, IsString } from 'class-validator';

export class CreateListDto {
  @IsString()
  name: string;
  @IsNumber()
  displayOrder: number;
}
