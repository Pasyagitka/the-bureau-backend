import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory';
import { DataSource, Repository } from 'typeorm';
import { Request } from '../request/entities/request.entity';
import { CreateRequestReportDto } from './dto/create-request-report.dto';
import { RequestReport } from './entities/request-report.entity';

@Injectable()
export class RequestReportService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestReport)
    private requestReportRepository: Repository<RequestReport>,
    private readonly abilityFactory: AbilityFactory,
  ) {}
  //move to reuest service

  create(createRequestReportDto: CreateRequestReportDto) {
    return 'This action adds a new requestReport';
  }

  findAll() {
    return `This action returns all requestReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestReport`;
  }
}
