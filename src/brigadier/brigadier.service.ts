import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AbilityFactory } from '../ability/ability.factory';
import { Action } from '../ability/types';
import { NotExistsError } from '../common/exceptions';
import { User } from '../user/entities/user.entity';
import { RecommendedQuery } from './dto/recommended-query.dto';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';
import { Brigadier } from './entities/brigadier.entity';

@Injectable()
export class BrigadierService {
  constructor(
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    private readonly abilityFactory: AbilityFactory,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Brigadier[]> {
    return this.brigadierRepository.find({
      relations: { user: true },
      order: { id: 'DESC' },
    });
  }

  async get(id: number): Promise<Brigadier> {
    return await this.brigadierRepository.findOne({ where: { id }, relations: { user: true } });
  }

  async getAvailableForDate(query: RecommendedQuery) {
    return this.dataSource.query(
      `select 
        available_brigadiers.id,
        concat_ws(' ', available_brigadiers.surname, available_brigadiers.firstname, available_brigadiers.patronymic) full_name,
        count(case date_part('week', "mountingDate") when date_part('week', now()) then 1 else null end) week_request_count
      from
        (select 
          b.*
        from brigadier b 
        left join (select * from request where "mountingDate" = $1) r on r."brigadierId" = b.id
          group by b.id having count(r.id) = 0) as available_brigadiers 
      left join request r on r."brigadierId" = available_brigadiers.id
      group by available_brigadiers.id, available_brigadiers.surname, available_brigadiers.firstname, available_brigadiers.patronymic
      order by week_request_count asc`,
      [query.date],
    );
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
      relations: ['schedules', 'user'],
    });
    return await this.brigadierRepository.softRemove(item);
  }
}
