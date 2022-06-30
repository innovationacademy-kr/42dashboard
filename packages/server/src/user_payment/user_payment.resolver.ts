import { Query, Resolver } from '@nestjs/graphql';
import { UserComputationFund } from './entity/user_computation_fund.entity';
import { UserEducationFundState } from './entity/user_education_fund_state.entity';
import { UserPaymentService } from './user_payment.service';

@Resolver()
export class UserPaymentResolver {
  constructor(private readonly userPaymentService: UserPaymentService) {}

  @Query(() => [UserComputationFund])
  getUserComputationFund(): Promise<UserComputationFund[]> {
    return this.userPaymentService.getUserComputationFund();
  }

  @Query(() => [UserEducationFundState])
  getUserInternStatus(): Promise<UserEducationFundState[]> {
    return this.userPaymentService.getUserEducationFundState();
  }
}
