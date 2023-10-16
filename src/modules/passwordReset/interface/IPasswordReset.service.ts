export interface IPasswordResetService {
  requestPasswordReset(email: string): Promise<void>;
  verifyToken(email: string, token: string): Promise<void>;
  updatePassword(email: string, password: string): Promise<void>;
};
