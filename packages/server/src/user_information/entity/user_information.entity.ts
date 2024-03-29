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
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  UserComputationFund,
  // UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';

//인덱스
//유저
@ObjectType()
@Entity()
export class User {
  @Field((type) => Float)
  @PrimaryColumn({ name: 'intra_no' })
  intra_no: number;

  @Field()
  @Column({ name: 'intra_id', nullable: false, default: 'NOT_EXIST' })
  intra_id: string;

  @Field()
  @Column({ name: 'grade', nullable: false, default: '0기' })
  grade: string;

  @Field()
  @Column({
    name: 'start_process_date',
    nullable: false,
    default: '9999-12-31',
  })
  start_process_date: Date;

  @Field()
  @Column({ name: 'coalition', nullable: true })
  coalition: string;

  @Field()
  @Column({ name: 'academic_state', nullable: false, default: 'BLACK_HOLE' })
  academic_state: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Field()
  @Column({
    name: 'validate_date',
    nullable: false,
    default: '9999-12-31',
  })
  validate_date: Date;

  @Field()
  @Column({
    name: 'expired_date',
    nullable: false,
    default: '9999-12-31',
  })
  expired_date: Date;

  /***********************************
   *               User               *
   ***********************************/

  @OneToMany(
    () => UserPersonalInformation,
    (userPersonalInformation) => userPersonalInformation.user,
    { cascade: true },
  )
  userPersonalInformation: UserPersonalInformation[];

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
  userAccessCardInformation: UserAccessCardInformation[];

  /***********************************
   *               Job               *
   ***********************************/

  @OneToMany(
    () => UserOtherEmploymentStatus,
    (userOtherEmploymentStatus) => userOtherEmploymentStatus.user,
    { cascade: true },
  )
  userOtherEmploymentStatus: UserOtherEmploymentStatus[];

  @OneToMany(
    () => UserHrdNetUtilizeConsent,
    (userHrdNetUtilizeConsent) => userHrdNetUtilizeConsent.user,
    { cascade: true },
  )
  userHrdNetUtilizeConsent: UserHrdNetUtilizeConsent[];

  @OneToMany(
    () => UserHrdNetUtilize,
    (userHrdNetUtilize) => userHrdNetUtilize.user,
    { cascade: true },
  )
  userHrdNetUtilize: UserHrdNetUtilize[];

  @OneToMany(
    () => UserEmploymentStatus,
    (userEmploymentStatus) => userEmploymentStatus.user,
    { cascade: true },
  )
  userEmploymentStatus: UserEmploymentStatus[];

  /***********************************
   *               Payment           *
   ***********************************/

  // @OneToMany(
  //   () => UserEducationFundState,
  //   (userEducationFundState) => userEducationFundState.user,
  //   { cascade: true },
  // )
  // userEducationFundState: UserEducationFundState[];

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
    () => UserLearningDataAPI,
    (userLearningDataAPI) => userLearningDataAPI.user,
    { cascade: true },
  )
  userLearningDataAPI: UserLearningDataAPI[];

  @OneToMany(
    () => UserLoyaltyManagement,
    (userLoyaltyManagement) => userLoyaltyManagement.user,
    { cascade: true },
  )
  userLoyaltyManagement: UserLoyaltyManagement[];

  @OneToMany(
    () => UserCourseExtension,
    (userCourseExtension) => userCourseExtension.user,
    { cascade: true },
  )
  userCourseExtension: UserCourseExtension[];

  @OneToMany(() => UserBlackhole, (userBlackhole) => userBlackhole.user, {
    cascade: true,
  })
  userBlackhole: UserBlackhole[];

  @OneToMany(
    () => UserLeaveOfAbsence,
    (userLeaveOfAbsence) => userLeaveOfAbsence.user,
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
