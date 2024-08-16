import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import StripeError from "./error/stripeError.enum";

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor(
        private readonly configService: ConfigService
    ) {
        // Stripe sometimes makes changes to their API that isn’t backward-compatible. 
        // To avoid issues, we can define the version of the API we want to use
        this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2024-06-20'
        })
    }
    public async createCustomer(name: string, email: string) {
        return this.stripe.customers.create({
            name, email

        })
    }


    public async charge(amount: number, paymentMethodId: string, customerId: string) {
        return this.stripe.paymentIntents.create({
            amount,
            customer: customerId,
            payment_method: paymentMethodId,
            currency: this.configService.get('STRIPE_CURRENCY'),
            off_session: true,// we indicate that it occurs without the direct involvement of the customer with the use of previously collected credit card information
            confirm: true
        })
    }

    public async attachCreditCard(payment_methodId: string, customerId: string) {
        return this.stripe.setupIntents.create({
            customer: customerId,
            payment_method: payment_methodId
        })
    }

    public async listCreditCards(customerId: string) {
        return this.stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });
    }

    // handling a non-existent payment method is chosen or the one that belongs to another customer.
    public async setDefaultCreditCard(paymentMethodId: string, customerId: string) {
        try {
            return await this.stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            })
        } catch (error) {
            if (error?.type === StripeError.InvalidRequest) {
                throw new BadRequestException('Wrong credit card chosen');
            }
            throw new InternalServerErrorException();
        }
    }


    //The two methods below are quite low-level
    public async createSubscription(priceId: string, customerId: string,) {
        try {
            return await this.stripe.subscriptions.create({
                customer: customerId,
                items: [
                    {
                        price: priceId
                    }
                ],
                trial_period_days: 30 // create a subscription with a customer with a free trial period
            })
        } catch (error) {
            if (error?.code === StripeError.ResourceMissing) {
                throw new BadRequestException('Credit card not set up');
            }
            throw new InternalServerErrorException();
        }
    }

    public async listSubscriptions(priceId: string, customerId: string,) {
        return this.stripe.subscriptions.list({
            customer: customerId,
            price: priceId,
            expand: ['data.latest_invoice', 'data.latest_invoice.payment_intent']
        })
    }

    public async construcEventFromPayload(signature: string, payload: Buffer) {
        const webhookSecret = await this.configService.get('STRIPE_WEBHOOK_SECRET')
        return this.stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret
        )
    }
}