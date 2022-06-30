import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';

@ArgsType()
@ObjectType({
  description:
    '아래 5개의 필드중에서 log 필드를 제외한 4개의 필드는 필수 입력값. log필드값을 true로 하면 최신정보 + 과거정보를 응답. log필드값을 false로 하면 최신정보만을 응답',
})
@InputType()
export class Filter {
  @Field()
  entityName: string;
  @Field()
  column: string;
  @Field()
  operator: string;
  @Field()
  givenValue: string; //이렇게 물음표 안붙으면 필수값이라는 뜻
  @Field()
  lastest: boolean;
  // @Field()
  // log?: boolean; //이렇게 물음표 붙이면 '필수값이 아니'라는 뜻
}
