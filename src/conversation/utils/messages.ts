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
      '',
      'Caso queira alugar algum desses livros, digite o número correspondente ao livro que deseja alugar.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }

  static searchMenu(): string {
    return [
      'Digite o nome do livro que deseja procurar.\n',
      'Retornarei os 3 primeiros resultados da busca.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }

  static rentMenu(): string {
    return [
      'Digite o nome do livro que deseja alugar.\n',
      'Retornarei os 3 primeiros resultados da busca.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }

  static search(books: Book[]): string {
    const options = books.map((book, index) => `${index + 1} - ${book.title}`);

    if (books.length === 0) {
      return [
        'Não encontrei nenhum livro com esse nome.\n',
        'Caso queira retornar ao menu, digite 0.',
      ].join('\n');
    }

    return [
      `Olá, encontrei ${books.length} livros com esse nome:\n`,
      ...options,
      '',
      'Caso queira alugar algum desses livros, digite o número correspondente ao livro que deseja alugar.\n',
      'Caso queira ver o menu, digite 0.',
    ].join('\n');
  }

  static rent(book: Book): string {
    console.log(book);

    return [`Você alugou o livro.\n`, 'Caso queira ver o menu, digite 0.'].join(
      '\n',
    );
  }

  static schedule(books: Book[]): string {
    const options = books.map((book, index) => `${index + 1} - ${book.title}`);

    return [
      `Olá, recomendo esses ${books.length} livros para você ler esta semana:\n`,
      ...options,
      '',
      'Caso queira alugar algum desses livros, digite o número correspondente ao livro que deseja alugar.\n',
      'Caso queira ver o menu, digite 0.',
      '',
      'Boa leitura!',
    ].join('\n');
  }
}
