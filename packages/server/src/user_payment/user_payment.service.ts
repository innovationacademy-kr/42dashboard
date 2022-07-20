import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user_information/entity/user_information.entity';
import { Repository } from 'typeorm';
import {
  UserComputationFund,
  UserEducationFundState,
} from './entity/user_payment.entity';

@Injectable()
export class UserPaymentService {
  constructor(
    @InjectRepository(UserComputationFund)
    private readonly userComputationFund: Repository<UserComputationFund>,
    @InjectRepository(UserEducationFundState)
    private readonly userEducationFundState: Repository<UserEducationFundState>,
  ) {}

  async getUserComputationFund(): Promise<UserComputationFund[]> {
    return await this.userComputationFund.find({});
  }

  async getUserCompotationFundById(): Promise<UserComputationFund> {
    return await this.getUserCompotationFundById();
  }

  async getUserEducationFundState(): Promise<UserEducationFundState[]> {
    return await this.userEducationFundState.find({});
  }
}
