import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { BaseService } from 'src/base/base.service';
import { UpdateBrigadierDto } from 'src/brigadier/dto/update-brigadier.dto';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { NotExistsError } from 'src/common/exceptions';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRequestBrigadierDto } from './dto/update-request-brigadier.dto';
import { UpdateRequestByBrigadierDto } from './dto/update-request-by-brigadier.dto';
import { Request, RequestStatus } from './entities/Request.entity';

@Injectable()
export class RequestService extends BaseService<Request> {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    private readonly abilityFactory: AbilityFactory,
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
    // const item = await this.requestRepository.findOne({
    //   where: { id },
    //   relations: ['client.user'],
    // });
    return await this.requestRepository.findOne({ where: { id } });
  }

  //TODO add request tools, accessories

  async setStatus(
    id: number,
    updateRequestByBrigadierDto: UpdateRequestByBrigadierDto,
    user: User,
  ) {
    const request = await this.get(id);
    if (!request) throw new NotExistsError('request');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, request);

    return await this.requestRepository.save({
      ...request,
      status: updateRequestByBrigadierDto.status,
    });
  }

  async setBrigadier(id: number, updateBrigadierDto: UpdateRequestBrigadierDto) {
    const request = await this.get(id);
    if (!request) throw new NotExistsError('request');

    const newBrigadier = await this.brigadierRepository.findOne({
      where: { id: updateBrigadierDto.brigadier },
    });
    if (!newBrigadier) throw new NotExistsError('brigadier');

    request.brigadier = newBrigadier;
    return await this.requestRepository.save(request);
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
