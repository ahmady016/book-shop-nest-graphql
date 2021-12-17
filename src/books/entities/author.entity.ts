import { ObjectType, Field } from '@nestjs/graphql'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'
import { Gender } from 'src/__common/types'
import { Book } from './book.entity'

@ObjectType()
@Entity("authors")
export class Author extends EntityBase {
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
  @Column({ name: 'country', type: 'varchar', length: 100, nullable: true })
  country: string

  @Field(() => [Book], { nullable: true })
  @ManyToMany(() => Book, book => book.authors)
  @JoinTable({ name: "authors_books" })
  books?: Book[]
}
