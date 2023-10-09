import { CreateListDto } from '../dto/createList.dto';
import { List } from '../entity/list.entity';

export interface IListService {
  createList(
    workSessionId: number,
    tabId: number,
    createListDto: CreateListDto,
  ): Promise<List>;
  updateList(
    workSessionId: number,
    tabId: number,
    listId: number,
    attrs: Partial<List>,
  ): Promise<List>;
  deleteList(
    workSessionId: number,
    tabId: number,
    listId: number,
  ): Promise<void>;
}
