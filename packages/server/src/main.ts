import { InternalServerErrorException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors 설정
  const whitelist = ['dashboard42.com', 'localhost'];
  app.enableCors({
    origin: function (origin, callback) {
      if (1) {
        // if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // swagger 설정
  const config = new DocumentBuilder()
    .setTitle('dashBoard42')
    .setDescription('dashBoard42 API description')
    .setVersion('1.0')
    .addTag('Rest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  if (new Date(process.env.expired_date) < new Date()) {
    console.log('42 API 시크릿 키가 만료되었습니다. 시크릿 키 갱신해주세요.');
    // throw new InternalServerErrorException();
  }
  await app.listen(process.env.server_port || 3000);
}
bootstrap();
