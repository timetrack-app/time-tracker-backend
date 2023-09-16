export interface ISendEmailService {
  init(): void;
  sendVerificationEmail(email: string, emailVerificationToken: string): void;
  sendNewEmailConfirmationEmail(email: string, emailVerificationToken: string);
  sendNewPasswordConfirmationEmail(email: string, token: string): void;
  sendPasswordResetLinkEmail(id: number, email: string): void;
}
