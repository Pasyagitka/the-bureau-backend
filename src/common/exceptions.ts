import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistsError extends HttpException {
  constructor(data = '') {
    super(`Ошибка. Уже существует: ${data}`, HttpStatus.BAD_REQUEST);
  }
}

export class BadParametersError extends HttpException {
  constructor(data = '') {
    super(`Bad parameters ${data}`, HttpStatus.BAD_REQUEST);
  }
}

export class NotExistsError extends HttpException {
  constructor(data = '') {
    super(`Ошибка. Не найден(о) ${data}`, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedError extends HttpException {
  constructor(data = '') {
    super(`Unauthorized ${data}`, HttpStatus.UNAUTHORIZED);
  }
}
export class BadActivationLinkError extends HttpException {
  constructor() {
    super('Bad activation link', HttpStatus.BAD_REQUEST);
  }
}

export class NotActivatedError extends HttpException {
  constructor(data = '') {
    super(`Кажется, аккаунт с логином ${data} не активирован. Попробуйте позже.`, HttpStatus.BAD_REQUEST);
  }
}

export class BadResetPasswordLinkError extends HttpException {
  constructor() {
    super('Bad reset password link', HttpStatus.BAD_REQUEST);
  }
}

export class WrongPasswordError extends HttpException {
  constructor() {
    super('Неверный пароль', HttpStatus.BAD_REQUEST);
  }
}

export class EmailError extends HttpException {
  constructor(data = '') {
    super(`Email sending error ${data}`, HttpStatus.BAD_REQUEST);
  }
}
