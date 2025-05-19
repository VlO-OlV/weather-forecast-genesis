import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class WeatherRepository {
  constructor (
    private prisma: PrismaService,
  ) {}

  async find (where: Prisma.WeatherWhereInput) {
    return this.prisma.weather.findFirst({ where });
  }

  async create (data: Prisma.WeatherUncheckedCreateInput) {
    return this.prisma.weather.upsert({
      where: { cityId: data.cityId },
      update: { ...data },
      create: { ...data },
    });
  }
}