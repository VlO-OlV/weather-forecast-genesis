import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from 'src/database/repositories/subscription.repository';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { EmailService } from '../email/email.service';
import { Cron } from '@nestjs/schedule';
import { WeatherService } from '../weather/weather.service';
import { Frequency } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionRepository,
    private emailService: EmailService,
    private weatherService: WeatherService,
    private configService: ConfigService,
  ) {}

  async subscribe (subscription: CreateSubscriptionDto) {
    const subscribedEmail = await this.subscriptionRepository.find({ email: subscription.email });
    if (subscribedEmail) {
      throw new ConflictException('Email already subscribed');
    }

    const token = this.generateToken();

    await this.subscriptionRepository.create({
      ...subscription,
      token,
      city: {
        connectOrCreate: {
          where: { name: subscription.city },
          create: { name: subscription.city },
        },
      },
    });

    const port = this.configService.get<number>('port');

    await this.emailService.sendEmail({
      to: subscription.email,
      subject: 'Weather forecast subscription',
      message: `Click here to confirm subscription: http://localhost:${port}/confirm/${token}`,
    });

    return {
      message: 'Subscription successful. Confirmation email sent.',
    };
  }

  async confirmSubscription (token: string) {
    if (token.length !== 20) {
      throw new BadRequestException('Invalid token');
    }

    const subscription = await this.subscriptionRepository.find({ token });
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    await this.subscriptionRepository.updateById(subscription.id, { confirmed: true })

    return {
      message: 'Subscription confirmed successfully',
    };
  }

  async rejectSubscription (token: string) {
    if (token.length !== 20) {
      throw new BadRequestException('Invalid token');
    }

    const subscription = await this.subscriptionRepository.find({ token });
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    await this.subscriptionRepository.deleteById(subscription.id);

    return {
      message: 'Unsubscribed successfully',
    };
  }

  @Cron('0 0 * * * *')
  private async handleHoulyWeatherUpdates () {
    await this.weatherService.handleHourlyWeatherUpdates();
    this.sendWeatherUpdates(Frequency.hourly);
  }

  @Cron('0 30 8 * * *')
  private async handleDailyWeatherUpdates () {
    await this.weatherService.handleDailyWeatherUpdates();
    this.sendWeatherUpdates(Frequency.daily);
  }

  private async sendWeatherUpdates (frequency: Frequency) {
    const dailySubscriptions = await this.subscriptionRepository.findAll({
      frequency,
      confirmed: true,
    });

    const port = this.configService.get<number>('port');

    for (const subscription of dailySubscriptions) {
      let message: string | null = null;

      if (subscription.city.weather) {
        const { temperature, humidity, description } = subscription.city.weather;
        message = `Temperature: ${temperature}°C\nHumidity: ${humidity}%\nDescription: ${description}`;
      }

      this.emailService.sendEmail({
        to: subscription.email,
        subject: `${frequency === Frequency.daily ? 'Daily' : 'Hourly'} weather forecast in ${subscription.city.name}`,
        message: (message ?? 'Oops! It seems like you specified incorrect city name') + `\n\nClick here to unsubscribe: http://localhost:${port}/unsubscribe/${subscription.token}`,
      });
    }
  }

  private generateToken () {
    const symbols = ['abcdefghijklmnopqrstuvwxyz', '0123456789'];
    let token = '';
    for (let i = 0; i < 20; i++) {
      const symbolType = Math.floor(Math.random() * 2);
      const symbolIndex = Math.floor(Math.random() * symbols[symbolType].length);
      token += symbols[symbolType][symbolIndex];
    }
    return token;
  }
}