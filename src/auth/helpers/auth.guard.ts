import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
  mixin,
  Type,
  Logger,
} from '@nestjs/common'

import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthService } from '../auth.service'
import { ACCESS_TOKEN, TokenPayload } from './auth.types'

export const Authorize = (...roles: string[]) => {
  return UseGuards(AuthGuard(roles))
}

export function AuthGuard(roles: string[]): Type<CanActivate> {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(private auhService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const logger = new Logger('AuthGuard')
      const context = GqlExecutionContext.create(ctx).getContext()
      const { req } = context

      if (req.cookies) {
        const accessToken = req.cookies[ACCESS_TOKEN.key]
        if (accessToken) {
          try {
            const { email } = this.auhService.verifyToken(
              accessToken,
            ) as TokenPayload
            if (email) {
              context.currentUser = await this.auhService.findByEmail(email)
            }
          } catch (error) {
            logger.log(`accessTokenError => ${error}`)
          }
        }
      }

      if (context.currentUser) {
        logger.log(`currentUser (Access Token) => ${context.currentUser.email}`)
        const { role } = context.currentUser
        if (!roles.length || roles.includes(role)) return true
      }

      return false
    }
  }

  return mixin(AuthGuardMixin)
}
