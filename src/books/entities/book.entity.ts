import { ObjectType, Field } from '@nestjs/graphql'
import { Column, Entity, ManyToMany } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'
import { Author } from './author.entity'
import { User } from 'src/auth/entities/user.entity'

@ObjectType()
@Entity('books')
export class Book extends EntityBase {
  @Field(() => String)
  @Column({ name: 'title', type: 'varchar', length: 70 })
  title: string

  @Field(() => String)
  @Column({ name: 'subtitle', type: 'varchar', length: 120 })
  subtitle: string

  @Field(() => String)
  @Column({ name: 'description', type: 'varchar', length: 1000 })
  description: string

  @Field(() => String)
  @Column({ name: 'publisher', type: 'varchar', length: 100 })
  publisher: string

  @Field(() => String)
  @Column({ name: 'language', type: 'varchar', length: 50 })
  language: string

  @Field(() => String)
  @Column({ name: 'country', type: 'varchar', length: 50 })
  country: string

  @Field(() => String)
  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageURL: string

  @Field(() => String)
  @Column({ name: 'info_url', type: 'varchar', length: 500 })
  infoURL: string

  @Field(() => Number)
  @Column({ name: 'published_year', type: 'int' })
  publishedYear: number

  @Field(() => Number)
  @Column({ name: 'page_count', type: 'int' })
  pageCount: number

  @Field(() => [Author], { nullable: true })
  @ManyToMany(() => Author, author => author.books)
  authors?: Author[]

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, user => user.favoriteBooks)
  favoriteCustomers?: User[]
}
