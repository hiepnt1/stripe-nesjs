import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { StripeService } from "src/stripe/stripe.service";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/user.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @Inject(forwardRef(() => StripeService))
        private readonly stripeService: StripeService
    ) { }

    async create(userData: CreateUserDto) {
        const stripeCustomer = await this.stripeService.createCustomer(userData.name, userData.email);

        const newUser = this.userRepo.create({ ...userData, stripeCustomerId: stripeCustomer.id });
        await this.userRepo.save(newUser)
        return newUser;
    }

    async updateMonthlySubscriptionStatus(
        stripeCustomerId: string,
        monthlySubscriptionStatus: string
    ) {
        return this.userRepo.update({ stripeCustomerId }, { monthlySubscriptionStatus })
    }
}
