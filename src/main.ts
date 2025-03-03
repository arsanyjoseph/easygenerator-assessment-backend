import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from './validation/ValidationPipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/logger.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),

  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  
  const config = new DocumentBuilder()
    .setTitle('EasyGenerator Assessment')
    .setDescription('EasyGenerator Assessment API description')
    .setVersion('1.0')
    .addTag('EasyGenerator')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
