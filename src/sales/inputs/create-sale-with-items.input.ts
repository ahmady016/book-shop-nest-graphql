import { InputType, Field, Float, Int } from '@nestjs/graphql'
import { IsDateString, IsOptional, IsInt, Min, IsUUID } from 'class-validator'

@InputType()
export class CreateSaleInput {
  @Field(() => String)
  @IsUUID()
  customerId: string

  @Field(() => String)
  @IsDateString()
  saleDate: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalPrice?: number
}

@InputType()
export class CreateSaleItemInput {
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
export class CreateSaleWithItemsInput {
  @Field(() => CreateSaleInput)
  sale: CreateSaleInput

  @Field(() => [CreateSaleItemInput])
  items: CreateSaleItemInput[]
}
