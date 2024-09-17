import { Field, ArgsType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class UpdateOneUserArgs {
  @IsUUID()
  @Field()
  id: string;

  @Field()
  name?: string;
}
