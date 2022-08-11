import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiService } from 'src/api/api.service';
import { google } from 'googleapis';
import { credentials } from 'src/config/credentials';
import { tableName } from 'src/common/tableName';
import { EntityColumn } from 'src/common/EntityColumn';
import {
  aggregateDataObj,
  autoProcessingDataObj,
  classType,
  dateTable,
  defaultVALUE,
  DEFAULT_VALUE,
  LOCALTIME,
  oldDateTable,
  REMAINDPAYMENTPERIOD,
  repoKeys,
} from 'src/updater/name_types/updater.name';
import { UserHrdNetUtilizeConsent } from 'src/user_job/entity/user_job.entity';
import { UserComputationFund } from 'src/user_payment/entity/user_payment.entity';
import { UserLearningDataAPI } from 'src/user_status/entity/user_status.entity';
import { Brackets, DataSource } from 'typeorm';
import { MAIN_SHEET, SPREAD_END_POINT } from 'src/config/key';
import { TableSet } from 'src/updater/updater.service';
import {
  entityArray,
  getDomain,
} from 'src/user_information/utils/getDomain.utils';
import { ideahub } from 'googleapis/build/src/apis/ideahub';
import { User } from 'src/user_information/entity/user_information.entity';
import {
  ERRORMSG,
  ErrorMsg,
  formatError,
  formatErrorMain,
} from './msg/errorMsg.msg';

@Injectable()
export class SpreadService {
  private sheetId;
  constructor(
    private apiService: ApiService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    this.sheetId = {};
  }

  /**************************/
  /*        google API      */
  /**************************/

