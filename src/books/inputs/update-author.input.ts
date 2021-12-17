import { PartialType, InputType, Field, ID } from '@nestjs/graphql'
import { CreateAuthorInput } from './create-author.input'

@InputType()
export class UpdateAuthorInput extends PartialType(CreateAuthorInput) {
  @Field(() => ID)
  id: string
}
