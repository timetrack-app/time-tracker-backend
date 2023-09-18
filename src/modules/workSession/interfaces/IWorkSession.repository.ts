import { EntityManager } from 'typeorm';
import { WorkSession } from '../entity/workSession.entity';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { FindLatestWorkSessionDto } from '../dto/find-latest-work-session-dto';
import { CreateWorkSessionFromTemplateDto } from '../dto/create-work-session-from-template-dto';

export interface IWorkSessionRepository {
  create(createWorkSessionDto: CreateWorkSessionDto): Promise<WorkSession>;
  createFromTemplate(createWorkSessionFromTemplateDto: CreateWorkSessionFromTemplateDto): Promise<WorkSession>;
  // update(workSession: WorkSession): Promise<WorkSession>;
  // findLatest(findLatestWorkSessionDto: FindLatestWorkSessionDto): Promise<WorkSession | null>
};
