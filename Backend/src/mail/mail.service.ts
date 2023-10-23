import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
        host: 'mail.mailo.com',
    port: 465,
    auth: {
        user: 'transcendencemail@mailo.com',
        pass: 'Test.1234'
    }
    });
  }

  async sendEmail(
    destination: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'transcendencemail@mailo.com',
      to: destination,
      subject: subject,
      text: text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('E-mail envoyé avec succès.');
      return;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
    }
  }
}