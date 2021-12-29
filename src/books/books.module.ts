import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthorsService } from './authors.service'
import { AuthorsResolver } from './authors.resolver'

import { BooksService } from './books.service'
import { BooksResolver } from './books.resolver'

import { Author } from './entities/author.entity'
import { Book } from './entities/book.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { Rating } from 'src/ratings/entities/rating.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author, Comment, Rating])],
  providers: [AuthorsResolver, AuthorsService, BooksResolver, BooksService],
})
export class BooksModule {}
