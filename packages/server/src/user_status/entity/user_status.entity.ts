import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user_information/entity/user_information.entity';
//!!하나의 파일에 하나의 엔터티? -> 컨벤션을 정할것!
//목적에 따라 하나의 파일에 넣을수도...

//학습데이터
@ObjectType()
@Entity()
export class UserLearningData extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: false, defaultValue: 0 })
  @Column({ name: 'coalition_score', nullable: false, default: 0 })
  coalition_score: number;

  @Field({ nullable: false, defaultValue: 'N' })
  @Column({ name: 'out_circle', nullable: false, default: 'N' })
  out_circle: string;

  @Field({ nullable: true })
  @Column({
    name: 'out_circle_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  out_circle_date: Date;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userLearningDate)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//과정진행여부
@ObjectType()
@Entity()
export class UserProcessProgress extends BaseEntity {
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

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userProcessProgress)
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
  @Column({ name: 'remaining_period', nullable: true })
  remaining_period: number;

  @Field({ nullable: false, defaultValue: '9999-12-31' })
  @Column({
    name: 'blackhole_time',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  blackhole_time: Date;

  @Field({ nullable: true })
  @Column({ name: 'reason_of_blackhole', nullable: true })
  reason_of_blackhole: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
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
  @Column({
    name: 'start_absence_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  start_absence_date: Date;

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

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userLeaveOfAbsence)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
//과정중단
@ObjectType()
@Entity()
export class UserReasonOfBreak extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({ name: 'date_of_break', nullable: true })
  date_of_break: number;

  @Field({ nullable: false, defaultValue: '9999-12-31' })
  @Column({
    name: 'reason_of_break',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  reason_of_break: Date;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userReasonOfBreak)
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

  @Field({ nullable: false, defaultValue: '0' })
  @Column({ name: 'lapiscine_degree', nullable: false, default: '0' })
  lapiscine_degree: string;

  @Field({ nullable: true })
  @Column({ name: 'participate_lapicin', nullable: true })
  participate_lapicin: string;

  @Field({ nullable: true })
  @Column({ name: 'number_of_rapicin_participation', nullable: true })
  number_of_rapicin_participation: string;

  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userLapiscineInformation)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
