import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi'
import { StripeModule } from './stripe/stripe.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
      STRIPE_SECRET_KEY: Joi.string(),
      STRIPE_CURRENCY: Joi.string(),
      FRONTEND_URL: Joi.string(),
      MONTHLY_SUBSCRIPTION_PRICE_ID: Joi.string(),
      STRIPE_WEBHOOK_SECRET: Joi.string(),
    })
  }), StripeModule, UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
