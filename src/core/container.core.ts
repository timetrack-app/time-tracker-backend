import { Container } from 'inversify';
import { TYPES } from './type.core';

/* Database import */
import { DatabaseService } from './service/database.service';
import { IDatabaseService } from './interface/IDatabase.service';

/* Shared Service Import */
import { Logger } from '../common/services/logger.service';

/* All Controller Import */
import '../modules/index.controller';

/* Auth Import */
import { IAuthService } from '../modules/auth/interfaces/IAuth.service';
import { AuthService } from '../modules/auth/service/auth.service';

/* User Import */
import { IUserRepository } from '../modules/user/interfaces/IUser.repository';
import { UserRepository } from '../modules/user/repository/user.repository';
import { IUserService } from '../modules/user/interfaces/IUser.service';
import { UserService } from '../modules/user/service/user.service';

/* Passport Import */
import { PassportService } from '../modules/passport/service/passport.service';
import { IPassportService } from '../modules/passport/interface/IPassport.service';

/* UserEmailVerification Import */
import { IUserEmailVerificationRepository } from '../modules/userEmailVerification/interface/IUserEmailVerification.repository';
import { UserEmailVerificationRepository } from '../modules/userEmailVerification/repository/userEmailVerification.repository';
import { IUserEmailVerificationService } from '../modules/userEmailVerification/interface/IUserEmailVerification.service';
import { UserEmailVerificationService } from '../modules/userEmailVerification/service/userEmailVerification.service';

/* SendEmail Import */
import { SendEmailService } from '../modules/sendMail/service/sendEMail.service';
import { ISendEmailService } from '../modules/sendMail/interface/ISendEmail.service';

/* WorkSession import */
import { IWorkSessionService } from '../modules/workSession/interfaces/IWorkSession.service';
import { WorkSessionService } from '../modules/workSession/service/workSession.service';
import { IWorkSessionRepository } from '../modules/workSession/interfaces/IWorkSession.repository';
import { WorkSessionRepository } from '../modules/workSession/repository/workSession.repository';

/* Template import */
import { ITemplateRepository } from '../modules/template/interfaces/ITemplate.repository';
import { TemplateRepository } from '../modules/template/repository/template.repository';
import { ITemplateService } from '../modules/template/interfaces/ITemplate.service';
import { TemplateService } from '../modules/template/service/template.service';

/* Tab import */
import { ITabService } from '../modules/tab/interface/ITab.service';
import { TabService } from '../modules/tab/service/tab.service';
import { TabRepository } from '../modules/tab/repository/tab.repository';
import { ITabRepository } from '../modules/tab/interface/ITab.repository';

/* List import */
import { IListService } from '../modules/list/interface/IList.service';
import { ListService } from '../modules/list/service/list.service';
import { ListRepository } from '../modules/list/repository/list.repository';
import { IListRepository } from '../modules/list/interface/IList.repository';
import { ITaskService } from '../modules/task/interface/ITask.service';
import { ITaskRepository } from '../modules/task/interface/ITask.repository';
import { TaskService } from '../modules/task/service/task.service';
import { TaskRepository } from '../modules/task/repository/task.repository';

/* PasswordReset import */
import { IPasswordResetRepository } from '../modules/passwordReset/interface/IPasswordReset.repository';
import { PasswordResetRepository } from '../modules/passwordReset/repository/passwordReset.repository';
import { IPasswordResetService } from '../modules/passwordReset/interface/IPasswordReset.service';
import { PasswordResetService } from '../modules/passwordReset/service/passwordReset.Service';

const container = new Container();

container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);

/* Shared Service Bind */
container.bind<Logger>(TYPES.Logger).to(Logger);

/* Auth Module bind */
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

/* User Module bind */
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.IUserService).to(UserService);

/* EmailVerification Module bind */
container
  .bind<IUserEmailVerificationRepository>(
    TYPES.IUserEmailVerificationRepository,
  )
  .to(UserEmailVerificationRepository);
container
  .bind<IUserEmailVerificationService>(TYPES.IUserEmailVerificationService)
  .to(UserEmailVerificationService);

/*  SendEmailService bind */
container.bind<ISendEmailService>(TYPES.ISendEMailService).to(SendEmailService);

/* Passport bind */
container.bind<IPassportService>(TYPES.IPassportService).to(PassportService);

/* WorkSession bind */
container
  .bind<IWorkSessionService>(TYPES.IWorkSessionService)
  .to(WorkSessionService);
container
  .bind<IWorkSessionRepository>(TYPES.IWorkSessionRepository)
  .to(WorkSessionRepository);

/* Template bind */
container.bind<ITemplateService>(TYPES.ITemplateService).to(TemplateService);
container
  .bind<ITemplateRepository>(TYPES.ITemplateRepository)
  .to(TemplateRepository);

/* Tab bind */
container.bind<ITabService>(TYPES.ITabService).to(TabService);
container.bind<ITabRepository>(TYPES.ITabRepository).to(TabRepository);

/* List bind */
container.bind<IListService>(TYPES.IListService).to(ListService);
container.bind<IListRepository>(TYPES.IListRepository).to(ListRepository);

/* Task bind */
container.bind<ITaskService>(TYPES.ITaskService).to(TaskService);
container.bind<ITaskRepository>(TYPES.ITaskRepository).to(TaskRepository);

/* PasswordReset bind */
container.bind<IPasswordResetService>(TYPES.IPasswordResetService).to(PasswordResetService);
container.bind<IPasswordResetRepository>(TYPES.IPasswordResetRepository).to(PasswordResetRepository);

export default container;
