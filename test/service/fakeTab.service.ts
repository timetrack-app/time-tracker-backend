import { injectable } from 'inversify';
import { CreateTabDto } from '../../src/modules/tab/dto/CreateTab.dto';
import { Tab } from '../../src/modules/tab/entity/tab.entity';
import { ITabService } from '../../src/modules/tab/interface/ITab.service';
import { fakeTab } from '../factory/tab.factory';

@injectable()
export class FakeTabService implements ITabService {
  createTab(workSessionId: number, createTabDto: CreateTabDto): Promise<Tab> {
    return Promise.resolve({
      ...fakeTab(),
      name: createTabDto.name,
      displayOrder: createTabDto.displayOrder,
    });
  }
  updateTab(
    workSessionId: number,
    tabId: number,
    attrs: Partial<Tab>,
  ): Promise<Tab> {
    return Promise.resolve({ ...fakeTab(), id: tabId, name: attrs.name });
  }
  deleteTab(workSessionId: number, tabId: number): Promise<void> {
    return Promise.resolve();
  }
}
