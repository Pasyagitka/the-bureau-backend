import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService extends BaseService<Client> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {
    super(clientRepository);
  }

  async createWithUser(
    createClientDto: CreateClientDto,
    createUserDto: CreateUserDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager
        .getRepository(User)
        .save(createUserDto);

      const client = await queryRunner.manager.getRepository(Client).save({
        ...createClientDto,
        user,
      });
      await queryRunner.commitTransaction();
      return client;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //and request nested request.address and so on
  async remove(id: number) {
    const item = await this.clientRepository.findOneOrFail({
      where: { id },
      relations: ['requests', 'user'],
    });
    return await this.clientRepository.softRemove(item);
  }
}
