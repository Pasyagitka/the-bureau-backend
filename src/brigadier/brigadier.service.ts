import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brigadier } from './entities/brigadier.entity';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';
import { NotExistsError } from 'src/common/exceptions';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { ForbiddenError } from '@casl/ability';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BrigadierService {
  constructor(
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async getAll(): Promise<Brigadier[]> {
    return this.brigadierRepository.find({
      relations: { user: true },
      order: { id: 'DESC' },
    });
  }

  async get(id: number): Promise<Brigadier> {
    return await this.brigadierRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBrigadierDto: UpdateBrigadierDto, user: User): Promise<Brigadier> {
    const brigadier = await this.get(id);
    if (!brigadier) throw new NotExistsError('brigadier');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, brigadier);

    return this.brigadierRepository.save({ id, ...updateBrigadierDto });
  }

  async remove(id: number) {
    const item = await this.brigadierRepository.findOneOrFail({
      where: { id },
      relations: ['brigadierTools', 'schedules', 'user'],
    });
    return await this.brigadierRepository.softRemove(item);
  }
}
