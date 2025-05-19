import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class SubscriptionRepository {
  constructor (
    private prisma: PrismaService,
  ) {}

  async create (data: Prisma.SubscriptionCreateInput) {
    return this.prisma.subscription.create({ data });
  }

  async find (where: Prisma.SubscriptionWhereInput) {
    return this.prisma.subscription.findFirst({
      where,
    });
  }

  async findAll (where: Prisma.SubscriptionWhereInput) {
    return this.prisma.subscription.findMany({
      where,
      include: {
        city: {
          include: {
            weather: true,
          },
        },
      },
    });
  }

  async updateById (id: string, data: Prisma.SubscriptionUpdateInput) {
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async deleteById (id: string) {
    return this.prisma.subscription.delete({
      where: { id },
    })
  }
}