import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { StripeModule } from "src/stripe/stripe.module";
import { StripeService } from "src/stripe/stripe.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => StripeModule)],
    controllers: [],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }