import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { Client } from 'src/client/entities/client.entity';
import dayjs from 'dayjs';
import { Request } from '../request/entities/request.entity';
import { RequestStatus } from 'src/request/types/request-status.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async getBrigadiersCount(): Promise<number> {
    return this.brigadierRepository.count();
  }

  async getClientsCount(): Promise<number> {
    return this.clientRepository.count();
  }

  async getRequestStatistics(): Promise<Array<number>> {
    return Promise.all([
      this.requestRepository.count(),
      this.requestRepository.count({ where: { status: RequestStatus.APPROVED } }),
      // this.requestRepository.count({
      //   where: {
      //     registerDate: MoreThanOrEqual(dayjs().startOf('month').toDate()) && LessThan(dayjs().endOf('month').toDate()),
      //   },
      // }),
      // this.requestRepository.count({
      //   where: {
      //     status: RequestStatus.APPROVED,
      //     registerDate: MoreThanOrEqual(dayjs().startOf('month').toDate()) && LessThan(dayjs().endOf('month').toDate()),
      //   },
      // }),
    ]);
  }
}
