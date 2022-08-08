import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user_information.entity';

//개인정보관리
@Entity()
@ObjectType()
export class UserPersonalInformation {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field()
  @Column({ name: 'name', nullable: false, default: 'NO_NAME' })
  name: string;

  @Field()
  @Column({ name: 'region', nullable: true })
  region: string;

  @Field()
  @Column({ name: 'gender', nullable: true })
  gender: string;

  @Field()
  @Column({ name: 'birthday', nullable: true })
  birthday: string;

  @Field()
  @Column({ name: 'social_security_key', nullable: true })
  social_security_key: string;

  @Field()
  @Column({ name: 'age', nullable: true })
  age: string;

  @Field()
  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @Field()
  @Column({ name: 'email', nullable: true })
  email: string;

  @Field()
  @Column({ name: 'uniqueness', nullable: true })
  uniqueness: string;

  @Field()
  @Column({ name: 'anonymization', nullable: true })
  anonymization: string;

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
  fk_user_no: string; //외래키값을 선언하지 않으면 null으로 판단됨

  @ManyToOne(() => User, (user) => user.userPersonalInformation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_no' }) //user와 이름이 중복되는 에러로 인해 이름변경
  user: User;
}
