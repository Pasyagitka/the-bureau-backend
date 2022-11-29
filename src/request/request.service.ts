import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from './entities/Request.entity';

@Injectable()
export class RequestService extends BaseService<Request> {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
  ) {
    super(requestRepository);
  }

  async getAll(): Promise<Request[]> {
    return this.requestRepository.find({
      //TODO do not return creds
      relations: ['client.user'],
    });
  }

  async get(id: number): Promise<Request> {
    const item = await this.requestRepository.findOne({
      where: { id },
      relations: ['client.user'],
    });
    return item;
  }

  //TODO add request tools, accessories

  async setStatus(id: number, status: RequestStatus) {
    const request = await this.requestRepository.findOneOrFail({
      where: { id },
    });
    return await this.requestRepository.save({ ...request, status });
  }

  async setBrigadier(id: number, brigadierId: number) {
    const request = await this.requestRepository.findOneOrFail({
      where: { id },
    });
    return await this.requestRepository.save({ ...request, brigadierId });
  }

  async remove(id: number) {
    const item = await this.requestRepository.findOneOrFail({
      where: { id },
      relations: [
        'address',
        'reports',
        'requestAccessories',
        'requestEquipment',
        'requestTools',
        'schedules',
      ],
    });
    return await this.requestRepository.softRemove(item);
  }
}
