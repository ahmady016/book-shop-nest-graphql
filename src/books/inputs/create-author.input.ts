import { InputType, Field } from '@nestjs/graphql'
import { IsDateString, IsEnum, IsString, Length } from 'class-validator'
import { Gender } from 'src/__common/types'
@InputType()
export class CreateAuthorInput {
  @Field(() => String)
  @IsString()
  @Length(2, 50)
  firstName: string

  @Field(() => String)
  @IsString()
  @Length(5, 100)
  lastName: string

  @Field(() => String)
  @IsEnum(Gender)
  gender: Gender

  @Field(() => String)
  @IsDateString()
  birthDate: Date

  @Field(() => String)
  @IsString()
  @Length(2, 100)
  country: string
}
