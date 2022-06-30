import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUpdaterInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
