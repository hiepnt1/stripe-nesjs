import { BadRequestException, Controller, Headers, Post, Req } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import RequestWithRawBody from "src/middleware/requestWithRawBody.interface";
import Stripe from "stripe";
import { UserService } from "src/user/user.service";

@Controller('/webhook')
export class WebhookController {
    constructor(
        private readonly stripeService: StripeService,
        // private readonly userService: UserService
    ) { }

    @Post()
    async handleComingEvent(
        @Headers('stripe-signature') signature: string,
        @Req() request: RequestWithRawBody
    ) {
        if (!signature)
            throw new BadRequestException('Missing stripe-signature header')

        const event = await this.stripeService.construcEventFromPayload(signature, request.rawBody);
        if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
            const data = event.data.object as Stripe.Subscription;

            const customerId: string = data.customer as string;
            const subscriptionStatus = data.status;

            // await this.userService.updateMonthlySubscriptionStatus(customerId, subscriptionStatus)
        }
    }
}