import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ObjectType, Field, Float, Int } from '@nestjs/graphql'

import { EntityBase } from 'src/__common/EntityBase'
import { Purchase } from './purchase.entity'
import { Book } from 'src/books/entities/book.entity'

@ObjectType()
@Entity('purchases_items')
export class PurchaseItem extends EntityBase {
  @Field(() => Int)
  @Column({ name: 'quantity', type: 'int', default: 0 })
  quantity: number

  @Field(() => Float)
  @Column({ name: 'unit_price', type: 'decimal', default: 0.0 })
  unitPrice: number

  @Field(() => Float)
  @Column({ name: 'total_price', type: 'decimal', default: 0.0 })
  totalPrice: number

  @Column({ name: 'book_id', type: 'uuid' })
  bookId: string

  @Field(() => [Book], { nullable: true })
  @ManyToOne(() => Book, (book: Book) => book.purchasesItems)
  @JoinColumn({ name: 'book_id' })
  book?: Book

  @Column({ name: 'purchase_id', nullable: true })
  purchaseId: string

  @Field(() => [Purchase], { nullable: true })
  @ManyToOne(() => Purchase, (purchase: Purchase) => purchase.items)
  @JoinColumn({ name: 'purchase_id' })
  purchase?: Purchase
}
