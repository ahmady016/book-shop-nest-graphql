import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Book } from './entities/book.entity'
import { Author } from './entities/author.entity'

import { CreateAuthorInput } from './inputs/create-author.input'
import { UpdateAuthorInput } from './inputs/update-author.input'

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorsRepo: Repository<Author>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
  ) {}

  async findBooks(authorId: string) {
    let existedAuthor = await this.authorsRepo.findOne(authorId, {
      relations: ['books'],
    })
    return existedAuthor?.books
  }

  list() {
    return this.authorsRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    let existedAuthor = await this.authorsRepo.findOne(id)
    if (!existedAuthor) throw new NotFoundException('author not found')
    return existedAuthor
  }

  create(createAuthorInput: CreateAuthorInput) {
    let newAuthor = this.authorsRepo.create(createAuthorInput)
    return this.authorsRepo.save(newAuthor)
  }

  async update(id: string, updateBookInput: UpdateAuthorInput) {
    let existedAuthor = await this.findById(id)
    let authorToUpdate = this.authorsRepo.merge(existedAuthor, updateBookInput)
    return this.authorsRepo.save(authorToUpdate)
  }

  async remove(id: string) {
    let existedAuthor = await this.findById(id)
    await this.authorsRepo.remove(existedAuthor)
    existedAuthor.id = id
    return existedAuthor
  }
}
