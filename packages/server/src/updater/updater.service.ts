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
  dateTable,
} from './name_types/updater.name';
import {
  UserComputationFund,
  UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';
import { MAIN_SHEET, SPREAD_END_POINT } from 'src/config/key';
import { UpdateDB } from 'src/user_information/argstype/updateSheet.argstype';

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
            "start_process_date": "2020-01-28",
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
      //위에 tableSet.[0].name 이런식으로 이름을 가져올 수 있지만 위에선 user table만 받아와서 다시 받음
      const repoKey = this.spreadService.getTableName(sheetIdx);
      //console.log('updateOldData', repoKey);
      //시트의 총 장수 만큼 반복
      if (pastDataOnSheet[sheetIdx].endPoint) {
        pastDataOnSheet[sheetIdx]['repo'] = this.repoDict[repoKey];
        await this.spreadService.getOldSheetTable(
          pastDataOnSheet[sheetIdx], //end point
          repoKey,
        );
      } else if (
        (pastColumn = pastDataOnColumn.find(
          (Column) => Column.table === pastDataOnSheet[sheetIdx].table,
        )) != undefined
      ) {
        await this.spreadService.getOldSheetLogColumns(pastColumn, repoKey);
      }
    }
    //console.log(tuple, 'aa)=');
    return await 'All old data has been updated';
  }

  async getLatestData() {
    const returnArray = {};
    const valueArray = Object.values(repoKeys);
    let key;

    for (const repoKey of valueArray) {
      if (repoKey == 'user') key = 'intra_no';
      else key = 'fk_user_no';
      returnArray[repoKey] = await this.repoDict[repoKey]
        .createQueryBuilder(repoKey)
        .distinctOn([`${repoKey}.${key}`])
        .orderBy(`${repoKey}.${key}`, 'DESC')
        .addOrderBy(`${repoKey}.${dateTable[repoKey]}`, 'DESC')
        .getMany();
    }
    return returnArray;
  }

  async extractDataIntoSpreadsheet() {
    //시트를 삭제하는 명령
    const deletePage = [
      {
        deleteSheet: {
          sheetId: 'user',
        },
      },
    ];
    const googleSheet = await this.spreadService.getGoogleSheetAPI();
    await this.spreadService.controlSheet(
      SPREAD_END_POINT,
      googleSheet,
      deletePage,
    );
    return await '';
  }

  async getDataToModifyFromDB(updateDB: UpdateDB) {
    return await this.spreadService.getDataToModifyFromDB(
      SPREAD_END_POINT,
      updateDB.sheetName,
    );
  }

  async saveModifiedDataFromSheet(updateDB: UpdateDB) {
    return await this.spreadService.saveModifiedDataFromSheet(
      SPREAD_END_POINT,
      updateDB.sheetName,
    );
  }

  async findTargetByKey(repo, repoKey, newOneData, targetObj) {
    const emptyObj = {};
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
      await this.spreadService.initValidateDate(repoKey, newOneData);
      const newTuple = await repo.create(newOneData);
      await repo.save(newTuple); /*.catch(() => {
        return 'error save';
      });*/
      //빈 객체를 리턴해줌으로써 호출한 곳에서 target을 못찾았고 새로운 값을 저장했다는 것을 알려줌
      return await emptyObj;
    } catch {
      throw 'error at finding target by key';
    }
  }

  isEmptyObj(obj): boolean {
    if (obj.constructor === Object || Object.keys(obj).length === 0)
      return true;
    return false;
  }

  //newData -> spread
  //latestData -> DB
  async compareNewDataWithLatestData(newTables, latestData) {
    let targetObj = {};

    const repoNameArray = Object.values(repoKeys);
    //db table 이름별로 받은 데이터를 구분해놓은것을 repoNameArray 배열로 구별하여 식별
    for (const repoKey of repoNameArray) {
      const repo = this.repoDict[repoKey];
      const newTable = newTables[repoKey];
      //if (repoKey == 'user_loyalty_management') console.log(newTable);
      //스프레스에서 받아온 newTable가 비어있다면 밑에 for문에서 not iterable로 터지니까 예외처리
      if (newTable == undefined) {
        console.log(repoKey, ' : ', newTable, 'datas is undefined');
        continue;
      }
      //스프레드에서 table 명으로 나누어 파싱해 둔 데이터를 tableName 구별하여 같은 Db 데이터 테이블에서 해당하는 객체를 받아옴
      for (const newOneData of newTable) {
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
        //타겟을 찾았고, 바뀐게 있다면, 저장
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

  // initValidateDate(repoKey, saveDate) {
  //   //데이터의 유효성을 확인하는 컬럼이 validate_date라면, 저장하는 데이터의 시간을 기점으로 저장
  //   if (dateTable[repoKey] === 'validate_date') {
  //     saveDate['validate_date'] = new Date();
  //   } else {
  //     saveDate['validate_date'] = saveDate[dateTable[repoKey]];
  //   }
  // }

  async saveChangedData(repo, repoKey, newOneData, targetObj) {
    let checkedDate;
    try {
      const keys: string[] = Object.keys(newOneData);

      for (const key of keys) {
        //new data(spread)의 key 값이 default 값을 갖는 column 일때, null 값 파악 후 초기화
        if (
          this.spreadService.isDefaultColumn(repoKey, key) ===
          DEFAULT_VALUE.DEFAULT
        ) {
          this.spreadService.initailizeSpreadNullValue(
            newOneData,
            key,
            repoKey,
          );
        }
        //초기화 했는데 DB 와 값이 다르면 save후 넘어감 -> continue;
        //값이 같다면 default 값으로 초기화 후 비교한 값이변화가 없으므로 넘어가야함 -> continue;
        //date 값은 밑에 if 절로 구별이 안되어 같은 date type으로 바꾸어 비교해야됨
        checkedDate = await this.spreadService.checkDateValue(
          newOneData,
          targetObj,
          repoKey,
          key,
          repo,
        );
        if (
          //날짜의 변경을 확인하고 바꾸었던가, 날짜인 데이터지만 바뀌지 않았을 때 다음 column 조회
          checkedDate === DEFAULT_VALUE.CHANGED ||
          checkedDate === DEFAULT_VALUE.DATE
        ) {
          continue;
        }
        //this.processChangeData(newOneData, targetObj, key, checkedDefaulte, repo);
        //스프레드에 널값이라면 default 값으로 바꾸고, default가 아님에도 불구하고 값이 다르다면 save
        if (newOneData[key] != targetObj[key]) {
          let newTuple: any;
          await this.spreadService.initValidateDate(repoKey, newOneData);
          if (repoKey != 'user') {
            newTuple = await repo.create(newOneData);
            await repo.save(newTuple); /*.catch(() => {
            return 'error save';
          });*/
          }
          //intra_no 가 이미 테이블에 있는 경우 삽입하지 않음, 해서 create를 사용하지 않고 find로 tuple을 가져옴
          else {
            this.spreadService.updateTuple(
              repoKey,
              newOneData,
              key,
              newOneData[key],
            );
          }
          //  console.log('\n\n\n', newTuple, repoKey, '\n\n\n');
        }
      }
    } catch {
      throw 'error during save';
    }
  }
}
