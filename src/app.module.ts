import { Module } from '@nestjs/common'

import { join } from 'path'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailerModule } from '@nestjs-modules/mailer'
import { ServeStaticModule } from '@nestjs/serve-static'

import { PostgreConfigService } from './__common/PostgreConfigService'
import { mailerConfigFactory } from './__common/mailerConfigFactory'

import { AuthModule } from './auth/auth.module'
import { ProfilesModule } from './profiles/profiles.module'
import { BooksModule } from './books/books.module'
import { CommentsModule } from './comments/comments.module'
import { RatingsModule } from './ratings/ratings.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SalesModule } from './sales/sales.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: PostgreConfigService,
      inject: [PostgreConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: true,
      },
      playground: true,
    }),
    MailerModule.forRootAsync({
      useFactory: mailerConfigFactory,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    ProfilesModule,
    BooksModule,
    CommentsModule,
    RatingsModule,
    PurchasesModule,
    SalesModule,
  ],
})
export class AppModule {}
