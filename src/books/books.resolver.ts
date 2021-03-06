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
import { BooksService } from './books.service'

import { Book } from './entities/book.entity'
import { Author } from './entities/author.entity'
import { User } from 'src/auth/entities/user.entity'
import { Rating } from 'src/ratings/entities/rating.entity'
import { PurchaseItem } from 'src/purchases/entities/purchase-item.entity'
import { SaleItem } from 'src/sales/entities/sale-item.entity'

import { CreateBookInput } from './inputs/create-book.input'
import { UpdateBookInput } from './inputs/update-book.input'
@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @ResolveField(() => [Author])
  authors(@Parent() book: Book) {
    return this.booksService.findAuthors(book.id)
  }

  @ResolveField(() => [User])
  favoriteCustomers(@Parent() book: Book) {
    return this.booksService.findFavoriteCustomers(book.id)
  }

  @ResolveField(() => [Comment])
  comments(@Parent() book: Book) {
    return this.booksService.findComments(book.id)
  }

  @ResolveField(() => [Rating])
  ratings(@Parent() book: Book) {
    return this.booksService.findRatings(book.id)
  }

  @ResolveField(() => [PurchaseItem])
  purchasesItems(@Parent() book: Book) {
    return this.booksService.findPurchasesItems(book.id)
  }

  @ResolveField(() => [SaleItem])
  salesItems(@Parent() book: Book) {
    return this.booksService.findSalesItems(book.id)
  }

  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.booksService.list()
  }

  @Query(() => Book, { name: 'book' })
  findById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
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
  removeBook(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.booksService.remove(id)
  }
}
