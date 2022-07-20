import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CudDto {
  @Field((type) => Int)
  intra_no: number;

  @Field()
  entityName: string;

  @Field((type) => Int, { nullable: true })
  pk: number;

  @Field({ nullable: true })
  column: string;

  @Field({ nullable: true })
  value: string;
}
