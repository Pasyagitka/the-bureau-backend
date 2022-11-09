import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { DataSource, Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentService extends BaseService<Equipment> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {
    super(equipmentRepository);
  }

  //accessories, requestequipment delete
  // async remove(id: number) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     await queryRunner.manager.softDelete(Equipment, id);
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new BadGatewayException(error);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async remove(id: number) {
    const item = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['accessories'],
    });
    const deleteResponse = await this.equipmentRepository.softRemove(item);
    // if (!deleteResponse.affected) {
    //   //throw new NotFoundException(id);
    // }
  }
}
