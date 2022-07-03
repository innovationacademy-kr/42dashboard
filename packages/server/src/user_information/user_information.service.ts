import { Injectable } from '@nestjs/common';
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
    this.operatorToMethod['ILike'] = ILike;
    this.operatorToMethod['In'] = In;
    this.operatorToMethod['Any'] = Any;
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

  private camelize(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  /**
   * 아래 processFilters()함수에서 만드는 filterObj의 구조
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
  filtersToObj(filters) {
    const filterObj = {};
    let filter;
    let entityName;

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
    const obj = this.getObj(filterObj);
    obj['cache'] = true; //typeORM에서 제공하는 cache 기능
    obj['order'] = { intra_id: 'ASC', grade: 'ASC' }; //정렬할 필요가 있는건지?
    return { obj, filterObj };
  }

  async getPeopleByFiter(filters) {
    const { obj, filterObj } = this.filtersToObj(filters);
    // console.log('OBJ is', obj);
    const data = await this.dataSource.getRepository(User).find(obj);
    this.makeLimit(data, filterObj);
    return data;
  }

  async getNumOfPeopleByFilter(filters): Promise<number> {
    const { obj, filterObj } = this.filtersToObj(filters);
    // console.log('OBJ is', obj);
    const data = await this.dataSource.getRepository(User).count(obj);
    // console.log(data);
    // this.makeLimit(data, filterObj);
    return data;
  }

  async processFilters(filters) {
    // console.log(filters);
    let filter;
    let entityName;
    let numOfEntity = 1; //entity의 개수(user는 무조건 쓰니까 initialValue = 1)
    const filterObj = {};

    for (let i = 0; i < filters.length; i++) {
      filter = filters[i]; // filter 하나
      entityName = filter.entityName;
      if (entityName in filterObj) {
        // filterObj에 이미 해당 entityName이 있음
        filterObj[entityName].push(filter);
      } else {
        //filterObj에 해당 entityName이 없음
        numOfEntity++;
        filterObj[entityName] = []; //해당 entity에 대해 필터조건이 여러개 있을수 있으니
        filterObj[entityName].push(filter); //필터조건(들)을 배열 넣어둠
      }
    }
    return this.joinTableByFilters(filterObj); //numOFEntity 값을 사용하지는 않지만 일단 넣어두었음
  }

  /**
   * 1. 일관성 달성
   *    일대일관계에서 붙는 테이블이 없으면 -> null
   *    일대일관계에서 붙는 테이블이 있으면 -> 객체 하나 => [객체하나] 꼴로 바꾸자 (가)
   *    filter.lastest=false && 일대다관계에서 붙는 테이블이 없으면 -> [](빈테이블) => null로 바꾸자 (나)
   *    filter.lastest=true && 일대다관계에서 붙는 테이블이 있으면 -> [obj1, obj2...]
   * 2. 최신정보 vs 최신정보+로깅정보
   *    filter.lastest값이 false이면 최신정보+로깅정보 반환
   *    filter.lastest값이 true이면 최신정보만 반환
   */
  private makeLimit(data, filterObj) {
    let filter;
    let row;
    let temp;
    for (const joinedTable in filterObj) {
      if (joinedTable == 'user') continue;
      for (const idx in filterObj[joinedTable]) {
        filter = filterObj[joinedTable][idx];
        for (const idx in data) {
          row = data[idx];
          //(가)
          if (row[joinedTable] != null && !Array.isArray(row[joinedTable])) {
            temp = [JoinTable];
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
            'lastest' in filter &&
            filter['lastest'] == true
          ) {
            row[joinedTable] = row[joinedTable].slice(0, 1);
            // console.log(row[joinedTable]);
          }
        }
      }
    }
  }

  private async joinTableByFilters(filterObj) {
    // console.log(filterObj);
    const obj = this.getObj(filterObj);
    obj['cache'] = true; //typeORM에서 제공하는 cache 기능
    obj['order'] = { intra_id: 'ASC', grade: 'ASC' }; //정렬할 필요가 있는건지?
    console.log('OBJ is', obj);
    const ret = await this.dataSource.getRepository(User).find(obj);
    this.makeLimit(ret, filterObj);
    // console.log('RET is', ret);
    return ret;
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

  private getObj(filterObj) {
    let filter;
    let column;
    const ret = {};
    ret['relations'] = {};
    ret['where'] = {};
    ret['order'] = {};
    if ('user' in filterObj) {
      for (const idx in filterObj['user']) {
        filter = filterObj['user'][idx];
        column = filter['column'];
        if (column == null) continue; // 예외처리
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
        column = filter['column'];
        if (column == null) continue;
        ret['where'][entityName][column] = this.operatorToORMMethod(
          filter['operator'],
        )(filter['givenValue']); //overwrite issue 발생가능(명세서에 적어줘야함)
        if ('lastest' in filter && filter['lastest'] == true) {
          ret['order'][entityName]['created_at'] = 'DESC';
        } else {
          ret['order'][entityName]['created_at'] = 'ASC';
        }
      }
    }
    return ret;
  }

  private operatorToORMMethod(operator: string) {
    return this.operatorToMethod[operator];
  }

  //--------------------------------------------------
  //      아래 부분은 안보셔도 됩니다. 실습용 테스트 코드.       |
  //--------------------------------------------------

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
    console.log('RET is', ret);
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
    // temp = await this.dataSource.getRepository(User).find({
    //   relations: {
    //     //entityname:true
    //     userPersonalInformation: true,
    //     userOtherInformation: true,
    //     userAccessCardInformation: true,
    //   },
    //   where: {
    //     userOtherInformation: {
    //       pk: LessThanOrEqual(3000),
    //     },
    //   },
    // });
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

  async makeArguments(entityName: string, arr) {
    const ret = [];
    ret[0] = `user.${entityName}`;
    ret[1] = entityName
      .replace(/\.?([A-Z]+)/g, function (_x, y) {
        return '_' + y.toLowerCase();
      })
      .replace(/^_/, '');
    ret[2] = new String();
    for (let i = 0; i < arr.length; i++) {
      if (i != 0) ret[2] += ' AND ';
      ret[2] += `${ret[1]}.`;
      ret[2] += `${arr[i].column}`;
      if (arr[i].operator == 'eq') ret[2] += ' = ';
      else if (arr[i].operator == 'gt') ret[2] += ' > ';
      else console.log('\n\n\nERROR in makeArguments function\n\n\n');
      ret[2] += `${arr[i].value}`;
    }
    console.log(ret);
    return ret;
  }
}
