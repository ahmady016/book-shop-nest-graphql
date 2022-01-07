import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Book } from './entities/book.entity'
import { Stock } from './entities/stock.entity'
import { Author } from './entities/author.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { Rating } from 'src/ratings/entities/rating.entity'
import { PurchaseItem } from 'src/purchases/entities/purchase-item.entity'
import { SaleItem } from 'src/sales/entities/sale-item.entity'

import { CreateBookInput } from './inputs/create-book.input'
import { UpdateBookInput } from './inputs/update-book.input'

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(Stock) private stocksRepo: Repository<Stock>,
    @InjectRepository(Author) private authorsRepo: Repository<Author>,
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    @InjectRepository(Rating) private ratingsRepo: Repository<Rating>,
    @InjectRepository(PurchaseItem) private purchasesItemsRepo: Repository<PurchaseItem>,
    @InjectRepository(SaleItem) private salesItemsRepo: Repository<SaleItem>,
  ) {}

  async findAuthors(bookId: string) {
    let existedBook = await this.booksRepo.findOne(bookId, {
      relations: ['authors'],
    })
    return existedBook?.authors
  }

  async findFavoriteCustomers(bookId: string) {
    let existedBook = await this.booksRepo.findOne(bookId, {
      relations: ['favoriteCustomers'],
    })
    return existedBook?.favoriteCustomers
  }

  findComments(bookId: string) {
    return this.commentsRepo.find({ bookId })
  }

  findRatings(bookId: string) {
    return this.ratingsRepo.find({ bookId })
  }

  findPurchasesItems(bookId: string) {
    return this.purchasesItemsRepo.find({ bookId })
  }

  findSalesItems(bookId: string) {
    return this.salesItemsRepo.find({ bookId })
  }

  list() {
    return this.booksRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    let existedBook = await this.booksRepo.findOne(id)
    if (!existedBook) throw new NotFoundException('book not found')
    return existedBook
  }

  async create(createBookInput: CreateBookInput) {
    // create and save book with authors
    const { authorsIds,  ...bookToCreate } = createBookInput
    let newBook = this.booksRepo.create(bookToCreate)
    newBook.authors = await this.authorsRepo.findByIds(authorsIds)
    newBook = await this.booksRepo.save(newBook)
    // create and save book stock with default values
    const newStock = this.stocksRepo.create({ bookId: newBook.id })
    await this.stocksRepo.save(newStock)
    // return newBook
    return newBook
  }

  async update(id: string, updateBookInput: UpdateBookInput) {
    let existedBook = await this.booksRepo.findOne(id, {
      relations: ['authors'],
    })
    if (!existedBook) throw new NotFoundException('book not found')

    let bookToUpdate = this.booksRepo.merge(existedBook, updateBookInput)
    if (updateBookInput.authorsIds)
      bookToUpdate.authors = await this.authorsRepo.findByIds(updateBookInput.authorsIds)

    return this.booksRepo.save(bookToUpdate)
  }

  async remove(id: string) {
    let existedBook = await this.findById(id)
    await this.booksRepo.remove(existedBook)
    existedBook.id = id
    return existedBook
  }
}
