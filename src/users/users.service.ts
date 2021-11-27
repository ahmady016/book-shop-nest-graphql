import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from './entities/user.entity'
import { CreateUserInput } from './inputs/create-user.input'
import { UpdateUserInput } from './inputs/update-user.input'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  list() {
    return this.userRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    let existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException('user not found')
    return existedUser
  }

  create(createUserInput: CreateUserInput) {
    let newUser = this.userRepo.create(createUserInput)
    return this.userRepo.save(newUser)
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    let existedUser = await this.findById(id)
    let userToUpdate = this.userRepo.merge(existedUser, updateUserInput)
    return this.userRepo.save(userToUpdate)
  }

  async remove(id: string) {
    let existedUser = await this.findById(id)
    await this.userRepo.remove(existedUser)
    existedUser.id = id
    return existedUser
  }
}
