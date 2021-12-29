import { InputType, Int, Field } from '@nestjs/graphql'
import { IsInt, IsUUID, Max, Min } from 'class-validator'

@InputType()
export class CreateRatingInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  value: number

  @Field(() => String)
  @IsUUID()
  bookId: string
}
