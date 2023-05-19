import { Module } from '@nestjs/common';
import { AuthListener } from './listeners/auth.listener';
import { MailService } from './mail.service';
import { RequestListener } from './listeners/request.listener';

@Module({
  providers: [MailService, AuthListener, RequestListener],
  exports: [MailService],
})
export class MailModule {}
