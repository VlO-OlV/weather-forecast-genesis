import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Controller()
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
  ) {}
  
  @Post('/subscribe')
  async subscribe (
    @Body() subscription: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.subscribe(subscription);
  }

  @Get('/confirm/:token')
  async confirmSubscription (
    @Param('token') token: string,
  ) {
    return this.subscriptionService.confirmSubscription(token);
  }

  @Get('/unsubscribe/:token')
  async rejectSubscription (
    @Param('token') token: string,
  ) {
    return this.subscriptionService.rejectSubscription(token);
  }
}