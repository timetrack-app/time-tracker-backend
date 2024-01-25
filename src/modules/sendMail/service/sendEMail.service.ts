import { injectable } from 'inversify';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { ISendEmailService } from '../interface/ISendEmail.service';
import { MailOptions, SendEmailFunc } from '../types/types';
import { InternalServerErrorException } from '../../../common/errors/all.exception';
import {
  isInProduction,
  getAppBaseUrl,
  getAppEmailAddress,
  getFrontendBaseUrl,
  getSendGridApiKey,
  getSmtpPort,
  getLocalSmtpServerName,
} from '../../../common/utils/env.utils';

@injectable()
export class SendEmailService implements ISendEmailService {
  constructor() {}

  init() {
    sgMail.setApiKey(getSendGridApiKey());
  }

  /**
   * For production environment
   *
   * @private
   * @param {MailOptions} mailOpt
   * @memberof SendEmailService
   */
  private async sendMailWithSendGrid(mailOpt: MailOptions) {
    try {
      await sgMail.send(mailOpt);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * For local environment
   *
   * @private
   * @param {MailOptions} mailOpt
   * @memberof SendEmailService
   */
  private async sendMailWithMailHog(mailOpt: MailOptions) {
    const transporter = nodemailer.createTransport({
      host: getLocalSmtpServerName(),
      port: getSmtpPort(),
      ignoreTLS: true ,
    });

    try {
      await transporter.sendMail(mailOpt);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error with sendMailWithMailHog function',
      );
    }
  }

  /**
   * Send email depending on the environment
   *
   * @private
   * @param {MailOptions} mailOpt
   * @param {SendEmailFunc} sendEmailProdCallback
   * @param {SendEmailFunc} sendEmailDevCallback
   * @memberof SendEmailService
   */
  private async sendEmailByEnvironment(
    mailOpt: MailOptions,
    sendEmailProdCallback: SendEmailFunc,
    sendEmailDevCallback: SendEmailFunc,
  ) {
    await isInProduction() ? sendEmailProdCallback(mailOpt) : sendEmailDevCallback(mailOpt);
  }

  /**
   *
   *
   * @private
   * @param {MailOptions} mailOpt
   * @memberof SendEmailService
   */
  private async sendEmail(mailOpt: MailOptions) {
    this.sendEmailByEnvironment(mailOpt, this.sendMailWithSendGrid, this.sendMailWithMailHog);
  }

  /**
   * Send email address verification email to the user who've just registered
   *
   * @param {string} email
   * @param {string} emailVerificationToken
   * @memberof SendEmailService
   */
  sendVerificationEmail(email: string, emailVerificationToken: string): void {
    const url = `${getFrontendBaseUrl()}/email-verification?token=${emailVerificationToken}`;

    const mailOpt: MailOptions = {
      from: getAppEmailAddress(),
      to: email,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: ${url}`,
      html: `<p>Click the following link to verify your email:</p><p><a href="${url}">Verify Email</a></p>`,
    };

    this.sendEmail(mailOpt);
  }

  /**
   * Send email to the user who requested to change email address.
   *
   * @param {string} email
   * @param {string} emailVerificationToken
   * @memberof SendEmailService
   */
  sendNewEmailConfirmationEmail(
    email: string,
    emailVerificationToken: string,
  ): void {
    const url = `${getAppBaseUrl()}/users/email-update/verification?token=${emailVerificationToken}`;
    const mailOpt: MailOptions = {
      from: getAppEmailAddress(),
      to: email,
      subject: 'New Email Verification',
      text: `Click the following link to verify the change of your email: ${url}`,
      html: `<p>Click the following link to verify your email:</p><p><a href="${url}">Verify Email</a></p>`,
    };

    this.sendEmail(mailOpt);
  }

  sendNewPasswordConfirmationEmail(email: string, token: string): void {
    const url = `${getAppBaseUrl()}/users/password-update/verification?token=${token}`;

    const mailOpt: MailOptions = {
      to: email,
      from: getAppEmailAddress(),
      subject: 'New Password Verification',
      text: `Click the following link to verify your new password: ${url}`,
      html: `<p>Click the following link to verify your new password:</p><p><a href="${url}">Verify new password</a></p>`,
    };

    this.sendEmail(mailOpt);
  }

  /**
   *
   *
   * @param {string} email
   * @param {string} token
   * @memberof SendEmailService
   */
  sendPasswordResetLinkEmail(email: string, token: string): void {
    const url = `${getAppBaseUrl()}/users/password-update/verification?token=${token}`;

    const mailOpt: MailOptions = {
      to: email,
      from: getAppEmailAddress(),
      subject: 'Password Reset Link',
      text: `Click the following link to reset your password: ${url}`,
      html: `<p>Click the following link to reset your password:</p><p><a href="${url}>Verify new password</a></p>`,
    };

    this.sendEmail(mailOpt);
  }
}
