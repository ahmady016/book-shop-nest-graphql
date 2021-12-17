import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'

import { BooksService } from './books.service'

import { Book } from './entities/book.entity'
import { CreateBookInput } from './inputs/create-book.input'
import { UpdateBookInput } from './inputs/update-book.input'

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.booksService.list()
  }

  @Query(() => Book, { name: 'book' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.booksService.findById(id)
  }

  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput)
  }

  @Mutation(() => Book)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.booksService.update(updateBookInput.id, updateBookInput)
  }

  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => ID }) id: string) {
    return this.booksService.remove(id)
  }
}
