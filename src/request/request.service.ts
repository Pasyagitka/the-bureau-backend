import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { NotExistsError } from 'src/common/exceptions';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRequestByAdminDto } from './dto/update-request-by-admin.dto';
import { UpdateRequestByBrigadierDto } from './dto/update-request-by-brigadier.dto';
import { RequestEquipment } from './entities/request-equipment.entity';
import { Request } from './entities/request.entity';
import { DataSource } from 'typeorm';
import { Tool } from 'src/tool/entities/tool.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { Client } from 'src/client/entities/client.entity';
import { Stage } from 'src/stage/entities/stage.entity';

@Injectable()
export class RequestService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestEquipment)
    private requestEquipmentRepository: Repository<RequestEquipment>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async create(createRequestDto: CreateRequestDto, user: User): Promise<any> {
    const stage = await this.stageRepository.findOne({
      where: { id: createRequestDto.stage },
    });
    if (!stage) throw new NotExistsError('stage');

    const requestEquipment: Array<RequestEquipment> = [];

    const reqEq = createRequestDto.requestEquipment;
    for (let i = 0; i < reqEq.length; i++) {
      if (!(await this.equipmentRepository.findOne({ where: { id: reqEq[i].equipment } })))
        throw new NotExistsError(`equipment ${reqEq[i].equipment}`);
      requestEquipment.push(
        this.requestEquipmentRepository.create({
          equipment: { id: reqEq[i].equipment },
          quantity: reqEq[i].quantity,
        }),
      );
    }

    const client = await this.clientRepository.findOne({
      where: { user: { id: user.id } },
      // loadEagerRelations: false,
      // loadRelationIds: {
      //   relations: ['user'],
      //   disableMixedMap: true,
      // },
    });
    if (!client) throw new NotExistsError('client');
    console.log(user, client);

    const request = this.requestRepository.create({
      mountingDate: createRequestDto.mountingDate,
      comment: createRequestDto.comment,
      stage: stage,
      client: client,
      address: createRequestDto.address,
      requestEquipment: requestEquipment,
    });

    return await this.requestRepository.save(request);
  }

  async getAll(): Promise<Request[]> {
    return this.requestRepository.find({
      //TODO do not return creds
      relations: ['client.user', 'address', 'client'],
      order: { id: 'DESC' },
    });
  }

  async get(id: number): Promise<Request> {
    return await this.requestRepository.findOne({
      where: { id },
      relations: {
        client: true,
        brigadier: true,
        address: true,
        stage: true,
        requestEquipment: {
          equipment: true,
        },
      },
    });
  }

  async getBrigadierRequests(brigadierId: number, user: User) {
    const requests: any = await this.requestRepository.find({
      where: { brigadier: { id: brigadierId } },
      relations: {
        requestEquipment: {
          equipment: true,
        },
        client: true,
        stage: true,
      },
      order: { id: 'DESC' },
    });

    if (requests.length > 0) {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, requests[0]);
    }
    for (let i = 0; i < requests.length; i++) {
      requests[i].requestAccessories = await this.getRequestAccessories(requests[i].id);
      requests[i].requestTools = await this.getRequestTools(requests[i].id);
    }

    return requests;
  }

  async getRequestWithEquipment(id: number): Promise<Request> {
    return await this.requestRepository.findOne({
      where: { id },
      relations: {
        requestEquipment: {
          equipment: true,
        },
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
        .select('tool.name', 'name')
        .distinct()
        .from(Tool, 'tool')
        .innerJoin('tool.stage', 'stage')
        .where('tool.stageId = 1')
        .orWhere('tool.stageId = 2')
        .getRawMany();
    } else {
      requestTools = await this.dataSource
        .createQueryBuilder()
        .select('tool.name', 'name')
        .distinct()
        .from(Tool, 'tool')
        .innerJoin('tool.stage', 'stage')
        .where('tool.stageId = :stageId', { stageId })
        .orWhere('tool.stageId = 3')
        .getRawMany();
    }
    return requestTools;
  }

  async getRequestAccessories(id: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('SUM(request_equipment.quantity)', 'quantity')
      .addSelect('accessories.sku', 'sku')
      .addSelect('accessories.name', 'name')
      .from(RequestEquipment, 'request_equipment')
      .where('request_equipment.requestId = :id', { id })
      .innerJoin('request_equipment.equipment', 'equipment')
      .innerJoin('equipment.accessories', 'accessories')
      .groupBy('accessories.sku')
      .addGroupBy('accessories.name')
      .getRawMany();
  }

  async getWeeklyReport() {
    return await this.dataSource
      .createQueryBuilder()
      .select('extract(isodow from "mountingDate")', 'day')
      .addSelect('request.brigadierId', 'brigadierId')
      .addSelect('count(request.id)', 'count')
      .from(Request, 'request')
      .where('request.brigadierId is not null')
      .andWhere("request.status in ('InProcessing', 'Completed')")
      .andWhere(`DATE_PART('week', "mountingDate") = DATE_PART('week', current_date)`)
      .groupBy('request.brigadierId')
      .addGroupBy('request.mountingDate')
      .orderBy('request.brigadierId')
      .getRawMany();
  }

  async getWeeklyReportForBrigadier(id: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('extract(isodow from "mountingDate")', 'day')
      .addSelect('request.brigadierId', 'brigadierId')
      .addSelect('count(request.id)', 'count')
      .from(Request, 'request')
      .where('request.brigadierId = :id', { id })
      .andWhere("request.status in ('InProcessing', 'Completed')")
      .andWhere(`DATE_PART('week', "mountingDate") = DATE_PART('week', current_date)`)
      .groupBy('request.brigadierId')
      .addGroupBy('request.mountingDate')
      .orderBy('request.brigadierId')
      .getRawMany();
  }

  async updateByBrigadier(id: number, updateRequestByBrigadierDto: UpdateRequestByBrigadierDto, user: User) {
    const request = await this.get(id);
    if (!request) throw new NotExistsError('request');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, request);

    return await this.requestRepository.save({
      ...request,
      status: updateRequestByBrigadierDto.status,
    });
  }

  async updateByAdmin(id: number, updateBrigadierDto: UpdateRequestByAdminDto) {
    const request = await this.get(id);
    if (!request) throw new NotExistsError('request');

    if (updateBrigadierDto.brigadier !== undefined) {
      if (updateBrigadierDto.brigadier === null) {
        request.brigadier = null;
      } else {
        const newBrigadier = await this.brigadierRepository.findOne({
          where: { id: updateBrigadierDto.brigadier },
        });
        if (!newBrigadier) throw new NotExistsError('brigadier');
        request.brigadier = newBrigadier;
      }
    }
    if (updateBrigadierDto.status) request.status = updateBrigadierDto.status;
    const res = await this.requestRepository.save(request);

    return res;
  }

  async getClientRequests(clientId: number, user: User) {
    const requests = await this.requestRepository.find({
      where: { client: { id: clientId } },
      relations: {
        client: true,
        requestEquipment: {
          equipment: true,
        },
      },
      order: { id: 'DESC' },
    });

    if (requests.length > 0) {
      const ability = this.abilityFactory.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, requests[0]);
    }
    return requests;
  }

  async remove(id: number) {
    const item = await this.requestRepository.findOneOrFail({
      where: { id },
      relations: ['address', 'reports', 'requestAccessories', 'requestEquipment', 'requestTools', 'schedules'],
    });
    return await this.requestRepository.softRemove(item);
  }
}
