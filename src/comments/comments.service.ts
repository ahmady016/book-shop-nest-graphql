import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Comment } from './entities/comment.entity'
import { User } from 'src/auth/entities/user.entity'
import { Book } from 'src/books/entities/book.entity'

import { CreateCommentInput } from './inputs/create-comment.input'
import { UpdateCommentInput } from './inputs/update-comment.input'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
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
    return this.commentsRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    let existedComment = await this.commentsRepo.findOne(id)
    if (!existedComment) throw new NotFoundException('comment not found')
    return existedComment
  }

  bookComments(bookId: string) {
    return this.commentsRepo.find({
      where: { bookId },
      order: { createdAt: 'ASC' },
    })
  }

  create(createCommentInput: CreateCommentInput, customerId: string) {
    let newComment = this.commentsRepo.create({
      ...createCommentInput,
      customerId,
    })
    return this.commentsRepo.save(newComment)
  }

  async update(id: string, updateCommentInput: UpdateCommentInput) {
    let existedComment = await this.findById(id)
    let commentToUpdate = this.commentsRepo.merge(
      existedComment,
      updateCommentInput,
    )
    return this.commentsRepo.save(commentToUpdate)
  }

  async remove(id: string) {
    let existedComment = await this.findById(id)
    await this.commentsRepo.remove(existedComment)
    existedComment.id = id
    return existedComment
  }
}
