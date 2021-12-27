import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { ParseUUIDPipe } from '@nestjs/common'

import { CommentsService } from './comments.service'
import { Authorize } from 'src/auth/helpers/auth.guard'
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'

import { Comment } from './entities/comment.entity'
import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'

import { CreateCommentInput } from './inputs/create-comment.input'
import { UpdateCommentInput } from './inputs/update-comment.input'

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @ResolveField(() => User)
  customer(@Parent() comment: Comment) {
    return this.commentsService.findCustomer(comment.customerId)
  }

  @ResolveField(() => Book)
  book(@Parent() comment: Comment) {
    return this.commentsService.findBook(comment.bookId)
  }

  @Query(() => [Comment], { name: 'comments' })
  list() {
    return this.commentsService.list()
  }

  @Query(() => Comment, { name: 'comment' })
  findById(@Args('id', { type: () => Int }, ParseUUIDPipe) id: string) {
    return this.commentsService.findById(id)
  }

  @Query(() => [Comment], { name: 'bookComments' })
  bookComments(
    @Args('booKId', { type: () => ID }, ParseUUIDPipe) booKId: string,
  ) {
    return this.commentsService.bookComments(booKId)
  }

  @Authorize()
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(createCommentInput, user.id)
  }

  @Authorize()
  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentsService.update(
      updateCommentInput.id,
      updateCommentInput,
    )
  }

  @Authorize()
  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => Int }, ParseUUIDPipe) id: string) {
    return this.commentsService.remove(id)
  }
}
