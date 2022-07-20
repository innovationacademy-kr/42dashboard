import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from '../../user_status/entity/user_status.entity';
import {
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  //UserInternStatus,
  UserOtherEmploymentStatus,
} from '../../user_job/entity/user_job.entity';

import { UserPersonalInformation } from './user_personal_information.entity';
import { UserAccessCardInformation } from './user_access_card_information.entity';
import { UserOtherInformation } from './user_other_information.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  UserComputationFund,
  UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';

//인덱스
//유저
@ObjectType()
@Entity()
export class User {
  @Field((type) => Int)
  @PrimaryColumn({ name: 'intra_no' })
  intra_no: number;

  @Field()
  @Column({ name: 'intra_id', nullable: false, default: 'NOT_EXIST' })
  intra_id: string;

  @Field()
  @Column({ name: 'name', nullable: false, default: 'NO_NAME' })
  name: string;

  @Field()
  @Column({ name: 'grade', nullable: false, default: '0기' })
  grade: string;

  // @Field()
  @Column({
    name: 'start_process',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  start_process: Date;

  @Field()
  @Column({ name: 'academic_state', nullable: false, default: 'BLACK_HOLE' })
  academic_state: string;

  @Field()
  @Column({ name: 'coalition', nullable: true })
  coalition: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  // @Field()
  // vailidated_date;

  // @Field()
  // expired_date;

  /***********************************
   *               User               *
   ***********************************/

  @OneToMany(
    () => UserPersonalInformation,
    (userPersonalInformation) => userPersonalInformation.user,
    { cascade: true },
  )
  userPersonalInformation: UserPersonalInformation;

<<<<<<< HEAD
=======
  // @Field(()=>UserAccessCardInformation)
  @OneToOne(
    () => UserAccessCardInformation,
    (userAccessCardInformation) => userAccessCardInformation.user,
    { cascade: true },
  )
  userAccessCardInformation: UserAccessCardInformation;

  // @Field((type) => [UserOtherInformation])
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
  @OneToMany(
    () => UserOtherInformation,
    (userOtherInformation) => userOtherInformation.user,
    { cascade: true },
  )
  userOtherInformation: UserOtherInformation[];

  @OneToMany(
    () => UserAccessCardInformation,
    (userAccessCardInformation) => userAccessCardInformation.user,
    { cascade: true },
  )
  userAccessCardInformation: UserAccessCardInformation;

  /***********************************
   *               Job               *
   ***********************************/

  @OneToMany(
<<<<<<< HEAD
    () => UserOtherEmploymentStatus,
    (userOtherEmploymentStatus) => userOtherEmploymentStatus.user,
=======
    () => UserLearningData,
    (userLearningDate) => userLearningDate.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userOtherEmploymentStatus: UserOtherEmploymentStatus[];

  @OneToMany(
<<<<<<< HEAD
    () => UserHrdNetUtilizeConsent,
    (userHrdNetUtilizeConsent) => userHrdNetUtilizeConsent.user,
=======
    () => UserProcessProgress,
    (userProcessProgress) => userProcessProgress.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userHrdNetUtilizeConsent: UserHrdNetUtilizeConsent[];

<<<<<<< HEAD
  @OneToMany(
    () => UserHrdNetUtilize,
    (userHrdNetUtilize) => userHrdNetUtilize.user,
=======
  // @Field((type) => [UserBlackhole])
  @OneToMany(() => UserBlackhole, (userBlackhole) => userBlackhole.user, {
    cascade: true,
  })
  userBlackhole: UserBlackhole[];

  // @Field((type) => [UserLeaveOfAbsence])
  @OneToMany(
    () => UserLeaveOfAbsence,
    (userLeaveOfAbsence) => userLeaveOfAbsence.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userHrdNetUtilize: UserHrdNetUtilize[];

  @OneToMany(
<<<<<<< HEAD
    () => UserEmploymentStatus,
    (userEmploymentStatus) => userEmploymentStatus.user,
=======
    () => UserReasonOfBreak,
    (userReasonOfBreak) => userReasonOfBreak.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userEmploymentStatus: UserEmploymentStatus[];

<<<<<<< HEAD
  // @OneToMany(
  //   //사용미정
  //   () => UserInternStatus,
  //   (userInternStatus) => userInternStatus.user,
  //   { cascade: true },
  // )
  // userInternStatus: UserInternStatus[];
=======
  // @Field((type) => [UserLapiscineInformation])
  @OneToMany(
    () => UserLapiscineInformation,
    (userLapiscineInformation) => userLapiscineInformation.user,
    { cascade: true },
  )
  userLapiscineInformation: UserLapiscineInformation[];
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7

  /***********************************
   *               Payment           *
   ***********************************/

<<<<<<< HEAD
=======
  // @Field((type) => [UserComputationFund])
  @OneToMany(
    () => UserComputationFund,
    (userComputationFund) => userComputationFund.user,
    { cascade: true },
  )
  userComputationFund: UserComputationFund[];

  // @Field((type) => [UserEducationFundState])
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
  @OneToMany(
    () => UserEducationFundState,
    (userEducationFundState) => userEducationFundState.user,
    { cascade: true },
  )
  userEducationFundState: UserEducationFundState[];

  @OneToMany(
    () => UserComputationFund,
    (userComputationFund) => userComputationFund.user,
    { cascade: true },
  )
  userComputationFund: UserComputationFund[];

  /***********************************
   *               Status            *
   ***********************************/

  @OneToMany(
<<<<<<< HEAD
    () => UserLearningDataAPI,
    (userLearningDataAPI) => userLearningDataAPI.user,
=======
    () => UserEmploymentAndFound,
    (UserEmploymentAndFound) => UserEmploymentAndFound.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userLearningDataAPI: UserLearningDataAPI[];

  @OneToMany(
<<<<<<< HEAD
    () => UserLoyaltyManagement,
    (userLoyaltyManagement) => userLoyaltyManagement.user,
=======
    () => UserInternStatus,
    (userInternStatus) => userInternStatus.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userLoyaltyManagement: UserLoyaltyManagement[];

  @OneToMany(
<<<<<<< HEAD
    () => UserCourseExtension,
    (userCourseExtension) => userCourseExtension.user,
=======
    () => UserHrdNetUtilize,
    (userHrdNetUtilize) => userHrdNetUtilize.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userCourseExtension: UserCourseExtension[];

  @OneToMany(() => UserBlackhole, (userBlackhole) => userBlackhole.user, {
    cascade: true,
  })
  userBlackhole: UserBlackhole[];

  @OneToMany(
<<<<<<< HEAD
    () => UserLeaveOfAbsence,
    (userLeaveOfAbsence) => userLeaveOfAbsence.user,
=======
    () => UserEmploymentStatus,
    (userEmploymentStatus) => userEmploymentStatus.user,
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
    { cascade: true },
  )
  userLeaveOfAbsence: UserLeaveOfAbsence[];

  @OneToMany(
    () => UserInterruptionOfCourse,
    (userInterruptionOfCourse) => userInterruptionOfCourse.user,
    { cascade: true },
  )
  userInterruptionOfCourse: UserInterruptionOfCourse[];

  @OneToMany(
    () => UserLapiscineInformation,
    (userLapiscineInformation) => userLapiscineInformation.user,
    { cascade: true },
  )
  userLapiscineInformation: UserLapiscineInformation[];
}
