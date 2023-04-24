import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const { port } = config.get('server');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  await app.listen(port, () => console.log(port));
}
bootstrap();