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
  @Column({ name: 'lapiscine_physical_number', nullable: true })
  lapiscine_physical_number: string;

  @Field((type) => Int)
  @Column({ name: 'lapiscine_logical_number', nullable: true })
  lapiscine_logical_number: string;

  @Field((type) => Int)
  @Column({
    name: 'logical_number_for_main_course',
    nullable: true,
  })
  logical_number_for_main_course: string;

  @Field()
  @Column({ name: 'name_of_entry_card_for_main_course', nullable: true })
  name_of_entry_card_for_main_course: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

<<<<<<< HEAD
  @Column({ name: 'fk_user_no', nullable: false })
  fk_user_no: string;
=======
  // @Column({ name: 'fk_user_no', nullable: true })
  // fk_user_no: string;
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7

  @ManyToOne(() => User, (user) => user.userAccessCardInformation)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
