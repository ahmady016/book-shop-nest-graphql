import { Entity, Column } from 'typeorm'

import { ObjectType, Field } from '@nestjs/graphql'

import { EntityBase } from 'src/__common/EntityBase'
import { Gender } from 'src/__common/types'

@ObjectType()
@Entity('users')
export class User extends EntityBase {
  @Field(() => String)
  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string

  @Field(() => String)
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string

  @Field(() => String)
  @Column({ name: 'gender', type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender

  @Field(() => String)
  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date

  @Field(() => String)
  @Column({ name: 'address', type: 'varchar', length: 500 })
  address: string

  @Field(() => String)
  @Column({ name: 'mobile', type: 'varchar', length: 11 })
  mobile: string
}
