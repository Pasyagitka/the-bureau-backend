import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as generator from 'generate-password';
import * as uuid from 'uuid';
import { CreateBrigadierDto } from '../brigadier/dto/create-brigadier.dto';
import { CreateClientDto } from '../client/dto/create-client.dto';
import {
  AlreadyExistsError,
  BadActivationLinkError,
  BadResetPasswordLinkError,
  NotActivatedError,
  NotExistsError,
  WrongPasswordError,
} from '../common/exceptions';
import { UserService } from '../user/user.service';
import { ConfirmResetPasswordEvent } from './events/confirm-reset.event';
import { RegisterUserEvent } from './events/register-user.event';
import { ResetPasswordEvent } from './events/reset-password.event';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async validateUser(login: string, pass: string) {
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new NotExistsError('пользователь (логин)');
    }
    if (!user.isActivated) throw new NotActivatedError(`${user.login}`);
    const isPassEquals = await bcrypt.compare(pass, user.password);
    //console.log(pass, user.password, isPassEquals);
    if (!isPassEquals) {
      throw new WrongPasswordError();
    }
    const { password, ...result } = user;
    return result;
  }

  async loginWithCredentials(user: any) {
    const payload = {
      login: user.login,
      sub: user.id,
      role: user.role,
      client: {
        id: user.client?.id,
      },
      brigadier: {
        id: user.brigadier?.id,
      },
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createClientDto: CreateClientDto) {
    const findByEmail = await this.usersService.findByEmail(createClientDto.email);
    if (findByEmail) {
      throw new AlreadyExistsError('email');
    }
    const findByUsername = await this.usersService.findByLogin(createClientDto.login);
    if (findByUsername) {
      throw new AlreadyExistsError('login');
    }
    const hashPassword = await bcrypt.hash(createClientDto.password, 3);
    const activationLink = uuid.v4();
    await this.usersService.createClient({
      ...createClientDto,
      password: hashPassword,
      activationLink,
    });
    //.eventEmitter.emit('user.created', new RegisterUserEvent({ email: createClientDto.email, activationLink }));

    this.loginWithCredentials(createClientDto);
  }

  async registerBrigadier(brigadierUser: CreateBrigadierDto) {
    const findByEmail = await this.usersService.findByEmail(brigadierUser.email);
    if (findByEmail) {
      throw new AlreadyExistsError('email');
    }
    const findByUsername = await this.usersService.findByLogin(brigadierUser.login);
    if (findByUsername) {
      throw new AlreadyExistsError('login');
    }
    const hashPassword = await bcrypt.hash(brigadierUser.password, 3);
    const activationLink = uuid.v4();
    await this.usersService.createBrigadier({
      ...brigadierUser,
      password: hashPassword,
      activationLink,
    });
    //this.eventEmitter.emit('user.created', new RegisterUserEvent({ email: brigadierUser.email, activationLink }));
    this.loginWithCredentials(brigadierUser);
  }

  async activate(activationLink) {
    const findUser = await this.usersService.findByActivationLink(activationLink);
    if (!findUser) {
      throw new BadActivationLinkError();
    }
    await this.usersService.activate(findUser.id, {
      isActivated: true,
      activationLink: null,
    });
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    const isPassEquals = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isPassEquals) {
      throw new WrongPasswordError();
    }
    const hashNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 3);
    user.password = hashNewPassword;
    return await this.usersRepository.save(user);
  }

  async sendResetPassword(email) {
    const findUser = await this.usersService.findByEmail(email);
    if (!findUser) {
      throw new NotExistsError('user (by email)');
    }
    const link = uuid.v4();
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const temporaryPassword = await bcrypt.hash(password, 3);
    await this.usersService.resetPasswordSend(email, link, temporaryPassword);
    //await this.mailService.sendResetPasswordEmail(email, findUser.login, link, password);
    this.eventEmitter.emit(
      'user.resetPassword',
      new ResetPasswordEvent({ email, login: findUser.login, resetPasswordLink: link, password }),
    );
  }

  async resetConfirm(login, resetPasswordLink) {
    const findUser = await this.usersService.findByLogin(login);
    if (!findUser) {
      throw new NotExistsError('пользователь (логин)');
    }
    if (resetPasswordLink !== findUser.resetPasswordLink) {
      throw new BadResetPasswordLinkError();
    }
    await this.usersService.resetPasswordConfirm(login, findUser.temporaryPassword);
    //await this.mailService.sendConfirmResetPasswordEmail(findUser.email);
    this.eventEmitter.emit('user.comfirmResetPassword', new ConfirmResetPasswordEvent({ email: findUser.email }));
    return true;
  }

  async getUser(token) {
    const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    const user = await this.usersService.getWithInfo(decoded.sub);
    if (!user) throw new NotExistsError('user by token');
    return user;
  }
}
