import {
  HttpException,
  HttpStatus,
  Injectable,
  CacheKey,
} from '@nestjs/common';
import axios from 'axios';
import { ApiService } from 'src/api/api.service';
import { CreateApiDto } from 'src/api/dto/create-api.dto';
import { Api } from 'src/api/entity/api.entity';
import {
  app_id,
  app_secret,
  SHEET_ID2,
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

  async getAllSpread(): Promise<string> {
    let jsonData;
    let tableNum = 0;
    let index = 0;

    const repoArray = [
      //메인3
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

    const apiOfRepo = [this.userLearningData];

    // eslint-disable-next-line prefer-const
    jsonData = await this.sendRequestToSpread(SPREAD_END_POINT, SHEET_ID2);

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
          repoArray[tableNum],
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

    return await 'finish';
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
    return year + '-' + month + '-' + day;
  }

  checkEnd(endpoint, endOfTable, label) {
    for (const idx in endOfTable) {
      if (Number(idx) < endpoint) continue;
      if (endOfTable[Number(idx)] === label) return 1;
    }
    return 0;
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
    let idx; //특정 테이블에 있는 컬럼인지 검사하는 색인
    let jdx = colIdx; //컬럼의 위치 튜플의 도메인 위치 맞춰주기 위한 색인
    const check = endOfTable + 1;

    for (const row of rows) {
      const tuple = {};
      jdx = colIdx; //특정 테이블의 시작에 해당하는 컬럼의 색인으로 초기화
      while (1) {
        //하나의 로우 완성
        idx = 0;
        if (
          cols[jdx] === undefined ||
          this.checkEnd(tableNum, endOfTable, cols[jdx]['label']) //테이블이 추가됨에 따라 확장성을 고려해서 추가함
        ) {
          break;
        } else if (
          row['c'][jdx] === null &&
          (idx = this.compareColumn(cols[jdx]['label'], mapObj)) !== -1
        ) {
          //tuple[`${mapObj[idx].dbName}`] = null; //셀값이 null인 경우 별도의 처리 //위의 경우 다음 걸로 패스 어차피 없으면 null을 넣음.
        } else if (
          (idx = this.compareColumn(cols[jdx]['label'], mapObj)) !== -1
        ) {
          if (cols[jdx]['type'] === 'date')
            //타입이 date인 경우 변환처리해줘야 db에 적용됨.
            tuple[`${mapObj[idx].dbName}`] = this.change_date(
              row['c'][jdx]['f'],
            );
          else if (row['c'][jdx]['v'] !== null)
            tuple[`${mapObj[idx].dbName}`] = row['c'][jdx]['v'];
          console.log(
            tuple[`${mapObj[idx].dbName}`],
            ` : ${mapObj[idx].dbName}`,
          );
        }
        jdx++;
      }
      //console.log('before intra', tuple, '111111111111');
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
      //tuple['circle'] = api42.circle;
      console.log(tuple, 'tupleeee');
      tupleLine = Repo.create(tuple);
      tupleLine['fk_user_no'] = row['c'][1]['f'];
      await Repo.save(tupleLine);
    }
    return jdx;
  }

  compareColumn(label, objs): number {
    for (const obj in objs) {
      if (label === objs[obj].spName) return Number(obj);
    }
    return -1;
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
    if (colObj.table === TABLENUM.USERCOMPUTATIONFUND) {
      const datas = [];
      for (const colData of colDatas) {
        const cols = colData.table.cols;
        const rows = colData.table.rows;
        this.makeAColumnInTable(cols, rows, datas, date);
      }
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(UserComputationFund)
        .values(datas)
        .execute();
    }
    if (colObj.table === TABLENUM.USERLEARNINGDATA) {
      const datas = [];
      for (const colData in colDatas) {
        const cols = colDatas[colData].table.cols;
        const rows = colDatas[colData].table.rows;

        if (colData === '0')
          this.makeColumnsInTable(cols, rows, datas, date, 1, 0);
        else if (colData === '1')
          this.makeColumnsInTable(cols, rows, datas, date, 3, 2);
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(UserLearningData)
          .values(datas)
          .execute();
      }
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

  makeColumnsInTable(cols, rows, datas, date, idx1, idx2) {
    //한테이블에 두개이상 컬럼을 추가하는 경우
    for (const col in cols) {
      if (cols[col]['pattern'] === 'yyyy. mm. dd') {
        for (const row in rows) {
          const inputData = {};
          if (row === '0') {
            date = rows[row]['c'][col]['f'];
            continue;
          }
          if (rows[row]['c'][col] === null) continue;
          inputData[mapObj[TABLENUM.USERLEARNINGDATA][idx1].dbName] =
            this.change_date(date);
          inputData[mapObj[TABLENUM.USERLEARNINGDATA][idx2].dbName] = Number(
            rows[row]['c'][col]['f'],
          );
          inputData['fk_user_no'] = rows[row]['c'][1]['f'];

          datas.push(inputData);
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
      let idx;
      for (const col in cols) {
        //컬럼 수 만큼 반복
        if (
          row['c'][col] === null &&
          (idx = this.compareColumn(cols[col]['label'], columns)) !== -1
        ) {
          continue;
        } else if (
          (idx = this.compareColumn(cols[col]['label'], columns)) !== -1
        ) {
          if (cols[col]['type'] === 'date')
            //타입이 date인 경우 변환처리해줘야 db에 적용됨
            tuple[`${columns[idx].dbName}`] = this.change_date(
              row['c'][col]['f'],
            );
          else if (row['c'][col]['v'] !== null) {
            //여기서 한사람이 지금껏 받은 지원금의 모든 컬럼을 넣을 것
            tuple[`${columns[idx].dbName}`] = row['c'][col]['v'];
          }
        }
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
    let colObj;
    let pastColumn;

    const pastDataRepoArray = [
      //하위2
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
    let jsonData;
    let index = 0;

    // eslint-disable-next-line prefer-const
    jsonData = await this.sendRequestToSpread(SPREAD_END_POINT, SHEET_ID2);

    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;

    index = await this.parseSpread(
      cols,
      rows,
      index,
      this.userRepository,
      mapObj[0],
      endOfTable[1],
    );
    for (const sheetIdx in pastDataOnSheet) {
      //시트의 총 장수 만큼 반복
      if (pastDataOnSheet[sheetIdx].endPoint) {
        pastDataOnSheet[sheetIdx]['repo'] = pastDataRepoArray[sheetIdx];
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
