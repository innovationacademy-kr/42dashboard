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
    name: 'hungin',
    grade: '3기',
    start_process: new Date('2020-12-31'),
    academic_state: '재학',
  },
];

const userPersonalInformationObject = {
  1: [
    {
      reigin: '부산',
      gender: '남',
      email: 'testnyz1058@nate.com',
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

describe('User Service', () => {
  let db: DataSource;
  let userService: UserInformationService;
  let userRepository: Repository<User>;
  let queryRunner;

  beforeAll(async () => {
    db = await createMemDB([User]);
    // db = await new DataSource(typeORMConfig);
    await db.initialize();
    userRepository = await db.getRepository(User);
    userService = new UserInformationService(db); // <--- manually inject
    //given
    const userRepo = db.getRepository(User);
    const userPersonalRepo = db.getRepository(UserPersonalInformation);
    const userBlackholeRepo = db.getRepository(UserBlackhole);
    let userEntity, userPersonalEntity, userBlackholeEntity;
    for (const idx in userList) {
      userEntity = userRepo.create(userList[idx]);
      for (const jdx in userPersonalInformationObject[userEntity.intra_no]) {
        userPersonalEntity = await userPersonalRepo.create(
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
    queryRunner = db.createQueryRunner();
  });

  afterAll(() => db.destroy());

  it('should create a new user', async () => {
    // given
    // when
    await queryRunner.startTransaction();
    const intra_id = 'huchoi';
    const findUser = await userRepository.find({ where: { intra_id } });
    // then
    expect(findUser).not.toBeNull();
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });
});
