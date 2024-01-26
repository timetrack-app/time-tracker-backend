import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { WorkSession } from '../entity/workSession.entity';
import { IWorkSessionRepository } from '../interfaces/IWorkSession.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { Tab } from '../../tab/entity/tab.entity';
import { List } from '../../list/entity/list.entity';
import { Repository } from 'typeorm';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { Task } from '../../../modules/task/entity/task.entity';

/**
 *
 *
 * @class WorkSessionRepository
 * @implements {IWorkSessionRepository}
 */
@injectable()
export class WorkSessionRepository implements IWorkSessionRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
  ) {}

  private async getWorkSessionRepo(): Promise<Repository<WorkSession>> {
    return await this.database.getRepository(WorkSession);
  }

  /**
   * Find WorkSession by Id
   *
   * @param {number} workSessionId
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionRepository
   */
  async findOneById(workSessionId: number): Promise<WorkSession> {
    const repo = await this.getWorkSessionRepo();
    return repo.findOneBy({ id: workSessionId });
  }

  /**
   * Find WorkSessions by UserId
   *
   * @param {number} userId
   * @return {*}  {Promise<WorkSession[]>}
   * @memberof WorkSessionRepository
   */
  async findByUserId(userId: number): Promise<WorkSession[]> {
    const repo = await this.getWorkSessionRepo();
    return repo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  /**
   * Find the latest unfinished WorkSession
   *
   * @param {FindLatestUnfinishedWorkSessionDto} findLatestUnfinishedWorkSessionDto
   * @return {*}  {(Promise<WorkSession | null>)}
   * @memberof WorkSessionRepository
   */
  async findLatestUnfinished(
    findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto,
  ): Promise<WorkSession | null> {
    const repo = await this.getWorkSessionRepo();

    const latestWorkSession = await repo
      .createQueryBuilder('workSession')
      .innerJoinAndSelect('workSession.user', 'user')
      .innerJoinAndSelect('workSession.activeTask', 'activeTask')
      .innerJoinAndSelect('workSession.activeList', 'activeList')
      .innerJoinAndSelect('workSession.activeTab', 'activeTab')
      .leftJoinAndSelect('workSession.tabs', 'tab')
      .leftJoinAndSelect('tab.lists', 'list')
      .leftJoinAndSelect('list.tasks', 'task')
      .where('workSession.user_id = :userId', {
        userId: findLatestUnfinishedWorkSessionDto.userId,
      })
      .andWhere('workSession.end_at IS NULL')
      .getOne();
    return latestWorkSession;
  }

  /**
   * Create new WorkSession(no template)
   *
   * @param {CreateWorkSessionDto} createWorkSessionDto
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionRepository
   */
  async create(
    createWorkSessionDto: CreateWorkSessionDto,
  ): Promise<WorkSession> {
    const workSessionRepo = await this.database.getRepository(WorkSession);
    const workSession = workSessionRepo.create({
      user: createWorkSessionDto.user,
      startAt: new Date(),
      tabs: [],
    });
    return workSession;
  }

  /**
   * Update WorkSession
   *
   * @param {WorkSession} updatedWorkSession
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionRepository
   */
  async update(updatedWorkSession: WorkSession): Promise<WorkSession> {
    const repo = await this.getWorkSessionRepo();
    return await repo.save(updatedWorkSession);
  }
}
