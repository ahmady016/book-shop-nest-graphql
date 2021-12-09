import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'

import { User } from './entities/user.entity'
import { Profile } from 'src/profiles/entities/profile.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
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
  exports: [AuthService]
})
export class AuthModule {}
