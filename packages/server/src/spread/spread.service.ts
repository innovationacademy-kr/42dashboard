import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiService } from 'src/api/api.service';
import { google } from 'googleapis';
import { client_email, private_key } from 'src/config/credentials.json';
import {
  mapObj,
  pastDataOnSheet,
  TABLENUM,
} from 'src/updater/name_types/updater.name';
import { UserHrdNetUtilizeConsent } from 'src/user_job/entity/user_job.entity';
import { UserComputationFund } from 'src/user_payment/entity/user_payment.entity';
import { UserLearningDataAPI } from 'src/user_status/entity/user_status.entity';
import { Column, DataSource } from 'typeorm';
import { MAIN_SHEET, SPREAD_END_POINT } from 'src/config/key';
import { TableSet } from 'src/updater/updater.service';

@Injectable()
export class SpreadService {
  constructor(
    private apiService: ApiService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async sendRequestToSpreadWithGoogleAPI(endPoint: string, id: string) {
    const authorize = new google.auth.JWT(client_email, null, private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);
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

  async createSpreadsheet(endPoint: string, title) {
    const authorize = new google.auth.JWT(client_email, null, private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);

    // google spread sheet api 가져오기
    const googleSheet = google.sheets({
      version: 'v4',
      auth: authorize,
    });
    try {
      const sheetBody = {
        auth: authorize,
        requestBody: { properties: { title } },
      };
      const spreadsheet = await googleSheet.spreadsheets.create(sheetBody);
      if (spreadsheet.status === 200) {
        const spreadsheetId = spreadsheet.data.spreadsheetId;
        const spreadsheetUrl = spreadsheet.data.spreadsheetUrl;
      } else {
        throw new Error('Spreadsheet creation failed. Kindly try again!');
      }
      console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
      return spreadsheet.data.spreadsheetId;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }

  changeDate(str: string): string {
    //console.log(str);
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

  insertArrayToDB(entity, array) {
    this.dataSource
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(array)
      .execute();
  }

  //테이블 별 하나의 로우 완성하는 함수
  makeRowPerColumn(row, cols, rowIdx, tuple, mapObjs) {
    let columnLabel;
    const datePattern =
      /[0-9]{4}. (0?[1-9]|1[012]). (0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy-mm-dd 형식인지 체크

    if (
      row[rowIdx] !== null &&
      (columnLabel = mapObjs.find(this.compareSpname(cols[rowIdx]))) !==
        undefined
    ) {
      if (datePattern.test(row[rowIdx])) {
        tuple[`${columnLabel.dbName}`] = this.changeDate(row[rowIdx]);
      } else if (row[rowIdx] !== '') {
        tuple[`${columnLabel.dbName}`] = row[rowIdx];
      }
    } else if (row[rowIdx] === null) tuple[`${columnLabel.dbName}`] = null;
  }

  async parseSpread(cols, rows, table, api42s?) {
    const tupleArray = [];

    for (const row of rows) {
      const tuple = {};
      for (let col = table['start']; col < table['end']; col++) {
        this.makeRowPerColumn(row, cols, col, tuple, table['mapCol']);
      }
      if (api42s != undefined) {
        const api42 = await this.apiService.getTupleFromApi(row[1], api42s);
        if (table['name'] === 'user_personal_information') {
          tuple['email'] = api42.email;
          tuple['phone_number'] = api42.phone_number;
        }
        if (table['name'] === 'user_blackhole') {
          tuple['blackhole_date'] = api42.blackhole_date;
        } //여기 학습데이터를 추가해야함.
        if (table['name'] === 'user_learning_data_api') {
          tuple['level'] = api42.level;
          //tuple['leveled_date'] = ''; //동환님께 여쭤보자
        } //여기 학습데이터를 추가해야함.
      }
      if (table['name'] != 'user') tuple['fk_user_no'] = row[1]; //usertable은 해당 컬럼이 필요가 없음
      tupleArray.push(tuple);
    }
    return tupleArray;
  }

  async getOldSheetLogColumns(colObj) {
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
      const datas = [];
      for (const colData of colDatas) {
        const columns = colData[0];
        const rows = (await colData).filter((value, index) => index > 0);
        this.makeAColumnInTable(columns, rows, datas, date);
      }
      await this.insertArrayToDB(UserComputationFund, datas);
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
              Object.assign(col, data);
              break;
            }
          }
          if (flag === false) {
            sheet.push(data);
          }
        }
      }
      if (colObj.table === TABLENUM.USERLEARNINGDATAAPI)
        await this.insertArrayToDB(UserLearningDataAPI, sheet);
      else if (colObj.table === TABLENUM.USERHRDNETUTILIZECONSENT)
        await this.insertArrayToDB(UserHrdNetUtilizeConsent, sheet);
    }
    return colDatas;
  }

