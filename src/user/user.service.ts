import { ForbiddenError } from '@casl/ability';
import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { ActivateUserDto } from './dto/activate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly abilityFactory: AbilityFactory,
  ) {
    //super(usersRepository);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  //TODO do not return users pd

  getAll() {
    return `This action returns all users`;
  }

  get(id: number) {
    // return `This action returns a #${id} user`;

    const user = new User();
    user.id = id;
    return user;
  }

  update(userToUpdate: User, updateUserDto: UpdateUserDto) {
    // const userToUpdate = this.get(+id);
    // const ability = this.abilityFactory.defineAbility(14);
    // ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);
    //TODO что....
    return `This action updates a #${userToUpdate.id} user`;
  }

  async findByUsername(login: string) {
    const user = await this.usersRepository.findOne({
      where: { login: login },
    });
    return user;
  }

  async findByActivationLink(link: string) {
    const user = await this.usersRepository.findOne({
      where: { activationLink: link },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
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

  async remove(id: number) {
    const item = await this.usersRepository.findOneOrFail({
      where: { id },
    });
    return await this.usersRepository.softRemove(item);
  }
}
