import { Controller, Get, Post, Req } from "@nestjs/common";
import { SubcriptionService } from "./subscriptions.service";
import requestWithUser from "./dto/requesWithtUser.interface";

@Controller('subscription')
export class SubscriptionController {
    constructor(
        private readonly subscriptionService: SubcriptionService
    ) { }

    @Post('monthly')
    async createMonthlySubscription(@Req() request: requestWithUser) {
        return this.subscriptionService.createMonthlySubscription(request.user.stripeCustomerId);
    }

    @Get('monthly')
    async getMonthlySubscription(@Req() request: requestWithUser) {
        return this.subscriptionService.getMonthlySubscription(request.user.stripeCustomerId);
    }
}