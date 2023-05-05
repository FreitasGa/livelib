import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateGenreDto) {
    return this.prisma.genre.create({
      data,
    });
  }

  findAll() {
    return this.prisma.genre.findMany();
  }

  findOne(id: string) {
    return this.prisma.genre.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateGenreDto) {
    return this.prisma.genre.update({
      data,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
