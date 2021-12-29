import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Rating } from './entities/rating.entity'
import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'

import { CreateRatingInput } from './inputs/create-rating.input'
import { UpdateRatingInput } from './inputs/update-rating.input'

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingsRepo: Repository<Rating>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
  ) {}

  findCustomer(customerId: string) {
    return this.usersRepo.findOne(customerId)
  }

  findBook(bookId: string) {
    return this.booksRepo.findOne(bookId)
  }

  list() {
    return this.ratingsRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    let existedRating = await this.ratingsRepo.findOne(id)
    if (!existedRating) throw new NotFoundException('rating not found')
    return existedRating
  }

  async create(createRatingInput: CreateRatingInput, customerId: string) {
    // find existedBook by bookId including ratings
    let existedBook = await this.booksRepo.findOne(createRatingInput.bookId, {
      relations: ['ratings'],
    })
    if (!existedBook) throw new BadRequestException('invalid bookId')

    // create and save new rating value
    let newRating = this.ratingsRepo.create({
      ...createRatingInput,
      customerId,
    })
    newRating = await this.ratingsRepo.save(newRating)

    // calc the ratingsCount and ratingAverage
    existedBook.ratingsCount += 1
    let totalRatingValue =
      existedBook.ratings.reduce((total, rating) => total + rating.value, 0) +
      createRatingInput.value
    existedBook.ratingAverage = totalRatingValue / existedBook.ratingsCount

    // save existedBook
    delete existedBook.ratings
    await this.booksRepo.save(existedBook)

    // return the newRating
    return newRating
  }

  async update(id: string, value: number) {
    const existedRating = await this.findById(id)
    const diffRatingValue = value - existedRating.value
    existedRating.value = value
    const updatedRating = await this.ratingsRepo.save(existedRating)

    // find existedBook by bookId including ratings
    let existedBook = await this.booksRepo.findOne(existedRating.bookId, {
      relations: ['ratings'],
    })

    // calc ratingAverage
    let totalRatingValue =
      existedBook.ratings.reduce((total, rating) => total + rating.value, 0) +
      diffRatingValue
    existedBook.ratingAverage = totalRatingValue / existedBook.ratingsCount

    // save existedBook
    delete existedBook.ratings
    await this.booksRepo.save(existedBook)

    return updatedRating
  }

  async remove(id: string) {
    let existedRating = await this.findById(id)
    await this.ratingsRepo.remove(existedRating)

    // find existedBook by bookId including ratings
    let existedBook = await this.booksRepo.findOne(existedRating.bookId, {
      relations: ['ratings'],
    })

    // calc the ratingsCount and ratingAverage
    existedBook.ratingsCount -= 1
    let totalRatingValue =
      existedBook.ratings.reduce((total, rating) => total + rating.value, 0) -
      existedRating.value
    existedBook.ratingAverage = totalRatingValue / existedBook.ratingsCount

    // save existedBook
    delete existedBook.ratings
    await this.booksRepo.save(existedBook)

    existedRating.id = id
    return existedRating
  }
}
