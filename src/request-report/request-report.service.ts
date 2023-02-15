import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotExistsError } from '../common/exceptions';
import { DataSource, Repository } from 'typeorm';
import { Request } from '../request/entities/request.entity';
import { RequestReport } from './entities/request-report.entity';
import { UpsertRequestReportDto } from './dto/upsert-request-report.dto';

@Injectable()
export class RequestReportService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestReport)
    private requestReportRepository: Repository<RequestReport>,
  ) {}

  async upsert(requestId: number, upsertRequestReportDto: [UpsertRequestReportDto]) {
    const request = await this.requestRepository.findOne({ where: { id: requestId } });
    if (!request) throw new NotExistsError('request');

    const existingRequestReports = await this.requestReportRepository.find({ where: { request: { id: requestId } } });

    const requestReports = upsertRequestReportDto.map((x) =>
      this.requestReportRepository.create({
        file: x.file,
        request: request,
      }),
    );

    //const a = requestReports.filter((x) => existingRequestReports.includes(x));

    return await this.requestReportRepository.save(requestReports);
  }

  findAll(requestId: number) {
    return this.requestReportRepository.find({
      where: {
        request: {
          id: requestId,
        },
      },
    });
  }
}
