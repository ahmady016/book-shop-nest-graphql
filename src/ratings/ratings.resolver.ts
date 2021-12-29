import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { ParseUUIDPipe } from '@nestjs/common'

import { RatingsService } from './ratings.service'

import { Authorize } from 'src/auth/helpers/auth.guard'
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'
import { UserRole } from 'src/__common/types'

import { Rating } from './entities/rating.entity'
import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'

import { CreateRatingInput } from './inputs/create-rating.input'
import { UpdateRatingInput } from './inputs/update-rating.input'

@Resolver(() => Rating)
export class RatingsResolver {
  constructor(private readonly ratingsService: RatingsService) {}

  @ResolveField(() => User)
  customer(@Parent() rating: Rating) {
    return this.ratingsService.findCustomer(rating.customerId)
  }

  @ResolveField(() => Book)
  book(@Parent() rating: Rating) {
    return this.ratingsService.findBook(rating.bookId)
  }

  @Query(() => [Rating], { name: 'ratings' })
  list() {
    return this.ratingsService.list()
  }

  @Query(() => Rating, { name: 'rating' })
  findById(@Args('id', { type: () => Int }, ParseUUIDPipe) id: string) {
    return this.ratingsService.findById(id)
  }

  @Authorize(UserRole.CUSTOMER)
  @Mutation(() => Rating)
  createRating(
    @Args('createRatingInput') createRatingInput: CreateRatingInput,
    @CurrentUser() user: User,
  ) {
    return this.ratingsService.create(createRatingInput, user.id)
  }

  @Authorize(UserRole.CUSTOMER)
  @Mutation(() => Rating)
  updateRating(
    @Args('updateRatingInput') updateRatingInput: UpdateRatingInput,
  ) {
    return this.ratingsService.update(updateRatingInput.id, updateRatingInput.value)
  }

  @Authorize(UserRole.CUSTOMER)
  @Mutation(() => Rating)
  removeRating(@Args('id', { type: () => Int }, ParseUUIDPipe) id: string) {
    return this.ratingsService.remove(id)
  }
}
