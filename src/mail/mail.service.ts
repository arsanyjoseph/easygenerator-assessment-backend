import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async sendEmail(email: string, mailOptions: ISendMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`Email sent to ${email}`);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error);
      this.logger.error('Error sending email', errorMessage);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${process.env.CLIENT_URL}/verify-user?token=${token}`;
    const emailHtml = `
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">Click Here</a>
            <p>If you didn't request this, please ignore this email.</p>
            `;
    try {
      const mailOptions: ISendMailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Verify your email',
        html: emailHtml,
      };
      await this.sendEmail(email, mailOptions);
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error);
      this.logger.error(
        `Error sending verification email to ${email}: ${errorMessage}`,
      );
      throw new Error(
        `Failed to send verification email to ${email}: ${errorMessage}`,
      );
    }
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }
}
