import { Args, Query, Resolver } from '@nestjs/graphql';
import { CheckDuplication } from 'src/user_information/argstype/checkDuplication.argstype';
import {
  UserComputationFund,
  UserEducationFundState,
} from './entity/user_payment.entity';
import { UserPaymentService } from './user_payment.service';

@Resolver()
export class UserPaymentResolver {
  constructor(private readonly userPaymentService: UserPaymentService) {}

  @Query(() => [UserComputationFund])
  async getUserComputationFund(@Args() checkDuplication: CheckDuplication) {
    return this.userPaymentService.getUserComputationFund(checkDuplication);
  }

  @Query(() => [UserEducationFundState])
  async getUserEducationFundState(@Args() checkDuplication: CheckDuplication) {
    return this.userPaymentService.getUserEducationFundState(checkDuplication);
  }
}
