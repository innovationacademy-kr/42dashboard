import { Int, Mutation, Query } from '@nestjs/graphql';
import { Args, Resolver } from '@nestjs/graphql';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import { DataSource, Not, QueryResult } from 'typeorm';
import { FilterArgs } from './argstype/filter.argstype';
import { GetUserOtherInformationArgs } from './argstype/userOtherInformation.argstype';
import { Filter } from './filter';
import { JoinedTable } from './argstype/joinedTable';
import { UserInformationService } from './user_information.service';
import { CudDto } from './argstype/cudDto.argstype';
import { InjectDataSource } from '@nestjs/typeorm';
import { CheckDuplication } from './argstype/checkDuplication.argstype';

@Resolver() //graphql에서 controler가 resolver
export class UserInformationResolver {
  constructor(private readonly userService: UserInformationService) {}

  @Query(() => [JoinedTable])
  async tempFunction() {
    return await this.tempFunction();
  }

  @Query(() => [User])
  async getUser(@Args() checkDuplication: CheckDuplication) {
    return await this.userService.getUser(checkDuplication);
  }

  @Query(() => [UserPersonalInformation])
  async getUserPersonalInformation(@Args() checkDuplication: CheckDuplication) {
    return this.userService.getUserPersonalInformation(checkDuplication);
  }

  @Query(() => [UserOtherInformation])
  async getUserOtherInformation(@Args() checkDuplication: CheckDuplication) {
    return await this.userService.getUserOtherInformation(checkDuplication);
  }

  @Query(() => [UserAccessCardInformation])
  async getUserAccessCardInformation(
    @Args() checkDuplication: CheckDuplication,
  ) {
    return await this.userService.getUserAccessCardInformation(
      checkDuplication,
    );
  }

  @Query(() => [JoinedTable])
  async getPeopleByFilter(@Args() filterArg: FilterArgs) {
    return await this.userService.getPeopleByFiter(filterArg);
  }

  @Query(() => Int)
  async getNumOfPeopleByFilter(@Args() filterArg: FilterArgs) {
    return await this.userService.getNumOfPeopleByFilter(filterArg);
  }

  @Query(() => [JoinedTable])
  async getDomainOfColumnFilter(@Args() filterArg: FilterArgs) {
    return await this.userService.getDomainOfColumnFilter(filterArg);
  }

  //관리자를 위한 쿼리문
  //나중에 가드설정할때 다른 컨트롤러와는 다른 가드설정해줘야함(role = MASTER || ADMIN 만 통과하게)
  //아래 Mutation도 관리자 가드 설정해줘야함
  @Query(() => [JoinedTable])
  async getPeopleByFilterForAdmin(@Args() filterArgs: FilterArgs) {
    return await this.userService.getPeopleByFilterForAdmin(filterArgs);
  }

  // [intra_no], [entityName, pk, column, value]
  // pk 대신에 created_date를 주는게 나을수도?
  @Mutation(() => Boolean)
  async updateUserInformation(@Args() cudDto: CudDto) {
    return this.userService.updateUserInformation(cudDto);
  }

  // [Filter 배열], [entityName, column, value]
  // @Mutation(() => Boolean)
  // updateManyUsersInformation() {}

  // softDelete 사용할 예정
  // [intra_no], [entityName, pk, column, value]
  @Mutation(() => Boolean)
  async deleteUserInformation(@Args() cudDto: CudDto) {
    return await this.userService.deleteUserInformation(cudDto);
  }

  // softDelete 사용할 예정
  // @Mutation(() => Boolean)
  // deleteManyUsersInformation() {}

  // softDelte 된 것을 recover
  // [intra_no], [entityName, pk, column, value]
  @Mutation(() => Boolean)
  async recoverUserInformaiton(@Args() cudDto: CudDto) {
    return await this.userService.recoverUserInformaiton(cudDto);
  }

  @Mutation(() => [JoinedTable])
  async softDeleteRemoveWithdrawTest(@Args() cudDto: CudDto) {
    return await this.userService.softDeleteRemoveWithdrawTest(cudDto);
  }
}
