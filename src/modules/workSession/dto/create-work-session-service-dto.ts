import { IsNumber, IsOptional } from 'class-validator';
import { Tab } from '../../../modules/tab/entity/tab.entity';

export class CreateWorkSessionServiceDto {
  @IsNumber()
  userId: number;
  @IsOptional()
  tabs: Tab[];
}
