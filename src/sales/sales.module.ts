import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/auth/auth.module'

import { SalesService } from './sales.service'
import { SalesResolver } from './sales.resolver'

import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'
import { Stock } from 'src/books/entities/stock.entity'
import { Sale } from './entities/sale.entity'
import { SaleItem } from './entities/sale-item.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Book, Sale, SaleItem, Stock]),
    AuthModule,
  ],
  providers: [SalesResolver, SalesService],
})
export class SalesModule {}
