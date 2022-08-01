import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class UpdateDB {
  // @Field((type) => GraphQLJSON, { nullable: true })
  // filters: JSON;

  @Field() //에러발생 -> Filter 선언부쪽에 @InputType()붙여주니까 해결됨
  sheetName: string;
}
