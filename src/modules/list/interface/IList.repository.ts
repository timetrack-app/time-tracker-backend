import { Tab } from './../../tab/entity/tab.entity';
import { CreateListDto } from '../dto/createList.dto';
import { List } from '../entity/list.entity';

export interface IListRepository {
  findOneById(id: number): Promise<List | null>;
  create(tab: Tab, createListDto: CreateListDto): Promise<List>;
  update(updatedList: List): Promise<List>;
  delete(listId: number): Promise<void>;
}
