import { InputType, Field, Float, Int } from '@nestjs/graphql'
import { IsDateString, IsOptional, IsInt, Min, IsUUID } from 'class-validator'

@InputType()
export class CreatePurchaseInput {
  @Field(() => String)
  @IsDateString()
  purchaseDate: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalPrice?: number
}

@InputType()
export class CreatePurchaseItemInput {
  @Field(() => String)
  @IsUUID()
  bookId: string

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number

  @Field(() => Float)
  @IsInt()
  @Min(1)
  unitPrice: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalPrice?: number
}

@InputType()
export class CreatePurchaseWithItemsInput {
  @Field(() => CreatePurchaseInput)
  purchase: CreatePurchaseInput

  @Field(() => [CreatePurchaseItemInput])
  items: CreatePurchaseItemInput[]
}
