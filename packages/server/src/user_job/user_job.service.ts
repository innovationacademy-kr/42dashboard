import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  //UserInternStatus,
  UserOtherEmploymentStatus,
} from './entity/user_job.entity';

@Injectable()
export class UserJobService {
  constructor(
    // @InjectRepository(UserInternStatus)
    // private readonly userInternStatusRepo: Repository<UserInternStatus>,
    @InjectRepository(UserHrdNetUtilizeConsent)
    private readonly userHrdNetUtilizeConsentRepo: Repository<UserHrdNetUtilizeConsent>,
    @InjectRepository(UserHrdNetUtilize)
    private readonly userHrdNetUtilizeRepo: Repository<UserHrdNetUtilize>,
    @InjectRepository(UserOtherEmploymentStatus)
    private readonly userEmploymentAndFoundRepo: Repository<UserOtherEmploymentStatus>,
    @InjectRepository(UserEmploymentStatus)
    private readonly userEmploymentStatusRepo: Repository<UserEmploymentStatus>,
  ) {}

  async getUserEmploymentAndFound() {
    return await this.userEmploymentAndFoundRepo.find({});
  }
  async getUserEmploymentStatus() {
    return await this.userEmploymentStatusRepo.find({});
  }
  async getUserHrdNetUtilizeConsent() {
    return await this.userHrdNetUtilizeConsentRepo.find({});
  }
  async getUserHrdNetUtilize() {
    return await this.userHrdNetUtilizeRepo.find({});
  }
  // async getUserInternStatus() {
  //   return await this.userInternStatusRepo.find({});
  // }
}
