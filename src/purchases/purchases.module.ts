import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/auth/auth.module'

import { PurchasesService } from './purchases.service'
import { PurchasesResolver } from './purchases.resolver'

import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'
import { PurchaseItem } from './entities/purchase-item.entity'
import { Purchase } from 'src/purchases/entities/purchase.entity'
import { Stock } from 'src/books/entities/stock.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Book, Purchase, PurchaseItem, Stock]),
    AuthModule,
  ],
  providers: [PurchasesResolver, PurchasesService],
})
export class PurchasesModule {}
