import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { argv } from 'process';

const prisma = new PrismaClient();

async function main() {
  const crudeBooks = [];
  const path = './books.csv';

  createReadStream(path)
    .pipe(parse({ fromLine: 2 }))
    .on('data', (row) => {
      const [title, author, description, price, stock, genres] = row;

      crudeBooks.push({
        title,
        author,
        description,
        price: Number(price),
        stock: Number(stock),
        genres: genres.split(', '),
      });
    });

  await prisma.$connect();

  if (argv[2] === '--delete') {
    await prisma.genre.deleteMany();
    await prisma.book.deleteMany();
  }

  const genres = crudeBooks.reduce((acc, book) => {
    book.genres.forEach((genre) => {
      if (!acc.includes(genre)) {
        acc.push(genre);
      }
    });
    return acc;
  }, []);

  await prisma.genre.createMany({
    data: genres.map((genre) => ({ name: genre })),
  });

  const createdGenres = await prisma.genre.findMany();

  const books = crudeBooks.map((cb) => {
    const genreIds = cb.genres.map((genre) => {
      const genreId = createdGenres.find((g) => g.name === genre)?.id;

      if (!genreId) {
        throw new Error(`Genre ${genre} not found`);
      }

      return genreId;
    });

    return {
      title: cb.title,
      author: cb.author,
      description: cb.description,
      price: cb.price,
      stock: cb.stock,
      genreIds,
    };
  });

  await prisma.book.createMany({
    data: books.map((book) => ({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      stock: book.stock,
      genreIds: book.genreIds,
    })),
  });
}

main();
