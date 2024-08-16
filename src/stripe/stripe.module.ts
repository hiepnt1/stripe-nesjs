import { forwardRef, Module } from "@nestjs/common";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import { ChargeController } from "./change.controller";
import { CreditCardController } from "./creditCards.controller";
import { SubscriptionController } from "./subscriptions.controller";
import { SubcriptionService } from "./subscriptions.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/entity/user.entity";
import { WebhookController } from "./stripeWebhook.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import StripeEvent from "./entity/stripeEvent.entity";
import { WebhookService } from "./stripeWebhook.service";
import { UserService } from "src/user/user.service";

@Module({
    imports: [ConfigModule, forwardRef(() => UserModule), TypeOrmModule.forFeature([StripeEvent])],
    controllers: [StripeController, ChargeController, CreditCardController, SubscriptionController, WebhookController],
    providers: [StripeService, SubcriptionService, WebhookService],
    exports: [StripeService]
})
export class StripeModule { }