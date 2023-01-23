import { PartialType } from '@nestjs/swagger';
import { CreateRequestReportDto } from './create-request-report.dto';

export class UpdateRequestReportDto extends PartialType(CreateRequestReportDto) {}
