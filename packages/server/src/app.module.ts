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
import { typeORMConfig } from './config/typeorm.config';
import { ApiModule } from './api/api.module';
import { UpdaterModule } from './updater/updater.module';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SpreadModule } from './spread/spread.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserInformationModule,
    UserJobModule,
    UserPaymentModule,
    UserStatusModule,
    SpreadModule,
    ApiModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
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
