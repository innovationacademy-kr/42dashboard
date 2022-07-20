import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
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
  getUserEmploymentAndFound() {
    return this.userJobService.getUserEmploymentAndFound();
  }

  @Query(() => [UserEmploymentStatus])
  getUserEmploymentStatus() {
    return this.userJobService.getUserEmploymentStatus();
  }

  @Query(() => [UserHrdNetUtilizeConsent])
  getUserHrdNetUtilizeConsent() {
    return this.userJobService.getUserHrdNetUtilizeConsent();
  }

  @Query(() => [UserHrdNetUtilize])
  getUserHrdNetUtilize() {
    return this.userJobService.getUserHrdNetUtilize();
  }

  // @Query(() => [UserInternStatus])
  // getUserInternStatus() {
  //   return this.userJobService.getUserInternStatus();
  // }
}
