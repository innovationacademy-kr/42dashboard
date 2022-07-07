import {
  HttpException,
  HttpStatus,
  Injectable,
  CacheKey,
} from '@nestjs/common';
import axios from 'axios';
import { ApiService } from 'src/api/api.service';
import {
  app_id,
  app_secret,
  SHEET_ID2,
  SHEET_ID4,
  SPREAD_END_POINT,
} from 'src/config/key';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import {
  UserEmploymentAndFound,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserInternStatus,
} from 'src/user_job/entity/user_job.entity';
import { UserComputationFund } from 'src/user_payment/entity/user_computation_fund.entity';
import { UserEducationFundState } from 'src/user_payment/entity/user_education_fund_state.entity';
import {
  UserBlackhole,
  UserLapiscineInformation,
  UserLearningData,
  UserLeaveOfAbsence,
  UserProcessProgress,
  UserReasonOfBreak,
} from 'src/user_status/entity/user_status.entity';
import { Column, DataSource, Repository } from 'typeorm';
import { SingleEntryPlugin } from 'webpack';
import { find, map } from 'rxjs';
import { Cron } from '@nestjs/schedule';
import {
  apiOfTable,
  endOfTable,
  mapObj,
  pastDataOnColumn,
  pastDataOnSheet,
  TABLENUM,
} from './name_types/updater.name';

