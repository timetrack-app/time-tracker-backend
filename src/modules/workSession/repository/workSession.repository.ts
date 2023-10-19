import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { WorkSession } from '../entity/workSession.entity';
import { IWorkSessionRepository } from '../interfaces/IWorkSession.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { Tab } from '../../tab/entity/tab.entity';
import { List } from '../../list/entity/list.entity';
import { Repository, UpdateResult } from 'typeorm';
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

  async findOneById(workSessionId: number): Promise<WorkSession> {
    const repo = await this.getWorkSessionRepo();
    return repo.findOneBy({ id: workSessionId });
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
    const entityManager = await this.database.getManager();
    const workSessionRepo = await this.database.getRepository(WorkSession);
    const tabRepo = await this.database.getRepository(Tab);
    const listRepo = await this.database.getRepository(List);
    const taskRepo = await this.database.getRepository(Task);

    const workSession = workSessionRepo.create({
      user: createWorkSessionDto.user,
      startAt: new Date(),
    });

    // create tab and list instances from template
    const tabs: Tab[] = [];
    createWorkSessionDto.tabs.forEach((t) => {
      const tab = tabRepo.create({
        workSession,
        lists: [],
        name: t.name,
        displayOrder: t.displayOrder,
      });

      const lists = tab.lists.map((l) => {
        const list = listRepo.create({
          tab,
          name: l.name,
          displayOrder: l.displayOrder,
        });
        const tasks = l.tasks.map((t) => {
          const task = taskRepo.create({
            list,
            name: t.name,
            displayOrder: t.displayOrder,
          });
          // When task is active, set it as active task in the workSession instance
          if (t.isActive) workSession.activeTask = task;
          return task;
        });
        list.tasks = tasks;
        return list;
      });
      tab.lists = lists;
      tabs.push(tab);
    });

    const queryRunner = entityManager.queryRunner;
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(workSession);
      await queryRunner.manager.save(tabs);

      await queryRunner.commitTransaction();

      return workSession;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(workSessionId: number): Promise<WorkSession> {
    const repo = await this.getWorkSessionRepo();

    try {
      // https://github.com/typeorm/typeorm/issues/4920#issuecomment-813765677
      const updatedResult: UpdateResult = await repo
        .createQueryBuilder()
        .update(WorkSession)
        .set({ endAt: new Date() })
        .where('id = :id', { id: workSessionId })
        .returning('*')
        .updateEntity(true)
        .execute();

      if (updatedResult.affected && updatedResult.affected > 0) {
        return updatedResult.raw[0] as WorkSession;
      }

      throw new Error(
        `Failed to update the WorkSession with id:${workSessionId}.`,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
