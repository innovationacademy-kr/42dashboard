import { Int, Query } from '@nestjs/graphql';
import { Args, Resolver } from '@nestjs/graphql';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import { QueryResult } from 'typeorm';
import { FilterArgs } from './argstype/filter.argstype';
import { GetUserOtherInformationArgs } from './argstype/userOtherInformation.argstype';
import { Filter } from './filter';
import { JoinedTable } from './argstype/joinedTable';
import { UserInformationService } from './user_information.service';

@Resolver() //graphql에서 controler가 resolver
export class UserInformationResolver {
  constructor(private readonly userService: UserInformationService) {}

  @Query(() => [User])
  getUsers(@Args() arg: Filter) {
    return this.userService.querySampel();
  }

  @Query(() => [User])
  getUserById() {
    return this.userService.querySampel();
  }
  @Query(() => [UserPersonalInformation])
  getUserPersonalInformation() {
    return this.userService.getUserPersonalInformation();
  }

  @Query(() => [UserOtherInformation])
  getUserOtherInformation(@Args() args: GetUserOtherInformationArgs) {
    return this.userService.getUserOtherInformation();
  }

  @Query(() => [UserAccessCardInformation])
  getUserAccessCardInformation() {
    return this.userService.getUserAccessCardInformation();
  }

  // @Query(() => [JoinedTable])
  // getNumofPeopleByFilterBeforeJson(@Args() filterArg: FilterArgs) {
  //   // console.log(filterArg);
  //   // return;
  //   return this.userService.processFilters(filterArg.filters['realFilters']);
  // }

  // @Query(() => [JoinedTable])
  // getFilter(@Args() filterArg: Filter[]) {
  //   return this.userService.processFilters(filterArg);
  // }

  @Query(() => [JoinedTable])
  getPeopleByFilter(@Args() filterArg: FilterArgs) {
    return this.userService.getPeopleByFiter(filterArg.filters);
  }

  @Query(() => Int)
  getNumOfPeopleByFilter(@Args() filterArg: FilterArgs) {
    return this.userService.getNumOfPeopleByFilter(filterArg.filters);
  }
}
