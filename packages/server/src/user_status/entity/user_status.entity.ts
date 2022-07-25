import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user_information/entity/user_information.entity';
//!!하나의 파일에 하나의 엔터티? -> 컨벤션을 정할것!
//목적에 따라 하나의 파일에 넣을수도...

//학습데이터api
@ObjectType()
@Entity()
export class UserLearningDataAPI extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true, defaultValue: 0 }) //특정 데이터 때문에 널 허용중
  @Column({ name: 'coalition_score', nullable: true, default: 0 })
  coalition_score: number;

  @Field({ nullable: true })
  @Column({
    name: 'scored_date',
    nullable: true,
    default: '9999-12-31',
    type: 'date',
  })
  scored_date: Date;

  @Field({ nullable: true, defaultValue: 0 }) //특정 데이터 때문에 널 허용중
  @Column({ name: 'circle', nullable: true, default: 0 })
  circle: number;

  @Field({ nullable: true })
  @Column({
    name: 'circle_date',
    nullable: true,
    default: '9999-12-31',
    type: 'date',
  })
  circled_date: Date;

  @Field({ nullable: true, defaultValue: 0 })
  @Column({
    type: 'float',
    name: 'level',
    nullable: true,
    default: 0,
  })
  level: number;

  @Field({ nullable: true })
  @Column({
    name: 'level_date',
    nullable: true,
    default: '9999-12-31',
    type: 'date',
  })
  leveled_date: Date;

  @Field({ nullable: true, defaultValue: 'N' })
  @Column({ name: 'outcircle', nullable: true, default: 'N' })
  outcircle: string;

  @Field({ nullable: true })
  @Column({
    name: 'outcircled_date',
    nullable: true,
    default: '9999-12-31',
    type: 'date',
  })
  outcircled_date: Date;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Field()
  @CreateDateColumn({ name: 'validate_date', nullable: false }) //, default: '9999-12-31'
  validate_date: Date;

  @Field()
  @Column({
    name: 'expired_date',
    nullable: true,
  })
  expired_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userLearningDataAPI)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

@ObjectType()
@Entity()
export class UserLoyaltyManagement extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true, defaultValue: 0 }) //특정 데이터 때문에 널 허용중
  @Column({ name: 'loyalty_period', nullable: true, default: 0 })
  loyalty_period: string;

  @Field({ nullable: true, defaultValue: 0 }) //특정 데이터 때문에 널 허용중
  @Column({ name: 'loyalty_presence', nullable: true, default: 0 })
  loyalty_presence: string;

  @Field({ nullable: true, defaultValue: 'N' })
  @Column({ name: 'loyalty_circle', nullable: true, default: 'N' })
  loyalty_circle: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userLoyaltyManagement)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//과정진행여부
@ObjectType()
@Entity()
export class UserCourseExtension extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: false, defaultValue: '9999-12-31' })
  @Column({
    name: 'basic_expiration_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  basic_expiration_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'request_extension', nullable: true })
  request_extension: string;

  @Field({ nullable: false, defaultValue: '9999-12-31' })
  @Column({
    name: 'final_expiration_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  final_expiration_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'extension_level', nullable: true })
  extension_level: string;

  @Field({ nullable: true })
  @Column({ name: 'extension_circle', nullable: true })
  extension_circle: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Field()
  @CreateDateColumn({
    name: 'validate_date',
    nullable: false,
  })
  validate_date: Date;

  @Field()
  @Column({
    name: 'expired_date',
    nullable: true,
  })
  expired_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userCourseExtension)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//블랙홀
@ObjectType()
@Entity()
export class UserBlackhole extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({ name: 'blackholed', nullable: true })
  blackholed: string;

  @Field({ nullable: false, defaultValue: '9999-12-31' })
  @Column({
    name: 'blackhole_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  blackhole_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'reason_of_blackhole', nullable: true })
  reason_of_blackhole: string;

  @Field({ nullable: true, defaultValue: 0 })
  @Column({
    type: 'float',
    name: 'blackholed_level',
    nullable: true,
    default: 0,
  })
  blackholed_level: number;

  @Field({ nullable: true })
  @Column({ name: 'remarks', nullable: true })
  remarks: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Field()
  @CreateDateColumn({
    name: 'validate_date',
    nullable: false,
  })
  validate_date: Date;

  @Field()
  @Column({
    name: 'expired_date',
    nullable: true,
  })
  expired_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userBlackhole)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//휴학
@ObjectType()
@Entity()
export class UserLeaveOfAbsence extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({ name: 'absenced', nullable: true })
  absenced: string;

  @Field({ nullable: true })
  @Column({
    name: 'begin_absence_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  begin_absence_date: Date;

  @Field({ nullable: true })
  @Column({
    name: 'end_absence_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  end_absence_date: Date;

  @Field({ nullable: true })
  @Column({
    name: 'return_from_absence_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  return_from_absence_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'absence_reason', nullable: true })
  absence_reason: string;

  @Field({ nullable: true })
  @Column({ name: 'AGU_reason', nullable: true })
  AGU_reason: string;

  @Field({ nullable: true })
  @Column({ name: 'uniqueness', nullable: true })
  uniqueness: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Field()
  @CreateDateColumn({
    name: 'validate_date',
    nullable: false,
  })
  validate_date: Date;

  @Field()
  @Column({
    name: 'expired_date',
    nullable: true,
  })
  expired_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userLeaveOfAbsence)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//과정중단
@ObjectType()
@Entity()
export class UserInterruptionOfCourse extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({ name: 'breaked', nullable: true })
  breaked: string;

  @Field({ nullable: false, defaultValue: '9999-12-31' })
  @Column({
    name: 'break_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  break_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'reason_of_break', nullable: true })
  reason_of_break: string;

  @Field({ nullable: true })
  @Column({ name: 'HRD_Net_drop_out', nullable: true })
  HRD_Net_drop_out: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Field()
  @CreateDateColumn({
    name: 'validate_date',
    nullable: false,
  })
  validate_date: Date;

  @Field()
  @Column({
    name: 'expired_date',
    nullable: true,
  })
  expired_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userInterruptionOfCourse)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
//라피신정보관리
@ObjectType()
@Entity()
export class UserLapiscineInformation extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({ name: 'lapiscine_grade', nullable: true })
  lapiscine_grade: string;

  @Field({ nullable: true })
  @Column({ name: 'lapiscine_degree', nullable: true })
  lapiscine_degree: string;

  @Field({ nullable: true })
  @Column({ name: 'record_participate_lapiscine', nullable: true })
  record_participate_lapiscine: string;

  @Field({ nullable: true, defaultValue: 0 })
  @Column({
    type: 'float',
    name: 'lapiscine_final_score',
    nullable: true,
    default: 0,
  })
  lapiscine_final_score: number;

  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Field()
  @CreateDateColumn({
    name: 'validate_date',
    nullable: false,
  })
  validate_date: Date;

  @Field()
  @Column({
    name: 'expired_date',
    nullable: true,
  })
  expired_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userLapiscineInformation)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
