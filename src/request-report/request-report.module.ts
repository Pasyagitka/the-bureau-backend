import { Module } from '@nestjs/common';
import { RequestReportService } from './request-report.service';
import { RequestReportController } from './request-report.controller';

@Module({
  controllers: [RequestReportController],
  providers: [RequestReportService]
})
export class RequestReportModule {}
