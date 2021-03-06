import { filter, last } from 'rxjs';
import {
  UserBlackhole,
  UserLeaveOfAbsence,
} from 'src/user_status/entity/user_status.entity';
import { QueryRunner, Repository } from 'typeorm';
import { createMemDB } from '../utils/testing-helpers/createMemDB';
import { Test, TestingModule } from '@nestjs/testing';

import {
  getDataSourceToken,
  getRepositoryToken,
  InjectDataSource,
} from '@nestjs/typeorm';

import { DataSource, LessThan } from 'typeorm';
import { UserAccessCardInformation } from './entity/user_access_card_information.entity';
import { User } from './entity/user_information.entity';
import { UserPersonalInformation } from './entity/user_personal_information.entity';
import { UserInformationService } from './user_information.service';
import { FilterArgs } from './argstype/filter.argstype';

const userList = [
  {
    intra_no: 1,
    intra_id: 'huchoi',
    name: 'hunjin-choi',
    grade: '3기',
    start_process_date: new Date('2020-12-31'),
    academic_state: '재학',
  },
  {
    intra_no: 2,
    intra_id: 'IU',
    name: '아이유',
    grade: '2기',
    start_process_date: new Date('2020-06-31'),
    academic_state: '재학',
  },
  {
    intra_no: 3,
    intra_id: '휴학안함',
    name: '휴학안함',
    grade: '1기',
    start_process: new Date('2020-01-31'),
    academic_state: '재학',
  },
];

const userPersonalInformationObject = {
  1: [
    {
      region: '부산',
      gender: '남',
      email: 'testnyz1058@nate.com',
    },
  ],
  2: [
    {
      region: '부산',
      gender: '여',
      email: 'iu@nate.com',
    },
  ],
};

const userBlackholeObject = {
  1: [
    {
      remaining_period: 89,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-01'),
    },
    {
      remaining_period: 88,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-02'),
    },
    {
      remaining_period: 87,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-03'),
    },
  ],
  2: [
    {
      remaining_period: 200,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-01'),
    },
    {
      remaining_period: 199,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-02'),
    },
    {
      remaining_period: 198,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-03'),
    },
  ],
};
const userLeaveOfAbsenceObject = {
  1: [
    {
      absenced: '휴학',
      begin_absence_date: '2022-01-01',
      end_absence_date: '2022-12-01',
      validate_date: '2022-01-01',
      expired_date: '2022-12-01',
    },
    /**
     * expired_date 를 null로 할지 "9999-12-31"로 할지 고민해보기
     */
    {
      absenced: '복학',
      begin_absence_date: '2022-12-01',
      end_absence_date: '9999-12-31',
      validate_date: '2022-12-01',
      expired_date: '9999-12-31',
    },
  ],
  2: [
    {
      absenced: '휴학',
      validate_date: '2021-01-01',
      expired_date: '2021-12-01',
      begin_absence_date: '2021-01-01',
      end_absence_date: '2021-12-01',
    },
  ],
  3: [],
};
function makeFilter(
  entityName: string,
  column: string,
  operator: any,
  givenValue: any,
  latest: boolean,
) {
  const ret = {};
  ret['entityName'] = entityName;
  ret['column'] = column;
  ret['operator'] = operator;
  ret['givenValue'] = givenValue;
  ret['latest'] = latest;
  return ret;
}

