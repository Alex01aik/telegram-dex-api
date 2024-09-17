import { Field, ArgsType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class UpdateOneInformatorArgs {
  @IsUUID()
  @Field()
  id: string;

  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  isTrusted?: boolean;
}
