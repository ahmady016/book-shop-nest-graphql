import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'

import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'

@ObjectType()
@Entity('ratings')
export class Rating extends EntityBase {
  @Field(() => Int)
  @Column({ name: 'value', type: 'int' })
  value: number

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.comments)
  @JoinColumn({ name: 'customer_id' })
  customer?: User

  @Column({ name: 'book_id', type: 'uuid' })
  bookId: string

  @Field(() => Book, { nullable: true })
  @ManyToOne(() => Book, (book: Book) => book.comments)
  @JoinColumn({ name: 'book_id' })
  book?: Book
}
