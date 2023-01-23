import { Injectable } from '@nestjs/common';
import { CreateRequestReportDto } from './dto/create-request-report.dto';
import { UpdateRequestReportDto } from './dto/update-request-report.dto';

@Injectable()
export class RequestReportService {
  create(createRequestReportDto: CreateRequestReportDto) {
    return 'This action adds a new requestReport';
  }

  findAll() {
    return `This action returns all requestReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestReport`;
  }

  update(id: number, updateRequestReportDto: UpdateRequestReportDto) {
    return `This action updates a #${id} requestReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestReport`;
  }
}
