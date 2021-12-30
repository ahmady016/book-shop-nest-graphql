import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'
import { Stock } from './stock.entity'
import { Author } from './author.entity'
import { User } from 'src/auth/entities/user.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { Rating } from 'src/ratings/entities/rating.entity'

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

  @Field(() => Int)
  @Column({ name: 'published_year', type: 'int' })
  publishedYear: number

  @Field(() => Int)
  @Column({ name: 'page_count', type: 'int' })
  pageCount: number

  @Field(() => Int)
  @Column({ name: 'ratings_count', type: 'int', default: 0 })
  ratingsCount: number

  @Field(() => Float)
  @Column({ name: 'rating_average', type: 'decimal', default: 0.0 })
  ratingAverage: number

  @Field(() => String, { nullable: true })
  @Column({ name: 'notes', type: 'varchar', length: 1000, default: 'Great Book!', nullable: true })
  notes: string

  @Field(() => Stock, { nullable: true })
  @OneToOne(() => Stock, (stock: Stock) => stock.book, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  stock: Stock

  @Field(() => [Author], { nullable: true })
  @ManyToMany(() => Author, (author) => author.books)
  authors?: Author[]

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.favoriteBooks)
  favoriteCustomers?: User[]

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment: Comment) => comment.book, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  comments?: Comment[]

  @Field(() => [Rating], { nullable: true })
  @OneToMany(() => Rating, (rating: Rating) => rating.book, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  ratings?: Rating[]
}
