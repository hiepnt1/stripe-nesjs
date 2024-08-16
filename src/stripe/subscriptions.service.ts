import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StripeService } from "./stripe.service";

@Injectable()
export class SubcriptionService {
    constructor(
        private readonly configService: ConfigService,
        private readonly stripService: StripeService
    ) { }


    public async createMonthlySubscription(customerId: string) {
        const priceId = this.configService.get('MONTHLY_SUBSCRIPTION_PRICE_ID');

        const subscriptions = await this.stripService.listSubscriptions(priceId, customerId);
        if (subscriptions.data.length) {
            throw new BadRequestException('Customer already subscribed');
        }
        return this.stripService.createSubscription(priceId, customerId);
    }

    public async getMonthlySubscription(customerId: string) {
        const priceId = this.configService.get('MONTHLY_SUBSCRIPTION_PRICE_ID');
        const subscriptions = await this.stripService.listSubscriptions(priceId, customerId);

        if (!subscriptions.data.length) {
            return new NotFoundException('Customer not subscribed');
        }
        return subscriptions.data[0];
    }
}