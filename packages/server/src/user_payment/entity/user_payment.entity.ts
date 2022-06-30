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

//지원금산정
@ObjectType()
@Entity()
export class UserComputationFund extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: false })
  @Column({ name: 'no_duplicate_collection', nullable: false, default: 'N' })
  no_duplicate_collection: string;

  @Field({ nullable: true })
  @Column({ name: 'reason_of_no_duplicate', nullable: true })
  reason_of_no_duplicate: string;

  @Field({ nullable: false })
  @Column({ name: 'received_fund', nullable: false, default: 'N' })
  majoreceived_fundr_field: string;

  @Field({ nullable: false })
  @Column({ name: 'recevied_grant_amount', nullable: false, default: 0 })
  recevied_grant_amount: number;

  @Field({ nullable: true })
  @Column({
    name: 'payment_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  payment_date: Date;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userComputationFund)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}

//지원금지급현황
@ObjectType()
@Entity()
export class UserEducationFundState extends BaseEntity {
  @Field({ nullable: false })
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: false })
  @Column({ name: 'total_payment_of_number', nullable: false, default: 0 })
  total_payment_of_number: number;

  @Field({ nullable: false })
  @Column({ name: 'total_payment_of_money', nullable: false, default: 0 })
  total_payment_of_money: number;

  @Field({ nullable: true })
  @Column({
    name: 'fund_period',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  fund_period: Date;

  @Field({ nullable: true })
  @Column({ name: 'remaining_period_of_fund', nullable: true })
  remaining_period_of_fund: number;

  @Field({ nullable: false })
  @Column({ name: 'total_calculated_month', nullable: false, default: 0 })
  total_calculated_month: number;

  @Field({ nullable: true })
  @Column({
    name: 'payment_give_start_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  payment_give_start_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'payment_delay_period', nullable: true })
  payment_delay_period: number;

  @Field({ nullable: true })
  @Column({
    name: 'payment_give_break_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  payment_give_break_date: Date;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userEducationFundState)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}