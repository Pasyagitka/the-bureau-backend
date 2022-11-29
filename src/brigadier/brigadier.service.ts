import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brigadier } from './entities/brigadier.entity';
import { CreateBrigadierDto } from './dto/create-brigadier.dto';
import { AlreadyExistsError, NotExistsError } from 'src/common/exceptions';
import { User } from 'src/user/entities/user.entity';
import { UpdateBrigadierDto } from './dto/update-brigadier.dto';

@Injectable()
export class BrigadierService {
  constructor(
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<Brigadier[]> {
    return this.brigadierRepository.find();
  }

  async get(id: number): Promise<Brigadier> {
    const item = await this.brigadierRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotExistsError('brigadier');
    }
    return item;
  }

  async create(createBrigadierDto: CreateBrigadierDto): Promise<Brigadier> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createBrigadierDto.email },
    });
    if (userByEmail) throw new AlreadyExistsError('user with email');

    const brigadier = this.brigadierRepository.create(createBrigadierDto);
    const user = this.userRepository.create({
      email: createBrigadierDto.email,
      //password: 
    }); //register ith password
    brigadier.user = user;
    await this.brigadierRepository.save(brigadier);
    return brigadier;
  }

  async update(
    id: number,
    updateBrigadierDto: UpdateBrigadierDto,
  ): Promise<Brigadier> {
    const brigadier = await this.brigadierRepository.findOne({ where: { id } });
    if (!brigadier) throw new NotExistsError('brigadier');
  //TODO d
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
