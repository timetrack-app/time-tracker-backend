import { WorkSession } from '../entity/workSession.entity';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
export interface IWorkSessionRepository {
  findOneById(workSessionId: number): Promise<WorkSession>;
  findByUserId(userId: number): Promise<WorkSession[]>;
  findLatestUnfinished(
    findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto,
  ): Promise<WorkSession | null>;
  create(createWorkSessionDto: CreateWorkSessionDto): Promise<WorkSession>;
  update(updatedWorkSession: WorkSession): Promise<WorkSession>;
}
