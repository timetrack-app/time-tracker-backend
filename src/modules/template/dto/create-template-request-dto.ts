import { IsInt, IsString, IsArray, ValidateNested, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class ListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  displayOrder: number;
}

class TabDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  displayOrder: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListDto)
  lists?: ListDto[];
}

export class CreateTemplateRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TabDto)
  tabs?: TabDto[];
}
