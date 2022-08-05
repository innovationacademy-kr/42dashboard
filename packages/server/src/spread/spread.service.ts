import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiService } from 'src/api/api.service';
import { google } from 'googleapis';
import { credentials } from 'src/config/credentials';
// import { tableName } from 'common/src';
import {
  classType,
  dateTable,
  defaultVALUE,
  DEFAULT_VALUE,
  mapObj,
  repoKeys,
  TABLENUM,
} from 'src/updater/name_types/updater.name';
import { UserHrdNetUtilizeConsent } from 'src/user_job/entity/user_job.entity';
import { UserComputationFund } from 'src/user_payment/entity/user_payment.entity';
import { UserLearningDataAPI } from 'src/user_status/entity/user_status.entity';
import { Column, createQueryBuilder, DataSource } from 'typeorm';
import { MAIN_SHEET, SPREAD_END_POINT } from 'src/config/key';
import { TableSet } from 'src/updater/updater.service';
import {
  entityArray,
  getDomain,
} from 'src/user_information/utils/getDomain.utils';
import { ideahub } from 'googleapis/build/src/apis/ideahub';
import { ERRORMSG, ErrorMsg, formatError } from './msg/errormsg.msg';

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

  /*  DB에 있는 데이터를 수정하기 위해 스프레드 시트로 옮기는 함수  */
  async getDataToModifyFromDB(endPoint: string, repoName) {
    // google spread sheet api 가져오기
    const googleSheet = await this.getGoogleSheetAPI();
    const createPage = [
      {
        //시트를 추가하는 명령
        addSheet: {
          properties: {
            title: repoName,
          },
        },
      },
    ];
    const pageRes = await this.controlSheet(endPoint, googleSheet, createPage);
    this.sheetId[repoName] =
      pageRes['replies'][0]['addSheet']['properties']['sheetId'];
    if (this.sheetId[repoName] == 0) return "Can't edit user page";
    const values = [];
    const datas = await this.dataSource
      .getRepository(entityArray[repoName])
      .find({
        order: {
          pk: 'ASC',
        },
      });
    values.push(Object.keys(datas[0]));
    datas.forEach((data) => values.push(Object.values(data)));
    const request = {
      // 업데이트 하기위한 시트의 id값.
      spreadsheetId: endPoint, // TODO: Update placeholder value.
      // 값을 넣을 위치로 A1를 선정 .
      range: `${repoName}!A1`, // TODO: Update placeholder value.
      // 입력된 데이터를 어떻게 처리할 것인지
      valueInputOption: 'USER_ENTERED', //입력은 마치 Google Sheets UI에 입력한 것처럼 정확하게 구문 분석됨
      resource: {
        values,
      },
    };
    try {
      const response = (await googleSheet.spreadsheets.values.update(request))
        .data;
      const repo = await this.dataSource.getRepository(entityArray[repoName]);
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

  addColorLatestData(requests, latestData, sheetId, colNum, color) {
    latestData.forEach((element) => {
      requests.push(
        this.setColorRange(
          sheetId,
          element['pk'],
          element['pk'] + 1,
          0,
          colNum,
          color,
        ),
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
    this.addColorLatestData(requests, latestData, sheetId, colNum, blue);
    const response = await this.controlSheet(endPoint, googleSheet, requests);
  }

  /* 수정을 위해 생성했던 시트상에서 수정된 데이터를 DB테이블로 다시 업데이트하는 함수 */
  async saveModifiedDataFromSheet(endPoint, repoName) {
    if (this.sheetId[repoName] == 0) return 'no file to save'; //수정하던 시트에 문제가 생긴경우
    if (this.sheetId[repoName] == -1)
      //수정 도중 main이 업데이트된 경우, 해당 시트는 저장할 수 없음.
      return 'main is updated \nAfter deleting the edit sheet, click edit again';
    const newDatas = [];
    const errorMsg = {} as ErrorMsg;
    const googleSheet = await this.getGoogleSheetAPI();
    const deletePage = [
      {
        //시트를 삭제하는 명령
        deleteSheet: {
          sheetId: this.sheetId[repoName],
        },
      },
    ];
    const spreadData = await this.sendRequestToSpreadWithGoogleAPI(
      endPoint,
      repoName,
    );
    const columns = spreadData[0];
    const rows = (await spreadData).filter((value, index) => index > 0);
    try {
      const ret = await this.compareDataToCheckError(
        spreadData,
        repoName,
        newDatas,
        errorMsg,
      ); //pk중복 체크도 해야함?
      if (ret === 'column error') {
        return formatError(repoName, ERRORMSG.COLUMNS, errorMsg);
      } else if (ret === 'check to duplicate') {
        return formatError(repoName, ERRORMSG.DUPLICATE, errorMsg);
      } else if (ret === 'interrupt error') {
        return formatError(repoName, ERRORMSG.INTERRUPT, errorMsg);
      } else if (ret === 'changed latest error') {
        return formatError(repoName, ERRORMSG.CHANGED, errorMsg);
      } else if (ret === 'The updated data is wrong') {
        return formatError(repoName, ERRORMSG.UPDATE, errorMsg);
      } else if (ret === 'The inserted data is wrong') {
        return formatError(repoName, ERRORMSG.INSERT, errorMsg);
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
          await this.insertDataToDB(entityArray[repoName], tuple); //동환님이 추가하는 update방식과 비슷 createdate를 기준으로하는 validate는 좀 힘들지도?
        }
      }
      await this.controlSheet(endPoint, googleSheet, deletePage);
      return ERRORMSG.SUCCESS;
    } catch (err) {
      throw err;
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
  ) {
    errorMsg['colIdx'] = colIdx;
    errorMsg['value'] = value;
    if (rowIdx != undefined) errorMsg['rowIdx'] = rowIdx;
  }

  // 정확히 같은 배열인지 확인하는 함수
  compareSameArray(arrayOne, arrayTwo, errorMsg, index) {
    const ret =
      arrayOne.length === arrayTwo.length &&
      arrayOne.every((oneValue, idx) => {
        let oneValueToString;
        if (oneValue instanceof Date) {
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
            index,
          );
        }
        return oneValueToString == arrayTwo[idx];
      });
    if (arrayOne.length !== arrayTwo.length)
      this.makeErrorMsg(errorMsg, 'columns', 'columns', 1);
    return ret;
  }

  convSheetDataToDate(newData, oldDate, errorMsg, idx) {
    const newDate = new Date(newData[idx]);
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      if (oldDate <= newDate) {
        this.makeErrorMsg(
          errorMsg,
          this.numToAlpha(idx + 1),
          newDate.toISOString(),
        );
        return false; //'The new data is more recent than the main data.'
      }
      return true;
    } else {
      this.makeErrorMsg(
        errorMsg,
        this.numToAlpha(idx + 1),
        newDate.toISOString(),
      );
      return false; //'Date type is wrong'
    }
  }

  // 새로 갱신된 데이터가 db최신보다 빠른 날짜인지 확인하는 함수
  //dbData = DB에 있던 latest 데이터, newData = 갱신된 데이터
  compareDateIsNew(dbData, newData, errorMsg) {
    const datePattern = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[0-1])$/;

    return dbData.every((data, idx) => {
      let oldDate;

      if (datePattern.test(data)) {
        oldDate = new Date(data);
        return this.convSheetDataToDate(newData, oldDate, errorMsg, idx);
      } else if (data instanceof Date) {
        return this.convSheetDataToDate(newData, data, errorMsg, idx);
      }
      return true;
    });
  }

  async compareDataToCheckError(sheet, repoName: string, newDatas, errorMsg) {
    const datas = await this.dataSource
      .getRepository(entityArray[repoName])
      .find({
        order: {
          pk: 'ASC',
        },
      });
    const dbvalues = [];
    let sheetIdx;
    dbvalues.push(Object.keys(datas[0]));
    datas.forEach((data) => dbvalues.push(Object.values(data))); // DB데이터 뽑아오기

    const repo = await this.dataSource.getRepository(entityArray[repoName]); // 최신데이터 뽑아오기
    const latestData = await repo
      .createQueryBuilder(repoKeys[repoName])
      .distinctOn([`${repoKeys[repoName]}.fk_user_no`])
      .orderBy(`${repoKeys[repoName]}.fk_user_no`, 'DESC')
      .addOrderBy(`${repoKeys[repoName]}.validate_date`, 'DESC')
      .getMany();
    const latestValues = [];
    latestValues.push(Object.keys(latestData[0]));
    latestData.forEach((data) => latestValues.push(Object.values(data))); // DB데이터 뽑아오기

    const pkCol = dbvalues[0].findIndex((col) => col === 'pk');
    const fkCol = dbvalues[0].findIndex((col) => col === 'fk_user_no');
    const validDate = dbvalues[0].findIndex((col) => col === 'validate_date');

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
    resultOfCheck = dbvalues.every((dbValue, idx) => {
      const sheetValue = sheet.find(
        (sheetValue) => sheetValue[pkCol] == dbValue[pkCol],
      );
      if (sheetValue === undefined) {
        this.makeErrorMsg(
          errorMsg,
          this.numToAlpha(pkCol + 1),
          sheet[idx][pkCol],
          idx + 1,
        );
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
      if (!this.compareDateIsNew(checkLatest, noLatestData, errorMsg)) {
        let rowIdx;
        sheet.find((sheetValue, idx) => {
          if (sheetValue[pkCol] == noLatestData[pkCol]) rowIdx = idx;
          return sheetValue[pkCol] == noLatestData[pkCol];
        });
        console.log(rowIdx);
        errorMsg['rowIdx'] = rowIdx + 1;
        return false;
      } else {
        return true;
      }
    });
    if (!resultOfCheck) return 'The updated data is wrong';

    if (newDatas.length <= 0) return;

    //최신 데이터의 일자가 과거데이터인지 확인
    resultOfCheck = newDatas.every((newData, index) => {
      const checkNew = latestValues.find(
        (latestValue) => latestValue[fkCol] == newData[fkCol],
      );
      if (!this.compareDateIsNew(checkNew, newData, errorMsg)) {
        errorMsg['rowIdx'] = sheet.length + index;
        return false;
      } else {
        return true;
      }
    });
    if (!resultOfCheck) return 'The inserted data is wrong';
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

  changeDate(str: string): string {
    const convStr = str.replace(/. /g, '-');
    const tmp = new Date(convStr);
    const insertHyphen = (str, sub) =>
      `${str.slice(0, 4)}${sub}${str.slice(4, 6)}${sub}${str.slice(6)}`;
    if (str === convStr && this.onlyNumbers(str)) return insertHyphen(str, '-');
    //생년월일에 - 추가해야함
    const year = tmp.getFullYear();
    const tmpMonth = tmp.getMonth() + 1;
    const tmpDay = tmp.getDate();
    const month = tmpMonth >= 10 ? tmpMonth : '0' + tmpMonth;
    const day = tmpDay >= 10 ? tmpDay : '0' + tmpDay;
    return `${year}-${month}-${day}`;
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

  //테이블 별 하나의 로우 완성하는 함수
  makeRowPerColumn(row, cols, rowIdx, tuple, mapObjs, repoKey) {
    const columnLabel = mapObjs.find(this.compareSpname(cols[rowIdx]));
    //스프레드에 날짜 저장 패턴이 바뀌면 문제가 생길 수 있음
    const datePattern =
      /[0-9]{4}. (0?[1-9]|1[012]). (0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy-mm-dd 형식인지 체크
    const numberPattern = /[^-\,0-9]/g;
    if (
      row[rowIdx] !== null &&
      row[rowIdx] !== undefined &&
      columnLabel !== undefined
    ) {
      if (datePattern.test(row[rowIdx])) {
        tuple[`${columnLabel.dbName}`] = this.changeDate(row[rowIdx]);
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
    } else if (
      row[rowIdx] === null ||
      row[rowIdx] === '' ||
      row[rowIdx] === undefined
    ) {
      tuple[`${columnLabel.dbName}`] = null;
      if (
        this.isDefaultColumn(repoKey, columnLabel.dbName) ===
        DEFAULT_VALUE.DEFAULT
      ) {
        this.initailizeSpreadNullValue(tuple, columnLabel.dbName, repoKey);
      }
    }
  }

  makeRowPerColumnToModify(row, columns, col, tuple, repoName) {
    const datePattern =
      /[0-9]{4}. (0?[1-9]|1[012]). (0?[1-9]|[12][0-9]|3[0-1])$/;
    if (row[col] !== '') {
      if (datePattern.test(row[col])) {
        tuple[columns[col]] = this.changeDate(row[col]);
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

  async parseSpread(cols, rows, table, api42s?) {
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
      if (api42s != undefined) {
        // 해당 intra_no인 사람의 api 데이터를 가져오가
        const api42 = await this.apiService.getTupleFromApi(row[1], api42s);
        if (table['name'] === 'user_personal_information') {
          tuple['email'] = api42.email;
          tuple['phone_number'] = api42.phone_number;
        }
        if (table['name'] === 'user_blackhole') {
          tuple['blackhole_date'] = api42.blackhole_date;
        }
        if (table['name'] === 'user_learning_data_api') {
          tuple['level'] = api42.level;
          //tuple['leveled_date'] = new Date(); //동환님께 여쭤보자
        } //여기 학습데이터를 추가해야함.
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
    if (colObj.table === TABLENUM.USERCOMPUTATIONFUND) {
      // 메인시트와 동일한 형태로 저장된 경우
      for (const colData of colDatas) {
        const columns = colData[0];
        const rows = (await colData).filter((value, index) => index > 0);
        await this.makeAColumnInTable(columns, rows, date, repoKey);
      }
    } else if (
      colObj.table === TABLENUM.USERLEARNINGDATAAPI ||
      colObj.table === TABLENUM.USERHRDNETUTILIZECONSENT
    ) {
      // 구글스프레드시트에 컬럼이 페어(값, 날짜)형태로 저장된 경우
      const sheet = [];
      for (const colData in colDatas) {
        const datas = [];
        const columns = colDatas[colData][0];
        const rows = await colDatas[colData].filter((v, index) => index > 0);

        this.makeColumnsInTable(
          columns,
          rows,
          datas,
          mapObj[colObj.table][Number(colData) * 2]['spName'], //데이터
          mapObj[colObj.table][Number(colData) * 2 + 1]['spName'], //데이터 일자
          mapObj[colObj.table],
          repoKey,
        );
        for (const data of datas) {
          // 같은 일자에 저장된 시트들을 합쳐주는 작업
          let flag = false;
          for (const col of sheet) {
            if (colData === '0') break;
            const newDate =
              mapObj[colObj.table][Number(colData) * 2 + 1]['dbName'];
            const preDate =
              mapObj[colObj.table][(Number(colData) - 1) * 2 + 1]['dbName'];
            if (
              (flag =
                col.fk_user_no === data.fk_user_no &&
                col[`${preDate}`] === data[`${newDate}`])
            ) {
              await this.initValidateDate(repoKey, data);
              Object.assign(col, data);
              break;
            }
          }
          if (flag === false) {
            await this.initValidateDate(repoKey, data);
            if (colObj.table === TABLENUM.USERLEARNINGDATAAPI)
              await this.insertArrayToDB(UserLearningDataAPI, data);
            else if (colObj.table === TABLENUM.USERHRDNETUTILIZECONSENT)
              await this.insertArrayToDB(UserHrdNetUtilizeConsent, data);
            // sheet.push(data);
          }
        }
        // if (repoKey == 'user_learning_data_api') console.log(sheet, '123213');
      }
    }
  }

  async makeAColumnInTable(cols, rows, date, repoKey) {
    const pattern = /[0-9]{4}. (0?[1-9]|1[012]). (0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy. mm. dd 형식인지 체크
    for (const col in cols) {
      date = cols[col];
      if (pattern.test(cols[col])) {
        for (const row in rows) {
          const payment_data = {};
          payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][0].dbName] =
            this.changeDate(date); //yyyy. mm. dd -> yyyy-mm-dd
          if (rows[row][col] === '0' || rows[row][col] === undefined) {
            payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][1].dbName] = 'N';
            payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][2].dbName] = '0';
          } else if (rows[row][col] != '0' && rows[row][col] !== undefined) {
            payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][1].dbName] = 'Y';
            payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][2].dbName] =
              Number(rows[row][col].replace(/\,/g, '')); //1,000,000 -> 1000000
          }
          payment_data['fk_user_no'] = rows[row][1];
          await this.initValidateDate(repoKey, payment_data);
          await this.insertArrayToDB(UserComputationFund, payment_data);
        }
      }
    }
  }

  async makeColumnsInTable(cols, rows, datas, value, date, mapObj, repoKey) {
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
        this.makeRowPerColumn(row, cols, col, prop, mapObj, repoKey);
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
      await this.initValidateDate(repoKey, tuple);
      tupleLine = pastSheetData['repo'].create(tuple);
      await pastSheetData['repo'].save(tupleLine);
    }
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
      console.log('save', repoKey);
    }
  }

  async composeTableData(spreadData, tableSet: TableSet[], old: boolean) {
    let tableNames;
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
      tableNames = await table.filter(
        (value, index) => index < 1 && value != '',
      );
    } else {
      const lengthArray = await spreadData.map((value) => value.length); //모든 로우 중 가장 긴 로우기준
      endOfTables.push(Math.max.apply(null, lengthArray));
      tableNames = await table.filter((value) => value != '');
    }
    this.makeTableSet(tableSet, endOfTables, mapObj, tableNames);
  }

  makeTableSet(tableSet: TableSet[], endOfTables, mapObjs, tableNames) {
    //table의 모든 정보를 TableSet인스턴스에 담는 작업을 하는 함수입니다.
    for (const tableName in tableNames) {
      const table = {} as TableSet;
      table.name = this.getTableName(tableNames[tableName]);
      table['start'] = endOfTables[tableName];
      table['end'] = endOfTables[+tableName + 1];
      table['mapCol'] = mapObjs[tableName];
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
    else if (spreadTable === '지원금 관리' || spreadTable === '12')
      return 'user_education_fund_state';
    else if (spreadTable === '지원금 산정' || spreadTable === '13')
      return 'user_computation_fund';
    else if (spreadTable === '출입카드_info' || spreadTable === '14')
      return 'user_access_card_information';
    else if (spreadTable === '기타정보' || spreadTable === '15')
      return 'user_other_information';
    else if (spreadTable === 'La Piscine' || spreadTable === '16')
      return 'user_lapiscine_information';
    return 'nothing table';
  }

  isDateType(tuple, column) {
    const date = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[0-1])$/;
    const tempDate = tuple[column];
    const isValidDate = Date.parse(tempDate);

    if (!isNaN(isValidDate) && date.test(tuple[column])) {
      return DEFAULT_VALUE.DATE;
    }
    return DEFAULT_VALUE.NOT;
  }

  createDate(date) {
    return new Date(date);
  }

  async checkDateValue(newOneData, targetObj, repoKey, key, repo) {
    if (this.isDateType(newOneData, key) == DEFAULT_VALUE.DATE) {
      newOneData[key] = this.createDate(newOneData[key]);
      targetObj[key] = this.createDate(targetObj[key]);

      if (newOneData[key].getTime() != targetObj[key].getTime()) {
        await this.initValidateDate(repoKey, newOneData);
        let changeData = newOneData;
        if (repoKey !== 'user') {
          changeData = repo.create(newOneData);
          repo.save(changeData);
        } else {
          targetObj[key] = newOneData[key];
          repo.save(targetObj);
        }

        console.log(
          `table is ${repoKey}\n column name is ${key} \n`,
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
    return DEFAULT_VALUE.NOT;
  }

  async updateTuple(repoKey, tuple, column, value) {
    let key;

    if (repoKey == 'user') key = 'intra_no';
    else key = 'fk_user_no';

    try {
      const repo = this.dataSource.getRepository(classType[repoKey]);
      const target = await repo
        .createQueryBuilder(repoKey)
        .distinctOn([`${repoKey}.${key}`])
        .orderBy(`${repoKey}.${key}`, 'DESC') //sort by table's key
        .addOrderBy(`${repoKey}.${dateTable[repoKey]}`, 'DESC') //sort by valid date column
        .where(`${key} = :key`, { key: tuple[key] }) //저장하고자 하는 데이터와 키값이 같은 최신 데이터를 가져오기 위함
        .getOne();

      const checkedDate = await this.checkDateValue(
        tuple,
        target,
        repoKey,
        column,
        repo,
      );

      if (target && checkedDate === DEFAULT_VALUE.NOT) {
        if (target[column] !== tuple[column]) {
          console.log(
            `change! ${repoKey}'s ${column} value ${target[column]} to ${value}`,
          );
          target[column] = value;
          await repo.save(target);
        }
      }
    } catch {
      throw 'error in updateTuple';
    }
  }

  async updateExpiredDate(repoKey, saveDate, now) {
    let key;

    if (repoKey == 'user') key = 'intra_no';
    else key = 'fk_user_no';

    try {
      const repo = this.dataSource.getRepository(classType[repoKey]);
      const target = await repo
        .createQueryBuilder(repoKey)
        .distinctOn([`${repoKey}.${key}`])
        .orderBy(`${repoKey}.${key}`, 'DESC') //sort by table's key
        .addOrderBy(`${repoKey}.${dateTable[repoKey]}`, 'DESC') //sort by valid date column
        .where(`${key} = :key`, { key: saveDate[key] }) //저장하고자 하는 데이터와 키값이 같은 최신 데이터를 가져오기 위함
        .getOne();
      if (target) {
        // console.log(`table is ${repoKey}\n`, ` expired_date changed to `, now);
        // console.log(JSON.stringify(target, null, 4));
        target.expired_date = now;
        await repo.save(target);
      }
    } catch {
      throw 'error in updateTuple';
    }
  }

  //default 값을 갖는 column이 spread에 null인지 확인 후 default값으로 spread data 변환
  initailizeSpreadNullValue(newOneData, key: string, repoKey: string) {
    //스프레드의 컬럼값이 null 인데,
    if (newOneData[key] === null || newOneData[key] === undefined) {
      //파라미어틔 key가 해당 table의 컬럼에 defualt 값을 갖는 컴럼이라면, default 값으로 초기화
      console.log(
        `${key} init`,
        newOneData[key],
        ' to ',
        defaultVALUE[repoKey][key],
      );
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

  async initValidateDate(repoKey, saveDate) {
    const now = new Date();
    const defaultDate = new Date('9999-12-31');
    const target = await this.updateExpiredDate(repoKey, saveDate, now); //await 지워도 될지도?
    //데이터의 유효성을 확인하는 컬럼이 validate_date라면, 저장하는 데이터의 시간을 기점으로 저장
    if (dateTable[repoKey] === 'validate_date') {
      saveDate['validate_date'] = now;
    } else {
      saveDate['validate_date'] = saveDate[dateTable[repoKey]];
    }
    saveDate['expired_date'] = defaultDate;
  }
}
