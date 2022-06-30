import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import {
  UserEmploymentAndFound,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserInternStatus,
} from './entity/user_job.entity';
import { UserJobService } from './user_job.service';

@Resolver()
export class UserJobResolver {
  constructor(private readonly userJobService: UserJobService) {}

  @Query(() => [UserEmploymentAndFound])
  getUserEmploymentAndFound() {
    return this.userJobService.getUserEmploymentAndFound();
  }

  @Query(() => [UserEmploymentStatus])
  getUserEmploymentStatus() {
    return this.userJobService.getUserEmploymentStatus();
  }

  @Query(() => [UserHrdNetUtilize])
  getUserHrdNetUtilize() {
    return this.userJobService.getUserHrdNetUtilize();
  }

  @Query(() => [UserInternStatus])
  getUserInternStatus() {
    return this.userJobService.getUserInternStatus();
  }
}
