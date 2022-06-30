import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user_information.entity';
//출입카드정보
@Entity()
@ObjectType()
export class UserAccessCardInformation extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Field()
  @Column({ name: 'profile_picture_path', nullable: true })
  profile_picture_path: string;

  @Field((type) => Int)
  @Column({ name: 'lapiscine_access_card_number_of_physical', nullable: true })
  lapiscine_access_card_number_of_physical: number;

  @Field((type) => Int)
  @Column({ name: 'lapiscine_access_card_number_of_logical', nullable: true })
  lapiscine_access_card_number_of_logical: number;

  @Field((type) => Int)
  @Column({
    name: 'logical_number_of_access_card_for_this_course',
    nullable: true,
  })
  logical_number_of_access_card_for_this_course: number;

  @Field()
  @Column({ name: 'name_of_entry_card_for_this_course', nullable: true })
  name_of_entry_card_for_this_course: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'fk_user_no', nullable: true })
  fk_user_no: string;

  @OneToOne(() => User, (user) => user.userAccessCardInformation, {
    createForeignKeyConstraints: false, //외래키 제약조건 해제
  })
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
