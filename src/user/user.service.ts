import { ForbiddenError } from '@casl/ability';
import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { Repository } from 'typeorm';
import { ActivateUserDto } from './dto/activate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  //TODO do not return users pd

  async getAll() {
    return await this.usersRepository.find();
  }

  async get(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: User) {
    const item = await this.get(+id);
    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, item);

    return `This action updates a #${id} user`;
  }

  async findByUsername(login: string) {
    return await this.usersRepository.findOne({
      where: { login: login },
    });
  }

  async findByActivationLink(link: string) {
    const user = await this.usersRepository.findOne({
      where: { activationLink: link },
    });
    return user;
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async activate(id: number, activateUserDto: ActivateUserDto) {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    user.isActivated = activateUserDto.isActivated || user.isActivated;
    user.activationLink = activateUserDto.activationLink || user.activationLink;
    return await this.usersRepository.save(user);
  }

  async resetPasswordSend(
    email: string,
    resetPasswordLink: string,
    temporaryPassword: string,
  ) {
    const user = await this.findByEmail(email);
    user.resetPasswordLink = resetPasswordLink;
    user.temporaryPassword = temporaryPassword;
    return await this.usersRepository.save(user);
  }

  async resetPasswordConfirm(login: string, temporaryPassword: string) {
    const user = await this.findByUsername(login);
    user.password = temporaryPassword;
    user.temporaryPassword = null;
    user.resetPasswordLink = null;
    return await this.usersRepository.save(user);
  }

  async remove(id: number, user: User) {
    const item = await this.get(+id);
    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, item);
    
    return await this.usersRepository.softRemove(item);
  }
}
