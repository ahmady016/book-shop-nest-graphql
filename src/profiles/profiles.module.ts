import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Profile } from './entities/profile.entity'

import { ProfilesService } from './profiles.service'
import { ProfilesResolver } from './profiles.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfilesResolver, ProfilesService],
})
export class ProfilesModule {}
