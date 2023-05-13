import { Book } from '@prisma/client';

export class MessageUtils {
  static menu(): string {
    const options = ['Sugerir livros', 'Procurar livro', 'Alugar livro'];

    return [
      'Olá, por aqui eu posso te ajudar com uma dessas opções:\n',
      ...options.map((option, index) => `${index + 1} - ${option}`),
    ].join('\n');
  }

  static suggestion(books: Book[]): string {
    const options = books.map((book, index) => `${index + 1} - ${book.title}`);

    return [
      `Recomendo esses ${books.length} livros para você ler esta semana:\n`,
      ...options,
      '\n',
      'Caso queira alugar algum desses livros, digite o número correspondente ao livro que deseja alugar.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }

  static search(): string {
    return [
      'Digite o nome do livro que deseja procurar.\n',
      'Retornarei os 3 primeiros resultados da busca.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }

  static rent(): string {
    return [
      'Digite o nome do livro que deseja alugar.\n',
      'Retornarei os 3 primeiros resultados da busca.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }
}
