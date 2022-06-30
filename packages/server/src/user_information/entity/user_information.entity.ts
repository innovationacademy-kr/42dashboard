import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  UserBlackhole,
  UserLapiscineInformation,
  UserLearningData,
  UserLeaveOfAbsence,
  UserProcessProgress,
  UserReasonOfBreak,
} from '../../user_status/entity/user_status.entity';
import {
  UserEmploymentAndFound,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserInternStatus,
} from '../../user_job/entity/user_job.entity';

import { UserPersonalInformation } from './user_personal_information.entity';
import { UserAccessCardInformation } from './user_access_card_information.entity';
import { UserOtherInformation } from './user_other_information.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserComputationFund } from 'src/user_payment/entity/user_computation_fund.entity';
import { UserEducationFundState } from 'src/user_payment/entity/user_education_fund_state.entity';

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

  // @Field()
  // vailidated_date;

  // @Field()
  // expired_date;

  /***********************************
   *               User               *
   ***********************************/

  // @Field()
  @OneToOne(
    () => UserPersonalInformation,
    (userPersonalInformation) => userPersonalInformation.user,
  )
  @JoinTable()
  userPersonalInformation: UserPersonalInformation;

  // @Field(()=>UserAccessCardInformation)
  @OneToOne(
    () => UserAccessCardInformation,
    (userAccessCardInformation) => userAccessCardInformation.user,
  )
  @JoinTable()
  userAccessCardInformation: UserAccessCardInformation;

  // @Field((type) => [UserOtherInformation])
  @OneToMany(
    () => UserOtherInformation,
    (userOtherInformation) => userOtherInformation.user,
  )
  userOtherInformation: UserOtherInformation[];

  /***********************************
   *             Academic             *
   ***********************************/

  // @Field((type) => [UserLearningData])
  @OneToMany(
    () => UserLearningData,
    (userLearningDate) => userLearningDate.user,
  )
  userLearningDate: UserLearningData[];

  // @Field((type) => [UserProcessProgress])
  @OneToMany(
    () => UserProcessProgress,
    (userProcessProgress) => userProcessProgress.user,
  )
  userProcessProgress: UserProcessProgress[];

  // @Field((type) => [UserBlackhole])
  @OneToMany(() => UserBlackhole, (userBlackhole) => userBlackhole.user)
  userBlackhole: UserBlackhole[];

  // @Field((type) => [UserLeaveOfAbsence])
  @OneToMany(
    () => UserLeaveOfAbsence,
    (userLeaveOfAbsence) => userLeaveOfAbsence.user,
  )
  userLeaveOfAbsence: UserLeaveOfAbsence[];

  // @Field((type) => [UserReasonOfBreak])
  @OneToMany(
    () => UserReasonOfBreak,
    (userReasonOfBreak) => userReasonOfBreak.user,
  )
  userReasonOfBreak: UserReasonOfBreak[];

  // @Field((type) => [UserLapiscineInformation])
  @OneToMany(
    () => UserLapiscineInformation,
    (userLapiscineInformation) => userLapiscineInformation.user,
  )
  userLapiscineInformation: UserLapiscineInformation[];

  /***********************************
   *               Fund               *
   ***********************************/

  // @Field((type) => [UserComputationFund])
  @OneToMany(
    () => UserComputationFund,
    (userComputationFund) => userComputationFund.user,
  )
  userComputationFund: UserComputationFund[];

  // @Field((type) => [UserEducationFundState])
  @OneToMany(
    () => UserEducationFundState,
    (userEducationFundState) => userEducationFundState.user,
  )
  userEducationFundState: UserEducationFundState[];

  /***********************************
   *              employ              *
   ***********************************/

  // @Field((type) => [UserEmploymentAndFound])
  @OneToMany(
    () => UserEmploymentAndFound,
    (UserEmploymentAndFound) => UserEmploymentAndFound.user,
  )
  userEmploymentAndFound: UserEmploymentAndFound[];

  // @Field((type) => [UserInternStatus])
  @OneToMany(
    () => UserInternStatus,
    (userInternStatus) => userInternStatus.user,
  )
  userInternStatus: UserInternStatus[];

  // @Field((type) => [UserHrdNetUtilize])
  @OneToMany(
    () => UserHrdNetUtilize,
    (userHrdNetUtilize) => userHrdNetUtilize.user,
  )
  userHrdNetUtilize: UserHrdNetUtilize[];

  // @Field((type) => [UserEmploymentStatus])
  @OneToMany(
    () => UserEmploymentStatus,
    (userEmploymentStatus) => userEmploymentStatus.user,
  )
  userEmploymentStatus: UserEmploymentStatus[];
}

// //개인정보관리
// @Entity()
// export class UserPersonalInformation extends BaseEntity {

//     @Column({name: "region", nullable: true })
//     region: string;

//     @Column({name: "gender", nullable: true })
//     gender: string;

//     @Column({name: "birthday", nullable: true})
//     birthday: string;

//     @Column({name: "phone_number", nullable: true })
//     phone_number: Date;

//     @Column({name: "email", nullable: true })
//     email: string;

//     @Column({name: "created_date", nullable: false })
//     created_date: Date;

//     @OneToOne(() => User, user => user.intra_no)
//     user: User;
// }

// //기타정보
// @Entity()
// export class UserOtherInformation extends BaseEntity {
//     @PrimaryGeneratedColumn({name: "pk"})
//     pk: number

//     @Column({name: "highest_level_of_education", nullable: true })
//     highest_level_of_education: string;

//     @Column({name: "major", nullable: false, default: "비전공" })
//     major: string;

//     @Column({name: "major_field", nullable: true})
//     major_field: string;

//     @Column({name: "major_name", nullable: true })
//     major_name: Date;

//     @Column({name: "period_of_software_learning", nullable: true })
//     period_of_software_learning: string;

//     @Column({name: "experience_of_software_developing", nullable: true })
//     experience_of_software_developing: Date;

//     @Column({name: "created_date", nullable: false })
//     created_date: Date;

//     @ManyToOne(() => User, user => user.intra_no)
//     user: User;
// }

// //출입카드정보
// @Entity()
// export class UserAccessCardInformation extends BaseEntity {

//     @Column({name: "profile_picture", nullable: true })
//     profile_picture: string;

//     @Column({name: "lapiscine_access_card_number_of_physical", nullable: true })
//     lapiscine_access_card_number_of_physical: number;

//     @Column({name: "lapiscine_access_card_number_of_logical", nullable: true})
//     lapiscine_access_card_number_of_logical: number;

//     @Column({name: "logical_number_of_access_card_for_this_course", nullable: true })
//     logical_number_of_access_card_for_this_course: number;

//     @Column({name: "name_of_entry_card_for_this_course", nullable: true })
//     name_of_entry_card_for_this_course: string;

//     @Column({name: "created_date", nullable: false })
//     created_date: Date;

//     @OneToOne(() => User, user => user.intra_no)
//     user: User;
// }
