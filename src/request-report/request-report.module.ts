import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AbilityModule } from '../ability/ability.module';
import { Request } from '../request/entities/request.entity';
import { RequestReport } from './entities/request-report.entity';
import { RequestReportController } from './request-report.controller';
import { RequestReportService } from './request-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Request, RequestReport]), CloudinaryModule, AbilityModule],
  controllers: [RequestReportController],
  providers: [RequestReportService],
})
export class RequestReportModule {}
