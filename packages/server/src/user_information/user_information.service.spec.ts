import { Test, TestingModule } from '@nestjs/testing';
import {
  getDataSourceToken,
  getRepositoryToken,
  InjectDataSource,
} from '@nestjs/typeorm';
import { DataSource, LessThan } from 'typeorm';
import { UserAccessCardInformation } from './entity/user_access_card_information.entity';
import { User } from './entity/user_information.entity';
import { UserOtherInformation } from './entity/user_other_information.entity';
import { UserPersonalInformation } from './entity/user_personal_information.entity';
import { UserInformationService } from './user_information.service';

/**
 * cli test는 npm test 명령어 입력하면 됨
 */

class MockUserRepository {}
class MockUserAccessCardInforMationRepositoty {}
class MockUserPersonalInformationRepository {}
class MockUserOtherInformationRepository {}
class MockDataSource {}
//describe는 파일단위로?
describe('userInformationService', () => {
  let service: UserInformationService;

  /**
   * UserInformationService에서 DI되는것들 다 befirEach에서 가짜로 DI시켜줘야함
   * 그렇지 않으면 테스트 에러발생
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInformationService, //축약형
        // {provider: UserInformationService,
        // useClass: UserInformationService},
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
          //useFactory: function mocking
          //userValue: value mocking
        },
        {
          provide: getRepositoryToken(UserAccessCardInformation),
          useClass: MockUserAccessCardInforMationRepositoty,
        },
        {
          provide: getRepositoryToken(UserPersonalInformation),
          useClass: MockUserPersonalInformationRepository,
        },
        {
          provide: getRepositoryToken(UserOtherInformation),
          useClass: MockUserOtherInformationRepository,
        },
        {
          provide: InjectDataSource,
          useClass: MockDataSource,
        },
      ],
    }).compile(); //가짜 module를 만들어줌
    service = module.get<UserInformationService>(UserInformationService);
  });
  it('service가 반드시 존재해야함', () => {
    expect(service).toBeDefined(); //jest가 지원해주는 함수
  });

  it('findByEmail은 반드시 유저정보를 return 해야합니다', () => {
    expect(service.func1()).toBe(LessThan);
  });
  it.todo('findByUserStatus은 반드시 ~~~을 return 해야합니다.');
});
