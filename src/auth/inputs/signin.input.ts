
import { Field, InputType } from '@nestjs/graphql'

import { IsEmail, IsString, Length } from 'class-validator'

@InputType()
export class SigninInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @IsString()
  @Length(6, 50)
  password: string
}
