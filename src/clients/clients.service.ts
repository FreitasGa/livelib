import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    return this.prisma.client.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.client.findMany();
  }

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async findOneByNumber(phone: string) {
    return this.prisma.client.findMany({
      where: { phone },
    });
  }

  async update(id: string, data: UpdateClientDto) {
    return this.prisma.client.update({
      data,
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
