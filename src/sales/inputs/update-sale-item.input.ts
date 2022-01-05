import { PartialType, InputType, Field, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { CreateSaleItemInput } from './create-sale-with-items.input'

@InputType()
export class UpdateSaleItemInput extends PartialType(CreateSaleItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string
}
