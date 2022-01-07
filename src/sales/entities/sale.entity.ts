import { ObjectType, Field, Float } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'
import { User } from 'src/auth/entities/user.entity'
import { SaleItem } from './sale-item.entity'

@ObjectType()
@Entity('sales')
export class Sale extends EntityBase {
  @Field(() => Date)
  @Column({ name: 'sale_date', type: 'date' })
  saleDate: Date

  @Field(() => Float)
  @Column({ name: 'total_price', type: 'decimal', default: 0.0 })
  totalPrice: number

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.employeeSales)
  @JoinColumn({ name: 'employee_id' })
  employee?: User

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.customerSales)
  @JoinColumn({ name: 'customer_id' })
  customer?: User

  @Field(() => [SaleItem], { nullable: true })
  @OneToMany(() => SaleItem, (saleItem: SaleItem) => saleItem.sale, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  items?: SaleItem[]
}
