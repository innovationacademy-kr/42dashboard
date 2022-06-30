import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@ArgsType()
export class GetUserPersonalInformationArgs {
  @Field((type) => Int, { nullable: true })
  pk: number;

  @Field({ nullable: true })
  region: string;

  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  birthday: string;

  @Field({ nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  created_date: Date;
}
