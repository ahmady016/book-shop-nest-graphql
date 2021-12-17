import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'

import { ObjectType, Field } from '@nestjs/graphql'

import { EntityBase } from 'src/__common/EntityBase'
import { Gender } from 'src/__common/types'
import { User } from 'src/auth/entities/user.entity'

@ObjectType()
@Entity('profiles')
export class Profile extends EntityBase {
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

  @Field(() => String, { nullable: true })
  @Column({ name: 'address', type: 'varchar', length: 500, nullable: true })
  address?: string

  @Field(() => String, { nullable: true })
  @Column({ name: 'city', type: 'varchar', length: 100, nullable: true })
  city?: string

  @Field(() => String, { nullable: true })
  @Column({ name: 'country', type: 'varchar', length: 100, nullable: true })
  country?: string

  @Field(() => String, { nullable: true })
  @Column({ name: 'mobile', type: 'varchar', length: 11, nullable: true })
  mobile?: string

  @Field(() => String, { nullable: true })
  @Column({ name: 'photo_url', type: 'varchar', length: 400, nullable: true })
  photoURL?: string

  @Field(() => String, { nullable: true })
  @Column({ name: 'hobbies', type: 'varchar', length: 1000, nullable: true })
  hobbies?: string

  @Field(() => String, { nullable: true })
  @Column({ name: 'user_id', nullable: true })
  userId?: string

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user?: User
}
