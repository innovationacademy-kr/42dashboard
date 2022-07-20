import { UserBlackhole } from 'src/user_status/entity/user_status.entity';
import { QueryRunner, Repository } from 'typeorm';
import { createDB, createMemDB } from '../utils/testing-helpers/createMemDB';
import { DataSource } from 'typeorm';
import { User } from './entity/user_information.entity';
import { UserPersonalInformation } from './entity/user_personal_information.entity';
import { UserInformationService } from './user_information.service';
import { FilterArgs } from './argstype/filter.argstype';

const userList = [
  {
    intra_no: 1,
    intra_id: 'huchoi',
    name: 'hunjin',
    grade: '3기',
    start_process: new Date('2020-12-31'),
    academic_state: '재학',
  },
  {
    intra_no: 2,
    intra_id: 'IU',
    name: '아이유',
    grade: '2기',
    start_process: new Date('2020-06-31'),
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
      blackhole_date: new Date('2021-01-01'),
    },
    {
      remaining_period: 87,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-01'),
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
      blackhole_date: new Date('2021-01-01'),
    },
    {
      remaining_period: 198,
      reason_of_blackhole: null,
      blackhole_date: new Date('2021-01-01'),
    },
  ],
};

const userLeaveOfAbsence = {
  1: [
    {
      start_absence_date: '2022-01-01',
      end_absence_date: '2022-06-01',
      return_from_absence_date: '2022-06-01',
      absence_reason: '군휴학',
    },
    {
      start_absence_date: '2021-12-01',
      end_absence_date: '2021-12-31',
      return_from_absence_date: '2021-12-31',
      absence_reason: '개인사정',
    },
  ],
  2: [],
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
  let userRepository: Repository<User>;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    // db = await createMemDB([User]);
    db = await createDB([User]);
    queryRunner = db.createQueryRunner();
    await db.initialize();
    userService = new UserInformationService(db); // <--- manually inject
    //given
    const userRepo = db.getRepository(User);
    const userPersonalRepo = db.getRepository(UserPersonalInformation);
    const userBlackholeRepo = db.getRepository(UserBlackhole);
    let userEntity, userPersonalEntity, userBlackholeEntity;
    for (const idx in userList) {
      userEntity = userRepo.create(userList[idx]);
      for (const adx in userPersonalInformationObject[userEntity.intra_no]) {
        userPersonalEntity = userPersonalRepo.create(
          userPersonalInformationObject[userEntity.intra_no][adx],
        );
        userEntity.userPersonalInformation = userPersonalEntity;
        await userPersonalRepo.save(userPersonalEntity); //cascade 쓰면 이 작업 불필요 -> cascade, eager 쓸지말지 고민해보기
        await userRepo.save(userEntity);
      }
      for (const bdx in userBlackholeObject[userEntity.intra_no]) {
        userBlackholeEntity = await userPersonalRepo.create(
          userBlackholeObject[userEntity.intra_no][bdx],
        );
        userBlackholeEntity.user = userEntity; //반대로는 안됨
        await userBlackholeRepo.save(userBlackholeEntity); //cascade 쓰면 이 작업 불필요 -> cascade, eager 쓸지말지 고민해보기
        await userRepo.save(userEntity);
      }
      for (const cdx in userBlackholeObject[userEntity.intra_no]) {
        userBlackholeEntity = await userPersonalRepo.create(
          userBlackholeObject[userEntity.intra_no][cdx],
        );
        userBlackholeEntity.user = userEntity; //반대로는 안됨
        await userBlackholeRepo.save(userBlackholeEntity); //cascade 쓰면 이 작업 불필요 -> cascade, eager 쓸지말지 고민해보기
        await userRepo.save(userEntity);
      }
    }
  });

  afterAll(() => db.destroy());

  it('필터 [gender = 남]', async () => {
    // given
    // when
    await queryRunner.startTransaction();
    const filterArgs: FilterArgs = new FilterArgs();
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'gender', '=', '남', true),
    );
    filterArgs['filters'] = filters;
    // then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(1);
    await queryRunner.rollbackTransaction();
  });

  it('필터 [region = 부산]', async () => {
    // given
    await queryRunner.startTransaction();
    // when
    const filterArgs: FilterArgs = new FilterArgs();
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'region', '=', '부산', true),
    );
    filterArgs['filters'] = filters;
    // then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(2);
    await queryRunner.rollbackTransaction();
  });

  it('필터 [gender= 남], [acdemic_state != 블랙홀]', async () => {
    //given
    //when
    await queryRunner.startTransaction();
    const filterArgs: FilterArgs = new FilterArgs();
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'gender', '=', '남', true),
    );
    filters.push(makeFilter('user', 'academic_state', '!=', '블랙홀', true));
    filterArgs['filters'] = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(1);
  });

  it('필터 [region = 부산], [acdemic_state != 블랙홀]', async () => {
    //given
    await queryRunner.startTransaction();
    const filters = [];
    //when
    const filterArgs: FilterArgs = new FilterArgs();
    filters.push(
      makeFilter('userPersonalInformation', 'region', '=', '부산', true),
    );
    filters.push(makeFilter('user', 'academic_state', '!=', '블랙홀', true));
    filterArgs['filters'] = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(2);
    await queryRunner.rollbackTransaction();
  });

  // 이 필터링은 간단함 (user table에 해당 정보가 있으니까)
  // 까다로운것은 필터링이 user table이 아닌 talbe에 적용되는 상황
  it('현재시점을 기준으로 휴학인 사람이 몇명인지를 뽑고싶다.', async () => {
    //given
    await queryRunner.startTransaction();
    const filters = [];
    const filterArgs: FilterArgs = new FilterArgs();
    //when
    filters.push(makeFilter('user', 'academic_state', '=', '휴학', true));
    filterArgs['filters'] = filters;
    //then
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filterArgs)).toBe(0);
    await queryRunner.rollbackTransaction();
  });

  // 까다로운 상황은 아래 두가지 상황
  // 필터링이 user table이 아닌 talbe에 적용되는 까다로운 상황
  // '시점'이 필터링 조건으로 들어가는 까다로운 상황 (현재시점이든 과거시점이든)
  // validated_date, expried_date 컬럼이 추가만 된다면 모든 필터링을 다 처리할수 있는지???
  it('과거의 특정시점에서 휴학인 카뎃이 몇명인지를 뽑고싶다.', async () => {
    //given
    await queryRunner.startTransaction();
    //when
    // return_from_absence_data와 end_absence_date 컬럼은 각각 무슨 의미인지 질문드리기
    // null 여부, 상황을 예로 들어 들어보기
    //then
    await queryRunner.rollbackTransaction();
  });
  // eslint-disable-next-line prettier/prettier
  it.todo('2022년 5월에 휴학이었던 카뎃이 몇명인지를 뽑고싶다. <- 요청자체가 애매모호한거...');
  it.todo('현재 시점으로부터 한달뒤에 과정진행중인 카뎃이 몇명인지를 뽑고싶다');
  it.todo('특정 카뎃의 라피신 참여이력을 뽑고싶다.');
  it.todo('라피신을 2번이상 참여한 이력이 있는 카뎃이 몇명인지를 뽑고싶다.');
  it.todo('블랙홀이 10일 이하인 카뎃이 몇명인지를 뽑고싶다.');
  it.todo('(어떤 사유든) 현재 [재학중]이지 않은 카뎃이 몇명인지를 뽑고싶다.');
  it.todo('[재학상태 혹은 휴학상태가 아닌 카뎃이 몇명인지를 뽑고싶다.');
  it.todo('지원금을 받은 횟수가 3번 이상인 카뎃이 몇명인지를 뽑고싶다.');
  it.todo('총 지급금액이 500만원 이상인 카뎃이 몇명인지를 뽑고싶다.');
  it.todo('취업이 된 카뎃이 몇명인지를 뽑고싶다.');
  // eslint-disable-next-line prettier/prettier
  it.todo('취업이 되었고, hrd_net으로 취업 확인 된 카뎃이 몇명인지 뽑고싶다.');
  // eslint-disable-next-line prettier/prettier
  it.todo(
    '취업이 되었고, hrd_net으로 취업 확인은 안된 카뎃이 몇명인지 뽑고싶다.',
  );
  // 관리자 api가 실행될때, DB의 일관성이 파괴되지 않는지 세밀하게 검증
  // 문제가 될만한 상황을 테스트
  it.todo('관리자 api로 userInformation Insert');
  it.todo('관리자 api로 userInformation Update');
  it.todo('관리자 api로 userInforamtion Delete');
  it.todo('관리자 api로 userInformation Recover');
});
