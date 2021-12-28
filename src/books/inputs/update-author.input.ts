import { PartialType, InputType, Field, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { CreateAuthorInput } from './create-author.input'

@InputType()
export class UpdateAuthorInput extends PartialType(CreateAuthorInput) {
  @Field(() => ID)
  @IsUUID()
  id: string
}
