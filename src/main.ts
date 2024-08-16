import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { rawBodyMiddleware } from './middleware/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.use(rawBodyMiddleware())

  app.enableCors({
    origin: configService.get("FRONTEND_URL"),
    credentials: true
  })

  await app.listen(3000);
}
bootstrap();
