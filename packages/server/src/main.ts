import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cors 설정
  const whitelist = ['dashboard42.com', 'localhost'];
  app.enableCors({
    origin: function (origin, callback) {
      //if (!origin || whitelist.indexOf(origin) !== -1) {
      if (true) {
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
  await app.listen(3000);
}
bootstrap();
