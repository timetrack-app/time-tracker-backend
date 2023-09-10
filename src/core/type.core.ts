export const TYPES = {
  Logger: Symbol.for('Logger'),
  IDatabaseService: Symbol.for('IDatabaseService'),
  UserController: Symbol.for('UserController'),
  IAuthRepository: Symbol.for('IAuthRepository'),
  IAuthService: Symbol.for('IAuthService'),
  IUserRepository: Symbol.for('IUserRepository'),
  IUserService: Symbol.for('IUserService'),
  IUserEmailVerificationRepository: Symbol.for(
    'IUserEmailVerificationRepository',
  ),
  IUserEmailVerificationService: Symbol.for('IUserEmailVerificationService'),
  ISendEMailService: Symbol('ISendEMailService'),
  PassportService: Symbol('PassportService'),
};
