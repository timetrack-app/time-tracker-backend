import { Tab } from './../../tab/entity/tab.entity';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkSessionRequestDto {
  tabs: Tab[];
}
