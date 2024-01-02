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
   * @return {Promise<WorkSession>}
   * @memberof WorkSessionRepository
   */
  async create(
    createWorkSessionDto: CreateWorkSessionDto,
  ): Promise<WorkSession> {
    const entityManager = await this.database.getManager();
    const queryRunner = entityManager.connection.createQueryRunner();
    const workSessionRepo = await this.database.getRepository(WorkSession);
    const tabRepo = await this.database.getRepository(Tab);
    const listRepo = await this.database.getRepository(List);
    const taskRepo = await this.database.getRepository(Task);

    await queryRunner.startTransaction();
    const workSession = workSessionRepo.create({
      user: createWorkSessionDto.user,
      startAt: new Date(),
      tabs: [],
    });
    try {
      // save workSession
      const savedWorkSession = await queryRunner.manager.save(workSession);

      for (const unsavedTab of createWorkSessionDto.tabs) {
        // Create tab instance
        const tab = tabRepo.create({
          workSession: savedWorkSession,
          lists: [],
          name: unsavedTab.name,
          displayOrder: unsavedTab.displayOrder,
        });
        // save tab instance
        await queryRunner.manager.save(tab).then(async (savedTab) => {
          savedWorkSession.tabs.push(savedTab);
          for (const unsavedList of unsavedTab.lists) {
            // create list instance
            const list = listRepo.create({
              tab: savedTab,
              name: unsavedList.name,
              displayOrder: unsavedList.displayOrder,
              tasks: [],
            });
            // save list instance
            await queryRunner.manager.save(list).then(async (savedList) => {
              savedTab.lists.push(savedList);
              for (const unsavedTask of unsavedList.tasks) {
                // create task instance
                const task = taskRepo.create({
                  list: savedList,
                  name: unsavedTask.name,
                  displayOrder: unsavedTask.displayOrder,
                  totalTime: unsavedTask.totalTime,
                  isActive: unsavedTask.isActive,
                });

                await queryRunner.manager.save(task).then((savedTask) => {
                  savedList.tasks.push(savedTask);
                  // When task is active, set it as active task in the workSession instance
                  if (savedTask.isActive) {
                    savedWorkSession.activeTask = savedTask;
                    savedWorkSession.activeList = savedList;
                    savedWorkSession.activeTab = savedTab;
                  }
                });
              }
              // save list instance again, to update the tasks
              await queryRunner.manager.save(savedList);
            });
          }
          // save tab instance again, to update the lists
          await queryRunner.manager.save(savedTab);
        });
      }

      await queryRunner.manager.save(savedWorkSession);
      await queryRunner.commitTransaction();
      return savedWorkSession;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  // TODO: should move transaction to service layer
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
