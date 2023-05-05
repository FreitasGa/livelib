import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    const clientExists = await this.prisma.client.findFirst({
      where: {
        phone: data.phone,
      },
    });

    if (clientExists) {
      throw new Error('Client already exists');
    }

    const client = await this.prisma.client.create({
      data,
    });

    return client;
  }

  async findAll() {
    return await this.prisma.client.findMany();
  }

  async findOne(id: string) {
    const clientExists = await this.prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!clientExists) {
      throw new Error('Client not found');
    }

    return await this.prisma.client.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateClientDto) {
    const clientExists = await this.prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!clientExists) {
      throw new Error('Client not found');
    }

    const client = await this.prisma.client.update({
      where: {
        id,
      },
      data,
    });

    return client;
  }

  async remove(id: string) {
    const clientExists = await this.prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!clientExists) {
      throw new Error('Client not found');
    }

    return await this.prisma.client.delete({
      where: {
        id,
      },
    });
  }
}
