export interface ISendEmailService {
  init(): void;
  sendVerificationEmail(email: string, emailVerificationToken: string): void;
}
