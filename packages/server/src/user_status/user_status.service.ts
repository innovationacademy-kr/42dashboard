import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserBlackhole,
  UserLearningData,
  UserLeaveOfAbsence,
  UserProcessProgress,
  UserReasonOfBreak,
} from './entity/user_status.entity';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(UserLearningData)
    private userLearningDataRepository: Repository<UserLearningData>,
    @InjectRepository(UserProcessProgress)
    private userProcessProgressPersonalRepository: Repository<UserProcessProgress>,
    @InjectRepository(UserBlackhole)
    private userBlackholeRepository: Repository<UserBlackhole>,
    @InjectRepository(UserLeaveOfAbsence)
    private userLeaveOfAbsenceRepository: Repository<UserLeaveOfAbsence>,
    @InjectRepository(UserReasonOfBreak)
    private userReasonOfBreakRepository: Repository<UserReasonOfBreak>,
  ) {}
  async getUserReasonOfBreak() {
    return await this.userReasonOfBreakRepository.find({});
  }
  async getUserLeaveOfAbsence() {
    return await this.userLeaveOfAbsenceRepository.find({});
  }
  async getUserBlackhole() {
    return await this.userBlackholeRepository.find({});
  }
  async getUserProcessProgress() {
    return await this.userProcessProgressPersonalRepository.find({});
  }
  async getUserLeaningData() {
    return await this.userLearningDataRepository.find({});
  }
}
