import { Task } from '../entity/task.entity';
import { Tab } from './../../tab/entity/tab.entity';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateWorkSessionRequestDto {
  @IsOptional()
  tabs: Tab[];

  @IsOptional()
  activeTask: Partial<Task>;
}
