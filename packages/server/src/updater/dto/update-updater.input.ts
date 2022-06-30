import { CreateUpdaterInput } from './create-updater.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUpdaterInput extends PartialType(CreateUpdaterInput) {
  @Field(() => Int)
  id: number;
}
