import { CreateSaleInput } from './create-sale-with-items.input'
import { InputType, Field, ID, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateSaleInput extends PartialType(CreateSaleInput) {
  @Field(() => ID)
  id: string
}
