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
  })
  payment_date: Date;

  @Field({ nullable: false })
  @Column({ name: 'received', nullable: false, default: 'N' })
  received: string;

  @Field({ nullable: false })
  @Column({ name: 'recevied_amount', nullable: false, default: 0 })
  recevied_amount: number;

  //스프레드에서 받아온 데이터 기반으로 계산해서 기록하는 컬럼
  @Field({ nullable: false })
  @Column({ name: 'total_payment_of_number', nullable: false, default: 0 })
  total_payment_of_number: number;

  //스프레드에서 받아온 데이터 기반으로 계산해서 기록하는 컬럼
  //스프레드엔 문자열로 되어있지만 db에서 불러와 쿼리처리할 때 number형식이어야 함
  @Field({ nullable: false })
  @Column({ name: 'total_payment_of_money', nullable: false, default: 0 })
  total_payment_of_money: number;

  //스프레드에서 받아온 데이터 기반으로 계산해서 기록하는 컬럼
  @Field({ nullable: true })
  @Column({
    name: 'payment_end_date',
    nullable: false,
    default: '9999-12-31',
  })
  payment_end_date: Date;

  //스프레드에서 받아온 데이터 기반으로 계산해서 기록하는 컬럼
  @Field({ nullable: false })
  @Column({ name: 'total_payment_period_number', nullable: false, default: 0 })
  total_payment_period_number: number;

  //스프레드에서 받아온 데이터 기반으로 계산해서 기록하는 컬럼
  @Field({ nullable: false })
  @Column({ name: 'payment_ended', nullable: false, default: '지원' })
  payment_ended: string;

  @Field({ nullable: true })
  @Column({ name: 'uniqueness', nullable: true, default: 0 })
  uniqueness: string;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

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

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userComputationFund)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
