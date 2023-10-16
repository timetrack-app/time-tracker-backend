import { Tab } from '../../../modules/tab/entity/tab.entity';
import { User } from '../../../modules/user/entity/user.entity';
import { Task } from '../entity/task.entity';

export class CreateWorkSessionDto {
  user: User;
  tabs: Tab[];
  activeTask: Partial<Task>;
}
