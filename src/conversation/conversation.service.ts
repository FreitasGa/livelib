import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { EventDto } from './dto/event.dto';

@Injectable()
export class ConversationService {
  private client: Twilio;

  constructor(private configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );

    this.client.conversations.v1.configuration
      .webhooks()
      .fetch()
      .then((webhook) => console.log(webhook));
  }

  async onMessageAdded(body: EventDto) {
    this.client.messages.create({
      to: body.From,
      from: body.To,
      body: `Olá, por aqui posso te ajudar com uma dessas opções:\n\n1 - Sugestões de livros\n2 - Alugar livro\n3 - Agendar ida até a biblioteca`,
    });
  }
}
