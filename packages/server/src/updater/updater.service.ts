import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const index = 0;

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
     *  아래 for 문 두개 돌고 나온 tableArray 값 예시
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
    //   //return await 'finish';
    //   // }
    //   // return table_array;
    //   //    const db_array = this.getLatestData();
    //   //    return db_array;
    // }

    return await 'All data has been updated';
  }

  async updateOldData() {
    /* 지원금 관련 월별 지금액 시트 */
    //this.sendRequestToSpread();
    /* 테이블 별 과거 데이터 */
    let pastColumn;

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

    await this.spreadService.parseSpread(
      cols,
      rows,
      index,
      this.userRepository,
      mapObj[0],
      endOfTable[1],
      undefined,
    );
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

  async updateDb(table_array) {
    console.log('inin');
    for (const table of table_array) {
      console.log(table, 'taaa');
    }
  }

  async getLatestData() {
    let ret;
    let user;
    // for (const repoName of repoArray) {
    const repo = this.dataSource.getRepository(User);
    const obj = {};
    // obj['relations'] = {};
    // obj['relations']['user'] = true;
    // obj['order'] = {};
    // obj['order']['created_at'] = 'DESC';
    // ret = await repo.find(obj);
    // console.log(ret, 'ret');
    // return ret;
    //   }

    let resultd;
    await Object.keys(repoKeys).forEach(async (repoKey) => {
      //console.log('repoKey: ', repoKey);
      const latestDataObj = this.repoDict[repoKey];

      console.log(latestDataObj, 'ddd');
      resultd = await latestDataObj
        .createQueryBuilder(`${repoKey}`)
        .select()
        //.groupBy('user.intra_no')
        .getMany();
    });
    //   console.log(resultd, 'ddsss');
    // return resultd;
    // });
    // console.log(ojj, 'ccc');
    // while (1);
    // try {
    //   user = await repo.find({
    //     order: { intra_id: 'DESC', created_date: 'DESC' },
    //   });
    // } catch {
    //   throw 'error';
    // }
    // //console.log(user[0].intra_no, 'ddd');
    // let checkUser = '0';
    // const userArray = [];
    // for (const latest of user) {
    //   if (latest.intra_id != checkUser) {
    //     checkUser = latest.intra_id;
    //     userArray.push(latest);
    //   }
    //   // if (latest.intra_no == checkUser) {
    //   // }
    // }

    // console.log(userArray);
    // return userArray;
    //학생 개개인의 배열 모음으로 어떻게 구성 할 수 있을까??
    //
    // for (const idx of user) {
    //   user.
    // }
    // for (const obj in user) {
    //   user[obj].fk_user_no
    // }
    //  console.log(user);
    return 'finish';
  }
}
