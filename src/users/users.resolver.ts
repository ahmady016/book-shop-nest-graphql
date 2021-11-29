import { ParseUUIDPipe } from '@nestjs/common'
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'

import { UsersService } from './users.service'

import { User } from './entities/user.entity'
import { CreateUserInput } from './inputs/create-user.input'
import { UpdateUserInput } from './inputs/update-user.input'

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => [User], { name: 'users' })
  list() {
    return this.usersService.list()
  }

  @Query(returns => User, { name: 'user' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findById(id)
  }

  @Mutation(returns => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput)
  }

  @Mutation(returns => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(returns => User)
  removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.remove(id)
  }
}
