import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(to: string, activationLink: string) {
    const link = `${process.env.API_URL}/auth/activate/${activationLink}`;
    try {
      await this.mailerService.sendMail({
        from: process.env.EMAIL_USERNAME,
        to,
        subject: `Activate your account on ${process.env.API_NAME}`,
        text: 'Thank you for joining us.',
        html: `
                      <div>
                          <h1>Click the link:</h1>
                          <a href="${link}">${link}</a>
                      </div>
                  `,
      });
    } catch (err) {
      //console.log(err);
      //throw new BadRequestException(err.message); TODO филтьтр не ловит
    }
  }

  async sendResetPasswordEmail(to: string, login: string, resetPasswordLink: string, password: string) {
    const link = `${process.env.API_URL}/auth/reset-password/${login}/${resetPasswordLink}`;
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Reset your password on ${process.env.API_NAME}`,
      text: '',
      html: `
                    <div>
                        <h1>Confrim:</h1>
                        <span>Your temporary password: ${password}</span>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    });
  }

  async sendAccountDeactivated(to: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Your account on ${process.env.API_NAME} is deactivated now`,
      text: '',
      html: `
                <div>
                    <span>This is a confirmation that your account has just been deactivated.</span>
                </div>
                `,
    });
  }

  async sendConfirmResetPasswordEmail(to: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: `Your ${process.env.API_NAME} password has been changed`,
      html: `
                    <div>
                        <span>This is a confirmation that the password for your account has just been changed.</span>
                    </div>
                `,
    });
  }
}
