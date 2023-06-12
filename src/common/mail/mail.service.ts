import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(to: string, login: string, resetPasswordLink: string, password: string) {
    const link = `${process.env.API_URL}/auth/reset-password/${login}/${resetPasswordLink}`;
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Сбросить пароль ${process.env.API_NAME}`,
      text: '',
      html: `
              <div>
                  <h1>Необходимо подтвердить сброс пароля</h1>
                  <span>Ваш временный пароль: ${password}</span><br/>
                  Перейдите по ссылке ниже для подтверждения сброса пароля. Не переходите, если не вы отправляли запрос.
                  <a href="${link}">${link}</a>
              </div>
           `,
    });
  }

  async sendConfirmResetPasswordEmail(to: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Ваш пароль на ${process.env.API_NAME} изменен`,
      html: `
              <div>
                  <span>Уведомление о том, что ваш пароль изменен.</span>
              </div>
            `,
    });
  }
  async sendAccountDeactivated(to: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Ваш аккаунт на ${process.env.API_NAME} деактивирован`,
      text: '',
      html: `
            <div>
                <span>Ваш аккаунт деактивирован. Свяжитесь с администратором</span>
            </div>
            `,
    });
  }

  async sendAccountActivated(to: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Ваш аккаунт на ${process.env.API_NAME} активирован`,
      text: '',
      html: `
            <div>
                <span>Поздравляем! Ваш аккаунт активирован. Теперь вы можете войти</span>
            </div>
            `,
    });
  }

  async sendRequestStatusChanged(to: string, address: string, status: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Статус вашей заявки на ${process.env.API_NAME} изменен`,
      text: '',
      html: `
            <div>
                <span>Статус вашей заявки на монтаж на ${address} изменен на ${status}</span>
            </div>
            `,
    });
  }

  async sendBrigadierChanged(to: string, address: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Вам назначена новая заявка на ${process.env.API_NAME}`,
      text: '',
      html: `
            <div>
                <span>Вам назначена новая заявка на монтаж (${address})</span>
            </div>
            `,
    });
  }
}
