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

  // @Field()
  @OneToOne(
    () => UserPersonalInformation,
    (userPersonalInformation) => userPersonalInformation.user,
    { cascade: true },
  )
  userPersonalInformation: UserPersonalInformation;

  // @Field(()=>UserAccessCardInformation)
  @OneToOne(
    () => UserAccessCardInformation,
    (userAccessCardInformation) => userAccessCardInformation.user,
    { cascade: true },
  )
  userAccessCardInformation: UserAccessCardInformation;

  // @Field((type) => [UserOtherInformation])
  @OneToMany(
    () => UserOtherInformation,
    (userOtherInformation) => userOtherInformation.user,
    { cascade: true },
  )
  userOtherInformation: UserOtherInformation[];

  /***********************************
   *             Academic             *
   ***********************************/

  // @Field((type) => [UserLearningData])
  @OneToMany(
    () => UserLearningData,
    (userLearningDate) => userLearningDate.user,
    { cascade: true },
  )
  userLearningDate: UserLearningData[];

  // @Field((type) => [UserProcessProgress])
  @OneToMany(
    () => UserProcessProgress,
    (userProcessProgress) => userProcessProgress.user,
    { cascade: true },
  )
  userProcessProgress: UserProcessProgress[];

  // @Field((type) => [UserBlackhole])
  @OneToMany(() => UserBlackhole, (userBlackhole) => userBlackhole.user, {
    cascade: true,
  })
  userBlackhole: UserBlackhole[];

  // @Field((type) => [UserLeaveOfAbsence])
  @OneToMany(
    () => UserLeaveOfAbsence,
    (userLeaveOfAbsence) => userLeaveOfAbsence.user,
    { cascade: true },
  )
  userLeaveOfAbsence: UserLeaveOfAbsence[];

  // @Field((type) => [UserReasonOfBreak])
  @OneToMany(
    () => UserReasonOfBreak,
    (userReasonOfBreak) => userReasonOfBreak.user,
    { cascade: true },
  )
  userReasonOfBreak: UserReasonOfBreak[];

  // @Field((type) => [UserLapiscineInformation])
  @OneToMany(
    () => UserLapiscineInformation,
    (userLapiscineInformation) => userLapiscineInformation.user,
    { cascade: true },
  )
  userLapiscineInformation: UserLapiscineInformation[];

  /***********************************
   *               Fund               *
   ***********************************/

  // @Field((type) => [UserComputationFund])
  @OneToMany(
    () => UserComputationFund,
    (userComputationFund) => userComputationFund.user,
    { cascade: true },
  )
  userComputationFund: UserComputationFund[];

  // @Field((type) => [UserEducationFundState])
  @OneToMany(
    () => UserEducationFundState,
    (userEducationFundState) => userEducationFundState.user,
    { cascade: true },
  )
  userEducationFundState: UserEducationFundState[];

  /***********************************
   *              employ              *
   ***********************************/

  // @Field((type) => [UserEmploymentAndFound])
  @OneToMany(
    () => UserEmploymentAndFound,
    (UserEmploymentAndFound) => UserEmploymentAndFound.user,
    { cascade: true },
  )
  userEmploymentAndFound: UserEmploymentAndFound[];

  // @Field((type) => [UserInternStatus])
  @OneToMany(
    () => UserInternStatus,
    (userInternStatus) => userInternStatus.user,
    { cascade: true },
  )
  userInternStatus: UserInternStatus[];

  // @Field((type) => [UserHrdNetUtilize])
  @OneToMany(
    () => UserHrdNetUtilize,
    (userHrdNetUtilize) => userHrdNetUtilize.user,
    { cascade: true },
  )
  userHrdNetUtilize: UserHrdNetUtilize[];

  // @Field((type) => [UserEmploymentStatus])
  @OneToMany(
    () => UserEmploymentStatus,
    (userEmploymentStatus) => userEmploymentStatus.user,
    { cascade: true },
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

//     @Column({name: "lapiscine_physical_number", nullable: true })
//     lapiscine_physical_number: number;

//     @Column({name: "lapiscine_logical_number", nullable: true})
//     lapiscine_logical_number: number;

//     @Column({name: "logical_number_for_main_course", nullable: true })
//     logical_number_for_main_course: number;

//     @Column({name: "name_of_entry_card_for_main_course", nullable: true })
//     name_of_entry_card_for_main_course: string;

//     @Column({name: "created_date", nullable: false })
//     created_date: Date;

//     @OneToOne(() => User, user => user.intra_no)
//     user: User;
// }
