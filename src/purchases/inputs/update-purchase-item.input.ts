import { PartialType, InputType, Field, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { CreatePurchaseItemInput } from './create-purchase-with-items.input'

@InputType()
export class UpdatePurchaseItemInput extends PartialType(CreatePurchaseItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string
}
