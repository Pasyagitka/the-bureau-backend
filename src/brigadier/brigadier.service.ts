import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { DataSource, Repository } from 'typeorm';
import { Brigadier } from './entities/brigadier.entity';
import { CreateBrigadierDto } from './dto/create-brigadier.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

//TODO where to use dto??
@Injectable()
export class BrigadierService extends BaseService<Brigadier> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
  ) {
    super(brigadierRepository);
  }
  //TODO move dto
  async createWithUser(
    createBrigadierDto: CreateBrigadierDto,
    createUserDto: CreateUserDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager
        .getRepository(User)
        .save(createUserDto);

      const brigadier = await queryRunner.manager
        .getRepository(Brigadier)
        .save({
          ...createBrigadierDto,
          user,
        });
      await queryRunner.commitTransaction();
      return brigadier;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const item = await this.brigadierRepository.findOneOrFail({
      where: { id },
      relations: ['brigadier_tool', 'schedule', 'user'],
    });
    return await this.brigadierRepository.softRemove(item);
  }
}
