import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CudDto {
  @Field((type) => Int)
  intra_no: number;

  @Field()
  entityName: string;

  @Field((type) => Int)
  pk: number;

  @Field()
  column: string;

  @Field()
  value: string;
}
