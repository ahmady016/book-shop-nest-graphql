import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthorsService } from './authors.service'
import { AuthorsResolver } from './authors.resolver'

import { BooksService } from './books.service'
import { BooksResolver } from './books.resolver'

import { Book } from './entities/book.entity'
import { Stock } from './entities/stock.entity'
import { Author } from './entities/author.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { Rating } from 'src/ratings/entities/rating.entity'
import { SaleItem } from 'src/sales/entities/sale-item.entity'
import { PurchaseItem } from 'src/purchases/entities/purchase-item.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      Stock,
      Author,
      Comment,
      Rating,
      PurchaseItem,
      SaleItem,
    ]),
  ],
  providers: [AuthorsResolver, AuthorsService, BooksResolver, BooksService],
})
export class BooksModule {}
