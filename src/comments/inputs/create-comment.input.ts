import { InputType, Field } from '@nestjs/graphql'

import { IsString, IsUUID, Length } from 'class-validator'

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  @IsString()
  @Length(5, 2000)
  text: string

  @Field(() => String)
  @IsUUID()
  bookId: string
}
