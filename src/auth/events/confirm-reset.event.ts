export class ConfirmResetPasswordEvent {
  email: string;

  constructor(partial: Partial<ConfirmResetPasswordEvent>) {
    Object.assign(this, partial);
  }
}
