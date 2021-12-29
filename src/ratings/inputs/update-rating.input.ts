import { InputType, Field, ID, Int } from '@nestjs/graphql'
import { IsInt, IsUUID, Max, Min } from 'class-validator'

@InputType()
export class UpdateRatingInput {
  @Field(() => ID)
  @IsUUID()
  id: string

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  value: number
}
