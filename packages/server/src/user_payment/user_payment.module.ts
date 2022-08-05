import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPaymentController } from './user_payment.controller';
import { UserPaymentService } from './user_payment.service';
import { UserPaymentResolver } from './user_payment.resolver';
import {
  UserComputationFund,
  // UserEducationFundState,
} from './entity/user_payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserComputationFund]), //, UserEducationFundState]),
  ],
  controllers: [UserPaymentController],
  providers: [UserPaymentService, UserPaymentResolver],
})
export class UserPaymentModule {}
