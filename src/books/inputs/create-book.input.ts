import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateBookInput {
  @Field(() => String)
  title: string

  @Field(() => String)
  subtitle: string

  @Field(() => String)
  description: string

  @Field(() => String)
  publisher: string

  @Field(() => String)
  language: string

  @Field(() => String)
  country: string

  @Field(() => String)
  imageURL: string

  @Field(() => String)
  infoURL: string

  @Field(() => Number)
  publishedYear: number

  @Field(() => Number)
  pageCount: number

  @Field(() => [String])
  authorsIds: string[]
}
