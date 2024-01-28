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

  private async getTabRepo(): Promise<Repository<Tab>> {
    return await this.database.getRepository(Tab);
  }

  private async getListRepo(): Promise<Repository<List>> {
    return await this.database.getRepository(List);
  }

  private async getTaskRepo(): Promise<Repository<Task>> {
    return await this.database.getRepository(Task);
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
    // get entityManager and queryRunner
    const entityManager = await this.database.getManager();
    const queryRunner = entityManager.connection.createQueryRunner();

    // get repositories
    const workSessionRepo = await this.getWorkSessionRepo();
    const tabRepo = await this.getTabRepo();
    const listRepo = await this.getListRepo();
    const taskRepo = await this.getTaskRepo();

    try {
      // create workSession instance
      const workSession = workSessionRepo.create({
        user: createWorkSessionDto.user,
        startAt: new Date(),
        isPaused: false,
        tabs: [],
      });
      // save workSession
      const savedWorkSession = await queryRunner.manager.save(workSession);

      // create tab
      const tab = tabRepo.create({
        name: 'Untitled Project',
        workSession: savedWorkSession,
        lists: [],
        displayOrder: 1,
      });

      // save tab
      const savedTab = await queryRunner.manager.save(tab);

      // create list
      const primaryFocusList = listRepo.create({
        name: 'Primary Focus',
        tab: savedTab,
        tasks: [],
        displayOrder: 1,
      });

      const secondaryFocusList = listRepo.create({
        name: 'Secondary Focus',
        tab: savedTab,
        tasks: [],
        displayOrder: 2,
      });

      const otherList = listRepo.create({
        name: 'Other',
        tab: savedTab,
        tasks: [],
        displayOrder: 3,
      });

      // save lists
      const savedPrimaryFocusList = await queryRunner.manager.save(
        primaryFocusList,
      );

      const savedSecondaryFocusList = await queryRunner.manager.save(
        secondaryFocusList,
      );

      const savedOtherList = await queryRunner.manager.save(otherList);

      // create task
      const task = taskRepo.create({
        name: 'Untitled Task',
        list: savedPrimaryFocusList,
        totalTime: 0,
        description: '',
        displayOrder: 1,
      });

      // save task
      const savedTask = await queryRunner.manager.save(task);

      // update list
      savedPrimaryFocusList.tasks.push(savedTask);
      const updatedPrimaryFocusList = await queryRunner.manager.save(
        savedPrimaryFocusList,
      );

      // update tab
      savedTab.lists.push(updatedPrimaryFocusList);
      savedTab.lists.push(savedSecondaryFocusList);
      savedTab.lists.push(savedOtherList);
      const updatedTab = await queryRunner.manager.save(savedTab);

      // update workSession
      savedWorkSession.tabs.push(updatedTab);
      const updatedWorkSession = await queryRunner.manager.save(
        savedWorkSession,
      );

      await queryRunner.commitTransaction();
      return updatedWorkSession;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
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
