import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ArgsType()
export class GetUserOtherInformationArgs {
  @Field((type) => Int, { nullable: true })
  pk: number;

  @Field()
  highest_level_of_education: string;

  @Field()
  majored: string;

  // @Field()
  // major_field: string;

  @Field()
  major_name: string;

  // @Field((type) => Int, { nullable: true })
  // period_of_software_learning: number;

  // @Field()
  // experience_of_software_developing: string;

  @Field()
  created_date: Date;
}
