import { Book } from '@prisma/client';

export class MessageUtils {
  static main(cartSize: number): string {
    const options = ['Sugerir livros', 'Procurar livro', 'Alugar livro'];

    if (cartSize > 0) {
      options.push('Ver carrinho');
    }

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
      'Caso queira selecionar algum desses livros, digite o número correspondente ao livro que deseja selecionar.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }

  static prompt(mode: 'search' | 'rent'): string {
    if (mode === 'search') {
      return [
        'Digite o nome do livro que deseja procurar.\n',
        'Retornarei os 3 primeiros resultados da busca.\n',
        'Caso queira retornar ao menu, digite 0.',
      ].join('\n');
    }

    return [
      'Digite o nome do livro que deseja alugar.\n',
      'Retornarei os 3 primeiros resultados da busca.\n',
      'Caso queira retornar ao menu, digite 0.',
    ].join('\n');
  }

  static search(books: Book[]): string {
    if (books.length === 0) {
      return [
        'Não encontrei nenhum livro com esse nome.\n',
        'Caso queira retornar ao menu, digite 0.',
      ].join('\n');
    }

    const options = books.map((book, index) => `${index + 1} - ${book.title}`);

    return [
      `Olá, encontrei ${books.length} livros com esse nome:\n`,
      ...options,
      '',
      'Caso queira selecionar algum desses livros, digite o número correspondente ao livro que deseja selecionar.\n',
      'Caso queira ver o menu, digite 0.',
    ].join('\n');
  }

  static confirmation(): string {
    return [
      'Você deseja adicionar este livro ao carrinho?',
      '',
      'Caso queira adicionar, digite 1.',
      'Caso queira voltar a lista de livros, digite 2.',
      'Caso queira ver o menu, digite 0.',
    ].join('\n');
  }

  static addedToCart(): string {
    return ['Livro adicionado ao carrinho com sucesso!\n'].join('\n');
  }

  static rent(books: Book[]): string {
    if (books.length === 0) {
      return [
        'Não encontrei nenhum livro com esse nome.\n',
        'Caso queira retornar ao menu, digite 0.',
      ].join('\n');
    }

    const options = books.map((book, index) => `${index + 1} - ${book.title}`);

    return [
      'Livros alugados com sucesso!\n',
      ...options,
      '',
      'Caso queira ver o menu, digite 0.',
    ].join('\n');
  }

  static schedule(books: Book[]): string {
    const options = books.map((book, index) => `${index + 1} - ${book.title}`);

    return [
      `Olá, recomendo esses ${books.length} livros para você ler esta semana:\n`,
      ...options,
      '',
      'Caso queira selecionar algum desses livros, digite o número correspondente ao livro que deseja selecionar.\n',
      'Caso queira ver o menu, digite 0.',
      '',
      'Boa leitura!',
    ].join('\n');
  }

  static cart(books: Book[]): string {
    const options = books.map((book, index) => `${index + 1} - ${book.title}`);

    return [
      `Olá, você tem ${books.length} livros no carrinho:\n`,
      ...options,
      '',
      'Caso queira alugar os livros, digite 1.',
      'Caso queira limpar o carrinho, digite 2.',
      'Caso queira ver o menu, digite 0.',
    ].join('\n');
  }

  static cartClear(): string {
    return [
      'Carrinho limpo com sucesso!\n',
      'Caso queira ver o menu, digite 0.',
    ].join('\n');
  }

  static book(book: Book): string {
    return [`*${book.title}*`, book.author, '', book.description].join('\n');
  }
}
