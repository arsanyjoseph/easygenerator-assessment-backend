import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/UserCreated.event';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserCreatedListener {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const verificationToken = this.authService.generateVerificationToken(event.userId.toString(), event.email);

    await this.mailService.sendVerificationEmail(event.email, verificationToken);
  }
}