@Injectable() //총 16개의 테이블
export class UpdaterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPersonalInformation)
    private userPersonalRepository: Repository<UserPersonalInformation>,
    @InjectRepository(UserOtherInformation)
    private userOtherRepository: Repository<UserOtherInformation>,
    @InjectRepository(UserAccessCardInformation)
    private userAccessCardRepository: Repository<UserAccessCardInformation>,
    @InjectRepository(UserEmploymentAndFound)
    private userEmploymentAndFound: Repository<UserEmploymentAndFound>,
    @InjectRepository(UserInternStatus)
    private userInternStatus: Repository<UserInternStatus>,
    @InjectRepository(UserHrdNetUtilize)
    private userHrdNetUtilize: Repository<UserHrdNetUtilize>,
    @InjectRepository(UserEmploymentStatus)
    private userEmploymentStatus: Repository<UserEmploymentStatus>,
    @InjectRepository(UserComputationFund)
    private userComputationFund: Repository<UserComputationFund>,
    @InjectRepository(UserEducationFundState)
    private userEducationFundState: Repository<UserEducationFundState>,
    @InjectRepository(UserLearningData)
    private userLearningData: Repository<UserLearningData>,
    @InjectRepository(UserProcessProgress)
    private userProcessProgress: Repository<UserProcessProgress>,
    @InjectRepository(UserBlackhole)
    private userBlackhole: Repository<UserBlackhole>,
    @InjectRepository(UserLeaveOfAbsence)
    private userLeaveOfAbsence: Repository<UserLeaveOfAbsence>,
    @InjectRepository(UserReasonOfBreak)
    private userReasonOfBreak: Repository<UserReasonOfBreak>,
    @InjectRepository(UserLapiscineInformation)
    private userLapiscineInformation: Repository<UserLapiscineInformation>,
    private apiService: ApiService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  repoArray = [
    //메인, 하위
    this.userRepository,
    this.userPersonalRepository,
    this.userProcessProgress,
    this.userLeaveOfAbsence,
    this.userBlackhole,
    this.userReasonOfBreak,
    this.userOtherRepository,
    this.userLapiscineInformation,
    this.userInternStatus,
    this.userEmploymentAndFound,
    this.userEmploymentStatus,
    this.userHrdNetUtilize,
    this.userEducationFundState,
    this.userComputationFund,
    this.userAccessCardRepository,
  ];

  @Cron('00 00 00 * * *') //24시간마다 업데이트
  handleCron() {
    console.log(this.updateDataPerDay());
  }

  async updateDataPerDay() {
    let jsonData;
    let tableNum = 0;
    let index = 0;

    const apiOfRepo = [this.userLearningData];

    // eslint-disable-next-line prefer-const
    jsonData = await this.sendRequestToSpread(SPREAD_END_POINT, SHEET_ID4);

    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;
    const api42s = await this.apiService.getApi();

    //console.log(api42s, 'wht');
    //return api42s;

    for (const col in cols) {
      console.log(col, 'col', tableNum, 'table');
      if (cols[col]['label'] === endOfTable[tableNum])
        //tablle num 을 추가시키면서 label과 같은지 찾기, endoftable과 clos의 수가 같아서 가능
        index = await this.parseSpread(
          //인턴현황과 기타취업현황 추가됨.
          cols,
          rows,
          index,
          this.repoArray[tableNum],
          mapObj[tableNum],
          endOfTable,
          ++tableNum,
          api42s,
        );
      else if (
        //endOfTable에 하위시트를 대비하여 메인에 없는 시트들이 생김
        cols.find((Column) => Column.label === endOfTable[tableNum]) ===
        undefined
      )
        tableNum++;
    }
    for (const api_table in apiOfTable) {
      if (apiOfTable[api_table] == '학습데이터') {
        await this.apiService.parseApi(apiOfRepo[api_table], api42s);
      }
    }

    return await 'All data has been updated';
  }

  onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
  }

  change_date(str: string): string {
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
      if (endOfTable[Number(idx)] === label) return 1;
    }
    return false;
  }

  //테이블 별 하나의 로우 완성하는 함수
  makeLowPerColumn(row, cols, rowIdx, tuple, mapObjs) {
    let columnLabel;

    if (
      row['c'][rowIdx] !== null &&
      (columnLabel = mapObjs.find(
        this.compareSpname(cols[rowIdx]['label']),
      )) !== undefined
    ) {
      //타입이 date인 경우 변환처리해줘야 db에 적용됨.
      if (cols[rowIdx]['type'] === 'date') {
        tuple[`${columnLabel.dbName}`] = this.change_date(
          row['c'][rowIdx]['f'],
        );
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
    tableNum?, // 하위시트는 넘버가 필요없음.
    api42s?,
  ): Promise<number> {
    let tupleLine;
    let ColLowIdx; //컬럼의 위치 튜플의 도메인 위치 맞춰주기 위한 색인

    for (const row of rows) {
      const tuple = {};
      ColLowIdx = colIdx; //특정 테이블의 시작에 해당하는 컬럼의 색인으로 초기화
      while (
        cols[ColLowIdx] !== undefined &&
        !this.checkEnd(tableNum, endOfTable, cols[ColLowIdx]['label'])
      ) {
        this.makeLowPerColumn(row, cols, ColLowIdx, tuple, mapObj);
        ColLowIdx++;
      }
      //console.log('before intra', tuple, '111111111111');
      if (api42s != undefined) {
        const api42 = await this.apiService.getTupleFromApi(
          //updater name이 13개 유효하므로, 총 13번 호출됨, email, phone 같은 건 해당 테이블일 때만 컬럼에 넣어주면 될듯
          row['c'][1]['f'],
          api42s,
        );
        //console.log(api42);
        tuple['email'] = api42.email;
        tuple['phone_number'] = api42.phone_number;
        tuple['remaining_period'] = api42.remaining_period;
        tuple['blackhole_time'] = api42.blackhole_time;
      }
      //tuple['circle'] = api42.circle;
      tupleLine = Repo.create(tuple);
      tupleLine['fk_user_no'] = row['c'][1]['f'];
      await Repo.save(tupleLine);
    }
    return ColLowIdx;
  }

  compareSpname(label) {
    return (column) => column.spName === label;
  }

  compareFkCircleDate(fk, date) {
    return (data) => data.fk_user_no === fk && data.circle_date === date;
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
  async sendRequestToSpread(endPoint: string, id: string) {
    let spreadData;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axios = require('axios');

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
    const datas = [];
    for (const colData in colDatas) {
      const cols = colDatas[colData].table.cols;
      const rows = colDatas[colData].table.rows;
      if (colObj.table === TABLENUM.USERCOMPUTATIONFUND) {
        this.makeAColumnInTable(cols, rows, datas, date);
      } else if (colObj.table === TABLENUM.USERLEARNINGDATA) {
        if (colData === '0') {
          this.makeColumnsInTable(cols, rows, datas, date, 1, 0);
        } else if (colData === '1')
          this.makeColumnsInTable(cols, rows, datas, date, 3, 2);
      }
      await this.insertArrayToDB(UserLearningData, datas);
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
          if (rows[row]['c'][col] === null) continue;
          payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][2].dbName] =
            this.change_date(date);
          payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][1].dbName] = Number(
            rows[row]['c'][col]['f'].replace(/\,/g, ''),
          );
          if (rows[row]['c'][col]['f'] != '0')
            payment_data[mapObj[TABLENUM.USERCOMPUTATIONFUND][0].dbName] = 'Y';
          payment_data['fk_user_no'] = rows[row]['c'][1]['f'];
          datas.push(payment_data);
        }
      }
    }
  }

  makeColumnsInTable(cols, rows, datas, date, dateIdx, nonDateIdx) {
    //한테이블에 두개이상 컬럼을 추가하는 경우
    let data;

    for (const col in cols) {
      if (cols[col]['pattern'] === 'yyyy. mm. dd') {
        for (const row in rows) {
          const inputData = {};
          if (row === '0') {
            date = rows[row]['c'][col]['f'];
            continue;
          }
          if (rows[row]['c'][col] === null) continue;
          inputData[mapObj[TABLENUM.USERLEARNINGDATA][dateIdx].dbName] =
            this.change_date(date);
          inputData[mapObj[TABLENUM.USERLEARNINGDATA][nonDateIdx].dbName] =
            Number(rows[row]['c'][col]['f']);
          inputData['fk_user_no'] = rows[row]['c'][1]['f'];
          if (
            //fk와 기존 일자와 동일한 경우 같이 삽입 하드코딩작업
            (data = datas.find(
              this.compareFkCircleDate(
                inputData['fk_user_no'],
                inputData['level_date'],
              ),
            )) !== undefined
          ) {
            Object.assign(data, inputData);
          } else {
            datas.push(inputData);
          }
        }
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
        this.makeLowPerColumn(row, cols, col, tuple, columns);
      }
      tupleLine = await pastSheetData['repo'].create(tuple);
      tupleLine['fk_user_no'] = row['c'][1]['f']; //취업정보, 고용보험 시트의 경우 변경을 해줘야함.
      await pastSheetData['repo'].save(tupleLine);
    }
  }

  async getOldSheetTable(pastSheetData) {
    let colObj;
    // let colDatas;
    const jsonData = await this.sendRequestToSpread(
      pastSheetData.endPoint,
      pastSheetData.Id,
    );
    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;

    //지급일 시트 정보 받아서 저장해두기 테이블 관계수정 //확장성을 고려하려 했으나, 지원금 시트(LogColumn)의 특징이 강력하여 함수를 하나 더 만들기로 결정

    await this.parseOldSpread(cols, rows, pastSheetData);
  }

  async getOldData() {
    /* 지원금 관련 월별 지금액 시트 */
    //this.sendRequestToSpread();
    /* 테이블 별 과거 데이터 */
    let pastColumn;

    let jsonData;
    const index = 0;

    // eslint-disable-next-line prefer-const
    jsonData = await this.sendRequestToSpread(SPREAD_END_POINT, SHEET_ID2);

    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;

    await this.parseSpread(
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
        await this.getOldSheetTable(pastDataOnSheet[sheetIdx]);
      } else if (
        (pastColumn = pastDataOnColumn.find(
          (Column) => Column.table === pastDataOnSheet[sheetIdx].table,
        )) != undefined
      ) {
        await this.getOldSheetLogColumns(pastColumn);
      }
    }
    return await 'finish';
  }
}
