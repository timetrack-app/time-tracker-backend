import { WorkSession } from "../entity/workSession.entity";
import { CreateWorkSessionServiceDto } from "../dto/create-work-session-service-dto";
import { UpdateWorkSessionDto } from "../dto/update-work-session-dto";
import { FindLatestUnfinishedWorkSessionDto } from "../dto/find-latest-unfinished-work-session-dto";
import { CreateWorkSessionServiceReturnDto } from "../dto/create-work-session-service-return-dto";

export interface IWorkSessionService {
  createWorkSession(createWorkSessionServiceDto: CreateWorkSessionServiceDto): Promise<CreateWorkSessionServiceReturnDto>;
  updateWorkSession(updateWorkSessionDto: UpdateWorkSessionDto): Promise<WorkSession>;
  getLatestUnfinishedWorkSession(findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto): Promise<WorkSession | null>;
};
