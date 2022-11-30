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
import { RequestEquipment } from './entities/request-equipment.entity';
import { Request, RequestStatus } from './entities/request.entity';
import { DataSource } from 'typeorm';
import { Tool } from 'src/tool/entities/tool.entity';
import { Stage } from './entities/stage.entity';

@Injectable()
export class RequestService extends BaseService<Request> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestEquipment)
    private requestEquipmentRepository: Repository<RequestEquipment>,
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

  async getRequestWithEquipment(id: number): Promise<Request> {
    return await this.requestRepository.findOne({
      where: { id },
      relations: {
        requestEquipment: true,
      },
    });
  }

  async getRequestTools(id: number) {
    const request = await this.get(id);
    if (!request) throw new NotExistsError('request');
    return await this.getRequestToolsByStage(request.stage.id);
  }

  async getRequestToolsByStage(stageId: number) {
    let requestTools = [];
    if (stageId === 3) {
      requestTools = await this.dataSource
        .createQueryBuilder()
        .select('tool.name')
        .distinct()
        .from(Tool, 'tool')
        .innerJoin('tool.stage', 'stage')
        .where('tool.stageId = 1')
        .orWhere('tool.stageId = 2')
        .getRawMany();
    } else {
      requestTools = await this.dataSource
        .createQueryBuilder()
        .select('tool.name')
        .distinct()
        .from(Tool, 'tool')
        .innerJoin('tool.stage', 'stage')
        .where('tool.stageId = :stageId', { stageId })
        .getRawMany();
    }
    return requestTools;
  }

  async getRequestAccessories(id: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('SUM(request_equipment.quantity)', 'quantity')
      .addSelect('accessories.sku')
      .addSelect('accessories.name')
      .from(RequestEquipment, 'request_equipment')
      .where('request_equipment.requestId = :id', { id })
      .innerJoin('request_equipment.equipment', 'equipment')
      .innerJoin('equipment.accessories', 'accessories')
      .groupBy('accessories.sku')
      .addGroupBy('accessories.name')
      .getRawMany();
  }

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
