import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookDto) {
    const bookExists = await this.prisma.books.findFirst({
      where: {
        title: data.title,
      },
    });

    if (bookExists) {
      throw new Error('Book already exists');
    }

    const book = await this.prisma.books.create({
      data,
    });

    return book;
  }

  async findAll() {
    return await this.prisma.books.findMany();
  }

  async findOne(id: string) {
    const bookExists = await this.prisma.books.findUnique({
      where: {
        id,
      },
    });

    if (!bookExists) {
      throw new Error('Book not found');
    }

    return await this.prisma.books.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateBookDto) {
    const bookExists = await this.prisma.books.findUnique({
      where: {
        id,
      },
    });

    if (!bookExists) {
      throw new Error('Book not found');
    }

    const book = await this.prisma.books.update({
      data,
      where: {
        id,
      },
    });

    return book;
  }

  async remove(id: string) {
    const bookExists = await this.prisma.books.findUnique({
      where: {
        id,
      },
    });

    if (!bookExists) {
      throw new Error('Book not found');
    }

    return await this.prisma.books.delete({
      where: {
        id,
      },
    });
  }
}
