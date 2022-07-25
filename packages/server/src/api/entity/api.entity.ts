import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Api {
  @Field(() => Int)
  intra_no: number;

  @Field(() => Float)
  level: number;

  @Field(() => Int)
  email: string;

  @Field(() => Int)
  phone: string;

  @Field(() => Int)
  circle: number;

  @Field(() => Int)
  outcircle: string;

  @Field(() => Int)
  outcircled_date: Date;

  @Field(() => Int)
  coalition_score: number;

  @Field(() => Int)
  blackhole_date: Date;

  @Field(() => Int)
  remaining_period: number;

  @Field(() => Int)
  fk_user_no: number;
}
