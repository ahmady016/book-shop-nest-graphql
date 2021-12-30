import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'
import { Book } from './book.entity'

@ObjectType()
@Entity('stocks')
export class Stock extends EntityBase {
  @Field(() => String)
  @Column({ name: 'book_id', type: 'uuid' })
  bookId?: string

  @Field(() => Book, { nullable: true })
  @OneToOne(() => Book, (book) => book.stock)
  @JoinColumn({ name: 'book_id' })
  book?: Book

  @Field(() => Float)
  @Column({ name: 'total_purchases_price', type: 'decimal', default: 0.0 })
  totalPurchasesPrice: number

  @Field(() => Float)
  @Column({ name: 'total_sales_price', type: 'decimal', default: 0.0 })
  totalSalesPrice: number

  @Field(() => Float)
  @Column({ name: 'total_purchase', type: 'decimal', default: 0.0 })
  profit: number

  @Field(() => Int)
  @Column({ name: 'total_purchases_quantity', type: 'int', default: 0 })
  totalPurchasesQuantity: number

  @Field(() => Int)
  @Column({ name: 'total_sales_quantity', type: 'int', default: 0 })
  totalSalesQuantity: number

  @Field(() => Int)
  @Column({ name: 'total_in_stock', type: 'int', default: 0 })
  totalInStock: number
}
