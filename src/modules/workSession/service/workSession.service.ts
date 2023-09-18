import { inject, injectable } from "inversify";
import { IWorkSessionService } from "../interfaces/IWorkSession.service";
import { TYPES } from "src/core/type.core";
import { IUserRepository } from "src/modules/user/interfaces/IUser.repository";
import { IWorkSessionRepository } from "../interfaces/IWorkSession.repository";
import { CreateWorkSessionDto } from "../dto/create-work-session.dto";
import { WorkSession } from "../entity/workSession.entity";
import { CreateWorkSessionServiceDto } from "../dto/create-work-session-service-dto";
import { ITemplateRepository } from "src/modules/template/interfaces/ITemplate.repository";
import { CreateWorkSessionFromTemplateDto } from "../dto/create-work-session-from-template-dto";
import { InternalServerErrorException } from "src/common/errors/all.exception";
import { Logger } from "src/common/services/logger.service";

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

  async createWorkSession(createWorkSessionServiceDto: CreateWorkSessionServiceDto): Promise<WorkSession> {
    const { userId, templateId } = createWorkSessionServiceDto

    try {
      const user = await this.userRepository.findOneById(userId);
      const createWorkSessionDto = new CreateWorkSessionDto();
      createWorkSessionDto.user = user;

      if (!templateId) {
        return this.workSessionRepository.create(createWorkSessionDto);
      }

      const template = await this.templateRepository.findOneById(templateId);
      const createFromTemplateDto = new CreateWorkSessionFromTemplateDto();
      createFromTemplateDto.user = user;
      createFromTemplateDto.templateTabs = template.tabs;

      return await this.workSessionRepository.createFromTemplate(createFromTemplateDto);
    } catch (error) {
      this.logger.error(`Failed to create new work session. Error: ${error}`);
      throw new InternalServerErrorException('Failed to create a work session.');
    }
  }
}
