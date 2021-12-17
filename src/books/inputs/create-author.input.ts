import { InputType, Field } from '@nestjs/graphql'
import { Gender } from 'src/__common/types'

@InputType()
export class CreateAuthorInput {
  @Field(() => String)
  firstName: string

  @Field(() => String)
  lastName: string

  @Field(() => String)
  gender: Gender

  @Field(() => String)
  birthDate: Date

  @Field(() => String)
  country: string
}
