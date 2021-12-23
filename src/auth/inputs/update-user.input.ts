import { Field, ID, InputType } from '@nestjs/graphql'

import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator'

import { AccountStatus, UserRole } from 'src/__common/types'

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsUUID()
  id: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(6, 50)
  password?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus
}
