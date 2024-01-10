// ITab.service.ts

import { CreateTabDto } from '../dto/CreateTab.dto';
import { Tab } from '../entity/tab.entity';

export interface ITabService {
  createTab(workSessionId: number, createTabDto: CreateTabDto): Promise<Tab>;
  updateTab(
    workSessionId: number,
    tabId: number,
    attrs: Partial<Tab>,
  ): Promise<Tab>;
  deleteTab(workSessionId: number, tabId: number): Promise<void>;
}
