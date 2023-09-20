import { WorkSession } from '../entity/workSession.entity';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { CreateWorkSessionFromTemplateDto } from '../dto/create-work-session-from-template-dto';

export interface IWorkSessionRepository {
  findOneById(workSessionId: number): Promise<WorkSession>;
  findLatestUnfinished(findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto): Promise<WorkSession | null>;
  create(createWorkSessionDto: CreateWorkSessionDto): Promise<WorkSession>;
  createFromTemplate(createWorkSessionFromTemplateDto: CreateWorkSessionFromTemplateDto): Promise<WorkSession>;
  update(workSessionId: number): Promise<WorkSession>;
};
