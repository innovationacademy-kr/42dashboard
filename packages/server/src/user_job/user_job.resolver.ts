import { Args, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { CheckDuplication } from 'src/user_information/argstype/checkDuplication.argstype';
import {
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  //UserInternStatus,
  UserOtherEmploymentStatus,
} from './entity/user_job.entity';
import { UserJobService } from './user_job.service';

@Resolver()
export class UserJobResolver {
  constructor(private readonly userJobService: UserJobService) {}

  @Query(() => [UserOtherEmploymentStatus])
  async getUserOtherEmploymentStatus(
    @Args() checkDuplication: CheckDuplication,
  ) {
    return this.userJobService.getUserOtherEmploymentStatus(checkDuplication);
  }

  @Query(() => [UserEmploymentStatus])
  async getUserEmploymentStatus(@Args() checkDuplication: CheckDuplication) {
    return this.userJobService.getUserEmploymentStatus(checkDuplication);
  }

  @Query(() => [UserHrdNetUtilizeConsent])
  async getUserHrdNetUtilizeConsent(
    @Args() checkDuplication: CheckDuplication,
  ) {
    return this.userJobService.getUserHrdNetUtilizeConsent(checkDuplication);
  }

  @Query(() => [UserHrdNetUtilize])
  async getUserHrdNetUtilize(@Args() checkDuplication: CheckDuplication) {
    return this.userJobService.getUserHrdNetUtilize(checkDuplication);
  }

  // @Query(() => [UserInternStatus])
  // getUserInternStatus() {
  //   return this.userJobService.getUserInternStatus();
  // }
}
