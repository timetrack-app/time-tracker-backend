import { inject, injectable } from 'inversify';
import { IWorkSessionService } from '../interfaces/IWorkSession.service';
import { TYPES } from '../../../core/type.core';
import { IUserRepository } from '../../../modules/user/interfaces/IUser.repository';
import { IWorkSessionRepository } from '../interfaces/IWorkSession.repository';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { WorkSession } from '../entity/workSession.entity';
import { CreateWorkSessionServiceDto } from '../dto/create-work-session-service-dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { EndWorkSessionDto } from '../dto/end-work-session-dto';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { UpdateActiveTaskServiceDto } from '../dto/update-active-task-service.dto';
import { IListRepository } from '../../../modules/list/interface/IList.repository';
import { ITabRepository } from '../../../modules/tab/interface/ITab.repository';
import { ITaskRepository } from '../../../modules/task/interface/ITask.repository';
import { getWorkSessionsByUserIdDto } from '../dto/getWorkSessionByUserId.dto';

/**
 *
 *
 * @class WorkSessionService
 * @implements {IWorkSessionService}
 */
@injectable()
export class WorkSessionService implements IWorkSessionService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IWorkSessionRepository)
    private readonly workSessionRepository: IWorkSessionRepository,
    @inject(TYPES.ITabRepository)
    private readonly tabRepository: ITabRepository,
    @inject(TYPES.IListRepository)
    private readonly listRepository: IListRepository,
    @inject(TYPES.ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

  /**
   * Get WorkSessions by UserId
   *
   * @param {GetWorkSessionByUserIdDto} getWorkSessionsByUserIdDto
   * @return {*}  {Promise<WorkSession[]>}
   * @memberof WorkSessionService
   */
  async getWorkSessionsByUserId(
    getWorkSessionsByUserIdDto: getWorkSessionsByUserIdDto,
  ): Promise<WorkSession[]> {
    const { userId } = getWorkSessionsByUserIdDto;
    try {
      const workSessions = await this.workSessionRepository.findByUserId(
        userId,
      );
      return workSessions;
    } catch (error) {
      this.logger.error(`Failed to get the work sessions. Error: ${error}`);
      throw new InternalServerErrorException(
        'Failed to get the work sessions.',
      );
    }
  }
  /**
   * Get latest unfinished WorkSession
   *
   * @param {FindLatestUnfinishedWorkSessionDto} findLatestUnfinishedWorkSessionDto
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionService
   */
  async getLatestUnfinishedWorkSession(
    findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto,
  ): Promise<WorkSession> {
    let latestUnfinished: WorkSession;
    try {
      latestUnfinished = await this.workSessionRepository.findLatestUnfinished(
        findLatestUnfinishedWorkSessionDto,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get the latest unfinished WorkSession. Error: ${error}`,
      );
    }
    if (!latestUnfinished) {
      throw new NotFoundException(
        'Failed to get the latest unfinished WorkSession.',
      );
    }
    return latestUnfinished;
  }

  /**
   * Create a new WorkSession
   * If the parameter has templateId, create from the template
   * If the user has an unfinished WorkSession, return it without create a new one
   *
   * @param {CreateWorkSessionServiceDto} createWorkSessionServiceDto
   * @return {*}  {Promise<CreateWorkSessionServiceReturnDto>}
   * @memberof WorkSessionService
   */
  async createWorkSession(
    createWorkSessionServiceDto: CreateWorkSessionServiceDto,
  ): Promise<WorkSession> {
    const { userId } = createWorkSessionServiceDto;

    // create new WorkSession
    try {
      const user = await this.userRepository.findOneById(userId);
      if (!user) {
        this.logger.error(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const createWorkSessionDto = new CreateWorkSessionDto();
      createWorkSessionDto.user = user;

      const workSession = await this.workSessionRepository.create(
        createWorkSessionDto,
      );
      return workSession;
    } catch (error) {
      this.logger.error(`Failed to create new work session. Error: ${error}`);
      throw new InternalServerErrorException(
        'Failed to create a work session.',
      );
    }
  }

  /**
   * Update active Task
   *
   * @param {UpdateActiveTaskServiceDto} updateActiveTaskServiceDto
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionService
   */
  async updateActiveTask(
    updateActiveTaskServiceDto: UpdateActiveTaskServiceDto,
  ): Promise<WorkSession> {
    // TODO : accessing DB 5 times, need to optimize
    const { userId, workSessionId, activeTabId, activeListId, activeTaskId } =
      updateActiveTaskServiceDto;
    try {
      const user = await this.userRepository.findOneById(userId);
      if (!user) {
        this.logger.error(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const workSession = await this.workSessionRepository.findOneById(
        workSessionId,
      );
      if (!workSession) {
        this.logger.error(`WorkSession with ID ${workSessionId} not found`);
        throw new NotFoundException(
          `WorkSession with ID ${workSessionId} not found`,
        );
      }
      const activeTab = await this.tabRepository.findOneById(activeTabId);
      if (!activeTab) {
        this.logger.error(`Tab with ID ${activeTabId} not found`);
        throw new NotFoundException(`Task with ID ${activeTabId} not found`);
      }
      const activeList = await this.listRepository.findOneById(activeListId);
      if (!activeList) {
        this.logger.error(`List with ID ${activeListId} not found`);
        throw new NotFoundException(`Task with ID ${activeListId} not found`);
      }
      const activeTask = await this.taskRepository.findOneById(activeTaskId);
      if (!activeTask) {
        this.logger.error(`Task with ID ${activeTaskId} not found`);
        throw new NotFoundException(`Task with ID ${activeTaskId} not found`);
      }
      const updatedWorkSession = Object.assign(workSession, {
        activeTab,
        activeList,
        activeTask,
      });
      return await this.workSessionRepository.update(updatedWorkSession);
    } catch (error) {
      this.logger.error(`Failed to update the active task. Error: ${error}`);
      throw new InternalServerErrorException(
        'Failed to update the active task.',
      );
    }
  }

  /**
   * End a WorkSession
   *
   * @param {EndWorkSessionDto} endWorkSessionDto
   * @return {*}  {Promise<WorkSession>}
   * @memberof WorkSessionService
   */

  async endWorkSession(
    endWorkSessionDto: EndWorkSessionDto,
  ): Promise<WorkSession> {
    try {
      const { workSessionId } = endWorkSessionDto;
      const workSession = await this.workSessionRepository.findOneById(
        workSessionId,
      );
      if (!workSession) {
        this.logger.error(`WorkSession with ID ${workSessionId} not found`);
        throw new NotFoundException(
          `WorkSession with ID ${workSessionId} not found`,
        );
      }
      const endAt = new Date();
      const updatedWorkSession: WorkSession = {
        ...workSession,
        endAt,
      };
      return this.workSessionRepository.update(updatedWorkSession);
    } catch (error) {
      this.logger.error(`Failed to create new work session. Error: ${error}`);
      throw new InternalServerErrorException(
        `Failed to update a work session.`,
      );
    }
  }
}
