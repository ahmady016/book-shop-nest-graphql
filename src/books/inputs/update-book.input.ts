import { PartialType, InputType, Field, ID } from '@nestjs/graphql'
import { CreateBookInput } from './create-book.input'

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field(() => ID)
  id: string
}
