import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CheckDuplication } from 'src/user_information/argstype/checkDuplication.argstype';
import {
  entityArray,
  getDomain,
} from 'src/user_information/utils/getDomain.utils';
import { DataSource, Repository } from 'typeorm';
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
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getUserOtherEmploymentStatus(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userOtherEmploymentStatus',
    );
  }

  async getUserEmploymentStatus(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userEmploymentStatus',
    );
  }

  async getUserHrdNetUtilizeConsent(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userHrdNetUtilizeConsent',
    );
  }

  async getUserHrdNetUtilize(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userHrdNetUtilize',
    );
  }
}
