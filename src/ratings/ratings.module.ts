import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/auth/auth.module'

import { RatingsService } from './ratings.service'
import { RatingsResolver } from './ratings.resolver'

import { Book } from 'src/books/entities/book.entity'
import { User } from 'src/auth/entities/user.entity'
import { Rating } from './entities/rating.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Book, User, Rating]), AuthModule],
  providers: [RatingsResolver, RatingsService],
})
export class RatingsModule {}
