import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetUserArgs {
  @Field((type) => Int, { nullable: true })
  intra_no: number;

  @Field((type) => String, { nullable: true })
  intra_id: string;

  @Field((type) => String, { nullable: true })
  name: string;

  @Field((type) => String, { nullable: true })
  grade: string;

  @Field({ nullable: true })
  start_process_date: Date;

  @Field((type) => String, { nullable: true })
  academic_state: string;

  @Field((type) => String, { nullable: true })
  coalition: string;

  @Field({ nullable: true })
  created_date: Date;
}
