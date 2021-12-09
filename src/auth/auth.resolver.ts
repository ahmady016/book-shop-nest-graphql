import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  Resolver,
  ResolveField,
} from '@nestjs/graphql'

import { AuthService } from './auth.service'

import { Authorize } from './helpers/auth.guard'
import { CurrentUser } from './helpers/current-user.decorator'

import { User } from './entities/user.entity'
import { Profile } from 'src/profiles/entities/profile.entity'

import { SignupInput } from './inputs/signup.input'
import { ActivateInput } from './inputs/activate.input'
import { SigninInput } from './inputs/signin.input'

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @ResolveField(() => Profile)
  profile(@Parent() user: User) {
    return this.authService.findProfile(user.id)
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
}
