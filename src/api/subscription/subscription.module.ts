import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from '../email/email.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [
    DatabaseModule,
    EmailModule,
    WeatherModule,
  ],
})
export class SubscriptionModule {}