  makeAColumnInTable(cols, rows, datas, date) {
    const pattern = /[0-9]{4}. (0?[1-9]|1[012]). (0?[1-9]|[12][0-9]|3[0-1])$/; // yyyy. mm. dd 형식인지 체크
    for (const col in cols) {
      date = cols[col];
      if (pattern.test(cols[col])) {
        for (const row in rows) {
          const payment_data = {};
          if (rows[row][col] === undefined) continue;
          payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][0].dbName] =
            this.changeDate(date); //yyyy. mm. dd -> yyyy-mm-dd
          payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][2].dbName] = Number(
            rows[row][col].replace(/\,/g, ''),
          ); //1,000,000 -> 1000000
          if (rows[row][col] != '0')
            payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][1].dbName] = 'Y';
          payment_data['fk_user_no'] = rows[row][1];
          datas.push(payment_data);
        }
      }
    }
  }

  makeColumnsInTable(cols, rows, datas, value, date, mapObj) {
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
        this.makeRowPerColumn(row, cols, col, prop, mapObj);
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

  async parseOldSpread(cols, rows, pastSheetData) {
    let tupleLine;

    for (const row of rows) {
      //학생의 수 만큼 반복
      const tuple = {};
      const mapCols = pastSheetData.columns; // 해당 시트 테이블의 컬럼들
      for (const col in cols) {
        //컬럼 수 만큼 반복
        this.makeRowPerColumn(row, cols, col, tuple, mapCols);
      }
      tuple['fk_user_no'] = row[1]; //취업정보, 고용보험 시트의 경우 변경을 해줘야함.
      tupleLine = pastSheetData['repo'].create(tuple);
      await pastSheetData['repo'].save(tupleLine);
    }
    return tupleLine;
  }

  async getOldSheetTable(pastSheetData) {
    // let colDatas;
    const spreadData = await this.sendRequestToSpreadWithGoogleAPI(
      pastSheetData.endPoint,
      pastSheetData.Id[0],
    );
    const columns = spreadData[0];
    const rows = (await spreadData).filter((value, index) => index > 0);

    //지급일 시트 정보 받아서 저장해두기 테이블 관계수정 //확장성을 고려하려 했으나, 지원금 시트(LogColumn)의 특징이 강력하여 함수를 하나 더 만들기로 결정

    await this.parseOldSpread(columns, rows, pastSheetData);
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
    if (spreadTable == '학사정보') return 'user';
    else if (spreadTable == '인적정보') return 'user_personal_information';
    else if (spreadTable == '과정연장') return 'user_course_extension';
    else if (spreadTable == '휴학') return 'user_leave_of_absence';
    else if (spreadTable == 'BLACKHOLE') return 'user_blackhole';
    else if (spreadTable == '과정중단') return 'user_interruption_of_course';
    else if (spreadTable == '학습데이터(API)') return 'user_learning_data_api';
    else if (spreadTable == '로열티 관리') return 'user_loyalty_management';
    else if (spreadTable == '취업현황') return 'user_employment_status';
    else if (spreadTable == 'HRD-Net 활용') return 'user_hrd_net_utilize';
    else if (spreadTable == '취업_기타수집_data')
      return 'user_other_employment_status';
    else if (spreadTable == '지원금 관리') return 'user_education_fund_state';
    else if (spreadTable == '지원금 산정') return 'user_computation_fund';
    else if (spreadTable == '출입카드_info')
      return 'user_access_card_information';
    else if (spreadTable == '기타정보') return 'user_other_information';
    else if (spreadTable == 'La Piscine') return 'user_lapiscine_information';
  }
}
