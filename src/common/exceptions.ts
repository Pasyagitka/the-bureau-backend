import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistsError extends HttpException {
  constructor(data = '') {
    super(`Already exists ${data}`, HttpStatus.BAD_REQUEST);
  }
}

export class NotExistsError extends HttpException {
  constructor(data = '') {
    super(`Not exists ${data}`, HttpStatus.BAD_REQUEST);
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
    super(`Account not activated ${data}`, HttpStatus.BAD_REQUEST);
  }
}

export class BadResetPasswordLinkError extends HttpException {
  constructor() {
    super('Bad reset password link', HttpStatus.BAD_REQUEST);
  }
}

export class WrongPasswordError extends HttpException {
  constructor() {
    super('Wrong password', HttpStatus.BAD_REQUEST);
  }
}

export class EmailError extends HttpException {
  constructor(data = '') {
    super(`Email sending error ${data}`, HttpStatus.BAD_REQUEST);
  }
}
