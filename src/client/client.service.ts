import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbilityFactory } from '../ability/ability.factory';
import { Action } from '../ability/types';
import { NotExistsError } from '../common/exceptions';
import { User } from '../user/entities/user.entity';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async get(id: number, user: User): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Read, client);

    return client;
  }

  // async getWithInfo(id: number): Promise<Client> {
  //   return await this.clientRepository.findOne({
  //     where: { id },
  //     select: {
  //       id: true,
  //       user: { id: true, role: true },
  //     },
  //     loadEagerRelations: false,
  //     loadRelationIds: {
  //       relations: ['user'],
  //       disableMixedMap: true,
  //     },
  //   });
  // }

  async update(id: number, updateClientDto: UpdateClientDto, user: User): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!client) throw new NotExistsError('client');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, client);

    return this.clientRepository.save({ id, ...updateClientDto });
  }
}
