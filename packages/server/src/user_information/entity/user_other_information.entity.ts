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
import { User } from './user_information.entity';

//기타정보
@ObjectType()
@Entity()
export class UserOtherInformation extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field()
  @Column({ name: 'highest_level_of_education', nullable: true })
  highest_level_of_education: string;

  @Field()
  @Column({ name: 'majored', nullable: false, default: '비전공' })
  majored: string;

  @Field()
  @Column({ name: 'major_name', nullable: true })
  major_name: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn({ name: 'deleted_date' })
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

  @ManyToOne(() => User, (user) => user.userOtherInformation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
