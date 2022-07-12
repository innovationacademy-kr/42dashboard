import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

//안씀
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
  out_circle: string;

  @Field(() => Int)
  out_circle_date: Date;

  @Field(() => Int)
  coalition_score: number;

  @Field(() => Int)
  blackhole_time: Date;

  @Field(() => Int)
  remaining_period: number;

  @Field(() => Int)
  fk_user_no: number;
}
