import { WorkSession } from "../entity/workSession.entity";
import { CreateWorkSessionDto } from "../dto/create-work-session.dto";
import { CreateWorkSessionServiceDto } from "../dto/create-work-session-service-dto";

export interface IWorkSessionService {
  createWorkSession(createWorkSessionServiceDto: CreateWorkSessionServiceDto): Promise<WorkSession>
};
