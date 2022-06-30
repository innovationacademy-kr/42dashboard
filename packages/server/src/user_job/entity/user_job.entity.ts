import { Field, Int, ObjectType } from '@nestjs/graphql';
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

//취창업지원관리
@ObjectType()
@Entity()
export class UserEmploymentAndFound extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: false, defaultValue: 'N' })
  @Column({ name: 'employment', nullable: false, default: 'N' })
  employment: string;

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

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userEmploymentAndFound)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//인턴현황
@ObjectType()
@Entity()
export class UserInternStatus extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({ name: 'start_intern_date', nullable: true })
  start_intern_date: number;

  @Field({ nullable: true })
  @Column({ name: 'end_intern_date', nullable: true })
  end_intern_date: number;

  @Field({ nullable: true })
  @Column({
    name: 'enterprise',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  enterprise: Date;

  @Field({ nullable: true })
  @Column({ name: 'intern_part_of_job', nullable: true })
  intern_part_of_job: number;

  @Field({ nullable: true })
  @Column({ name: 'intern_blackhole', nullable: true })
  intern_blackhole: number;

  @Field({ nullable: true })
  @Column({
    name: 'intern_blackhole_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  intern_blackhole_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'intern_note', nullable: true })
  intern_note: number;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userInternStatus)
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

  @Field({ nullable: false })
  @Column({
    name: 'consent_to_provide_information',
    nullable: false,
    default: 'N',
  })
  consent_to_provide_information: string;

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
  @Column({ name: 'enterprise', nullable: true })
  enterprise: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userHrdNetUtilize)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//기타취업현황
@ObjectType()
@Entity()
export class UserEmploymentStatus extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

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

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userEmploymentStatus)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
