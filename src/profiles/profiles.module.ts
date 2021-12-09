import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProfilesService } from './profiles.service'
import { ProfilesResolver } from './profiles.resolver'

import { User } from 'src/auth/entities/user.entity'
import { Profile } from './entities/profile.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  providers: [ProfilesResolver, ProfilesService],
})
export class ProfilesModule {}
