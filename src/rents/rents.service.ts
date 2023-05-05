import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@Injectable()
export class RentsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateRentDto) {
    return this.prisma.rent.create({
      data: data,
    });
  }

  findAll() {
    return this.prisma.rent.findMany();
  }

  findOne(id: string) {
    return this.prisma.rent.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateRentDto) {
    return this.prisma.rent.update({
      data,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.rent.delete({
      where: { id },
    });
  }
}
