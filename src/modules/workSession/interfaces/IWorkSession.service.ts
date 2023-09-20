import { WorkSession } from "../entity/workSession.entity";
import { CreateWorkSessionServiceDto } from "../dto/create-work-session-service-dto";
import { EndWorkSessionDto } from "../dto/end-work-session-dto";
import { FindLatestUnfinishedWorkSessionDto } from "../dto/find-latest-unfinished-work-session-dto";
import { CreateWorkSessionServiceReturnDto } from "../dto/create-work-session-service-return-dto";

export interface IWorkSessionService {
  createWorkSession(createWorkSessionServiceDto: CreateWorkSessionServiceDto): Promise<CreateWorkSessionServiceReturnDto>;
  endWorkSession(endWorkSessionDto: EndWorkSessionDto): Promise<WorkSession>;
  getLatestUnfinishedWorkSession(findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto): Promise<WorkSession | null>;
};
