import { WorkSession } from '../entity/workSession.entity';
import { CreateWorkSessionServiceDto } from '../dto/create-work-session-service-dto';
import { EndWorkSessionDto } from '../dto/end-work-session-dto';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { UpdateActiveTaskServiceDto } from '../dto/update-active-task-service.dto';
import { getWorkSessionsByUserIdDto } from '../dto/getWorkSessionByUserId.dto';

export interface IWorkSessionService {
  createWorkSession(
    createWorkSessionServiceDto: CreateWorkSessionServiceDto,
  ): Promise<WorkSession>;
  endWorkSession(endWorkSessionDto: EndWorkSessionDto): Promise<WorkSession>;
  getLatestUnfinishedWorkSession(
    findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto,
  ): Promise<WorkSession | null>;
  updateActiveTask(
    updateActiveTaskServiceDto: UpdateActiveTaskServiceDto,
  ): Promise<WorkSession>;
  getWorkSessionsByUserId(
    getWorkSessionsByUserIdDto: getWorkSessionsByUserIdDto,
  ): Promise<WorkSession[]>;
}
