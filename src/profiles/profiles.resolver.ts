import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { ParseUUIDPipe } from '@nestjs/common'

import { ProfilesService } from './profiles.service'

import { User } from 'src/auth/entities/user.entity'
import { Profile } from './entities/profile.entity'

import { CreateProfileInput } from './inputs/create-profile.input'
import { UpdateProfileInput } from './inputs/update-profile.input'

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @ResolveField(() => User)
  user(@Parent() profile: Profile) {
    return this.profilesService.findUser(profile.userId)
  }

  @Query(() => [Profile], { name: 'profiles' })
  list() {
    return this.profilesService.list()
  }

  @Query(() => Profile, { name: 'profile' })
  findById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.profilesService.findById(id)
  }

  @Mutation(() => Profile)
  createProfile(@Args('createUserInput') createUserInput: CreateProfileInput) {
    return this.profilesService.create(createUserInput)
  }

  @Mutation(() => Profile)
  updateUProfile(@Args('updateProfileInput') updateProfileInput: UpdateProfileInput) {
    return this.profilesService.update(updateProfileInput.id, updateProfileInput)
  }

  @Mutation(() => Profile)
  removeProfile(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.profilesService.remove(id)
  }
}
