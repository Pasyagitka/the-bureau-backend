import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestService {
  create(createRequestDto: CreateRequestDto) {
    return 'This action adds a new request';
  }

  findAll() {
    return `This action returns all request`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
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

  async updateByBrigadier(
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
