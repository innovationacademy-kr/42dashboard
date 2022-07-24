import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import axios from 'axios';
import { ApiService } from 'src/api/api.service';
import {
  endOfTable,
  mapObj,
  pastDataOnSheet,
  TABLENUM,
} from 'src/updater/name_types/updater.name';
import { UserHrdNetUtilizeConsent } from 'src/user_job/entity/user_job.entity';
import { UserComputationFund } from 'src/user_payment/entity/user_payment.entity';
import { UserLearningDataAPI } from 'src/user_status/entity/user_status.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SpreadService {
  constructor(
    private apiService: ApiService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async sendRequestToSpread(endPoint: string, id: string) {
    let spreadData;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axios = require('axios'); //필요성 의문.. 체크 필요

    await axios({
      method: 'get',
      url: `http://spreadsheets.google.com/tq?key=${endPoint}&pub=1&gid=${id}`,
    })
      .then(function (response) {
        const rawdata = response.data;

        const temp = '/*O_o*/\ngoogle.visualization.Query.setResponse(';
        const temp2 = '';
        const temp3 = ');';

        const rawdata2 = rawdata.replace(temp, temp2);
        spreadData = rawdata2.replace(temp3, temp2);
      })
      .catch(function (err) {
        console.log(err); // 에러 처리 내용
      });

    return await spreadData;
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

    if (
      row['c'][rowIdx] !== null &&
      (columnLabel = mapObjs.find(
        this.compareSpname(cols[rowIdx]['label']),
      )) !== undefined
    ) {
      //타입이 date인 경우 변환처리해줘야 db에 적용됨.
      if (cols[rowIdx]['type'] === 'date') {
        tuple[`${columnLabel.dbName}`] = this.changeDate(row['c'][rowIdx]['f']);
      } else if (row['c'][rowIdx]['v'] !== null) {
        tuple[`${columnLabel.dbName}`] = row['c'][rowIdx]['v'];
      }
    }
  }

  async parseSpread(
    cols,
    rows,
    colIdx: number,
    Repo,
    mapObj,
    endOfTable,
    tableNum?,
    api42s?,
  ) {
    let tupleLine;
    let colRowIdx; //컬럼의 위치 튜플의 도메인 위치 맞춰주기 위한 색인
    const tupleArray = {};
    let tableIdx = 0;
    //console.log(`brefore table : ${cols[colIdx]['label']}`);
    const tableName = await this.getTableName(cols[colIdx]['label']);
    //  console.log(tableName, 'sssdfdsfsdfsdfssds');

    //console.log(`tablename: ${tableName}, taable_idx: ${tableIdx}`);
    //tupleArray[tableName] = { 1: 1, 2: 2 };
    //console.log(tupleArray, 'dd');

    //console.log(rows, 'rowss');
    for (const row of rows) {
      const tuple = {};
      colRowIdx = colIdx; //특정 테이블의 시작에 해당하는 컬럼의 색인으로 초기화
      while (
        cols[colRowIdx] !== undefined &&
        !this.checkEnd(tableNum, endOfTable, cols[colRowIdx]['label'])
      ) {
        this.makeRowPerColumn(row, cols, colRowIdx, tuple, mapObj);
        colRowIdx++;
      }
      //console.log('before intra', tuple, '111111111111');
      if (api42s != undefined) {
        const api42 = await this.apiService.getTupleFromApi(
          row['c'][1]['f'],
          api42s,
        );
        //console.log(api42);
        if (tableName === 'user_personal_information') {
          tuple['email'] = api42.email;
          tuple['phone_number'] = api42.phone_number;
        }
        if (tableName === 'user_blackhole') {
          tuple['remaining_period'] = api42.remaining_period;
          tuple['blackhole_time'] = api42.blackhole_time;
        } //여기 학습데이터를 추가해야함.
      }
      tuple['fk_user_no'] = row['c'][1]['f'];
      //      console.log(tuple, 'tupleeee');
      //    console.log(`tablename: ${tableName}`);
      tupleLine = Repo.create(tuple);
      //  console.log(tupleLine, 'lidldidl');
      await Repo.save(tupleLine);
      tupleArray[tableIdx++] = tupleLine;
    }
    //console.log(tupleArray, 'sss');
    return tupleArray;
  }

  async getOldSheetLogColumns(colObj) {
    const colDatas = [];

    let date;

    for (const idx in colObj.Id) {
      //시트의 총 장수 만큼 반복
      const jsonData = await this.sendRequestToSpread(
        colObj.endPoint,
        colObj.Id[idx],
      );
      const obj = JSON.parse(jsonData);
      colDatas.push(obj);
    }
    if (colObj.table === TABLENUM.USERCOMPUTATIONFUND) {
      // 메인시트와 동일한 형태로 저장된 경우F
      const datas = [];
      for (const colData of colDatas) {
        const cols = colData.table.cols;
        const rows = colData.table.rows;
        this.makeAColumnInTable(cols, rows, datas, date);
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
        const cols = colDatas[colData].table.cols;
        const rows = colDatas[colData].table.rows;

        this.makeColumnsInTable(
          cols,
          rows,
          datas,
          mapObj[colObj.table][Number(colData) * 2]['spName'],
          mapObj[colObj.table][Number(colData) * 2 + 1]['spName'],
          mapObj[colObj.table],
        );
        for (const data of datas) {
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
          if (flag === false) sheet.push(data);
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
    for (const col in cols) {
      if (cols[col]['pattern'] === 'yyyy. mm. dd') {
        for (const row in rows) {
          const payment_data = {};
          if (row === '0') {
            date = rows[row]['c'][col]['f'];
            continue;
          }
          if (rows[row]['c'][col] === null || rows[row]['c'][col]['v'] === null)
            continue;
          payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][0].dbName] =
            this.changeDate(date);
          payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][2].dbName] = Number(
            rows[row]['c'][col]['f'].replace(/\,/g, ''),
          );
          if (rows[row]['c'][col]['f'] != '0')
            payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][1].dbName] = 'Y';
          payment_data['fk_user_no'] = rows[row]['c'][1]['f'];
          datas.push(payment_data);
        }
      }
    }
  }

  makeColumnsInTable(cols, rows, datas, value, date, mapObj) {
    //한테이블에 두개이상 컬럼을 추가하는 경우
    let data;
    let column;
    let monthData;

    for (const col in cols) {
      if (cols[col]['label'] !== value && cols[col]['label'] !== date) continue;
      if (cols[col]['label'] === value) {
        monthData = [];
      }
      for (const row of rows) {
        const prop = {};
        this.makeRowPerColumn(row, cols, col, prop, mapObj);
        prop['fk_user_no'] = row['c'][1]['f'];
        if (cols[col]['label'] === date) {
          if (
            (data = monthData.find(this.compareFk(prop['fk_user_no']))) ===
            undefined
          ) {
            monthData.push(prop);
          } else {
            Object.assign(data, prop);
          }
        } else if (cols[col]['label'] === value) {
          monthData.push(prop);
        }
      }
      if (cols[col]['label'] === date) {
        datas.push(...monthData);
      }
    }
  }

  async parseOldSpread(cols, rows, pastSheetData) {
    let tupleLine;

    for (const row of rows) {
      //학생의 수 만큼 반복
      const tuple = {};
      const columns = pastSheetData.columns; // 해당 시트 테이블의 컬럼들
      for (const col in cols) {
        //컬럼 수 만큼 반복
        this.makeRowPerColumn(row, cols, col, tuple, columns);
      }
      tuple['fk_user_no'] = row['c'][1]['f']; //취업정보, 고용보험 시트의 경우 변경을 해줘야함.
      tupleLine = pastSheetData['repo'].create(tuple);
      await pastSheetData['repo'].save(tupleLine);
    }
    return tupleLine;
  }

  async getOldSheetTable(pastSheetData) {
    // let colDatas;
    const jsonData = await this.sendRequestToSpread(
      pastSheetData.endPoint,
      pastSheetData.Id[0],
    );
    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;

    //지급일 시트 정보 받아서 저장해두기 테이블 관계수정 //확장성을 고려하려 했으나, 지원금 시트(LogColumn)의 특징이 강력하여 함수를 하나 더 만들기로 결정

    await this.parseOldSpread(cols, rows, pastSheetData);
  }

  getTableName(spreadTable: string) {
    if (spreadTable == '학사정보 no.') return 'user';
    else if (spreadTable == '인적정보 지역') return 'user_personal_information';
    else if (spreadTable == '과정연장 기본종료일자')
      return 'user_course_extension';
    else if (spreadTable == '휴학 휴학') return 'user_leave_of_absence';
    else if (spreadTable == 'BLACKHOLE Blackholed') return 'user_blackhole';
    else if (spreadTable == '과정중단 과정중단')
      return 'user_interruption_of_course';
    else if (spreadTable == '학습데이터(API) Coalition Score')
      return 'user_learning_data_api';
    else if (spreadTable == '로열티 관리 대상기간')
      return 'user_loyalty_management';
    else if (spreadTable == '취업현황 취업현황')
      return 'user_employment_status';
    else if (spreadTable == 'HRD-Net 활용 정보제공동의')
      return 'user_hrd_net_utilize';
    else if (spreadTable == '취업_기타수집_data 취업일자')
      return 'user_other_employment_status';
    else if (spreadTable == '지원금 관리 총 지급 개월')
      return 'user_education_fund_state';
    else if (spreadTable == '지원금 산정 지급일')
      return 'user_computation_fund';
    else if (spreadTable == '출입카드_info 사진이미지파일')
      return 'user_access_card_information';
    else if (spreadTable == '기타정보 최종학력')
      return 'user_other_information';
    else if (spreadTable == 'La Piscine LaPiscine_기수')
      return 'user_lapiscine_information';
  }
}
