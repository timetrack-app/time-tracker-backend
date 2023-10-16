import { IsNumber, IsOptional } from 'class-validator';
import { Tab } from '../../../modules/tab/entity/tab.entity';
import { Task } from '../entity/task.entity';

export class CreateWorkSessionServiceDto {
  @IsNumber()
  userId: number;
  activeTask: Partial<Task>;
  @IsOptional()
  tabs: Tab[];
}
