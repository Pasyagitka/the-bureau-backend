import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistsError extends HttpException {
  constructor(data = '') {
    super(`Already exists ${data}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class NotExistsError extends HttpException {
  constructor(data = '') {
    super(`Not exists ${data}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UnauthorizedError extends HttpException {
  constructor(data = '') {
    super(`Unauthorized ${data}`, HttpStatus.UNAUTHORIZED);
  }
}
export class BadActivationLinkError extends HttpException {
  constructor() {
    super('Bad activation link', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class BadResetPasswordLinkError extends HttpException {
  constructor() {
    super('Bad reset password link', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class WrongPasswordError extends HttpException {
  constructor() {
    super('Wrong password', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
