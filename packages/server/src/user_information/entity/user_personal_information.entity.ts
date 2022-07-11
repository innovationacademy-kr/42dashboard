import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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
  @Column({ name: 'region', nullable: true })
  region: string;

  @Field()
  @Column({ name: 'gender', nullable: true })
  gender: string;

  @Field()
  @Column({ name: 'birthday', nullable: true })
  birthday: string;

  @Field()
  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @Field()
  @Column({ name: 'email', nullable: true })
  email: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string; //외래키값을 선언하지 않으면 null으로 판단됨

  @OneToOne(() => User, (user) => user.userPersonalInformation, {
    createForeignKeyConstraints: false, //외래키 제약조건 해제
    nullable: false,
  })
  @JoinColumn() //user와 이름이 중복되는 에러로 인해 이름변경
  user: User;
}
