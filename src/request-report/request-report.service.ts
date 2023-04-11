import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotExistsError } from '../common/exceptions';
import { DataSource, In, Not, Repository } from 'typeorm';
import { Request } from '../request/entities/request.entity';
import { RequestReport } from './entities/request-report.entity';
import { UpsertRequestReportDto } from './dto/upsert-request-report.dto';

@Injectable()
export class RequestReportService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestReport)
    private requestReportRepository: Repository<RequestReport>,
    private dataSource: DataSource,
  ) {}

  async patch(requestId: number, upsertRequestReportDto: [UpsertRequestReportDto]) {
    return await this.dataSource.transaction(async (transaction) => {
      const request = await transaction.getRepository(Request).findOne({ where: { id: requestId } });
      if (!request) throw new NotExistsError('request');

      const incomingReportFiles = upsertRequestReportDto.map((i) => i.file);
      const existingReportFiles = (await transaction.getRepository(RequestReport).find({ where: { requestId } })).map(
        (i) => i.file,
      );

      await transaction.getRepository(RequestReport).delete({
        requestId,
        file: Not(In(incomingReportFiles)),
      });

      const filesToAdd = incomingReportFiles.filter((x) => !existingReportFiles.includes(x));

      const requestReportsToAdd = filesToAdd.map((x) =>
        transaction.getRepository(RequestReport).create({
          file: x,
          requestId: requestId,
        }),
      );

      return await transaction.getRepository(RequestReport).save(requestReportsToAdd);
    });
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
