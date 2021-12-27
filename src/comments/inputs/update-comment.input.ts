import { CreateCommentInput } from './create-comment.input'
import { InputType, Field, ID, PartialType } from '@nestjs/graphql'

import { IsUUID } from 'class-validator'

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => ID)
  @IsUUID()
  id: string
}
