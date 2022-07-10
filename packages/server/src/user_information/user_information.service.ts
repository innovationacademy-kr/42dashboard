import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import {
  UserBlackhole,
  UserProcessProgress,
} from 'src/user_status/entity/user_status.entity';
import {
  createQueryBuilder, //deprecated
  DataSource,
  Repository,
  // (ref: https://typeorm.io/find-options)
  Equal,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Like, //
  ILike, //대소문자 구별 안함
  Between, //(ref: https://makand.tistory.com/entry/SQL-BETWEEN-%EA%B5%AC%EB%AC%B8)
  In, //(ref: https://kchanguk.tistory.com/119)
  Any, //In보다 더 많은 기능을 제공 (ref: https://carami.tistory.com/18)
  IsNull,
  ArrayContains,
  ArrayContainedBy,
  ArrayOverlap,
  JoinTable,
  DeepPartial,
} from 'typeorm';
import { CudDto } from './argstype/cudDto.argstype';
import { FilterArgs } from './argstype/filter.argstype';
import { JoinedTable } from './argstype/joinedTable';
import { Filter } from './filter';

@Injectable()
export class UserInformationService {
  private operatorToMethod;

  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // @InjectRepository(UserPersonalInformation)
    // private userPersonalRepository: Repository<UserPersonalInformation>,
    // @InjectRepository(UserOtherInformation)
    // private userOtherRepository: Repository<UserOtherInformation>,
    // @InjectRepository(UserAccessCardInformation)
    // private userAccessCardRepository: Repository<UserAccessCardInformation>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    this.operatorToMethod = {};
    this.operatorToMethod['>'] = MoreThan;
    this.operatorToMethod['>='] = MoreThanOrEqual;
    this.operatorToMethod['<'] = LessThan;
    this.operatorToMethod['<='] = LessThanOrEqual;
    this.operatorToMethod['='] = Equal;
    this.operatorToMethod['!='] = Not;
    this.operatorToMethod['Like'] = Like;
    this.operatorToMethod['like'] = Like;
    this.operatorToMethod['ILike'] = ILike;
    this.operatorToMethod['iLike'] = ILike;
    this.operatorToMethod['ilike'] = ILike;
    this.operatorToMethod['Ilike'] = ILike;
    this.operatorToMethod['In'] = In;
    this.operatorToMethod['in'] = In;
    this.operatorToMethod['Between'] = Between;
    this.operatorToMethod['between'] = Between;
    this.operatorToMethod['Any'] = Any;
    this.operatorToMethod['any'] = Any;
    this.operatorToMethod['null'] = IsNull;
  }

  async createUser(user: User) {
    user = await this.dataSource.getRepository(User).create(user);
    return await this.dataSource.getRepository(User).save(user);
  }
  async getUserPersonalInformation() {
    return await this.dataSource
      .getRepository(UserPersonalInformation)
      .find({});
  }
  async getUserOtherInformation() {
    return await this.dataSource.getRepository(UserOtherInformation).find({});
  }
  async getUserAccessCardInformation() {
    return await this.dataSource
      .getRepository(UserAccessCardInformation)
      .find({});
  }

  /**
   * 아래 filtersToObj(filters)함수에서 만드는 filterObj의 구조
   *    {
   *      엔터티:[filter객체, filter객체...],
   *      엔터티:[filter객체, filter객체...]
   *    }
   * 예시
   *
   *    {
   *      User:[{entityName:User, column:"intra_no", operaotr:"<=", givenValue:"10"}, {...}, {...}]
   *      UserPersonalInformation:[{entityName:UserPersonalInformation, column:"gender", operaotr:"=", givenValue:"남"}, {...}, {...}]
   *    }
   */
  filtersToObj(filterArgs: FilterArgs, withDeleted = false) {
    const filterObj = {};
    let filter;
    let entityName;
    const filters = filterArgs.filters;

    for (let i = 0; i < filters.length; i++) {
      filter = filters[i]; // filter 하나
      entityName = filter.entityName;
      if (entityName in filterObj) {
        // filterObj에 이미 해당 entityName이 있음
        filterObj[entityName].push(filter);
      } else {
        //filterObj에 해당 entityName이 없음
        filterObj[entityName] = []; //해당 entity에 대해 필터조건이 여러개 있을수 있으니
        filterObj[entityName].push(filter); //필터조건(들)을 배열 넣어둠
      }
    }
    // console.log(filterObj);
    const findObj = this.getObj(filterObj, withDeleted);
    // console.log(findObj);
    findObj['cache'] = true; //typeORM에서 제공하는 cache 기능
    findObj['order'] = { intra_id: 'ASC', grade: 'ASC' }; //정렬할 필요가 있는건지?
    if ('take' in filterArgs) {
      findObj['take'] = filterArgs['amount'];
      if ('skip' in filterArgs) findObj['skip'] = filterArgs['skip'];
      else findObj['skip'] = 0;
    }
    return { findObj, filterObj };
  }

  /**
   * getObj 함수에서 반환하는 객체의 구조 예시
   *    {
   *      relation:{
   *        UserOtherInformation: true,
   *        UserPersonalInformation: true,
   *      },
   *      where:{
   *        intra_id:LessThan(100),
   *        userPersonalInformation:{
   *          gender: Equal("남")
   *        },
   *        userOtherInformation:{
   *          major: Equal("비전공")
   *        },
   *      },
   *    }
   */

  private getObj(filterObj, withDeleted = false) {
    let filter;
    let column;
    let operator;
    const ret = {
      withDeleted, //제일 상단에 와야함
      relations: {},
      where: {},
      order: {},
    };
    if ('user' in filterObj) {
      for (const idx in filterObj['user']) {
        filter = filterObj['user'][idx];
        operator = filter['operator'];
        column = filter['column'];
        if (column == null) continue; // 예외처리
        if (
          operator == 'In' ||
          operator == 'in' ||
          operator == 'Between' ||
          operator == 'between'
        ) {
          filter['givenValue'] = filter['givenValue'].split(';');
        }
        ret['where'][column] = this.operatorToORMMethod(filter['operator'])(
          filter['givenValue'],
        ); //overwrite issue 발생가능(명세서에 적어줘야함)
      }
    }
    for (const entityName in filterObj) {
      if (entityName == 'user') continue; // user는 이미 위의 for문에서 처리
      ret['relations'][entityName] = true;
      ret['where'][entityName] = {};
      ret['order'][entityName] = {};
      for (const idx in filterObj[entityName]) {
        filter = filterObj[entityName][idx];
        operator = filter['operator'];
        column = filter['column'];
        if (column == 'null' || column == null) continue; // 예외처리 <- 명세서에 적어주기
        if (operator == 'In' || operator == 'in')
          filter['givenValue'] = filter['givenValue'].split(';');
        ret['where'][entityName][column] = this.operatorToORMMethod(
          filter['operator'],
        )(filter['givenValue']); //overwrite issue 발생가능(명세서에 적어줘야함)
        if ('latest' in filter && filter['latest'] == true) {
          ret['order'][entityName]['created_at'] = 'DESC';
        } else {
          ret['order'][entityName]['created_at'] = 'ASC';
        }
      }
    }
    return ret;
  }

  /**
   * 1. 일관성 달성
   *    일대일관계에서 붙는 테이블이 없으면 -> null
   *    일대일관계에서 붙는 테이블이 있으면 -> 객체 하나 => [객체하나] 꼴로 바꾸자 (가)
   *    filter.latest=false && 일대다관계에서 붙는 테이블이 없으면 -> [](빈테이블) => null로 바꾸자 (나)
   *    filter.latest=true && 일대다관계에서 붙는 테이블이 있으면 -> [obj1, obj2...]
   * 2. 최신정보 vs 최신정보+로깅정보
   *    filter.latest값이 false이면 최신정보+로깅정보 반환
   *    filter.latest값이 true이면 최신정보만 반환
   */
  private makeLimit(data, filterObj) {
    let filter;
    let row;
    // let temp: JoinedTable[];
    let temp;
    for (const joinedTable in filterObj) {
      if (joinedTable == 'user') continue;
      for (const idx in filterObj[joinedTable]) {
        filter = filterObj[joinedTable][idx];
        for (const idx in data) {
          row = data[idx];
          //(가)
          if (row[joinedTable] != null && !Array.isArray(row[joinedTable])) {
            temp = []; //여기서 temp = [JoinTable] 이렇게 오타.. JoinTable은 데코레이터..
            temp.push(row[joinedTable]);
            row[joinedTable] = temp;
            //(나)
          } else if (
            row[joinedTable] != null &&
            Array.isArray(row[joinedTable]) &&
            row[joinedTable].length == 0
          ) {
            row[joinedTable] = null;
          }
          if (
            row[joinedTable] != null &&
            Array.isArray(row[joinedTable]) &&
            'latest' in filter &&
            filter['latest'] == true
          ) {
            row[joinedTable] = row[joinedTable].slice(0, 1);
            // console.log(row[joinedTable]);
          }
        }
      }
    }
    return data;
  }

  private operatorToORMMethod(operator: string) {
    return this.operatorToMethod[operator];
  }

  async getPeopleByFiter(filterArgs: FilterArgs) {
    const { findObj, filterObj } = this.filtersToObj(filterArgs);
    // console.log('OBJ is', findObj);
    let data = await this.dataSource.getRepository(User).find(findObj);
    data = this.makeLimit(data, filterObj);
    // console.log(data);
    return data;
  }

  async getPeopleByFilterForAdmin(filterArgs: FilterArgs) {
    const { findObj, filterObj } = this.filtersToObj(filterArgs, true);
    // console.log('OBJ is', findObj);
    let data = await this.dataSource.getRepository(User).find(findObj);
    // console.log(data);
    data = this.makeLimit(data, filterObj);
    // console.log(data);
    return data;
  }

  async getNumOfPeopleByFilter(filterArgs: FilterArgs): Promise<number> {
    const { findObj } = this.filtersToObj(filterArgs);
    // console.log('OBJ is', findObj);
    const data = await this.dataSource.getRepository(User).count(findObj);
    // console.log(data);
    // this.makeLimit(data, filterObj);
    return data;
  }

  // 아래는 mutation을 위한 service code
  createFindObj(cudDto: CudDto) {
    const ret = {};
    ret['relations'] = {};
    ret['where'] = {};
    ret['where']['intra_no'] = cudDto.intra_no;
    if (cudDto.entityName != 'user') {
      ret['relations'][cudDto.entityName] = true; //relation -> relations
      ret['where'][cudDto.entityName] = {};
      ret['where'][cudDto.entityName]['pk'] = cudDto.pk;
    } else {
      // nothing
    }
    return ret;
  }

  async updateUserInformation(cudDto: CudDto): Promise<boolean> {
    const findObj = this.createFindObj(cudDto);
    const user = await this.dataSource.getRepository(User).findOne(findObj);
    if (user == null) return false;
    const entityName = cudDto.entityName;
    const coulmn = cudDto.column;
    const value = cudDto.value;
    if (coulmn == 'intra_no' || coulmn == 'pk') throw new BadRequestException();
    if (entityName == 'user') user[coulmn] = value;
    else if (Array.isArray(user[entityName]))
      user[entityName][0][coulmn] = value;
    else user[entityName][coulmn] = value;
    //cacade true 덕분에 user만 save해도 다른 엔터티도 save 됨
    if (await this.dataSource.getRepository(User).save(user)) return true;
    else return false;
  }

  async deleteUserInformation(cudDto: CudDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const findObj = this.createFindObj(cudDto);
    const user = await this.dataSource.getRepository(User).findOne(findObj);
    if (user == null) return false;
    const entityName = cudDto.entityName;
    if (Array.isArray(user[entityName]))
      queryRunner.manager.softRemove(user[entityName][0]);
    else queryRunner.manager.softRemove(user[entityName]);
    //cacade true 덕분에 user만 save해도 다른 엔터티도 save 됨
    if (await this.dataSource.getRepository(User).save(user)) return true;
    else return false;
  }

  async recoverUserInformaiton(cudDto: CudDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const findObj = this.createFindObj(cudDto);
    findObj['withDeleted'] = true; //상단에 위치해야함
    const user = await this.dataSource.getRepository(User).findOne(findObj);
    if (user == null) return false;
    const entityName = cudDto.entityName;
    if (Array.isArray(user[entityName]))
      queryRunner.manager.recover(user[entityName][0]);
    else queryRunner.manager.recover(user[entityName]);
    //cacade true 덕분에 user만 save해도 다른 엔터티도 save 됨
    if (await this.dataSource.getRepository(User).save(user)) return true;
    else return false;
  }

  //--------------------------------------------------
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //    아래 부분은 안보셔도 됩니다 (실습용 테스트 코드)         |
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //                                                  |
  //--------------------------------------------------

  /**
   * 실습용 코드
   */
  async softDeleteRemoveWithdrawTest(cudDto: CudDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    // const obj = this.createFindObj(cudDto);
    // const user = await this.dataSource.getRepository(User).findOne(obj);
    // if (user == null) return false;
    const entityName = cudDto.entityName;
    // const coulmn = cudDto.column;
    // if (coulmn == 'intra_no' || coulmn == 'pk') throw new BadRequestException();
    // if (entityName == 'user') queryRunner.manager.softRemove(user);
    // else if (Array.isArray(user[entityName]))
    //   queryRunner.manager.softRemove(user[entityName][0]);
    // else queryRunner.manager.softRemove(user[entityName]);
    // cacade true 덕분에 user만 save해도 다른 엔터티도 save 됨
    // await this.dataSource.getRepository(User).save(user);
    const findObj = {
      withDeleted: true, //가장 앞에 위치해야함
      where: {},
      relations: {},
    };
    findObj['relations'][entityName] = true;
    findObj['where'][entityName] = {};
    findObj['where'][entityName]['region'] = '부산';
    const ret = await this.dataSource.getRepository(User).find(findObj);
    console.log(ret);
    return ret;
  }

  /**
   * "현재 휴학인 카뎃들"이라는 필터조건이 들어올때
   * 현재 재학중인데 이전에 휴학한 이력(log)가 있는 카뎃도 같이 딸려나오는 문제해결해야함
   * column 추가는 확실히 해야함
   *  1. column 하나만 쓰기
   *    "updated_date" or "updated_date" or "deleted_date" or "expired_date"
   *  2. column 두개 쓰기
   *    "validated_date" and "expired_date"
   */
  private async joinTableByFiltersTemp(filterObj) {
    // console.log(filterObj);
    const obj = this.getObj(filterObj);
    // await this.dataSource
    //   .getRepository(UserProcessProgress)
    //   .update({ request_extension: '세번째' }, { deleted_at: new Date() }); //컬럼명 멘토님께 추천받기
    obj['cache'] = true; //typeORM에서 제공하는 cache 기능
    obj['order'] = { created_date: 'DESC' };
    //그냥 @DeleteDatecolumn 안쓰고 @Column 쓴 다음에 (null), (not null) 쓰면 될듯?
    // obj['where']['userProcessProgress']['deleted_at'] = IsNull();
    // obj['withDeleted'] = {}; //가능성 있음
    // obj['withDeleted']['userProcessPregress'] = true; // 적용 안됨. 가능성 없음.
    // console.log('OBJ is', obj);
    const ret = await this.dataSource.getRepository(User).findAndCount(obj);
    // ret = await this.dataSource.getRepository(User).findAndCount(obj);
    // console.log('RET is', ret);
    return ret;
  }

  async querySampel() {
    let temp = await this.dataSource
      .getRepository(User)
      .query(`SELECT * FROM user NATURAL JOIN user_blackhole`);
    // await this.dataSource.query(
    //   'CREATE TABLE accounts (user_id serial PRIMARY KEY,username VARCHAR ( 50 ) UNIQUE NOT NULL,password VARCHAR ( 50 ) NOT NULL,email VARCHAR ( 255 ) UNIQUE NOT NULL,created_on TIMESTAMP NOT NULL,last_login TIMESTAMP );',
    // );
    let queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // queryRunner.createTable({})
    temp = await queryRunner.manager
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect(
        'user.userBlackhole',
        'blackhole', //innerJoin == Join인듯?
        'blackhole.remaining_period > :period AND blackhole.remaining_period > 0',
        { period: 90 },
      ) //오버로딩
      .leftJoinAndSelect('user.userOtherInformation', 'user_other_information')
      .getMany();
    await queryRunner.release();

    queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    temp = await queryRunner.manager.createQueryBuilder();
    queryRunner.release();

    temp = this.dataSource
      .getRepository(User)
      .find({ where: { intra_id: 'hanchoi' } });
    return temp;
  }

  async towJoin(obj, tableCount) {
    // let temp;
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // // eslint-disable-next-line prefer-const
    // const arr = [];
    // for (const key in obj) {
    //   arr.push(await this.makeArguments(key, obj[key]));
    // }
    // console.log(arr);
    // // eslint-disable-next-line prefer-const
    // console.log(arr[0][0], arr[0][1], arr[0][2]);
    // temp = await queryRunner.manager
    //   .createQueryBuilder(User, 'user')
    //   .leftJoinAndSelect(
    //     'user.userOtherInformation',
    //     'user_other_information', //innerJoinAndSelect가 outerJoin인듯?
    //     // 'user_other_information.major = :arg1',
    //     // { arg1: '비전공' },
    //   ) //오버로딩을 생각하자
    //   .leftJoinAndSelect(
    //     'user.userPersonalInformation',
    //     'user_personal_information', //innerJoinAndSelect가 outerJoin인듯?
    //     // 'user_personal_information.gender > :arg1',
    //     // { arg1: '남' },
    //   ) //오버로딩을 생각하자'
    //   .getMany();
    // temp = await this.userRepository.find({
    //   relations: ['userOtherInformation', 'userPersonalInformation'],
    // });
    // temp = await this.dataSource.getRepository(User).findBy({
    //   intra_no: LessThan(10), // column쪽(좌측)에 문자열 당연히 가능 // 우측엔 동적으로 함수 쓸수있는거 확인!
    // });
    // const val = 3000;
    const test = {
      relations: {
        //entityname:true
        userPersonalInformation: true,
        userOtherInformation: true,
        userAccessCardInformation: true,
        userProcessProgress: true, //하위것을 상위로 뽑아내는 옵션이 있음
      },
      // where: {
      //   userOtherInformation: [
      //     // OR 처리할수 있는 실마리가 있음
      //     {
      //       pk: this.operatorToORMMethod('<=')(val),
      //     },
      //     {
      //       major: '비전공',
      //     },
      //   ],
      // },
      // order:{
      //   userProcessProgress: {
      //     created_date: 'DESC',
      //   },
      // }
      // order: { created_date: 'DESC' },
    };
    const temp = await this.dataSource.getRepository(User).find({
      relations: {
        //entityname:true
        userPersonalInformation: true,
        userOtherInformation: true,
        userAccessCardInformation: true,
      },
      where: {
        userOtherInformation: {
          pk: LessThanOrEqual(3000),
        },
      },
      withDeleted: true,
    });
    test['order'] = {
      userProcessProgress: {
        created_date: 'ASC',
      },
    };
    // test['take'] = {
    //   userProcessProgress:1,
    // }; <- 안되는걸로 결론

    const ret = await this.dataSource.getRepository(User).find(test);
    await queryRunner.release();
    return ret;
  }
}
