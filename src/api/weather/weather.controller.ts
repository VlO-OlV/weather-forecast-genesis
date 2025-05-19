import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(
    private weatherService: WeatherService,
  ) {}

  @Get()
  async getCurrentWeather (
    @Query('city') city: string,
  ) {
    return this.weatherService.getCurrentWeather(city);
  }
}