import { injectable } from 'inversify';
import { CreateListDto } from 'src/modules/list/dto/createList.dto';
import { List } from '../../src/modules/list/entity/list.entity';
import { IListService } from '../../src/modules/list/interface/IList.service';
import { fakeList } from '../factory/list.factory';

@injectable()
export class FakeListService implements IListService {
  createList(
    workSessionId: number,
    tabId: number,
    createListDto: CreateListDto,
  ): Promise<List> {
    return Promise.resolve({
      ...fakeList(),
      name: createListDto.name,
      displayOrder: createListDto.displayOrder,
    });
  }
  updateList(
    workSessionId: number,
    tabId: number,
    listId: number,
    attrs: Partial<List>,
  ): Promise<List> {
    return Promise.resolve({ ...fakeList(), id: listId, ...attrs });
  }
  deleteList(
    workSessionId: number,
    tabId: number,
    listId: number,
  ): Promise<void> {
    return Promise.resolve();
  }
}
