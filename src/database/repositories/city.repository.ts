import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CityRepository {
  constructor (
    private prisma: PrismaService,
  ) {}

  async findAll (where: Prisma.CityWhereInput) {
    return this.prisma.city.findMany({ where });
  }
}