export class RegisterUserEvent {
  email: string;
  activationLink: string;

  constructor(partial: Partial<RegisterUserEvent>) {
    Object.assign(this, partial);
  }
}
