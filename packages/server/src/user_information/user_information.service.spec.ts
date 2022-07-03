import { last } from 'rxjs';
import { UserBlackhole } from 'src/user_status/entity/user_status.entity';
import { DataSource, Repository } from 'typeorm';
import { createMemDB } from '../utils/testing-helpers/createMemDB';
import { User } from './entity/user_information.entity';
import { UserPersonalInformation } from './entity/user_personal_information.entity';
import { UserInformationService } from './user_information.service';

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
  ],
};

function makeFilter(
  entityName: string,
  column: string,
  operator: any,
  givenValue: any,
  lastest: boolean,
) {
  const ret = {};
  ret['entityName'] = entityName;
  ret['column'] = column;
  ret['operator'] = operator;
  ret['givenValue'] = givenValue;
  ret['lastest'] = lastest;
  return ret;
}

describe('User Service', () => {
  let db: DataSource;
  let userService: UserInformationService;
  let userRepository: Repository<User>;
  let queryRunner;

  beforeAll(async () => {
    db = await createMemDB([User]);
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
      for (const jdx in userPersonalInformationObject[userEntity.intra_no]) {
        userPersonalEntity = userPersonalRepo.create(
          userPersonalInformationObject[userEntity.intra_no][jdx],
        );
        userEntity.userPersonalInformation = userPersonalEntity;
        await userPersonalRepo.save(userPersonalEntity); //cascade 쓰면 이 작업 불필요 -> cascade, eager 쓸지말지 고민해보기
        await userRepo.save(userEntity);
      }
      for (const kdx in userBlackholeObject[userEntity.intra_no]) {
        userBlackholeEntity = await userPersonalRepo.create(
          userBlackholeObject[userEntity.intra_no][kdx],
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
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'gender', '=', '남', true),
    );
    // then
    expect(await userService.getNumOfPeopleByFilter(filters)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filters)).toBe(1);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('필터 [region = 부산]', async () => {
    //given
    await queryRunner.startTransaction();
    //when
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'region', '=', '부산', true),
    );
    //then
    expect(await userService.getNumOfPeopleByFilter(filters)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filters)).toBe(2);
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('필터 [gender= 남], [acdemic_state != 블랙홀]', async () => {
    //given
    //when
    await queryRunner.startTransaction();
    const filters = [];
    filters.push(
      makeFilter('userPersonalInformation', 'gender', '=', '남', true),
    );
    filters.push(makeFilter('user', 'academic_state', '!=', '블랙홀', true));
    //then
    expect(await userService.getNumOfPeopleByFilter(filters)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filters)).toBe(1);
  });

  it('필터 [region = 부산], [acdemic_state != 블랙홀]', async () => {
    //given
    const filters = [];
    //when
    // filters.push(
    //   makeFilter('userPersonalInformation', 'gender', '=', '남', true),
    // );
    filters.push(
      makeFilter('userPersonalInformation', 'region', '=', '부산', true),
    );
    filters.push(makeFilter('user', 'academic_state', '!=', '블랙홀', true));
    //then
    expect(await userService.getNumOfPeopleByFilter(filters)).not.toBeNull();
    expect(await userService.getNumOfPeopleByFilter(filters)).toBe(2);
  });
});
