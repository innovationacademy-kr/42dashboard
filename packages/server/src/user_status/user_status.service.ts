import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from './entity/user_status.entity';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(UserLearningDataAPI)
    private userLearningDataAPIRepository: Repository<UserLearningDataAPI>,
    @InjectRepository(UserCourseExtension)
    private userCourseExtensionRepository: Repository<UserCourseExtension>,
    @InjectRepository(UserBlackhole)
    private userBlackholeRepository: Repository<UserBlackhole>,
    @InjectRepository(UserLeaveOfAbsence)
    private userLeaveOfAbsenceRepository: Repository<UserLeaveOfAbsence>,
    @InjectRepository(UserInterruptionOfCourse)
    private userInterruptionOfCourseRepository: Repository<UserInterruptionOfCourse>,
    @InjectRepository(UserLoyaltyManagement)
    private userLoyaltyManagementRepository: Repository<UserLoyaltyManagement>,
    @InjectRepository(UserLapiscineInformation)
    private userLapiscineInformationRepository: Repository<UserLapiscineInformation>,
  ) {}
  async getUserLeaningDataAPI() {
    return await this.userLearningDataAPIRepository.find({});
  }
  async getUserCourseExtension() {
    return await this.userCourseExtensionRepository.find({});
  }
  async getUserBlackhole() {
    return await this.userBlackholeRepository.find({});
  }
  async getUserLeaveOfAbsence() {
    return await this.userLeaveOfAbsenceRepository.find({});
  }
  async getUserInterruptionOfCourse() {
    return await this.userInterruptionOfCourseRepository.find({});
  }
  async getUserLoyaltyManagement() {
    return await this.userLoyaltyManagementRepository.find({});
  }
  async getUserLapiscineInformation() {
    return await this.userLapiscineInformationRepository.find({});
  } //로얄티 추가됨.
}
