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

//취창업지원관리
@ObjectType()
@Entity()
export class UserEmploymentAndFound extends BaseEntity {
  @Field()
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

  @Field({ nullable: false }) //HRD에서 옮겨옴
  @Column({
    name: 'consent_to_provide_information',
    nullable: false,
    default: 'N',
  })
  consent_to_provide_information: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userEmploymentAndFound, {
    createForeignKeyConstraints: false, //외래키 제약조건 해제
    nullable: false,
  })
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

  @Field({ nullable: false }) //인턴관련 블랙홀지급 여부라서 타입수정
  @Column({
    name: 'is_given_blackhole',
    nullable: false,
    default: 'N',
  })
  is_given_blackhole: string;

  @Field({ nullable: true }) //지급 일수라 타입 수정함
  @Column({ name: 'given_blackhole_day', nullable: true })
  given_blackhole_day: number;

  @Field({ nullable: true })
  @Column({ name: 'intern_note', nullable: true })
  intern_note: number;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userInternStatus, {
    createForeignKeyConstraints: false, //외래키 제약조건 해제
    nullable: false,
  })
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

  @Field({ nullable: false }) //현재 userEmploymentAndFound와 중복됨.
  @Column({
    name: 'consent_to_provide_information',
    nullable: false,
    default: 'N',
  })
  consent_to_provide_information: string;

  @Field({ nullable: false, defaultValue: 'N' }) //UserEmploymentAndFound 에서 옮겨옴
  @Column({ name: 'employment', nullable: false, default: 'N' })
  employment: string;

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

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userHrdNetUtilize, {
    createForeignKeyConstraints: false, //외래키 제약조건 해제
    nullable: false,
  })
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
  @Column({ name: 'enterprise_size', nullable: true })
  enterprise_size: string; //구글하위시트에 있음... 추가

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

  @ManyToOne(() => User, (user) => user.userEmploymentStatus, {
    createForeignKeyConstraints: false, //외래키 제약조건 해제
    nullable: false,
  })
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
