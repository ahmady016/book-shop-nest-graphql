import { InputType, Field } from '@nestjs/graphql'

import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator'

import { Gender } from 'src/__common/types'

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @Length(2, 20)
  firstName: string

  @Field(() => String)
  @IsString()
  @Length(2, 20)
  lastName: string

  @Field(() => String)
  @IsEnum(Gender)
  gender: Gender

  @Field(() => String)
  @IsDateString()
  birthDate: string

  @Field(() => String)
  @IsString()
  @Length(10, 500)
  address: string

  @Field(() => String)
  @IsNumberString()
  @Length(11, 11)
  mobile: string
}
