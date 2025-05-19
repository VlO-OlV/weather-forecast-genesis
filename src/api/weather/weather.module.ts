import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
  imports: [DatabaseModule],
})
export class WeatherModule {}