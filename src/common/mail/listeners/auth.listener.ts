import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfirmResetPasswordEvent } from '../../../auth/events/confirm-reset.event';
import { ResetPasswordEvent } from '../../../auth/events/reset-password.event';
import { MailService } from '../mail.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthListener {
  constructor(
    private readonly mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @OnEvent('user.resetPassword', { async: true })
  async handleResetPasswordEvent(event: ResetPasswordEvent) {
    try {
      await this.mailService.sendResetPasswordEmail(event.email, event.login, event.resetPasswordLink, event.password);
    } catch (e) {
      this.logger.error(`Email sending error. ${e.message}`);
    }
  }

  @OnEvent('user.confirmResetPassword', { async: true })
  async handleConfirmResetEvent(event: ConfirmResetPasswordEvent) {
    try {
      await this.mailService.sendConfirmResetPasswordEmail(event.email);
    } catch (e) {
      this.logger.error(`Email sending error. ${e.message}`);
    }
  }

  @OnEvent('user.accountActivated', { async: true })
  async handleAccoundActivatedEvent(event: any) {
    try {
      await this.mailService.sendAccountActivated(event.email);
    } catch (e) {
      this.logger.error(`Email sending error. ${e.message}`);
    }
  }

  @OnEvent('user.accountDeactivated', { async: true })
  async handleAccoundDeactivatedEvent(event: any) {
    try {
      await this.mailService.sendAccountDeactivated(event.email);
    } catch (e) {
      this.logger.error(`Email sending error. ${e.message}`);
    }
  }
}
