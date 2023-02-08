import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbilityModule } from 'src/ability/ability.module';
import { Request } from '../request/entities/request.entity';
import { RequestReport } from './entities/request-report.entity';
import { RequestReportController } from './request-report.controller';
import { RequestReportService } from './request-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Request, RequestReport]), AbilityModule],
  controllers: [RequestReportController],
  providers: [RequestReportService],
})
export class RequestReportModule {}
