import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import { UserLeaveOfAbsence } from 'src/user_status/entity/user_status.entity';
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
  Raw,
  Timestamp,
} from 'typeorm';
import { CheckDuplication } from './argstype/checkDuplication.argstype';
import { CudDto } from './argstype/cudDto.argstype';
import { FilterArgs } from './argstype/filter.argstype';
import { JoinedTable } from './argstype/joinedTable';
import { Filter } from './filter';
import {
  entityColumnMapping,
  entityColumnNotMapping,
  exceptCase,
  getExpireColumn,
  getRawQuery,
  getValidateColumn,
  halfAndHalf,
  valExColumnEntity,
} from './utils/entityArray.utils';
import { entityArray, getDomain } from './utils/getDomain.utils';
import { operatorDict } from './utils/operatorDict.utils';

@Injectable()
export class UserInformationService {
  private operatorToMethod;
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    this.operatorToMethod = {};
    this.operatorToMethod['>'] = MoreThan;
    this.operatorToMethod['>='] = MoreThanOrEqual;
    this.operatorToMethod['<'] = LessThan;
    this.operatorToMethod['<='] = LessThanOrEqual;
    this.operatorToMethod['='] = Equal;
    this.operatorToMethod['=='] = Equal;
    this.operatorToMethod['!='] = Not;
    this.operatorToMethod['Like'] = Like;
    this.operatorToMethod['like'] = Like;
    this.operatorToMethod['ILike'] = ILike;
    this.operatorToMethod['iLike'] = ILike;
    this.operatorToMethod['Ilike'] = ILike;
    this.operatorToMethod['ilike'] = ILike;
    this.operatorToMethod['In'] = In;
    this.operatorToMethod['in'] = In;
    this.operatorToMethod['Between'] = Between;
    this.operatorToMethod['between'] = Between;
    this.operatorToMethod['Any'] = Any;
    this.operatorToMethod['any'] = Any;
    this.operatorToMethod['null'] = IsNull;
    // this.operatorToMethod['notNull'] = Not(IsNull());
  }

  async getUser(checkDuplication: CheckDuplication) {
    return getDomain(this.dataSource, checkDuplication, entityArray, 'user');
  }

  async getUserPersonalInformation(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userPersonalInformation',
    );
  }

  async getUserOtherInformation(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userOtherInformation',
    );
  }

  async getUserAccessCardInformation(checkDuplication: CheckDuplication) {
    return getDomain(
      this.dataSource,
      checkDuplication,
      entityArray,
      'userAccessCardInformation',
    );
  }

  /**
   * 아래 filtersToObj(filters)함수에서 만드는 filterObj의 구조
   *    {
   *      엔터티이름:[filter객체, filter객체...],
   *      엔터티이름:[filter객체, filter객체...]
   *    }
   * 예시
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
    const { findObj, flag } = this.createFindObj(
      filterObj,
      filterArgs.startDate,
      filterArgs.endDate,
      withDeleted,
      filterArgs.accumulate,
    );
    // console.log(findObj);
    findObj['cache'] = true; //typeORM에서 제공하는 cache 기능
    findObj['order'] = { intra_id: 'ASC', grade: 'ASC' }; //정렬할 필요가 있는건지?
    if ('take' in filterArgs) {
      findObj['take'] = filterArgs['amount'];
    }
    if ('skip' in filterArgs) findObj['skip'] = filterArgs['skip'];
    else findObj['skip'] = 0;
    return { findObj, filterObj, flag };
  }

  /**
   * createFindObj 함수에서 반환하는 객체의 구조 예시
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
   *      order:{
   *        intra_no: ASC,
   *      }
   *    }
   */

  private createFindObj(
    filterObj,
    startDateString = null,
    endDateString = null,
    withDeleted = false,
    accumulate = false,
  ) {
    let filter;
    let column;
    let operator;
    let flag = 0;
    const findObj = {
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
        if (column == 'null' || column == null) continue; // 예외처리
        if (
          operator == 'In' ||
          operator == 'in' ||
          operator == 'Between' ||
          operator == 'between'
        ) {
          filter['givenValue'] = filter['givenValue'].split(';');
        }
        findObj['where'][column] = this.operatorToORMMethod(filter['operator'])(
          filter['givenValue'],
        ); //overwrite issue 발생가능(명세서에 적어줘야함)
        /////////////////////////////////////////////////////
        // console.log(startDateString, endDateString, accumulate);
        if (startDateString && endDateString && accumulate) {
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);
          findObj['where'][getValidateColumn('user', column)] =
            getRawQuery(endDate); //ok
          // 한번 더 걸러야하는데 그건 makeLimit에서 처리함 -> 처리 못해줌 -> flag 설정
          // -> makeLimit함수 내에서 걸러주는 코드 추가함
          flag = 1;
        } else if (startDateString && endDateString && !accumulate) {
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);
          console.log('user no accumulate', startDate, endDate);
          findObj['where'][getValidateColumn('user', column)] = Between(
            startDateString,
            endDateString,
          );
        } else if ('latest' in filter && filter['latest'] == true) {
          // ***********************************************************************************************
          // 애시당초 filter조건에 validate column, expired column을 줄 필요가 없는거 -> entity 수정, common에 수정 필요
          // 프론트에 date 관련된 컬럼 사용자에게 보여주지 말아 달라고 요청하기 -> 도메인 보내주는건 백엔드니까 중한님께 요청드리는게 맞을듯?
          // ***********************************************************************************************
          // 아래 주석 풀면 테스트 코드 페일나옴 (validate_date = '9999-12-31')
          findObj['where'][getValidateColumn('user', column)] =
            LessThan('9999-12-20'); // 디폴트값이 달라지면 이 부분 수정 필요 //덮어쓰는 이슈가 있는지 확인
        } else {
          // do nothing
        }
      }
    }
    for (const entityName in filterObj) {
      if (entityName == 'user') continue; // user는 이미 위의 for문에서 처리
      findObj['relations'][entityName] = true;
      findObj['where'][entityName] = {};
      findObj['order'][entityName] = {};
      for (const idx in filterObj[entityName]) {
        filter = filterObj[entityName][idx];
        operator = filter['operator'];
        column = filter['column'];
        if (column == 'null' || column == null) continue; // 예외처리 <- 명세서에 적어주기
        if (
          operator == 'In' ||
          operator == 'in' ||
          operator == 'Between' ||
          operator == 'between'
        )
          filter['givenValue'] = filter['givenValue'].split(';');
        findObj['where'][entityName][column] = this.operatorToORMMethod(
          filter['operator'],
        )(filter['givenValue']); // overwrite issue 발생가능(명세서에 적어줘야함)
        if ('latest' in filter && filter['latest'] == true) {
          // 정렬규칙 다시 생각해보기
          findObj['order'][entityName]['validate_date'] = 'DESC';
        } else {
          findObj['order'][entityName]['validate_date'] = 'ASC';
        }
      }
      // Range 조건
      if (
        startDateString &&
        endDateString &&
        entityName in entityColumnMapping &&
        accumulate
      ) {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        findObj['where'][entityName][getValidateColumn(entityName, column)] =
          getRawQuery(endDate); //ok
        findObj['where'][entityName][
          entityColumnMapping[entityName][getExpireColumn(entityName)]
        ] = MoreThanOrEqual(startDate); //ok
      } else if (
        startDateString &&
        endDateString &&
        entityName in entityColumnMapping &&
        !accumulate
      ) {
        findObj['where'][entityName][getValidateColumn(entityName, column)] =
          Between(startDateString, endDateString);
      } else if (
        startDateString &&
        endDateString &&
        (entityName in halfAndHalf || exceptCase(entityName, column)) &&
        accumulate
      ) {
        console.log('여기 도달해야함');
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        findObj['where'][entityName][getValidateColumn(entityName, column)] =
          getRawQuery(endDate); //ok
        // 한번 더 걸러야하는데 그건 makeLimit에서 처리함 -> 처리 못해줌 -> flag 설정
        // -> makeLimit함수 내에서 걸러주는 코드 추가함
        flag = 1;
      } else if (
        startDateString &&
        endDateString &&
        (entityName in halfAndHalf || exceptCase(entityName, column)) &&
        !accumulate
      ) {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        console.log(startDate, endDate);
        findObj['where'][entityName][getValidateColumn(entityName, column)] =
          Between(startDate, endDate);
      } else if (
        // 날짜 컬럼이 없는 엔터티에 대해선 아래 로직을 할 필요가 없음
        'latest' in filter &&
        filter['latest'] == true &&
        (entityName in halfAndHalf ||
          entityName in entityColumnMapping ||
          exceptCase(entityName, column))
      ) {
        // ***********************************************************************************************
        // 애시당초 filter조건에 validate column, expired column을 줄 필요가 없는거 -> entity 수정, common에 수정 필요
        // 프론트에 date 관련된 컬럼 사용자에게 보여주지 말아 달라고 요청하기 -> 도메인 보내주는건 백엔드니까 중한님께 요청드리는게 맞을듯?
        // ***********************************************************************************************
        // 아래 주석 풀면 테스트 코드 페일나옴 (validate_date = '9999-12-31')
        findObj['where'][entityName][getValidateColumn(entityName, column)] =
          LessThan('9999-12-20'); // 디폴트값이 달라지면 이 부분 수정 필요 //덮어쓰는 이슈가 있는지 확인
      } else {
        // do nothing
      }
    }
    return { findObj, flag };
  }

  private makeLimit(data, filterObj, numOfPeople = 0, flag = 0) {
    let filter;
    let row;
    // let temp: JoinedTable[];
    let temp;
    for (const joinedTable in filterObj) {
      if (joinedTable == 'user') continue;
      for (const idx in filterObj[joinedTable]) {
        filter = filterObj[joinedTable][idx];
        if (filter.column == 'null' || filter.column == null) continue; //이거 없는게 문제였음(사용상황을 너무 이상적인걸로 한정해버려서 이 케이스 생각을못함)
        for (const idx in data) {
          row = data[idx];
          if (
            row[joinedTable] != null &&
            Array.isArray(row[joinedTable]) &&
            row[joinedTable].length > 0 &&
            'latest' in filter &&
            filter['latest'] == true
          ) {
            row[joinedTable] = row[joinedTable].slice(0, 1);
          }
          if (
            //최후의 보루
            (('latest' in filter && filter['latest'] == true) ||
              ((filter['entityName'] in halfAndHalf ||
                exceptCase(filter['entityName'], filter['column'])) &&
                flag == 1)) &&
            row[joinedTable].length > 0 &&
            !operatorDict[filter['operator']](
              filter['givenValue'],
              row[joinedTable][0][filter['column']],
            )
          ) {
            console.log('조건에 맞지 않는 결과를 제거합니다');
            numOfPeople--;
            row[joinedTable] = [];
          }
        }
      }
    }
    return { data, numOfPeople };
  }

  private operatorToORMMethod(operator: string) {
    return this.operatorToMethod[operator];
  }

  async getPeopleByFiter(filterArgs: FilterArgs) {
    const { findObj, filterObj, flag } = this.filtersToObj(filterArgs);
    console.log('--------------------------------------------');
    console.log(findObj);
    console.log('--------------------------------------------');
    let data = await this.dataSource.getRepository(User).find(findObj);
    const limitedData = this.makeLimit(data, filterObj, 0, flag);
    data = limitedData.data;
    return data;
  }

  async getPeopleByFilterForAdmin(filterArgs: FilterArgs) {
    const { findObj, filterObj, flag } = this.filtersToObj(filterArgs, true);
    console.log('--------------------------------------------');
    console.log(findObj);
    console.log('--------------------------------------------');
    let data = await this.dataSource.getRepository(User).find(findObj);
    const limitedData = this.makeLimit(data, filterObj, 0, flag);
    data = limitedData.data;
    return data;
  }

  async getNumOfPeopleByFilter(filterArgs: FilterArgs): Promise<number> {
    const { findObj, filterObj, flag } = this.filtersToObj(filterArgs);
    console.log('--------------------------------------------');
    console.log(findObj);
    console.log('--------------------------------------------');
    // findAndCount의 return 값 = 배열
    // 0번째 인덱스 = find의 결과
    // 1번째 인덱스 = count의 결과
    const dataAndCount = await this.dataSource
      .getRepository(User)
      .findAndCount(findObj);
    const data = dataAndCount[0];
    const count = dataAndCount[1];
    const limitedData = this.makeLimit(data, filterObj, count, flag);
    return limitedData.numOfPeople;
  }

  async getDomainOfColumnFilter(filterArgs: FilterArgs) {
    const { findObj, filterObj } = this.filtersToObj(filterArgs);
    console.log('find is', findObj);
    console.log('filter is', filterObj);
    // console.log('OBJ is', findObj);
    const data = await this.dataSource.getRepository(User).find(findObj);
    console.log(data);
    console.log('------------------------------');
    this.makeLimit(data, filterObj);
    console.log(data);
    return data;
  }

  // 아래는 mutation을 위한 service code
  createFindObjForMutation(cudDto: CudDto) {
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
    const { findObj } = this.createFindObj(cudDto);
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
    const { findObj } = this.createFindObj(cudDto);
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
    const { findObj } = this.createFindObj(cudDto);
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
