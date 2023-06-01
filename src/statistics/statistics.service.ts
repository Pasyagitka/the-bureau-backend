import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brigadier } from '../brigadier/entities/brigadier.entity';
import { Client } from '../client/entities/client.entity';
import { Request } from '../request/entities/request.entity';
import { RequestStatus } from '../request/types/request-status.enum';
import { StatisticsQuery } from './dto/statistics.query.dto';
import { DataSource } from 'typeorm';
import dayjs from 'dayjs';
import { InvoiceStatus } from '../invoice/types/invoice-status.enum';
import { Invoice } from '../invoice/entities/invoice.entity';
import { RequestEquipment } from '../request/entities/request-equipment.entity';
import { InvoiceItem } from '../invoice/entities/invoice-items.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private readonly dataSource: DataSource,
  ) {}

  async getBrigadiersCount(): Promise<number> {
    return this.brigadierRepository.count();
  }

  async getClientsCount(): Promise<number> {
    return this.clientRepository.count();
  }

  async getRequestCount(query: StatisticsQuery) {
    const countTotal = this.dataSource.createQueryBuilder().from(Request, 'request');
    const countByStatus = this.dataSource.createQueryBuilder().from(Request, 'request').where('status = :status');

    const addPeriod = (query, period) => {
      const minDate = dayjs(period).startOf('month').toDate();
      const maxDate = dayjs(period).endOf('month').toDate();

      return query
        .andWhere('request."registerDate" >= :after', {
          after: minDate,
        })
        .andWhere('request."registerDate" < :before', {
          before: maxDate,
        });
    };
    if (query.month) {
      addPeriod(countTotal, query.month);
      addPeriod(countByStatus, query.month);
    }
    const [count, inProcessingCount, acceptedCount, completedCount, approvedCount] = await Promise.all([
      countTotal.getCount(),
      countByStatus.setParameter('status', RequestStatus.INPROCESSING).getCount(),
      countByStatus.setParameter('status', RequestStatus.ACCEPTED).getCount(),
      countByStatus.setParameter('status', RequestStatus.COMPLETED).getCount(),
      countByStatus.setParameter('status', RequestStatus.APPROVED).getCount(),
    ]);
    return [
      { count, label: 'Всего' },
      { count: inProcessingCount, label: 'В обработке' },
      { count: acceptedCount, label: 'Принята бригадиром' },
      { count: completedCount, label: 'Выполнена' },
      { count: approvedCount, label: 'Подтверждена' },
    ];
  }

  async getInvoiceCount(query: StatisticsQuery) {
    const countTotal = this.dataSource.createQueryBuilder().from(Invoice, 'invoice');
    const countByStatus = this.dataSource.createQueryBuilder().from(Invoice, 'invoice').where('status = :status');

    const addPeriod = (query, period) => {
      const minDate = dayjs(period).startOf('month').toDate();
      const maxDate = dayjs(period).endOf('month').toDate();

      return query
        .andWhere('invoice."createdAt" >= :after', {
          after: minDate,
        })
        .andWhere('invoice."createdAt" < :before', {
          before: maxDate,
        });
    };
    if (query.month) {
      addPeriod(countTotal, query.month);
      addPeriod(countByStatus, query.month);
    }
    const [count, inProcessingCount, createdCount, paidCount, approvedCount, expiredCount] = await Promise.all([
      countTotal.withDeleted().getCount(),
      countByStatus.setParameter('status', InvoiceStatus.IN_PROCESSING).getCount(),
      countByStatus.setParameter('status', InvoiceStatus.CREATED).getCount(),
      countByStatus.setParameter('status', InvoiceStatus.PAID).getCount(),
      countByStatus.setParameter('status', InvoiceStatus.APPROVED).getCount(),
      countByStatus.withDeleted().setParameter('status', InvoiceStatus.EXPIRED).getCount(),
    ]);
    return [
      { count, label: 'Всего' },
      { count: inProcessingCount, label: 'В обработке' },
      { count: createdCount, label: 'Создан' },
      { count: paidCount, label: 'Оплачен' },
      { count: approvedCount, label: 'Подтвержден' },
      { count: expiredCount, label: 'Просрочен' },
    ];
  }

  async getBrigadiersTop(query: StatisticsQuery) {
    const addPeriod = (query, period) => {
      const minDate = dayjs(period).startOf('month').toDate();
      const maxDate = dayjs(period).endOf('month').toDate();

      return query
        .andWhere('r."mountingDate" >= :after', {
          after: minDate,
        })
        .andWhere('r."mountingDate" < :before', {
          before: maxDate,
        });
    };
    const brigadierTopQuery = this.dataSource
      .createQueryBuilder()
      .from(Brigadier, 'b')
      .leftJoin(Request, 'r', 'r."brigadierId" = b.id')
      .where('status = :status', { status: RequestStatus.APPROVED })
      .groupBy('b.id, b.surname, b.firstname, b.patronymic')
      .addGroupBy('b.id')
      .addGroupBy('b.surname')
      .addGroupBy('b.firstname')
      .addGroupBy('b.patronymic')
      .addSelect('b.id', 'id')
      .addSelect("concat_ws(' ', b.surname, b.firstname, b.patronymic)", 'full_name')
      .addSelect('count(r)', 'request_count')
      .take(10)
      .orderBy('request_count', 'DESC');

    if (query.month) {
      addPeriod(brigadierTopQuery, query.month);
    }
    return await brigadierTopQuery.getRawMany();
  }

  async getEquipmentCount(query: StatisticsQuery) {
    const addPeriod = (query, period) => {
      const minDate = dayjs(period).startOf('month').toDate();
      const maxDate = dayjs(period).endOf('month').toDate();

      return query
        .andWhere('r."mountingDate" >= :after', {
          after: minDate,
        })
        .andWhere('r."mountingDate" < :before', {
          before: maxDate,
        });
    };
    const countTotalCount = this.dataSource
      .createQueryBuilder()
      .from(Request, 'r')
      .leftJoin(RequestEquipment, 'req', 'r."id" = req.requestId')
      .where('status = :status', { status: RequestStatus.APPROVED })
      .select('coalesce(SUM(quantity),0)', 'count');
    if (query.month) {
      addPeriod(countTotalCount, query.month);
    }
    return await countTotalCount.getRawOne();
  }

  async getSoldAccessoriesStatistics(query: StatisticsQuery) {
    const addPeriod = (query, period) => {
      const minDate = dayjs(period).startOf('month').toDate();
      const maxDate = dayjs(period).endOf('month').toDate();

      return query
        .andWhere('i."createdAt" >= :after', {
          after: minDate,
        })
        .andWhere('i."createdAt" < :before', {
          before: maxDate,
        });
    };
    const countTotal = this.dataSource
      .createQueryBuilder()
      .from(Invoice, 'i')
      .leftJoin(InvoiceItem, 'ii', 'i."id" = ii.invoiceId')
      .where('status = :status', { status: RequestStatus.APPROVED })
      .select('coalesce(SUM(quantity),0)', 'count')
      .addSelect('coalesce(SUM(sum),0)', 'sum');
    if (query.month) {
      addPeriod(countTotal, query.month);
    }
    const { count, sum } = await countTotal.getRawOne();
    return [
      { count: count, label: 'Комплектующих продано' },
      { count: sum, label: 'Сумма' },
    ];
  }
}
