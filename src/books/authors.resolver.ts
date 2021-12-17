import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'

import { AuthorsService } from './authors.service'

import { Author } from './entities/author.entity'
import { CreateAuthorInput } from './inputs/create-author.input'
import { UpdateAuthorInput } from './inputs/update-author.input'

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Query(() => [Author], { name: 'authors' })
  findAll() {
    return this.authorsService.list()
  }

  @Query(() => Author, { name: 'author' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.authorsService.findById(id)
  }

  @Mutation(() => Author)
  createAuthor(@Args('createAuthorInput') createAuthorInput: CreateAuthorInput) {
    return this.authorsService.create(createAuthorInput)
  }

  @Mutation(() => Author)
  updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput) {
    return this.authorsService.update(updateAuthorInput.id, updateAuthorInput)
  }

  @Mutation(() => Author)
  removeAuthor(@Args('id', { type: () => ID }) id: string) {
    return this.authorsService.remove(id)
  }
}
