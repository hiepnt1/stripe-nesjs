import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import StripeEvent from "./entity/stripeEvent.entity";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import Stripe from "stripe";
import PostgresErrorCode from "./error/postgresErrorCode.enum";

@Injectable()
export class WebhookService {
    constructor(
        @InjectRepository(StripeEvent)
        private readonly eventRepository: Repository<StripeEvent>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) { }

    createEvent(id: string) {
        return this.eventRepository.insert({ id })
    }

    async processSubscriptionUpdate(event: Stripe.Event) {
        try {
            await this.createEvent(event.id);
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new BadRequestException('This event was already processed');
            }
        }

        const data = event.data.object as Stripe.Subscription;

        const customerId: string = data.customer as string;
        const subscriptionStatus = data.status;

        await this.userService.updateMonthlySubscriptionStatus(customerId, subscriptionStatus);

    }
}