  /* google API로 spread sheet data읽어오기 */
  async sendRequestToSpreadWithGoogleAPI(endPoint: string, id: string) {
    const authorize = new google.auth.JWT(
      credentials['client_email'],
      null,
      credentials['private_key'],
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
    // google spread sheet api 가져오기
    const googleSheet = google.sheets({
      version: 'v4',
      auth: authorize,
    });
    // 실제 스프레드시트 내용 가져오기
    try {
      const context = await googleSheet.spreadsheets.values.get({
        spreadsheetId: endPoint,
        range: id,
        dateTimeRenderOption: 'FORMATTED_STRING',
      });
      return context.data.values;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  /* google spread sheet api 접근권한설정 */
  async getGoogleSheetAPI() {
    //프라이빗 키 값으로, 인증 토큰 발급
    const authorize = new google.auth.JWT(
      credentials['client_email'],
      null,
      credentials['private_key'],
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    // google spread sheet api 가져오기
    return await google.sheets({
      version: 'v4',
      auth: authorize,
    });
  }

  /* order에 따라 시트 삭제 혹은 추가하는 함수 */
  async controlSheet(endPoint: string, googleSheet, order) {
    try {
      const request = {
        spreadsheetId: endPoint,
        resource: {
          requests: order,
        },
      };
      const response = (await googleSheet.spreadsheets.batchUpdate(request))
        .data;
      return response;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  //DB컬럼(영어) -> 스프레드컬럼(한글)
  convDBColumnToSpreadColumn(DBCol, entityColumns) {
    return DBCol.map((col) => {
      const spreadCol = entityColumns.find(
        (entitycol) => entitycol.dbName === col,
      );
      if (spreadCol === undefined) {
        return col;
      } else {
        return spreadCol.spName;
      }
    });
  }

  //스프레드컬럼(한글) -> DB컬럼(영어)
  convSpreadColumnToDBColumn(spreadCol, entityColumns) {
    return spreadCol.map((col) => {
      const DBCol = entityColumns.find((entitycol) => entitycol.spName === col);
      if (DBCol === undefined) {
        return col;
      } else {
        return DBCol.dbName;
      }
    });
  }

  //삭제정보도 포함하는지 검사하는 함수
  async checkWithDeleted(withDeleted: string, repoName: string) {
    if (withDeleted === 'Y') {
      return await this.dataSource.getRepository(entityArray[repoName]).find({
        withDeleted: true,
        order: {
          pk: 'ASC',
        },
      });
    } else if (withDeleted === 'N') {
      return await this.dataSource.getRepository(entityArray[repoName]).find({
        order: {
          pk: 'ASC',
        },
      });
    } else {
      return 'error';
    }
  }

  async checkLatestWithDeleted(repo, withDeleted: string, repoName: string) {
    if (withDeleted === 'Y') {
      return await repo
        .createQueryBuilder(repoKeys[repoName])
        .distinctOn([`${repoKeys[repoName]}.fk_user_no`])
        .orderBy(`${repoKeys[repoName]}.fk_user_no`, 'DESC')
        .addOrderBy(`${repoKeys[repoName]}.validate_date`, 'DESC')
        .withDeleted()
        .getMany();
    } else if (withDeleted === 'N') {
      return await repo
        .createQueryBuilder(repoKeys[repoName])
        .distinctOn([`${repoKeys[repoName]}.fk_user_no`])
        .orderBy(`${repoKeys[repoName]}.fk_user_no`, 'DESC')
        .addOrderBy(`${repoKeys[repoName]}.validate_date`, 'DESC')
        .getMany();
    } else {
      return 'error';
    }
  }

  /*  DB에 있는 데이터를 수정하기 위해 스프레드 시트로 옮기는 함수  */
  async getDataToModifyFromDB(endPoint: string, repoName, withDeleted) {
    // google spread sheet api 가져오기
    const googleSheet = await this.getGoogleSheetAPI();
    const createPage = [
      {
        //시트를 추가하는 명령
        addSheet: {
          properties: {
            title: tableName[repoName],
          },
        },
      },
    ];
    const pageRes = await this.controlSheet(endPoint, googleSheet, createPage);
    this.sheetId[repoName] =
      pageRes['replies'][0]['addSheet']['properties']['sheetId'];
    if (this.sheetId[repoName] == 0) return "Can't edit user page";
    const values = [];
    const datas = await this.checkWithDeleted(withDeleted, repoName);
    if (datas === 'error') return 'error';
    const spreadCol = this.convDBColumnToSpreadColumn(
      Object.keys(datas[0]),
      EntityColumn[this.capitalize(repoName)],
    );
    values.push(spreadCol);
    datas.forEach((data) => values.push(Object.values(data)));
    const request = {
      // 업데이트 하기위한 시트의 id값.
      spreadsheetId: endPoint, // TODO: Update placeholder value.
      // 값을 넣을 위치로 A1를 선정 .
      range: `${tableName[repoName]}!A1`, // TODO: Update placeholder value.
      // 입력된 데이터를 어떻게 처리할 것인지
      valueInputOption: 'USER_ENTERED', //입력은 마치 Google Sheets UI에 입력한 것처럼 정확하게 구문 분석됨
      resource: {
        values,
      },
    };
    try {
      const response = (await googleSheet.spreadsheets.values.update(request))
        .data;
      const repo = this.dataSource.getRepository(entityArray[repoName]);
      const latestData = await repo
        .createQueryBuilder(repoKeys[repoName])
        .distinctOn([`${repoKeys[repoName]}.fk_user_no`])
        .orderBy(`${repoKeys[repoName]}.fk_user_no`, 'DESC')
        .addOrderBy(`${repoKeys[repoName]}.validate_date`, 'DESC')
        .getMany();
      await this.addColorForGuide(
        endPoint,
        googleSheet,
        values,
        latestData,
        this.sheetId[repoName],
      );
      return `https://docs.google.com/spreadsheets/d/${SPREAD_END_POINT}/edit#gid=${this.sheetId[repoName]}`;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  setColorRange(sheetId, rowStart, rowEnd, colStart, colEnd, color) {
    const request = {
      repeatCell: {
        range: {
          sheetId: sheetId,
          startRowIndex: rowStart,
          endRowIndex: rowEnd,
          startColumnIndex: colStart,
          endColumnIndex: colEnd,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: color,
          },
        },
        fields: 'userEnteredFormat(backgroundColor)',
      },
    };
    return request;
  }

  addFilterView(
    sheetId: number,
    rowNum: number,
    colStart: number,
    colEnd: number,
    pkCol: number,
  ) {
    const request = {
      setBasicFilter: {
        filter: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: rowNum,
            startColumnIndex: colStart,
            endColumnIndex: colEnd,
          },
          sortSpecs: [
            {
              sortOrder: 'ASCENDING',
            },
          ],
          filterSpecs: [
            {
              columnIndex: pkCol,
            },
          ],
        },
      },
    };
    return request;
  }

  setColor(red, green, blue) {
    const color = {
      red: red,
      green: green,
      blue: blue,
    };
    return color;
  }

  //최신데이터의 색 넣을 위치찾기
  addColorLatestData(
    requests,
    values,
    latestData,
    sheetId,
    pkCol,
    colNum,
    color,
  ) {
    latestData.forEach((element) => {
      let idx;
      values.forEach((value, index) => {
        if (value[pkCol] == element['pk']) idx = index;
        return value[pkCol] == element['pk'];
      });
      requests.push(
        this.setColorRange(sheetId, idx, idx + 1, 0, colNum, color),
      );
    });
  }

  async addColorForGuide(endPoint, googleSheet, values, latestData, sheetId) {
    const pkCol = values[0].findIndex((col) => col === 'pk');
    const fkCol = values[0].findIndex((col) => col === 'fk_user_no');
    const rowNum = values.length;
    const colNum = values[0].length;
    const red = this.setColor(1.0, 0.7, 0.7);
    const green = this.setColor(0.2, 0.7, 0.8);
    const blue = this.setColor(0.3, 0.3, 0.8);
    const requests = [
      this.setColorRange(sheetId, 0, 1, 0, colNum, green),
      this.setColorRange(sheetId, 0, rowNum, pkCol, pkCol + 1, red),
      this.setColorRange(sheetId, 0, rowNum, fkCol, fkCol + 1, red),
      this.addFilterView(sheetId, rowNum, 0, colNum, pkCol),
    ];
    this.addColorLatestData(
      requests,
      values,
      latestData,
      sheetId,
      pkCol,
      colNum,
      blue,
    );
    const response = await this.controlSheet(endPoint, googleSheet, requests);
  }

  /* 수정을 위해 생성했던 시트상에서 수정된 데이터를 DB테이블로 다시 업데이트하는 함수 */
  async saveModifiedDataFromSheet(endPoint, repoName, withDeleted) {
    const newDatas = [];
    const errorMsg = {} as ErrorMsg;
    if (this.sheetId[repoName] == 0 || this.sheetId[repoName] === undefined)
      return formatErrorMain(tableName[repoName], ERRORMSG.DISAPPEARED); //수정하던 시트에 문제가 생긴경우
    if (this.sheetId[repoName] == -1)
      //수정 도중 main이 업데이트된 경우, 해당 시트는 저장할 수 없음.
      return 'main is updated \nAfter deleting the edit sheet, click edit again';
    const googleSheet = await this.getGoogleSheetAPI();
    const deleteDatas = [];
    const restoreDatas = [];
    console.log('delete: ', this.sheetId[repoName]);
    const deletePage = [
      {
        //시트를 삭제하는 명령
        deleteSheet: {
          sheetId: this.sheetId[repoName],
        },
      },
    ];
    let spreadData;
    try {
      spreadData = await this.sendRequestToSpreadWithGoogleAPI(
        endPoint,
        tableName[repoName],
      );
    } catch (error) {
      throw ERRORMSG.DISAPPEARED;
    }

    const columns = this.convSpreadColumnToDBColumn(
      spreadData[0],
      EntityColumn[this.capitalize(repoName)],
    );
    const spreadColumns = spreadData[0];
    spreadData.shift();
    spreadData.unshift(columns);
    const rows = (await spreadData).filter((value, index) => index > 0);
    try {
      const ret = await this.compareDataToCheckError(
        spreadData,
        spreadColumns,
        repoName,
        withDeleted,
        newDatas,
        deleteDatas,
        restoreDatas,
        errorMsg,
      ); //pk중복 체크도 해야함?
      if (ret === 'column error') {
        return formatError(tableName[repoName], ERRORMSG.COLUMNS, errorMsg);
      } else if (ret === 'check to duplicate') {
        return formatError(tableName[repoName], ERRORMSG.DUPLICATE, errorMsg);
      } else if (ret === 'interrupt error') {
        return formatError(tableName[repoName], ERRORMSG.INTERRUPT, errorMsg);
      } else if (ret === 'changed latest error') {
        return formatError(tableName[repoName], ERRORMSG.CHANGED, errorMsg);
      } else if (ret === 'The updated data is wrong') {
        return formatError(tableName[repoName], ERRORMSG.UPDATE, errorMsg);
      } else if (ret === 'The inserted data is wrong') {
        return formatError(tableName[repoName], ERRORMSG.INSERT, errorMsg);
      } else if (ret === 'empty nonnullable cell') {
        return formatError(tableName[repoName], ERRORMSG.NULL, errorMsg);
      }
      for (const row of rows) {
        const tuple = {};
        for (const col in columns) {
          this.makeRowPerColumnToModify(row, columns, col, tuple, repoName);
        }
        await this.updateDataToDB(repoName, tuple);
      }
      if (newDatas.length > 0) {
        for (const newData of newDatas) {
          const tuple = {};
          for (const col in columns) {
            this.makeRowPerColumnToModify(
              newData,
              columns,
              col,
              tuple,
              repoName,
            );
          }
          await this.insertDataToDB(entityArray[repoName], tuple);
        }
      }
      await this.controlSheet(endPoint, googleSheet, deletePage);
      return ERRORMSG.SUCCESS;
    } catch (err) {
      throw err;
    }
  }

  async deleteDataToDB(deleteDatas, tuple, repoName) {
    const deleteData = deleteDatas.find((data) => data.pk == tuple['pk']);
    if (deleteData !== undefined) {
      await this.dataSource
        .getRepository(entityArray[repoName])
        .createQueryBuilder(repoName)
        .where(`pk = :pk`, {
          pk: tuple['pk'],
        })
        .softDelete();
    }
  }

  async restoreDataToDB(restoreDatas, tuple, repoName) {
    const restoreData = restoreDatas.find((data) => data.pk == tuple['pk']);
    if (restoreData !== undefined) {
      await this.dataSource
        .getRepository(entityArray[repoName])
        .createQueryBuilder(repoName)
        .where(`pk = :pk`, {
          pk: tuple['pk'],
        })
        .restore();
    }
  }

  numToAlpha(num: number) {
    let columnLetter = '';
    let alphaNum;

    while (num > 0) {
      alphaNum = (num - 1) % 26;
      columnLetter = String.fromCharCode(65 + alphaNum) + columnLetter;
      num = ((num - alphaNum) / 26) | 0;
    }
    return columnLetter || undefined;
  }

  makeErrorMsg(
    errorMsg: ErrorMsg,
    colIdx: string,
    value: string,
    rowIdx?: number,
    message?: string,
  ) {
    errorMsg['colIdx'] = colIdx;
    errorMsg['value'] = value;
    if (rowIdx != undefined) errorMsg['rowIdx'] = rowIdx;
    if (message != undefined) errorMsg['message'] = message;
  }

  // 정확히 같은 배열인지 확인하는 함수
  compareSameArray(arrayOne, arrayTwo, errorMsg, index) {
    const ret =
      arrayOne.length === arrayTwo.length &&
      arrayOne.every((oneValue, idx) => {
        let oneValueToString;
        if (oneValue instanceof Date && !isNaN(oneValue.getTime())) {
          oneValueToString = oneValue.toISOString();
        } else if (oneValue == null) {
          oneValueToString = '';
        } else {
          oneValueToString = String(oneValue);
        }
        if (!(oneValueToString == arrayTwo[idx])) {
          this.makeErrorMsg(
            errorMsg,
            this.numToAlpha(idx + 1),
            arrayTwo[idx],
            index + 1,
          );
        }
        return oneValueToString == arrayTwo[idx];
      });
    if (arrayOne.length !== arrayTwo.length)
      this.makeErrorMsg(errorMsg, 'columns', 'columns', 1);
    return ret;
  }

  convSheetDataToDate(newData, oldDate, validCol, errorMsg, idx) {
    let validateCheck;
    let errorDate;
    const newDate = new Date(newData[idx]);
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      errorDate = newDate.toISOString();
    } else {
      errorDate = '유효하지 않은 날짜';
    }
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      if (validCol == idx) {
        validateCheck = oldDate <= newDate;
      } else {
        validateCheck = oldDate < newDate;
        if (errorDate === '9999-12-30T15:00:00.000Z') validateCheck = false;
      }
      if (validateCheck) {
        this.makeErrorMsg(errorMsg, this.numToAlpha(idx + 1), errorDate);
        return false; //'The new data is more recent than the main data.'
      }
      return true;
    } else {
      this.makeErrorMsg(errorMsg, this.numToAlpha(idx + 1), errorDate);
      return false; //'Date type is wrong'
    }
  }

  // 새로 갱신된 데이터가 db최신보다 빠른 날짜인지 확인하는 함수
  //dbData = DB에 있던 latest 데이터, newData = 갱신된 데이터
  compareDateIsNew(dbData, newData, validCol, errorMsg) {
    const datePattern = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[0-1])$/;

    return dbData.every((data, idx) => {
      let oldDate;

      if (datePattern.test(data)) {
        oldDate = new Date(data);
        return this.convSheetDataToDate(
          newData,
          oldDate,
          validCol,
          errorMsg,
          idx,
        );
      } else if (data instanceof Date) {
        return this.convSheetDataToDate(newData, data, validCol, errorMsg, idx);
      }
      return true;
    });
  }

  // 수정시트를 저장하기 전, 제약조건에 벗어나는지 체크하는 함수입니다.
  async compareDataToCheckError(
    sheet,
    spreadColumns,
    repoName: string,
    withDeleted: string,
    newDatas,
    deletedDatas,
    restoreDatas,
    errorMsg,
  ) {
    const datas = await this.checkWithDeleted(withDeleted, repoName); // DB데이터 뽑아오기
    if (datas === 'error') return 'error';
    const dbvalues = [];
    let sheetIdx;
    dbvalues.push(Object.keys(datas[0]));
    datas.forEach((data) => dbvalues.push(Object.values(data))); //DB데이터 형식 변경 object -> [][]
    const repo = await this.dataSource.getRepository(entityArray[repoName]); // 최신데이터 뽑아오기
    const latestData = await repo
      .createQueryBuilder(repoKeys[repoName])
      .distinctOn([`${repoKeys[repoName]}.fk_user_no`])
      .orderBy(`${repoKeys[repoName]}.fk_user_no`, 'DESC')
      .addOrderBy(`${repoKeys[repoName]}.validate_date`, 'DESC')
      .getMany();
    const latestValues = [];
    latestValues.push(Object.keys(latestData[0]));
    latestData.forEach((data) => latestValues.push(Object.values(data)));
    const pkCol = dbvalues[0].findIndex((col) => col === 'pk'); //pk, fk위치 파악
    const fkCol = dbvalues[0].findIndex((col) => col === 'fk_user_no');
    const validCol = dbvalues[0].findIndex((col) => col === 'validate_date');
    const sheetRows = sheet.filter((value, index) => index > 0);

    //column이 동일한지 체크
    let resultOfCheck;
    resultOfCheck = this.compareSameArray(dbvalues[0], sheet[0], errorMsg, 1);
    if (!resultOfCheck) return 'column error';

    //기본키가 중복인지 찾기
    const pkArray = sheet.map((sheetValue) => sheetValue[pkCol]);
    resultOfCheck = pkArray.some((x) => {
      if (pkArray.indexOf(x) !== pkArray.lastIndexOf(x)) {
        sheetIdx = pkArray.lastIndexOf(x);
        this.makeErrorMsg(
          errorMsg,
          this.numToAlpha(pkCol + 1),
          sheet[sheetIdx][pkCol],
          sheetIdx + 1,
        );
      }
      return pkArray.indexOf(x) !== pkArray.lastIndexOf(x);
    });

    if (resultOfCheck) return 'check to duplicate';

    //기존 pk의 사이값에 다른 값이 들어왔는지 pk-fk페어관계를 통해 체크
    //DB를 기준으로 sheet값 순회
    resultOfCheck = dbvalues.every((dbValue, idx) => {
      const sheetValue = sheet.find(
        (sheetValue) => sheetValue[pkCol] == dbValue[pkCol],
      );
      if (sheetValue === undefined) {
        this.makeErrorMsg(errorMsg, this.numToAlpha(pkCol + 1), '?', idx + 1);
        return false;
      }
      if (!(sheetValue[fkCol] == dbValue[fkCol])) {
        this.makeErrorMsg(
          errorMsg,
          this.numToAlpha(fkCol + 1),
          sheetValue[fkCol],
          idx + 1,
        );
      }
      return sheetValue[fkCol] == dbValue[fkCol];
    });
    if (!resultOfCheck) return 'interrupt error';

    //디폴트값이 필요한 항목에 공백이 들어가있는지 확인
    resultOfCheck = this.checkIsEmpty(
      sheetRows,
      repoName,
      errorMsg,
      spreadColumns,
    );
    if (!resultOfCheck) return 'empty nonnullable cell';

    //최신 데이터가 변경이 되었는지 체크
    resultOfCheck = latestValues.every((latestValue) => {
      const sheetValue = sheet.find((sheetValue, index) => {
        if (latestValue[pkCol] == sheetValue[pkCol]) sheetIdx = index;
        return latestValue[pkCol] == sheetValue[pkCol];
      });
      return this.compareSameArray(latestValue, sheetValue, errorMsg, sheetIdx);
    });
    if (!resultOfCheck) return 'changed latest error';

    //새로 삽입된 데이터가 있는지 확인
    const newSheetData = sheet.filter(
      (sheetValue) =>
        !dbvalues.some((dbValue) => dbValue[pkCol] == sheetValue[pkCol]),
    );
    newDatas.push(...newSheetData);

    //기존 데이터의 수정이 최신데이터의 일자보다 우선되어있는지 확인
    const noLatestDatas = sheet.filter((sheetValue) => {
      if (newDatas.length <= 0) {
        return latestValues.every(
          (latestValue) => latestValue[pkCol] != sheetValue[pkCol],
        );
      } else {
        return (
          latestValues.every(
            (latestValue) => latestValue[pkCol] != sheetValue[pkCol],
          ) && newDatas.every((newData) => newData[pkCol] != sheetValue[pkCol])
        );
      }
    });

    resultOfCheck = noLatestDatas.every((noLatestData, index) => {
      const checkLatest = latestValues.find(
        (latestValue) => latestValue[fkCol] == noLatestData[fkCol],
      );
      if (
        !this.compareDateIsNew(checkLatest, noLatestData, validCol, errorMsg)
      ) {
        let rowIdx;
        sheet.find((sheetValue, idx) => {
          if (sheetValue[pkCol] == noLatestData[pkCol]) rowIdx = idx;
          return sheetValue[pkCol] == noLatestData[pkCol];
        });
        errorMsg['rowIdx'] = rowIdx + 1;
        return false;
      } else {
        return true;
      }
    });
    if (!resultOfCheck) return 'The updated data is wrong';

    if (newDatas.length <= 0) return;

    //삽입된 데이터의 수정이 최신데이터의 일자보다 우선되어있는지 확인
    resultOfCheck = newDatas.every((newData, index) => {
      const checkNew = latestValues.find(
        (latestValue) => latestValue[fkCol] == newData[fkCol],
      );
      if (checkNew === undefined) {
        this.makeErrorMsg(
          errorMsg,
          this.numToAlpha(fkCol),
          newData[fkCol],
          sheet.length + index,
        );
        return false;
      }
      if (!this.compareDateIsNew(checkNew, newData, validCol, errorMsg)) {
        errorMsg['rowIdx'] = sheet.length + index;
        return false;
      } else {
        return true;
      }
    });
    if (!resultOfCheck) return 'The inserted data is wrong';

    //새로 삭제해야할 항목 추출하는 함수
    const sheetDeleteDatas = this.setDeleteList(noLatestDatas, dbvalues);
    const sheetRestoreDatas = this.setRestoreList(noLatestDatas, dbvalues);
    deletedDatas.push(...sheetDeleteDatas);
    restoreDatas.push(...sheetRestoreDatas);
  }

  checkIsEmpty(sheetRows, repoName, errorMsg, spreadColumns) {
    //디폴트가 없는 부분에 공백이들어왔는지 체크 확인 row가 모자른경우
    const entityColumn = EntityColumn[this.capitalize(repoName)];
    for (const col in spreadColumns) {
      const columnLabel = entityColumn.find(
        this.compareSpname(spreadColumns[col]),
      );
      if (
        //해당 컬럼이 default값을 가지는지 확인
        columnLabel !== undefined &&
        this.isDefaultColumn(repoKeys[repoName], columnLabel.dbName) ===
          DEFAULT_VALUE.DEFAULT
      ) {
        if (
          !sheetRows.every((row, index) => {
            //row가 col의 갯수보다 작거나 ''일경우 에러
            if (row.length < col || row[col] === '') {
              this.makeErrorMsg(
                errorMsg,
                this.numToAlpha(+col + 1),
                '',
                index + 1,
              );
              return false;
            }
            return true;
          })
        ) {
          return false;
        }
      }
    }
    return true;
  }

  setDeleteList(noLatestDatas, dbvalues) {
    let sheetDeleteDatas = noLatestDatas.filter(
      (data) => data.delete_date != '',
    );
    const DBDeleteDatas = dbvalues.filter((data) => data.delete_date != '');
    sheetDeleteDatas = sheetDeleteDatas.filter((sheetData) => {
      if (
        DBDeleteDatas.find((DBData) => DBData.pk == sheetData) === undefined
      ) {
        return true;
      } else {
        return false;
      }
    });
    return sheetDeleteDatas;
  }

  setRestoreList(noLatestDatas, dbvalues) {
    let sheetrestoreDatas = noLatestDatas.filter(
      (data) => data.delete_date == '',
    );
    const DBDeleteDatas = dbvalues.filter((data) => data.delete_date == '');
    sheetrestoreDatas = sheetrestoreDatas.filter((sheetData) => {
      if (
        DBDeleteDatas.find((DBData) => DBData.pk == sheetData) === undefined
      ) {
        return true;
      } else {
        return false;
      }
    });
    return sheetrestoreDatas;
  }

  async updateDataToDB(repoName, tuple) {
    try {
      // await this.initValidateDate(repoKeys[repoName], tuple);
      await this.dataSource
        .getRepository(entityArray[repoName])
        .createQueryBuilder(repoName)
        .update(entityArray[repoName])
        .set(tuple)
        .where(`pk = :pk`, {
          pk: tuple['pk'],
        })
        .andWhere(`fk_user_no = :fk_user_no`, {
          fk_user_no: tuple['fk_user_no'],
        })
        .execute();
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  async insertDataToDB(entity, tuple) {
    try {
      // await this.initValidateDate(repoKeys[repoName], tuple);
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(entity)
        .values(tuple)
        .execute();
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  /**************************/
  /*       Parse utils      */
  /**************************/

  onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }

  changeDateToString(tmp: Date) {
    const year = tmp.getFullYear();
    const tmpMonth = tmp.getMonth() + 1;
    const tmpDay = tmp.getDate();
    const month = tmpMonth >= 10 ? tmpMonth : '0' + tmpMonth;
    const day = tmpDay >= 10 ? tmpDay : '0' + tmpDay;
    return `${year}-${month}-${day}`;
  }

  changeDate(str: string, dateShape): Date {
    // if (dateShape == /./g) {
    //   str.replace('.', '-');
    // }
    const convStr = str.replace(dateShape, '-');
    const tmp = new Date(convStr);
    const insertHyphen = (str, sub) =>
      `${str.slice(0, 4)}${sub}${str.slice(4, 6)}${sub}${str.slice(6)}`;
    if (str === convStr && this.onlyNumbers(str))
      return new Date(insertHyphen(str, '-'));
    //생년월일에 - 추가해야함
    const year = tmp.getFullYear();
    const tmpMonth = tmp.getMonth() + 1;
    const tmpDay = tmp.getDate();
    const month = tmpMonth >= 10 ? tmpMonth : '0' + tmpMonth;
    const day = tmpDay >= 10 ? tmpDay : '0' + tmpDay;
    const checkForDate = new Date(`${year}-${month}-${day}`);
    if (!(checkForDate instanceof Date) || isNaN(checkForDate.getTime())) {
      console.log('invalid date is : ', str, 'conv: ', convStr);
      console.log(new Date(`${year}-${month}-${day}`));
    }
    return new Date(`${year}-${month}-${day}`);
  }

  checkEnd(endpoint, endOfTable, label) {
    for (const idx in endOfTable) {
      if (Number(idx) < endpoint) continue;
      if (endOfTable[Number(idx)] === label) return true;
    }
    return false;
  }

  compareSpname(label) {
    return (column) => column.spName === label;
  }

  compareFk(fk) {
    return (data) => data.fk_user_no === fk;
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  isKeyExists(obj, key) {
    if (obj[key] == undefined) {
      return false;
    } else {
      return true;
    }
  }

  async insertArrayToDB(entity, array) {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(array)
      .execute();
  }

  // checkExeptData(tableName, tuple) {
  //   if (tableName == 'user') {
  //     if (tuple['uniqueness'] == 'transfer') {
  //       return false;
  //     }
  //   }
  //   const data = Object.keys(exceptDataObj);
  //   if (data.some((value) => value === tableName)) {
  //     const execptcolumn = Object.keys(exceptDataObj[tableName]);
  //     for (const except of execptcolumn) {
  //       if (tuple[except] == 'transfer') {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }

  //테이블 별 하나의 로우 완성하는 함수
  makeRowPerColumn(row, cols, rowIdx, tuple, entityColumn, tableName) {
    const columnLabel = entityColumn.find(this.compareSpname(cols[rowIdx]));

    //스프레드에 날짜 저장 패턴이 바뀌면 문제가 생길 수 있음
    const dateName = /date$/;
    const datePattern =
      /[0-9]{4}. (0?[1-9]|1[012]). (0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy-mm-dd 형식인지 체크
    const datePattern2 =
      /[0-9]{4}.(0?[1-9]|1[012]).(0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy-mm-dd 형식인지 체크
    const numberPattern = /[^-\,0-9]/g;
    let dateShape = null;
    if (datePattern.test(row[rowIdx])) {
      dateShape = /\. /g;
    } else if (datePattern2.test(row[rowIdx])) {
      dateShape = /\./g;
    }
    dateShape = this.checkDatePattern(row[rowIdx]);
    if (
      row[rowIdx] !== null &&
      row[rowIdx] !== undefined &&
      columnLabel !== undefined &&
      row[rowIdx] !== '#REF' &&
      row[rowIdx] !== '#REF!' &&
      row[rowIdx] !== ''
    ) {
      // if (dateName.test(columnLabel.dbName)) {
      //   console.log(columnLabel.dbName);
      //   console.log(row[rowIdx]);
      // }
      if (dateShape != null || dateName.test(columnLabel.dbName)) {
        tuple[`${columnLabel.dbName}`] = this.changeDate(
          row[rowIdx],
          dateShape,
        );
      } else if (row[rowIdx] !== '') {
        if (
          !numberPattern.test(row[rowIdx]) &&
          row[rowIdx].indexOf(',') != -1
        ) {
          tuple[`${columnLabel.dbName}`] = Number(
            row[rowIdx].replace(/\,/g, ''),
          );
        } else {
          tuple[`${columnLabel.dbName}`] = row[rowIdx];
        }
      }
    }
    //else if (
    //   (row[rowIdx] === null ||
    //     row[rowIdx] === '' ||
    //     row[rowIdx] === undefined ||
    //     row[rowIdx] == '#REF' ||
    //     row[rowIdx] == '#REF!') &&
    //   columnLabel !== undefined
    // )
    else if (columnLabel !== undefined) {
      tuple[`${columnLabel.dbName}`] = null;
      if (
        this.isDefaultColumn(tableName, columnLabel.dbName) ===
        DEFAULT_VALUE.DEFAULT
      ) {
        this.initailizeSpreadNullValue(tuple, columnLabel.dbName, tableName);
      }
    }
  }

  makeRowPerColumnToModify(row, columns, col, tuple, repoName) {
    if (row[col] !== '') {
      const dateShape = this.checkDatePattern(row[col]);
      if (dateShape != null) {
        tuple[columns[col]] = this.changeDate(row[col], dateShape);
      } else if (
        row[col] !== null ||
        row[col] !== '' ||
        row[col] !== undefined
      ) {
        tuple[columns[col]] = row[col];
      }
    } else {
      tuple[`${columns[col]}`] = null;
      if (
        this.isDefaultColumn(repoKeys[repoName], columns[col]) ===
        DEFAULT_VALUE.DEFAULT
      ) {
        this.initailizeSpreadNullValue(tuple, columns[col], repoKeys[repoName]);
      }
    }
  }

  async parseSpread(cols, rows, table, transferUser, api42s?) {
    const tupleArray = [];
    for (const key of Object.keys(this.sheetId)) {
      //수정 도중 main이 업데이트 되면 저장이 불가하므로 id를 전부 -1로 초기화
      this.sheetId[key] = -1;
    }
    for (const row of rows) {
      const tuple = {};

      for (let col = table['start']; col < table['end']; col++) {
        this.makeRowPerColumn(
          row,
          cols,
          col,
          tuple,
          table['mapCol'],
          table['name'],
        );
      }
      // if (this.checkExeptData(table['name'], tuple) == false) {
      //   continue; //예외처리 된 tuple은 밑에서 push 하지 않는다.
      // }
      if (api42s != undefined) {
        // 해당 intra_no인 사람의 api 데이터를 가져오가
        const intraNo = cols.findIndex((col) => col === 'Intra No.');
        const isTransfer = transferUser.some(
          (transUser) => row[intraNo] === transUser[intraNo],
        );
        if (isTransfer) {
          const api42 = await this.apiService.getTupleFromApi(row[1], api42s);
          if (api42) {
            if (table['name'] === 'user_personal_information') {
              tuple['email'] = api42.email;
              //tuple['phone_number'] = api42.phone_number;
            }
            // if (table['name'] === 'user_blackhole') {
            //   tuple['blackhole_date'] = api42.blackhole_date;
            // }
            if (table['name'] === 'user_learning_data_api') {
              tuple['level'] = api42.level;
              //tuple['leveled_date'] = new Date('7777-12-31');
            }
          }
        }
      }
      if (table['name'] != 'user') tuple['fk_user_no'] = row[1]; //usertable은 해당 컬럼이 필요가 없음
      tupleArray.push(tuple);
    }
    return tupleArray;
  }

  async getOldSheetLogColumns(colObj, repoKey) {
    const colDatas = [];

    let date;

    for (const idx in colObj.Id) {
      //시트의 총 장수 만큼 반복
      const spreadData = await this.sendRequestToSpreadWithGoogleAPI(
        colObj.endPoint,
        colObj.Id[idx],
      );
      const obj = spreadData;
      colDatas.push(obj);
    }
    if (colObj.table === 'UserComputationFund') {
      // 메인시트와 동일한 형태로 저장된 경우
      for (const colData of colDatas) {
        const columns = colData[0];
        const rows = (await colData).filter((value, index) => index > 0);
        await this.makeAColumnInTable(columns, rows, date, repoKey);
      }
    } else if (
      colObj.table === 'UserLearningDataAPI' ||
      colObj.table === 'UserHrdNetUtilizeConsent'
    ) {
      // 구글스프레드시트에 컬럼이 페어(값, 날짜)형태로 저장된 경우
      const sheet = [];
      //const result = [];
      for (const colData in colDatas) {
        const datas = [];
        const columns = colDatas[colData][0];
        const rows = await colDatas[colData].filter((v, index) => index > 0);

        //데이터와 데이터 일자로 구성된 항목을 파싱후 저장
        this.makeColumnsInTable(
          columns,
          rows,
          datas,
          EntityColumn[colObj.table][Number(colData) * 2]['spName'], //데이터
          EntityColumn[colObj.table][Number(colData) * 2 + 1]['spName'], //데이터 일자
          EntityColumn[colObj.table],
          repoKey,
        );
        for (const data of datas) {
          await this.initValidateDate(repoKey, data, oldDateTable);
          if (colObj.table === 'UserLearningDataAPI')
            await this.insertArrayToDB(UserLearningDataAPI, data);
          else if (colObj.table === 'UserHrdNetUtilizeConsent')
            await this.insertArrayToDB(UserHrdNetUtilizeConsent, data);
        }
      }
    }
  }

  checkDatePattern(date: string) {
    let dataPattern = null;
    const datePattern1 =
      /[0-9]{4}\. (0?[1-9]|1[012])\. (0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy-mm-dd 형식인지 체크
    const datePattern2 =
      /[0-9]{4}\.(0?[1-9]|1[012])\.(0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy-mm-dd 형식인지 체크
    const dateName = /date$/;
    if (datePattern1.test(date)) {
      dataPattern = /\. /g;
    } else if (datePattern2.test(date)) {
      dataPattern = /\./g;
    }
    return dataPattern;
  }

  async makeAColumnInTable(cols, rows, date, repoKey) {
    let datePattern = null;
    for (const col in cols) {
      date = cols[col];
      if ((datePattern = this.checkDatePattern(cols[col])) !== null) {
        for (const row in rows) {
          let payment_data = {};
          payment_data[EntityColumn['UserComputationFund'][0].dbName] =
            this.changeDate(date, datePattern); //yyyy. mm. dd -> yyyy-mm-dd
          if (rows[row][col] === '0' || rows[row][col] === undefined) {
            payment_data[EntityColumn['UserComputationFund'][1].dbName] = 'N';
            payment_data[EntityColumn['UserComputationFund'][2].dbName] = 0;
          } else if (rows[row][col] != '0' && rows[row][col] !== undefined) {
            payment_data[EntityColumn['UserComputationFund'][1].dbName] = 'Y';
            payment_data[EntityColumn['UserComputationFund'][2].dbName] =
              Number(rows[row][col].replace(/\,/g, '')); //1,000,000 -> 1000000
          }
          payment_data['fk_user_no'] = rows[row][1];
          if (
            payment_data['fk_user_no'] == '68641' &&
            payment_data['payment_date'].getTime() >=
              new Date('2021-05-01').getTime()
          ) {
            console.log(payment_data, '66774');
            // payment_data['recevied_amount'] = 7777;
          }
          const processData = Object.values(autoProcessingDataObj[repoKey]);
          const processedDataObj = await this.autoProcessingData(
            payment_data,
            repoKey,
            // processData,
            // oldDateTable,
          );
          //processData에 처리된 값이 있다면 payment_data에 처리된 객체로 재 할당
          if (processData !== undefined) payment_data = processedDataObj;
          if (
            repoKey == 'user_computation_fund' &&
            payment_data['total_payment_of_money'] >= 9000000 &&
            payment_data['fk_user_no'] == '68641'
          ) {
            console.log(payment_data, '4555');
          }
          await this.initValidateDate(repoKey, payment_data, oldDateTable);
          if (
            repoKey == 'user_computation_fund' &&
            payment_data['total_payment_of_money'] >= 9000000 &&
            payment_data['fk_user_no'] == '68641'
          ) {
            console.log(payment_data, '444433');
          }
          await this.insertArrayToDB(UserComputationFund, payment_data);
        }
      }
    }
  }

  async makeColumnsInTable(
    cols,
    rows,
    datas,
    value,
    date,
    entityColumn,
    repoKey,
  ) {
    //한테이블에 두개이상 컬럼을 추가하는 경우
    //monthData
    let data;
    let monthData; //value, date, fk_user_no 를 저장

    for (const col in cols) {
      if (cols[col] !== value && cols[col] !== date) continue;
      if (cols[col] === value) {
        monthData = []; //새로운 value & date 묶음을 만날때마다 초기화
      }
      for (const row of rows) {
        const prop = {};
        if (row[col] === undefined) continue;
        this.makeRowPerColumn(row, cols, col, prop, entityColumn, repoKey);
        prop['fk_user_no'] = row[1];
        if (cols[col] === date) {
          //이미 있는 유저의 경우 value와 date동일 라인에 저장
          if (
            (data = monthData.find(this.compareFk(prop['fk_user_no']))) ===
            undefined
          ) {
            monthData.push(prop);
          } else {
            Object.assign(data, prop);
          }
        } else if (cols[col] === value) {
          monthData.push(prop);
        }
      }
      if (cols[col] === date) {
        datas.push(...monthData);
      }
    }
  }
  /**
   *
   * cols
   * [ 'no.', 'Intra No.', '과정중단', '과정중단일자', '사유', 'HRD-Net 중도탈락 처리' ]
   * [ 'no.', 'Intra No.', '대상기간', '대상유무', '서클(대상기간기준)' ]
   * [ '8. 취업현황', 'Intra No.', '취업현황', '취업일자', '사업장명' ]
   *
   */
  async parseOldSpread(cols, rows, pastSheetData, repoKey) {
    let tupleLine;
    for (const row of rows) {
      //학생의 수 만큼 반복
      const tuple = {};
      const mapCols = pastSheetData.columns; // 해당 시트 테이블의 컬럼들
      for (const col in cols) {
        //컬럼 수 만큼 반복
        this.makeRowPerColumn(row, cols, col, tuple, mapCols, repoKey);
      }
      tuple['fk_user_no'] = row[1]; //취업정보, 고용보험 시트의 경우 변경을 해줘야함.
      await this.initValidateDate(repoKey, tuple, oldDateTable);
      tupleLine = pastSheetData['repo'].create(tuple);
      await pastSheetData['repo'].save(tupleLine);
    }
    console.log('save', repoKey);
  }

  async getOldSheetTable(pastSheetData, repoKey) {
    // let colDatas;
    for (const id of pastSheetData.Id) {
      const spreadData = await this.sendRequestToSpreadWithGoogleAPI(
        pastSheetData.endPoint,
        id, //스프레드 하위시트 ID
      );
      const columns = spreadData[0];
      const rows = (await spreadData).filter((value, index) => index > 0);
      //지급일 시트 정보 받아서 저장해두기 테이블 관계수정 //확장성을 고려하려 했으나, 지원금 시트(LogColumn)의 특징이 강력하여 함수를 하나 더 만들기로 결정

      await this.parseOldSpread(columns, rows, pastSheetData, repoKey);
    }
  }

  async composeTableData(spreadData, tableSet: TableSet[], old: boolean) {
    let tables;
    const table = spreadData[0]; //맨 윗 줄 테이블이름
    const endOfTables = await table // 테이블이름(공백포함) -> 테이블의 인덱스(공백포함) -> 공백제거된 테이블의 인덱스 [0, 10, ...]
      .map((value, index) => {
        if (value != '') return index;
        else return '';
      })
      .filter((value, index) => {
        if (value != '') return index;
      });
    endOfTables.unshift(0); //생략된 첫번째 인덱스 0추가
    if (old) {
      //old데이터를 가져올 시에는 user테이블만 필요함
      tables = await table.filter((value, index) => index < 1 && value != '');
    } else {
      const lengthArray = await spreadData.map((value) => value.length); //모든 로우 중 가장 긴 로우기준
      endOfTables.push(Math.max.apply(null, lengthArray));
      tables = await table.filter((value) => value != '');
    }
    this.makeTableSet(tableSet, endOfTables, tables);
  }

  // 변수의 앞글자만 대문자로 변환
  capitalize(str: string) {
    try {
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch {
      throw 'error : to capitalize';
    }
  }

  makeTableSet(tableSet: TableSet[], endOfTables, tableIdxs) {
    //table의 모든 정보를 TableSet인스턴스에 담는 작업을 하는 함수입니다.
    // console.log(`makeTableSet\n tableIdx : `, tableIdxs);
    for (const tableIdx in tableIdxs) {
      const table = {} as TableSet;
      const mapCol =
        EntityColumn[
          this.capitalize(this.getKeyByValue(tableName, tableIdxs[tableIdx]))
        ];
      table.name = this.getTableName(tableIdxs[tableIdx]);
      table['start'] = endOfTables[tableIdx];
      table['end'] = endOfTables[+tableIdx + 1];
      table['mapCol'] = mapCol;
      // console.log(table.name);
      // console.log(table['mapCol'], 'end makeTablest');
      tableSet.push(table);
    }
  }

  getTableName(spreadTable: string) {
    if (spreadTable === '학사정보' || spreadTable === '0') {
      return 'user';
    } else if (spreadTable === '인적정보' || spreadTable === '1')
      return 'user_personal_information';
    else if (spreadTable === '과정연장' || spreadTable === '2')
      return 'user_course_extension';
    else if (spreadTable === '휴학' || spreadTable === '3')
      return 'user_leave_of_absence';
    else if (spreadTable === 'BLACKHOLE' || spreadTable === '4')
      return 'user_blackhole';
    else if (spreadTable === '과정중단' || spreadTable === '5')
      return 'user_interruption_of_course';
    else if (spreadTable === '학습데이터(API)' || spreadTable === '6')
      return 'user_learning_data_api';
    else if (spreadTable === '로열티 관리' || spreadTable === '7')
      return 'user_loyalty_management';
    else if (spreadTable === '취업현황' || spreadTable === '8')
      return 'user_employment_status';
    else if (spreadTable === 'HRD-Net 동의' || spreadTable === '9')
      return 'user_hrd_net_utilize_consent';
    else if (spreadTable === 'HRD-Net_data' || spreadTable === '10')
      return 'user_hrd_net_utilize';
    else if (spreadTable === '취업_기타수집_data' || spreadTable === '11')
      return 'user_other_employment_status';
    else if (spreadTable === '지원금 산정' || spreadTable === '12')
      return 'user_computation_fund';
    else if (spreadTable === '출입카드_info' || spreadTable === '13')
      return 'user_access_card_information';
    else if (spreadTable === '기타정보' || spreadTable === '14')
      return 'user_other_information';
    else if (spreadTable === 'La Piscine' || spreadTable === '15')
      return 'user_lapiscine_information';
    return 'nothing_table';
  }

  isDateType(tuple, column) {
    const date = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[0-1])$/;
    const tempDate = tuple[column];
    const columnName = /date$/;

    if (date.test(tuple[column]) || columnName.test(column)) {
      return DEFAULT_VALUE.DATE;
    }
    return DEFAULT_VALUE.NOT;
  }

  createDate(date) {
    return new Date(date);
  }

  async checkDateValue(newOneData, targetObj, tableName, key, repo, changed) {
    if (this.isDateType(newOneData, key) == DEFAULT_VALUE.DATE) {
      targetObj[key] = this.createDate(targetObj[key]);
      newOneData[key] = this.createDate(newOneData[key]);

      if (newOneData[key].getTime() != targetObj[key].getTime()) {
        return DEFAULT_VALUE.CHANGED;
      } else {
        //date 변환시켰는데 값이 같다면 다음 컬럼을 비교하기 위해 DATE 를 리턴해줌
        return DEFAULT_VALUE.DATE;
      }
    }
    return DEFAULT_VALUE.NOT;
  }

  async getLatestOneData(tableName, tuple, dateTable) {
    try {
      const repo = this.dataSource.getRepository(classType[tableName]);
      let key;
      let tupleKey;

      if (tableName === 'user') key = 'intra_no';
      else key = 'fk_user_no';
      if (Object.keys(tuple).find((key) => key == 'intra_no')) {
        tupleKey = 'intra_no';
      } else {
        tupleKey = 'fk_user_no';
      }

      const target = await repo
        .createQueryBuilder(tableName)
        .distinctOn([`${tableName}.${key}`])
        .orderBy(`${tableName}.${key}`, 'DESC') //sort by table's key
        .addOrderBy(`${tableName}.${dateTable[tableName]}`, 'DESC') //sort by valid date column
        .where(`${key} = :key`, { key: tuple[tupleKey] }) //저장하고자 하는 데이터와 키값이 같은 최신 데이터를 가져오기 위함
        .getOne();
      return target;
    } catch {
      throw `error : ${tableName} getLatestOneData`;
    }
  }

  async updateUser(tuple) {
    await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set({
        intra_id: tuple['intra_id'],
        grade: tuple['grade'],
        start_process_date: tuple['start_process_date'],
        coalition: tuple['coalition'],
        academic_state: tuple['academic_state'],
      })
      .where('intra_no = :intra_no', { intra_no: tuple['intra_no'] })
      .execute();
  }

  // async updateTuple(repoKey, tuple, column, value) {
  //   const changed = 0;
  //   try {
  //     const repo = this.dataSource.getRepository(classType[repoKey]);
  //     const target = await this.getLatestOneData(repoKey, tuple, dateTable);

  //     const checkedDate = await this.checkDateValue(
  //       tuple,
  //       target,
  //       repoKey,
  //       column,
  //       repo,
  //       changed,
  //     );

  //     if (target && checkedDate === DEFAULT_VALUE.NOT) {
  //       if (target[column] !== tuple[column]) {
  //         // console.log(--------------------------------
  //         //   `change! ${repoKey}'s ${column} value ${target[column]} to ${value}`,
  //         // );
  //         target[column] = value;
  //         await repo.save(target);
  //       }
  //     }
  //   } catch {
  //     throw 'error in updateTuple';
  //   }
  // }

  async updateExpiredDate(tableName, saveDate, expiredDate) {
    let key;
    if (tableName == 'user') key = 'intra_no';
    else key = 'fk_user_no';

    try {
      const repo = this.dataSource.getRepository(classType[tableName]);
      const target = await repo
        .createQueryBuilder(tableName)
        .distinctOn([`${tableName}.${key}`])
        .orderBy(`${tableName}.${key}`, 'DESC') //sort by table's key
        .addOrderBy(`${tableName}.${dateTable[tableName]}`, 'DESC') //sort by valid date column
        .where(`${key} = :key`, { key: saveDate[key] }) //저장하고자 하는 데이터와 키값이 같고,
        .andWhere(`validate_date <= :expiredDate`, { expiredDate }) //validate_date가 만료될 날짜보다 앞선 시간대에서 최신 데이터를 가져오기 위함
        .getOne();
      if (target) {
        // console.log(JSON.stringify(target, null, 4));
        target.expired_date = expiredDate;
        // if (tableName == 'user_computation_fund') {
        //   console.log(`update edxpired ${tableName} `);
        //   console.log(target, '44');
        // }
        await repo.save(target);
      }
    } catch {
      throw 'error in update expiredDate';
    }
  }

  //default 값을 갖는 column이 spread에 null인지 확인 후 default값으로 spread data 변환
  initailizeSpreadNullValue(newOneData, key: string, repoKey: string) {
    //스프레드의 컬럼값이 null 인데,
    if (newOneData[key] === null || newOneData[key] === undefined) {
      //파라미어틔 key가 해당 table의 컬럼에 defualt 값을 갖는 컴럼이라면, default 값으로 초기화
      // console.log(----------------------------
      //   `${key} init`,
      //   newOneData[key],
      //   ' to ',
      //   defaultVALUE[repoKey][key],
      // );
      newOneData[key] = defaultVALUE[repoKey][key];
    }
  }

  isDefaultColumn(repoKey, key) {
    if (
      //default 값을 갖는 테이블인가
      Object.keys(defaultVALUE).find((table) => table === repoKey) === undefined
    )
      return DEFAULT_VALUE.NOT;
    if (
      //테이블 중에서 default 값을 갖는 column 인가
      Object.keys(defaultVALUE[repoKey]).find((col) => col === key) ===
      undefined
    )
      return DEFAULT_VALUE.NOT;
    return DEFAULT_VALUE.DEFAULT;
  }

  getBaseDate(saveData) {
    const values = Object.values(saveData).filter(
      (value) => Object.prototype.toString.call(value) === '[object Date]',
    );
    const baseDate = values.find(
      (date: Date) => date.getTime() < new Date('9999-12-30').getTime(),
    );
    return baseDate;
  }

  async initValidateDate(repoKey, saveData, dateTable) {
    // console.log(repoKey, '\n', saveDate, '\n', dateTable[repoKey]);
    const now = new Date();
    const defaultDate = new Date('9999-12-31');
    //데이터의 유효성을 확인하는 컬럼이 validate_date라면, 저장하는 데이터의 시간을 기점으로 저장
    if (dateTable[repoKey] === 'validate_date') {
      saveData['validate_date'] = now;
    } //날짜 저장의 기준이 여러개인 table
    else if (dateTable[repoKey] === 'manyDateTable') {
      saveData['validate_date'] = this.getBaseDate(saveData);
    } else {
      saveData['validate_date'] = saveData[dateTable[repoKey]]; //기준 data가 validate_date가 아니면 기준이 되는 column의 값을 validate_date에 넣어줌
    }
    //데이터의 기준날짜가 있는 table이면, 과거 데이터의 만료일자는 현재 저장하고자하는 데이터의 기준 date 값을 넣어야됨
    const expiredDate = saveData['validate_date'];
    await this.updateExpiredDate(repoKey, saveData, expiredDate); //await 지워도 될지도?
    saveData['expired_date'] = defaultDate;
  }

  isEmptyObj(obj): boolean {
    if (
      obj === null ||
      (obj.constructor === Object && Object.keys(obj).length === 0)
    ) {
      return true;
    }
    return false;
  }

  /************************************/
  /*        auto processing data      */
  /************************************/

  getDateDiff(startDate: Date, endDate: Date) {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const diff = end - start;
    return diff;
  }

  //date에다가 dateObj에 있는 데이터객체 내에서 기간의 범위를 받아 저장해줌
  getDateAdd(date: Date, dateObj, startDate, endDate) {
    let sumDate = 0;
    //try {
    for (const obj of dateObj) {
      const absenceDate = this.getDateDiff(obj[startDate], obj[endDate]);
      sumDate += absenceDate;
    }
    sumDate += date.getTime();
    return new Date(sumDate);
    // } catch {
    //   throw 'error : getDateAdd';
    // }
  }

  //talbleName에서 tuple.pk를 갖는 컬럼 조회
  async getAbsenceDates(tableName, tuple, baseDate: Date) {
    // try {
    const repo = this.dataSource.getRepository(classType[tableName]);
    let key;

    if (tableName == 'user') key = 'intra_no';
    else key = 'fk_user_no';
    const target = await repo
      .createQueryBuilder(tableName)
      .select(`${tableName}.begin_absence_date`)
      .addSelect(`${tableName}.return_from_absence_date`)
      .distinctOn([`${tableName}.fk_user_no`])
      .orderBy(`${tableName}.fk_user_no`, 'ASC')
      .addOrderBy(`${tableName}.validate_date`, 'ASC')
      .where(`${key} = :key`, { key: tuple[key] }) //저장하고자 하는 데이터와 키값이 같은 최신 데이터를 가져오기 위함
      .andWhere(`begin_absence_date <= :baseDate`, {
        baseDate,
      })
      .andWhere(`return_from_absence_date >= :baseDate`, {
        baseDate,
      })
      .getOne();
    // if (target.length != 0) console.log(target, '기간 내 휴학 date');-----------------------
    return target;
    // } catch {
    //   throw 'error : in getAbsenceDates';
    // }
  }
  // async getBeforeDate(tableName, tuple, baseDateColumn, baseDate, valuDate) {
  //   try {
  //     const repo = this.dataSource.getRepository(classType[tableName]);
  //     let key;

  async getAggregateData(
    tableName,
    tuple,
    column,
    valueColumn,
    aggregate,
    operator,
    value,
    date,
  ) {
    const repo = this.dataSource.getRepository(classType[tableName]);
    let key;
    // console.log(
    //   'is?\n',
    //   tuple,
    //   '\n',
    //   'date : ',date,
    //   '\n',
    // );
    if (tableName == 'user') key = 'intra_no';
    else key = 'fk_user_no';
    // 조건이 필요한 value가 있는 경우
    const sumValue = await repo
      .createQueryBuilder(tableName)
      .select(`${aggregate}(${tableName}.${valueColumn})`, `${column}`)
      .where(`${key} = :key`, { key: tuple[key] }) //저장하고자 하는 데이터와 키값이 같은 데이터를 가져오기 위함
      .andWhere(`${oldDateTable[tableName]} <= :date`, {
        date, //this.changeDateToString(date), //지급일 이전 데이터 중에서
      })
      .andWhere(`${valueColumn} ${operator} :value`, {
        //받은 금액이 0이상이면
        value,
      })
      .getRawOne(); //sum같은 집게된 값을 얻으려면 getMany같은 entity값을 받은 것이 아닌 원시값을 받는 raw를 써야함
    return sumValue;
  }

  /**
 *  else if 지급액이 0이면
    지급일 이전 휴학 시작 데이터가 있는값들 가져오기
           if 지급일이 복학일보다 이전인 처음 데이터만 뽑아오기()
             지원 만료일 1달 추가후 이전 데이터 값 가져오기 , 처리 무시
          else 휴학한 적이 없다는 것
             정상처리
 */
  setObj(srcObj, destObj) {
    const keyArray = Object.keys(destObj);
    for (const key of keyArray) {
      srcObj[key] = destObj[key];
    }
  }

  async setPaymentEndDate(tuple, date: Date, month) {
    //const strDate = this.changeDateToString(date);
    const baseMonth = date.getMonth();
    date.setMonth(baseMonth + month);
    tuple['payment_end_date'] = date;
  }

  async processAbsenceDate(tuple, tableName, target) {
    const baseDate = tuple['payment_date'];
    const absenceDates = await this.getAbsenceDates(
      'user_leave_of_absence',
      tuple,
      baseDate,
    );
    // const dateDoff = this.getDateDiff(
    //   absenceDates['begin_absence_date'],
    //   absenceDates['end_absence_date'],
    // );
    if (target) {
      //휴학을 했다면
      // console.log(target, 'target');
      // console.log(absenceDates, 'absencedate\n\n\n\n\n\n\n');
      if (!this.isEmptyObj(absenceDates)) {
        this.setObj(tuple, target);
        // console.log(tuple['payment_end_date']);
        // console.log(tuple['payment_end_date'].getMonth());
        // console.log(tuple['payment_end_date'].getMonth() + 1);
        this.setPaymentEndDate(tuple, tuple['payment_end_date'], 1);
        // console.log(tuple, '휴학기간 1달 증가');
      } else {
        //돈을 받았는데 휴학한 적이 없다면 정상처리
        await this.normalProcess(tuple, tableName, target);
      }
    }
  }

  async normalProcess(tuple, tableName, target) {
    // console.log(tuple, tableName);
    if (aggregateDataObj[tableName] !== undefined) {
      const processData = Object.keys(aggregateDataObj[tableName]);
      for (const column of processData) {
        /**
         * {
            aggregateColumn: 'received',
            operator: 'COUNT',
            value: 0,
          },
         */
        const aggregateData = aggregateDataObj[tableName][column];

        const aggreagate = await this.getAggregateData(
          tableName,
          tuple,
          column,
          aggregateData['aggregateColumn'],
          aggregateData['aggregate'],
          aggregateData['operator'],
          aggregateData['value'],
          tuple['payment_date'],
        );
        if (aggregateData['aggregate'] == 'COUNT') {
          if (Number(tuple['recevied_amount']) > 0) {
            tuple[column] = Number(aggreagate[column]) + 1;
          } else if (
            Number(tuple['recevied_amount']) >= 0 &&
            column != 'total_real_payment_of_number'
          ) {
            tuple[column] = Number(aggreagate[column]) + 1;
          } else if (column == 'total_real_payment_of_number') {
            tuple[column] = Number(aggreagate[column]);
          }
        } else if (aggregateData['aggregate'] == 'SUM') {
          tuple[column] = Number(aggreagate[column]) + tuple['recevied_amount'];
        }
        // if (tuple['fk_user_no'] == '68641') {
        //   console.log('in nomal : ', column, ' : ', tuple[column]);
        //   console.log(tuple, '1');
        // }
      }
      //남은 지원 잔여 기간은 24 - 지급 받은 월 수
      tuple['remaind_payment_period'] =
        REMAINDPAYMENTPERIOD - tuple['total_payment_period_number'];
      tuple['payment_end_date'] = target['payment_end_date'];
    }
  }

  ignoreProcess(tuple, target) {
    if (target) {
      console.log('ignore before tuple', tuple);
      tuple = {};
      Object.assign(tuple, target);
      console.log('ignore after tuple', tuple);
    } else {
      tuple['recevied_amount'] = 0;
      tuple['received'] = 'N';
    }
  }

  async autoProcessingData(tuple, tableName) {
    // try {
    if (tableName == 'user_computation_fund') {
      const startDateObj = await this.getLatestOneData(
        'user',
        tuple,
        dateTable,
      );

      const target = await this.getLatestOneData(tableName, tuple, dateTable); //dateTable old??
      //지급일이 과정 시작일 보다 이전일때
      // console.log(
      //   '지급일: ',
      //   tuple['payment_date'],
      //   '과정시작: ',
      //   startDateObj['start_process_date'],
      // );
      if (startDateObj && target == null) {
        this.setPaymentEndDate(tuple, startDateObj['start_process_date'], 23);
      }
      // if (tuple['fk_user_no'] == '68641') console.log(tuple, '111');
      if (
        target &&
        startDateObj &&
        tuple &&
        tuple['payment_date'].getTime() <
          startDateObj['start_process_date'].getTime()
      ) {
        // console.log('지급일 < 과정시작');
        //지급액이 -1 인지 확인
        if (tuple['recevied_amount'] == -1 || tuple['recevied'] == 'N') {
          //기존 데이터 그대로 받거나, 지급액 0으로 바꾸고 무시
          this.ignoreProcess(tuple, target);
          // if (tuple['fk_user_no'] == '68641') console.log(tuple, '222');
        } else {
          await this.normalProcess(tuple, tableName, target);
          // if (tuple['fk_user_no'] == '68641') console.log(tuple, '333');
        }
      } //지급일이 과정 시작일 보다 이후면
      else if (tuple && target) {
        // console.log('과정시작 < 지급일');
        if (tuple['recevied_amount'] == -1 || tuple['recevied'] == 'N') {
          //기존 데이터 그대로 받거나, 지급액 0으로 바꾸고 무시
          this.ignoreProcess(tuple, target);
        } //지급일 이전 휴학 시작 데이터가 있는값들 가져와 처리
        else if (tuple['recevied_amount'] == 0) {
          this.processAbsenceDate(tuple, tableName, target);
        } else if (tuple['recevied_amount'] >= 0) {
          await this.normalProcess(tuple, tableName, target);
        }

        if (tuple['remaind_payment_period'] <= 0) {
          tuple['payment_ended'] = '만료';
        }
      }

      // if (target != null)
      //   if (
      //     tableName == 'user_computation_fund' &&
      //     target['total_payment_of_money'] > 8000000 &&
      //     target['fk_user_no'] == '68641'
      //   ) {
      //     console.log(tuple, '444433');
      //   }
      if (tuple['pk'] == 127) {
        console.log(tuple);
        while (1);
      }
      return tuple;

      // if 지급일이 과정 시작일 보다 이전일때
      //   if 지급액이 -1 인지 확인
      //        기존 데이터 그대로 받거나, 지급액 0으로 바꾸고 무시
      //   else 정상처리
      // else if 지급일이 과정 시작일 보다 이후면
      //        if 지급액이 -1인지 확인
      //             기존 데이터 그대로 받거나, 지급액 0으로 바꾸고 무시
      //        else if 지급액이 0이면
      /**                  지급일 이전 휴학 시작 데이터가 있는값들 가져오기
       *                   if 지급일이 복학일보다 이전인 처음 데이터만 뽑아오기()
       *                        지원 만료일 1달 추가후 이전 데이터 값 가져오기 , 처리 무시
       *                   else 휴학한 적이 없다는 것
       *                          정상처리
       *        else if 지급액 0 초과면
       *                  정상 처리 로직 및 실질적 돈 받은것 +1
       */
    }
    // } catch {
    //   throw error : in autoProcessingData ExceptionsHandler;
    // }
  }

  /************************************/
  /*        check error data          */
  /************************************/

  checkErrorData(tableName, table) {
    if (tableName === 'user_leave_of_absence') {
      const begin = new Date(table['begin_absence_date']);
      const end = new Date(table['end_absence_date']);
    }
  }
}
