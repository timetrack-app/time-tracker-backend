import { WorkSession } from '../entity/workSession.entity';

export type CreateWorkSessionReturnType = {
  isUnfinished: boolean
  workSession: WorkSession
};
