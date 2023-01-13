export class ResetPasswordEvent {
  email: string;
  login: string;
  resetPasswordLink: string;
  password: string;

  constructor(partial: Partial<ResetPasswordEvent>) {
    Object.assign(this, partial);
  }
}
