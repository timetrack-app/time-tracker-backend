export const TYPES = {
  // general
  Logger: Symbol.for('Logger'),
  IDatabaseService: Symbol.for('IDatabaseService'),
  // user, auth
  UserController: Symbol.for('UserController'),
  IAuthRepository: Symbol.for('IAuthRepository'),
  IAuthService: Symbol.for('IAuthService'),
  IUserRepository: Symbol.for('IUserRepository'),
  IUserService: Symbol.for('IUserService'),
  IUserEmailVerificationRepository: Symbol.for(
    'IUserEmailVerificationRepository',
  ),
  IUserEmailVerificationService: Symbol.for('IUserEmailVerificationService'),
  ISendEMailService: Symbol.for('ISendEMailService'),
  IPassportService: Symbol.for('IPassportService'),
  // work session
  IWorkSessionService: Symbol.for('IWorkSessionService'),
  IWorkSessionRepository: Symbol.for('IWorkSessionRepository'),
  // template
  ITemplateService: Symbol.for('ITemplateService'),
  ITemplateRepository: Symbol.for('ITemplateRepository'),

  // tab
  ITabService: Symbol.for('ITabService'),
  ITabRepository: Symbol.for('ITabRepository'),

  // tab
  IListService: Symbol.for('IListService'),
  IListRepository: Symbol.for('IListRepository'),
};
