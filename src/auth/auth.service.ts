import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import * as generator from 'generate-password';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AlreadyExistsError,
  BadActivationLinkError,
  BadResetPasswordLinkError,
  NotExistsError,
  WrongPasswordError,
} from 'src/common/exceptions';
import { UserService } from '../user/user.service';
import { MailService } from './mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(login: string, pass: string) {
    const user = await this.usersService.findByUsername(login);
    if (!user) {
      throw new NotExistsError('user (by email)');
    }
    const isPassEquals = await bcrypt.compare(pass, user.password);
    console.log(pass, user.password, isPassEquals);
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
    };
    console.log('payload', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: any) {
    const findByEmail = await this.usersService.findByEmail(user.email);
    if (findByEmail) {
      throw new AlreadyExistsError('email');
    }
    const findByUsername = await this.usersService.findByUsername(user.login);
    if (findByUsername) {
      throw new AlreadyExistsError('login');
    }
    const hashPassword = await bcrypt.hash(user.password, 3);
    const activationLink = uuid.v4();
    const newUser = await this.usersService.create({
      email: user.email,
      login: user.login,
      password: hashPassword,
      //activationLink,
    });
    await this.mailService.sendActivationMail(
      newUser.email,
      `${process.env.API_URL}/auth/activate/${activationLink}`, //TODO store all links as const...
    );
    this.loginWithCredentials(user);
  }

  async activate(activationLink) {
    const findUser = await this.usersService.findByActivationLink(
      activationLink,
    );
    if (!findUser) {
      throw new BadActivationLinkError();
    }
    await this.usersService.activate(findUser.id, {
      isActivated: true,
      activationLink: null,
    });
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
    await this.mailService.sendResetPasswordEmail(
      email,
      `${process.env.API_URL}/auth/reset-password/${findUser.login}/${link}`,
      password,
    );
  }

  async resetConfirm(login, resetPasswordLink) {
    const findUser = await this.usersService.findByUsername(login);
    if (!findUser) {
      throw new NotExistsError('user (by login)');
    }
    if (resetPasswordLink !== findUser.resetPasswordLink) {
      throw new BadResetPasswordLinkError();
    }
    await this.usersService.resetPasswordConfirm(
      login,
      findUser.temporaryPassword,
    );
    await this.mailService.sendConfirmResetPasswordEmail(findUser.email);
    return true;
  }
}
