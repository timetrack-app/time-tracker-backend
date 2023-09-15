import { injectable } from 'inversify';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { ISendEmailService } from '../interface/ISendEmail.service';
import { MailOptions } from '../types/types';
import { InternalServerErrorException } from '../../../common/errors/all.exception';

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
    console.log('mailOption', mailOpt);
    /** To be Fixed : Mail sending with mailHog is causing an error**/

    // try {
    //   await transporter.sendMail(mailOpt);
    // } catch (error) {
    //   console.log('error : ', error);

    //   throw new InternalServerErrorException(
    //     'Error with sendMailWithMailHog function',
    //   );
    // }
  }

  sendVerificationEmail(email: string, emailVerificationToken: string): void {
    const url = `${process.env.WEB_DOMAIN}/auth/email-verification?token=${emailVerificationToken}`;
    const mailOpt: MailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: ${url}`,
      html: `<p>Click the following link to verify your email:</p><p><a href="${url}">Verify Email</a></p>`,
    };
    if (process.env.NODE_ENV === 'develop') this.sendMailWithMailHog(mailOpt);
    else if (process.env.NODE_ENV === 'production')
      this.sendMailWithSendGrid(mailOpt);
  }

  sendNewEmailConfirmationEmail(
    email: string,
    emailVerificationToken: string,
  ): void {
    const url = `${process.env.WEB_DOMAIN}/users/email-update/verification?token=${emailVerificationToken}`;
    const mailOpt: MailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'New Email Verification',
      text: `Click the following link to verify the change of your email: ${url}`,
      html: `<p>Click the following link to verify your email:</p><p><a href="${url}">Verify Email</a></p>`,
    };
    if (process.env.NODE_ENV === 'develop') this.sendMailWithMailHog(mailOpt);
    else if (process.env.NODE_ENV === 'production')
      this.sendMailWithSendGrid(mailOpt);
  }

  sendNewPasswordConfirmationEmail(email: string, token: string): void {
    const url = `${process.env.WEB_DOMAIN}/users/password-update/verification?token=${token}`;
    const mailOpt: MailOptions = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'New Password Verification',
      text: `Click the following link to verify your new password: ${url}`,
      html: `<p>Click the following link to verify your new password:</p><p><a href="${url}">Verify new password</a></p>`,
    };
    if (process.env.NODE_ENV === 'develop') this.sendMailWithMailHog(mailOpt);
    else if (process.env.NODE_ENV === 'production')
      this.sendMailWithSendGrid(mailOpt);
  }

  sendPasswordResetLinkEmail(id: number, email: string): void {
    const url = `${process.env.WEB_DOMAIN}/users/${id}/password-update`;
    const mailOpt: MailOptions = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'New Password Verification',
      text: `Click the following link to reset your password: ${url}`,
      html: `<p>Click the following link to reset your password:</p><p><a href="${url}>Verify new password</a></p>`,
    };
    if (process.env.NODE_ENV === 'develop') this.sendMailWithMailHog(mailOpt);
    else if (process.env.NODE_ENV === 'production')
      this.sendMailWithSendGrid(mailOpt);
  }
}
