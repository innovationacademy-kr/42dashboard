import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ApiService } from 'src/api/api.service';
import {
  app_id,
  app_secret,
  MAIN_SHEET,
  SPREAD_END_POINT,
} from 'src/config/key';
import { SpreadService } from 'src/spread/spread.service';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import {
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  //UserInternStatus,
  UserOtherEmploymentStatus,
} from 'src/user_job/entity/user_job.entity';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from 'src/user_status/entity/user_status.entity';

import { Cron } from '@nestjs/schedule';
import { DataSource, Repository } from 'typeorm';
import {
  apiTable,
  endOfTable,
  mapObj,
  pastDataOnColumn,
  pastDataOnSheet,
  TABLENUM,
  repoKeys,
  DEFAULT_VALUE,
  defaultVALUE,
} from './name_types/updater.name';
import {
  UserComputationFund,
  UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';

interface RepoDict {
  [repositoryName: string]:
    | Repository<User>
    | Repository<UserPersonalInformation>
    | Repository<UserCourseExtension>
    | Repository<UserLeaveOfAbsence>
    | Repository<UserBlackhole>
    | Repository<UserInterruptionOfCourse>
    | Repository<UserLearningDataAPI>
    | Repository<UserLoyaltyManagement>
    | Repository<UserEmploymentStatus>
    | Repository<UserHrdNetUtilizeConsent>
    | Repository<UserHrdNetUtilize>
    | Repository<UserOtherEmploymentStatus>
    | Repository<UserEducationFundState>
    | Repository<UserComputationFund>
    | Repository<UserAccessCardInformation>
    | Repository<UserOtherInformation>
    | Repository<UserLapiscineInformation>;
}

@Injectable() //총 16개의 테이블
export class UpdaterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPersonalInformation)
    private userPersonalInformationRepository: Repository<UserPersonalInformation>,
    @InjectRepository(UserCourseExtension)
    private userCourseExtensionRepository: Repository<UserCourseExtension>,
    @InjectRepository(UserLeaveOfAbsence)
    private userLeaveOfAbsenceRepository: Repository<UserLeaveOfAbsence>,
    @InjectRepository(UserBlackhole)
    private userBlackholeRepository: Repository<UserBlackhole>,
    @InjectRepository(UserInterruptionOfCourse)
    private userInterruptionOfCourseRepository: Repository<UserInterruptionOfCourse>,
    @InjectRepository(UserLearningDataAPI)
    private userLearningDataAPIRepository: Repository<UserLearningDataAPI>,
    @InjectRepository(UserLoyaltyManagement)
    private userLoyaltyManagementRepository: Repository<UserLoyaltyManagement>,
    @InjectRepository(UserEmploymentStatus)
    private userEmploymentStatusRepository: Repository<UserEmploymentStatus>,
    @InjectRepository(UserHrdNetUtilizeConsent)
    private userHrdNetUtilizeConsentRepository: Repository<UserHrdNetUtilizeConsent>,
    @InjectRepository(UserHrdNetUtilize)
    private userHrdNetUtilizeRepository: Repository<UserHrdNetUtilize>,
    @InjectRepository(UserOtherEmploymentStatus)
    private userOtherEmploymentStatusRepository: Repository<UserOtherEmploymentStatus>,
    @InjectRepository(UserEducationFundState)
    private userEducationFundStateRepository: Repository<UserEducationFundState>,
    @InjectRepository(UserComputationFund)
    private userComputationFundRepository: Repository<UserComputationFund>,
    @InjectRepository(UserAccessCardInformation)
    private userAccessCardInformationRepository: Repository<UserAccessCardInformation>,
    @InjectRepository(UserOtherInformation)
    private userOtherInformationRepository: Repository<UserOtherInformation>,
    @InjectRepository(UserLapiscineInformation)
    private userLapiscineInformationRepository: Repository<UserLapiscineInformation>,
    @InjectDataSource()
    private dataSource: DataSource,
    private apiService: ApiService,
    private spreadService: SpreadService,
  ) {
    //repoKeys에 선언된 문자열 value 를 받음
  }

  repoDict: RepoDict = {
    [repoKeys.user]: this.userRepository,
    [repoKeys.userPersonal]: this.userPersonalInformationRepository,
    [repoKeys.userCourseExtension]: this.userCourseExtensionRepository,
    [repoKeys.userLeaveOfAbsence]: this.userLeaveOfAbsenceRepository,
    [repoKeys.userBlackhole]: this.userBlackholeRepository,
    [repoKeys.userInterruptionOfCourse]:
      this.userInterruptionOfCourseRepository,
    [repoKeys.userLearningDataAPI]: this.userLearningDataAPIRepository,
    [repoKeys.userLoyaltyManagement]: this.userLoyaltyManagementRepository,
    [repoKeys.userEmploymentStatus]: this.userEmploymentStatusRepository,
    [repoKeys.userHrdNetUtilizeConsent]:
      this.userHrdNetUtilizeConsentRepository,
    [repoKeys.userHrdNetUtilize]: this.userHrdNetUtilizeRepository,
    [repoKeys.userOtherEmploymentStatus]:
      this.userOtherEmploymentStatusRepository,
    [repoKeys.userEducationFundState]: this.userEducationFundStateRepository,
    [repoKeys.userComputationFund]: this.userComputationFundRepository,
    [repoKeys.userAccessCard]: this.userAccessCardInformationRepository,
    [repoKeys.userOtherInformation]: this.userOtherInformationRepository,
    [repoKeys.userLapiscineInformation]:
      this.userLapiscineInformationRepository,
  };

  repoArray = [
    this.userRepository,
    this.userPersonalInformationRepository,
    this.userCourseExtensionRepository,
    this.userLeaveOfAbsenceRepository,
    this.userBlackholeRepository,
    this.userInterruptionOfCourseRepository,
    this.userLearningDataAPIRepository,
    this.userLoyaltyManagementRepository,
    this.userEmploymentStatusRepository,
    this.userHrdNetUtilizeConsentRepository,
    this.userHrdNetUtilizeRepository,
    this.userOtherEmploymentStatusRepository,
    this.userEducationFundStateRepository,
    this.userComputationFundRepository,
    this.userAccessCardInformationRepository,
    this.userOtherInformationRepository,
    this.userLapiscineInformationRepository,
    //api 데이터를 담당하는 repository
    // this.userLearningDataRepository,
  ];

  apiOfRepo = [this.userLearningDataAPIRepository];

  @Cron('00 00 00 * * *') //24시간마다 업데이트
  updatePerDay() {
    console.log(this.updateData());
  }

  async updateData() {
    let tableNum = 0;
    //const index = 0;

    // eslint-disable-next-line prefer-const
    const jsonData = await this.spreadService.sendRequestToSpread(
      SPREAD_END_POINT,
      MAIN_SHEET,
    );

    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;
    const api42s = await this.apiService.getApi();

    //console.log(api42s, 'wht');
    //return api42s;
    const table_array = {};
    let table_name;

    /**
     *  아래 for 문 돌고 나온 tableArray 값 예시
    {
    "user": {
        "0": {
            "intra_no": 68582,
            "intra_id": "hybae",
            "name": "배현식",
            "grade": "2기",
            "start_process": "2020-01-28",
            "academic_state": "휴학",
            "coalition": "리"
        },
    "user_personal_information": {
        "0": {
            "region": "경기",
            "gender": "남",
            "birthday": "1998-02-17",
            "phone_number": "hidden",
            "email": "3b3-68582@student.42.fr",
            "fk_user_no": "68582"
        },
     */

    for (const col in cols) {
      //console.log(col, 'col', tableNum, 'table');
      if (cols[col]['label'] === endOfTable[tableNum]) {
        table_name = await this.spreadService.getTableName(cols[col]['label']);
        table_array[table_name] = {};
        //tablle num 을 추가시키면서 label과 같은지 찾기, endoftable과 clos의 수가 같아서 가능
        table_array[table_name] = await this.spreadService.parseSpread(
          cols,
          rows,
          +col, //typescrit에서 string을 number로 바꾸기 위함
          this.repoArray[tableNum],
          mapObj[tableNum],
          endOfTable,
          ++tableNum,
          api42s,
        );
      } else if (
        //endOfTable에 하위시트를 대비하여 메인에 없는 시트들이 생김
        cols.find((Column) => Column.label === endOfTable[tableNum]) ===
        undefined
      )
        tableNum++;
    }
    // for (const api_table_idx in apiTable) {
    //   if (apiTable[api_table_idx] == '학습데이터') {
    //     table_name = await this.spreadService.getTableName('학습데이터');
    //     table_array[table_name] = {}; //학습데이터
    //     table_array[table_name] = await this.apiService.parseApi(
    //       apiTable[api_table_idx],
    //       this.apiOfRepo[api_table_idx],
    //       api42s,
    //     );
    //     //  }
    //   }
    // }
    const latestData = await this.getLatestData();
    const comparedData = await this.compareNewDataWithLatestData(
      table_array,
      latestData,
    );
    console.log(comparedData);

    return await 'All data has been updated';
  }

  async updateOldData() {
    /* 지원금 관련 월별 지금액 시트 */
    //this.sendRequestToSpread();
    /* 테이블 별 과거 데이터 */
    let pastColumn;
    let userTable = [];

    let jsonData;
    const index = 0;

    // eslint-disable-next-line prefer-const
    jsonData = await this.spreadService.sendRequestToSpread(
      SPREAD_END_POINT,
      MAIN_SHEET,
    );

    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;

    userTable = await this.spreadService.parseSpread(
      cols,
      rows,
      index,
      this.userRepository,
      mapObj[0],
      endOfTable[1],
      undefined,
    );

    const latestUser = await this.repoDict['user']
      .createQueryBuilder('user')
      .getMany();

    for (const user of userTable) {
      await this.findTargetByKey(
        this.repoDict['user'],
        'user',
        user,
        latestUser,
      );
    }
    for (const sheetIdx in pastDataOnSheet) {
      //시트의 총 장수 만큼 반복
      if (pastDataOnSheet[sheetIdx].endPoint) {
        pastDataOnSheet[sheetIdx]['repo'] = this.repoArray[sheetIdx];
        await this.spreadService.getOldSheetTable(pastDataOnSheet[sheetIdx]);
      } else if (
        (pastColumn = pastDataOnColumn.find(
          (Column) => Column.table === pastDataOnSheet[sheetIdx].table,
        )) != undefined
      ) {
        await this.spreadService.getOldSheetLogColumns(pastColumn);
      }
    }
    return await 'All old data has been updated';
  }

  async getLatestData() {
    const returnArray = {};
    const valueArray = Object.values(repoKeys);

    for (const repoKey of valueArray) {
      if (repoKey == 'user') {
        returnArray[repoKey] = await this.repoDict[repoKey]
          .createQueryBuilder(repoKey)
          .distinctOn([`${repoKey}.intra_no`])
          .orderBy(`${repoKey}.intra_no`, 'DESC')
          .addOrderBy(`${repoKey}.created_date`, 'DESC')
          .getMany();
        //     return returnArray;
      } else {
        returnArray[repoKey] = await this.repoDict[repoKey]
          .createQueryBuilder(repoKey)
          .distinctOn([`${repoKey}.fk_user_no`])
          .orderBy(`${repoKey}.fk_user_no`, 'DESC')
          .addOrderBy(`${repoKey}.created_date`, 'DESC')
          .getMany();
        //      return returnArray;
      }
    }

    return returnArray;
  }

  async findTargetByKey(repo, repoKey, newOneData, targetObj) {
    //  console.log(repoKey, 'in find target');
    //  console.log(targetObj, 'targetObj');
    //console.log('\n \t,', targetObj[0].intra_no);
    try {
      for (const target of targetObj) {
        if (repoKey == 'user') {
          // console.log('key : ', key, '  targetkey : ', target.intra_no);
          if (newOneData.intra_no == target.intra_no) {
            return await target;
          }
        } else {
          if (newOneData.fk_user_no == target.fk_user_no) {
            return await target;
          }
        }
      }
      console.log("insert due to dosend't exist spread data in db");
      const newTuple = await repo.create(newOneData);
      await repo.save(newTuple).catch(() => {
        return 'error save';
      });
    } catch {
      throw "can't find target by key";
    }
  }

  //newData -> spread
  //latestData -> DB
  async compareNewDataWithLatestData(newData, latestData) {
    let targetObj;

    console.log('compare in');
    const repoNameArray = await Object.values(repoKeys); //.map((repoKey) => {
    //db table 이름별로 받은 데이터를 구분해놓은것을 repoNameArray 배열로 구별하여 식별
    for (const repoKey of repoNameArray) {
      const repo = this.repoDict[repoKey];
      const datas = newData[repoKey];
      //스프레스에서 받아온 newData(table)가 비어있다면 밑에 for문에서 not iterable로 터지니까 예외처리
      if (datas == undefined) {
        console.log(datas);
        continue;
      }
      //스프레드에서 table 명으로 나누어 파싱해 둔 데이터를 tableName 구별하여 같은 Db 데이터 테이블에서 해당하는 객체를 받아옴
      for (const newOneData of datas) {
        if (repoKey == 'user') {
          targetObj = await this.findTargetByKey(
            repo, //스프레드엔 있고 DB엔 없을 때 해당 학생 저장하기 위함
            repoKey, //user entity인지 구분하기 위함, intra_no를 넘겨서 구분지어도 되긴하지만, 조금 더 범용성을 위해서 repoKey를 넘김
            newOneData, //스프레드 테이블 내 객체들 중 하나
            latestData[repoKey], //최신 데이터 테이블 중 하나
          );
        } else {
          targetObj = await this.findTargetByKey(
            repo,
            repoKey,
            newOneData,
            latestData[repoKey],
          );
        }
        //console.log(this.checkChangedData(repoKey, newOneData, targetObj));
        //     while (1);
        //바뀐게 있다면, 저장
        await this.saveChangedData(
          repo, //repoKey만 보내 해당 함수내에서 repoDict로 repo를 생성하여 save 시도하면 해당 함수내에선 repository를 명확히 특정할 수 없다 판단하므로 인자로 repo를 넘겨줌
          repoKey,
          newOneData,
          targetObj,
        );
        //chageList.push(this.checkChangedData(repoKey, newOneData, targetObj));
      }
      console.log(repoKey, ' is done');
    }
    return 'done!!';
  }

  createDate(date) {
    return new Date(date);
  }

  checkSpecialValue(newOneData, targetObj, key, repo) {
    const date = /date$/;

    if (date.test(key)) {
      newOneData[key] = this.createDate(newOneData[key]);
      targetObj[key] = this.createDate(targetObj[key]);
      if (newOneData[key].getTime() != targetObj[key].getTime()) {
        const changeData = repo.create(newOneData);
        repo.save(changeData);
        console.log('is saved due to date changed');
        return DEFAULT_VALUE.CHANGED;
      } else {
        //date 변환시켰는데 값이 같다면 다음 컬럼을 비교하기 위해 DATE 를 리턴해줌
        return DEFAULT_VALUE.DATE;
      }
    }
    return DEFAULT_VALUE.NOT_DEFAULT;
  }

  //default 값을 갖는 column이 spread에 null인지 확인 후 default값으로 spread data 변환
  initailizeSpreadNullValue(newOneData, key: string) {
    //스프레드의 컬럼값이 null 인데,
    if (newOneData[key] === null) {
      const defaultArray = Object.keys(defaultVALUE);
      //파라미어틔 key가 해당 table의 컬럼에 defualt 값을 갖는 컴럼이라면, default 값으로 초기화
      if (defaultArray.includes(key)) {
        console.log(`${key} ini`, newOneData[key], ' ', defaultVALUE[key]);
        newOneData[key] = defaultVALUE[key];
      }
    }
  }

  async saveChangedData(repo, repoKey, newOneData, targetObj) {
    // let newTuple = {};
    // const repo = this.repoDict[repoKey];
    //  console.log('in check changed');
    // console.log(Object.keys(newOneData), 'a');
    let checkedDefaulte;
    try {
      const keys = Object.keys(newOneData); //.map((key) => {

      //각 테이블의 column을 뽑아옴
      for (const key of keys) {
        //new data의 key 값이 default 값을 갖는 column 일때, 값 파악 후 초기화
        this.initailizeSpreadNullValue(newOneData, key);
        //초기화 했는데 DB 와 값이 다르면 save후 넘어감 -> continue;
        //값이 같다면 default 값으로 초기화 후 비교한 값이변화가 없으므로 넘어가야함 -> continue;
        //date 값은 밑에 if 절로 구별이 안되어 같은 date type으로 바꾸어 비교해야됨
        checkedDefaulte = this.checkSpecialValue(
          newOneData,
          targetObj,
          key,
          repo,
        );
        if (
          checkedDefaulte === DEFAULT_VALUE.CHANGED ||
          checkedDefaulte === DEFAULT_VALUE.DATE
        ) {
          continue;
        }
        //this.processChangeData(newOneData, targetObj, key, checkedDefaulte, repo);
        //스프레드에 널값이라면 default 값으로 바꾸고, default가 아님에도 불구하고 값이 다르다면 save
        if (newOneData[key] != targetObj[key]) {
          console.log(
            `repo : ${repoKey} \n key : ${key} \n value : ${newOneData[key]}
              \n key : ${key} \n value : ${targetObj[key]}///////\n`,
          );

          // newTuple = await repo.create(newOneData); -> intra_no 가 이미 테이블에 있는 경우 삽입하지 않음 해서 create를 사용하지 않았음
          await repo.save(newOneData); /*.catch(() => {
            return 'error save';
          });*/
          return 'chaged'; //true; //changed
        }
      }
      return 'net changed'; //false; //not changed
    } catch {
      throw "the spread column isn't in DataBase colume";
    }
  }
}
