import { injectable } from 'inversify';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { ISendEmailService } from '../interface/ISendEmail.service';
import { MailOptions } from '../types/types';
import { InternalServerErrorException } from 'src/common/errors/all.exception';

@injectable()
export class SendEmailService implements ISendEmailService {
  constructor() {}

  init() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  private async sendMailWithSendGrid(mailOpt: MailOptions) {
    try {
      await sgMail.send(mailOpt);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async sendMailWithMailHog(mailOpt: MailOptions) {
    const transporter = nodemailer.createTransport({
      host: 'mailhog',
      port: 1025,
    });
    try {
      await transporter.sendMail(mailOpt);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  sendVerificationEmail(email: string, emailVerificationToken: string): void {
    const mailOpt: MailOptions = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: https://example.com/email-verification?token=${emailVerificationToken}`,
      html: `<p>Click the following link to verify your email:</p><p><a href="https://example.com/email-verification?token=${emailVerificationToken}">Verify Email</a></p>`,
    };
    if (process.env.NODE_ENV === 'develop') this.sendMailWithMailHog(mailOpt);
    else if (process.env.NODE_ENV === 'production')
      this.sendMailWithSendGrid(mailOpt);
  }
}
