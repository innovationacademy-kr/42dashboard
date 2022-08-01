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

//지원금산정
@ObjectType()
@Entity()
export class UserComputationFund extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field({ nullable: true })
  @Column({
    name: 'payment_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  payment_date: Date;

  @Field({ nullable: false })
  @Column({ name: 'received', nullable: false, default: 'N' })
  received: string;

  @Field({ nullable: false })
  @Column({ name: 'recevied_amount', nullable: false, default: 0 })
  recevied_amount: string;

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

  @Field({ nullable: true })
  @Column({ name: 'total_payment_of_number', nullable: true, default: 0 })
  total_payment_of_number: number;

  @Field({ nullable: true })
  @Column({ name: 'total_payment_of_money', nullable: true, default: 0 })
  total_payment_of_money: string;

  @Field({ nullable: true })
  @Column({
    name: 'payment_end_date',
    nullable: false,
    default: '9999-12-31',
    type: 'date',
  })
  payment_end_date: Date;

  @Field({ nullable: true })
  @Column({ name: 'payment_ended', nullable: true })
  payment_ended: string;

  @Field({ nullable: true })
  @Column({ name: 'uniqueness', nullable: true, default: 0 })
  uniqueness: string;

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

  @ManyToOne(() => User, (user) => user.userEducationFundState)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
