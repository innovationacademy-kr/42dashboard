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

  @Field((type) => Int, { nullable: false })
  @Column({ name: 'recevied_grant_amount', nullable: false, default: 0 })
  recevied_grant_amount: number;

  @Field({ nullable: true })
  @Column({ name: 'payment_date', nullable: true })
  payment_date: Date;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @ManyToOne(() => User, (user) => user.userComputationFund)
  user: User;
}
