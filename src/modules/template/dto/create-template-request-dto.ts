import { IsInt, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';

class ListDto {
  @IsString()
  name: string;

  @IsInt()
  displayOrder: number;
}

class TabDto {
  @IsString()
  name: string;

  @IsInt()
  displayOrder: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  lists?: ListDto[];
}

export class CreateTemplateRequestDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  tabs?: TabDto[];
}
