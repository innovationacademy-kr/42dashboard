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
  dateTable,
  autoProcessingDataObj,
  oldDateTable,
  classType,
} from './name_types/updater.name';
import {
  UserComputationFund,
  // UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';
import { MAIN_SHEET, SPREAD_END_POINT } from 'src/config/key';
import { UpdateDB } from 'src/user_information/argstype/updateSheet.argstype';
import { EntityColumn } from 'src/common/EntityColumn';
import { APIS } from 'googleapis/build/src/apis';
import { entityArray } from 'src/user_information/utils/getDomain.utils';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { tableName } from 'src/common/tableName';
import { elementAt } from 'rxjs';
import { Bocal, ErrorObject } from 'src/auth/entity/bocal.entity';
import {
  ERRORMSG,
  ErrorMsg,
  excelErrorList,
} from 'src/spread/msg/errorMsg.msg';
import { makeServer } from 'graphql-ws';

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
    [repoKeys.userComputationFund]: this.userComputationFundRepository,
    [repoKeys.userAccessCardInformation]:
      this.userAccessCardInformationRepository,
    [repoKeys.userOtherInformation]: this.userOtherInformationRepository,
    [repoKeys.userLapiscineInformation]:
      this.userLapiscineInformationRepository,
  };

  @Cron('00 00 00 * * *') //24시간마다 업데이트
  updatePerDay() {
    console.log('start update', this.updateData());
  }

  async updateData() {
    const tableSet = [] as TableSet[];
    const errorMsg = [] as ErrorMsg[];
    let deleteOrEdit: boolean;
    const spreadData =
      await this.spreadService.sendRequestToSpreadWithGoogleAPI(
        SPREAD_END_POINT,
        MAIN_SHEET,
      );
    const tables = spreadData[0].filter((value) => value != ''); //모든 테이블
    const columns = spreadData[1]; //모든 테이블의 컬럼 ex) [Intra No., Intra ID, 성명 ...]
    const rows = spreadData.filter((value, index) => index > 1); //모든 테이블의 로우 [1,	68641,	kilee, ...]
    const intraNoCol = columns.findIndex((col) => col === 'Intra No.'); //pk
    const uniquenessCol = columns.findIndex((col) => col === '특이사항');
    const transferUser = rows.filter(
      (row) => row[uniquenessCol] === 'transfer',
    );
    //dB에는 softdelete되었는데, 시트에는 살아있어서 pk중복문제발생
    //rows = rows.filter((row) => row[uniquenessCol] != 'transfer'); //임시로 transfer는 저장하지 않도록 나중에 soft-delete로 변경 api오류때문에 문제발생하기에 아예안받음.
    const intraNoArray = rows.map((row) => row[intraNoCol]);
    const userInDB = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select('user.intra_no')
      .orderBy('user.intra_no', 'ASC')
      .getMany();
    const deleteData = userInDB.filter((DBNo: User) =>
      intraNoArray.every((spreadNO: number) => DBNo.intra_no != spreadNO),
    );
    /***************에러 검증****************/

    if (intraNoArray.length > userInDB.length) {
      deleteOrEdit = true;
      console.log('1>>>? ', deleteOrEdit);
    } else {
      deleteOrEdit =
        deleteData.length === userInDB.length - intraNoArray.length;
      console.log('2>>>? ', deleteOrEdit, userInDB.length, intraNoArray.length);
    }

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ErrorObject)
      .execute();
    if (
      !this.checkErrorBeforeUpdate(
        tables,
        columns,
        rows,
        deleteOrEdit,
        intraNoArray,
        errorMsg,
      )
    ) {
      const errorObject = {};
      for (const err of errorMsg) {
        errorObject['error'] = JSON.stringify(err);
        await this.spreadService.insertDataToDB(ErrorObject, errorObject);
      }

      return 'Error while inserting data with main sheet';
    }
    /***************************************/
    /*************사전 처리 작업***************/

    // transfer의 경우 삭제하게된다면, data관리에 문제가 생김
    // 기본적으로 softdelete한 항목은 보이지 않아야하는데, 시트에서는 항상 값이 들어옴
    // 고로 삭제가 아닌 따로 transfer관리가 필요하다고 생각됨.
    // 결론 - api42에서 데이터 받아오는것을 막아주는 것으로 끝맺음.

    //만약 특이사항값이 transfer라면 soft-delete
    // const transferArray = rows.filter(
    //   (row) => row[uniquenessCol] === 'transfer',
    // );
    // //console.log(transferArray);
    // if (transferArray.length > 0) {
    //   //rows = rows.filter((row) => row[uniquenessCol] != 'transfer');
    //   await this.checkSoftDeletedInMain(transferArray, intraNoCol);
    // }

    // //삭제되었던 transfer가 다시 복구되는 경우
    // const nonTransferObject = await this.getRecoverArray(
    //   transferArray,
    //   intraNoCol,
    // );
    // const nonTransferArray = nonTransferObject.map(
    //   (nonTransfer) => nonTransfer.intra_no,
    // );
    // //console.log(nonTransferObject);
    // if (nonTransferArray.length > 0) {
    //   await this.checkRecoverInMain(nonTransferArray, intraNoCol);
    // }

    // 시트에서 유저가 사라졌다면 삭제
    if (deleteOrEdit) {
      await this.checkDeletedInMain(deleteData);
    }
    //시트에서 유저 intra_no이 변경된 경우 intra_no 수정
    else {
      await this.checkPKEditState(userInDB, intraNoArray);
    }

    /*******************************************/
    /************* 데이터 파싱 작업 ***************/

    await this.spreadService.composeTableData(spreadData, tableSet, false); //시트를 테이블 별로 나눠 정보를 저장 TableSet 배열 구성
    const api42s = await this.apiService.getApi();

    const tableArray = {};
    for (const table of tableSet) {
      console.log(table['name']);
      tableArray[table['name']] = {};
      tableArray[table['name']] = await this.spreadService.parseSpread(
        columns,
        rows,
        table,
        transferUser,
        api42s,
      );
    }
    const latestData = await this.getLatestAllOneData();
    console.log(latestData, 'getLatestAllOneData');
    await this.compareNewDataWithLatestData(tableArray, latestData);
    return await 'All data has been updated';
    /*******************************************/
  }

  initTupleAndErrObject(tuple, errIndex, errValue) {
    tuple['sheet'] = '';
    tuple['msg'] = '';
    tuple['index'] = '';
    tuple['value'] = '';
    errIndex = null;
    errValue = null;
  }

  checkErrorBeforeUpdate(
    tables,
    columns,
    rows,
    DeleteOrEdit,
    intraNoArray,
    errorMsg,
  ) {
    const tuple = {} as ErrorMsg;

    //수정과 삭제가 동시에 일어났는지 확인
    if (!DeleteOrEdit) {
      this.spreadService.makeErrorMsg(tuple, '', '', 0, ERRORMSG.DUPPROCESS);
      errorMsg.push(Object.assign({}, tuple));
      console.log('DeleteOrEdit check: ', tuple);
    }

    //intra no이 중복되어 들어왔는지 확인
    const isDup = intraNoArray.some((element) => {
      const checkDup =
        intraNoArray.indexOf(element) !== intraNoArray.lastIndexOf(element);
      if (checkDup) {
        this.spreadService.makeErrorMsg(
          tuple,
          'B',
          element,
          intraNoArray.lastIndexOf(element) + 1,
        );
      }
      return checkDup;
    });
    if (isDup) {
      tuple['message'] = ERRORMSG.DUPLICATE;
      errorMsg.push(Object.assign({}, tuple));
      console.log('isDup check: ', tuple);
    }

    //컬럼이름이 변경되었는지 확인
    if (!this.getAllColumnInDB(columns, tuple)) {
      tuple['message'] = ERRORMSG.COLUMNS;
      errorMsg.push(Object.assign({}, tuple));
      console.log('columns check: ', tuple);
    }

    //테이블 이름이 변경되었는지 확인
    const DBTables = Object.values(tableName);
    const checkTable = DBTables.every((DBtable) => {
      const ret = tables.some((table: string) => table === DBtable);
      if (!ret) tuple['value'] = DBtable;
      return ret;
    });
    if (!(DBTables.length === tables.length && checkTable)) {
      this.spreadService.makeErrorMsg(
        tuple,
        'table',
        'table_name',
        0,
        ERRORMSG.CHANGEDTABLE,
      );
      errorMsg.push(Object.assign({}, tuple));
      console.log('DBTables check: ', tuple);
    }

    //디폴트값이 필요한 항목에 공백이 들어가있는지 확인 넣어줘야하나? 사용성을 해칠까 고민
    // if (!this.spreadService.checkIsEmpty(rows, repoName, tuple, cㄴolumns)) {
    //   errorMsg.push(Object.assign({}, tuple));
    //   console.log('default check: ', tuple);
    // }

    //#REF! or #ERROR! 인지 확인
    if (!this.checkOperationError(rows, tuple)) {
      tuple['message'] = ERRORMSG.NONCALCULATE;
      errorMsg.push(Object.assign({}, tuple));
    }
    if (errorMsg.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  async getRecoverArray(transferArray, intraNoCol) {
    const transferDB = await this.dataSource
      .getRepository(UserPersonalInformation)
      .find({ where: { uniqueness: 'transfer' } }); //transfer가 적혀있는 값들을 가져옴
    const nonTransferArray = transferDB.filter((transDB) => {
      return transferArray.every(
        (transferSheet) => transDB.fk_user_no !== transferSheet[intraNoCol],
      );
    });
    console.log('nontransfer: ', nonTransferArray);
    return nonTransferArray;
  }

  checkOperationError(rows, tuple) {
    const rowArray = [];
    const colArray = [];
    const valueArray = [];
    let ret;
    rows.forEach((row, numIdx) => {
      row.forEach((domain, alphaIdx) => {
        ret = excelErrorList.indexOf(domain);
        if (ret >= 0) {
          rowArray.push(numIdx + 1);
          colArray.push(this.spreadService.numToAlpha(alphaIdx + 1));
          valueArray.push(domain);
        }
      });
    });
    if (valueArray.length > 0) ret = false;
    tuple['colIdx'] = colArray.toString();
    tuple['rowIdx'] = rowArray.toString();
    tuple['value'] = valueArray.toString();
    return ret;
  }

  getAllColumnInDB(columns, tuple) {
    let checkColumn;
    const entities = Object.values(EntityColumn);
    const entityCols = [];
    for (const entity in entities) {
      entityCols.push(...entities[entity]);
    }
    checkColumn = columns.every((col, index) => {
      let flag = false;
      if (col === 'no.') return true; // 스프레드에 있는 no.은 따로 entity에서 저장 x
      if (
        entityCols.some((entity) => {
          return entity.spName === col;
        })
      ) {
        flag = true;
      }
      if (!flag) {
        tuple['colIdx'] = this.spreadService.numToAlpha(index + 1);
        tuple['rowIdx'] = 1;
        tuple['value'] = col;
      }
      return flag;
    });
    // 스프레드에 있는 no.은 따로 entity에서 저장 x
    // 스프레드에 있던 지원금산정 컬럼 삭제
    if (entityCols.length !== columns.length + 5) {
      checkColumn = false;
    }
    return checkColumn;
  }

  //삽입과 삭제와 수정은 동시에 일어날 수 없음.
  async checkDeletedInMain(deleteData) {
    for (const deleteUser of deleteData) {
      const queryRunner = this.dataSource.createQueryRunner();
      const user = await this.dataSource
        .getRepository(User)
        .find({ where: { intra_no: deleteUser.intra_no } });
      queryRunner.manager.remove(user);
    }
    console.log('pkdelete :', deleteData);
  }

  //수정 조금 수정해야함. 수정하고자하는 위치를 수정 -> 저장 -> 정렬
  async checkPKEditState(userInDB, intraNoArray) {
    for (const DBIndex in userInDB) {
      if (userInDB[DBIndex].intra_no != intraNoArray[DBIndex]) {
        const queryRunner = this.dataSource.createQueryRunner();
        const user = await this.dataSource
          .getRepository(User)
          .find({ where: { intra_no: userInDB[DBIndex].intra_no } });
        queryRunner.manager.save(user);
      }
    }
    console.log('pkedit :', userInDB, intraNoArray);
  }

  //메인데이터 soft삭제
  async checkSoftDeletedInMain(deleteData, intraNoCol) {
    console.log('soft-delete');
    deleteData.forEach(async (deleteUser) => {
      const queryRunner = this.dataSource.createQueryRunner();
      const user = await this.dataSource
        .getRepository(User)
        .find({ where: { intra_no: deleteUser[intraNoCol] } });
      console.log(user);
      queryRunner.manager.softRemove(user);
    });
  }

  //메인데이터 soft삭제된 데이터 회복
  async checkRecoverInMain(recoverData, intraNoCol) {
    console.log('soft-recover');
    recoverData.forEach(async (recoverUser) => {
      const queryRunner = this.dataSource.createQueryRunner();
      const user = await this.dataSource.getRepository(User).find({
        withDeleted: true,
        where: { intra_no: recoverUser[intraNoCol] },
      });
      console.log(user);
      queryRunner.manager.recover(user);
    });
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
    const uniquenessCol = columns.findIndex((col) => col === '특이사항'); //임시로 transfer는 저장하지 않도록 나중에 soft-delete로 변경 api오류때문에 문제발생하기에 아예안받음.
    const intraNoCol = columns.findIndex((col) => col === 'Intra No.');
    const transferUser = rows.filter(
      (row) => row[uniquenessCol] === 'transfer',
    );
    // rows = rows.filter((row) => row[uniquenessCol] != 'transfer');
    userTable['user'] = await this.spreadService.parseSpread(
      columns,
      rows,
      tableSet[0],
      transferUser,
      undefined,
    ); //기본 키값이 되는 유저정보 가져오기
    const allUser = await this.repoDict['user']
      .createQueryBuilder('user')
      .getMany();
    for (const user of userTable['user']) {
      await this.findTargetByKey(
        this.repoDict['user'],
        'user',
        user,
        allUser,
        oldDateTable,
      );
    }
    for (const sheetIdx in pastDataOnSheet) {
      //위에 tableSet.[0].name 이런식으로 이름을 가져올 수 있지만 위에선 user table만 받아와서 다시 받음
      const repoKey = this.spreadService.getTableName(sheetIdx);
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
        console.log('save', repoKey);
      }
    }
    return await 'All old data has been updated';
  }

  async getLatestAllOneData() {
    try {
      const returnArray = {};
      const valueArray = Object.values(repoKeys);
      let key;
      for (const repoKey of valueArray) {
        if (repoKey == 'user') {
          key = 'intra_no';
        } else {
          key = 'fk_user_no';
        }
        returnArray[repoKey] = await this.repoDict[repoKey]
          .createQueryBuilder(repoKey)
          .distinctOn([`${repoKey}.${key}`])
          .orderBy(`${repoKey}.${key}`, 'DESC')
          .addOrderBy(`${repoKey}.${dateTable[repoKey]}`, 'DESC')
          .getMany();
      }
      return returnArray;
    } catch {
      throw ExceptionsHandler;
    }
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
    try {
      if (updateDB.sheetName === 'user') {
        return "can't edit user page";
      } else {
        return await this.spreadService.getDataToModifyFromDB(
          SPREAD_END_POINT,
          updateDB.sheetName,
          updateDB.withDeleted,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // maketestsheet() {
  //   return await this.spreadService.maketestsheet(
  //     SPREAD_END_POINT,
  //     '0. 학사정보관리(main)',
  //   );
  // }

  async saveModifiedDataFromSheet(updateDB: UpdateDB) {
    try {
      return await this.spreadService.saveModifiedDataFromSheet(
        SPREAD_END_POINT,
        updateDB.sheetName,
        updateDB.withDeleted,
      );
    } catch (error) {
      throw error;
    }
  }

  async findTargetByKey(repo, tableName, newOneData, targetObj, dateTable) {
    const emptyObj = {};
    try {
      //스프레드 데이터가 db 데이터에 있는지 확인.
      for (const target of targetObj) {
        if (tableName == 'user') {
          if (newOneData.intra_no == target.intra_no) {
            return await target;
          }
        } else {
          if (newOneData.fk_user_no == target.fk_user_no) {
            return await target;
          }
        }
      }

      if (autoProcessingDataObj[tableName] != undefined) {
        const processData = Object.values(autoProcessingDataObj[tableName]);
        const processedDataObj = await this.spreadService.autoProcessingData(
          newOneData,
          tableName,
        );
        if (processData !== undefined) newOneData = processedDataObj;
      }
      await this.spreadService.initValidateDate(
        tableName,
        newOneData,
        dateTable,
      );
      const newTuple = await repo.create(newOneData);
      await repo.save(newTuple); /*.catch(() => {
        return 'error save';
      });*/
      //빈 객체를 리턴해줌으로써 호출한 곳에서 target을 못찾았고 새로운 값을 저장했다는 것을 알려줌
      return emptyObj;
    } catch {
      throw 'error at finding target by key';
    }
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

      //스프레스에서 받아온 newTable가 비어있다면 밑에 for문에서 not iterable로 터지니까 예외처리
      if (newTable != undefined) {
        //스프레드에서 table 명으로 나누어 파싱해 둔 데이터를 tableName 구별하여 같은 Db 데이터 테이블에서 해당하는 객체를 받아옴
        for (const newOneData of newTable) {
          targetObj = await this.findTargetByKey(
            repo, //스프레드엔 있고 DB엔 없을 때 해당 학생 저장하기 위함
            repoKey, //user entity인지 구분하기 위함, intra_no를 넘겨서 구분지어도 되긴하지만, 조금 더 범용성을 위해서 repoKey를 넘김
            newOneData, //스프레드 테이블 내 객체들 중 하나
            latestData[repoKey], //최신 데이터 테이블 중 하나
            dateTable,
          );
          //반환한 객체가 비어있지 않다면
          if (this.spreadService.isEmptyObj(targetObj) === false) {
            //타겟을 찾았고, 바뀐게 있다면, 저장
            await this.saveChangedData(
              repo, //repoKey만 보내 해당 함수내에서 repoDict로 repo를 생성하여 save 시도하면 해당 함수내에선 repository를 명확히 특정할 수 없다 판단하므로 인자로 repo를 넘겨줌
              repoKey,
              newOneData,
              targetObj,
            );
          }
        }
      } else {
        console.log(repoKey, ' : ', newTable, 'datas is undefined');
      }
      console.log('save', repoKey);
    }
    //return 'done!!';
  }

  async saveTuple(repo, Tuple) {
    const newTuple = await repo.create(Tuple);
    await repo.save(newTuple); /*.catch(() => {
    return 'error save';
  });*/
  }

  async saveChangedData(repo, tableName, newOneData, targetObj) {
    let checkedDate;
    try {
      const keys: string[] = Object.keys(newOneData);
      let changed = 0;
      for (const key of keys) {
        //new data(spread)의 key 값이 default 값을 갖는 column 일때, null 값 파악 후 초기화
        if (
          this.spreadService.isDefaultColumn(tableName, key) ===
          DEFAULT_VALUE.DEFAULT
        ) {
          this.spreadService.initailizeSpreadNullValue(
            newOneData,
            key,
            tableName,
          );
        }
        //초기화 했는데 DB 와 값이 다르면 save후 넘어감 -> continue;
        //값이 같다면 default 값으로 초기화 후 비교한 값이변화가 없으므로 넘어가야함 -> continue;
        //date 값은 밑에 if 절로 구별이 안되어 같은 date type으로 바꾸어 비교해야됨
        checkedDate = await this.spreadService.checkDateValue(
          newOneData,
          targetObj,
          tableName,
          key,
          repo,
          changed,
        );
        if (
          //날짜의 변경을 확인하고 바꾸었던가, 날짜인 데이터지만 바뀌지 않았을 때 다음 column 조회
          checkedDate === DEFAULT_VALUE.NOT
        ) {
          //this.processChangeData(newOneData, targetObj, key, checkedDefaulte, repo);
          //스프레드에 널값이라면 default 값으로 바꾸고, default가 아님에도 불구하고 값이 다르다면 save
          if (newOneData[key] != targetObj[key]) {
            changed = 1;
          }
        } else if (checkedDate === DEFAULT_VALUE.CHANGED) {
          //date에서 date 값 비교했을 때 바뀌어야 할 때
          changed = 1;
        }
      }
      if (autoProcessingDataObj[tableName] != undefined) {
        const processData = Object.values(autoProcessingDataObj[tableName]);
        const processedDataObj = await this.spreadService.autoProcessingData(
          newOneData,
          tableName,
        );
        if (processData !== undefined) newOneData = processedDataObj;
      }
      await this.spreadService.initValidateDate(
        tableName,
        newOneData,
        dateTable,
      );
      if (changed == 1) {
        if (tableName !== 'user') await this.saveTuple(repo, newOneData);
        //intra_no 가 이미 테이블에 있는 경우 삽입하지 않음, 해서 create를 사용하지 않고 find로 tuple을 가져옴
        else {
          this.spreadService.updateUser(newOneData);
        }
      }
    } catch {
      throw 'error during save';
    }
  }
}
