import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  Resolver,
  ResolveField,
  ID,
} from '@nestjs/graphql'

import { ParseUUIDPipe } from '@nestjs/common'

import { AuthService } from './auth.service'

import { Authorize } from './helpers/auth.guard'
import { CurrentUser } from './helpers/current-user.decorator'

import { User } from './entities/user.entity'
import { Profile } from 'src/profiles/entities/profile.entity'
import { Book } from 'src/books/entities/book.entity'
import { Comment } from 'src/comments/entities/comment.entity'

import { SignupInput } from './inputs/signup.input'
import { ActivateInput } from './inputs/activate.input'
import { SigninInput } from './inputs/signin.input'
import { UpdateUserInput } from './inputs/update-user.input'

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @ResolveField(() => Profile)
  profile(@Parent() user: User) {
    return this.authService.findProfile(user.id)
  }

  @ResolveField(() => [Book])
  favoriteBooks(@Parent() user: User) {
    return this.authService.findFavoriteBooks(user.id)
  }

  @ResolveField(() => [Comment])
  comments(@Parent() user: User) {
    return this.authService.findComments(user.id)
  }

  @Mutation(() => String)
  signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput)
  }

  @Mutation(() => User)
  activate(@Args('activateInput') input: ActivateInput, @Context() { res }) {
    return this.authService.activate(input, res)
  }

  @Mutation(() => User)
  signin(@Args('signinInput') signinInput: SigninInput, @Context() { res }) {
    return this.authService.signin(signinInput, res)
  }

  @Mutation(() => User)
  refresh(@Context() { req, res }) {
    return this.authService.refresh(req, res)
  }

  @Authorize()
  @Mutation(() => String)
  signout(@Context() { res }) {
    return this.authService.signout(res)
  }

  @Authorize()
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    return this.authService.currentUser(user)
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.authService.update(updateUserInput.id, updateUserInput)
  }

  @Authorize()
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.authService.removeUser(id)
  }

  @Authorize()
  @Mutation(() => [Book])
  addFavoriteBook(
    @Args('booKId', { type: () => ID }, ParseUUIDPipe) booKId: string,
    @CurrentUser() user: User,
  ) {
    return this.authService.addFavoriteBook(booKId, user.id)
  }

  @Authorize()
  @Mutation(() => [Book])
  removeFavoriteBook(
    @Args('booKId', { type: () => ID }, ParseUUIDPipe) booKId: string,
    @CurrentUser() user: User,
  ) {
    return this.authService.removeFavoriteBook(booKId, user.id)
  }
}
