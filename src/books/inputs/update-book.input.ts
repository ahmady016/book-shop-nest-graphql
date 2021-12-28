import { PartialType, InputType, Field, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { CreateBookInput } from './create-book.input'

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field(() => ID)
  @IsUUID()
  id: string
}
