import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { ParseUUIDPipe } from '@nestjs/common'

import { ProfilesService } from './profiles.service'

import { Profile } from './entities/profile.entity'
import { CreateProfileInput } from './inputs/create-profile.input'
import { UpdateProfileInput } from './inputs/update-profile.input'

@Resolver(of => Profile)
export class ProfilesResolver {
  constructor(private readonly usersService: ProfilesService) {}

  @Query(returns => [Profile], { name: 'profiles' })
  list() {
    return this.usersService.list()
  }

  @Query(returns => Profile, { name: 'profile' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findById(id)
  }

  @Mutation(returns => Profile)
  createProfile(@Args('createUserInput') createUserInput: CreateProfileInput) {
    return this.usersService.create(createUserInput)
  }

  @Mutation(returns => Profile)
  updateUProfile(@Args('updateUserInput') updateUserInput: UpdateProfileInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(returns => Profile)
  removeProfile(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.remove(id)
  }
}
