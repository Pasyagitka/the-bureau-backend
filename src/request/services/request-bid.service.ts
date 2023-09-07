import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestBid } from '../entities/request-bid.entity';
import { RequestRepository } from '../request.repository';
import { Brigadier } from '../../brigadier/entities/brigadier.entity';
import { BadParametersError, NotExistsError } from '../../common/exceptions';
import { RequestStatus } from '../types/request-status.enum';

@Injectable()
export class RequestBidService {
  constructor(
    @InjectRepository(RequestBid)
    private requestBidRepository: Repository<RequestBid>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    private requestRepository: RequestRepository,
  ) {}

  getRequestBids(id: number) {
    return this.requestBidRepository.findAndCount({ where: { requestId: id }, relations: { brigadier: true } });
  }

  getBid(requestId: number, brigadierId: number) {
    return this.requestBidRepository.findOne({
      where: {
        requestId,
        brigadierId,
      },
    });
  }

  async leaveBid(requestId: number, brigadierId: number) {
    const [request, brigadier] = await Promise.all([
      this.requestRepository.findOne({ where: { id: requestId } }),
      this.brigadierRepository.findOne({ where: { id: brigadierId } }),
    ]);
    if (!request) throw new NotExistsError('request');
    if (!brigadier) throw new NotExistsError('brigadier');
    if (request.status !== RequestStatus.INPROCESSING) throw new BadParametersError('request is not in processing');

    const bid = this.requestBidRepository.create({
      requestId,
      brigadierId,
    });
    this.requestBidRepository.save(bid);
  }

  async approveBid(requestId: number, brigadierId: number) {
    const [request, brigadier] = await Promise.all([
      this.requestRepository.findOne({ where: { id: requestId } }),
      this.brigadierRepository.findOne({ where: { id: brigadierId } }),
    ]);
    if (!request) throw new NotExistsError('request');
    if (!brigadier) throw new NotExistsError('brigadier');

    request.brigadier = brigadier;
    this.requestRepository.save(request);
  }

  async denyBid(requestId: number, brigadierId: number) {
    const bid = await this.requestBidRepository.findOne({ where: { requestId, brigadierId } });
    if (!bid) throw new NotExistsError('bid');
    this.requestBidRepository.softRemove(bid);
  }
}
