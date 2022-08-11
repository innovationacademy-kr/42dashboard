import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CheckDuplication } from 'src/user_information/argstype/checkDuplication.argstype';
import {
  entityArray,
  getDomain,
} from 'src/user_information/utils/getDomain.utils';
import { DataSource, Repository } from 'typeorm';
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
    @InjectDataSource()
    private dataSource: DataSource,
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
  async getUserLeaningDataAPI(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userLearningDataAPI',
    );
  }

  async getUserCourseExtension(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userCourseExtension',
    );
  }

  async getUserBlackhole(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userBlackhole',
    );
  }

  async getUserLeaveOfAbsence(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userLeaveOfAbsence',
    );
  }

  async getUserInterruptionOfCourse(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userInterruptionOfCourse',
    );
  }

  async getUserLoyaltyManagement(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userLoyaltyManagement',
    );
  }

  async getUserLapiscineInformation(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userLapiscineInformation',
    );
  } //로얄티 추가됨.
}
