import { WorkSession } from './../../workSession/entity/workSession.entity';
import { CreateTabDto } from '../dto/CreateTab.dto';
import { Tab } from '../entity/tab.entity';

export interface ITabRepository {
  findOneById(id: number): Promise<Tab | null>;
  create(workSession: WorkSession, createTabDto: CreateTabDto): Promise<Tab>;
  update(updatedTab: Tab): Promise<Tab>;
  delete(tabId: number, workSession: WorkSession): Promise<void>;
}
