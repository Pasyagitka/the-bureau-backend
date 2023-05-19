import { Injectable, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MailService } from '../mail.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RequestListener {
  constructor(
    private readonly mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @OnEvent('request.statusChanged', { async: true })
  async handleRequestStatusChangedEvent(event: any) {
    try {
      await this.mailService.sendRequestStatusChanged(event.email, event.address, event.status);
    } catch (e) {
      this.logger.error(`Email sending error. ${e.message}`);
    }
  }

  @OnEvent('request.brigadierChanged', { async: true })
  async handleBrigadierChangedEvent(event: any) {
    try {
      await this.mailService.sendBrigadierChanged(event.email, event.address);
    } catch (e) {
      this.logger.error(`Email sending error. ${e.message}`);
    }
  }
}
