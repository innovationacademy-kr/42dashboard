import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Updater {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
