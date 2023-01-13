import { Module } from '@nestjs/common';
import { AuthListener } from './listeners/auth.listener';
import { MailService } from './mail.service';

@Module({
  providers: [MailService, AuthListener],
  exports: [MailService],
})
export class MailModule {}
