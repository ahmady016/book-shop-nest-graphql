import { PartialType, InputType, Field, ID } from '@nestjs/graphql'

import { CreateProfileInput } from './create-profile.input'

import { IsUUID } from 'class-validator'

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => ID)
  @IsUUID()
  id: string
}
