
import { Field, InputType } from '@nestjs/graphql'

import { IsDateString, IsEmail, IsEnum, IsString, Length } from 'class-validator'

import { Gender, UserRole } from 'src/__common/types'

@InputType()
export class SignupInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @IsString()
  @Length(6, 50)
  password: string

  @Field(() => String)
  @IsEnum(UserRole)
  role: UserRole

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
}
