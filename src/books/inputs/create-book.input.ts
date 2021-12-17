import { InputType, Field } from '@nestjs/graphql'
import {
  IsString,
  Length,
  IsNumber,
  Min,
  Max,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'
@InputType()
export class CreateBookInput {
  @Field(() => String)
  @IsString()
  @Length(5, 70)
  title: string

  @Field(() => String)
  @IsString()
  @Length(10, 120)
  subtitle: string

  @Field(() => String)
  @IsString()
  @Length(20, 1000)
  description: string

  @Field(() => String)
  @IsString()
  @Length(5, 50)
  publisher: string

  @Field(() => String)
  @IsString()
  @Length(2, 50)
  language: string

  @Field(() => String)
  @IsString()
  @Length(2, 50)
  country: string

  @Field(() => String)
  @IsString()
  @Length(10, 500)
  imageURL: string

  @Field(() => String)
  @IsString()
  @Length(10, 500)
  infoURL: string

  @Field(() => Number)
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  publishedYear: number

  @Field(() => Number)
  @IsNumber()
  @Min(100)
  @Max(10000)
  pageCount: number

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => String)
  authorsIds: string[]
}
