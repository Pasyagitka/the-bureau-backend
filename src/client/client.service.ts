import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { NotExistsError } from 'src/common/exceptions';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async getAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async get(id: number): Promise<Client> {
    return await this.clientRepository.findOne({ where: { id } });
  }

  async getWithInfo(id: number): Promise<Client> {
    return await this.clientRepository.findOne({
      where: { id },
      select: {
        id: true,
        user: { id: true, role: true },
      },
      relations: { user: true },
    });
  }
  
  async update(id: number, updateClientDto: UpdateClientDto, user: User): Promise<Client> {
    const client = await this.get(id);
    if (!client) throw new NotExistsError('client');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, client);

    return this.clientRepository.save({ id, ...updateClientDto });
  }
}
