import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { UserRole, AccountStatus } from 'src/__common/types'

import { EntityBase } from 'src/__common/EntityBase'
import { Profile } from 'src/profiles/entities/profile.entity'
import { Book } from 'src/books/entities/book.entity'

@ObjectType()
@Entity('users')
export class User extends EntityBase {
  @Field(() => String)
  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string

  @Column({ name: 'password', type: 'varchar', length: 60 })
  password: string

  @Column({
    name: 'verification_code',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  verificationCode?: string

  @Field(() => String)
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole

  @Field(() => String)
  @Column({
    name: 'status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status: AccountStatus

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, (profile) => profile.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  profile: Profile

  @Field(() => [Book], { nullable: true })
  @ManyToMany(() => Book, book => book.favoriteCustomers)
  @JoinTable({ name: 'customers_favorite_books' })
  favoriteBooks?: Book[]
}
