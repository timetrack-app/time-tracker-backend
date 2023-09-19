import { WorkSession } from "../entity/workSession.entity";
import { CreateWorkSessionServiceDto } from "../dto/create-work-session-service-dto";
import { UpdateWorkSessionDto } from "../dto/update-work-session-dto";

export interface IWorkSessionService {
  createWorkSession(createWorkSessionServiceDto: CreateWorkSessionServiceDto): Promise<WorkSession>;
  updateWorkSession(updateWorkSessionDto: UpdateWorkSessionDto): Promise<WorkSession>;
  // TODO: getLatestWorkSession
};
