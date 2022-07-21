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
    type: 'date',
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

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userOtherEmploymentStatus)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

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
    type: 'date',
  })
  consented_date: Date;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

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
    type: 'date',
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
    type: 'date',
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
  @Column({ name: 'employmented', nullable: false, default: 'N' })
  employment: string;

  @Field({ nullable: true })
  @Column({
    name: 'emplyment_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  emplyment_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'enterprise', nullable: true })
  enterprise: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userEmploymentStatus)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
