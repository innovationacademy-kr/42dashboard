import { Module } from '@nestjs/common';
import { UserInformationController } from './user_information.controller';
import { UserInformationService } from './user_information.service';
import { UserInformationResolver } from './user_information.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { JoinedTable } from './argstype/joinedTable';
import { Filter } from './filter';
<<<<<<< HEAD
import { DataSource } from 'typeorm';
=======
>>>>>>> ce88e66 (fix(yarn    run start를 하면 npm에서는 보지못한 에러가 발생): yarn run error)

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPersonalInformation,
      UserOtherInformation,
      UserAccessCardInformation,
<<<<<<< HEAD
      DataSource,
=======
>>>>>>> ce88e66 (fix(yarn    run start를 하면 npm에서는 보지못한 에러가 발생): yarn run error)
    ]),
  ],
  controllers: [UserInformationController],
  providers: [UserInformationService, UserInformationResolver],
})
export class UserInformationModule {}
