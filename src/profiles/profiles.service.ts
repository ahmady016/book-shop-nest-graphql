import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Profile } from './entities/profile.entity'
import { CreateProfileInput } from './inputs/create-profile.input'
import { UpdateProfileInput } from './inputs/update-profile.input'

@Injectable()
export class ProfilesService {
  constructor(@InjectRepository(Profile) private userRepo: Repository<Profile>) {}

  list() {
    return this.userRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    let existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException('user profile not found')
    return existedUser
  }

  create(createUserInput: CreateProfileInput) {
    let newUser = this.userRepo.create(createUserInput)
    return this.userRepo.save(newUser)
  }

  async update(id: string, updateUserInput: UpdateProfileInput) {
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
