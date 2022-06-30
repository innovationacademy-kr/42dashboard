import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserEmploymentAndFound,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserInternStatus,
} from './entity/user_job.entity';

@Injectable()
export class UserJobService {
  constructor(
    @InjectRepository(UserInternStatus)
    private readonly userInternStatusRepo: Repository<UserInternStatus>,
    @InjectRepository(UserHrdNetUtilize)
    private readonly userHrdNetUtilizeRepo: Repository<UserHrdNetUtilize>,
    @InjectRepository(UserEmploymentAndFound)
    private readonly userEmploymentAndFoundRepo: Repository<UserEmploymentAndFound>,
    @InjectRepository(UserEmploymentStatus)
    private readonly userEmploymentStatusRepo: Repository<UserEmploymentStatus>,
  ) {}

  async getUserEmploymentAndFound() {
    return await this.userEmploymentAndFoundRepo.find({});
  }
  async getUserEmploymentStatus() {
    return await this.userEmploymentStatusRepo.find({});
  }
  async getUserHrdNetUtilize() {
    return await this.userHrdNetUtilizeRepo.find({});
  }
  async getUserInternStatus() {
    return await this.userInternStatusRepo.find({});
  }
}
