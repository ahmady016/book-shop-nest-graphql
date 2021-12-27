import { ObjectType, Field } from '@nestjs/graphql'
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'
import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'

@ObjectType()
@Entity('comments')
export class Comment extends EntityBase {
  @Field(() => String)
  @Column({ name: 'text', type: 'varchar', length: 2000 })
  text: string

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
