import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from 'src/auth/entities/user.entity'
import { Profile } from './entities/profile.entity'
import { CreateProfileInput } from './inputs/create-profile.input'
import { UpdateProfileInput } from './inputs/update-profile.input'

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  findUser(userId: string) {
    return this.userRepo.findOne(userId)
  }

  list() {
    return this.profileRepo.find({ order: { createdAt: 'ASC' } })
  }

  async findById(id: string) {
    let existedProfile = await this.profileRepo.findOne(id)
    if (!existedProfile) throw new NotFoundException('user profile not found')
    return existedProfile
  }

  create(createProfileInput: CreateProfileInput) {
    let newProfile = this.profileRepo.create(createProfileInput)
    return this.profileRepo.save(newProfile)
  }

  async update(id: string, updateProfileInput: UpdateProfileInput) {
    let existedProfile = await this.findById(id)
    let profileToUpdate = this.profileRepo.merge(existedProfile, updateProfileInput)
    return this.profileRepo.save(profileToUpdate)
  }

  async remove(id: string) {
    let existedProfile = await this.findById(id)
    await this.profileRepo.remove(existedProfile)
    existedProfile.id = id
    return existedProfile
  }
}
