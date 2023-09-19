import { inject, injectable } from 'inversify';
import { TYPES } from 'src/core/type.core';
import { WorkSession } from '../entity/workSession.entity';
import { IWorkSessionRepository } from '../interfaces/IWorkSession.repository';
import { IDatabaseService } from 'src/core/interface/IDatabase.service';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { CreateWorkSessionFromTemplateDto } from '../dto/create-work-session-from-template-dto';
import { Tab } from '../entity/tab.entity';
import { List } from '../entity/list.entity';
import { Repository, UpdateResult } from 'typeorm';

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
  };

  async findOneById(workSessionId: number): Promise<WorkSession> {
    const repo = await this.getWorkSessionRepo();
    return repo.findOneBy({ id: workSessionId });
  }

  /**
   * Create new WorkSession(no template)
   *
   * @param {CreateWorkSessionDto} createWorkSessionDto
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionRepository
   */
  async create(createWorkSessionDto: CreateWorkSessionDto): Promise<WorkSession> {
    const repo = await this.getWorkSessionRepo();

    const workSession = repo.create({
      user: createWorkSessionDto.user,
      startAt: new Date(),
    });

    return repo.save(workSession);
  }

  /**
   * Create new WorkSession from a template
   *
   * @param {CreateWorkSessionFromTemplateDto} createWorkSessionFromTemplateDto
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionRepository
   */
  async createFromTemplate(createWorkSessionFromTemplateDto: CreateWorkSessionFromTemplateDto): Promise<WorkSession> {
    const entityManager = await this.database.getManager();
    const workSessionRepo = await this.database.getRepository(WorkSession);
    const tabRepo = await this.database.getRepository(Tab);
    const listRepo = await this.database.getRepository(List);

    const { user, templateTabs } = createWorkSessionFromTemplateDto;

    const workSession = workSessionRepo.create({
      user,
      startAt: new Date(),
    });

    // create tab and list instances from template
    const tabs: Tab[] = [];
    templateTabs.forEach((templateTab) => {
      const emptyLists: List[] = [];

      const tab = tabRepo.create({
        workSession,
        lists: emptyLists,
        name: templateTab.name,
        displayOrder: templateTab.displayOrder,
      });

      const lists = templateTab.lists.map((templateList) =>
        listRepo.create({
          tab,
          name: templateList.name,
          displayOrder: templateList.displayOrder,
        })
      );
      tab.lists = lists

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
        throw new Error(error)
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
        .set({ endAt: new Date(), })
        .where('id = :id', { id: workSessionId })
        .returning('*')
        .updateEntity(true)
        .execute();

      if (updatedResult.affected && updatedResult.affected > 0) {
        return updatedResult.raw[0] as WorkSession;
      }

      throw new Error();
    } catch (error) {
      throw error;
    }
  }
}