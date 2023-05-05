import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { BooksService } from '../books/books.service';
import { EventDto } from './dto/event.dto';

@Injectable()
export class ConversationService {
  private client: Twilio;

  constructor(
    private configService: ConfigService,
    private books: BooksService,
  ) {
    this.client = new Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );
  }

  async onMessageAdded(body: EventDto) {
    let message: string;

    if (body.Body === '1') {
      const books = await this.books.findAll();

      message = `Eu recomendo três livros por semana para ampliar seus horizontes literários e desfrutar de novas histórias!\n\n Aqui estão três livros que eu recomendo para você ler esta semana:\n\n`;

      books.forEach((book, index) => {
        message += `${index + 1}. ${book.description}\n\n`;
      });
    } else if (body.Body === '2') {
      message =
        'Olá! Para alugar um livro, por favor, informe o título e autor do livro que deseja alugar. Em seguida, verificaremos a disponibilidade e as informações necessárias para concluir a locação. Obrigado!';
    } else if (body.Body === '3') {
      message = `Olá! Para agendar sua visita à biblioteca, por favor, informe a data e o horário desejado. Em seguida, verificaremos a disponibilidade e confirmaremos sua reserva. Se precisar de ajuda para encontrar algum livro em particular, é só me informar que eu estarei aqui para ajudá-lo. Obrigado!`;
    } else {
      message = `Olá, por aqui posso te ajudar com uma dessas opções:\n\n1 - Sugestões de livros\n2 - Alugar livro\n3 - Agendar ida até a biblioteca\n4 - Exibir menu`;
    }

    this.client.messages.create({
      to: body.From,
      from: body.To,
      body: message,
    });
  }
}
