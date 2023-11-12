import { IsInt, IsOptional } from 'class-validator';

export class GetTemplatesDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;
};
