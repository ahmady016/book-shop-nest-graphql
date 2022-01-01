import { ObjectType, Field, Float } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { EntityBase } from 'src/__common/EntityBase'
import { User } from 'src/auth/entities/user.entity'
import { PurchaseItem } from './purchase-item.entity'

@ObjectType()
@Entity('purchases')
export class Purchase extends EntityBase {
  @Field(() => Date)
  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date

  @Field(() => Float)
  @Column({ name: 'total_price', type: 'decimal', default: 0.0 })
  totalPrice: number

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string

  @Field(() => [User], { nullable: true })
  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: 'employee_id' })
  employee?: User

  @Field(() => [PurchaseItem], { nullable: true })
  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.purchase, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  items?: PurchaseItem[]
}
