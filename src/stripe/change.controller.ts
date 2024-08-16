import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import CreateChargeDto from "./dto/createCharge.dto";
import requestWithUser from "./dto/requesWithtUser.interface";

@Controller('charge')
export class ChargeController {
    constructor(
        private readonly stripeService: StripeService
    ) { }

    @Post()
    async createCharge(@Body() charge: CreateChargeDto, @Req() request: requestWithUser) {
        return this.stripeService.charge(charge.amount, charge.paymentMethodId, request.user.stripeCustomerId);
    }
}