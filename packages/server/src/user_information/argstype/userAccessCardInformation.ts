import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
//출입카드정보
@ArgsType()
export class GetUserAccessCardInformationArgs {
  @Field((type) => Int, { nullable: true })
  pk: number;

  @Field({ nullable: true })
  profile_picture_path: string;

  @Field((type) => Int, { nullable: true })
  lapiscine_physical_number: number;

  @Field((type) => Int, { nullable: true })
  lapiscine_logical_number: number;

  @Field((type) => Int, { nullable: true })
  logical_number_for_main_course: number;

  @Field({ nullable: true })
  name_of_entry_card_for_main_course: string;

  @Field({ nullable: true })
  created_date: Date;
}
