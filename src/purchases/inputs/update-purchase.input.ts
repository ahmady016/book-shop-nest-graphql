import { PartialType, InputType, Field, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { CreatePurchaseInput } from './create-purchase-with-items.input'

@InputType()
export class UpdatePurchaseInput extends PartialType(CreatePurchaseInput) {
  @Field(() => ID)
  @IsUUID()
  id: string
}