describe('User Service', () => {
  let db: DataSource;
  let userService: UserInformationService;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    db = await createMemDB([User]);
    await db.initialize();
    userService = new UserInformationService(db); // <--- manually inject
    //given
    const userRepo = db.getRepository(User);
    const userPersonalRepo = db.getRepository(UserPersonalInformation);
    const userBlackholeRepo = db.getRepository(UserBlackhole);
    const userLeaveOfAbsenceRepo = db.getRepository(UserLeaveOfAbsence);
    let userEntity,
      userPersonalEntity,
      userBlackholeEntity,
      userLeaveOfAbsenceEntity;
    let index;
    for (index in userList) {
      userEntity = userRepo.create(userList[index]);
      userEntity = await userRepo.save(userEntity);
      for (index in userPersonalInformationObject[userEntity.intra_no]) {
        userPersonalEntity = userPersonalRepo.create(
          userPersonalInformationObject[userEntity.intra_no][index],
        );
        userPersonalEntity.user = userEntity;
        await userPersonalRepo.save(userPersonalEntity); //cascade 쓰면 이 작업 불필요 -> cascade, eager 쓸지말지 고민해보기
        userEntity = await userRepo.save(userEntity);
      }
      for (index in userBlackholeObject[userEntity.intra_no]) {
        userBlackholeEntity = await userPersonalRepo.create(
          userBlackholeObject[userEntity.intra_no][index],
        );
        userBlackholeEntity.user = userEntity;
        await userBlackholeRepo.save(userBlackholeEntity); //cascade 쓰면 이 작업 불필요 -> cascade, eager 쓸지말지 고민해보기
        userEntity = await userRepo.save(userEntity);
      }
      for (index in userLeaveOfAbsenceObject[userEntity.intra_no]) {
        userLeaveOfAbsenceEntity = await userLeaveOfAbsenceRepo.create(
          userLeaveOfAbsenceObject[userEntity.intra_no][index],
        );
        userLeaveOfAbsenceEntity.user = userEntity;
        await userLeaveOfAbsenceRepo.save(userLeaveOfAbsenceEntity); //cascade 쓰면 이 작업 불필요 -> cascade, eager 쓸지말지 고민해보기
        userEntity = await userRepo.save(userEntity);
      }
    }
  });

  afterAll(() => db.destroy());

  it('필터 [gender = 남]', async () => {
    // given
    // when
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'gender', '=', '남', true),
    );
    const filterArgs: FilterArgs = new FilterArgs();
    filterArgs.filters = filters;
    // then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(1);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('필터 [region = 부산]', async () => {
    // given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    // when
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'region', '=', '부산', true),
    );
    const filterArgs: FilterArgs = new FilterArgs();
    filterArgs.filters = filters;
    // then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(2);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('필터 [gender= 남], [acdemic_state != 블랙홀]', async () => {
    //given
    //when
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'gender', '=', '남', true),
    );
    filters.push(makeFilter('user', 'academic_state', '!=', '블랙홀', true));
    const filterArgs: FilterArgs = new FilterArgs();
    filterArgs.filters = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(1);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('필터 [region = 부산], [acdemic_state != 블랙홀]', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    //when
    filters.push(
      makeFilter('userPersonalInformation', 'region', '=', '부산', true),
    );
    filters.push(makeFilter('user', 'academic_state', '!=', '블랙홀', true));
    const filterArgs: FilterArgs = new FilterArgs();
    filterArgs.filters = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(2);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('where 쿼리문 적용시 OR 조건이 어떻게 적용되는지 테스트', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    //when
    const userRepository = db.getRepository(User);
    const num = await userRepository.count({
      where: {
        userPersonalInformation: [{ gender: '남' }, { region: '부산' }],
      },
    });
    //then
    expect(num).toBe(2);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('[기간 Range Double] 기간 필터링 적용', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filters.push(
      makeFilter('userLeaveOfAbsence', 'absenced', '==', '휴학', false),
    );
    filterArgs.filters = filters;
    filterArgs.startDate = '2021-03-01';
    //then
    filterArgs.endDate = '2021-05-01';
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(1);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('[기간 Range Single] 한번이라도 휴학을 한 사람이 몇명?', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filters.push(
      makeFilter('userLeaveOfAbsence', 'absenced', '==', '휴학', false),
    );
    filterArgs.startDate = '1111-01-01'; //1기 시작날짜를 디폴트로 주는게 나을듯
    filterArgs.filters = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(2);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('[기간 Range Single] startDate만 주고, validate_date 와 expired_date에 걸치는 상황', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filters.push(
      makeFilter('userLeaveOfAbsence', 'absenced', '==', '휴학', false),
    );
    filterArgs.startDate = '2022-03-01';
    filterArgs.filters = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(1);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('[기간 Range Single] 한번이라도 휴학을 한 사람이 몇명? - 2', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filters.push(
      makeFilter('userLeaveOfAbsence', 'absenced', '==', '휴학', false),
    );
    filterArgs.endDate = new Date();
    filterArgs.filters = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(2);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('[기간 Range Single] endDate만 주고, validate_date 와 expired_date에 걸치는 상황', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filters.push(
      makeFilter('userLeaveOfAbsence', 'absenced', '==', '휴학', false),
    );
    filterArgs.endDate = '2022-03-01';
    filterArgs.filters = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(2);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('[시점 특정] startDate=endDate이고 해당 시점에 휴학인 사람', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filters.push(
      makeFilter('userLeaveOfAbsence', 'absenced', '==', '휴학', false),
    );
    filterArgs.startDate = '2022-03-01';
    filterArgs.endDate = '2022-03-01';
    filterArgs.filters = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(1);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('validate_date & expired_date를 사용하지 않는 테이블에대해 기간 필터링 조건을 걸때', async () => {
    //given
    queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filterArgs.filters = filters;
    //then
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });
});
