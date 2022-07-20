import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user_information/entity/user_information.entity';

//지원금지급현황
@ObjectType()
@Entity()
export class UserEducationFundState extends BaseEntity {
  @Field((type) => Int, { nullable: false })
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field((type) => Int, { nullable: false })
  @Column({ name: 'total_payment_of_number', nullable: false, default: 0 })
  total_payment_of_number: number;

  @Field((type) => Int, { nullable: false })
  @Column({ name: 'total_payment_of_money', nullable: false, default: 0 })
  total_payment_of_money: number;

  @Field({ nullable: true })
  @Column({ name: 'fund_period', nullable: true })
  fund_period: Date;

  @Field((type) => Int, { nullable: true })
  @Column({ name: 'remaining_period_of_fund', nullable: true })
  remaining_period_of_fund: number;

  @Field((type) => Int, { nullable: false })
  @Column({ name: 'total_calculated_month', nullable: false, default: 0 })
  total_calculated_month: number;

  @Field({ nullable: true })
  @Column({ name: 'payment_give_start_date', nullable: true })
  payment_give_start_date: Date;

  @Field((type) => Int, { nullable: true })
  @Column({ name: 'payment_delay_period', nullable: true })
  payment_delay_period: number;

  @Field({ nullable: true })
  @Column({ name: 'payment_give_break_date', nullable: true })
  payment_give_break_date: Date;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @ManyToOne(() => User, (user) => user.userEducationFundState)
  user: User;
}
