import { Module } from '@nestjs/common';
import { UpdaterService } from './updater.service';
import { UpdaterResolver } from './updater.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import {
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  //UserInternStatus,
  UserOtherEmploymentStatus,
} from 'src/user_job/entity/user_job.entity';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from 'src/user_status/entity/user_status.entity';
import { UpdaterController } from './updater.controller';
import { ApiService } from 'src/api/api.service';
import {
  UserComputationFund,
  // UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';
import { SpreadService } from 'src/spread/spread.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPersonalInformation,
      UserCourseExtension,
      UserLeaveOfAbsence,
      UserBlackhole,
      UserInterruptionOfCourse,
      UserLearningDataAPI,
      UserLoyaltyManagement,
      UserEmploymentStatus,
      UserHrdNetUtilizeConsent,
      UserHrdNetUtilize,
      UserOtherEmploymentStatus,
      // UserEducationFundState,
      UserComputationFund,
      UserAccessCardInformation,
      UserOtherInformation,
      UserLapiscineInformation,
    ]),
  ],
  controllers: [UpdaterController],
  providers: [UpdaterResolver, UpdaterService, ApiService, SpreadService],
})
export class UpdaterModule {}
