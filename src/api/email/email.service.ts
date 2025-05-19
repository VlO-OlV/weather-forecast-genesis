import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {

  constructor (private readonly mailerService: MailerService) {}

  async sendEmail ({ to, subject, message }: EmailDto) {
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      text: message,
    });
  }
}