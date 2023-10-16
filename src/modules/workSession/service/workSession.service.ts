import { inject, injectable } from 'inversify';
import { IWorkSessionService } from '../interfaces/IWorkSession.service';
import { TYPES } from '../../../core/type.core';
import { IUserRepository } from '../../../modules/user/interfaces/IUser.repository';
import { IWorkSessionRepository } from '../interfaces/IWorkSession.repository';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { WorkSession } from '../entity/workSession.entity';
import { CreateWorkSessionServiceDto } from '../dto/create-work-session-service-dto';
import { ITemplateRepository } from '../../../modules/template/interfaces/ITemplate.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { EndWorkSessionDto } from '../dto/end-work-session-dto';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { CreateWorkSessionServiceReturnDto } from '../dto/create-work-session-service-return-dto';

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
    @inject(TYPES.ITemplateRepository)
    private readonly templateRepository: ITemplateRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

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
  ): Promise<CreateWorkSessionServiceReturnDto> {
    const { userId, tabs } = createWorkSessionServiceDto;

    const res = new CreateWorkSessionServiceReturnDto();
    res.isUnfinished = false;

    const latestUnfinishedWorkSessionDto =
      new FindLatestUnfinishedWorkSessionDto();
    latestUnfinishedWorkSessionDto.userId = userId;

    const latestWorkSession =
      await this.workSessionRepository.findLatestUnfinished(
        latestUnfinishedWorkSessionDto,
      );
    if (latestWorkSession) {
      res.isUnfinished = true;
      res.workSession = latestWorkSession;
      return res;
    }
    // create new WorkSession
    try {
      const user = await this.userRepository.findOneById(userId);
      const createWorkSessionDto = new CreateWorkSessionDto();
      createWorkSessionDto.user = user;
      // create without template
      createWorkSessionDto.tabs = tabs;
      const workSession = await this.workSessionRepository.create(
        createWorkSessionDto,
      );
      res.workSession = workSession;
      return res;
    } catch (error) {
      this.logger.error(`Failed to create new work session. Error: ${error}`);
      throw new InternalServerErrorException(
        'Failed to create a work session.',
      );
    }
  }

  async endWorkSession(
    endWorkSessionDto: EndWorkSessionDto,
  ): Promise<WorkSession> {
    try {
      return this.workSessionRepository.update(endWorkSessionDto.workSessionId);
    } catch (error) {
      this.logger.error(`Failed to create new work session. Error: ${error}`);
      throw new InternalServerErrorException(
        `Failed to update a work session.`,
      );
    }
  }
}
