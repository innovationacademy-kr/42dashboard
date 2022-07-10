import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
@ObjectType()
@InputType()
export class Filter {
  @Field()
  entityName: string;
  @Field({ nullable: true })
  column: string;
  @Field({ nullable: true })
  operator: string;
  @Field({ nullable: true })
  givenValue: string;
  @Field({ nullable: true })
  latest: boolean;
}
