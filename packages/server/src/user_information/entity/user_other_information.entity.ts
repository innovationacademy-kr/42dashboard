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

  @Field((type) => Int)
  @Column({ name: 'period_of_software_learning', nullable: true })
  period_of_software_learning: number;

  @Field()
  @Column({ name: 'experience_of_software_developing', nullable: true })
  experience_of_software_developing: string;

  @Field()
  @CreateDateColumn({ name: 'created_date' })
  created_date: Date;

  @Field()
  @DeleteDateColumn()
  deleted_date: Date;

<<<<<<< HEAD
  @Column({ name: 'fk_user_no', nullable: false })
=======
  @Column({ name: 'fk_user_no', nullable: true })
>>>>>>> b0232f735548468240aacf3c2449228c420a97e7
  fk_user_no: string;

  @ManyToOne(() => User, (user) => user.userOtherInformation)
  @JoinColumn({ name: 'fk_user_no' })
  user: User;
}
