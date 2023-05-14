import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMessageDto) {
    return this.prisma.message.create({
      data,
    });
  }

  findAll() {
    return this.prisma.message.findMany();
  }

  findOne(id: string) {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateMessageDto) {
    return this.prisma.message.update({
      data,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.message.delete({
      where: { id },
    });
  }
}
