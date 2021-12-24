import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'

import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { JwtService } from '@nestjs/jwt'
import { MailerService } from '@nestjs-modules/mailer'

import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'

import {
  ApiRequest,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TokenPayload,
  TokensType,
  getAccessTokenExpiresDate,
  getRefreshTokenExpiresDate,
} from './helpers/auth.types'

import { AccountStatus } from 'src/__common/types'

import { User } from './entities/user.entity'
import { Profile } from 'src/profiles/entities/profile.entity'
import { Book } from 'src/books/entities/book.entity'

import { SignupInput } from './inputs/signup.input'
import { ActivateInput } from './inputs/activate.input'
import { SigninInput } from './inputs/signin.input'
import { UpdateUserInput } from './inputs/update-user.input'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Book) private bookRepo: Repository<Book>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  private createToken(payload: TokenPayload, expiresIn: string) {
    return this.jwtService.sign(payload, { expiresIn })
  }

  private setCookies(res: Response, tokens: TokensType) {
    res.cookie(ACCESS_TOKEN.key, tokens.accessToken, {
      expires: getAccessTokenExpiresDate(),
      httpOnly: true,
    })
    res.cookie(REFRESH_TOKEN.key, tokens.refreshToken, {
      expires: getRefreshTokenExpiresDate(),
      httpOnly: true,
    })
  }

  async createTokensAndSetCookies(user: User, response: Response) {
    try {
      const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      }
      const accessToken = this.createToken(payload, ACCESS_TOKEN.expiresIn)
      const refreshToken = this.createToken(payload, REFRESH_TOKEN.expiresIn)
      this.setCookies(response, { accessToken, refreshToken })
    } catch (error) {
      console.log(
        '🚀: AuthService -> createTokensAndSetCookies -> error',
        error.message,
      )
    }
  }

  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify(token)
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({ email })
  }

  async signup(userInput: SignupInput): Promise<string> {
    // check if a user with the given email is already exists
    const existedUser = await this.userRepo.findOne({ email: userInput.email })
    if (existedUser) {
      throw new UnprocessableEntityException('email already exists!')
    }

    // hash user password and generate the verificationCode
    const hashedPassword = await bcrypt.hash(userInput.password, 12)
    const verificationCode = nanoid(10)
    // create and save the newUser entity
    let newUser = this.userRepo.create({
      email: userInput.email,
      password: hashedPassword,
      verificationCode,
      profile: {
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        birthDate: userInput.birthDate,
        gender: userInput.gender,
      },
    })
    newUser = await this.userRepo.save(newUser)

    // send confirmation mail to the new user
    this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Welcome to Tech-Store App - Confirm your Email',
      html: `
        <h3>Hi ${newUser.profile.firstName} ${newUser.profile.lastName}</>
        <p>Please use the code below to confirm your email</p>
        <p>${verificationCode}</p>
        <p>Thanks</p>
      `,
    })

    // return the new user email
    return newUser.email
  }

  async activate(
    activateInput: ActivateInput,
    response: Response,
  ): Promise<User> {
    // get the user by email
    let currentUser = await this.userRepo.findOne({
      email: activateInput.email,
    })
    // check user exist
    if (!currentUser) {
      throw new BadRequestException('email not found!')
    }
    // check the verification code
    if (activateInput.verificationCode !== currentUser.verificationCode) {
      throw new BadRequestException('wrong code!')
    }

    // activate the user
    currentUser.status = AccountStatus.ACTIVE
    currentUser = await this.userRepo.save(currentUser)

    // then create tokens and set cookies
    await this.createTokensAndSetCookies(currentUser, response)

    // finally return the user info
    return currentUser
  }

  async signin(signinInput: SigninInput, response: Response): Promise<User> {
    // check user email
    const currentUser = await this.userRepo.findOne({
      email: signinInput.email,
    })
    if (!currentUser) {
      throw new BadRequestException('invalid credentials!')
    }

    // check user password
    const passwordMatch = await bcrypt.compare(
      signinInput.password,
      currentUser.password,
    )
    if (!passwordMatch) {
      throw new BadRequestException('invalid credentials!')
    }

    // if both are ok then create tokens and set cookies
    await this.createTokensAndSetCookies(currentUser, response)

    // finally return the user info
    return currentUser
  }

  async refresh(request: Request, response: Response): Promise<User> {
    let currentUser = (request as ApiRequest).currentUser
    if (currentUser) {
      return currentUser
    }

    if (request.cookies) {
      const refreshToken = request.cookies[REFRESH_TOKEN.key]
      console.log(
        '🚀: AuthService => refreshTokens -> refreshToken',
        refreshToken,
      )
      if (refreshToken) {
        try {
          const { email } = this.verifyToken(refreshToken) as TokenPayload
          if (email) {
            currentUser = await this.userRepo.findOne({ email })
            this.createTokensAndSetCookies(currentUser, response)
            return currentUser
          }
        } catch (error) {
          console.log(
            '🚀: AuthService => refreshTokens -> refreshTokenError',
            error,
          )
          throw new UnauthorizedException()
        }
      }
    }

    throw new UnauthorizedException()
  }

  signout(response: Response): string {
    response.clearCookie(ACCESS_TOKEN.key)
    response.clearCookie(REFRESH_TOKEN.key)
    return 'user logged out successfully'
  }

  currentUser(user: User): User {
    if (user) return user
    throw new UnauthorizedException()
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    let existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException('user not found!')
    let userToUpdate = this.userRepo.merge(existedUser, updateUserInput)
    return this.userRepo.save(userToUpdate)
  }

  async removeUser(id: string) {
    const existedUser = await this.userRepo.findOne(id, {
      relations: ['profile'],
    })
    if (!existedUser) throw new NotFoundException('user not found')

    const deletedUser = {
      ...existedUser,
      profile: { ...existedUser.profile },
    }
    await this.profileRepo.remove(existedUser.profile)
    await this.userRepo.remove(existedUser)
    return deletedUser
  }

  findProfile(userId: string) {
    return this.profileRepo.findOne({ userId })
  }

  async findFavoriteBooks(userId: string) {
    let user = await this.userRepo.findOne(userId, {
      relations: ['favoriteBooks'],
    })
    return user?.favoriteBooks
  }

  async addFavoriteBook(bookId: string, userId: string) {
    const existedBook = await this.bookRepo.findOne(bookId)
    if(!existedBook) throw new NotFoundException("book not found!")

    const user = await this.userRepo.findOne(userId, {
      relations: ['favoriteBooks'],
    })
    user.favoriteBooks.push(existedBook)
    await this.userRepo.save(user)
    return user.favoriteBooks
  }

  async removeFavoriteBook(bookId: string, userId: string) {
    const existedBook = await this.bookRepo.findOne(bookId)
    if(!existedBook) throw new NotFoundException("book not found!")

    const user = await this.userRepo.findOne(userId, {
      relations: ['favoriteBooks'],
    })
    user.favoriteBooks = user.favoriteBooks.filter(book => book.id !== bookId)
    await this.userRepo.save(user)
    return user.favoriteBooks
  }
}
