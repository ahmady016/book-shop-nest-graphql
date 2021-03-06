import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'

import { User } from './entities/user.entity'
import { Profile } from 'src/profiles/entities/profile.entity'
import { Book } from 'src/books/entities/book.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { Rating } from 'src/ratings/entities/rating.entity'
import { Purchase } from 'src/purchases/entities/purchase.entity'
import { Sale } from 'src/sales/entities/sale.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Book,
      Comment,
      Rating,
      Purchase,
      Sale,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
