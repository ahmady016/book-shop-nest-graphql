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
export class CreateProfileInput {
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

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(10, 500)
  address: string

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  city: string

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  country: string

  @Field(() => String, { nullable: true })
  @IsNumberString()
  @Length(11, 11)
  mobile: string

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(2, 400)
  photoURL: string

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(2, 1000)
  hobbies: string
}
