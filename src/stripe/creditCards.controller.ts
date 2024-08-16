import { Body, Controller, Get, HttpCode, Post, Req } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import AddCreditCardDto from "./dto/addCreditCard.dto";
import requestWithUser from "./dto/requesWithtUser.interface";
import SetDefaultCreditCardDto from "./dto/setDefaultCreditCard.dto";

@Controller('credit-card')
export class CreditCardController {
    constructor(
        private readonly stripService: StripeService
    ) { }

    @Post()
    public async addCreditCard(@Body() creditCard: AddCreditCardDto, @Req() request: requestWithUser) {
        return this.stripService.attachCreditCard(creditCard.paymentMethodId, request.user.stripeCustomerId)
    }

    @Get()
    async getCreditCards(@Req() request: requestWithUser) {
        return this.stripService.listCreditCards(request.user.stripeCustomerId);
    }

    // When the customers have the default payment method chosen, we can create a subscription for them.
    @Post('default')
    @HttpCode(200)
    async setDefaultCard(@Body() creditCard: SetDefaultCreditCardDto, @Req() request: requestWithUser) {
        await this.stripService.setDefaultCreditCard(creditCard.paymentMethodId, request.user.stripeCustomerId);
    }
}