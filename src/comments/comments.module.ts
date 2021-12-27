import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/auth/auth.module'
import { CommentsService } from './comments.service'
import { CommentsResolver } from './comments.resolver'

import { Book } from 'src/books/entities/book.entity'
import { User } from 'src/auth/entities/user.entity'
import { Comment } from './entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Book, User, Comment]), AuthModule],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
