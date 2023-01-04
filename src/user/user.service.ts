import * as bcrypt from 'bcryptjs';
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

  async onModuleInit() {
    const adminUser = await this.usersRepository.findOne({
      where: { login: process.env.ADMIN_LOGIN },
    });
    console.log(adminUser);
    if (!adminUser) {
      const admin = await this.usersRepository.save({
        login: process.env.ADMIN_LOGIN,
        email: process.env.ADMIN_EMAIL,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 3),
        role: Role.Admin,
        isActivated: true,
      });
      console.log(admin);
    }
  }

  async createClient(createClientDto: CreateClientDto) {
    const user = this.usersRepository.create({
      login: createClientDto.login,
      email: createClientDto.email,
      password: createClientDto.password,
      role: Role.Client,
      activationLink: createClientDto.activationLink,
      isActivated: true,
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

  async activateUser(userId: number) {
    const user = await this.get(userId);
    if (!user) throw new NotExistsError('user');
    user.isActivated = true;
    return this.usersRepository.save(user);
  }

  async deactivateUser(userId: number) {
    const user = await this.get(userId);
    if (!user) throw new NotExistsError('user');
    user.isActivated = false;
    return this.usersRepository.save(user);
  }

  //TODO do not return users pd

  async getAll() {
    return await this.usersRepository.find();
  }

  async get(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async getWithInfo(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        role: true,
        password: false,
        client: { id: true },
        brigadier: { id: true },
      },
      relations: { client: true, brigadier: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: User) {
    const item = await this.get(+id);
    if (!item) throw new NotExistsError('user');

    const ability = this.abilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, item);

    const userbyLogin = await this.findByLogin(updateUserDto.login);
    if (userbyLogin && userbyLogin.id !== id) throw new AlreadyExistsError('login');

    const userbyEmail = await this.findByEmail(updateUserDto.email);
    if (userbyEmail && userbyEmail.id !== id) throw new AlreadyExistsError('email');

    return this.usersRepository.save({ id, ...updateUserDto });
  }

  async findByLogin(login: string) {
    return await this.usersRepository.findOne({
      where: { login },
      loadRelationIds: {
        relations: ['client', 'brigadier'],
        disableMixedMap: true,
      },
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
    const user = await this.findByLogin(login);
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
