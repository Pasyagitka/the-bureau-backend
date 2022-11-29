import { ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action } from 'src/ability/types';
import { Role } from 'src/auth/enum/role.enum';
import { CreateBrigadierDto } from 'src/brigadier/dto/create-brigadier.dto';
import { Brigadier } from 'src/brigadier/entities/brigadier.entity';
import { CreateClientDto } from 'src/client/dto/create-client.dto';
import { Client } from 'src/client/entities/client.entity';
import { AlreadyExistsError, NotExistsError } from 'src/common/exceptions';
import { Repository } from 'typeorm';
import { ActivateUserDto } from './dto/activate-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Brigadier)
    private brigadierRepository: Repository<Brigadier>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    const user = this.usersRepository.create({
      login: createClientDto.login,
      email: createClientDto.email,
      password: createClientDto.password,
      role: Role.Client,
      activationLink: createClientDto.activationLink,
    });
    const client = this.clientRepository.create({
      firstname: createClientDto.firstname,
      surname: createClientDto.surname,
      patronymic: createClientDto.patronymic,
      contactNumber: createClientDto.contactNumber,
    });
    client.user = user;
    return await this.clientRepository.save(client);
  }

  async createBrigadier(createBrigadierDto: CreateBrigadierDto) {
    const user = this.usersRepository.create({
      login: createBrigadierDto.login,
      email: createBrigadierDto.email,
      password: createBrigadierDto.password,
      role: Role.Brigadier,
      activationLink: createBrigadierDto.activationLink,
    });
    const brigadier = this.brigadierRepository.create({
      firstname: createBrigadierDto.firstname,
      surname: createBrigadierDto.surname,
      patronymic: createBrigadierDto.patronymic,
      contactNumber: createBrigadierDto.contactNumber,
    });
    brigadier.user = user;
    return await this.brigadierRepository.save(brigadier);
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
    if (!item) throw new NotExistsError('user');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, item);

    const userbyLogin = await this.findByUsername(updateUserDto.login);
    if (userbyLogin && userbyLogin.id !== id) throw new AlreadyExistsError('login');

    const userbyEmail = await this.findByEmail(updateUserDto.email);
    if (userbyEmail && userbyEmail.id !== id) throw new AlreadyExistsError('email');

    return this.usersRepository.save({ id, ...updateUserDto });
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

  async resetPasswordSend(email: string, resetPasswordLink: string, temporaryPassword: string) {
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
