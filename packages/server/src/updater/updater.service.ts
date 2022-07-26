import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ApiService } from 'src/api/api.service';
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
  pastDataOnColumn,
  pastDataOnSheet,
  repoKeys,
  DEFAULT_VALUE,
  defaultVALUE,
} from './name_types/updater.name';
import {
  UserComputationFund,
  UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';
import { MAIN_SHEET, SPREAD_END_POINT } from 'src/config/key';

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

export interface TableSet {
  name: string; //테이블 이름
  start: number; //테이블의 시작 인덱스
  end: number; //테이블의 종료 인덱스
  repo: any; //테이블저장을 위한 repository
  mapCol: any; //테이블 별 컬럼 맵핑 값
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
  //repoDict.user_personal_inforamtion = repository;
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
    [repoKeys.userAccessCardInformation]:
      this.userAccessCardInformationRepository,
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
  ];

  // apiOfRepo = [this.userLearningDataAPIRepository];

  @Cron('00 00 00 * * *') //24시간마다 업데이트
  updatePerDay() {
    console.log('start update', this.updateData());
  }

  async updateData() {
    const tableSet = [] as TableSet[];
    const spreadData =
      await this.spreadService.sendRequestToSpreadWithGoogleAPI(
        SPREAD_END_POINT,
        MAIN_SHEET,
      );
    await this.spreadService.composeTableData(spreadData, tableSet, false); //시트를 테이블 별로 나눠 정보를 저장 TableSet 배열 구성
    const columns = spreadData[1]; //모든 테이블의 컬럼 ex) [Intra No., Intra ID, 성명 ...]
    const rows = (await spreadData).filter((value, index) => index > 1); //모든 테이블의 로우 [1,	68641,	kilee, ...]
    const api42s = await this.apiService.getApi();
    const tableArray = {};

    for (const table of tableSet) {
      tableArray[table['name']] = {};
      tableArray[table['name']] = await this.spreadService.parseSpread(
        columns,
        rows,
        table,
        api42s,
      );
    }
    const latestData = await this.getLatestData();
    await this.compareNewDataWithLatestData(tableArray, latestData);

    return await 'All data has been updated';
  }

  /**
     *  위 updateData 함수의 for문 돌고 나온 tableArray 값 예시
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

  async updateOldData() {
    /* 지원금 관련 월별 지금액 시트 */
    //this.sendRequestToSpread();
    /* 테이블 별 과거 데이터 */
    let pastColumn;
    const userTable = {};
    const tableSet = [] as TableSet[];

    const spreadData =
      await this.spreadService.sendRequestToSpreadWithGoogleAPI(
        SPREAD_END_POINT,
        MAIN_SHEET,
      );
    await this.spreadService.composeTableData(spreadData, tableSet, true);
    const columns = spreadData[1];
    const rows = (await spreadData).filter((value, index) => index > 1);
    userTable['user'] = await this.spreadService.parseSpread(
      columns,
      rows,
      tableSet[0],
      undefined,
    ); //기본 키값이 되는 유저정보 가져오기
    const allUser = await this.repoDict['user']
      .createQueryBuilder('user')
      .getMany();
    for (const user of userTable['user']) {
      await this.findTargetByKey(this.repoDict['user'], 'user', user, allUser);
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
      } else {
        returnArray[repoKey] = await this.repoDict[repoKey]
          .createQueryBuilder(repoKey)
          .distinctOn([`${repoKey}.fk_user_no`])
          .orderBy(`${repoKey}.fk_user_no`, 'DESC')
          .addOrderBy(`${repoKey}.created_date`, 'DESC')
          .getMany();
      }
    }

    return returnArray;
  }

  async extractDataIntoSpreadsheet() {
    return await this.spreadService.createSpreadsheet(
      SPREAD_END_POINT,
      'googleapi/newpage',
    );
  }

  async findTargetByKey(repo, repoKey, newOneData, targetObj) {
    const emptyObj = {};
    console.log(repoKey, '\n', 'new:', newOneData, '!!');
    try {
      //스프레드 데이터가 db 데이터에 있는지 확인.
      for (const target of targetObj) {
        if (repoKey == 'user') {
          if (newOneData.intra_no == target.intra_no) {
            return await target;
          }
        } else {
          if (newOneData.fk_user_no == target.fk_user_no) {
            return await target;
          }
        }
      }

      console.log(`insert ${repoKey} due to dosend't exist spread data in db`);
      const newTuple = await repo.create(newOneData);
      await repo.save(newTuple); /*.catch(() => {
        return 'error save';
      });*/
      //빈 객체를 리턴해줌으로써 호출한 곳에서 target을 못찾았다는 것을 알려줌
      return await emptyObj;
    } catch {
      throw "can't find target by key";
    }
  }

  isEmptyObj(obj): boolean {
    if (obj.constructor === Object || Object.keys(obj).length === 0)
      return true;
    return false;
  }

  //newData -> spread
  //latestData -> DB
  async compareNewDataWithLatestData(newData, latestData) {
    let targetObj = {};

    const repoNameArray = Object.values(repoKeys);
    //db table 이름별로 받은 데이터를 구분해놓은것을 repoNameArray 배열로 구별하여 식별
    for (const repoKey of repoNameArray) {
      const repo = this.repoDict[repoKey];
      const datas = newData[repoKey];
      //스프레스에서 받아온 newData(table)가 비어있다면 밑에 for문에서 not iterable로 터지니까 예외처리
      if (datas == undefined) {
        console.log('datas : ', datas, 'datas');
        continue;
      }
      //스프레드에서 table 명으로 나누어 파싱해 둔 데이터를 tableName 구별하여 같은 Db 데이터 테이블에서 해당하는 객체를 받아옴
      for (const newOneData of datas) {
        targetObj = await this.findTargetByKey(
          repo, //스프레드엔 있고 DB엔 없을 때 해당 학생 저장하기 위함
          repoKey, //user entity인지 구분하기 위함, intra_no를 넘겨서 구분지어도 되긴하지만, 조금 더 범용성을 위해서 repoKey를 넘김
          newOneData, //스프레드 테이블 내 객체들 중 하나
          latestData[repoKey], //최신 데이터 테이블 중 하나
        );
        //반환한 객체가 비어있다면 내부에서 save를 하고 나오므로 contitnue;
        if (this.isEmptyObj(targetObj) === true) {
          continue;
        }
        //바뀐게 있다면, 저장
        await this.saveChangedData(
          repo, //repoKey만 보내 해당 함수내에서 repoDict로 repo를 생성하여 save 시도하면 해당 함수내에선 repository를 명확히 특정할 수 없다 판단하므로 인자로 repo를 넘겨줌
          repoKey,
          newOneData,
          targetObj,
        );
      }
    }
    //return 'done!!';
  }

  createDate(date) {
    return new Date(date);
  }

  isDefaultColumn(repoKey, key) {
    if (
      Object.keys(defaultVALUE).find((table) => table === repoKey) === undefined
    )
      return DEFAULT_VALUE.NOT_DEFAULT;
    if (
      Object.keys(defaultVALUE[repoKey]).find((col) => col === key) ===
      undefined
    )
      return DEFAULT_VALUE.NOT_DEFAULT;
    return DEFAULT_VALUE.DEFAULT;
  }

  checkSpecialValue(newOneData, targetObj, repoKey, key, repo) {
    const date = /date$/;

    if (date.test(key)) {
      newOneData[key] = this.createDate(newOneData[key]);
      targetObj[key] = this.createDate(targetObj[key]);

      if (newOneData[key].getTime() != targetObj[key].getTime()) {
        const changeData = repo.create(newOneData);
        repo.save(changeData);
        console.log(
          `column name is ${key} \n`,
          targetObj[key],
          'is date changed to ',
          newOneData[key],
        );
        return DEFAULT_VALUE.CHANGED;
      } else {
        //date 변환시켰는데 값이 같다면 다음 컬럼을 비교하기 위해 DATE 를 리턴해줌
        return DEFAULT_VALUE.DATE;
      }
    }
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
    let checkedDefaulte;
    try {
      const keys: string[] = Object.keys(newOneData);
      //각 테이블의 column을 뽑아옴
      for (const key of keys) {
        //new data(spread)의 key 값이 default 값을 갖는 column 일때, null 값 파악 후 초기화
        if (this.isDefaultColumn(repoKey, key) === DEFAULT_VALUE.DEFAULT) {
          this.initailizeSpreadNullValue(newOneData, key);
        }
        //초기화 했는데 DB 와 값이 다르면 save후 넘어감 -> continue;
        //값이 같다면 default 값으로 초기화 후 비교한 값이변화가 없으므로 넘어가야함 -> continue;
        //date 값은 밑에 if 절로 구별이 안되어 같은 date type으로 바꾸어 비교해야됨
        checkedDefaulte = this.checkSpecialValue(
          newOneData,
          targetObj,
          repoKey,
          key,
          repo,
        );
        if (
          //날짜의 변경을 확인하고 바꾸었던가, 날짜인 데이터지만 바뀌지 않았을 때 다음 column 조회
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
        }
      }
    } catch {
      throw "the spread column isn't in DataBase colume";
    }
  }
}
