import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ObjectType, Field, Float, Int } from '@nestjs/graphql'

import { EntityBase } from 'src/__common/EntityBase'
import { Sale } from './sale.entity'
import { Book } from 'src/books/entities/book.entity'

@ObjectType()
@Entity('sales_items')
export class SaleItem extends EntityBase {
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
  @ManyToOne(() => Book, (book: Book) => book.salesItems)
  @JoinColumn({ name: 'book_id' })
  book?: Book

  @Column({ name: 'sale_id', nullable: true })
  saleId: string

  @Field(() => [Sale], { nullable: true })
  @ManyToOne(() => Sale, (sale: Sale) => sale.items)
  @JoinColumn({ name: 'sale_id' })
  sale?: Sale
}
