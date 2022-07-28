import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Filter } from '../filter';

@ArgsType()
export class FilterArgs {
  // @Field((type) => GraphQLJSON, { nullable: true })
  // filters: JSON;

  @Field((type) => [Filter]) //에러발생 -> Filter 선언부쪽에 @InputType()붙여주니까 해결됨
  filters: Filter[];
  @Field((type) => Date, { nullable: true })
  startDate;
  @Field((type) => Date, { nullable: true })
  endDate;
  @Field((type) => Int, { nullable: true })
  take: number;
  @Field((type) => Int, { nullable: true })
  skip: number;
}
