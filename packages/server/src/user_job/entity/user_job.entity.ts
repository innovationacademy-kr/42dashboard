import { Field, Int, ObjectType } from '@nestjs/graphql';
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

//기타취업
@ObjectType()
@Entity()
export class UserOtherEmploymentStatus extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({
    name: 'employment_date',
    nullable: false,
    default: '9999-12-31',
  })
  employment_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'enterprise', nullable: true })
  enterprise: string;

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

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userOtherEmploymentStatus)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//인턴현황
// @ObjectType()
// @Entity()
// export class UserInternStatus extends BaseEntity {
//   @Field()
//   @PrimaryGeneratedColumn({ name: 'pk' })
//   pk: number;

//   @Field({ nullable: true })
//   @Column({ name: 'start_intern_date', nullable: true })
//   start_intern_date: number;

//   @Field({ nullable: true })
//   @Column({ name: 'end_intern_date', nullable: true })
//   end_intern_date: number;

//   @Field({ nullable: true })
//   @Column({
//     name: 'enterprise',
//     nullable: false,
//     default: '9999-12-31',
//
//   })
//   enterprise: Date;

//   @Field({ nullable: true })
//   @Column({ name: 'intern_part_of_job', nullable: true })
//   intern_part_of_job: number;

//   @Field({ nullable: false }) //인턴관련 블랙홀지급 여부라서 타입수정
//   @Column({
//     name: 'is_given_blackhole',
//     nullable: false,
//     default: 'N',
//   })
//   is_given_blackhole: string;

//   @Field({ nullable: true }) //지급 일수라 타입 수정함
//   @Column({ name: 'given_blackhole_day', nullable: true })
//   given_blackhole_day: number;

//   @Field({ nullable: true })
//   @Column({ name: 'intern_note', nullable: true })
//   intern_note: number;

//   @Field()
//   @CreateDateColumn({ name: 'created_date' })
//   created_date: Date;

//   @Field()
//   @DeleteDateColumn()
//   deleted_date: Date;

//   @Column({ name: 'fk_user_no', nullable: false })
//   fk_user_no: string;

//   @ManyToOne(() => User, (user) => user.userInternStatus)
//   @JoinColumn({ name: 'fk_user_no' })
//   user: User;
// }

//HRD-net 동의
@ObjectType()
@Entity()
export class UserHrdNetUtilizeConsent extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: false })
  @Column({
    name: 'consent_to_provide_information',
    nullable: false,
    default: 'N',
  })
  consent_to_provide_information: string;

  @Field({ nullable: true })
  @Column({
    name: 'consented_date',
    nullable: false,
    default: '9999-12-31',
  })
  consented_date: Date;

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

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userHrdNetUtilizeConsent)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//HRD-Net 활용
@ObjectType()
@Entity()
export class UserHrdNetUtilize extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({
    name: 'hrd_net_date',
    nullable: false,
    default: '9999-12-31',
  })
  hrd_net_date: Date;

  @Field({ nullable: false, defaultValue: 'N' })
  @Column({ name: 'employmented', nullable: false, default: 'N' })
  employmented: string;

  @Field({ nullable: true })
  @Column({ name: 'business_registration_number', nullable: true })
  business_registration_number: string;

  @Field({ nullable: true })
  @Column({
    name: 'employment_insurance_date',
    nullable: false,
    default: '9999-12-31',
  })
  employment_insurance_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'enterprise_size', nullable: true })
  enterprise_size: string;

  @Field({ nullable: true })
  @Column({ name: 'health_insurance_enterprise', nullable: true })
  health_insurance_enterprise: string;

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

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userHrdNetUtilize)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//취업현황
@ObjectType()
@Entity()
export class UserEmploymentStatus extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: false, defaultValue: '미취업' })
  @Column({ name: 'employmented', nullable: false, default: '미취업' })
  employmented: string;

  @Field({ nullable: true })
  @Column({
    name: 'employment_date',
    nullable: false,
    default: '9999-12-31',
  })
  employment_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'enterprise', nullable: true })
  enterprise: string;

  @Field({ nullable: false })
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

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userEmploymentStatus)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
