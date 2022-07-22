import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CheckDuplication {
  // @Field((type) => GraphQLJSON, { nullable: true })
  // filters: JSON;

  @Field() //에러발생 -> Filter 선언부쪽에 @InputType()붙여주니까 해결됨
  duplicated: string;
  @Field({ nullable: true })
  column: string;
}
