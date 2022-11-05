import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserInformationModule } from './user_information/user_information.module';
import { UserStatusModule } from './user_status/user_status.module';
import { UserPaymentModule } from './user_payment/user_payment.module';
import { UserJobModule } from './user_job/user_job.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { UpdaterModule } from './updater/updater.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SpreadModule } from './spread/spread.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
      cache: false,
      // load: [typeORMConfig],
    }),
    // TypeOrmModule.forRootAsync(typeORMConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database_host'),
        port: configService.get('database_port'),
        username: configService.get('database_username'),
        password: configService.get('database_password'),
        database: configService.get('database'),
        entities: [join(__dirname, '/**/*.entity.js')],
        synchronize: configService.get('database'),
        dropSchema: configService.get('dropSchema'),
        logging: configService.get('database_logging'),
      }),
    }),
    UserInformationModule,
    UserJobModule,
    UserPaymentModule,
    UserStatusModule,
    SpreadModule,
    ApiModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: Boolean(process.env.playground) || false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cache: 'bounded',
      // include: [UserInformationModule,
      //   UserStatusModule,
      //   UserPaymentModule,
      //   UserJobModule]
    }),
    UpdaterModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private dataSource: DataSource) {}
}
