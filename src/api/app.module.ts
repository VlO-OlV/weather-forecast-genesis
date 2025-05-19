import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from './email/email.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { WeatherModule } from './weather/weather.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    EmailModule,
    SubscriptionModule,
    WeatherModule,
  ],
})
export class AppModule {}
