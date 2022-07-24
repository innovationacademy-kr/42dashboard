import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CheckDuplication } from 'src/user_information/argstype/checkDuplication.argstype';
import { User } from 'src/user_information/entity/user_information.entity';
import {
  entityArray,
  getDomain,
} from 'src/user_information/utils/getDomain.utils';
import { DataSource, Repository } from 'typeorm';
import {
  UserComputationFund,
  UserEducationFundState,
} from './entity/user_payment.entity';

@Injectable()
export class UserPaymentService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(UserComputationFund)
    private readonly userComputationFund: Repository<UserComputationFund>,
    @InjectRepository(UserEducationFundState)
    private readonly userEducationFundState: Repository<UserEducationFundState>,
  ) {}

  async getUserComputationFund(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userComputationFund',
    );
  }

  async getUserEducationFundState(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userEducationFundState',
    );
  }

  async getUserCompotationFundById(): Promise<UserComputationFund> {
    return await this.getUserCompotationFundById();
  }
}
