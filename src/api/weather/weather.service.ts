import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherRepository } from 'src/database/repositories/weather.repository';
import { WeatherForecastDto } from './dtos/weather-forecast.dto';
import { CityRepository } from 'src/database/repositories/city.repository';
import { City, Frequency } from 'generated/prisma';

@Injectable()
export class WeatherService {
  constructor(
    private weatherRepository: WeatherRepository,
    private cityRepository: CityRepository,
    private configService: ConfigService,
  ) {}

  async getCurrentWeather (city: string) {
    if (!city) {
      throw new BadRequestException('Invalid request')
    }

    const weatherForecast = await this.parseWeather(city);

    if (!weatherForecast.current) {
      throw new NotFoundException('City not found');
    }

    return {
      temperature: weatherForecast.current.temp_c,
      humidity: weatherForecast.current.humidity,
      description: weatherForecast.current.condition.text,
    };
  }

  async handleHourlyWeatherUpdates () {
    const citiesToUpdate = await this.cityRepository.findAll({
      subscriptions: {
        some: {
          frequency: Frequency.hourly,
          confirmed: true,
        },
      },
    });

    await this.updateWeather(citiesToUpdate);
  }

  async handleDailyWeatherUpdates () {
    const citiesToUpdate = await this.cityRepository.findAll({
      subscriptions: {
        some: {
          frequency: Frequency.daily,
          confirmed: true,
        },
      },
    });

    await this.updateWeather(citiesToUpdate);
  }

  async updateWeather (citiesToUpdate: City[]) {
    for (const city of citiesToUpdate) {
      const weatherData = await this.parseWeather(city.name);
      if (weatherData.current) {
        await this.weatherRepository.create({
          temperature: weatherData.current.temp_c,
          humidity: weatherData.current.humidity,
          description: weatherData.current.condition.text,
          cityId: city.id,
        });
      }
    }
  }

  private async parseWeather (city: string): Promise<WeatherForecastDto> {
    const weatherApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${this.configService.get<string>('weatherApiKey')}&q=${city}`;

    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    return data;
  }
}