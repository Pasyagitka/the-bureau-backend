import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfirmResetPasswordEvent } from '../../../auth/events/confirm-reset.event';
import { RegisterUserEvent } from '../../../auth/events/register-user.event';
import { ResetPasswordEvent } from '../../../auth/events/reset-password.event';
import { MailService } from '../mail.service';

@Injectable()
export class AuthListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.created', { async: true })
  async handleUserCreatedEvent(event: RegisterUserEvent) {
    await this.mailService.sendActivationMail(event.email, event.activationLink);
  }

  @OnEvent('user.resetPassword', { async: true })
  async handleResetPasswordEvent(event: ResetPasswordEvent) {
    await this.mailService.sendResetPasswordEmail(event.email, event.login, event.resetPasswordLink, event.password);
  }

  @OnEvent('user.confirmResetPassword', { async: true })
  async handleConfirmResetEvent(event: ConfirmResetPasswordEvent) {
    await this.mailService.sendConfirmResetPasswordEmail(event.email);
  }
}
