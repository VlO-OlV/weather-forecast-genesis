import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { WeatherRepository } from './repositories/weather.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { CityRepository } from './repositories/city.repository';

@Module({
  providers: [
    PrismaService,
    WeatherRepository,
    SubscriptionRepository,
    CityRepository,
  ],
  exports: [
    PrismaService,
    WeatherRepository,
    SubscriptionRepository,
    CityRepository,
  ],
})
export class DatabaseModule {}